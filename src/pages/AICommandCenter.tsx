import { useState, useEffect } from "react";
import { Activity, Zap, Users, TrendingUp, Radio, Bot, Target, ShoppingCart, MessageSquare, Globe, Eye, Phone, Mail, BarChart3, Clock, CheckCircle2, AlertTriangle, Cpu, Layers, ArrowUpRight, RefreshCw, Play, Pause, Shield } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

/* ── Live Data Simulation ── */
const generateLiveMetric = () => Math.floor(Math.random() * 100);

const aiAgents = [
  { id: "ia-01", name: "IA Tráfego Meta", type: "Gestão de Tráfego", status: "running", cpu: 72, tasks: 14, client: "Studio Digital Pro", uptime: "99.8%" },
  { id: "ia-02", name: "IA Google Ads", type: "Gestão de Tráfego", status: "running", cpu: 65, tasks: 11, client: "Restaurante Sabor", uptime: "99.9%" },
  { id: "ia-03", name: "IA Copywriter", type: "Copywriting", status: "running", cpu: 45, tasks: 8, client: "Tech Solutions", uptime: "100%" },
  { id: "ia-04", name: "IA WhatsApp Bot", type: "Automação", status: "running", cpu: 88, tasks: 156, client: "E-commerce Plus", uptime: "99.7%" },
  { id: "ia-05", name: "IA SEO Analyzer", type: "SEO", status: "idle", cpu: 12, tasks: 0, client: "Agência Digital", uptime: "100%" },
  { id: "ia-06", name: "IA Social Media", type: "Redes Sociais", status: "running", cpu: 55, tasks: 22, client: "StartupXYZ", uptime: "99.9%" },
  { id: "ia-07", name: "IA Email Marketing", type: "Email Marketing", status: "running", cpu: 38, tasks: 5, client: "Studio Digital Pro", uptime: "100%" },
  { id: "ia-08", name: "IA Funil Builder", type: "Funil de Vendas", status: "paused", cpu: 0, tasks: 0, client: "Carlos Lima", uptime: "98.5%" },
  { id: "ia-09", name: "IA GBP Optimizer", type: "Google Meu Negócio", status: "running", cpu: 60, tasks: 7, client: "Multi-clientes", uptime: "99.9%" },
  { id: "ia-10", name: "IA Lead Scorer", type: "Qualificação", status: "running", cpu: 78, tasks: 43, client: "Multi-clientes", uptime: "99.8%" },
];

const liveCampaigns = [
  { id: "c1", name: "Black Friday Meta Ads", platform: "Meta Ads", status: "running", budget: 5000, spent: 3240, leads: 187, conversions: 34, roas: 4.2, client: "Tech Solutions" },
  { id: "c2", name: "Google Search Brand", platform: "Google Ads", status: "running", budget: 3000, spent: 1890, leads: 95, conversions: 22, roas: 5.1, client: "Studio Digital Pro" },
  { id: "c3", name: "Remarketing Instagram", platform: "Meta Ads", status: "running", budget: 2000, spent: 1450, leads: 67, conversions: 18, roas: 3.8, client: "E-commerce Plus" },
  { id: "c4", name: "YouTube Awareness", platform: "Google Ads", status: "paused", budget: 4000, spent: 2100, leads: 45, conversions: 8, roas: 2.1, client: "Agência Digital" },
];

const liveLeads = [
  { id: "l1", name: "Fernando Costa", source: "Meta Ads", score: 92, status: "hot", time: "2min" },
  { id: "l2", name: "Patrícia Lima", source: "Google Ads", score: 87, status: "hot", time: "5min" },
  { id: "l3", name: "Ricardo Santos", source: "WhatsApp", score: 75, status: "warm", time: "12min" },
  { id: "l4", name: "Amanda Silva", source: "Instagram", score: 68, status: "warm", time: "18min" },
  { id: "l5", name: "Lucas Oliveira", source: "Landing Page", score: 95, status: "hot", time: "1min" },
  { id: "l6", name: "Juliana Mendes", source: "Email", score: 54, status: "cold", time: "45min" },
];

const liveSales = [
  { id: "s1", client: "Tech Solutions", service: "Gestão de Tráfego", value: 5500, status: "confirmed", date: "Hoje" },
  { id: "s2", client: "StartupXYZ", service: "Automação Completa", value: 8000, status: "confirmed", date: "Hoje" },
  { id: "s3", client: "E-commerce Plus", service: "Funil de Vendas", value: 12000, status: "pending", date: "Hoje" },
  { id: "s4", client: "Carlos Lima", service: "Copywriting", value: 2500, status: "confirmed", date: "Ontem" },
];

const realtimeData = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}:00`,
  leads: Math.floor(Math.random() * 30) + 10,
  conversions: Math.floor(Math.random() * 15) + 2,
  revenue: Math.floor(Math.random() * 5000) + 1000,
}));

export default function AICommandCenter() {
  const [pulse, setPulse] = useState(0);
  const [systemLoad, setSystemLoad] = useState(67);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => p + 1);
      setSystemLoad(60 + Math.floor(Math.random() * 25));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const totalLeads = liveCampaigns.reduce((a, c) => a + c.leads, 0);
  const totalConversions = liveCampaigns.reduce((a, c) => a + c.conversions, 0);
  const totalRevenue = liveSales.filter(s => s.status === "confirmed").reduce((a, s) => a + s.value, 0);
  const activeAgents = aiAgents.filter(a => a.status === "running").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative rounded-xl overflow-hidden border border-primary/20 bg-gradient-to-r from-card via-card to-primary/5 p-6">
        <div className="absolute top-3 right-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] font-mono text-green-400">LIVE</span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <Radio className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">AI Command Center</h1>
        </div>
        <p className="text-xs text-muted-foreground">Central de comando em tempo real — Todas as IAs, campanhas, leads e vendas em um só lugar</p>
      </div>

      {/* System Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: "IAs Ativas", value: `${activeAgents}/${aiAgents.length}`, icon: Bot, color: "text-green-400" },
          { label: "Campanhas Live", value: liveCampaigns.filter(c => c.status === "running").length, icon: Target, color: "text-primary" },
          { label: "Leads Hoje", value: totalLeads, icon: Users, color: "text-blue-400" },
          { label: "Conversões", value: totalConversions, icon: CheckCircle2, color: "text-green-400" },
          { label: "Receita Confirmada", value: `R$${(totalRevenue / 1000).toFixed(1)}k`, icon: ShoppingCart, color: "text-yellow-400" },
          { label: "Carga do Sistema", value: `${systemLoad}%`, icon: Cpu, color: systemLoad > 80 ? "text-red-400" : "text-green-400" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="p-3 rounded-lg border border-border bg-card text-center">
              <Icon className={`w-4 h-4 mx-auto mb-1 ${s.color}`} />
              <p className="text-lg font-bold text-foreground">{s.value}</p>
              <p className="text-[9px] text-muted-foreground">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Real-time Chart */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" /> Métricas em Tempo Real
          </h3>
          <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
            <RefreshCw className={`w-3 h-3 ${pulse % 2 === 0 ? "animate-spin" : ""}`} /> Auto-refresh 3s
          </span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={realtimeData}>
            <defs>
              <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} axisLine={false} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} axisLine={false} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))", fontSize: 11 }} />
            <Area type="monotone" dataKey="leads" stroke="hsl(var(--primary))" fill="url(#leadGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="conversions" stroke="#22c55e" fill="url(#convGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AI Agents Live */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" /> IAs Trabalhando Agora
        </h3>
        <div className="grid gap-2">
          {aiAgents.map((agent) => (
            <div key={agent.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20 border border-border/50 hover:border-primary/20 transition-all">
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${agent.status === "running" ? "bg-green-400 animate-pulse" : agent.status === "paused" ? "bg-yellow-400" : "bg-muted-foreground"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-foreground">{agent.name}</p>
                  <span className="text-[9px] font-mono text-primary">{agent.type}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">{agent.client}</p>
              </div>
              <div className="flex items-center gap-4 text-[10px]">
                <div className="text-center"><p className="font-bold text-foreground">{agent.tasks}</p><p className="text-muted-foreground">tarefas</p></div>
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <div className="w-12 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${agent.cpu > 80 ? "bg-red-400" : agent.cpu > 50 ? "bg-yellow-400" : "bg-green-400"}`} style={{ width: `${agent.cpu}%` }} />
                    </div>
                    <span className="text-muted-foreground font-mono">{agent.cpu}%</span>
                  </div>
                  <p className="text-muted-foreground">CPU</p>
                </div>
                <div className="text-center"><p className="font-bold text-green-400">{agent.uptime}</p><p className="text-muted-foreground">uptime</p></div>
                <button className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                  {agent.status === "running" ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaigns + Leads + Sales */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Campaigns Running */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" /> Campanhas Rodando
          </h3>
          <div className="space-y-3">
            {liveCampaigns.map((c) => (
              <div key={c.id} className="p-3 rounded-lg bg-secondary/20 border border-border/50">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-foreground">{c.name}</p>
                  <span className={`w-2 h-2 rounded-full ${c.status === "running" ? "bg-green-400 animate-pulse" : "bg-yellow-400"}`} />
                </div>
                <p className="text-[10px] text-muted-foreground mb-2">{c.platform} • {c.client}</p>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div><span className="text-muted-foreground">Budget:</span> <span className="text-foreground font-mono">R${c.budget.toLocaleString()}</span></div>
                  <div><span className="text-muted-foreground">Gasto:</span> <span className="text-foreground font-mono">R${c.spent.toLocaleString()}</span></div>
                  <div><span className="text-muted-foreground">Leads:</span> <span className="text-green-400 font-bold">{c.leads}</span></div>
                  <div><span className="text-muted-foreground">ROAS:</span> <span className="text-primary font-bold">{c.roas}x</span></div>
                </div>
                <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(c.spent / c.budget) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leads Entering */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" /> Leads Entrando
          </h3>
          <div className="space-y-2">
            {liveLeads.map((lead) => (
              <div key={lead.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/20 border border-border/50">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  lead.status === "hot" ? "bg-red-500/10 text-red-400" : lead.status === "warm" ? "bg-yellow-500/10 text-yellow-400" : "bg-blue-500/10 text-blue-400"
                }`}>
                  {lead.score}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{lead.name}</p>
                  <p className="text-[10px] text-muted-foreground">{lead.source}</p>
                </div>
                <div className="text-right">
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                    lead.status === "hot" ? "bg-red-500/10 text-red-400" : lead.status === "warm" ? "bg-yellow-500/10 text-yellow-400" : "bg-blue-500/10 text-blue-400"
                  }`}>
                    {lead.status === "hot" ? "🔥 Quente" : lead.status === "warm" ? "⚡ Morno" : "❄ Frio"}
                  </span>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{lead.time} atrás</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Happening */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-green-400" /> Vendas Acontecendo
          </h3>
          <div className="space-y-2">
            {liveSales.map((sale) => (
              <div key={sale.id} className="p-3 rounded-lg bg-secondary/20 border border-border/50">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-foreground">{sale.client}</p>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                    sale.status === "confirmed" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                  }`}>
                    {sale.status === "confirmed" ? "✓ Confirmada" : "⏳ Pendente"}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">{sale.service}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-green-400">R$ {sale.value.toLocaleString()}</span>
                  <span className="text-[9px] text-muted-foreground">{sale.date}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 rounded-lg bg-green-500/5 border border-green-500/20 text-center">
            <p className="text-[10px] text-muted-foreground">Total Confirmado Hoje</p>
            <p className="text-xl font-bold text-green-400">R$ {totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Services in Execution */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" /> Serviços em Execução — Progresso
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { service: "Gestão de Tráfego Meta Ads", client: "Tech Solutions", progress: 78, tasks: "14/18", ia: "IA-Tráfego", status: "Otimizando audiências" },
            { service: "Automação WhatsApp", client: "E-commerce Plus", progress: 92, tasks: "23/25", ia: "IA-WhatsApp", status: "Funil de nutrição ativo" },
            { service: "SEO Completo", client: "Agência Digital", progress: 45, tasks: "9/20", ia: "IA-SEO", status: "Auditoria de backlinks" },
            { service: "Email Marketing", client: "Studio Digital Pro", progress: 100, tasks: "12/12", ia: "IA-Email", status: "Campanha finalizada ✓" },
            { service: "Copywriting Vendas", client: "StartupXYZ", progress: 60, tasks: "6/10", ia: "IA-Copy", status: "Gerando variações A/B" },
            { service: "Google Meu Negócio", client: "Restaurante Sabor", progress: 85, tasks: "17/20", ia: "IA-GBP", status: "Respondendo avaliações" },
          ].map((s, i) => (
            <div key={i} className="p-3 rounded-lg bg-secondary/20 border border-border/50">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold text-foreground">{s.service}</p>
                <span className="text-[9px] font-mono text-primary">{s.ia}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mb-2">{s.client} — {s.status}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${s.progress === 100 ? "bg-green-400" : s.progress > 70 ? "bg-primary" : "bg-yellow-400"}`} style={{ width: `${s.progress}%` }} />
                </div>
                <span className="text-[10px] font-mono text-foreground">{s.progress}%</span>
                <span className="text-[9px] text-muted-foreground">{s.tasks}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Health */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" /> Saúde do Sistema
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Uptime Geral", value: "99.9%", color: "text-green-400" },
            { label: "Latência Média", value: "45ms", color: "text-green-400" },
            { label: "Erros Hoje", value: "0", color: "text-green-400" },
            { label: "Alertas", value: "2", color: "text-yellow-400" },
          ].map((h, i) => (
            <div key={i} className="p-3 rounded-lg bg-card border border-border text-center">
              <p className={`text-xl font-bold ${h.color}`}>{h.value}</p>
              <p className="text-[9px] text-muted-foreground mt-1">{h.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
