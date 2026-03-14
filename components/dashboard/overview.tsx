"use client"

import Image from "next/image"
import { Users, Briefcase, Zap, Activity, Shield, Clock, ArrowUpRight, DollarSign, Boxes, MapPin, Key } from "lucide-react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

const chartData = [
  { name: "Jan", servicos: 4, automacoes: 2 },
  { name: "Fev", servicos: 7, automacoes: 5 },
  { name: "Mar", servicos: 5, automacoes: 8 },
  { name: "Abr", servicos: 9, automacoes: 6 },
  { name: "Mai", servicos: 12, automacoes: 10 },
  { name: "Jun", servicos: 8, automacoes: 12 },
]

const performanceData = [
  { name: "Seg", uptime: 99.8, response: 120 },
  { name: "Ter", uptime: 99.9, response: 105 },
  { name: "Qua", uptime: 100, response: 98 },
  { name: "Qui", uptime: 99.7, response: 130 },
  { name: "Sex", uptime: 99.9, response: 110 },
  { name: "Sab", uptime: 100, response: 95 },
  { name: "Dom", uptime: 100, response: 88 },
]

interface OverviewProps {
  stats: { clients: number; services: number; automations: number }
  recentAudit: Array<Record<string, unknown>>
  aiMonitors: Array<Record<string, unknown>>
  recentServices: Array<Record<string, unknown>>
}

export function DashboardOverview({ stats, recentAudit, aiMonitors, recentServices }: OverviewProps) {
  const statCards = [
    { label: "Clientes Ativos", value: stats.clients, icon: Users, color: "#0dbfb3", href: "/dashboard/clients" },
    { label: "Servicos em Andamento", value: stats.services, icon: Briefcase, color: "#3b82f6", href: "/dashboard/services" },
    { label: "Automacoes Ativas", value: stats.automations, icon: Zap, color: "#f59e0b", href: "/dashboard/automations" },
    { label: "IAs Monitoradas", value: aiMonitors.length, icon: Activity, color: "#22c55e", href: "/dashboard/monitoring" },
  ]

  return (
    <div className="space-y-6">
      {/* Hero Section with Robot */}
      <div className="relative rounded-xl overflow-hidden border border-border bg-card p-6 lg:p-8">
        <div className="absolute right-0 top-0 w-48 h-full opacity-20 lg:opacity-30">
          <Image src="/images/orquestrador-robot.jpg" alt="" fill sizes="192px" className="object-cover" />
        </div>
        <div className="relative z-10">
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-primary mb-1">Centro de Operacoes Digitais</p>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground text-balance">
            Painel de Comando MAESTRO
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-lg">
            Visao completa ponta a ponta: servicos, producao, automacoes, financeiro, IAs e performance de cada cliente.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group relative rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
            </Link>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Servicos & Automacoes</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 15% 16%)" />
              <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "hsl(210 18% 8%)", border: "1px solid hsl(210 15% 16%)", borderRadius: "8px", color: "#e5e7eb" }}
              />
              <Bar dataKey="servicos" fill="#0dbfb3" radius={[4, 4, 0, 0]} />
              <Bar dataKey="automacoes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Performance das IAs</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 15% 16%)" />
              <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "hsl(210 18% 8%)", border: "1px solid hsl(210 15% 16%)", borderRadius: "8px", color: "#e5e7eb" }}
              />
              <Line type="monotone" dataKey="uptime" stroke="#22c55e" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="response" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row: Recent activity + AI monitors */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent Audit */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Auditoria Recente
            </h3>
            <Link href="/dashboard/audit" className="text-xs text-primary hover:underline">Ver todos</Link>
          </div>
          <div className="space-y-2">
            {recentAudit.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">Nenhum registro de auditoria ainda.</p>
            ) : (
              recentAudit.slice(0, 5).map((log: Record<string, unknown>) => (
                <div key={log.id as string} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    log.severity === "error" ? "bg-destructive" : log.severity === "warning" ? "bg-yellow-500" : "bg-green-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground truncate">{log.action as string}</p>
                    <p className="text-[10px] text-muted-foreground">{log.source as string}</p>
                  </div>
                  <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Services */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-400" />
              Servicos Recentes
            </h3>
            <Link href="/dashboard/services" className="text-xs text-primary hover:underline">Ver todos</Link>
          </div>
          <div className="space-y-2">
            {recentServices.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">Nenhum servico cadastrado ainda.</p>
            ) : (
              recentServices.slice(0, 5).map((svc: Record<string, unknown>) => (
                <div key={svc.id as string} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    svc.status === "active" ? "bg-green-500" : svc.status === "pending" ? "bg-yellow-500" : "bg-muted-foreground"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground truncate">{svc.type as string}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {(svc.clients as Record<string, unknown>)?.name as string || "Sem cliente"}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">{svc.platform as string}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <Link href="/dashboard/financial" className="group p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
              <DollarSign className="w-4 h-4 text-green-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-muted-foreground font-medium">Financeiro</p>
              <p className="text-xs font-semibold text-foreground mt-0.5">R$ 12.450,80</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">Gastos este mês</p>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/agent-forge" className="group p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
              <Boxes className="w-4 h-4 text-purple-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-muted-foreground font-medium">Agent Forge</p>
              <p className="text-xs font-semibold text-foreground mt-0.5">8 Agentes</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">Ativos e testados</p>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/google-business" className="group p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
              <MapPin className="w-4 h-4 text-orange-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-muted-foreground font-medium">Google Negocio</p>
              <p className="text-xs font-semibold text-foreground mt-0.5">5 Cadastros</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">Otimizacao em progresso</p>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/api-keys" className="group p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
              <Key className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-muted-foreground font-medium">API Keys</p>
              <p className="text-xs font-semibold text-foreground mt-0.5">12 Sincronizadas</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">Todas ativas</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
