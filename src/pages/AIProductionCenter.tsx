import { useState } from "react";
import {
  Factory, Bot, Zap, PenTool, BarChart3, Globe, MessageSquare,
  CheckCircle2, Clock, AlertTriangle, Filter, Search, RefreshCw,
  TrendingUp, Target, FileText, Mail, Video, Image as ImageIcon
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";

type ProductionStatus = "completed" | "in_progress" | "queued" | "failed";

interface ProductionItem {
  id: string;
  date: string;
  agent: string;
  service: string;
  action: string;
  client: string;
  status: ProductionStatus;
  platform: string;
  output?: string;
}

const productionData: ProductionItem[] = [
  { id: "1", date: "2026-03-14 09:15", agent: "IA-CopyMaster", service: "Copywriting", action: "Criou 5 anúncios para Meta Ads", client: "Tech Solutions", status: "completed", platform: "Meta Ads", output: "5 copies aprovadas" },
  { id: "2", date: "2026-03-14 09:10", agent: "IA-Tráfego", service: "Gestão de Tráfego", action: "Otimizou campanha — ROAS +35%", client: "StartupXYZ", status: "completed", platform: "Google Ads" },
  { id: "3", date: "2026-03-14 09:05", agent: "IA-Estratégia", service: "Planejamento", action: "Gerou estratégia completa Q2", client: "E-commerce Plus", status: "completed", platform: "Multi" },
  { id: "4", date: "2026-03-14 08:58", agent: "IA-Automação", service: "Workflow", action: "Criou fluxo de nutrição com 12 etapas", client: "Agência Digital", status: "completed", platform: "n8n" },
  { id: "5", date: "2026-03-14 08:50", agent: "IA-SEO", service: "Google Meu Negócio", action: "Publicou 3 posts otimizados", client: "Restaurante Sabor", status: "completed", platform: "Google Business" },
  { id: "6", date: "2026-03-14 08:45", agent: "IA-Relatórios", service: "Relatórios", action: "Gerou relatório mensal completo", client: "Tech Solutions", status: "completed", platform: "Sistema", output: "PDF 28 páginas" },
  { id: "7", date: "2026-03-14 08:40", agent: "IA-Social", service: "Social Media", action: "Agendou 15 posts para a semana", client: "Moda Fashion", status: "in_progress", platform: "Instagram" },
  { id: "8", date: "2026-03-14 08:35", agent: "IA-Email", service: "Email Marketing", action: "Criou sequência de 7 emails de boas-vindas", client: "SaaS Pro", status: "in_progress", platform: "ActiveCampaign" },
  { id: "9", date: "2026-03-14 08:30", agent: "IA-Video", service: "VSL", action: "Gerando script de VSL — Produto X", client: "InfoProduto BR", status: "queued", platform: "YouTube" },
  { id: "10", date: "2026-03-14 08:20", agent: "IA-Landing", service: "Landing Page", action: "Criando LP de alta conversão", client: "Consultoria Alpha", status: "queued", platform: "Web" },
  { id: "11", date: "2026-03-14 08:00", agent: "IA-Chatbot", service: "Atendimento", action: "Respondeu 47 leads automaticamente", client: "Clínica Saúde", status: "completed", platform: "WhatsApp" },
  { id: "12", date: "2026-03-14 07:45", agent: "IA-Cobrança", service: "Financeiro", action: "Enviou 8 cobranças automáticas", client: "Múltiplos", status: "completed", platform: "Asaas" },
];

const statusConfig: Record<ProductionStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  completed: { label: "Concluído", color: "text-green-400 bg-green-500/10", icon: CheckCircle2 },
  in_progress: { label: "Em Progresso", color: "text-primary bg-primary/10", icon: RefreshCw },
  queued: { label: "Na Fila", color: "text-muted-foreground bg-secondary", icon: Clock },
  failed: { label: "Falhou", color: "text-destructive bg-destructive/10", icon: AlertTriangle },
};

const stats = [
  { label: "Produções Hoje", value: "87", icon: Factory, color: "text-primary" },
  { label: "IAs Trabalhando", value: "14", icon: Bot, color: "text-accent" },
  { label: "Campanhas Criadas", value: "23", icon: Target, color: "text-green-400" },
  { label: "Copies Geradas", value: "156", icon: PenTool, color: "text-primary" },
  { label: "Automações Criadas", value: "34", icon: Zap, color: "text-accent" },
  { label: "Relatórios Prontos", value: "12", icon: BarChart3, color: "text-green-400" },
];

const outputTypes = [
  { type: "Anúncios", count: 45, icon: Target },
  { type: "Posts Social", count: 78, icon: Globe },
  { type: "Emails", count: 34, icon: Mail },
  { type: "Scripts VSL", count: 8, icon: Video },
  { type: "Landing Pages", count: 5, icon: FileText },
  { type: "Criativos", count: 22, icon: ImageIcon },
  { type: "Chatbot Respostas", count: 312, icon: MessageSquare },
  { type: "Relatórios", count: 12, icon: BarChart3 },
];

/* Charts Data */
const hourlyProduction = [
  { hour: "06h", producoes: 3 }, { hour: "07h", producoes: 12 }, { hour: "08h", producoes: 28 },
  { hour: "09h", producoes: 45 }, { hour: "10h", producoes: 38 }, { hour: "11h", producoes: 22 },
  { hour: "12h", producoes: 15 }, { hour: "13h", producoes: 8 },
];

const productionByType = [
  { name: "Campanhas", value: 23, fill: "hsl(var(--primary))" },
  { name: "Copies", value: 56, fill: "hsl(142, 70%, 45%)" },
  { name: "Automações", value: 34, fill: "hsl(var(--accent))" },
  { name: "Relatórios", value: 12, fill: "hsl(35, 80%, 55%)" },
  { name: "Chatbot", value: 42, fill: "hsl(195, 90%, 45%)" },
  { name: "Google Negócio", value: 15, fill: "hsl(270, 60%, 60%)" },
];

const agentPerformance = [
  { agent: "Copy", tarefas: 45, velocidade: 92, qualidade: 95, precisao: 88, eficiencia: 90 },
  { agent: "Tráfego", tarefas: 38, velocidade: 85, qualidade: 90, precisao: 92, eficiencia: 87 },
  { agent: "Automação", tarefas: 34, velocidade: 88, qualidade: 85, precisao: 90, eficiencia: 93 },
  { agent: "SEO", tarefas: 22, velocidade: 78, qualidade: 92, precisao: 95, eficiencia: 82 },
  { agent: "Chatbot", tarefas: 312, velocidade: 98, qualidade: 82, precisao: 85, eficiencia: 96 },
];

const weeklyTrend = [
  { dia: "Seg", producoes: 65, aprovadas: 58 },
  { dia: "Ter", producoes: 78, aprovadas: 72 },
  { dia: "Qua", producoes: 92, aprovadas: 85 },
  { dia: "Qui", producoes: 87, aprovadas: 80 },
  { dia: "Sex", producoes: 95, aprovadas: 88 },
  { dia: "Sab", producoes: 45, aprovadas: 42 },
  { dia: "Dom", producoes: 30, aprovadas: 28 },
];

export default function AIProductionCenter() {
  const [filter, setFilter] = useState<ProductionStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = productionData.filter((item) => {
    if (filter !== "all" && item.status !== filter) return false;
    if (search && !item.action.toLowerCase().includes(search.toLowerCase()) && !item.client.toLowerCase().includes(search.toLowerCase()) && !item.agent.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Factory className="w-7 h-7 text-primary" /> AI Production Center
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Tudo que as IAs produzem — campanhas, copies, automações, relatórios, estratégias — em tempo real.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
            <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
            <p className="text-xl font-bold text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Produção por Hora (Hoje)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={hourlyProduction}>
              <defs>
                <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
              <Area type="monotone" dataKey="producoes" stroke="hsl(var(--primary))" fill="url(#prodGrad)" strokeWidth={2.5} dot={{ r: 3, fill: "hsl(var(--primary))" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-accent" /> Distribuição por Tipo
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={productionByType} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={4} dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {productionByType.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Bot className="w-4 h-4 text-primary" /> Performance das IAs (Radar)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={agentPerformance}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="agent" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} />
              <Radar name="Velocidade" dataKey="velocidade" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Qualidade" dataKey="qualidade" stroke="hsl(142, 70%, 45%)" fill="hsl(142, 70%, 45%)" fillOpacity={0.1} strokeWidth={2} />
              <Radar name="Eficiência" dataKey="eficiencia" stroke="hsl(35, 80%, 55%)" fill="hsl(35, 80%, 55%)" fillOpacity={0.1} strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: 10, color: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Factory className="w-4 h-4 text-accent" /> Tendência Semanal
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="dia" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
              <Bar dataKey="producoes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Produções" />
              <Bar dataKey="aprovadas" fill="hsl(142, 70%, 45%)" radius={[4, 4, 0, 0]} name="Aprovadas" />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Output Types */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" /> Produção por Tipo (Hoje)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {outputTypes.map((o) => (
            <div key={o.type} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50">
              <o.icon className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm font-bold text-foreground">{o.count}</p>
                <p className="text-[10px] text-muted-foreground">{o.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar produção..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none" />
        </div>
        <div className="flex gap-2">
          {(["all", "completed", "in_progress", "queued", "failed"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:text-foreground"}`}>
              {f === "all" ? "Todos" : statusConfig[f].label}
            </button>
          ))}
        </div>
      </div>

      {/* Production Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Data</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground">IA Responsável</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Serviço</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Ação Executada</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Cliente</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Plataforma</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const cfg = statusConfig[item.status];
                const Icon = cfg.icon;
                return (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <td className="p-3 text-xs text-muted-foreground font-mono whitespace-nowrap">{item.date}</td>
                    <td className="p-3"><span className="text-xs font-semibold text-accent">{item.agent}</span></td>
                    <td className="p-3 text-xs text-foreground">{item.service}</td>
                    <td className="p-3 text-xs text-foreground max-w-xs">{item.action}</td>
                    <td className="p-3 text-xs text-foreground">{item.client}</td>
                    <td className="p-3"><span className="text-[10px] px-2 py-1 rounded-full bg-secondary text-muted-foreground">{item.platform}</span></td>
                    <td className="p-3">
                      <span className={`flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-full ${cfg.color}`}>
                        <Icon className="w-3 h-3" /> {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
