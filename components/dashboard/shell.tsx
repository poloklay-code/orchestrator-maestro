"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { UserCog } from "lucide-react"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Activity,
  Shield,
  Bot,
  Link2,
  FileText,
  Settings,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Zap,
  Store,
  Crown,
  BarChart3,
  PenTool,
  Brain,
  Download,
  DollarSign,
  Key,
  MapPin,
  Boxes,
  Bell,
  Eye,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/dashboard/clients", label: "Clientes", icon: Users },
  { href: "/dashboard/services", label: "Servicos", icon: Briefcase },
  { href: "/dashboard/governance", label: "Governanca", icon: Crown },
  { href: "/dashboard/monitoring", label: "Monitoramento IA", icon: Activity },
  { href: "/dashboard/audit", label: "Auditoria", icon: Shield },
  { href: "/dashboard/automations", label: "Automacoes", icon: Zap },
  { href: "/dashboard/affiliates", label: "Afiliados", icon: Store },
  { href: "/dashboard/copymaster", label: "CopyMaster", icon: PenTool },
  { href: "/dashboard/proposals", label: "Propostas", icon: FileText },
  { href: "/dashboard/reports", label: "Relatorios", icon: BarChart3 },
  { href: "/dashboard/memory", label: "Memoria Estrategica", icon: Brain },
  { href: "/dashboard/financial", label: "Financeiro", icon: DollarSign },
  { href: "/dashboard/api-keys", label: "Chaves de API", icon: Key },
  { href: "/dashboard/credentials", label: "Credenciais Clientes", icon: UserCog },
  { href: "/dashboard/google-business", label: "Google Meu Negocio", icon: MapPin },
  { href: "/dashboard/agent-forge", label: "Agent Forge", icon: Boxes },
  { href: "/dashboard/integrations", label: "Integracoes", icon: Link2 },
  { href: "/dashboard/assistant", label: "Assistente IA", icon: Bot },
  { href: "/dashboard/install", label: "Instalar App", icon: Download },
  { href: "/dashboard/settings", label: "Configuracoes", icon: Settings },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const notifications = [
    { id: 1, text: "Sistema online ha 24h sem interrupcoes", type: "success", time: "2min" },
    { id: 2, text: "Nova automacao concluida com sucesso", type: "info", time: "15min" },
    { id: 3, text: "Atualizacao v1.1.0 disponivel", type: "warning", time: "1h" },
    { id: 4, text: "Relatorio semanal pronto para revisao", type: "info", time: "2h" },
  ]

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
  }

  return (
    <div className="flex h-screen overflow-hidden">
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
          <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-primary/30">
            <Image src="/images/orquestrador-robot.jpg" alt="Maestro" fill sizes="32px" className="object-cover" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h2 className="text-sm font-bold text-foreground truncate">ORQUESTRADOR</h2>
              <p className="text-[10px] font-semibold text-primary truncate">Centro de Operacoes Digitais</p>
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
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                } ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            )
          })}
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
                {navItems.find((n) => n.href === pathname || (n.href !== "/dashboard" && pathname.startsWith(n.href)))?.label || "Painel"}
              </h1>
              <p className="text-[10px] font-mono text-muted-foreground">ORQUESTRADOR MAESTRO v1.0.0</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-muted-foreground hidden sm:inline">Sistema Online</span>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-all"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">{notifications.length}</span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-border flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-foreground">Notificacoes</h4>
                    <span className="text-[10px] text-primary font-mono">{notifications.length} novas</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="flex items-start gap-3 p-3 hover:bg-secondary/30 transition-colors border-b border-border/50 last:border-0">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          n.type === "success" ? "bg-green-500" : n.type === "warning" ? "bg-yellow-500" : "bg-blue-400"
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-foreground leading-relaxed">{n.text}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{n.time} atras</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-border">
                    <button className="w-full py-1.5 text-[10px] text-primary hover:text-foreground transition-colors">
                      Ver todas as notificacoes
                    </button>
                  </div>
                </div>
              )}
            </div>
            <Link
              href="/dashboard/assistant"
              className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-primary text-xs hover:bg-primary/20 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Assistente</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
