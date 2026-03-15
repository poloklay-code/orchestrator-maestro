import { Link } from "react-router-dom";
import { Users, Briefcase, Zap, Activity, Shield, Clock, ArrowUpRight, DollarSign, Boxes, MapPin, Key, TrendingUp, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend } from "recharts";
import OrchestratorBust from "@/components/OrchestratorBust";
import AIGrid from "@/components/AIGrid";

const chartData = [
  { name: "Jan", servicos: 4, automacoes: 2 },
  { name: "Fev", servicos: 7, automacoes: 5 },
  { name: "Mar", servicos: 5, automacoes: 8 },
  { name: "Abr", servicos: 9, automacoes: 6 },
  { name: "Mai", servicos: 12, automacoes: 10 },
  { name: "Jun", servicos: 8, automacoes: 12 },
];

const performanceData = [
  { name: "Seg", uptime: 99.8, response: 120 },
  { name: "Ter", uptime: 99.9, response: 105 },
  { name: "Qua", uptime: 100, response: 98 },
  { name: "Qui", uptime: 99.7, response: 130 },
  { name: "Sex", uptime: 99.9, response: 110 },
  { name: "Sab", uptime: 100, response: 95 },
  { name: "Dom", uptime: 100, response: 88 },
];

const revenueData = [
  { mes: "Jan", receita: 8500, gastos: 3200 },
  { mes: "Fev", receita: 12400, gastos: 4100 },
  { mes: "Mar", receita: 15800, gastos: 5300 },
  { mes: "Abr", receita: 14200, gastos: 4800 },
  { mes: "Mai", receita: 18600, gastos: 6100 },
  { mes: "Jun", receita: 22000, gastos: 7200 },
];

const clientDistribution = [
  { name: "Tráfego Pago", value: 35, fill: "hsl(var(--primary))" },
  { name: "Automações", value: 25, fill: "hsl(var(--accent))" },
  { name: "Copywriting", value: 20, fill: "hsl(142, 70%, 45%)" },
  { name: "SEO/GBP", value: 12, fill: "hsl(35, 80%, 55%)" },
  { name: "Chatbots", value: 8, fill: "hsl(270, 60%, 60%)" },
];

const statCards = [
  { label: "Clientes Ativos", value: 24, icon: Users, color: "hsl(var(--ai-active))", href: "/dashboard/clients" },
  { label: "Servicos em Andamento", value: 38, icon: Briefcase, color: "hsl(var(--accent))", href: "/dashboard/services" },
  { label: "Automacoes Ativas", value: 56, icon: Zap, color: "hsl(var(--ai-processing))", href: "/dashboard/automations" },
  { label: "IAs Monitoradas", value: 200, icon: Activity, color: "hsl(var(--ai-active))", href: "/dashboard/monitoring" },
];

const recentAudit = [
  { id: "1", action: "Campanha Meta Ads otimizada automaticamente", severity: "info", source: "IA-Trafego" },
  { id: "2", action: "Novo cliente cadastrado: Tech Solutions", severity: "info", source: "admin" },
  { id: "3", action: "Alerta de budget excedido em Google Ads", severity: "warning", source: "IA-Monitor" },
  { id: "4", action: "Backup automatico concluido", severity: "info", source: "system" },
  { id: "5", action: "Tentativa de acesso nao autorizado bloqueada", severity: "error", source: "security" },
];

const recentServices = [
  { id: "1", type: "Gestao de Trafego", status: "active", clients: { name: "Tech Solutions" }, platform: "Meta Ads" },
  { id: "2", type: "Automacao Completa", status: "active", clients: { name: "StartupXYZ" }, platform: "n8n" },
  { id: "3", type: "Assistente IA", status: "pending", clients: { name: "E-commerce Plus" }, platform: "WhatsApp" },
  { id: "4", type: "Copywriting", status: "active", clients: { name: "Agencia Digital" }, platform: "Multi" },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative rounded-xl overflow-hidden border border-border bg-card p-6 lg:p-8">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-32 h-32 opacity-20 lg:opacity-30">
          <OrchestratorBust size="small" className="w-full h-full" />
        </div>
        <div className="relative z-10">
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-primary mb-1 font-display">Centro de Operacoes Digitais</p>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Painel de Comando <span className="text-gold-gradient">MAESTRO</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-lg">
            Visao completa ponta a ponta: servicos, producao, automacoes, financeiro, IAs e performance de cada cliente.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} to={card.href} className="group relative rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Servicos & Automacoes</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
              <Bar dataKey="servicos" fill="hsl(var(--ai-active))" radius={[4, 4, 0, 0]} name="Serviços" />
              <Bar dataKey="automacoes" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Automações" />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Performance das IAs</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
              <Line type="monotone" dataKey="uptime" stroke="hsl(var(--ai-active))" strokeWidth={2.5} dot={{ r: 3, fill: "hsl(var(--ai-active))" }} name="Uptime %" />
              <Line type="monotone" dataKey="response" stroke="hsl(var(--ai-processing))" strokeWidth={2} dot={{ r: 3 }} name="Response ms" />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Receita vs Gastos
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="recGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} formatter={(value: number) => `R$ ${value.toLocaleString()}`} />
              <Area type="monotone" dataKey="receita" stroke="hsl(142, 70%, 45%)" fill="url(#recGrad)" strokeWidth={2.5} name="Receita" />
              <Area type="monotone" dataKey="gastos" stroke="hsl(var(--destructive))" fill="url(#gastGrad)" strokeWidth={1.5} name="Gastos" />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-accent" /> Distribuição de Serviços
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={clientDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={4} dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {clientDistribution.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Audit + Services */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" /> Auditoria Recente
            </h3>
            <Link to="/dashboard/audit" className="text-xs text-primary hover:underline">Ver todos</Link>
          </div>
          <div className="space-y-2">
            {recentAudit.map((log) => (
              <div key={log.id} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${log.severity === "error" ? "bg-destructive" : log.severity === "warning" ? "bg-ai-processing" : "bg-ai-active"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground truncate">{log.action}</p>
                  <p className="text-[10px] text-muted-foreground">{log.source}</p>
                </div>
                <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-accent" /> Servicos Recentes
            </h3>
            <Link to="/dashboard/services" className="text-xs text-primary hover:underline">Ver todos</Link>
          </div>
          <div className="space-y-2">
            {recentServices.map((svc) => (
              <div key={svc.id} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${svc.status === "active" ? "bg-ai-active" : "bg-ai-processing"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground truncate">{svc.type}</p>
                  <p className="text-[10px] text-muted-foreground">{svc.clients.name}</p>
                </div>
                <span className="text-[10px] font-display text-muted-foreground">{svc.platform}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { href: "/dashboard/financial", icon: DollarSign, color: "text-ai-active", bg: "bg-ai-active/10", label: "Financeiro", value: "R$ 12.450,80", sub: "Gastos este mes" },
          { href: "/dashboard/agent-forge", icon: Boxes, color: "text-primary", bg: "bg-primary/10", label: "Agent Forge", value: "8 Agentes", sub: "Ativos e testados" },
          { href: "/dashboard/google-business", icon: MapPin, color: "text-ai-processing", bg: "bg-ai-processing/10", label: "Google Negocio", value: "5 Cadastros", sub: "Otimizacao em progresso" },
          { href: "/dashboard/api-keys", icon: Key, color: "text-accent", bg: "bg-accent/10", label: "API Keys", value: "12 Sincronizadas", sub: "Todas ativas" },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} to={card.href} className="group p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-all">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-muted-foreground font-medium">{card.label}</p>
                  <p className="text-xs font-semibold text-foreground mt-0.5">{card.value}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{card.sub}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Neural Grid */}
      <div>
        <h3 className="text-sm font-display text-muted-foreground mb-4 uppercase tracking-wider">GRID NEURAL — 200 AGENTES</h3>
        <AIGrid />
      </div>
    </div>
  );
}
