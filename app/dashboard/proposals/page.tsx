import { createClient } from "@/lib/supabase/server"
import { ProposalsManager } from "@/components/dashboard/proposals-manager"

export default async function ProposalsPage() {
  const supabase = await createClient()
  const [{ data: proposals }, { data: clients }] = await Promise.all([
    supabase.from("proposals").select("*, clients(name)").order("created_at", { ascending: false }),
    supabase.from("clients").select("id, name").order("name"),
  ])
  return <ProposalsManager initialProposals={proposals || []} clients={clients || []} />
}
