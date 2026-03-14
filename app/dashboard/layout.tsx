import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/shell"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const session = cookieStore.get("maestro_session")
  
  if (!session?.value) {
    redirect("/")
  }
  
  return <DashboardShell>{children}</DashboardShell>
}
