import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard, Users, Briefcase, Activity, Shield, Bot, Link2, FileText,
  Settings, MessageSquare, LogOut, Menu, X, ChevronLeft, Zap, Store, Crown,
  BarChart3, PenTool, Brain, Download, DollarSign, Key, MapPin, Boxes, Bell, UserCog, Radio,
  Factory, GitBranch, Compass, Calculator, Radar, Sparkles, Rocket, FileSignature, ShieldAlert, Eye, Palette,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import OrchestratorBust from "@/components/OrchestratorBust";
import { useThemeStore } from "@/stores/themeStore";

const adminOnlySections = ["SISTEMA"];

const navSections = [
  {
    title: "DOMINUS AI",
    items: [
      { href: "/admin/dominus", label: "DOMINUS AI", icon: Brain },
      { href: "/admin/market-prediction", label: "Market Prediction", icon: Sparkles },
    ],
  },
  {
    title: "COMANDO",
    items: [
      { href: "/admin/dashboard", label: "Painel Global", icon: LayoutDashboard },
      { href: "/admin/command-center", label: "AI Command Center", icon: Radio },
      { href: "/admin/production", label: "AI Production Center", icon: Factory },
      { href: "/admin/workflows", label: "Workflow Viewer", icon: GitBranch },
      { href: "/admin/operations", label: "AI Operations", icon: Eye },
    ],
  },
  {
    title: "ESTRATÉGIA",
    items: [
      { href: "/admin/strategy", label: "Strategy Engine", icon: Compass },
      { href: "/admin/roi", label: "ROI Simulator", icon: Calculator },
      { href: "/admin/competitors", label: "Competitor Radar", icon: Radar },
      { href: "/admin/opportunities", label: "Opportunity Detector", icon: Sparkles },
      { href: "/admin/auto-scale", label: "Auto Scale AI", icon: Rocket },
    ],
  },
  {
    title: "OPERAÇÕES",
    items: [
      { href: "/admin/clients", label: "Clientes", icon: Users },
      { href: "/admin/risk", label: "Risco de Clientes", icon: ShieldAlert },
      { href: "/admin/services", label: "Serviços", icon: Briefcase },
      { href: "/admin/automations", label: "Automações", icon: Zap },
      { href: "/admin/briefing", label: "Briefing & Intake", icon: FileText },
      { href: "/admin/leads", label: "Gestão de Leads", icon: Users },
      { href: "/admin/sales-agent", label: "Agente de Vendas IA", icon: Crown },
      { href: "/admin/copymaster", label: "CopyMaster AI", icon: PenTool },
      { href: "/admin/google-business", label: "Google Meu Negócio IA", icon: MapPin },
      { href: "/admin/affiliates", label: "Afiliados", icon: Store },
    ],
  },
  {
    title: "FINANCEIRO",
    items: [
      { href: "/admin/financial", label: "Financeiro", icon: DollarSign },
      { href: "/admin/contracts", label: "Contratos", icon: FileSignature },
      { href: "/admin/proposals", label: "Propostas", icon: FileText },
    ],
  },
  {
    title: "INTELIGÊNCIA",
    items: [
      { href: "/admin/monitoring", label: "Monitoramento IA", icon: Activity },
      { href: "/admin/memory", label: "Memória Estratégica", icon: Brain },
      { href: "/admin/reports", label: "Relatórios", icon: BarChart3 },
      { href: "/admin/agent-forge", label: "Agent Builder", icon: Boxes },
      { href: "/admin/assistant", label: "Maestro AI Chat", icon: Bot },
    ],
  },
  {
    title: "SISTEMA",
    items: [
      { href: "/admin/governance", label: "Governança", icon: Crown },
      { href: "/admin/audit", label: "Logs & Auditoria", icon: Shield },
      { href: "/admin/credentials", label: "Credenciais", icon: UserCog },
      { href: "/admin/api-keys", label: "Chaves de API", icon: Key },
      { href: "/admin/integrations", label: "Integrações", icon: Link2 },
      { href: "/admin/install", label: "Instalar App", icon: Download },
      { href: "/admin/settings", label: "Configurações", icon: Settings },
      { href: "/admin/themes", label: "Temas & Custom.", icon: Palette },
    ],
  },
];

const allNavItems = navSections.flatMap((s) => s.items);

const initialNotifications = [
  { id: 1, text: "Sistema online há 24h sem interrupções", type: "success", time: "2min", read: false },
  { id: 2, text: "IA-CopyMaster gerou 5 anúncios para Tech Solutions", type: "info", time: "5min", read: false },
  { id: 3, text: "Campanha E-commerce escalada +20% automaticamente", type: "info", time: "15min", read: false },
  { id: 4, text: "Alerta: InfoProduto BR — 2 meses sem pagamento", type: "warning", time: "1h", read: false },
  { id: 5, text: "Novo concorrente detectado: Growth Lab", type: "info", time: "2h", read: false },
  { id: 6, text: "Oportunidade detectada: IA para PMEs (+340%)", type: "success", time: "3h", read: false },
  { id: 7, text: "Novo briefing recebido: Bella Estética", type: "info", time: "4h", read: false },
  { id: 8, text: "Lead qualificado: Pedro Mendes (Score 92)", type: "success", time: "5h", read: false },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const { profileName, profileSlogan, profileAvatar, programName, programVersion } = useThemeStore();

  const authRole = localStorage.getItem("auth_role") || "admin";
  const isAdmin = authRole === "admin";
  const userName = isAdmin ? profileName : (localStorage.getItem("auth_user_name") || "Usuário");

  useEffect(() => {
    const authed = localStorage.getItem("auth_role");
    if (!authed) navigate("/");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("auth_role");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_user_name");
    navigate("/");
  };

  const filteredSections = navSections.filter(s => {
    if (!isAdmin && adminOnlySections.includes(s.title)) return false;
    return true;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {mobileOpen && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      <aside className={`fixed lg:relative z-50 h-full flex flex-col border-r border-border bg-card transition-all duration-300 ${collapsed ? "w-16" : "w-60"} ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center gap-3 p-4 border-b border-border min-h-[64px]">
          <OrchestratorBust size="small" className="w-8 h-8 flex-shrink-0" />
          {!collapsed && (
            <div className="overflow-hidden">
              <h2 className="text-sm font-bold text-foreground truncate font-display">{programName}</h2>
              <p className="text-[10px] font-semibold text-primary truncate">Centro de Operações Digitais</p>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex ml-auto text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden ml-auto text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {filteredSections.map((section) => (
            <div key={section.title} className="mb-2">
              {!collapsed && <p className="px-3 py-1.5 text-[9px] font-bold tracking-[0.2em] text-muted-foreground uppercase">{section.title}</p>}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} to={item.href} onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all ${isActive ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"} ${collapsed ? "justify-center" : ""}`}
                      title={collapsed ? item.label : undefined}>
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-2 border-t border-border">
          {!collapsed && !isAdmin && (
            <div className="px-3 py-1.5 mb-1">
              <span className="text-[9px] px-2 py-0.5 bg-accent/10 text-accent rounded-full font-semibold">USUÁRIO</span>
            </div>
          )}
          {!collapsed && isAdmin && (
            <div className="px-3 py-1.5 mb-1">
              <span className="text-[9px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-semibold">ADMIN</span>
            </div>
          )}
          <button onClick={handleLogout} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all w-full ${collapsed ? "justify-center" : ""}`}>
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground"><Menu className="w-5 h-5" /></button>
            <div>
              <h1 className="text-sm font-semibold text-foreground">
                {allNavItems.find((n) => n.href === pathname || (n.href !== "/dashboard" && pathname.startsWith(n.href)))?.label || "Painel"}
              </h1>
              <p className="text-[10px] font-display text-muted-foreground">{programName} MAESTRO {programVersion}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-display">
              <span className="w-2 h-2 rounded-full bg-green-400 glow-pulse" />
              <span className="text-muted-foreground hidden sm:inline">Sistema Online 24/7</span>
            </div>

            <div className="flex items-center gap-2">
              {profileAvatar && <img src={profileAvatar} alt="Avatar" className="w-7 h-7 rounded-full object-cover border border-border" />}
              <div className="text-right hidden sm:block">
                <div className="text-xs text-foreground font-display">{userName}</div>
                <div className="text-[10px] text-muted-foreground font-command">{isAdmin ? profileSlogan : "Operador"}</div>
              </div>
            </div>

            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-all">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">{notifications.filter(n => !n.read).length}</span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-border flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-foreground">Notificações</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-primary font-display">{notifications.filter(n => !n.read).length} novas</span>
                      <button onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))} className="text-[9px] text-muted-foreground hover:text-foreground">Marcar todas lidas</button>
                    </div>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: !x.read } : x))}
                        className={`flex items-start gap-3 p-3 cursor-pointer transition-colors border-b border-border/50 last:border-0 ${n.read ? "opacity-50 hover:opacity-80" : "hover:bg-secondary/30"}`}>
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.read ? "bg-muted" : n.type === "success" ? "bg-green-400" : n.type === "warning" ? "bg-amber-400" : "bg-accent"}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-relaxed ${n.read ? "text-muted-foreground" : "text-foreground font-medium"}`}>{n.text}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{n.time} atrás</p>
                        </div>
                        <span className="text-[8px] text-muted-foreground mt-1">{n.read ? "✓ Lida" : "●"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/admin/assistant" className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-primary text-xs hover:bg-primary/20 transition-all">
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Assistente</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-background bg-orchestrator">{children}</main>
      </div>
    </div>
  );
}
