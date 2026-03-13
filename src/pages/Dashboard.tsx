import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import AIGrid from "@/components/AIGrid";
import OrchestratorBust from "@/components/OrchestratorBust";
import { useThemeStore } from "@/stores/themeStore";

const NAV_ITEMS = [
  { id: "command", label: "COMANDO", icon: "⬡" },
  { id: "agents", label: "AGENTES", icon: "◈" },
  { id: "themes", label: "TEMAS", icon: "◉" },
  { id: "settings", label: "CONFIG", icon: "⚙" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("command");
  const [uptime, setUptime] = useState(0);
  const { profileName, profileSlogan, profileAvatar } = useThemeStore();

  useEffect(() => {
    const interval = setInterval(() => setUptime(p => p + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background bg-orchestrator">
      {/* Top Bar */}
      <header className="h-14 border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <OrchestratorBust size="small" className="w-8 h-8" />
          <span className="font-display text-sm text-foreground tracking-wider">AETHER ORCHESTRATOR</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="font-display text-xs text-muted-foreground">
            UPTIME <span className="text-ai-active">{formatUptime(uptime)}</span>
          </span>
          <span className="flex items-center gap-2 text-xs font-display">
            <span className="h-2 w-2 rounded-full bg-ai-processing glow-pulse" />
            <span className="text-foreground">24/7 ATIVO</span>
          </span>
          <div className="flex items-center gap-2">
            {profileAvatar && (
              <img src={profileAvatar} alt="Avatar" className="w-7 h-7 rounded-full object-cover border border-border" />
            )}
            <div className="text-right">
              <div className="text-xs text-foreground font-display">{profileName}</div>
              <div className="text-[10px] text-muted-foreground font-command">{profileSlogan}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-16 lg:w-48 border-r border-border min-h-[calc(100vh-3.5rem)] py-4 flex flex-col gap-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (item.id === "themes") navigate("/themes");
              }}
              className={`flex items-center gap-3 px-4 py-3 text-xs font-display transition-all ${
                activeTab === item.id
                  ? "bg-primary/10 text-primary border-r-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="hidden lg:inline uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 space-y-8 overflow-auto">
          {activeTab === "command" && <CommandCenter />}
          {activeTab === "agents" && <AgentsView />}
          {activeTab === "settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
}

function CommandCenter() {
  const stats = [
    { label: "IAs ATIVAS", value: "187", sub: "/200", color: "text-ai-processing" },
    { label: "TAREFAS/MIN", value: "1,247", sub: "", color: "text-ai-active" },
    { label: "CPU NEURAL", value: "94", sub: "%", color: "text-foreground" },
    { label: "LATÊNCIA", value: "12", sub: "ms", color: "text-ai-active" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-lg font-display text-foreground tracking-wider">CENTRO DE COMANDO</h2>
        <p className="text-xs text-muted-foreground font-command mt-1">OPERAÇÃO CONTÍNUA — 200 AGENTES AUTÔNOMOS</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="card-aether rounded-lg p-4 space-y-1">
            <span className="text-[10px] font-display text-muted-foreground uppercase tracking-wider">{s.label}</span>
            <div className={`text-2xl font-display ${s.color}`}>
              {s.value}<span className="text-sm text-muted-foreground">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Grid Neural */}
      <div>
        <h3 className="text-sm font-display text-muted-foreground mb-4 uppercase tracking-wider">GRID NEURAL — 200 AGENTES</h3>
        <AIGrid />
      </div>
    </motion.div>
  );
}

function AgentsView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-lg font-display text-foreground tracking-wider">FROTA DE AGENTES</h2>
      <AIGrid />
    </motion.div>
  );
}

function SettingsView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-lg font-display text-foreground tracking-wider">CONFIGURAÇÕES</h2>
      <div className="card-aether rounded-lg p-6 space-y-4">
        <h3 className="text-sm font-display text-foreground">OPERAÇÃO 24/7</h3>
        <div className="space-y-3 text-xs font-display text-muted-foreground">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span>MODO PERSISTENTE</span>
            <span className="text-ai-active">ATIVO</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span>BACKGROUND SERVICE</span>
            <span className="text-ai-active">ATIVO</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span>OVERLAY MODE (MOBILE)</span>
            <span className="text-ai-active">ATIVO</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span>SYNC DESKTOP ↔ MOBILE</span>
            <span className="text-ai-active">SINCRONIZADO</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span>LOCK SCREEN MONITOR</span>
            <span className="text-ai-active">ATIVO</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span>AGENTES AUTÔNOMOS</span>
            <span className="text-ai-processing">200/200</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
