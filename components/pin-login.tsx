"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, Lock, Eye, EyeOff } from "lucide-react"
import Image from "next/image"

export function PinLogin() {
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      })
      
      const data = await res.json()
      
      if (data.success) {
        router.push("/dashboard")
        router.refresh()
      } else {
        setError(data.error || "PIN invalido")
        setPin("")
      }
    } catch {
      setError("Erro de conexao. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)" }} />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md px-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-primary/30 shadow-lg shadow-primary/20">
          <Image
            src="/images/orquestrador-robot.jpg"
            alt="Orquestrador Maestro"
            fill
            sizes="128px"
            className="object-cover"
            priority
          />
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-primary">Sistema Privado</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">ORQUESTRADOR</h1>
          <p className="text-xs text-primary mt-1 font-semibold tracking-widest uppercase">Centro de Operacoes Digitais</p>
          <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">MAESTRO COMMAND CENTER</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
            <input
              type={showPin ? "text" : "password"}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Digite o PIN de acesso"
              className="w-full h-12 bg-card border border-border rounded-lg pl-10 pr-12 text-center text-lg font-mono tracking-[0.5em] text-foreground placeholder:tracking-normal placeholder:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              maxLength={6}
              autoFocus
              inputMode="numeric"
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <div className="text-sm text-destructive text-center font-mono animate-in fade-in bg-destructive/10 p-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={pin.length < 6 || loading}
            className="w-full h-12 bg-primary text-primary-foreground rounded-lg font-semibold text-sm uppercase tracking-wider hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Verificando...
              </span>
            ) : (
              "Acessar Sistema"
            )}
          </button>
        </form>

        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                i < pin.length ? "bg-primary scale-110" : "bg-border"
              }`}
            />
          ))}
        </div>

        <p className="text-xs text-muted-foreground/50 font-mono">
          v1.0.0 | Acesso restrito ao administrador
        </p>
      </div>
    </main>
  )
}
