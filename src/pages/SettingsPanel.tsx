import { useState, useEffect } from "react";
import { Settings, Shield, Download, Smartphone, RefreshCw, Bell, Cpu, CheckCircle2, AlertCircle, Monitor } from "lucide-react";
import OrchestratorBust from "@/components/OrchestratorBust";

const pendingUpdate = {
  version: "1.1.0",
  features: [
    "Novo modulo de Copy IA com testes A/B automatizados",
    "Dashboard de ROI por cliente com calculo automatico",
    "Notificacoes push em tempo real via WebSocket",
    "Relatorios PDF aprimorados com graficos interativos",
    "Integracao nativa com WhatsApp Business API",
  ],
  benefits: [
    "Aumento de 40% na velocidade de geracao de copies",
    "Visao consolidada do retorno de cada cliente",
    "Alertas instantaneos de falhas em automacoes",
  ],
  risks: [
    "Requer migracao de dados (automatica, sem downtime)",
    "Novos endpoints de API podem afetar integracoes customizadas",
  ],
  impact: "Todos os servicos continuarao online durante a atualizacao. Tempo estimado: 2 minutos. Zero downtime garantido.",
};

export default function SettingsPanel() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [pinMsg, setPinMsg] = useState("");
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    if (window.matchMedia("(display-mode: standalone)").matches) setIsInstalled(true);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = () => {
    if (!installPrompt) return;
    (installPrompt as any).prompt();
    setInstallPrompt(null);
  };

  const handleChangePin = () => {
    if (currentPin !== "834589") { setPinMsg("PIN atual incorreto."); return; }
    if (newPin.length !== 6) { setPinMsg("Novo PIN deve ter 6 digitos."); return; }
    setPinMsg("PIN atualizado com sucesso!");
    setCurrentPin(""); setNewPin("");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Settings className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Configuracoes do Sistema</h2>
          <p className="text-xs text-muted-foreground font-display">Gerenciar seguranca, atualizacoes e instalacao</p>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Seguranca</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">PIN Atual</label>
            <input type="password" value={currentPin} onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Digite PIN atual"
              className="w-full h-10 bg-secondary/50 border border-border rounded-lg px-3 text-sm font-display text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" maxLength={6} inputMode="numeric" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Novo PIN</label>
            <input type="password" value={newPin} onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Digite novo PIN"
              className="w-full h-10 bg-secondary/50 border border-border rounded-lg px-3 text-sm font-display text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" maxLength={6} inputMode="numeric" />
          </div>
        </div>
        {pinMsg && <p className={`text-xs ${pinMsg.includes("sucesso") ? "text-ai-active" : "text-destructive"}`}>{pinMsg}</p>}
        <button onClick={handleChangePin} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90">Alterar PIN</button>
      </div>

      {/* Install */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Smartphone className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Instalar Aplicativo</h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Instale o ORQUESTRADOR como aplicativo nativo no seu dispositivo. Acesse offline e receba notificacoes push.
        </p>
        <div className="flex flex-wrap gap-3">
          {installPrompt ? (
            <button onClick={handleInstall} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90">
              <Download className="w-4 h-4" /> Instalar no Dispositivo
            </button>
          ) : isInstalled ? (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-ai-active/10 border border-ai-active/20 rounded-lg text-xs text-ai-active">
              <CheckCircle2 className="w-4 h-4" /> Aplicativo ja instalado
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-xs text-muted-foreground">
              <Monitor className="w-4 h-4" /> Para instalar: abra no Chrome/Safari e use "Adicionar a tela inicial"
            </div>
          )}
        </div>
      </div>

      {/* Auto Updates */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Atualizacoes Automaticas</h3>
          </div>
          <button onClick={() => setAutoUpdate(!autoUpdate)}
            className={`w-10 h-5 rounded-full transition-all relative ${autoUpdate ? "bg-primary" : "bg-border"}`}>
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-all ${autoUpdate ? "left-5" : "left-0.5"}`} />
          </button>
        </div>
        <button onClick={() => setShowUpdate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-xs text-primary hover:bg-primary/20 transition-all">
          <Cpu className="w-4 h-4" /> Verificar Atualizacoes
        </button>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Notificacoes</h3>
          </div>
          <button onClick={() => setNotifications(!notifications)}
            className={`w-10 h-5 rounded-full transition-all relative ${notifications ? "bg-primary" : "bg-border"}`}>
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-all ${notifications ? "left-5" : "left-0.5"}`} />
          </button>
        </div>
      </div>

      {/* Update Modal */}
      {showUpdate && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Atualizacao Disponivel v{pendingUpdate.version}</h3>
                <p className="text-[10px] text-muted-foreground font-display">ORQUESTRADOR MAESTRO</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5"><Cpu className="w-3 h-3 text-primary" /> Novas Funcionalidades</h4>
                <ul className="space-y-1">
                  {pendingUpdate.features.map((f) => (
                    <li key={f} className="text-xs text-muted-foreground flex items-start gap-2"><CheckCircle2 className="w-3 h-3 text-ai-active flex-shrink-0 mt-0.5" />{f}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5"><AlertCircle className="w-3 h-3 text-ai-processing" /> Riscos</h4>
                <ul className="space-y-1">
                  {pendingUpdate.risks.map((r) => (
                    <li key={r} className="text-xs text-muted-foreground flex items-start gap-2"><span className="text-ai-processing">!</span>{r}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3 bg-ai-active/5 border border-ai-active/20 rounded-lg">
                <p className="text-xs text-ai-active">{pendingUpdate.impact}</p>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowUpdate(false)} className="flex-1 py-2.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground transition-all">Agora Nao</button>
              <button onClick={() => setShowUpdate(false)} className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">Atualizar Sistema</button>
            </div>
          </div>
        </div>
      )}

      {/* System Info */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <OrchestratorBust size="small" className="w-14 h-14" />
          <div>
            <h3 className="text-sm font-bold text-foreground">ORQUESTRADOR MAESTRO</h3>
            <p className="text-xs text-muted-foreground font-display">v1.0.0 | Sistema Privado | Admin Only</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">React + Vite + Zustand + 200 IAs Autonomas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
