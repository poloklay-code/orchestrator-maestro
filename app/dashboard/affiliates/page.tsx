import { createClient } from "@/lib/supabase/server"
import { AffiliatesManager } from "@/components/dashboard/affiliates-manager"

export default async function AffiliatesPage() {
  const supabase = await createClient()
  const [{ data: affiliates }, { data: clients }] = await Promise.all([
    supabase.from("affiliate_integrations").select("*, clients(name)").order("created_at", { ascending: false }),
    supabase.from("clients").select("id, name").order("name"),
  ])
  return <AffiliatesManager initialAffiliates={affiliates || []} clients={clients || []} />
}
