import { createClient } from "@/lib/supabase/server"
import { GoogleBusinessPanel } from "@/components/dashboard/google-business-panel"

export default async function GoogleBusinessPage() {
  const supabase = await createClient()
  const { data: clients } = await supabase.from("clients").select("id, name").order("name")
  return <GoogleBusinessPanel clients={clients || []} />
}
