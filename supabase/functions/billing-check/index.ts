import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const today = new Date().toISOString().split("T")[0];

    // 1. Check module subscriptions due for billing
    const { data: dueSubs } = await supabase
      .from("module_subscriptions")
      .select("*, modules(name)")
      .eq("status", "active")
      .lte("next_billing_date", today);

    const invoicesCreated: string[] = [];

    for (const sub of dueSubs || []) {
      // Create invoice
      const { data: invoice } = await supabase.from("invoices").insert({
        tenant_id: sub.tenant_id,
        amount: sub.price,
        status: "pending",
        description: `Renovação: ${sub.modules?.name || "Módulo"}`,
        due_date: today,
        reference_type: "module_subscription",
        reference_id: sub.id,
      }).select().single();

      if (invoice) invoicesCreated.push(invoice.id);

      // Advance next billing date by 30 days
      await supabase.from("module_subscriptions").update({
        next_billing_date: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
        updated_at: new Date().toISOString(),
      }).eq("id", sub.id);
    }

    // 2. Check overdue invoices (7+ days) → suspend modules
    const overdueDate = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
    const { data: overdueInvoices } = await supabase
      .from("invoices")
      .select("*")
      .eq("status", "pending")
      .lte("due_date", overdueDate);

    for (const inv of overdueInvoices || []) {
      await supabase.from("invoices").update({ status: "overdue" }).eq("id", inv.id);

      if (inv.reference_type === "module_subscription" && inv.reference_id) {
        await supabase.from("module_subscriptions")
          .update({ status: "suspended" })
          .eq("id", inv.reference_id);
      }

      // Create notification
      await supabase.from("notifications").insert({
        title: "Pagamento em atraso",
        message: `Fatura de R$ ${inv.amount} está vencida há mais de 7 dias. Serviço suspenso.`,
        type: "warning",
        entity_type: "invoice",
        entity_id: inv.id,
      });
    }

    // 3. Check plan subscriptions
    const { data: dueMainSubs } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("status", "active")
      .lte("current_period_end", new Date().toISOString());

    for (const sub of dueMainSubs || []) {
      await supabase.from("invoices").insert({
        tenant_id: sub.tenant_id,
        amount: sub.price,
        status: "pending",
        description: `Renovação Plano ${sub.plan}`,
        due_date: today,
        reference_type: "subscription",
        reference_id: sub.id,
      });

      await supabase.from("subscriptions").update({
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(),
      }).eq("id", sub.id);
    }

    return new Response(JSON.stringify({
      success: true,
      invoices_created: invoicesCreated.length,
      overdue_processed: (overdueInvoices || []).length,
      plan_renewals: (dueMainSubs || []).length,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
