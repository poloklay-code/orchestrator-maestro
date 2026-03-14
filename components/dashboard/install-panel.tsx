"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Download, Smartphone, Monitor, CheckCircle2, Share2, Plus, ArrowRight, HelpCircle, ExternalLink } from "lucide-react"

type Platform = "android" | "ios" | "desktop" | "unknown"

export function InstallPanel() {
  const [platform, setPlatform] = useState<Platform>("unknown")
  const [isInstalled, setIsInstalled] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null)
  const [justInstalled, setJustInstalled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(ua)) setPlatform("ios")
    else if (/android/.test(ua)) setPlatform("android")
    else setPlatform("desktop")

    if (window.matchMedia("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone === true) {
      setIsInstalled(true)
    }

    const handler = (e: Event) => { e.preventDefault(); setInstallPrompt(e) }
    window.addEventListener("beforeinstallprompt", handler)
    window.addEventListener("appinstalled", () => { setJustInstalled(true); setIsInstalled(true) })

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    const prompt = installPrompt as unknown as { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }
    await prompt.prompt()
    const result = await prompt.userChoice
    if (result.outcome === "accepted") { setJustInstalled(true); setIsInstalled(true) }
    setInstallPrompt(null)
  }

  const platformLabel = platform === "ios" ? "iPhone/iPad" : platform === "android" ? "Android" : "Computador"

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-2 border-primary/30 glow-cyan">
          <Image src="/images/orquestrador-robot.jpg" alt="Orquestrador" fill sizes="80px" className="object-cover" />
        </div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Instalar o ORQUESTRADOR</h1>
        <p className="text-sm text-muted-foreground mt-1">Use como app no celular e no computador</p>
        <p className="text-xs text-muted-foreground font-mono mt-1">Detectado: {platformLabel}</p>
      </div>

      {/* Main Card */}
      <div className="rounded-xl border border-border bg-card p-6">
        {/* Already installed */}
        {isInstalled ? (
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {justInstalled ? "Instalado com Sucesso!" : "Orquestrador ja esta instalado"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">O app esta disponivel na sua area de trabalho ou tela inicial.</p>
            </div>
            <button onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 mx-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-all">
              <ArrowRight className="w-4 h-4" /> Abrir Dashboard
            </button>
          </div>
        ) : platform === "ios" ? (
          /* iOS Instructions */
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground text-center">Instalar no iOS (Safari)</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-lg bg-secondary/30">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary text-sm font-bold">1</div>
                <div>
                  <p className="text-sm font-medium text-foreground flex items-center gap-2">
                    Toque em Compartilhar <Share2 className="w-4 h-4 text-primary" />
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Na barra inferior do Safari, toque no icone de compartilhamento</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 rounded-lg bg-secondary/30">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary text-sm font-bold">2</div>
                <div>
                  <p className="text-sm font-medium text-foreground flex items-center gap-2">
                    Selecione &quot;Adicionar a Tela de Inicio&quot; <Plus className="w-4 h-4 text-primary" />
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Role as opcoes e toque em &quot;Adicionar a Tela de Inicio&quot;</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 rounded-lg bg-secondary/30">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary text-sm font-bold">3</div>
                <div>
                  <p className="text-sm font-medium text-foreground">Confirme &quot;Adicionar&quot;</p>
                  <p className="text-xs text-muted-foreground mt-0.5">O icone do ORQUESTRADOR aparecera na sua tela inicial</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Android / Desktop - Install Button */
          <div className="text-center space-y-4">
            {platform === "android" ? <Smartphone className="w-12 h-12 text-primary mx-auto" /> : <Monitor className="w-12 h-12 text-primary mx-auto" />}
            <div>
              <h3 className="text-lg font-semibold text-foreground">Instalar no {platformLabel}</h3>
              <p className="text-sm text-muted-foreground mt-1">Acesse rapido, funcione offline e receba notificacoes.</p>
            </div>
            {installPrompt ? (
              <button onClick={handleInstall}
                className="flex items-center gap-2 mx-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-all glow-cyan">
                <Download className="w-4 h-4" /> Instalar Agora
              </button>
            ) : (
              <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                <p className="text-xs text-muted-foreground">Para instalar, abra no Chrome ou Edge e procure a opcao &quot;Instalar app&quot; no menu do navegador.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Help Card */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-sm font-semibold text-foreground">Problemas para instalar?</h4>
        </div>
        <ul className="space-y-1.5 text-xs text-muted-foreground">
          <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-primary flex-shrink-0" /> Abra no Chrome ou Edge (Android/Desktop)</li>
          <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-primary flex-shrink-0" /> No iOS, use o Safari (Chrome iOS nao suporta PWA)</li>
          <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-primary flex-shrink-0" /> Atualize a pagina e tente novamente</li>
          <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-primary flex-shrink-0" /> Verifique se esta em HTTPS</li>
        </ul>
      </div>

      {/* Footer */}
      <p className="text-center text-[10px] text-muted-foreground/50">
        Privado e seguro - Funciona com login - Atualiza automaticamente
      </p>
    </div>
  )
}
