import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function callAI(systemPrompt: string, userPrompt: string, model = "google/gemini-3-flash-preview", stream = false) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream,
    }),
  });

  if (!response.ok) {
    if (response.status === 429) throw new Error("RATE_LIMITED");
    if (response.status === 402) throw new Error("CREDITS_EXHAUSTED");
    throw new Error(`AI gateway error: ${response.status}`);
  }

  if (stream) return response;

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content || "";

  // Try to parse JSON
  try {
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/) || content.match(/\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[1] || jsonMatch[0]);
  } catch { /* return raw */ }

  return content;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, data } = await req.json();

    let result: unknown;

    switch (action) {
      // ── ANTI-CHURN: Análise de risco de cancelamento ──
      case "analyze_churn": {
        const supabase = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        const { tenant_id } = data;
        const { data: leads } = await supabase.from("leads").select("*").eq("tenant_id", tenant_id).limit(100);
        const { data: services } = await supabase.from("services").select("*").eq("tenant_id", tenant_id);
        const { data: invoices } = await supabase.from("invoices").select("*").eq("tenant_id", tenant_id).order("created_at", { ascending: false }).limit(20);

        const activeServices = (services || []).filter(s => s.status === "active").length;
        const pendingInvoices = (invoices || []).filter(i => i.status === "pending" || i.status === "overdue").length;
        const totalLeads = (leads || []).length;
        const coldLeads = (leads || []).filter(l => (l.score || 0) < 30).length;

        let churnScore = 0;
        const reasons: string[] = [];
        if (activeServices === 0) { churnScore += 30; reasons.push("Nenhum serviço ativo"); }
        if (pendingInvoices > 2) { churnScore += 25; reasons.push(`${pendingInvoices} faturas pendentes`); }
        if (totalLeads === 0) { churnScore += 20; reasons.push("Nenhum lead gerado"); }
        if (coldLeads > totalLeads * 0.7) { churnScore += 15; reasons.push("Maioria dos leads frios"); }

        const riskLevel = churnScore >= 70 ? "critical" : churnScore >= 50 ? "high" : churnScore >= 30 ? "medium" : "low";

        const retentionPlan = await callAI(
          `Você é um especialista em customer success e retenção de clientes SaaS. Gere um plano de retenção personalizado.
Retorne JSON: {"actions": [{"type":"email|call|discount|feature", "description":"...", "priority":"high|medium|low"}], "message":"mensagem personalizada para o cliente", "discount_suggestion": number}`,
          `Score de churn: ${churnScore}/100\nNível: ${riskLevel}\nMotivos: ${reasons.join("; ")}\nServiços ativos: ${activeServices}\nLeads: ${totalLeads}\nFaturas pendentes: ${pendingInvoices}`,
          "google/gemini-2.5-flash-lite"
        );

        // Save insight
        await supabase.from("dominus_insights").insert({
          tenant_id,
          title: `Risco de Churn: ${riskLevel}`,
          description: reasons.join("; "),
          category: "risk",
          impact_value: churnScore,
          priority: riskLevel === "critical" ? "high" : riskLevel === "high" ? "high" : "medium",
          status: "new",
        });

        result = { churnScore, riskLevel, reasons, retentionPlan };
        break;
      }

      // ── COMPETITOR MONITOR: Análise de concorrentes ──
      case "monitor_competitors": {
        const { competitors } = data; // [{name, url}]
        const alerts: unknown[] = [];

        for (const comp of (competitors || []).slice(0, 5)) {
          try {
            const res = await fetch(comp.url, {
              headers: { "User-Agent": "Mozilla/5.0 (compatible; MaestroBot/1.0)" },
              signal: AbortSignal.timeout(10000),
            });
            const html = await res.text();
            const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 6000);

            const analysis = await callAI(
              `Analista de inteligência competitiva. Analise o conteúdo e identifique mudanças relevantes.
Retorne JSON array: [{"changeType":"pricing|feature|messaging|product","description":"...","impact":"low|medium|high","recommendation":"..."}]`,
              `Concorrente: ${comp.name}\nURL: ${comp.url}\nConteúdo:\n${text}`,
              "google/gemini-2.5-flash-lite"
            );

            if (Array.isArray(analysis)) {
              for (const a of analysis) alerts.push({ ...a, competitor: comp.name, url: comp.url });
            }
          } catch { /* skip failed competitor */ }
        }

        result = { alerts, analyzed: competitors?.length || 0 };
        break;
      }

      // ── ORCHESTRATOR: Pipeline de agentes IA ──
      case "run_pipeline": {
        const { goal, agents: agentConfigs } = data;

        const AGENT_PROMPTS: Record<string, string> = {
          researcher: "Você é um pesquisador especialista. Busque informações relevantes, fatos verificados e dados concretos. Organize de forma estruturada.",
          analyst: "Você é um analista de negócios sênior. Extraia insights acionáveis, identifique padrões, riscos e oportunidades.",
          writer: "Você é um redator profissional. Transforme pesquisas e análises em conteúdo claro, persuasivo e bem estruturado.",
          coder: "Você é um engenheiro de software sênior em TypeScript/React. Escreva código limpo, tipado e testável.",
          reviewer: "Você é um revisor de qualidade sênior. Avalie criticamente o output: erros, melhorias, e dê nota 1-10.",
          sales: "Você é um especialista em vendas B2B. Identifique dores, crie abordagens persuasivas e sugira próximos passos.",
          predictor: "Você é um especialista em análise preditiva. Identifique tendências, preveja comportamentos e sugira ações preventivas.",
        };

        const steps: unknown[] = [];
        let context = `Objetivo: ${goal}`;

        for (const agent of (agentConfigs || []).slice(0, 5)) {
          const role = agent.role || "researcher";
          const systemPrompt = agent.systemPrompt || AGENT_PROMPTS[role] || AGENT_PROMPTS.researcher;
          const startTime = Date.now();

          try {
            const output = await callAI(
              systemPrompt + "\nResponda em português brasileiro.",
              steps.length === 0 ? goal : `${context}\n\nSua tarefa como ${agent.name || role}: processe o trabalho anterior e contribua.`,
              "google/gemini-2.5-flash"
            );

            const outputStr = typeof output === "string" ? output : JSON.stringify(output);
            context += `\n\n[${role}]: ${outputStr.slice(0, 2000)}`;
            steps.push({
              agent: agent.name || role, role, status: "completed",
              output: outputStr, durationMs: Date.now() - startTime,
            });
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Unknown";
            steps.push({
              agent: agent.name || role, role, status: "failed",
              error: message, durationMs: Date.now() - startTime,
            });
          }
        }

        const lastSuccess = [...steps].reverse().find((s: any) => s.status === "completed") as any;
        result = { steps, finalOutput: lastSuccess?.output || "Pipeline falhou", status: steps.every((s: any) => s.status === "completed") ? "completed" : "partial" };
        break;
      }

      // ── CONTENT VIRAL: Gerador de conteúdo ──
      case "generate_viral_content": {
        const { niche, platform, days } = data;
        result = await callAI(
          `Especialista em marketing de conteúdo viral para ${platform || "instagram"}.
Crie um calendário de conteúdo para ${days || 7} dias. Retorne JSON array:
[{"day":1,"type":"educational|story|poll|tip|behind_scenes|testimonial|trending","caption":"texto completo","hashtags":["h1","h2"],"imagePrompt":"prompt para gerar imagem"}]
Varie os tipos. Use ganchos poderosos. CTAs claros. Adapte para o nicho: ${niche}`,
          `Crie ${days || 7} dias de conteúdo viral para ${platform || "instagram"} no nicho: ${niche}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ── CONTRACT ANALYZER: Análise jurídica ──
      case "analyze_contract": {
        const { contractText } = data;
        result = await callAI(
          `Advogado especializado em contratos empresariais brasileiros.
Retorne JSON: {"riskLevel":"low|medium|high","risks":[{"clause":"trecho","risk":"descrição","recommendation":"o que mudar"}],"summary":"resumo em 3 frases","missingClauses":["cláusula ausente 1"]}
Foque em: multas excessivas, foro desfavorável, exclusividade abusiva, LGPD.
DISCLAIMER: análise preliminar, não substitui advogado.`,
          `Analise este contrato:\n\n${(contractText || "").slice(0, 15000)}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ── SEO STRATEGY: Estratégia SEO completa ──
      case "generate_seo_strategy": {
        const { domain, niche, targetAudience } = data;
        result = await callAI(
          `Especialista em SEO e marketing de conteúdo.
Retorne JSON: {"keywords":[{"term":"...","volume":"alto|médio|baixo","difficulty":"fácil|médio|difícil","intent":"informacional|transacional"}],"contentPlan":[{"title":"...","keyword":"...","outline":["H2 1","H2 2"]}],"technicalFixes":["correção 1"]}`,
          `Domínio: ${domain}\nNicho: ${niche}\nAudiência: ${targetAudience}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ── ECOMMERCE OPTIMIZER: Otimização de listings ──
      case "optimize_listing": {
        const { productName, rawDescription, category } = data;
        result = await callAI(
          `Especialista em copywriting para e-commerce brasileiro.
Retorne JSON: {"title":"título otimizado máx 80 chars","description":"descrição persuasiva","bulletPoints":["benefício 1","benefício 2","benefício 3","benefício 4","benefício 5"],"keywords":["k1","k2","k3"],"metaDescription":"meta description 160 chars"}`,
          `Produto: ${productName}\nCategoria: ${category}\nDescrição atual: ${rawDescription}`,
          "google/gemini-2.5-flash-lite"
        );
        break;
      }

      // ── HR SCREENING: Triagem de candidatos ──
      case "screen_candidate": {
        const { jobDescription, resumeText } = data;
        result = await callAI(
          `Especialista em recrutamento e seleção.
Retorne JSON: {"score":0-100,"strengths":["ponto forte"],"gaps":["lacuna"],"questions":["pergunta de entrevista"],"recommendation":"aprovado|reprovado|segunda_fase"}`,
          `Vaga: ${jobDescription}\n\nCurrículo: ${resumeText}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ── SUPPORT AGENT: Suporte 24/7 ──
      case "handle_support": {
        const { message, knowledgeBase, history } = data;
        const kb = (knowledgeBase || []).slice(0, 10).join("\n\n---\n\n");
        result = await callAI(
          `Agente de suporte ao cliente especializado.
Base de conhecimento:\n${kb}
Retorne JSON: {"response":"resposta completa","confidence":0.0-1.0,"escalate":true/false,"category":"billing|technical|general|complaint|refund"}
Se confidence < 0.6, defina escalate = true.`,
          `Histórico: ${JSON.stringify((history || []).slice(-5))}\n\nMensagem: ${message}`,
          "google/gemini-2.5-flash-lite"
        );
        break;
      }

      // ── SPREADSHEET AI: Automação de planilhas ──
      case "generate_formulas": {
        const { description, headers, sampleData } = data;
        result = await callAI(
          `Especialista em planilhas Google Sheets e Excel.
Retorne JSON: {"formulas":[{"cell":"C1","formula":"=FORMULA()","explanation":"explicação"}],"summary":"o que fazem em conjunto"}`,
          `Pedido: ${description}\nColunas: ${(headers || []).join(", ")}\nAmostra: ${JSON.stringify((sampleData || []).slice(0, 3))}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ── MARKET PREDICTION: Previsão de mercado ──
      case "predict_market": {
        const { niche: mNiche, currentData } = data;
        result = await callAI(
          `Especialista em análise preditiva de mercado digital.
Retorne JSON: {"predictions":[{"trend":"...","probability":"alta|média|baixa","timeframe":"curto|médio|longo","impact":"...","action":"..."}],"opportunities":[{"title":"...","score":0-100,"description":"..."}],"risks":[{"title":"...","severity":"high|medium|low","mitigation":"..."}]}`,
          `Nicho: ${mNiche}\nDados atuais: ${JSON.stringify(currentData || {})}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ── DIGITAL CLONE: Clone pessoal ──
      case "build_clone": {
        const { samples, userName } = data;
        result = await callAI(
          `Especialista em análise de padrões de comunicação.
Analise as amostras e crie um perfil detalhado do estilo único desta pessoa:
- Tom de voz (formal/informal/direto/detalhado)
- Vocabulário favorito e expressões recorrentes
- Estrutura de raciocínio
- Padrões emocionais
Retorne JSON: {"clonePrompt":"system prompt completo para clonar este estilo","personality":{"tone":"...","vocabulary":["palavras frequentes"],"decisionStyle":"...","emotionalPatterns":"..."}}`,
          `Nome: ${userName}\nAmostras do usuário:\n\n${(samples || []).join("\n\n---\n\n")}`,
          "google/gemini-2.5-pro"
        );
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";

    if (message === "RATE_LIMITED") {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again later." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (message === "CREDITS_EXHAUSTED") {
      return new Response(JSON.stringify({ error: "Credits exhausted. Please add funds." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.error("maestro-ai error:", e);
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
