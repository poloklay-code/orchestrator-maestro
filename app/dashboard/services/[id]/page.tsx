import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ServiceDetail } from "@/components/dashboard/service-detail"

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: service } = await supabase.from("services").select("*, clients(name, company, email, phone)").eq("id", id).single()
  if (!service) notFound()
  const { data: automations } = await supabase.from("automations").select("*").eq("service_id", id).order("created_at", { ascending: false })
  const { data: monitors } = await supabase.from("ai_monitoring").select("*").eq("service_id", id)
  const { data: auditLogs } = await supabase.from("audit_logs").select("*").eq("entity_id", id).order("created_at", { ascending: false }).limit(20)
  return <ServiceDetail service={service} automations={automations || []} monitors={monitors || []} auditLogs={auditLogs || []} />
}
