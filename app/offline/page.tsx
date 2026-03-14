import { WifiOff, RefreshCw } from "lucide-react"

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="text-center max-w-sm space-y-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <WifiOff className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Sem Conexao</h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            O ORQUESTRADOR precisa de conexao com a internet para funcionar. Verifique sua rede e tente novamente.
          </p>
        </div>
        <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-all">
          <RefreshCw className="w-4 h-4" /> Tentar Novamente
        </a>
        <p className="text-[10px] text-muted-foreground/50 font-mono">ORQUESTRADOR MAESTRO v1.0.0</p>
      </div>
    </main>
  )
}
