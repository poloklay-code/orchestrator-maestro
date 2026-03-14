import { createClient } from "@/lib/supabase/server"
import { AutomationsManager } from "@/components/dashboard/automations-manager"

export default async function AutomationsPage() {
  const supabase = await createClient()
  const [{ data: automations }, { data: clients }] = await Promise.all([
    supabase.from("automations").select("*, clients(name)").order("created_at", { ascending: false }),
    supabase.from("clients").select("id, name").order("name"),
  ])
  return <AutomationsManager initialAutomations={automations || []} clients={clients || []} />
}
