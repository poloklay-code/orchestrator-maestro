import { createClient } from "@/lib/supabase/server"
import { ClientsManager } from "@/components/dashboard/clients-manager"

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false })

  return <ClientsManager initialClients={clients || []} />
}
