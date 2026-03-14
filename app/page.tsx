import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { PinLogin } from "@/components/pin-login"

export default async function Home() {
  const cookieStore = await cookies()
  const session = cookieStore.get("maestro_session")
  
  if (session?.value) {
    redirect("/dashboard")
  }
  
  return <PinLogin />
}
