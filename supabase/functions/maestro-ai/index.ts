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
      // ── ANTI-CHURN ──
      case "analyze_churn": {
        const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
        const { tenant_id } = data;
        const { data: leads } = await supabase.from("leads").select("*").eq("tenant_id", tenant_id).limit(100);
        const { data: services } = await supabase.from("services").select("*").eq("tenant_id", tenant_id);
        const { data: invoices } = await supabase.from("invoices").select("*").eq("tenant_id", tenant_id).order("created_at", { ascending: false }).limit(20);

        const activeServices = (services || []).filter((s: { status: string }) => s.status === "active").length;
        const pendingInvoices = (invoices || []).filter((i: { status: string }) => i.status === "pending" || i.status === "overdue").length;
        const totalLeads = (leads || []).length;
        const coldLeads = (leads || []).filter((l: { score?: number }) => (l.score || 0) < 30).length;

        let churnScore = 0;
        const reasons: string[] = [];
        if (activeServices === 0) { churnScore += 30; reasons.push("Nenhum serviço ativo"); }
        if (pendingInvoices > 2) { churnScore += 25; reasons.push(`${pendingInvoices} faturas pendentes`); }
        if (totalLeads === 0) { churnScore += 20; reasons.push("Nenhum lead gerado"); }
        if (coldLeads > totalLeads * 0.7) { churnScore += 15; reasons.push("Maioria dos leads frios"); }

        const riskLevel = churnScore >= 70 ? "critical" : churnScore >= 50 ? "high" : churnScore >= 30 ? "medium" : "low";

        const retentionPlan = await callAI(
          `Especialista em customer success e retenção SaaS. Gere plano de retenção personalizado.
Retorne JSON: {"actions": [{"type":"email|call|discount|feature","description":"...","priority":"high|medium|low"}], "message":"mensagem personalizada", "discount_suggestion": number}`,
          `Score: ${churnScore}/100 | Nível: ${riskLevel} | Motivos: ${reasons.join("; ")} | Serviços ativos: ${activeServices} | Leads: ${totalLeads} | Faturas pendentes: ${pendingInvoices}`,
          "google/gemini-2.5-flash-lite"
        );

        await supabase.from("dominus_insights").insert({
          tenant_id, title: `Risco de Churn: ${riskLevel}`, description: reasons.join("; "),
          category: "risk", impact_value: churnScore, priority: riskLevel === "critical" || riskLevel === "high" ? "high" : "medium", status: "new",
        });

        result = { churnScore, riskLevel, reasons, retentionPlan };
        break;
      }

      // ── COMPETITOR MONITOR ──
      case "monitor_competitors": {
        const { competitors } = data;
        const alerts: unknown[] = [];
        for (const comp of (competitors || []).slice(0, 5)) {
          try {
            const res = await fetch(comp.url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; MaestroBot/1.0)" }, signal: AbortSignal.timeout(10000) });
            const html = await res.text();
            const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 6000);
            const analysis = await callAI(
              `Analista de inteligência competitiva. Retorne JSON array: [{"changeType":"pricing|feature|messaging|product","description":"...","impact":"low|medium|high","recommendation":"..."}]`,
              `Concorrente: ${comp.name}\nURL: ${comp.url}\nConteúdo:\n${text}`, "google/gemini-2.5-flash-lite"
            );
            if (Array.isArray(analysis)) for (const a of analysis) alerts.push({ ...a, competitor: comp.name, url: comp.url });
          } catch { /* skip */ }
        }
        result = { alerts, analyzed: competitors?.length || 0 };
        break;
      }

      // ── ORCHESTRATOR PIPELINE ──
      case "run_pipeline": {
        const { goal, agents: agentConfigs } = data;
        const AGENT_PROMPTS: Record<string, string> = {
          researcher: "Pesquisador especialista. Busque informações relevantes, fatos e dados concretos.",
          analyst: "Analista de negócios sênior. Extraia insights acionáveis, identifique padrões e oportunidades.",
          writer: "Redator profissional. Transforme análises em conteúdo claro e persuasivo.",
          coder: "Engenheiro de software sênior TypeScript/React. Código limpo e tipado.",
          reviewer: "Revisor de qualidade. Avalie criticamente o output e dê nota 1-10.",
          sales: "Especialista em vendas B2B. Abordagens persuasivas e próximos passos.",
          predictor: "Especialista em análise preditiva. Tendências, previsões e ações preventivas.",
        };
        const steps: unknown[] = [];
        let context = `Objetivo: ${goal}`;
        for (const agent of (agentConfigs || []).slice(0, 5)) {
          const role = agent.role || "researcher";
          const systemPrompt = agent.systemPrompt || AGENT_PROMPTS[role] || AGENT_PROMPTS.researcher;
          const startTime = Date.now();
          try {
            const output = await callAI(systemPrompt + "\nResponda em português brasileiro.", steps.length === 0 ? goal : `${context}\n\nSua tarefa como ${agent.name || role}: processe o trabalho anterior e contribua.`, "google/gemini-2.5-flash");
            const outputStr = typeof output === "string" ? output : JSON.stringify(output);
            context += `\n\n[${role}]: ${outputStr.slice(0, 2000)}`;
            steps.push({ agent: agent.name || role, role, status: "completed", output: outputStr, durationMs: Date.now() - startTime });
          } catch (err: unknown) {
            steps.push({ agent: agent.name || role, role, status: "failed", error: err instanceof Error ? err.message : "Unknown", durationMs: Date.now() - startTime });
          }
        }
        const lastSuccess = [...steps].reverse().find((s: any) => s.status === "completed") as any;
        result = { steps, finalOutput: lastSuccess?.output || "Pipeline falhou", status: steps.every((s: any) => s.status === "completed") ? "completed" : "partial" };
        break;
      }

      // ── COPY MASTER ──
      case "generate_copy": {
        const { clientDescription, businessType, targetAudience, platform, copyType, objective, scrapedContent } = data;
        const urlContext = scrapedContent ? `\nCONTEÚDO DO NEGÓCIO:\n${scrapedContent.slice(0, 6000)}` : "";
        result = await callAI(
          `Você é o melhor copywriter do Brasil. Domina neurociência da persuasão, gatilhos mentais, storytelling.
Retorne JSON: {"headline":"headline que para o scroll","subheadline":"...","hook":"gancho 3 linhas","body":"corpo completo","cta":"chamada para ação","variations":[{"type":"curta","content":"3 linhas"},{"type":"media","content":"8 linhas"},{"type":"longa","content":"completa"}],"hooks_alternativos":["g1","g2","g3"],"gatilhos_usados":["urgência","prova social"],"score_estimado":92,"sugestoes_visual":"criativo ideal","hashtags":["h1","h2"],"emojis_recomendados":"🔥💪✅"}`,
          `CLIENTE: ${clientDescription}\nTIPO: ${businessType}\nPÚBLICO: ${targetAudience}\nPLATAFORMA: ${platform}\nTIPO COPY: ${copyType}\nOBJETIVO: ${objective}${urlContext}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ── ANALYZE BUSINESS URL ──
      case "analyze_business": {
        const { url } = data;
        let content = "";
        try {
          const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; MaestroBot/1.0)" }, signal: AbortSignal.timeout(10000) });
          const html = await res.text();
          content = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 8000);
        } catch { content = `URL: ${url} (não acessível)`; }
        result = await callAI(
          `Especialista em análise de negócios e marketing digital. Retorne JSON: {"businessName":"","businessType":"","mainProducts":[],"targetAudience":"","valueProposition":"","painPoints":[],"differentials":[],"tone":"","keywords":[],"opportunities":[]}`,
          `Analise: ${content}`, "google/gemini-2.5-flash-lite"
        );
        break;
      }

      // ── AUTOMATION FLOW GENERATOR ──
      case "generate_automation": {
        const { clientDescription, objective, platforms } = data;
        result = await callAI(
          `Especialista em automações de marketing: n8n, Make, WhatsApp Business API, Meta Lead Ads.
Retorne JSON: {"name":"","description":"","recommended_tool":"n8n|make","trigger":{"type":"lead_form|webhook|schedule","description":"","platform":""},"nodes":[{"id":"1","type":"trigger|action|condition|delay|email|whatsapp","name":"","description":"","config":{}}],"edges":[{"from":"1","to":"2","label":"sim|não|sempre"}],"lead_scoring":{"fields_to_capture":[],"scoring_rules":[]},"follow_up_sequence":[{"day":0,"channel":"whatsapp","message":""},{"day":1,"channel":"email","message":""}],"expected_results":{"lead_capture_rate":"","conversion_rate":"","automation_roi":""}}`,
          `NEGÓCIO: ${clientDescription}\nOBJETIVO: ${objective}\nPLATAFORMAS: ${(platforms || []).join(", ")}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ── GMB OPTIMIZER ──
      case "optimize_gmb": {
        const { businessName, category, location, websiteUrl } = data;
        let content = "";
        if (websiteUrl) {
          try {
            const res = await fetch(websiteUrl, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(8000) });
            content = (await res.text()).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 5000);
          } catch { /* skip */ }
        }
        result = await callAI(
          `Maior especialista em Google Meu Negócio (Google Business Profile) do Brasil. SEO local, ranking Maps.
Retorne JSON: {"business_name_optimized":"","category_primary":"","categories_secondary":[],"description_750":"com keywords estratégicas","short_description":"250 chars","keywords_strategy":[],"services":[{"name":"","description":""}],"posts_calendar":[{"week":1,"posts":[{"type":"offer","content":"","cta":"Saiba Mais"}]}],"review_strategy":{"how_to_ask":"","response_template_positive":"","response_template_negative":"","target_reviews_month":10},"seo_local_tips":[],"checklist":[{"task":"","priority":"crítica","impact":"alto"}]}`,
          `NEGÓCIO: ${businessName}\nCATEGORIA: ${category}\nLOCAL: ${location || "N/A"}\n${content ? `SITE:\n${content}` : ""}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ── AFFILIATE STRATEGY ──
      case "generate_affiliate_strategy": {
        const { productName, productDescription, role, price, platforms: affPlatforms, commissionRate } = data;
        result = await callAI(
          `Especialista em marketing de afiliados: Hotmart, Eduzz, Kiwify, tráfego pago, Instagram, YouTube.
Retorne JSON: {"product_analysis":{"strengths":[],"weaknesses":[],"target_audience_detailed":"","best_platforms":[],"conversion_estimate":""},"traffic_strategy":{"paid":{"recommended_platforms":[],"daily_budget_recommended":50,"campaign_types":[],"targeting_strategy":""},"organic":{"instagram":{"post_frequency":"","content_types":[]}}},"copies":{"headline_principal":"","copy_anuncio_curta":"125 chars","copy_whatsapp":"","copy_email_sequencia":[{"day":0,"subject":"","body":""}]},"optimization_rules":[{"condition":"CPL>R$X","action":"pausar e testar novo criativo"}],"budget_plan":{"minimum_test":150,"recommended_monthly":1500},"projections":{"conservative":{"monthly_sales":10,"revenue":0,"roas":2},"moderate":{"monthly_sales":30,"revenue":0,"roas":3.5},"optimistic":{"monthly_sales":80,"revenue":0,"roas":6}},"action_plan_30_days":[{"week":1,"focus":"estruturar","tasks":[]}]}`,
          `PRODUTO: ${productName}\nDESCRIÇÃO: ${productDescription}\nPAPEL: ${role === "producer" ? "PRODUTOR" : "AFILIADO"}\nPREÇO: R$${price}\nCOMISSÃO: ${commissionRate || "a definir"}%\nPLATAFORMAS: ${(affPlatforms || []).join(", ")}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ── CAMPAIGN ANALYZER ──
      case "analyze_campaign": {
        const { campaignName, platform, objective, metrics, budget, targetRoas } = data;
        const m = metrics || {};
        const ctr = (m.clicks || 0) / (m.impressions || 1) * 100;
        const cpc = (m.spent || 0) / (m.clicks || 1);
        const cpl = (m.spent || 0) / (m.leads || 1);
        const roas = (m.revenue || 0) / (m.spent || 1);
        result = await callAI(
          `Especialista em tráfego pago (Meta Ads, Google Ads, TikTok Ads). Análise de campanhas e otimização.
Retorne JSON: {"performance_score":75,"status":"bom|otimizar|pausar|escalar","analysis":"análise detalhada","alerts":[{"type":"warning|critical|success","message":""}],"recommendations":[{"priority":"alta|média|baixa","action":"","reason":"","expected_impact":"","implement_now":true}],"bid_strategy":"","audience_insights":"","creative_feedback":"","next_actions":["ação 1","ação 2"],"projection_30d":{"if_no_change":"","if_optimized":"","potential_roas":4.5}}`,
          `CAMPANHA: ${campaignName}\nPLATAFORMA: ${platform}\nOBJETIVO: ${objective}\nGasto: R$${(m.spent || 0).toFixed(2)} | Impressões: ${m.impressions || 0} | Cliques: ${m.clicks || 0} | CTR: ${ctr.toFixed(2)}% | CPC: R$${cpc.toFixed(2)} | Conversões: ${m.conversions || 0} | Leads: ${m.leads || 0} | CPL: R$${cpl.toFixed(2)} | Receita: R$${(m.revenue || 0).toFixed(2)} | ROAS: ${roas.toFixed(2)}x\nBUDGET: R$${budget || 0}\nMETA ROAS: ${targetRoas || "N/A"}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ── GOVERNANCE ANALYSIS ──
      case "run_governance": {
        const { totalClients, activeClients, totalBudget, totalSpent, activeCampaigns, totalLeads, totalConversions, alertsCount, moduleStatus } = data;
        result = await callAI(
          `Sistema de governança do Maestro. Diagnóstico executivo com recomendações estratégicas.
Retorne JSON: {"health_score":85,"status":"excelente|bom|atenção|crítico","executive_summary":"resumo 3 linhas","modules_health":[{"module":"Tráfego","status":"verde|amarelo|vermelho","note":""}],"top_alerts":["alerta 1"],"strategic_actions":[{"priority":1,"action":"","impact":"alto|médio|baixo"}],"opportunities":["oportunidade 1"],"kpis_summary":{"overall_roas":0,"avg_cpl":0,"conversion_rate":0,"budget_efficiency":""}}`,
          `PROGRAMA:\n- Clientes total: ${totalClients}\n- Ativos: ${activeClients}\n- Budget: R$${(totalBudget || 0).toFixed(2)}\n- Investido: R$${(totalSpent || 0).toFixed(2)}\n- Campanhas: ${activeCampaigns || 0}\n- Leads: ${totalLeads || 0}\n- Conversões: ${totalConversions || 0}\n- Alertas: ${alertsCount || 0}\n- Módulos: ${JSON.stringify(moduleStatus || {})}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ── CREATIVE INTELLIGENCE SCORE ──
      case "score_creative": {
        const { creative, niche, topPerformers } = data;
        result = await callAI(
          `Especialista em análise preditiva de criativos para tráfego pago. Retorne APENAS JSON: {"score":0-100,"strengths":["ponto forte"],"weaknesses":["fraqueza"],"improvements":["melhoria específica"],"predictedCTR":"1.2%-1.8%"}`,
          `Criativo: ${JSON.stringify(creative)}\nNicho: ${niche}\nTop performers: ${(topPerformers || []).slice(0, 3).join(" | ")}`,
          "google/gemini-2.5-flash-lite"
        );
        break;
      }

      // ── AUTO-REPORT GENERATOR ──
      case "generate_report": {
        const { clientName, period, reportData } = data;
        const d = reportData || {};
        const roas = (d.spend || 0) > 0 ? ((d.revenue || 0) / d.spend).toFixed(1) : "0";
        result = await callAI(
          `Especialista em relatórios de marketing digital. Relatórios profissionais focados em resultados.
Retorne JSON: {"executiveSummary":"resumo executivo 2 parágrafos","highlights":["destaque 1","destaque 2","destaque 3"],"analysis":"análise detalhada 3 parágrafos","nextActions":["ação 1","ação 2","ação 3"],"forecast":"previsão próximo mês","kpis":{"leads":0,"conversions":0,"roas":"","cpl":"","bestChannel":"","bestCopy":""}}`,
          `Cliente: ${clientName}\nPeríodo: ${period}\nCampanhas: ${d.campaigns || 0}\nLeads: ${d.leads || 0}\nConversões: ${d.conversions || 0}\nReceita: R$${d.revenue || 0}\nInvestimento: R$${d.spend || 0}\nROAS: ${roas}x\nMelhor Copy: "${d.topCopy || "N/A"}"\nAutomações Ativas: ${d.automationsActive || 0}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ── CONTENT VIRAL ──
      case "generate_viral_content": {
        const { niche, platform, days } = data;
        result = await callAI(
          `Especialista em marketing de conteúdo viral para ${platform || "instagram"}.
Retorne JSON array: [{"day":1,"type":"educational|story|poll|tip|behind_scenes|testimonial|trending","caption":"texto completo","hashtags":["h1","h2"],"imagePrompt":"prompt para gerar imagem"}]`,
          `Crie ${days || 7} dias de conteúdo viral para ${platform || "instagram"} no nicho: ${niche}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ── CONTRACT ANALYZER ──
      case "analyze_contract": {
        const { contractText } = data;
        result = await callAI(
          `Advogado especializado em contratos empresariais brasileiros.
Retorne JSON: {"riskLevel":"low|medium|high","risks":[{"clause":"trecho","risk":"descrição","recommendation":"o que mudar"}],"summary":"resumo 3 frases","missingClauses":["cláusula ausente"]}
DISCLAIMER: análise preliminar, não substitui advogado.`,
          `Analise:\n\n${(contractText || "").slice(0, 15000)}`, "google/gemini-2.5-flash"
        );
        break;
      }

      // ── SEO STRATEGY ──
      case "generate_seo_strategy": {
        const { domain, niche, targetAudience } = data;
        result = await callAI(
          `Especialista em SEO. Retorne JSON: {"keywords":[{"term":"...","volume":"alto|médio|baixo","difficulty":"fácil|médio|difícil","intent":"informacional|transacional"}],"contentPlan":[{"title":"...","keyword":"...","outline":["H2 1","H2 2"]}],"technicalFixes":["correção 1"]}`,
          `Domínio: ${domain}\nNicho: ${niche}\nAudiência: ${targetAudience}`, "google/gemini-2.5-flash"
        );
        break;
      }

      // ── E-COMMERCE OPTIMIZER ──
      case "optimize_listing": {
        const { productName, rawDescription, category } = data;
        result = await callAI(
          `Especialista em copywriting e-commerce. Retorne JSON: {"title":"título otimizado 80 chars","description":"descrição persuasiva","bulletPoints":["b1","b2","b3","b4","b5"],"keywords":["k1","k2","k3"],"metaDescription":"160 chars"}`,
          `Produto: ${productName}\nCategoria: ${category}\nDescrição atual: ${rawDescription}`, "google/gemini-2.5-flash-lite"
        );
        break;
      }

      // ── HR SCREENING ──
      case "screen_candidate": {
        const { jobDescription, resumeText } = data;
        result = await callAI(
          `Especialista em recrutamento. Retorne JSON: {"score":0-100,"strengths":["ponto forte"],"gaps":["lacuna"],"questions":["pergunta entrevista"],"recommendation":"aprovado|reprovado|segunda_fase"}`,
          `Vaga: ${jobDescription}\nCurrículo: ${resumeText}`, "google/gemini-2.5-flash"
        );
        break;
      }

      // ── SUPPORT AGENT ──
      case "handle_support": {
        const { message, knowledgeBase, history } = data;
        const kb = (knowledgeBase || []).slice(0, 10).join("\n\n---\n\n");
        result = await callAI(
          `Agente de suporte especializado. Base de conhecimento:\n${kb}\nRetorne JSON: {"response":"resposta completa","confidence":0.0-1.0,"escalate":true/false,"category":"billing|technical|general|complaint|refund"}`,
          `Histórico: ${JSON.stringify((history || []).slice(-5))}\nMensagem: ${message}`, "google/gemini-2.5-flash-lite"
        );
        break;
      }

      // ── SPREADSHEET AI ──
      case "generate_formulas": {
        const { description, headers, sampleData } = data;
        result = await callAI(
          `Especialista em planilhas Google Sheets e Excel. Retorne JSON: {"formulas":[{"cell":"C1","formula":"=FORMULA()","explanation":"explicação"}],"summary":"o que fazem em conjunto"}`,
          `Pedido: ${description}\nColunas: ${(headers || []).join(", ")}\nAmostra: ${JSON.stringify((sampleData || []).slice(0, 3))}`, "google/gemini-2.5-flash"
        );
        break;
      }

      // ── MARKET PREDICTION ──
      case "predict_market": {
        const { niche: mNiche, currentData } = data;
        result = await callAI(
          `Especialista em análise preditiva de mercado digital. Retorne JSON: {"predictions":[{"trend":"...","probability":"alta|média|baixa","timeframe":"curto|médio|longo","impact":"...","action":"..."}],"opportunities":[{"title":"...","score":0-100,"description":"..."}],"risks":[{"title":"...","severity":"high|medium|low","mitigation":"..."}]}`,
          `Nicho: ${mNiche}\nDados: ${JSON.stringify(currentData || {})}`, "google/gemini-2.5-flash"
        );
        break;
      }

      // ── DIGITAL CLONE ──
      case "build_clone": {
        const { samples, userName } = data;
        result = await callAI(
          `Especialista em análise de padrões de comunicação. Retorne JSON: {"clonePrompt":"system prompt completo para clonar estilo","personality":{"tone":"...","vocabulary":["palavras frequentes"],"decisionStyle":"...","emotionalPatterns":"..."}}`,
          `Nome: ${userName}\nAmostras:\n\n${(samples || []).join("\n\n---\n\n")}`, "google/gemini-2.5-pro"
        );
        break;
      }

      // ── VOICE COMMAND ──
      case "voice_command": {
        const { text } = data;
        result = await callAI(
          `Você é o Maestro, assistente de voz para gestão de marketing digital. Responda de forma concisa e direta (máximo 3 frases). Foque em ações práticas. Se o usuário pedir dados, forneça números resumidos. Se pedir ação, confirme e descreva o próximo passo.`,
          text, "google/gemini-2.5-flash-lite"
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
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (message === "CREDITS_EXHAUSTED") {
      return new Response(JSON.stringify({ error: "Credits exhausted. Please add funds." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    console.error("maestro-ai error:", e);
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
