import { createClient } from "@/lib/supabase/server"
import { AuditLog } from "@/components/dashboard/audit-log"

export default async function AuditPage() {
  const supabase = await createClient()
  const { data: logs } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200)
  return <AuditLog initialLogs={logs || []} />
}
