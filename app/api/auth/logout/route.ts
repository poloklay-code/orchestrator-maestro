import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const SESSION_COOKIE = "maestro_session"

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE)
    
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false })
  }
}
