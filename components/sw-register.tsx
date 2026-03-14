"use client"

import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"

export function ServiceWorkerRegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js").then((reg) => {
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing
          if (!newWorker) return
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              setUpdateAvailable(true)
              setWaitingWorker(newWorker)
            }
          })
        })
      })

      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload()
      })
    }
  }, [])

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" })
    }
  }

  if (!updateAvailable) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-card border border-primary/30 rounded-xl p-4 shadow-lg max-w-xs animate-in slide-in-from-bottom">
      <div className="flex items-center gap-3">
        <RefreshCw className="w-5 h-5 text-primary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">Atualizacao Disponivel</p>
          <p className="text-xs text-muted-foreground">Uma nova versao do sistema esta pronta.</p>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={() => setUpdateAvailable(false)}
          className="flex-1 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground transition-all">
          Depois
        </button>
        <button onClick={handleUpdate}
          className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-all">
          Atualizar
        </button>
      </div>
    </div>
  )
}
