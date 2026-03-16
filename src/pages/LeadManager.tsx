import { useState } from "react";
import {
  Users, Search, Filter, Globe, Instagram, Facebook, MessageSquare,
  TrendingUp, Target, Clock, ArrowUpRight, BarChart3, Zap, Star,
  Phone, Mail, MapPin, Eye, Bot, Activity, Layers
} from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  channel: string;
  status: "new" | "contacted" | "qualified" | "negotiation" | "converted" | "lost";
  score: number;
  service_interest: string;
  entry_page: string;
  utm_source?: string;
  utm_campaign?: string;
  created_at: string;
  last_activity: string;
  notes: string;
}

const demoLeads: Lead[] = [
  { id: "1", name: "Pedro Mendes", email: "pedro@empresa.com", phone: "(11) 99111-2222", source: "Google Ads", channel: "Landing Page", status: "qualified", score: 92, service_interest: "Gestão de Tráfego", entry_page: "/lp-trafego", utm_source: "google", utm_campaign: "trafego-pago-sp", created_at: "2026-03-15T10:30:00Z", last_activity: "2026-03-15T14:00:00Z", notes: "Interesse alto, orçamento R$5k" },
  { id: "2", name: "Ana Costa", email: "ana@loja.com", phone: "(21) 98222-3333", source: "Meta Ads", channel: "Instagram DM", status: "new", score: 78, service_interest: "Automação WhatsApp", entry_page: "/bio-link", utm_source: "instagram", utm_campaign: "automacao-stories", created_at: "2026-03-15T11:00:00Z", last_activity: "2026-03-15T11:00:00Z", notes: "" },
  { id: "3", name: "Ricardo Alves", email: "ricardo@clinica.com", phone: "(31) 97333-4444", source: "Google Orgânico", channel: "Site", status: "contacted", score: 85, service_interest: "Google Meu Negócio", entry_page: "/servicos/gmb", utm_source: "organic", created_at: "2026-03-14T16:00:00Z", last_activity: "2026-03-15T09:30:00Z", notes: "Clínica odontológica, quer ranking top 3" },
  { id: "4", name: "Camila Ferreira", email: "camila@ecommerce.com", phone: "(11) 96444-5555", source: "TikTok Ads", channel: "WhatsApp", status: "negotiation", score: 88, service_interest: "Funil de Vendas", entry_page: "/lp-funil", utm_source: "tiktok", utm_campaign: "funil-ecommerce", created_at: "2026-03-13T14:00:00Z", last_activity: "2026-03-15T12:00:00Z", notes: "E-commerce moda, faturamento R$80k/mês" },
  { id: "5", name: "Lucas Santos", email: "lucas@startup.io", phone: "(11) 95555-6666", source: "LinkedIn", channel: "Formulário Site", status: "converted", score: 95, service_interest: "Pacote Completo", entry_page: "/contato", utm_source: "linkedin", created_at: "2026-03-10T10:00:00Z", last_activity: "2026-03-14T16:00:00Z", notes: "Fechou pacote R$12k/mês" },
  { id: "6", name: "Juliana Martins", email: "ju@restaurante.com", phone: "(21) 94666-7777", source: "Indicação", channel: "WhatsApp", status: "qualified", score: 80, service_interest: "Redes Sociais", entry_page: "direto", created_at: "2026-03-12T09:00:00Z", last_activity: "2026-03-15T10:00:00Z", notes: "Rede de 3 restaurantes" },
  { id: "7", name: "Marcos Oliveira", email: "marcos@imob.com", phone: "(31) 93777-8888", source: "Google Ads", channel: "Landing Page", status: "lost", score: 45, service_interest: "SEO", entry_page: "/lp-seo", utm_source: "google", utm_campaign: "seo-bh", created_at: "2026-03-08T15:00:00Z", last_activity: "2026-03-12T11:00:00Z", notes: "Orçamento insuficiente" },
  { id: "8", name: "Fernanda Lima", email: "fer@beleza.com", phone: "(11) 92888-9999", source: "Meta Ads", channel: "Briefing Form", status: "new", score: 82, service_interest: "Tráfego + Automação", entry_page: "/briefing", utm_source: "facebook", utm_campaign: "lead-gen-beleza", created_at: "2026-03-15T13:00:00Z", last_activity: "2026-03-15T13:00:00Z", notes: "Preencheu briefing completo" },
];

const sourceData = [
  { name: "Google Ads", value: 35, color: "hsl(var(--primary))" },
  { name: "Meta Ads", value: 28, color: "hsl(214 89% 52%)" },
  { name: "Orgânico", value: 18, color: "hsl(142 70% 49%)" },
  { name: "TikTok", value: 10, color: "hsl(330 80% 55%)" },
  { name: "Indicação", value: 9, color: "hsl(38 92% 50%)" },
];

const weeklyData = [
  { day: "Seg", leads: 12, converted: 3 }, { day: "Ter", leads: 18, converted: 5 },
  { day: "Qua", leads: 15, converted: 4 }, { day: "Qui", leads: 22, converted: 7 },
  { day: "Sex", leads: 25, converted: 8 }, { day: "Sáb", leads: 8, converted: 2 },
  { day: "Dom", leads: 5, converted: 1 },
];

const funnelData = [
  { stage: "Novos", count: 45, pct: 100 }, { stage: "Contatados", count: 32, pct: 71 },
  { stage: "Qualificados", count: 22, pct: 49 }, { stage: "Negociação", count: 14, pct: 31 },
  { stage: "Convertidos", count: 8, pct: 18 },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  new: { label: "Novo", color: "bg-accent/10 text-accent" },
  contacted: { label: "Contatado", color: "bg-blue-500/10 text-blue-400" },
  qualified: { label: "Qualificado", color: "bg-primary/10 text-primary" },
  negotiation: { label: "Negociação", color: "bg-amber-500/10 text-amber-400" },
  converted: { label: "Convertido", color: "bg-green-500/10 text-green-400" },
  lost: { label: "Perdido", color: "bg-destructive/10 text-destructive" },
};

const sourceIcon: Record<string, typeof Globe> = {
  "Google Ads": Globe, "Meta Ads": Facebook, "Google Orgânico": Globe,
  "TikTok Ads": Activity, "LinkedIn": Users, "Indicação": Star,
};

export default function LeadManager() {
  const [leads] = useState<Lead[]>(demoLeads);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.source.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === "new").length;
  const converted = leads.filter(l => l.status === "converted").length;
  const conversionRate = totalLeads ? Math.round((converted / totalLeads) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" /> Gerenciamento de Leads
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Monitoramento inteligente de leads — rastreamento completo de origem, canal, campanha e conversão.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total Leads", value: totalLeads, icon: Users, color: "text-foreground" },
          { label: "Novos Hoje", value: newLeads, icon: Zap, color: "text-accent" },
          { label: "Qualificados", value: leads.filter(l => l.status === "qualified").length, icon: Target, color: "text-primary" },
          { label: "Em Negociação", value: leads.filter(l => l.status === "negotiation").length, icon: MessageSquare, color: "text-amber-400" },
          { label: "Taxa Conversão", value: `${conversionRate}%`, icon: TrendingUp, color: "text-green-400" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-3 text-center">
            <s.icon className={`w-4 h-4 mx-auto mb-1 ${s.color}`} />
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[9px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <h4 className="text-xs font-semibold text-foreground mb-3">📊 Origem dos Leads</h4>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={sourceData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" stroke="none">
                {sourceData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "10px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {sourceData.map(s => (
              <span key={s.name} className="text-[8px] flex items-center gap-1 text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ background: s.color }} /> {s.name} ({s.value}%)
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h4 className="text-xs font-semibold text-foreground mb-3">📈 Leads vs Conversões (Semana)</h4>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "10px" }} />
              <Bar dataKey="leads" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} opacity={0.6} />
              <Bar dataKey="converted" fill="hsl(142 70% 49%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h4 className="text-xs font-semibold text-foreground mb-3">🎯 Funil de Conversão</h4>
          <div className="space-y-2">
            {funnelData.map((stage, i) => (
              <div key={stage.stage} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-foreground font-medium">{stage.stage}</span>
                  <span className="text-[10px] text-muted-foreground">{stage.count} ({stage.pct}%)</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{
                    width: `${stage.pct}%`,
                    background: `hsl(var(--primary) / ${0.4 + (i * 0.15)})`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar leads..."
              className="w-full h-10 bg-card border border-border rounded-lg pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div className="flex gap-1 flex-wrap">
            {["all", "new", "contacted", "qualified", "negotiation", "converted"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} className={`px-2 py-1 rounded-lg text-[9px] font-medium transition-all ${filterStatus === s ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground"}`}>
                {s === "all" ? "Todos" : statusConfig[s].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-2">
        {filtered.map(lead => {
          const SourceIcon = sourceIcon[lead.source] || Globe;
          return (
            <div key={lead.id} className="rounded-xl border border-border bg-card hover:border-primary/20 transition-all overflow-hidden">
              <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <SourceIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground">{lead.name}</p>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${statusConfig[lead.status].color}`}>
                      {statusConfig[lead.status].label}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-mono">Score: {lead.score}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                    <span>{lead.source}</span>
                    <span>•</span>
                    <span>{lead.channel}</span>
                    <span>•</span>
                    <span>{lead.service_interest}</span>
                    {lead.utm_campaign && <><span>•</span><span className="font-mono">📌 {lead.utm_campaign}</span></>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] text-muted-foreground">{new Date(lead.created_at).toLocaleDateString("pt-BR")}</p>
                  <p className="text-[9px] text-muted-foreground flex items-center gap-1 justify-end">
                    <Clock className="w-2.5 h-2.5" /> {new Date(lead.last_activity).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>

              {expandedId === lead.id && (
                <div className="border-t border-border p-4 bg-secondary/5 space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[10px]">
                    <div className="flex items-center gap-1.5 text-muted-foreground"><Mail className="w-3 h-3" /> {lead.email}</div>
                    <div className="flex items-center gap-1.5 text-muted-foreground"><Phone className="w-3 h-3" /> {lead.phone}</div>
                    <div className="flex items-center gap-1.5 text-muted-foreground"><Globe className="w-3 h-3" /> Página: {lead.entry_page}</div>
                    {lead.utm_source && <div className="flex items-center gap-1.5 text-muted-foreground"><Target className="w-3 h-3" /> UTM: {lead.utm_source}</div>}
                  </div>
                  {lead.notes && (
                    <div className="p-2 rounded-lg bg-card border border-border/50">
                      <p className="text-[10px] text-muted-foreground">📝 {lead.notes}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                    <p className="text-[10px] text-primary">IA monitorando atividade em tempo real — rastreamento completo de origem a conversão.</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
