import { createClient } from "@/lib/supabase/server"
import { ServicesManager } from "@/components/dashboard/services-manager"

export default async function ServicesPage() {
  const supabase = await createClient()
  const [{ data: services }, { data: clients }] = await Promise.all([
    supabase.from("services").select("*, clients(name)").order("created_at", { ascending: false }),
    supabase.from("clients").select("id, name").order("name"),
  ])
  return <ServicesManager initialServices={services || []} clients={clients || []} />
}
