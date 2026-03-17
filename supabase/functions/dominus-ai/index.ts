import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, data } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    switch (action) {
      case "analyze_briefing":
        systemPrompt = `Você é o DOMINUS AI, o cérebro analítico de uma plataforma SaaS de operações digitais. Analise o briefing do cliente e retorne uma análise detalhada.`;
        userPrompt = `Analise este briefing de cliente e retorne um JSON com: diagnostico (texto detalhado), servicos_recomendados (array), estrategia (texto), valor_estimado (número em reais), prazo_estimado (texto), riscos (array), kpis (array), potencial_roi (texto).

Briefing: ${JSON.stringify(data)}`;
        break;

      case "score_lead":
        systemPrompt = `Você é o DOMINUS AI especialista em lead scoring. Analise os dados do lead e atribua uma pontuação de 0-100 com temperatura (hot/warm/cold).`;
        userPrompt = `Analise este lead e retorne JSON com: score (0-100), temperature (hot/warm/cold), conversion_probability (0-100), factors (array de fatores que influenciam), recommendations (array de ações recomendadas), estimated_value (valor potencial em reais).

Lead: ${JSON.stringify(data)}`;
        break;

      case "generate_proposal":
        systemPrompt = `Você é o DOMINUS AI especialista em criar propostas comerciais persuasivas para serviços de marketing digital e automação. Crie propostas detalhadas e profissionais.`;
        userPrompt = `Crie uma proposta comercial completa baseada nesta análise. Retorne JSON com: titulo, diagnostico, estrategia, escopo (detalhado), servicos (array com nome e valor), verba_recomendada, fee_gestao, total, prazo, kpis, riscos, garantias.

Dados: ${JSON.stringify(data)}`;
        break;

      case "sales_agent":
        systemPrompt = `Você é o DOMINUS AI Sales Agent, um vendedor especialista em serviços digitais. Você é persuasivo, humanizado e focado em fechamento. Use técnicas de copywriting, gatilhos mentais e precificação inteligente. Sempre apresente valores e demonstre ROI. Nunca seja agressivo, seja consultivo.`;
        userPrompt = data.message;
        break;

      case "detect_opportunities":
        systemPrompt = `Você é o DOMINUS AI Opportunity Scanner. Analise dados de mercado e sugira oportunidades de negócio lucrativas com análise de risco.`;
        userPrompt = `Baseado nestes dados do sistema, identifique oportunidades de negócio. Retorne JSON com array de oportunidades, cada uma com: titulo, categoria, descricao, score (0-100), profit_estimate, risk_level, competition_level, implementation_steps (array).

Dados do sistema: ${JSON.stringify(data)}`;
        break;

      case "create_agent":
        systemPrompt = `Você é o DOMINUS AI Agent Forge, especialista em criar agentes de IA personalizados. Analise o negócio do cliente e crie um agente perfeito com prompt, design e precificação.`;
        userPrompt = `Analise o negócio descrito e crie um agente de IA completo. Retorne JSON com: agent_name, agent_type, system_prompt (detalhado), personality_traits (array), knowledge_areas (array), design_config (cores, estilo baseado no negócio), pricing (valor sugerido para cobrar), features (array), conversation_starters (array).

Negócio: ${JSON.stringify(data)}`;
        break;

      case "generate_insights":
        systemPrompt = `Você é o DOMINUS AI Intelligence Layer. Gere insights estratégicos baseados nos dados do sistema.`;
        userPrompt = `Analise estes dados e gere insights acionáveis. Retorne JSON com array de insights, cada um com: title, description, category (revenue/leads/optimization/risk), impact_value, priority (high/medium/low), action_items (array).

Dados: ${JSON.stringify(data)}`;
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: action === "sales_agent",
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    if (action === "sales_agent") {
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || "";

    // Try to parse JSON from the response
    let parsed = content;
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      }
    } catch {
      // Return raw text if JSON parsing fails
    }

    return new Response(JSON.stringify({ result: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("dominus-ai error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
