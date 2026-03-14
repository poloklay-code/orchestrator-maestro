import { useState } from "react";
import {
  Eye, Zap, MessageSquare, Target, Globe, PenTool, Mail, Video,
  CheckCircle2, Clock, RefreshCw, AlertTriangle, ArrowDown, ChevronRight,
  Search, Filter, Layers, Monitor, Database, Phone, ShoppingCart,
  BarChart3, FileText, Image as ImageIcon, Play, X, Maximize2,
  Webhook, Users, Bot, TrendingUp, Activity, Bug
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

/* ── Types ── */
type OperationType = "automation" | "campaign" | "copy" | "funnel" | "gbp" | "chatbot" | "debug";

interface Operation {
  id: string;
  type: OperationType;
  title: string;
  platform: string;
  client: string;
  agent: string;
  status: "completed" | "running" | "queued";
  date: string;
  detail: OperationDetail;
}

interface WorkflowStep { label: string; status: "done" | "running" | "pending"; }
interface CampaignDetail { objective: string; budget: string; audience: string; location: string; age: string; copies: { version: string; text: string; ctr: string }[]; }
interface CopyDetail { versions: { label: string; channel: string; text: string; ctr: string; risk: string }[]; }
interface FunnelDetail { stages: { label: string; conversionRate: string }[]; }
interface GBPDetail { profile: string; description: string; posts: { title: string; content: string; date: string }[]; reviews: { author: string; rating: number; response: string }[]; }
interface ChatbotDetail { blocks: { label: string; type: string }[]; }
interface DebugDetail { agent: string; action: string; platform: string; status: string; logs: string[]; }

type OperationDetail =
  | { kind: "workflow"; steps: WorkflowStep[] }
  | { kind: "campaign"; data: CampaignDetail }
  | { kind: "copy"; data: CopyDetail }
  | { kind: "funnel"; data: FunnelDetail }
  | { kind: "gbp"; data: GBPDetail }
  | { kind: "chatbot"; data: ChatbotDetail }
  | { kind: "debug"; data: DebugDetail };

/* ── Demo Data ── */
const operations: Operation[] = [
  {
    id: "1", type: "automation", title: "Lead Capture WhatsApp", platform: "n8n", client: "Tech Solutions", agent: "IA-Automação", status: "completed", date: "09:15",
    detail: { kind: "workflow", steps: [
      { label: "Webhook Recebe Lead", status: "done" }, { label: "Valida Dados (IA)", status: "done" },
      { label: "Salva no CRM", status: "done" }, { label: "Envia para ManyChat", status: "done" },
      { label: "Dispara WhatsApp", status: "done" }, { label: "Notifica Equipe", status: "done" },
    ]},
  },
  {
    id: "2", type: "automation", title: "Follow-up Automático", platform: "ManyChat", client: "StartupXYZ", agent: "IA-Automação", status: "running", date: "09:10",
    detail: { kind: "workflow", steps: [
      { label: "Usuário envia mensagem", status: "done" }, { label: "Bot responde boas-vindas", status: "done" },
      { label: "Pergunta interesse", status: "done" }, { label: "Qualificação do lead (IA)", status: "running" },
      { label: "Encaminha para vendedor", status: "pending" }, { label: "Agenda reunião", status: "pending" },
    ]},
  },
  {
    id: "3", type: "campaign", title: "Curso Marketing Digital", platform: "Meta Ads", client: "InfoProduto BR", agent: "IA-Tráfego", status: "completed", date: "08:55",
    detail: { kind: "campaign", data: {
      objective: "Conversão", budget: "R$ 30/dia",
      audience: "Empreendedores digitais", location: "Brasil", age: "25-45",
      copies: [
        { version: "A", text: "Você está cansado de perder vendas? Descubra o método que já ajudou +500 empresas a faturar 3x mais. Clique e veja como funciona.", ctr: "4.2%" },
        { version: "B", text: "Empresas inteligentes estão usando este método para crescer de forma previsível. Veja como aplicar no seu negócio hoje.", ctr: "3.8%" },
      ],
    }},
  },
  {
    id: "4", type: "campaign", title: "Tráfego Pago SP", platform: "Google Ads", client: "Agência Digital", agent: "IA-Tráfego", status: "completed", date: "08:45",
    detail: { kind: "campaign", data: {
      objective: "Cliques no site", budget: "R$ 50/dia",
      audience: "Empresários em São Paulo", location: "São Paulo, SP", age: "28-55",
      copies: [
        { version: "A", text: "Agência de Marketing Digital em SP — Resultados comprovados. Agende sua consultoria grátis.", ctr: "5.1%" },
        { version: "B", text: "Precisa de mais clientes? Somos a agência #1 em tráfego pago de São Paulo. Fale conosco.", ctr: "4.7%" },
      ],
    }},
  },
  {
    id: "5", type: "copy", title: "Pack de Copies — Anúncios + LP + Email", platform: "Multi", client: "E-commerce Plus", agent: "IA-CopyMaster", status: "completed", date: "08:30",
    detail: { kind: "copy", data: { versions: [
      { label: "Anúncio Facebook", channel: "Facebook Ads", text: "Transforme sua loja online em uma máquina de vendas. +200% de conversão em 30 dias. Clique agora.", ctr: "4.2%", risk: "Baixo" },
      { label: "Landing Page Hero", channel: "Landing Page", text: "A revolução do e-commerce começa aqui. Automatize, escale e domine seu mercado com inteligência artificial.", ctr: "N/A", risk: "Baixo" },
      { label: "Email Boas-Vindas", channel: "Email", text: "Bem-vindo ao futuro do seu negócio! Preparamos um plano exclusivo para você escalar suas vendas nos próximos 30 dias.", ctr: "32%", risk: "Baixo" },
      { label: "Script VSL", channel: "YouTube", text: "Imagine dobrar suas vendas sem trabalhar mais... Isso não é ficção. Milhares de empreendedores já provaram que é possível.", ctr: "N/A", risk: "Médio" },
    ]}},
  },
  {
    id: "6", type: "funnel", title: "Funil Produto X — Lançamento", platform: "Sistema", client: "SaaS Pro", agent: "IA-Estratégia", status: "running", date: "08:20",
    detail: { kind: "funnel", data: { stages: [
      { label: "Anúncio (Meta/Google)", conversionRate: "2.8%" },
      { label: "Landing Page de Captura", conversionRate: "35%" },
      { label: "Página de Obrigado + Upsell", conversionRate: "12%" },
      { label: "Sequência de Email (7 dias)", conversionRate: "8%" },
      { label: "Página de Vendas", conversionRate: "4.5%" },
      { label: "Checkout", conversionRate: "68%" },
    ]}},
  },
  {
    id: "7", type: "gbp", title: "Perfil Otimizado — Restaurante Sabor", platform: "Google Business", client: "Restaurante Sabor", agent: "IA-SEO", status: "completed", date: "08:00",
    detail: { kind: "gbp", data: {
      profile: "Restaurante Sabor & Aroma", description: "Restaurante especializado em culinária contemporânea brasileira. Ambiente acolhedor, ingredientes frescos e atendimento premium. Delivery disponível.",
      posts: [
        { title: "Promoção Almoço Executivo", content: "Almoço executivo completo por apenas R$ 29,90! De segunda a sexta, das 11h às 15h. Reserve sua mesa.", date: "14/03/2026" },
        { title: "Novo Cardápio de Inverno", content: "Preparamos pratos especiais para a estação. Venha experimentar nossas sopas artesanais e fondues.", date: "13/03/2026" },
        { title: "Evento Gastronômico", content: "Sábado especial com degustação de vinhos e harmonização. Vagas limitadas!", date: "12/03/2026" },
      ],
      reviews: [
        { author: "Carlos M.", rating: 5, response: "Obrigado pela avaliação, Carlos! Ficamos felizes em saber que sua experiência foi excelente. Esperamos vê-lo novamente em breve!" },
        { author: "Ana P.", rating: 4, response: "Agradecemos seu feedback, Ana! Vamos trabalhar para melhorar ainda mais. Volte sempre!" },
      ],
    }},
  },
  {
    id: "8", type: "chatbot", title: "Atendimento Inicial Clínica", platform: "ManyChat", client: "Clínica Saúde", agent: "IA-Chatbot", status: "completed", date: "07:45",
    detail: { kind: "chatbot", data: { blocks: [
      { label: "Mensagem recebida", type: "trigger" }, { label: "Bot: Olá! Como posso ajudar?", type: "message" },
      { label: "Menu: Agendar / Dúvidas / Valores", type: "choice" }, { label: "IA qualifica interesse", type: "ai" },
      { label: "Classifica: Quente / Morno / Frio", type: "filter" }, { label: "Encaminha para recepção", type: "action" },
      { label: "Confirma agendamento", type: "message" },
    ]}},
  },
  {
    id: "9", type: "debug", title: "Debug — Traffic AI criando campanha", platform: "Meta Ads", client: "Tech Solutions", agent: "IA-Tráfego", status: "running", date: "09:20",
    detail: { kind: "debug", data: {
      agent: "IA-Tráfego", action: "Criando campanha de conversão", platform: "Meta Ads", status: "executando",
      logs: [
        "[09:20:01] Iniciando análise de público-alvo...",
        "[09:20:03] Público definido: Empreendedores 25-45, Brasil",
        "[09:20:05] Gerando variações de copy (A/B)...",
        "[09:20:08] Copy A gerada — CTR estimado: 4.2%",
        "[09:20:10] Copy B gerada — CTR estimado: 3.8%",
        "[09:20:12] Selecionando criativos do banco...",
        "[09:20:15] Configurando pixel de conversão...",
        "[09:20:18] Definindo orçamento: R$30/dia...",
        "[09:20:20] ⟳ Enviando para API do Meta Ads...",
      ],
    }},
  },
];

const typeConfig: Record<OperationType, { label: string; icon: typeof Zap; color: string }> = {
  automation: { label: "Automação", icon: Zap, color: "text-accent bg-accent/10" },
  campaign: { label: "Campanha", icon: Target, color: "text-primary bg-primary/10" },
  copy: { label: "Copy", icon: PenTool, color: "text-green-400 bg-green-500/10" },
  funnel: { label: "Funil", icon: Layers, color: "text-purple-400 bg-purple-500/10" },
  gbp: { label: "Google Negócio", icon: Globe, color: "text-blue-400 bg-blue-500/10" },
  chatbot: { label: "Chatbot", icon: MessageSquare, color: "text-emerald-400 bg-emerald-500/10" },
  debug: { label: "Debug IA", icon: Bug, color: "text-amber-400 bg-amber-500/10" },
};

const productionChart = [
  { hour: "06h", items: 3 }, { hour: "07h", items: 8 }, { hour: "08h", items: 15 },
  { hour: "09h", items: 22 }, { hour: "10h", items: 18 }, { hour: "11h", items: 12 },
  { hour: "12h", items: 7 },
];

const pieData = [
  { name: "Automações", value: 34 }, { name: "Campanhas", value: 23 },
  { name: "Copies", value: 56 }, { name: "Funis", value: 8 },
  { name: "Google Negócio", value: 15 }, { name: "Chatbot", value: 42 },
];
const PIE_COLORS = ["hsl(195,90%,45%)", "hsl(35,80%,55%)", "hsl(142,70%,45%)", "hsl(270,60%,60%)", "hsl(210,80%,55%)", "hsl(160,70%,45%)"];

const aiLogTable = [
  { agent: "IA-CopyMaster", action: "Criou 5 copies", service: "Anúncios", date: "09:15", status: "done" },
  { agent: "IA-Automação", action: "Criou fluxo WhatsApp", service: "Workflow", date: "09:10", status: "done" },
  { agent: "IA-Tráfego", action: "Criou campanha Meta", service: "Facebook Ads", date: "08:55", status: "done" },
  { agent: "IA-SEO", action: "Publicou 3 posts GMB", service: "Google Negócio", date: "08:00", status: "done" },
  { agent: "IA-Estratégia", action: "Gerou plano Q2", service: "Planejamento", date: "07:30", status: "done" },
  { agent: "IA-Chatbot", action: "Respondeu 47 leads", service: "Atendimento", date: "07:45", status: "done" },
  { agent: "IA-Cobrança", action: "Enviou 8 cobranças", service: "Financeiro", date: "07:00", status: "done" },
];

export default function AIOperationsVisualizer() {
  const [selectedOp, setSelectedOp] = useState<Operation | null>(null);
  const [filterType, setFilterType] = useState<OperationType | "all">("all");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"operations" | "logs" | "results">("operations");

  const filtered = operations.filter((op) => {
    if (filterType !== "all" && op.type !== filterType) return false;
    if (search && !op.title.toLowerCase().includes(search.toLowerCase()) && !op.client.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Eye className="w-7 h-7 text-primary" /> AI Operations Visualizer
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visualização completa de tudo que as IAs criam — automações, campanhas, copies, funis, Google Negócio, chatbots e debug em tempo real.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {Object.entries(typeConfig).map(([key, cfg]) => {
          const Icon = cfg.icon;
          const count = operations.filter((o) => o.type === key).length;
          return (
            <button key={key} onClick={() => setFilterType(filterType === key ? "all" : key as OperationType)}
              className={`rounded-xl border p-3 text-center transition-all ${filterType === key ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30"}`}>
              <Icon className={`w-5 h-5 mx-auto mb-1 ${cfg.color.split(" ")[0]}`} />
              <p className="text-lg font-bold text-foreground">{count}</p>
              <p className="text-[9px] text-muted-foreground">{cfg.label}</p>
            </button>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" /> Produção por Hora (Hoje)
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={productionChart}>
              <defs>
                <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(35,80%,55%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(35,80%,55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
              <Area type="monotone" dataKey="items" stroke="hsl(35,80%,55%)" fillOpacity={1} fill="url(#colorProd)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent" /> Distribuição por Tipo
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} innerRadius={35} dataKey="value" paddingAngle={3}
                label={({ name, value }) => `${name}: ${value}`}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        {(["operations", "logs", "results"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg text-xs font-semibold transition-all ${activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {tab === "operations" ? "🔍 Operações" : tab === "logs" ? "📋 Log das IAs" : "📊 Resultados"}
          </button>
        ))}
      </div>

      {activeTab === "operations" && (
        <>
          {/* Search & Filter */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar operação ou cliente..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none" />
            </div>
          </div>

          {/* Operations Grid */}
          <div className="grid lg:grid-cols-3 gap-4">
            {/* List */}
            <div className="space-y-2 lg:col-span-1 max-h-[600px] overflow-y-auto pr-1">
              {filtered.map((op) => {
                const cfg = typeConfig[op.type];
                const Icon = cfg.icon;
                return (
                  <button key={op.id} onClick={() => setSelectedOp(op)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${selectedOp?.id === op.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>{cfg.label}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${op.status === "completed" ? "bg-green-400" : op.status === "running" ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
                        <span className="text-[10px] text-muted-foreground">{op.date}</span>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{op.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                      <span className="text-accent font-mono">{op.platform}</span>
                      <span>•</span>
                      <span>{op.client}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">🤖 {op.agent}</p>
                  </button>
                );
              })}
            </div>

            {/* Detail Panel */}
            <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 min-h-[400px]">
              {!selectedOp ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Eye className="w-12 h-12 mb-3 opacity-30" />
                  <p className="text-sm">Selecione uma operação para ver os detalhes completos</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{selectedOp.title}</h3>
                      <p className="text-xs text-muted-foreground">{selectedOp.platform} • {selectedOp.client} • 🤖 {selectedOp.agent}</p>
                    </div>
                    <button onClick={() => setSelectedOp(null)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"><X className="w-4 h-4" /></button>
                  </div>

                  {/* Workflow Detail */}
                  {selectedOp.detail.kind === "workflow" && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fluxo Completo</h4>
                      {selectedOp.detail.steps.map((step, i) => (
                        <div key={i}>
                          <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                            step.status === "done" ? "border-green-500/30 bg-green-500/5" :
                            step.status === "running" ? "border-primary/30 bg-primary/5 animate-pulse" :
                            "border-border bg-secondary/20"
                          }`}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              step.status === "done" ? "bg-green-500/10" : step.status === "running" ? "bg-primary/10" : "bg-secondary"
                            }`}>
                              {step.status === "done" ? <CheckCircle2 className="w-4 h-4 text-green-400" /> :
                               step.status === "running" ? <RefreshCw className="w-4 h-4 text-primary animate-spin" /> :
                               <Clock className="w-4 h-4 text-muted-foreground" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{step.label}</p>
                              <p className="text-[10px] text-muted-foreground">
                                {step.status === "done" ? "✓ Concluído" : step.status === "running" ? "⟳ Executando..." : "◦ Pendente"}
                              </p>
                            </div>
                          </div>
                          {i < (selectedOp.detail as { kind: "workflow"; steps: WorkflowStep[] }).steps.length - 1 && (
                            <div className="flex justify-center py-1"><ArrowDown className="w-3 h-3 text-muted-foreground" /></div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Campaign Detail */}
                  {selectedOp.detail.kind === "campaign" && (() => {
                    const d = selectedOp.detail.data;
                    return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Objetivo", value: d.objective },
                          { label: "Orçamento", value: d.budget },
                          { label: "Público", value: d.audience },
                          { label: "Localização", value: d.location },
                          { label: "Idade", value: d.age },
                        ].map((f) => (
                          <div key={f.label} className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                            <p className="text-[10px] text-muted-foreground uppercase">{f.label}</p>
                            <p className="text-sm font-semibold text-foreground mt-0.5">{f.value}</p>
                          </div>
                        ))}
                      </div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Anúncios Criados</h4>
                      {d.copies.map((copy, i) => (
                        <div key={i} className="p-4 rounded-xl border border-border bg-secondary/20">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex gap-2">
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">Versão {copy.version}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{d.objective}</span>
                            </div>
                            <span className="text-xs text-accent font-mono flex items-center gap-1"><BarChart3 className="w-3 h-3" /> CTR {copy.ctr}</span>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">{copy.text}</p>
                        </div>
                      ))}
                    </div>
                    );
                  })()}

                  {/* Copy Detail */}
                  {selectedOp.detail.kind === "copy" && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Todas as Versões Geradas</h4>
                      {selectedOp.detail.data.versions.map((v, i) => (
                        <div key={i} className="p-4 rounded-xl border border-border bg-secondary/20">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex gap-2">
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">{v.label}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{v.channel}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${v.risk === "Baixo" ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"}`}>◎ {v.risk} Risco</span>
                            </div>
                            {v.ctr !== "N/A" && <span className="text-xs text-accent font-mono flex items-center gap-1"><BarChart3 className="w-3 h-3" /> CTR {v.ctr}</span>}
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">{v.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Funnel Detail */}
                  {selectedOp.detail.kind === "funnel" && (() => {
                    const d = selectedOp.detail.data;
                    return (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Etapas do Funil</h4>
                      {d.stages.map((stage, i) => (
                        <div key={i}>
                          <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-secondary/20">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-xs font-bold text-purple-400">{i + 1}</div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{stage.label}</p>
                            </div>
                            <span className="text-xs font-mono text-accent">Conv. {stage.conversionRate}</span>
                          </div>
                          {i < d.stages.length - 1 && (
                            <div className="flex justify-center py-1"><ArrowDown className="w-3 h-3 text-muted-foreground" /></div>
                          )}
                        </div>
                      ))}
                    </div>
                    );
                  })()}

                  {/* GBP Detail */}
                  {selectedOp.detail.kind === "gbp" && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl border border-border bg-secondary/20">
                        <p className="text-[10px] text-muted-foreground uppercase mb-1">Perfil</p>
                        <p className="text-sm font-bold text-foreground">{selectedOp.detail.data.profile}</p>
                        <p className="text-xs text-muted-foreground mt-2">{selectedOp.detail.data.description}</p>
                      </div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Posts Criados pela IA</h4>
                      {selectedOp.detail.data.posts.map((post, i) => (
                        <div key={i} className="p-4 rounded-xl border border-border bg-secondary/20">
                          <div className="flex justify-between mb-1">
                            <p className="text-sm font-semibold text-foreground">{post.title}</p>
                            <span className="text-[10px] text-muted-foreground">{post.date}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{post.content}</p>
                        </div>
                      ))}
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Respostas a Avaliações</h4>
                      {selectedOp.detail.data.reviews.map((rev, i) => (
                        <div key={i} className="p-4 rounded-xl border border-border bg-secondary/20">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-foreground">{rev.author}</span>
                            <span className="text-xs text-primary">{"★".repeat(rev.rating)}</span>
                          </div>
                          <p className="text-xs text-accent italic">↳ Resposta IA: {rev.response}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Chatbot Detail */}
                  {selectedOp.detail.kind === "chatbot" && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Blocos do Fluxo</h4>
                      {selectedOp.detail.data.blocks.map((block, i) => (
                        <div key={i}>
                          <div className={`flex items-center gap-3 p-3 rounded-xl border border-border ${
                            block.type === "ai" ? "bg-primary/5 border-primary/30" : "bg-secondary/20"
                          }`}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                              block.type === "trigger" ? "bg-accent/10 text-accent" :
                              block.type === "ai" ? "bg-primary/10 text-primary" :
                              block.type === "filter" ? "bg-amber-500/10 text-amber-400" :
                              "bg-secondary text-muted-foreground"
                            }`}>
                              {block.type === "trigger" ? <Webhook className="w-4 h-4" /> :
                               block.type === "ai" ? <Bot className="w-4 h-4" /> :
                               block.type === "filter" ? <Filter className="w-4 h-4" /> :
                               block.type === "choice" ? <Layers className="w-4 h-4" /> :
                               <MessageSquare className="w-4 h-4" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{block.label}</p>
                              <p className="text-[10px] text-muted-foreground capitalize">{block.type}</p>
                            </div>
                          </div>
                          {i < selectedOp.detail.data.blocks.length - 1 && (
                            <div className="flex justify-center py-1"><ArrowDown className="w-3 h-3 text-muted-foreground" /></div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Debug Detail */}
                  {selectedOp.detail.kind === "debug" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Agente", value: selectedOp.detail.data.agent },
                          { label: "Ação", value: selectedOp.detail.data.action },
                          { label: "Plataforma", value: selectedOp.detail.data.platform },
                          { label: "Status", value: selectedOp.detail.data.status },
                        ].map((f) => (
                          <div key={f.label} className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                            <p className="text-[10px] text-muted-foreground uppercase">{f.label}</p>
                            <p className="text-sm font-semibold text-foreground mt-0.5">{f.value}</p>
                          </div>
                        ))}
                      </div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Console de Debug</h4>
                      <div className="rounded-xl border border-border bg-background p-4 font-mono text-xs space-y-1 max-h-60 overflow-y-auto">
                        {selectedOp.detail.data.logs.map((log, i) => (
                          <p key={i} className={`${log.includes("⟳") ? "text-primary" : "text-green-400"}`}>{log}</p>
                        ))}
                        <p className="text-muted-foreground animate-pulse">▊</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === "logs" && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">IA</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Ação</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Serviço</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Hora</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {aiLogTable.map((log, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/20">
                    <td className="p-3 text-xs font-semibold text-accent">{log.agent}</td>
                    <td className="p-3 text-xs text-foreground">{log.action}</td>
                    <td className="p-3 text-xs text-foreground">{log.service}</td>
                    <td className="p-3 text-xs text-muted-foreground font-mono">{log.date}</td>
                    <td className="p-3"><span className="text-[10px] px-2 py-1 rounded-full bg-green-500/10 text-green-400 font-medium">✓ Concluído</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "results" && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Leads Gerados", value: "1.247", change: "+23%", color: "text-green-400" },
            { label: "Conversões", value: "312", change: "+18%", color: "text-accent" },
            { label: "ROI Médio", value: "4.2x", change: "+0.5x", color: "text-primary" },
            { label: "Tráfego Total", value: "45.8K", change: "+31%", color: "text-green-400" },
            { label: "Ranking GMB", value: "#2", change: "↑3", color: "text-accent" },
          ].map((r) => (
            <div key={r.label} className="rounded-xl border border-border bg-card p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{r.value}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{r.label}</p>
              <p className={`text-xs font-semibold mt-1 ${r.color}`}>{r.change}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
