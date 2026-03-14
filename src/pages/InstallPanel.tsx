import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Download, Smartphone, Monitor, CheckCircle2, Share2, Plus, ArrowRight,
  HelpCircle, Wifi, WifiOff, Bell, BellRing, RefreshCw, Layers, Lock,
  Cpu, Globe, Zap, Shield
} from "lucide-react";
import OrchestratorBust from "@/components/OrchestratorBust";

type Platform = "android" | "ios" | "desktop" | "unknown";

interface SyncStatus {
  lastSync: string;
  pendingChanges: number;
  connected: boolean;
}

export default function InstallPanel() {
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [isInstalled, setIsInstalled] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [justInstalled, setJustInstalled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [backgroundSync, setBackgroundSync] = useState(false);
  const [persistentStorage, setPersistentStorage] = useState(false);
  const [swRegistered, setSwRegistered] = useState(false);
  const [syncStatus] = useState<SyncStatus>({
    lastSync: new Date().toISOString(),
    pendingChanges: 0,
    connected: navigator.onLine,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) setPlatform("ios");
    else if (/android/.test(ua)) setPlatform("android");
    else setPlatform("desktop");

    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true
    )
      setIsInstalled(true);

    const handler = (e: Event) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => { setJustInstalled(true); setIsInstalled(true); });

    // Check SW registration
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) setSwRegistered(true);
      });
    }

    // Check notification permission
    if ("Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted");
    }

    // Check persistent storage
    if (navigator.storage && navigator.storage.persisted) {
      navigator.storage.persisted().then(setPersistentStorage);
    }

    // Check background sync support
    if ("serviceWorker" in navigator && "SyncManager" in window) {
      setBackgroundSync(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    const prompt = installPrompt as unknown as { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
    await prompt.prompt();
    const result = await prompt.userChoice;
    if (result.outcome === "accepted") { setJustInstalled(true); setIsInstalled(true); }
    setInstallPrompt(null);
  };

  const enableNotifications = async () => {
    if ("Notification" in window) {
      const perm = await Notification.requestPermission();
      setNotificationsEnabled(perm === "granted");
      if (perm === "granted") {
        new Notification("ORQUESTRADOR MAESTRO", {
          body: "Notificações ativadas! Você receberá alertas em tempo real.",
          icon: "/icon-192.png",
          badge: "/icon-192.png",
        });
      }
    }
  };

  const enablePersistentStorage = async () => {
    if (navigator.storage && navigator.storage.persist) {
      const granted = await navigator.storage.persist();
      setPersistentStorage(granted);
    }
  };

  const platformLabel = platform === "ios" ? "iPhone/iPad" : platform === "android" ? "Android" : "Computador";

  const features = [
    { icon: Wifi, label: "Funciona Offline", desc: "Use sem internet, sincroniza ao reconectar", active: swRegistered },
    { icon: Bell, label: "Notificações Push", desc: "Alertas em tempo real de automações e IAs", active: notificationsEnabled },
    { icon: Layers, label: "Segundo Plano", desc: "Continua rodando ao minimizar ou bloquear tela", active: backgroundSync },
    { icon: Lock, label: "Armazenamento Persistente", desc: "Dados protegidos contra limpeza automática", active: persistentStorage },
    { icon: RefreshCw, label: "Sync Automático", desc: "Desktop ↔ Mobile sincronizados em tempo real", active: syncStatus.connected },
    { icon: Globe, label: "Multi-plataforma", desc: "Desktop, Android, iOS — mesma experiência", active: true },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4"><OrchestratorBust size="small" className="w-20 h-20" /></div>
        <h1 className="text-2xl font-bold text-foreground">Instalar o ORQUESTRADOR</h1>
        <p className="text-sm text-muted-foreground mt-1">App nativo com IA em segundo plano — Desktop & Mobile</p>
        <div className="flex items-center justify-center gap-4 mt-3">
          <span className="text-xs text-muted-foreground font-mono flex items-center gap-1.5">
            {platform === "ios" ? <Smartphone className="w-3 h-3" /> : platform === "android" ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
            {platformLabel}
          </span>
          <span className={`text-xs font-mono flex items-center gap-1.5 ${syncStatus.connected ? "text-green-400" : "text-destructive"}`}>
            {syncStatus.connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {syncStatus.connected ? "Online" : "Offline"}
          </span>
          {swRegistered && (
            <span className="text-xs text-primary font-mono flex items-center gap-1.5">
              <Shield className="w-3 h-3" /> SW Ativo
            </span>
          )}
        </div>
      </div>

      {/* Install Card */}
      <div className="rounded-xl border border-border bg-card p-6">
        {isInstalled ? (
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-14 h-14 text-green-400 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {justInstalled ? "Instalado com Sucesso!" : "Orquestrador Instalado"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">O app está rodando como aplicativo nativo no seu dispositivo.</p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-all">
                <ArrowRight className="w-4 h-4" /> Abrir Dashboard
              </button>
            </div>
          </div>
        ) : platform === "ios" ? (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground text-center">Instalar no iOS (Safari)</h3>
            <div className="space-y-4">
              {[
                { step: 1, title: "Toque em Compartilhar", icon: <Share2 className="w-4 h-4 text-primary" />, desc: "Na barra inferior do Safari" },
                { step: 2, title: 'Selecione "Adicionar à Tela de Início"', icon: <Plus className="w-4 h-4 text-primary" />, desc: "Role as opções e toque" },
                { step: 3, title: 'Confirme "Adicionar"', icon: null, desc: "O ícone aparecerá na tela inicial" },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-4 p-3 rounded-lg bg-secondary/30">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary text-sm font-bold">{s.step}</div>
                  <div>
                    <p className="text-sm font-medium text-foreground flex items-center gap-2">{s.title} {s.icon}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            {platform === "android" ? <Smartphone className="w-14 h-14 text-primary mx-auto" /> : <Monitor className="w-14 h-14 text-primary mx-auto" />}
            <div>
              <h3 className="text-lg font-semibold text-foreground">Instalar no {platformLabel}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Acesso rápido, funciona offline, roda em segundo plano e recebe notificações push.
              </p>
            </div>
            {installPrompt ? (
              <button onClick={handleInstall} className="flex items-center gap-2 mx-auto px-8 py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                <Download className="w-5 h-5" /> Instalar Agora
              </button>
            ) : (
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <p className="text-xs text-muted-foreground">
                  Para instalar, abra no <strong className="text-foreground">Chrome</strong> ou <strong className="text-foreground">Edge</strong> e clique no ícone de instalação
                  <Download className="w-3 h-3 inline mx-1 text-primary" /> na barra de endereço, ou use o menu → "Instalar app".
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-primary" /> Recursos Avançados do PWA
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((f) => (
            <div key={f.label} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/30 transition-all">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${f.active ? "bg-green-500/10" : "bg-secondary"}`}>
                <f.icon className={`w-4 h-4 ${f.active ? "text-green-400" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-foreground">{f.label}</p>
                  {f.active && <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0" />}
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions: Enable Notifications + Persistent Storage */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" /> Ativar Recursos
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <button
            onClick={enableNotifications}
            disabled={notificationsEnabled}
            className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
              notificationsEnabled ? "border-green-500/30 bg-green-500/5" : "border-border hover:border-primary/30 bg-secondary/30"
            }`}
          >
            {notificationsEnabled ? <BellRing className="w-5 h-5 text-green-400" /> : <Bell className="w-5 h-5 text-muted-foreground" />}
            <div>
              <p className="text-xs font-medium text-foreground">{notificationsEnabled ? "Notificações Ativas" : "Ativar Notificações"}</p>
              <p className="text-[10px] text-muted-foreground">Alertas push em tempo real</p>
            </div>
          </button>
          <button
            onClick={enablePersistentStorage}
            disabled={persistentStorage}
            className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
              persistentStorage ? "border-green-500/30 bg-green-500/5" : "border-border hover:border-primary/30 bg-secondary/30"
            }`}
          >
            {persistentStorage ? <Lock className="w-5 h-5 text-green-400" /> : <Lock className="w-5 h-5 text-muted-foreground" />}
            <div>
              <p className="text-xs font-medium text-foreground">{persistentStorage ? "Storage Persistente" : "Ativar Storage Persistente"}</p>
              <p className="text-[10px] text-muted-foreground">Dados não são limpos automaticamente</p>
            </div>
          </button>
        </div>
      </div>

      {/* Background + Overlay Info */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" /> Execução em Segundo Plano & Sobreposição
        </h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p className="flex items-start gap-2"><CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" /> <span><strong className="text-foreground">Background Sync:</strong> Dados sincronizam automaticamente mesmo com app minimizado. Service Worker mantém processos ativos.</span></p>
          <p className="flex items-start gap-2"><CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" /> <span><strong className="text-foreground">Notificações com tela bloqueada:</strong> Push notifications funcionam mesmo com o dispositivo bloqueado (Android/Desktop).</span></p>
          <p className="flex items-start gap-2"><CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" /> <span><strong className="text-foreground">Picture-in-Picture:</strong> No Android, abra o app e minimize — ele continua visível sobre outros apps como janela flutuante.</span></p>
          <p className="flex items-start gap-2"><CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" /> <span><strong className="text-foreground">Sincronização Desktop ↔ Mobile:</strong> Auto-update a cada 60s garante que todos dispositivos estejam sempre na mesma versão.</span></p>
        </div>
        {platform === "android" && (
          <div className="p-3 rounded-lg bg-card border border-border mt-2">
            <p className="text-[10px] text-muted-foreground">
              <strong className="text-primary">Dica Android:</strong> Para manter o app sempre ativo em segundo plano, vá em Configurações → Apps → Orquestrador → Bateria → Sem restrições. Isso impede o sistema de encerrar o app.
            </p>
          </div>
        )}
      </div>

      {/* Troubleshooting */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-3"><HelpCircle className="w-4 h-4 text-muted-foreground" /><h4 className="text-sm font-semibold text-foreground">Problemas para instalar?</h4></div>
        <ul className="space-y-1.5 text-xs text-muted-foreground">
          <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-primary flex-shrink-0" /> Abra no Chrome ou Edge (Android/Desktop)</li>
          <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-primary flex-shrink-0" /> No iOS, use o Safari</li>
          <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-primary flex-shrink-0" /> Clique no ícone <Download className="w-3 h-3 inline" /> na barra de endereço</li>
          <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-primary flex-shrink-0" /> Atualize a página (Ctrl+Shift+R) e tente novamente</li>
          <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-primary flex-shrink-0" /> Verifique se está em HTTPS</li>
        </ul>
      </div>
    </div>
  );
}
