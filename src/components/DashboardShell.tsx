import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard, Users, Briefcase, Activity, Shield, Bot, Link2, FileText,
  Settings, MessageSquare, LogOut, Menu, X, ChevronLeft, Zap, Store, Crown,
  BarChart3, PenTool, Brain, Download, DollarSign, Key, MapPin, Boxes, Bell, UserCog, Radio,
  Factory, GitBranch, Compass, Calculator, Radar, Sparkles, Rocket, FileSignature, ShieldAlert, Eye, Palette,
} from "lucide-react";
import OrchestratorBust from "@/components/OrchestratorBust";
import { useThemeStore } from "@/stores/themeStore";

const navSections = [
  {
    title: "COMANDO",
    items: [
      { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
      { href: "/dashboard/command-center", label: "AI Command Center", icon: Radio },
      { href: "/dashboard/production", label: "Produção IA", icon: Factory },
      { href: "/dashboard/workflows", label: "Workflows", icon: GitBranch },
      { href: "/dashboard/operations", label: "AI Operations", icon: Eye },
    ],
  },
  {
    title: "ESTRATÉGIA",
    items: [
      { href: "/dashboard/strategy", label: "Strategy Engine", icon: Compass },
      { href: "/dashboard/roi", label: "ROI Simulator", icon: Calculator },
      { href: "/dashboard/competitors", label: "Competitor Radar", icon: Radar },
      { href: "/dashboard/opportunities", label: "Oportunidades", icon: Sparkles },
      { href: "/dashboard/auto-scale", label: "Auto Scale AI", icon: Rocket },
    ],
  },
  {
    title: "OPERAÇÕES",
    items: [
      { href: "/dashboard/clients", label: "Clientes", icon: Users },
      { href: "/dashboard/risk", label: "Risco de Clientes", icon: ShieldAlert },
      { href: "/dashboard/services", label: "Serviços", icon: Briefcase },
      { href: "/dashboard/automations", label: "Automações", icon: Zap },
      { href: "/dashboard/copymaster", label: "CopyMaster", icon: PenTool },
      { href: "/dashboard/google-business", label: "Google Negócio", icon: MapPin },
      { href: "/dashboard/affiliates", label: "Afiliados", icon: Store },
    ],
  },
  {
    title: "FINANCEIRO",
    items: [
      { href: "/dashboard/financial", label: "Financeiro", icon: DollarSign },
      { href: "/dashboard/contracts", label: "Contratos", icon: FileSignature },
      { href: "/dashboard/proposals", label: "Propostas", icon: FileText },
    ],
  },
  {
    title: "INTELIGÊNCIA",
    items: [
      { href: "/dashboard/monitoring", label: "Monitoramento IA", icon: Activity },
      { href: "/dashboard/memory", label: "Memória Estratégica", icon: Brain },
      { href: "/dashboard/reports", label: "Relatórios", icon: BarChart3 },
      { href: "/dashboard/agent-forge", label: "Agent Forge", icon: Boxes },
      { href: "/dashboard/assistant", label: "Assistente IA", icon: Bot },
    ],
  },
  {
    title: "SISTEMA",
    items: [
      { href: "/dashboard/governance", label: "Governança", icon: Crown },
      { href: "/dashboard/audit", label: "Auditoria", icon: Shield },
      { href: "/dashboard/credentials", label: "Credenciais", icon: UserCog },
      { href: "/dashboard/api-keys", label: "Chaves de API", icon: Key },
      { href: "/dashboard/integrations", label: "Integrações", icon: Link2 },
      { href: "/dashboard/install", label: "Instalar App", icon: Download },
      { href: "/dashboard/settings", label: "Configurações", icon: Settings },
      { href: "/dashboard/themes", label: "Temas & Custom.", icon: Palette },
    ],
  },
];

const allNavItems = navSections.flatMap((s) => s.items);

const notifications = [
  { id: 1, text: "Sistema online há 24h sem interrupções", type: "success", time: "2min" },
  { id: 2, text: "IA-CopyMaster gerou 5 anúncios para Tech Solutions", type: "info", time: "5min" },
  { id: 3, text: "Campanha E-commerce escalada +20% automaticamente", type: "info", time: "15min" },
  { id: 4, text: "Alerta: InfoProduto BR — 2 meses sem pagamento", type: "warning", time: "1h" },
  { id: 5, text: "Novo concorrente detectado: Growth Lab", type: "info", time: "2h" },
  { id: 6, text: "Oportunidade detectada: IA para PMEs (+340%)", type: "success", time: "3h" },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const { profileName, profileSlogan, profileAvatar, programName, programVersion } = useThemeStore();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative z-50 h-full flex flex-col border-r border-border bg-card transition-all duration-300 ${
          collapsed ? "w-16" : "w-60"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-border min-h-[64px]">
          <OrchestratorBust size="small" className="w-8 h-8 flex-shrink-0" />
          {!collapsed && (
            <div className="overflow-hidden">
              <h2 className="text-sm font-bold text-foreground truncate font-display">{programName}</h2>
              <p className="text-[10px] font-semibold text-primary truncate">Centro de Operações Digitais</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex ml-auto text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden ml-auto text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {navSections.map((section) => (
            <div key={section.title} className="mb-2">
              {!collapsed && (
                <p className="px-3 py-1.5 text-[9px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      } ${collapsed ? "justify-center" : ""}`}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-2 border-t border-border">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all w-full ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>
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

            {/* Profile */}
            <div className="flex items-center gap-2">
              {profileAvatar && (
                <img src={profileAvatar} alt="Avatar" className="w-7 h-7 rounded-full object-cover border border-border" />
              )}
              <div className="text-right hidden sm:block">
                <div className="text-xs text-foreground font-display">{profileName}</div>
                <div className="text-[10px] text-muted-foreground font-command">{profileSlogan}</div>
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-all"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-border flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-foreground">Notificações</h4>
                    <span className="text-[10px] text-primary font-display">{notifications.length} novas</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="flex items-start gap-3 p-3 hover:bg-secondary/30 transition-colors border-b border-border/50 last:border-0">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          n.type === "success" ? "bg-green-400" : n.type === "warning" ? "bg-amber-400" : "bg-accent"
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-foreground leading-relaxed">{n.text}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{n.time} atrás</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/dashboard/assistant"
              className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-primary text-xs hover:bg-primary/20 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Assistente</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-background bg-orchestrator">
          {children}
        </main>
      </div>
    </div>
  );
}
