import { createClient } from "@/lib/supabase/server"
import { MonitoringDashboard } from "@/components/dashboard/monitoring-dashboard"

export default async function MonitoringPage() {
  const supabase = await createClient()
  const [{ data: monitors }, { data: clients }] = await Promise.all([
    supabase.from("ai_monitoring").select("*, clients(name), services(type, platform)").order("last_activity", { ascending: false }),
    supabase.from("clients").select("id, name").order("name"),
  ])
  return <MonitoringDashboard initialMonitors={monitors || []} clients={clients || []} />
}
