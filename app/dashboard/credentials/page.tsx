import { CredentialsPanel } from "@/components/dashboard/credentials-panel"
import { createClient } from "@/lib/supabase/server"

export default async function CredentialsPage() {
  const supabase = await createClient()
  const { data: credentials } = await supabase.from("client_credentials").select("*, clients(name)").order("created_at", { ascending: false })
  const { data: clients } = await supabase.from("clients").select("id, name").order("name")
  
  return <CredentialsPanel initialCredentials={credentials || []} clients={clients || []} />
}
