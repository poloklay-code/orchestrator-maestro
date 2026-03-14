import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Smartphone, Monitor, CheckCircle2, Share2, Plus, ArrowRight, HelpCircle } from "lucide-react";
import OrchestratorBust from "@/components/OrchestratorBust";

type Platform = "android" | "ios" | "desktop" | "unknown";

export default function InstallPanel() {
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [isInstalled, setIsInstalled] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [justInstalled, setJustInstalled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) setPlatform("ios");
    else if (/android/.test(ua)) setPlatform("android");
    else setPlatform("desktop");

    if (window.matchMedia("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone === true) setIsInstalled(true);

    const handler = (e: Event) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => { setJustInstalled(true); setIsInstalled(true); });
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

  const platformLabel = platform === "ios" ? "iPhone/iPad" : platform === "android" ? "Android" : "Computador";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4"><OrchestratorBust size="small" className="w-20 h-20" /></div>
        <h1 className="text-2xl font-bold text-foreground">Instalar o ORQUESTRADOR</h1>
        <p className="text-sm text-muted-foreground mt-1">Use como app no celular e no computador</p>
        <p className="text-xs text-muted-foreground font-mono mt-1">Detectado: {platformLabel}</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        {isInstalled ? (
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
            <div><h3 className="text-lg font-semibold text-foreground">{justInstalled ? "Instalado com Sucesso!" : "Orquestrador já está instalado"}</h3><p className="text-sm text-muted-foreground mt-1">O app está disponível na sua área de trabalho ou tela inicial.</p></div>
            <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 mx-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-all"><ArrowRight className="w-4 h-4" /> Abrir Dashboard</button>
          </div>
        ) : platform === "ios" ? (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground text-center">Instalar no iOS (Safari)</h3>
            <div className="space-y-4">
              {[
                { step: 1, title: "Toque em Compartilhar", icon: <Share2 className="w-4 h-4 text-primary" />, desc: "Na barra inferior do Safari" },
                { step: 2, title: "Selecione \"Adicionar à Tela de Início\"", icon: <Plus className="w-4 h-4 text-primary" />, desc: "Role as opções e toque" },
                { step: 3, title: "Confirme \"Adicionar\"", icon: null, desc: "O ícone aparecerá na tela inicial" },
              ].map(s => (
                <div key={s.step} className="flex items-start gap-4 p-3 rounded-lg bg-secondary/30">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary text-sm font-bold">{s.step}</div>
                  <div><p className="text-sm font-medium text-foreground flex items-center gap-2">{s.title} {s.icon}</p><p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            {platform === "android" ? <Smartphone className="w-12 h-12 text-primary mx-auto" /> : <Monitor className="w-12 h-12 text-primary mx-auto" />}
            <div><h3 className="text-lg font-semibold text-foreground">Instalar no {platformLabel}</h3><p className="text-sm text-muted-foreground mt-1">Acesse rápido, funcione offline e receba notificações.</p></div>
            {installPrompt ? (
              <button onClick={handleInstall} className="flex items-center gap-2 mx-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-all"><Download className="w-4 h-4" /> Instalar Agora</button>
            ) : (
              <div className="p-3 rounded-lg bg-secondary/50 border border-border"><p className="text-xs text-muted-foreground">Para instalar, abra no Chrome ou Edge e procure a opção "Instalar app" no menu do navegador.</p></div>
            )}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-3"><HelpCircle className="w-4 h-4 text-muted-foreground" /><h4 className="text-sm font-semibold text-foreground">Problemas para instalar?</h4></div>
        <ul className="space-y-1.5 text-xs text-muted-foreground">
          <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-primary flex-shrink-0" /> Abra no Chrome ou Edge (Android/Desktop)</li>
          <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-primary flex-shrink-0" /> No iOS, use o Safari</li>
          <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-primary flex-shrink-0" /> Atualize a página e tente novamente</li>
          <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-primary flex-shrink-0" /> Verifique se está em HTTPS</li>
        </ul>
      </div>
    </div>
  );
}
