import { createClient } from "@/lib/supabase/server"
import { DashboardOverview } from "@/components/dashboard/overview"

export default async function DashboardPage() {
  const supabase = await createClient()

  const [
    { count: clientCount },
    { count: serviceCount },
    { count: automationCount },
    { data: recentAudit },
    { data: aiMonitors },
    { data: recentServices },
  ] = await Promise.all([
    supabase.from("clients").select("*", { count: "exact", head: true }),
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase.from("automations").select("*", { count: "exact", head: true }),
    supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(10),
    supabase.from("ai_monitoring").select("*, clients(name)").order("last_activity", { ascending: false }).limit(5),
    supabase.from("services").select("*, clients(name)").order("created_at", { ascending: false }).limit(5),
  ])

  return (
    <DashboardOverview
      stats={{
        clients: clientCount || 0,
        services: serviceCount || 0,
        automations: automationCount || 0,
      }}
      recentAudit={recentAudit || []}
      aiMonitors={aiMonitors || []}
      recentServices={recentServices || []}
    />
  )
}
