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

async function scrapeUrl(url: string, maxChars = 8000): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; MaestroBot/1.0)" },
      signal: AbortSignal.timeout(10000),
    });
    const html = await res.text();
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, maxChars);
  } catch {
    return `URL: ${url} (não acessível)`;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, data } = await req.json();
    let result: unknown;

    switch (action) {
      // ══════════════════════════════════════════════
      // ── ANTI-CHURN AI (Enhanced) ──
      // ══════════════════════════════════════════════
      case "analyze_churn": {
        const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
        const { tenant_id } = data;
        const [leadsRes, servicesRes, invoicesRes, automationsRes] = await Promise.all([
          supabase.from("leads").select("*").eq("tenant_id", tenant_id).limit(100),
          supabase.from("services").select("*").eq("tenant_id", tenant_id),
          supabase.from("invoices").select("*").eq("tenant_id", tenant_id).order("created_at", { ascending: false }).limit(20),
          supabase.from("automations").select("*").eq("tenant_id", tenant_id),
        ]);

        const leads = leadsRes.data || [];
        const services = servicesRes.data || [];
        const invoices = invoicesRes.data || [];
        const automations = automationsRes.data || [];

        const activeServices = services.filter((s: { status: string }) => s.status === "active").length;
        const pendingInvoices = invoices.filter((i: { status: string }) => i.status === "pending" || i.status === "overdue").length;
        const totalLeads = leads.length;
        const coldLeads = leads.filter((l: { score?: number }) => (l.score || 0) < 30).length;
        const activeAutomations = automations.filter((a: { status?: string }) => a.status === "active").length;

        let churnScore = 0;
        const reasons: string[] = [];
        if (activeServices === 0) { churnScore += 30; reasons.push("Nenhum serviço ativo"); }
        if (pendingInvoices > 2) { churnScore += 25; reasons.push(`${pendingInvoices} faturas pendentes`); }
        if (totalLeads === 0) { churnScore += 20; reasons.push("Nenhum lead gerado"); }
        if (coldLeads > totalLeads * 0.7) { churnScore += 15; reasons.push("Maioria dos leads frios"); }
        if (activeAutomations === 0) { churnScore += 10; reasons.push("Nenhuma automação ativa"); }

        const riskLevel = churnScore >= 70 ? "critical" : churnScore >= 50 ? "high" : churnScore >= 30 ? "medium" : "low";

        const retentionPlan = await callAI(
          `Você é um especialista em customer success e retenção de clientes SaaS com 15 anos de experiência.
Analise o score de churn e gere um plano de retenção personalizado com ações imediatas.
Considere: urgência do contato, tipo de oferta, canal ideal (email, WhatsApp, ligação).
Retorne APENAS JSON válido:
{
  "actions": [{"type":"email|call|discount|feature|meeting","description":"ação detalhada","priority":"critical|high|medium","timeline":"imediato|24h|48h|1 semana","expected_impact":"% de retenção esperada"}],
  "message": "mensagem personalizada de retenção para enviar ao cliente",
  "discount_suggestion": 0,
  "win_back_strategy": "estratégia de reconquista se já estiver em churn",
  "health_indicators": ["indicador positivo que pode ser destacado"],
  "escalation_plan": "quando e como escalar para o gestor"
}`,
          `Score de churn: ${churnScore}/100 | Nível: ${riskLevel}
Motivos: ${reasons.join("; ")}
Serviços ativos: ${activeServices}/${services.length}
Leads totais: ${totalLeads} (${coldLeads} frios)
Faturas pendentes: ${pendingInvoices}
Automações ativas: ${activeAutomations}`,
          "google/gemini-2.5-flash"
        );

        await supabase.from("dominus_insights").insert({
          tenant_id, title: `Risco de Churn: ${riskLevel}`, description: reasons.join("; "),
          category: "risk", impact_value: churnScore, priority: riskLevel === "critical" || riskLevel === "high" ? "high" : "medium", status: "new",
        });

        result = { churnScore, riskLevel, reasons, retentionPlan, metrics: { activeServices, totalLeads, coldLeads, pendingInvoices, activeAutomations } };
        break;
      }

      // ══════════════════════════════════════════════
      // ── COMPETITOR MONITOR (Enhanced) ──
      // ══════════════════════════════════════════════
      case "monitor_competitors": {
        const { competitors } = data;
        const alerts: unknown[] = [];
        for (const comp of (competitors || []).slice(0, 5)) {
          try {
            const text = await scrapeUrl(comp.url, 6000);
            const analysis = await callAI(
              `Analista de inteligência competitiva especializado em marketing digital.
Analise o conteúdo do concorrente e identifique TODAS as mudanças estratégicas relevantes.
Foque em: preços, features, posicionamento, ofertas, novos produtos, mudanças de branding.
Retorne JSON array: [{"changeType":"pricing|feature|messaging|product|branding|promotion|partnership","description":"descrição detalhada da mudança","impact":"low|medium|high|critical","recommendation":"ação estratégica para reagir","urgency":"imediata|essa_semana|esse_mes","competitive_advantage":"como usar isso a seu favor"}]`,
              `Concorrente: ${comp.name}\nURL: ${comp.url}\nConteúdo:\n${text}`,
              "google/gemini-2.5-flash"
            );
            if (Array.isArray(analysis)) for (const a of analysis) alerts.push({ ...a, competitor: comp.name, url: comp.url });
          } catch { /* skip */ }
        }
        result = { alerts, analyzed: competitors?.length || 0, timestamp: new Date().toISOString() };
        break;
      }

      // ══════════════════════════════════════════════
      // ── ORCHESTRATOR PIPELINE (Enhanced Multi-Agent) ──
      // ══════════════════════════════════════════════
      case "run_pipeline": {
        const { goal, agents: agentConfigs } = data;
        const AGENT_PROMPTS: Record<string, string> = {
          researcher: "Pesquisador especialista com metodologia científica. Busque informações relevantes, fatos verificáveis, dados concretos e fontes confiáveis. Estruture a pesquisa em tópicos claros.",
          analyst: "Analista de negócios sênior com MBA e 15 anos de experiência. Extraia insights acionáveis, identifique padrões, correlações e oportunidades ocultas. Use frameworks como SWOT, Porter, BCG.",
          writer: "Redator profissional premiado. Transforme análises em conteúdo claro, persuasivo e envolvente. Use storytelling, dados e estrutura impecável.",
          coder: "Engenheiro de software sênior TypeScript/React com 10+ anos. Código limpo, tipado, testável e com boas práticas. DRY, SOLID, performance.",
          reviewer: "Revisor de qualidade editorial e técnica. Avalie criticamente o output, identifique erros, inconsistências e sugira melhorias específicas. Nota 1-10 com justificativa.",
          sales: "Especialista em vendas B2B com track record de R$50M+ em contratos. Abordagens persuasivas, objeções antecipadas e próximos passos claros.",
          predictor: "Especialista em análise preditiva e data science. Tendências baseadas em dados, previsões com intervalos de confiança e ações preventivas.",
          strategist: "Estrategista digital com visão 360°. Conecta todas as peças: tráfego, automação, copy, SEO, CRM. Plano integrado e escalável.",
        };
        const steps: unknown[] = [];
        let context = `Objetivo: ${goal}`;
        for (const agent of (agentConfigs || []).slice(0, 7)) {
          const role = agent.role || "researcher";
          const systemPrompt = agent.systemPrompt || AGENT_PROMPTS[role] || AGENT_PROMPTS.researcher;
          const startTime = Date.now();
          try {
            const output = await callAI(
              systemPrompt + "\nResponda em português brasileiro. Seja detalhado e acionável.",
              steps.length === 0 ? goal : `${context}\n\n[CONTEXTO ACUMULADO DO PIPELINE]\nSua tarefa como ${agent.name || role}: processe o trabalho anterior, adicione sua expertise e contribua com valor único.`,
              "google/gemini-2.5-flash"
            );
            const outputStr = typeof output === "string" ? output : JSON.stringify(output);
            context += `\n\n[${role}]: ${outputStr.slice(0, 3000)}`;
            steps.push({ agent: agent.name || role, role, status: "completed", output: outputStr, durationMs: Date.now() - startTime });
          } catch (err: unknown) {
            steps.push({ agent: agent.name || role, role, status: "failed", error: err instanceof Error ? err.message : "Unknown", durationMs: Date.now() - startTime });
          }
        }
        const lastSuccess = [...steps].reverse().find((s: any) => s.status === "completed") as any;
        result = { steps, finalOutput: lastSuccess?.output || "Pipeline falhou", status: steps.every((s: any) => s.status === "completed") ? "completed" : "partial", totalDuration: steps.reduce((sum: number, s: any) => sum + (s.durationMs || 0), 0) };
        break;
      }

      // ══════════════════════════════════════════════
      // ── COPY MASTER AI (Deep Upgrade from copy-engine) ──
      // ══════════════════════════════════════════════
      case "generate_copy": {
        const { clientDescription, businessType, targetAudience, platform, copyType, objective, scrapedContent, tone, differentials } = data;

        let urlContext = "";
        if (scrapedContent) urlContext = `\nCONTEÚDO DO NEGÓCIO:\n${scrapedContent.slice(0, 6000)}`;

        result = await callAI(
          `Você é o melhor copywriter do Brasil, especializado em marketing digital de alta conversão.
Você cria copies que VENDEM. Humanizadas, emocionais, irresistíveis.
Domina neurociência da persuasão: gatilhos mentais, storytelling, neuromarketing.
Use frameworks comprovados: AIDA, PAS, StoryBrand, PASTOR, BAB, 4 Us.
NUNCA soe robótico. Seja autêntico, direto e impactante.

Retorne APENAS JSON válido:
{
  "headline": "headline que para o scroll — máximo 10 palavras",
  "subheadline": "complemento que gera curiosidade",
  "hook": "gancho irresistível de 3 linhas que prende atenção",
  "body": "copy completa e humanizada com gatilhos mentais",
  "cta": "chamada para ação poderosa e urgente",
  "framework_used": "AIDA|PAS|StoryBrand|PASTOR",
  "variations": [
    {"type": "curta", "content": "versão de 3 linhas para stories/reels"},
    {"type": "media", "content": "versão de 8 linhas para feed"},
    {"type": "longa", "content": "versão completa para landing page/email"},
    {"type": "whatsapp", "content": "mensagem conversacional para WhatsApp"},
    {"type": "video_script", "content": "roteiro de 30s para vídeo/reels"}
  ],
  "hooks_alternativos": ["gancho alternativo 1", "gancho 2", "gancho 3", "gancho 4", "gancho 5"],
  "gatilhos_usados": ["urgência", "prova social", "escassez", "autoridade"],
  "target_emotion": "emoção principal ativada",
  "why_it_works": "explicação da psicologia por trás da copy",
  "score_estimado": 92,
  "sugestoes_visual": "descrição do criativo ideal para acompanhar",
  "hashtags": ["h1", "h2", "h3", "h4", "h5"],
  "emojis_recomendados": "🔥💪✅",
  "remarketing_versions": {
    "soft": "copy para quem visitou mas não comprou",
    "medium": "copy para quem visitou 2-3x",
    "urgent": "copy para carrinho abandonado"
  }
}`,
          `CLIENTE: ${clientDescription}
TIPO DE NEGÓCIO: ${businessType}
PÚBLICO-ALVO: ${targetAudience}
PLATAFORMA: ${platform}
TIPO DE COPY: ${copyType}
OBJETIVO: ${objective}
TOM: ${tone || "professional"}
DIFERENCIAIS: ${differentials || "não informados"}${urlContext}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ══════════════════════════════════════════════
      // ── ANALYZE BUSINESS URL (Enhanced with deep analysis) ──
      // ══════════════════════════════════════════════
      case "analyze_business": {
        const { url } = data;
        const content = await scrapeUrl(url, 10000);

        result = await callAI(
          `Você é um especialista em análise de negócios digitais com 20 anos de experiência.
Analise o conteúdo extraído e faça uma radiografia completa do negócio.
Retorne APENAS JSON válido:
{
  "businessName": "nome do negócio",
  "businessType": "tipo de negócio",
  "niche": "nicho de mercado",
  "mainProducts": ["produto/serviço 1", "produto 2"],
  "targetAudience": "descrição detalhada do público-alvo",
  "valueProposition": "proposta de valor principal",
  "painPoints": ["dor do cliente 1", "dor 2"],
  "differentials": ["diferencial 1", "diferencial 2"],
  "tone": "professional|casual|urgent|inspirational|educational",
  "keywords": ["keyword 1", "keyword 2"],
  "opportunities": ["oportunidade de melhoria 1", "oportunidade 2"],
  "competitors_likely": ["concorrente provável 1"],
  "marketing_maturity": "iniciante|intermediário|avançado",
  "recommended_services": ["tráfego pago", "automação", "SEO"],
  "estimated_market_size": "estimativa do tamanho do mercado",
  "quick_wins": ["melhoria rápida de alto impacto 1", "melhoria 2"]
}`,
          `URL: ${url}\n\nConteúdo extraído:\n${content}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ══════════════════════════════════════════════
      // ── AUTOMATION BUILDER (Deep Upgrade from automation-engine) ──
      // ══════════════════════════════════════════════
      case "generate_automation": {
        const { clientDescription, objective, platforms, budget, niche } = data;

        result = await callAI(
          `Você é o maior especialista em automação de marketing e CRM do Brasil.
Você cria fluxos de automação que transformam leads em clientes automaticamente.
Conhece profundamente: ActiveCampaign, RD Station, Hubspot, Kommo, ManyChat, N8n, Zapier,
WhatsApp Business API, Meta Leads Ads, Google Lead Forms.
Crie automações que REALMENTE funcionam e geram resultados mensuráveis.

Retorne APENAS JSON válido:
{
  "name": "nome do workflow",
  "description": "descrição completa do que faz",
  "objective": "objetivo específico e mensurável",
  "recommended_tool": "n8n|make|zapier",
  "platforms": ["plataformas integradas"],
  "trigger": {"type": "lead_form|webhook|schedule|event", "description": "detalhes do trigger", "platform": "plataforma"},
  "nodes": [
    {"id": "n1", "type": "trigger|condition|action|delay|split|ai_agent|notification|end", "name": "nome do nó", "description": "o que faz exatamente", "config": {}, "position": {"x": 100, "y": 100}},
    {"id": "n2", "type": "condition", "name": "Qualificar Lead", "description": "verifica score e interesse", "config": {"condition": "score > 50"}, "position": {"x": 100, "y": 200}}
  ],
  "edges": [
    {"id": "e1", "from": "n1", "to": "n2", "label": "sempre"}
  ],
  "lead_cracking_strategy": {
    "capture_points": ["formulário no site", "chat no WhatsApp", "Lead Ads Meta"],
    "enrichment_sources": ["análise de comportamento", "dados do formulário"],
    "scoring_criteria": [
      {"criterion": "respondeu em 5min", "weight": 10, "points": 25},
      {"criterion": "visitou página de preços", "weight": 8, "points": 20}
    ],
    "segmentation": [
      {"segment": "Quente", "criteria": "score > 70", "action": "Abordagem imediata por WhatsApp"},
      {"segment": "Morno", "criteria": "score 40-70", "action": "Sequência de nurturing"},
      {"segment": "Frio", "criteria": "score < 40", "action": "Email + conteúdo educativo"}
    ],
    "nurturing_sequence": [
      {"day": 0, "channel": "whatsapp", "message": "mensagem de boas-vindas personalizada"},
      {"day": 1, "channel": "email", "message": "conteúdo de valor sobre o problema"},
      {"day": 3, "channel": "whatsapp", "message": "case de sucesso relevante"},
      {"day": 7, "channel": "email", "message": "oferta com urgência"},
      {"day": 14, "channel": "whatsapp", "message": "última chance / escassez"}
    ]
  },
  "follow_up_sequence": [
    {"day": 0, "channel": "whatsapp", "message": "Oi {{nome}}! Vi que você se interessou..."},
    {"day": 1, "channel": "email", "message": "Assunto: Como {{empresa}} pode ajudar..."}
  ],
  "expected_results": {
    "leads_per_month": 150,
    "conversion_rate": 12.5,
    "revenue_estimate": "R$15.000 - R$25.000",
    "automation_roi": "800%"
  },
  "implementation": [
    {"step": 1, "title": "Configurar trigger", "description": "o que fazer", "platform": "n8n", "time_to_implement": "2 horas", "priority": "critical"}
  ]
}

Crie no mínimo 8-12 nós cobrindo: captura, qualificação, segmentação, nurturing, conversão, pós-venda.`,
          `NEGÓCIO: ${clientDescription}
NICHO: ${niche || "não informado"}
OBJETIVO: ${objective}
PLATAFORMAS: ${(platforms || []).join(", ")}
VERBA MENSAL: R$${budget || "A definir"}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ══════════════════════════════════════════════
      // ── GMB OPTIMIZER (Deep Upgrade from gmb-engine) ──
      // ══════════════════════════════════════════════
      case "optimize_gmb": {
        const { businessName, category, location, websiteUrl, competitors: gmbCompetitors } = data;
        let content = "";
        if (websiteUrl) content = await scrapeUrl(websiteUrl, 5000);

        result = await callAI(
          `Você é o maior especialista em Google Meu Negócio (Google Business Profile) do Brasil.
Você já colocou centenas de negócios no TOP 3 do Google Maps.
Conhece profundamente os algoritmos de ranqueamento local do Google.
Cria descrições altamente otimizadas que aparecem nas primeiras posições.

Retorne APENAS JSON válido:
{
  "business_name_optimized": "nome otimizado para busca local",
  "category_primary": "categoria principal exata do Google",
  "categories_secondary": ["categoria 2", "categoria 3"],
  "description_750": "descrição otimizada de 750 chars com palavras-chave naturais, localização, serviços e CTA",
  "short_description": "descrição curta de 250 chars impactante",
  "keywords_strategy": [
    {"term": "keyword local", "volume": "alto|médio|baixo", "difficulty": "fácil|médio|difícil", "usage": "onde usar"}
  ],
  "attributes": {"aceita_cartao": true, "tem_estacionamento": false, "acessivel": true},
  "services": [
    {"name": "serviço", "description": "descrição otimizada para SEO", "price": "R$XX"}
  ],
  "products": [
    {"name": "produto", "description": "descrição", "price": "R$XX", "image_prompt": "prompt para imagem"}
  ],
  "posts_calendar": [
    {"week": 1, "posts": [
      {"type": "novidade|oferta|evento|produto", "title": "título", "content": "conteúdo completo otimizado", "cta": "Saiba Mais|Ligar|Reservar", "image_prompt": "prompt para imagem"}
    ]}
  ],
  "q_and_a": [
    {"question": "pergunta frequente otimizada", "answer": "resposta completa com keywords"}
  ],
  "review_strategy": {
    "how_to_ask": "como pedir avaliações naturalmente",
    "response_template_positive": "template para avaliação positiva com nome do negócio",
    "response_template_negative": "template empático e resolutivo para avaliação negativa",
    "target_reviews_month": 10
  },
  "photos_strategy": {
    "cover_photo": "descrição da foto de capa ideal",
    "logo_spec": "especificações do logo",
    "team_photos": "dicas para fotos da equipe",
    "product_photos": ["foto 1", "foto 2"],
    "interior_photos": ["foto 1", "foto 2"],
    "frequency": "X fotos por semana"
  },
  "ranking_strategy": "estratégia completa para TOP 3 em 90 dias",
  "seo_local_tips": ["dica acionável 1", "dica 2", "dica 3"],
  "checklist": [
    {"task": "tarefa", "priority": "crítica|alta|média", "impact": "alto|médio|baixo"}
  ]
}

Crie no mínimo 4 semanas de posts, 10 Q&As, 10+ keywords.`,
          `NEGÓCIO: ${businessName}
CATEGORIA: ${category}
LOCALIZAÇÃO: ${location || "N/A"}
CONCORRENTES: ${(gmbCompetitors || []).join(", ") || "não informados"}
${content ? `CONTEÚDO DO SITE:\n${content}` : ""}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ══════════════════════════════════════════════
      // ── AFFILIATE STRATEGY AI (Deep Upgrade from affiliates-engine) ──
      // ══════════════════════════════════════════════
      case "generate_affiliate_strategy": {
        const { productName, productDescription, role, price, platforms: affPlatforms, commissionRate, targetAudience, productUrl } = data;

        let productContent = "";
        if (productUrl) productContent = await scrapeUrl(productUrl, 5000);

        result = await callAI(
          `Você é o maior especialista em tráfego pago e marketing de afiliados do Brasil.
Você já gerou mais de R$50M em vendas para produtores e afiliados.
Especializado em: Meta Ads, Google Ads, TikTok Ads, Hotmart, Kiwify, Eduzz, Monetizze, Braip, ClickBank.
Cria estratégias que VENDEM. Foco total em ROI e escalabilidade.

Retorne APENAS JSON válido:
{
  "product_analysis": {
    "strengths": ["ponto forte 1", "ponto forte 2"],
    "weaknesses": ["fraqueza 1"],
    "target_audience_detailed": "perfil detalhado do comprador ideal",
    "best_platforms": ["plataforma ideal 1"],
    "conversion_estimate": "estimativa de conversão %",
    "ticket_analysis": "análise do ticket e margem"
  },
  "platforms": [
    {
      "platform": "meta_ads",
      "objective": "conversão",
      "daily_budget": 100,
      "audience": {
        "age": "25-45",
        "interests": ["interesse 1"],
        "behaviors": ["comportamento 1"],
        "lookalike": "1-3% de compradores",
        "retargeting": "visitantes 30 dias"
      },
      "campaign_types": ["conversão", "remarketing", "topo de funil"],
      "priority": "primary|secondary|test",
      "expected_roas": 3.5,
      "expected_cpa": 45.00
    }
  ],
  "copies": {
    "headlines": ["headline 1 que vende", "headline 2", "headline 3"],
    "primary_texts": ["texto principal completo", "variação 2"],
    "descriptions": ["descrição 1", "descrição 2"],
    "video_scripts": ["roteiro de 30s completo", "roteiro 2"],
    "email_sequence": [
      {"day": 0, "subject": "assunto", "body": "corpo completo"},
      {"day": 1, "subject": "assunto D+1", "body": "corpo"},
      {"day": 3, "subject": "assunto D+3", "body": "corpo com urgência"}
    ],
    "whatsapp_messages": ["msg 1 personalizada", "msg 2 follow-up"]
  },
  "funnel_structure": [
    {"stage": "awareness", "channels": ["meta_ads"], "copies": ["copy topo"], "budget_pct": 20, "kpi": "CPM < R$20", "automations": ["pixel de view"]}
  ],
  "budget_allocation": {
    "total": 0,
    "by_platform": {"meta_ads": 60, "google_ads": 30, "tiktok": 10},
    "by_funnel_stage": {"awareness": 20, "consideration": 30, "conversion": 40, "retention": 10},
    "contingency_pct": 5,
    "scaling_threshold_roas": 3.0
  },
  "kpis": [
    {"metric": "ROAS", "target": 4.0, "unit": "x", "timeframe": "30 dias", "alert_threshold": 2.0}
  ],
  "scaling_plan": [
    {"phase": 1, "trigger": "ROAS > 4x por 7 dias", "action": "Aumentar budget 30%", "budget_increase_pct": 30, "expected_result": "Manter ROAS +30% volume"}
  ],
  "optimization_rules": [
    {"condition": "CPA > 2x meta por 3 dias", "action": "pause", "threshold": 2.0, "priority": "critical"},
    {"condition": "ROAS > 5x por 7 dias", "action": "scale", "threshold": 5.0, "priority": "high"}
  ],
  "action_plan_30_days": [
    {"week": 1, "focus": "estruturar", "tasks": ["criar conta ads", "instalar pixel", "criar públicos"]}
  ],
  "projections": {
    "conservative": {"monthly_sales": 10, "revenue": 0, "roas": 2},
    "moderate": {"monthly_sales": 30, "revenue": 0, "roas": 3.5},
    "optimistic": {"monthly_sales": 80, "revenue": 0, "roas": 6}
  }
}`,
          `PRODUTO: ${productName}
DESCRIÇÃO: ${productDescription}
PAPEL: ${role === "producer" ? "PRODUTOR (dono do produto)" : "AFILIADO (promovendo produto de terceiro)"}
PREÇO: R$${price}
COMISSÃO: ${commissionRate || "a definir"}%
PÚBLICO-ALVO: ${targetAudience || "a definir"}
PLATAFORMAS: ${(affPlatforms || []).join(", ")}
${productContent ? `ANÁLISE DO PRODUTO:\n${productContent}` : ""}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ══════════════════════════════════════════════
      // ── CAMPAIGN ANALYZER (Enhanced with decision engine) ──
      // ══════════════════════════════════════════════
      case "analyze_campaign": {
        const { campaignName, platform, objective, metrics, budget, targetRoas } = data;
        const m = metrics || {};
        const ctr = (m.clicks || 0) / (m.impressions || 1) * 100;
        const cpc = (m.spent || 0) / (m.clicks || 1);
        const cpl = (m.spent || 0) / (m.leads || 1);
        const roas = (m.revenue || 0) / (m.spent || 1);
        const cpa = (m.spent || 0) / (m.conversions || 1);

        result = await callAI(
          `Você é o maior especialista em otimização de campanhas de tráfego pago do Brasil.
REGRA DE OURO: Se não está vendendo, PAUSE. Se está vendendo, ESCALE.
Analise os dados e tome a decisão mais lucrativa.

Retorne APENAS JSON válido:
{
  "performance_score": 75,
  "status": "scaling|stable|declining|pausing",
  "decision": "escalar|otimizar|pausar|reformular",
  "analysis": "análise detalhada em 3 parágrafos com dados",
  "alerts": [{"type": "warning|critical|success", "message": "descrição do alerta"}],
  "issues": ["problema identificado 1", "problema 2"],
  "recommendations": [
    {"priority": "crítica|alta|média|baixa", "action": "ação específica", "reason": "justificativa com dados", "expected_impact": "impacto esperado", "implement_now": true}
  ],
  "bid_strategy": "estratégia de lances recomendada",
  "audience_insights": "insights sobre o público baseado nos dados",
  "creative_feedback": "análise dos criativos baseada em CTR",
  "immediate_actions": ["ação AGORA 1", "ação AGORA 2"],
  "next_actions": ["próximo passo 1", "próximo passo 2"],
  "projection_30d": {
    "if_no_change": "projeção sem mudanças",
    "if_optimized": "projeção com otimizações",
    "potential_roas": 4.5
  },
  "reformulation": {
    "needed": false,
    "new_strategy": "se necessário, nova estratégia",
    "new_audience": "se necessário, novo público",
    "new_copies": ["nova copy 1"]
  }
}`,
          `CAMPANHA: ${campaignName}
PLATAFORMA: ${platform}
OBJETIVO: ${objective}
━━━ MÉTRICAS ━━━
Gasto: R$${(m.spent || 0).toFixed(2)}
Impressões: ${m.impressions || 0}
Cliques: ${m.clicks || 0}
CTR: ${ctr.toFixed(2)}%
CPC: R$${cpc.toFixed(2)}
Conversões: ${m.conversions || 0}
CPA: R$${cpa.toFixed(2)}
Leads: ${m.leads || 0}
CPL: R$${cpl.toFixed(2)}
Receita: R$${(m.revenue || 0).toFixed(2)}
ROAS: ${roas.toFixed(2)}x
━━━ METAS ━━━
Budget mensal: R$${budget || 0}
Meta ROAS: ${targetRoas || "N/A"}x`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ══════════════════════════════════════════════
      // ── GOVERNANCE AI (Deep Upgrade from governance-engine) ──
      // ══════════════════════════════════════════════
      case "run_governance": {
        const { totalClients, activeClients, totalBudget, totalSpent, activeCampaigns, totalLeads, totalConversions, alertsCount, moduleStatus, totalRevenue } = data;

        const roi = (totalSpent || 0) > 0 ? ((totalRevenue || 0) / totalSpent).toFixed(2) : "0";

        result = await callAI(
          `Você é o Director de Governança de uma agência de marketing digital premium.
Analise todos os dados do programa e gere um relatório de governança completo.
Identifique problemas, oportunidades e tome decisões inteligentes.
Priorize: performance dos clientes, eficiência do orçamento, automações funcionando, saúde geral.

Retorne APENAS JSON válido:
{
  "health_score": 85,
  "status": "excelente|bom|atenção|crítico",
  "executive_summary": "resumo executivo em 3 linhas com dados concretos",
  "budget_summary": {
    "total_managed": 0,
    "total_spent": 0,
    "total_roi": 0,
    "efficiency": "% de eficiência do budget",
    "overspending_alerts": ["cliente X gastou 20% acima do planejado"],
    "underspending_alerts": ["cliente Y usou apenas 40% da verba"]
  },
  "performance_summary": {
    "avg_roas": 0,
    "avg_cpa": 0,
    "total_conversions": 0,
    "total_revenue": 0,
    "top_performers": [{"name": "cliente", "metric": "ROAS", "value": 5.2}],
    "bottom_performers": [{"name": "cliente", "issue": "CPA alto", "recommendation": "pausar e reformular"}]
  },
  "clients_at_risk": [
    {"name": "cliente", "risk_level": "critical|high|medium|low", "reasons": ["motivo"], "immediate_action": "ação", "estimated_churn_pct": 30}
  ],
  "modules_health": [
    {"module": "Tráfego Pago", "status": "verde|amarelo|vermelho", "note": "detalhes"},
    {"module": "Automações", "status": "verde", "note": "X automações ativas"},
    {"module": "Copy Master", "status": "amarelo", "note": "copies precisam atualização"},
    {"module": "Google Meu Negócio", "status": "verde", "note": "ranking estável"}
  ],
  "opportunities": [
    {"type": "budget_increase|new_platform|upsell|optimization|scaling", "description": "oportunidade", "potential_revenue": "R$X.XXX", "effort": "low|medium|high", "priority": 1}
  ],
  "top_alerts": ["alerta 1 com ação", "alerta 2"],
  "strategic_actions": [
    {"priority": 1, "action": "ação estratégica", "impact": "alto|médio|baixo", "deadline": "imediato|essa semana|esse mês", "assigned_to": "ai|admin|client"}
  ],
  "ai_decisions": [
    {"type": "auto_optimization", "description": "decisão tomada pela IA", "impact": "resultado", "reversible": true}
  ],
  "forecast": {
    "next_30_days": {"revenue": "R$X.XXX", "leads": 0, "conversions": 0},
    "risks": ["risco projetado 1"],
    "opportunities": ["oportunidade projetada 1"]
  },
  "kpis_summary": {"overall_roas": 0, "avg_cpl": 0, "conversion_rate": 0, "budget_efficiency": ""}
}`,
          `PROGRAMA COMPLETO:
━━━ VISÃO GERAL ━━━
- Clientes total: ${totalClients}
- Clientes ativos: ${activeClients}
- Budget gerenciado: R$${(totalBudget || 0).toFixed(2)}
- Investido: R$${(totalSpent || 0).toFixed(2)}
- Receita gerada: R$${(totalRevenue || 0).toFixed(2)}
- ROI geral: ${roi}x
━━━ OPERAÇÕES ━━━
- Campanhas ativas: ${activeCampaigns || 0}
- Leads gerados: ${totalLeads || 0}
- Conversões: ${totalConversions || 0}
- Alertas pendentes: ${alertsCount || 0}
━━━ MÓDULOS ━━━
${JSON.stringify(moduleStatus || {})}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ══════════════════════════════════════════════
      // ── CREATIVE INTELLIGENCE™ (Enhanced CTR Prediction) ──
      // ══════════════════════════════════════════════
      case "score_creative": {
        const { creative, niche, topPerformers } = data;
        result = await callAI(
          `Especialista em análise preditiva de criativos para tráfego pago com base em neuromarketing.
Analise o criativo e preveja performance antes de subir na plataforma.
Retorne APENAS JSON válido:
{
  "score": 78,
  "predicted_ctr": "1.2%-1.8%",
  "predicted_cpc_range": "R$0.80-R$1.50",
  "strengths": ["ponto forte 1", "ponto forte 2"],
  "weaknesses": ["fraqueza 1"],
  "improvements": ["melhoria específica 1", "melhoria 2"],
  "emotional_triggers": ["gatilho emocional detectado"],
  "attention_score": 85,
  "persuasion_score": 72,
  "clarity_score": 90,
  "best_platform": "meta_ads|google_ads|tiktok",
  "ab_test_suggestions": ["variação A sugerida", "variação B"]
}`,
          `Criativo: ${JSON.stringify(creative)}\nNicho: ${niche}\nTop performers do nicho: ${(topPerformers || []).slice(0, 3).join(" | ")}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ══════════════════════════════════════════════
      // ── AUTO-REPORT™ (Enhanced Professional Report) ──
      // ══════════════════════════════════════════════
      case "generate_report": {
        const { clientName, period, reportData } = data;
        const d = reportData || {};
        const roas = (d.spend || 0) > 0 ? ((d.revenue || 0) / d.spend).toFixed(1) : "0";
        const cpl = (d.leads || 0) > 0 ? ((d.spend || 0) / d.leads).toFixed(2) : "0";

        result = await callAI(
          `Especialista em relatórios de marketing digital premium. Gere relatórios profissionais focados em resultados que impressionam clientes.
Use linguagem executiva, dados concretos e recomendações acionáveis.

Retorne APENAS JSON válido:
{
  "executive_summary": "resumo executivo de 2 parágrafos impactantes com dados",
  "highlights": ["destaque positivo 1", "destaque 2", "destaque 3"],
  "lowlights": ["ponto de atenção 1"],
  "analysis": "análise detalhada em 3 parágrafos com métricas e contexto",
  "channel_performance": [
    {"channel": "Meta Ads", "spend": 0, "leads": 0, "roas": 0, "status": "crescendo|estável|caindo"}
  ],
  "copy_performance": {"best_copy": "melhor copy", "best_ctr": 0, "copies_tested": 0},
  "automation_performance": {"active": 0, "leads_generated": 0, "conversion_rate": 0},
  "next_actions": ["ação 1 com deadline", "ação 2", "ação 3"],
  "forecast": "previsão detalhada do próximo mês com base nos dados",
  "kpis": {
    "leads": 0, "conversions": 0, "roas": "0x", "cpl": "R$0",
    "best_channel": "canal com melhor performance",
    "trend": "crescendo|estável|caindo"
  },
  "client_message": "mensagem para enviar ao cliente junto com o relatório"
}`,
          `Cliente: ${clientName}\nPeríodo: ${period}
━━━ DADOS ━━━
Campanhas: ${d.campaigns || 0}
Leads: ${d.leads || 0}
Conversões: ${d.conversions || 0}
Receita: R$${d.revenue || 0}
Investimento: R$${d.spend || 0}
ROAS: ${roas}x
CPL: R$${cpl}
Melhor Copy: "${d.topCopy || "N/A"}"
Automações Ativas: ${d.automationsActive || 0}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ══════════════════════════════════════════════
      // ── CONTENT VIRAL AI ──
      // ══════════════════════════════════════════════
      case "generate_viral_content": {
        const { niche, platform, days } = data;
        result = await callAI(
          `Especialista em marketing de conteúdo viral para ${platform || "instagram"}.
Crie um calendário de conteúdo que gera engajamento real e viraliza.
Retorne JSON array: [{"day":1,"type":"educational|story|poll|tip|behind_scenes|testimonial|trending|controversy|transformation","caption":"texto completo com emojis e hashtags","hashtags":["h1","h2","h3"],"imagePrompt":"prompt detalhado para gerar imagem","hook":"gancho nos primeiros 3 segundos","bestTime":"melhor horário para postar","engagement_tactic":"tática para gerar interação"}]`,
          `Crie ${days || 7} dias de conteúdo viral para ${platform || "instagram"} no nicho: ${niche}
Inclua: posts educativos, stories interativos, reels com ganchos, carrosséis informativos.`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ── CONTRACT ANALYZER ──
      case "analyze_contract": {
        const { contractText } = data;
        result = await callAI(
          `Advogado especializado em contratos empresariais brasileiros com 20 anos de experiência.
Retorne JSON: {"riskLevel":"low|medium|high|critical","risks":[{"clause":"trecho exato","risk":"descrição do risco","severity":"alta|média|baixa","recommendation":"o que mudar"}],"summary":"resumo executivo 3 frases","missingClauses":["cláusula ausente importante"],"favorable_clauses":["cláusula favorável"],"negotiation_points":["ponto de negociação"]}
DISCLAIMER: análise preliminar, não substitui consultoria jurídica profissional.`,
          `Analise o contrato:\n\n${(contractText || "").slice(0, 15000)}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ── SEO STRATEGY AI ──
      case "generate_seo_strategy": {
        const { domain, niche, targetAudience } = data;
        result = await callAI(
          `Especialista em SEO com track record de posicionar sites no TOP 3 do Google.
Retorne JSON: {"keywords":[{"term":"","volume":"alto|médio|baixo","difficulty":"fácil|médio|difícil","intent":"informacional|transacional|navegacional","priority":1}],"contentPlan":[{"title":"","keyword":"","outline":["H2 1","H2 2"],"word_count":1500,"internal_links":[]}],"technicalFixes":["correção técnica 1"],"link_building":["estratégia 1"],"local_seo":["dica local"],"timeline":"cronograma de 90 dias"}`,
          `Domínio: ${domain}\nNicho: ${niche}\nAudiência: ${targetAudience}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ── E-COMMERCE OPTIMIZER ──
      case "optimize_listing": {
        const { productName, rawDescription, category } = data;
        result = await callAI(
          `Especialista em copywriting e-commerce e marketplace. Retorne JSON: {"title":"título otimizado 80 chars","description":"descrição persuasiva completa","bulletPoints":["b1","b2","b3","b4","b5"],"keywords":["k1","k2","k3"],"metaDescription":"160 chars","seo_tags":["tag1","tag2"],"price_suggestion":"sugestão de posicionamento de preço"}`,
          `Produto: ${productName}\nCategoria: ${category}\nDescrição atual: ${rawDescription}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ── HR SCREENING AI ──
      case "screen_candidate": {
        const { jobDescription, resumeText } = data;
        result = await callAI(
          `Especialista em recrutamento e seleção com 15 anos de experiência. Retorne JSON: {"score":78,"strengths":["ponto forte"],"gaps":["lacuna"],"culture_fit":"alto|médio|baixo","questions":["pergunta personalizada 1","pergunta 2","pergunta 3"],"recommendation":"aprovado|reprovado|segunda_fase","salary_range":"faixa salarial estimada","red_flags":["alerta se houver"]}`,
          `Vaga:\n${jobDescription}\n\nCurrículo:\n${resumeText}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ── SUPPORT AGENT 24/7 ──
      case "handle_support": {
        const { message, knowledgeBase, history } = data;
        const kb = (knowledgeBase || []).slice(0, 10).join("\n\n---\n\n");
        result = await callAI(
          `Agente de suporte especializado, empático e resolutivo. Base de conhecimento:\n${kb}\nRetorne JSON: {"response":"resposta completa e humanizada","confidence":0.85,"escalate":false,"category":"billing|technical|general|complaint|refund|feature_request","sentiment":"positive|neutral|negative","suggested_followup":"próximo passo sugerido"}`,
          `Histórico: ${JSON.stringify((history || []).slice(-5))}\nMensagem do cliente: ${message}`,
          "google/gemini-2.5-flash-lite"
        );
        break;
      }

      // ── SPREADSHEET AI ──
      case "generate_formulas": {
        const { description, headers, sampleData } = data;
        result = await callAI(
          `Especialista em planilhas Google Sheets e Excel avançado. Retorne JSON: {"formulas":[{"cell":"C1","formula":"=FORMULA()","explanation":"explicação clara"}],"summary":"o que fazem em conjunto","pivot_suggestion":"sugestão de tabela dinâmica se aplicável","charts":"gráficos recomendados"}`,
          `Pedido: ${description}\nColunas: ${(headers || []).join(", ")}\nAmostra: ${JSON.stringify((sampleData || []).slice(0, 3))}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ── MARKET PREDICTION AI ──
      case "predict_market": {
        const { niche: mNiche, currentData } = data;
        result = await callAI(
          `Especialista em análise preditiva de mercado digital e tendências. Retorne JSON: {"predictions":[{"trend":"tendência","probability":"alta|média|baixa","timeframe":"curto|médio|longo","impact":"descrição do impacto","action":"ação recomendada","confidence":85}],"opportunities":[{"title":"oportunidade","score":85,"description":"detalhes","investment_needed":"R$X","expected_return":"R$Y"}],"risks":[{"title":"risco","severity":"high|medium|low","mitigation":"como mitigar","probability":40}],"market_size":"estimativa do mercado","growth_rate":"taxa de crescimento"}`,
          `Nicho: ${mNiche}\nDados atuais: ${JSON.stringify(currentData || {})}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ── DIGITAL CLONE ──
      case "build_clone": {
        const { samples, userName } = data;
        result = await callAI(
          `Especialista em análise de padrões de comunicação e linguística computacional. Retorne JSON: {"clonePrompt":"system prompt COMPLETO de 500+ palavras para clonar o estilo de escrita fielmente","personality":{"tone":"tom predominante","vocabulary":["palavras frequentes"],"sentence_structure":"estrutura de frases","decisionStyle":"como toma decisões","emotionalPatterns":"padrões emocionais","communication_style":"direto|detalhado|storyteller"},"writing_rules":["regra 1 que o clone deve seguir","regra 2"],"sample_outputs":["exemplo de texto gerado pelo clone"]}`,
          `Nome: ${userName}\nAmostras de texto:\n\n${(samples || []).join("\n\n---\n\n")}`,
          "google/gemini-2.5-pro"
        );
        break;
      }

      // ── VOICE COMMAND ──
      case "voice_command": {
        const { text } = data;
        result = await callAI(
          `Você é o Maestro, assistente de voz para gestão de marketing digital. Responda de forma concisa e direta (máximo 3 frases). Foque em ações práticas. Se pedir dados, forneça números resumidos. Se pedir ação, confirme e descreva o próximo passo.`,
          text,
          "google/gemini-2.5-flash-lite"
        );
        break;
      }

      // ── LEAD CRACKING (New from automation-engine) ──
      case "crack_lead": {
        const { rawData, businessNiche } = data;
        result = await callAI(
          `Especialista em análise e enriquecimento de leads com foco em conversão.
Analise os dados disponíveis e extraia o máximo de inteligência comercial.
Retorne APENAS JSON: {"enriched":{},"score":78,"segment":"quente|morno|frio|não_qualificado","intent":"comprar_agora|pesquisando|curioso|não_qualificado","bestApproach":"abordagem recomendada personalizada","estimatedValue":"R$ estimativa","urgency":"alta|média|baixa","next_touchpoint":"próximo ponto de contato ideal"}`,
          `Lead bruto: ${JSON.stringify(rawData || {})}\nNicho do negócio: ${businessNiche || "geral"}`,
          "google/gemini-2.5-flash-lite"
        );
        break;
      }

      // ── COPY OPTIMIZER (New from copy-engine) ──
      case "optimize_copy": {
        const { originalCopy, performanceData, feedback } = data;
        result = await callAI(
          `Especialista em otimização de copies baseado em dados de performance.
Analise os dados e melhore a copy para maximizar CTR e conversões.
Retorne APENAS JSON: {"improved":"copy melhorada completa","changes":["mudança 1 e por quê","mudança 2"],"expected_improvement":"melhoria esperada em %","ab_test":"versão alternativa para teste A/B","hooks_to_test":["gancho alternativo 1","gancho 2"]}`,
          `Copy original:\n${originalCopy}\n\nPerformance: CTR ${performanceData?.ctr || "N/A"}% | Conversões ${performanceData?.conversions || "N/A"} | CPC R$${performanceData?.cpc || "N/A"}\nFeedback: ${feedback || "nenhum"}`,
          "google/gemini-2.5-flash"
        );
        break;
      }

      // ── REVIEW RESPONSE (New from gmb-engine) ──
      case "respond_review": {
        const { review, businessName: bName, niche: rNiche } = data;
        result = await callAI(
          `Especialista em gestão de reputação online e Google Meu Negócio.
Para avaliações positivas: gratidão genuína, reforça pontos positivos, menciona nome do negócio.
Para negativas: empatia, resolução rápida, transformação da experiência.
Retorne JSON: {"response":"resposta completa e profissional","tone":"positivo|neutro|resolutivo|empático","seo_keywords_used":["keyword mencionada naturalmente"]}`,
          `Avaliação: ${review?.rating || 5} estrelas — "${review?.text || ""}"
Autor: ${review?.authorName || "Cliente"}
Negócio: ${bName} (${rNiche || "geral"})`,
          "google/gemini-2.5-flash-lite"
        );
        break;
      }

      // ── BUDGET MANAGER (New from governance-engine) ──
      case "manage_budget": {
        const { campaigns, totalBudget: budgetTotal } = data;
        result = await callAI(
          `Especialista em gestão inteligente de verbas em múltiplas plataformas de tráfego pago.
REGRA: Mova dinheiro para onde está performando melhor. Corte onde está perdendo.
Retorne JSON: {"decisions":[{"platform":"meta_ads","campaign":"nome","action":"increase|decrease|pause|reallocate","amount":500,"reason":"ROAS 5x, escalar","confidence":90}],"total_reallocation":1000,"expected_impact":"aumento de X% no ROAS geral","risk_assessment":"avaliação de riscos da realocação"}`,
          `Budget total: R$${budgetTotal || 0}\nCampanhas ativas:\n${JSON.stringify((campaigns || []).slice(0, 10))}`,
          "google/gemini-2.5-flash"
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
