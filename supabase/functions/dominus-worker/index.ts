import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { tenant_id, user_id } = await req.json();

    // 1. Fetch leads for this tenant
    let leadsQuery = supabase.from("leads").select("*").limit(200);
    if (tenant_id) leadsQuery = leadsQuery.eq("tenant_id", tenant_id);
    const { data: leads } = await leadsQuery;

    // 2. Fetch clients
    let clientsQuery = supabase.from("clients").select("*").limit(100);
    if (tenant_id) clientsQuery = clientsQuery.eq("tenant_id", tenant_id);
    const { data: clients } = await clientsQuery;

    // 3. Fetch automations
    let autoQuery = supabase.from("automations").select("*").limit(50);
    if (tenant_id) autoQuery = autoQuery.eq("tenant_id", tenant_id);
    const { data: automations } = await autoQuery;

    // 4. Score leads
    const coldLeads = (leads || []).filter(l => (l.score || 0) < 30);
    const warmLeads = (leads || []).filter(l => (l.score || 0) >= 30 && (l.score || 0) < 70);
    const hotLeads = (leads || []).filter(l => (l.score || 0) >= 70);
    const noResponseLeads = (leads || []).filter(l => l.status === "new" || l.status === "no_response");

    // 5. Calculate financial impact
    const avgDealValue = 2500;
    const lostRevenue = noResponseLeads.length * avgDealValue;
    const recoveredRevenue = hotLeads.length * avgDealValue * 0.34;

    // 6. Generate actions for cold/no-response leads
    const actionsToCreate = noResponseLeads.slice(0, 10).map(lead => ({
      tenant_id,
      target_id: lead.id,
      target_type: "lead",
      action_type: lead.status === "new" ? "first_contact" : "reengagement",
      status: "pending",
      revenue_recovered: avgDealValue * 0.15,
    }));

    if (actionsToCreate.length > 0) {
      await supabase.from("dominus_actions").insert(actionsToCreate);
    }

    // 7. Save results
    if (tenant_id) {
      await supabase.from("dominus_results").insert({
        tenant_id,
        recovered_revenue: recoveredRevenue,
        lost_revenue: lostRevenue,
        leads_recovered: hotLeads.length,
        leads_lost: noResponseLeads.length,
        actions_count: actionsToCreate.length,
        period_start: new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0],
        period_end: new Date().toISOString().split("T")[0],
      });
    }

    // 8. Generate insights via AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    let aiInsights: any[] = [];

    if (LOVABLE_API_KEY) {
      try {
        const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-lite",
            messages: [
              {
                role: "system",
                content: "Você é o DOMINUS AI Worker. Gere 3-5 insights rápidos baseados nos dados. Retorne JSON array com objetos: {title, description, category, impact_value, priority}",
              },
              {
                role: "user",
                content: JSON.stringify({
                  total_leads: leads?.length || 0,
                  hot: hotLeads.length,
                  warm: warmLeads.length,
                  cold: coldLeads.length,
                  no_response: noResponseLeads.length,
                  total_clients: clients?.length || 0,
                  total_automations: automations?.length || 0,
                  lost_revenue: lostRevenue,
                  recovered: recoveredRevenue,
                }),
              },
            ],
          }),
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const content = aiData.choices?.[0]?.message?.content || "";
          try {
            const match = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\[[\s\S]*\]/);
            if (match) aiInsights = JSON.parse(match[1] || match[0]);
          } catch { /* ignore parse errors */ }
        }
      } catch { /* AI call failed, continue without insights */ }
    }

    // 9. Save insights
    if (aiInsights.length > 0 && tenant_id) {
      const insightsToSave = aiInsights.slice(0, 5).map((i: any) => ({
        tenant_id,
        title: i.title || "Insight",
        description: i.description || "",
        category: i.category || "optimization",
        impact_value: i.impact_value || 0,
        priority: i.priority || "medium",
        status: "new",
      }));
      await supabase.from("dominus_insights").insert(insightsToSave);
    }

    return new Response(JSON.stringify({
      success: true,
      summary: {
        leads_analyzed: leads?.length || 0,
        hot: hotLeads.length,
        warm: warmLeads.length,
        cold: coldLeads.length,
        no_response: noResponseLeads.length,
        lost_revenue: lostRevenue,
        recovered_revenue: recoveredRevenue,
        actions_created: actionsToCreate.length,
        insights_generated: aiInsights.length,
      },
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("dominus-worker error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
