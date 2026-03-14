"use server"

import { cookies } from "next/headers"

const ADMIN_PIN = "834589"
const SESSION_COOKIE = "maestro_session"
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export async function verifyPin(pin: string): Promise<{ success: boolean; error?: string }> {
  if (pin === ADMIN_PIN) {
    const cookieStore = await cookies()
    const sessionToken = Buffer.from(`${Date.now()}-maestro-admin`).toString("base64")
    cookieStore.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION / 1000,
      path: "/",
    })
    return { success: true }
  }
  return { success: false, error: "PIN invalido. Acesso negado." }
}

export async function checkSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)
  return !!session?.value
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
