import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const ADMIN_PIN = "834589"
const SESSION_COOKIE = "maestro_session"

export async function POST(request: Request) {
  try {
    const { pin } = await request.json()
    
    if (pin === ADMIN_PIN) {
      const cookieStore = await cookies()
      const sessionToken = Buffer.from(`${Date.now()}-maestro-admin-${Math.random().toString(36).substring(7)}`).toString("base64")
      
      cookieStore.set(SESSION_COOKIE, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      })
      
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ success: false, error: "PIN invalido. Acesso negado." }, { status: 401 })
  } catch {
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 })
  }
}
