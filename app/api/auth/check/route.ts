import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const SESSION_COOKIE = "maestro_session"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(SESSION_COOKIE)
    
    return NextResponse.json({ authenticated: !!session?.value })
  } catch {
    return NextResponse.json({ authenticated: false })
  }
}
