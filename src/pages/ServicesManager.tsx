import { useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Briefcase, Pencil, Trash2, Eye, ChevronUp, FileText, Zap, Globe, Target, BarChart3, CheckCircle2, Clock, Bot, TrendingUp, ArrowUpRight, Layers, Activity } from "lucide-react";

const SERVICE_TYPES = ["Gestão de Tráfego", "Automação", "Criação de Assistente IA", "Copywriting", "Gestão de Redes Sociais", "Email Marketing", "SEO", "Desenvolvimento Web", "Design Gráfico", "Consultoria", "Funil de Vendas", "Chatbot WhatsApp", "Google Meu Negócio", "Produção de Conteúdo"];
const PLATFORMS = ["Meta Ads", "Google Ads", "TikTok Ads", "n8n", "Make", "ManyChat", "WhatsApp", "Instagram", "YouTube", "LinkedIn", "Hotmart", "Kiwify", "Google Business"];

interface Service {
  id: string; client_id: string | null; type: string; platform: string | null;
  description: string | null; status: string; priority: string;
  fee_gestao: number; verba: number; clientName?: string; created_at: string;
  progress: number; tasksTotal: number; tasksDone: number; iaAgent?: string;
  deliverables?: Deliverable[];
}

interface Deliverable {
  id: string; name: string; status: string; date: string; result?: string;
  details?: DeliverableDetail[];
}

interface DeliverableDetail {
  type: "pixel" | "creative" | "campaign" | "report" | "content" | "config";
  title: string;
  content: string;
  metrics?: Record<string, string>;
}

const demoServices: Service[] = [
  {
    id: "1", client_id: "1", type: "Gestão de Tráfego", platform: "Meta Ads",
    description: "Campanhas Facebook e Instagram — Geração de leads qualificados e vendas diretas",
    status: "active", priority: "high", fee_gestao: 2500, verba: 5000,
    clientName: "João Silva", created_at: "2026-01-15T10:00:00Z",
    progress: 78, tasksTotal: 18, tasksDone: 14, iaAgent: "IA-Tráfego v3",
    deliverables: [
      { id: "d1", name: "Configuração Pixel & Conversões", status: "done", date: "2026-01-16", result: "Pixel ativo em 3 domínios", details: [
        { type: "pixel", title: "Meta Pixel", content: "ID: 847291038472910 — Instalado via GTM", metrics: { "Eventos rastreados": "PageView, Purchase, AddToCart, Lead", "Domínios": "loja.techsolutions.com.br, checkout.techsolutions.com.br, blog.techsolutions.com.br" } },
        { type: "config", title: "Conversão API (CAPI)", content: "Server-side tracking ativo — Deduplica eventos browser+server", metrics: { "Match rate": "92%", "Eventos/dia": "2.400" } },
        { type: "config", title: "Google Ads Tag", content: "ID: AW-123456789 — Conversion linker ativo", metrics: { "Conversões rastreadas": "Purchase, Lead, SignUp" } },
      ]},
      { id: "d2", name: "Criação de 12 Criativos", status: "done", date: "2026-01-20", result: "CTR médio: 3.2%", details: [
        { type: "creative", title: "Carrossel — Depoimentos", content: "5 slides com depoimentos reais de clientes + CTA 'Quero Resultados Assim'", metrics: { "CTR": "4.1%", "CPM": "R$18,50", "Impressões": "45.200" } },
        { type: "creative", title: "Vídeo 15s — Problema/Solução", content: "Hook: 'Você ainda perde 3h/dia com atendimento manual?' → Solução: IA WhatsApp", metrics: { "CTR": "3.8%", "Views 75%": "12.400", "CPV": "R$0,08" } },
        { type: "creative", title: "Stories — Antes/Depois", content: "Comparativo visual: Dashboard manual vs Dashboard automatizado", metrics: { "CTR": "3.5%", "Swipe Up": "2.100" } },
        { type: "creative", title: "Estático — Oferta Direta", content: "Design premium com badge 'Resultado Garantido' + preço riscado + CTA urgência", metrics: { "CTR": "2.9%", "Cliques": "3.800" } },
        { type: "creative", title: "Reels — Case de Sucesso", content: "60s mostrando resultado real: 'De R$5k para R$45k em 90 dias'", metrics: { "CTR": "4.5%", "Compartilhamentos": "340" } },
        { type: "creative", title: "UGC Style — Testimonial", content: "Vídeo estilo selfie com linguagem natural sobre resultados", metrics: { "CTR": "3.2%", "Saves": "580" } },
      ]},
      { id: "d3", name: "Setup Campanhas (3 objetivos)", status: "done", date: "2026-01-22", result: "CPA: R$12,40", details: [
        { type: "campaign", title: "Campanha 1 — Conversão (Purchase)", content: "Objetivo: Compras diretas | Público: Lookalike 2% compradores 180d | Orçamento: R$150/dia", metrics: { "CPA": "R$12,40", "ROAS": "4.2x", "Compras": "89", "Receita": "R$46.200" } },
        { type: "campaign", title: "Campanha 2 — Leads (WhatsApp)", content: "Objetivo: Mensagens WhatsApp | Público: Interesse em tecnologia + Comportamento compra online | Orçamento: R$80/dia", metrics: { "CPL": "R$4,80", "Leads": "512", "Qualificados": "234 (45%)" } },
        { type: "campaign", title: "Campanha 3 — Retargeting", content: "Objetivo: Conversão | Público: Visitou site 30d + Carrinho abandonado | Orçamento: R$50/dia", metrics: { "CPA": "R$8,20", "ROAS": "6.8x", "Recuperados": "67 carrinhos" } },
        { type: "campaign", title: "Conjuntos de Anúncios Ativos", content: "Total: 9 ad sets | 3 por campanha | Segmentação: Lookalike, Interesse, Retargeting", metrics: { "Ad Sets ativos": "9", "Anúncios por set": "4", "Total anúncios": "36" } },
      ]},
      { id: "d4", name: "Otimização A/B Semanal", status: "running", date: "2026-03-14", result: "ROAS atual: 4.2x", details: [
        { type: "report", title: "Teste A/B Semana 8", content: "Testando: Copy curta vs Copy longa no ad principal | Resultado parcial: Copy curta +18% CTR", metrics: { "Variante A (CTR)": "3.8%", "Variante B (CTR)": "4.5%", "Significância": "94%" } },
        { type: "report", title: "Otimizações Aplicadas", content: "1) Pausado 3 ad sets com CPA > R$20 | 2) Escalado 2 ad sets com ROAS > 5x (+30% budget) | 3) Novos 4 criativos adicionados", metrics: { "CPA antes": "R$15,20", "CPA depois": "R$12,40", "Melhoria": "-18.4%" } },
      ]},
      { id: "d5", name: "Relatório Mensal Completo", status: "running", date: "2026-03-15", details: [
        { type: "report", title: "Relatório Março/2026 (parcial)", content: "📊 Resumo: Investido R$8.400 | Receita R$35.280 | ROAS 4.2x\n📈 Leads: 512 gerados | 234 qualificados | 89 vendas\n🎯 Melhor campanha: Retargeting (ROAS 6.8x)\n📉 Pior campanha: Interesse frio (CPA R$22 — pausada)", metrics: { "Investido": "R$8.400", "Receita": "R$35.280", "ROAS": "4.2x", "Leads": "512" } },
      ]},
      { id: "d6", name: "Escala para R$10k verba", status: "pending", date: "2026-04-01" },
    ],
  },
  {
    id: "2", client_id: "2", type: "Automação", platform: "n8n",
    description: "Fluxos de automação completos — CRM, WhatsApp, Email, Funil",
    status: "active", priority: "medium", fee_gestao: 3000, verba: 0,
    clientName: "Maria Santos", created_at: "2026-02-01T10:00:00Z",
    progress: 92, tasksTotal: 25, tasksDone: 23, iaAgent: "IA-Automação v2",
    deliverables: [
      { id: "d7", name: "Mapeamento de Processos", status: "done", date: "2026-02-02", result: "15 fluxos identificados" },
      { id: "d8", name: "Setup n8n + Integrações", status: "done", date: "2026-02-05", result: "12 APIs conectadas" },
      { id: "d9", name: "Fluxo Lead Capture WhatsApp", status: "done", date: "2026-02-10", result: "1247 leads capturados" },
      { id: "d10", name: "Fluxo Follow-up Automático", status: "done", date: "2026-02-12", result: "834 follow-ups enviados" },
      { id: "d11", name: "Dashboard de Métricas", status: "running", date: "2026-03-14", result: "95% completo" },
    ],
  },
  {
    id: "3", client_id: "1", type: "Copywriting", platform: "WhatsApp",
    description: "Copy para campanhas, mensagens de vendas, scripts de atendimento e funis",
    status: "active", priority: "low", fee_gestao: 1200, verba: 0,
    clientName: "João Silva", created_at: "2026-02-20T10:00:00Z",
    progress: 60, tasksTotal: 10, tasksDone: 6, iaAgent: "IA-CopyMaster",
    deliverables: [
      { id: "d12", name: "Pesquisa de Tom de Voz", status: "done", date: "2026-02-21", result: "Persona definida" },
      { id: "d13", name: "10 Scripts WhatsApp", status: "done", date: "2026-02-25", result: "Taxa abertura: 89%" },
      { id: "d14", name: "Copy Anúncios (20 variações)", status: "done", date: "2026-03-01", result: "CTR: 4.1%" },
      { id: "d15", name: "Email Sequence (7 emails)", status: "running", date: "2026-03-14" },
      { id: "d16", name: "Landing Page Copy", status: "pending", date: "2026-03-20" },
    ],
  },
  {
    id: "4", client_id: "3", type: "Google Meu Negócio", platform: "Google Business",
    description: "Otimização completa do perfil GBP — Ranking #1 local com IA",
    status: "active", priority: "high", fee_gestao: 1800, verba: 0,
    clientName: "Carlos Lima", created_at: "2026-03-01T10:00:00Z",
    progress: 45, tasksTotal: 20, tasksDone: 9, iaAgent: "IA-GBP Optimizer",
    deliverables: [
      { id: "d17", name: "Auditoria Completa do Perfil", status: "done", date: "2026-03-02", result: "Score inicial: 42%" },
      { id: "d18", name: "Otimização SEO Local", status: "done", date: "2026-03-05", result: "+32% impressões" },
      { id: "d19", name: "Cadastro de Produtos/Serviços", status: "running", date: "2026-03-14", result: "8/15 cadastrados" },
      { id: "d20", name: "Estratégia de Avaliações", status: "pending", date: "2026-03-20" },
      { id: "d21", name: "Posts Semanais GBP", status: "pending", date: "2026-03-25" },
    ],
  },
  {
    id: "5", client_id: "2", type: "SEO", platform: "Google Ads",
    description: "SEO técnico e de conteúdo — Dominar primeira página do Google",
    status: "active", priority: "high", fee_gestao: 3500, verba: 800,
    clientName: "Maria Santos", created_at: "2026-01-10T10:00:00Z",
    progress: 55, tasksTotal: 30, tasksDone: 16, iaAgent: "IA-SEO Analyzer",
    deliverables: [
      { id: "d22", name: "Auditoria Técnica SEO", status: "done", date: "2026-01-12", result: "47 issues corrigidos" },
      { id: "d23", name: "Pesquisa de Palavras-chave", status: "done", date: "2026-01-15", result: "250 keywords mapeadas" },
      { id: "d24", name: "Otimização On-Page (50 páginas)", status: "running", date: "2026-03-14", result: "35/50 otimizadas" },
      { id: "d25", name: "Link Building (100 backlinks)", status: "running", date: "2026-03-14", result: "62/100 conquistados" },
      { id: "d26", name: "Conteúdo (20 artigos)", status: "running", date: "2026-03-14", result: "14/20 publicados" },
    ],
  },
];

const demoClients = [{ id: "1", name: "João Silva" }, { id: "2", name: "Maria Santos" }, { id: "3", name: "Carlos Lima" }];

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>(demoServices);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedDeliverable, setExpandedDeliverable] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [form, setForm] = useState({ client_id: "", type: "", platform: "", description: "", status: "pending", priority: "medium", fee_gestao: 0, verba: 0 });

  const filtered = services.filter((s) => {
    const matchSearch = s.type.toLowerCase().includes(search.toLowerCase()) || s.platform?.toLowerCase().includes(search.toLowerCase()) || s.clientName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const resetForm = () => { setForm({ client_id: "", type: "", platform: "", description: "", status: "pending", priority: "medium", fee_gestao: 0, verba: 0 }); setEditing(null); setShowForm(false); };

  const handleSave = () => {
    if (!form.type) { toast.error("Tipo de serviço obrigatório"); return; }
    const clientName = demoClients.find(c => c.id === form.client_id)?.name;
    if (editing) {
      setServices(services.map((s) => s.id === editing.id ? { ...s, ...form, clientName } : s));
      toast.success("Serviço atualizado");
    } else {
      const newService: Service = {
        id: Date.now().toString(), ...form, clientName, created_at: new Date().toISOString(),
        progress: 0, tasksTotal: 0, tasksDone: 0, deliverables: [],
      };
      setServices([newService, ...services]);
      toast.success("Serviço cadastrado — IA iniciando execução");
    }
    resetForm();
  };

  const handleDelete = (svc: Service) => { if (!confirm(`Excluir serviço ${svc.type}?`)) return; setServices(services.filter((s) => s.id !== svc.id)); toast.success("Serviço excluído"); };

  const statusColor = (s: string) => { if (s === "active") return "bg-green-500/10 text-green-400"; if (s === "pending") return "bg-yellow-500/10 text-yellow-400"; if (s === "completed") return "bg-blue-500/10 text-blue-400"; return "bg-muted text-muted-foreground"; };
  const priorityColor = (p: string) => { if (p === "high") return "bg-red-500/10 text-red-400"; if (p === "medium") return "bg-yellow-500/10 text-yellow-400"; return "bg-green-500/10 text-green-400"; };
  const deliverableStatusColor = (s: string) => { if (s === "done") return "text-green-400"; if (s === "running") return "text-primary"; return "text-muted-foreground"; };

  // Stats
  const totalFee = services.filter(s => s.status === "active").reduce((a, s) => a + s.fee_gestao, 0);
  const totalVerba = services.filter(s => s.status === "active").reduce((a, s) => a + s.verba, 0);
  const avgProgress = Math.round(services.reduce((a, s) => a + s.progress, 0) / services.length);

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-3 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-foreground">{services.length}</p>
          <p className="text-[10px] text-muted-foreground">Total Serviços</p>
        </div>
        <div className="p-3 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-green-400">{services.filter(s => s.status === "active").length}</p>
          <p className="text-[10px] text-muted-foreground">Em Execução</p>
        </div>
        <div className="p-3 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-primary">{avgProgress}%</p>
          <p className="text-[10px] text-muted-foreground">Progresso Médio</p>
        </div>
        <div className="p-3 rounded-xl border border-border bg-card text-center">
          <p className="text-lg font-bold text-foreground">R${totalFee.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Fee Total/Mês</p>
        </div>
        <div className="p-3 rounded-xl border border-border bg-card text-center">
          <p className="text-lg font-bold text-foreground">R${totalVerba.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Verba Total/Mês</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar serviços..."
              className="w-full h-10 bg-card border border-border rounded-lg pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div className="flex gap-1">
            {["all", "active", "pending", "completed"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${filterStatus === s ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground"}`}>
                {s === "all" ? "Todos" : s === "active" ? "Ativos" : s === "pending" ? "Pendentes" : "Concluídos"}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Novo Serviço
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-foreground">{editing ? "Editar Serviço" : "Novo Serviço"}</h2>
            <div className="grid gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Cliente</label>
                <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="">Selecionar cliente</option>
                  {demoClients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Tipo de Serviço *</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Selecionar</option>
                    {SERVICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Plataforma</label>
                  <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Selecionar</option>
                    {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="pending">Pendente</option><option value="active">Ativo</option><option value="completed">Concluído</option><option value="paused">Pausado</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Fee Gestão (R$)</label>
                  <input type="number" value={form.fee_gestao} onChange={(e) => setForm({ ...form, fee_gestao: Number(e.target.value) })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Verba (R$)</label>
                  <input type="number" value={form.verba} onChange={(e) => setForm({ ...form, verba: Number(e.target.value) })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Descrição</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={resetForm} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Nenhum serviço encontrado</p>
          </div>
        ) : (
          filtered.map((svc) => (
            <div key={svc.id}>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-all group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground">{svc.type}</p>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${statusColor(svc.status)}`}>
                      {svc.status === "active" ? "Ativo" : svc.status === "pending" ? "Pendente" : svc.status === "completed" ? "Concluído" : "Pausado"}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${priorityColor(svc.priority)}`}>
                      {svc.priority === "high" ? "Alta" : svc.priority === "medium" ? "Média" : "Baixa"}
                    </span>
                    {svc.iaAgent && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                        <Bot className="w-2.5 h-2.5" /> {svc.iaAgent}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">{svc.clientName || "Sem cliente"}</span>
                    {svc.platform && <span className="text-xs text-primary font-mono">{svc.platform}</span>}
                    {(svc.fee_gestao > 0 || svc.verba > 0) && <span className="text-xs text-muted-foreground">Fee: R${svc.fee_gestao} | Verba: R${svc.verba}</span>}
                  </div>
                  {/* Progress Bar */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden max-w-[200px]">
                      <div className={`h-full rounded-full transition-all ${svc.progress === 100 ? "bg-green-400" : svc.progress > 70 ? "bg-primary" : "bg-yellow-400"}`} style={{ width: `${svc.progress}%` }} />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">{svc.progress}% • {svc.tasksDone}/{svc.tasksTotal} tarefas</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setExpandedId(expandedId === svc.id ? null : svc.id)} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                    {expandedId === svc.id ? <ChevronUp className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => { setEditing(svc); setForm({ client_id: svc.client_id || "", type: svc.type, platform: svc.platform || "", description: svc.description || "", status: svc.status, priority: svc.priority, fee_gestao: svc.fee_gestao, verba: svc.verba }); setShowForm(true); }}
                    className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(svc)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Expanded: Deliverables & Production */}
              {expandedId === svc.id && (
                <div className="mt-1 mx-2 mb-3 p-4 bg-secondary/10 rounded-xl border border-border/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-foreground flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-primary" /> Produção & Entregáveis Detalhados
                    </h4>
                    <div className="flex items-center gap-2">
                      {svc.iaAgent && (
                        <span className="text-[9px] flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                          <Activity className="w-2.5 h-2.5 animate-pulse" /> IA Executando
                        </span>
                      )}
                    </div>
                  </div>

                  {svc.description && (
                    <p className="text-xs text-muted-foreground bg-card p-2 rounded-lg border border-border/50">{svc.description}</p>
                  )}

                  {svc.deliverables && svc.deliverables.length > 0 ? (
                    <div className="space-y-2">
                      {svc.deliverables.map((d) => (
                        <div key={d.id} className="rounded-lg bg-card border border-border/50 hover:border-primary/20 transition-all overflow-hidden">
                          <div className="flex items-start gap-3 p-2.5 cursor-pointer" onClick={() => d.details && setExpandedDeliverable(expandedDeliverable === d.id ? null : d.id)}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              d.status === "done" ? "bg-green-500/10" : d.status === "running" ? "bg-primary/10" : "bg-secondary"
                            }`}>
                              {d.status === "done" ? <CheckCircle2 className="w-3 h-3 text-green-400" /> :
                               d.status === "running" ? <Activity className="w-3 h-3 text-primary animate-pulse" /> :
                               <Clock className="w-3 h-3 text-muted-foreground" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-medium ${deliverableStatusColor(d.status)}`}>{d.name}</p>
                              {d.result && <p className="text-[10px] text-muted-foreground mt-0.5">→ {d.result}</p>}
                              {d.details && <p className="text-[9px] text-primary mt-0.5 flex items-center gap-1"><Eye className="w-2.5 h-2.5" /> {expandedDeliverable === d.id ? "Ocultar detalhes" : `Ver ${d.details.length} item(ns) detalhado(s)`}</p>}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className={`text-[9px] font-mono ${deliverableStatusColor(d.status)}`}>
                                {d.status === "done" ? "✓ Concluído" : d.status === "running" ? "⚡ Executando" : "⏳ Pendente"}
                              </span>
                              <p className="text-[9px] text-muted-foreground">{d.date}</p>
                            </div>
                          </div>
                          {/* Expanded Detail Content */}
                          {expandedDeliverable === d.id && d.details && (
                            <div className="border-t border-border/50 p-3 bg-secondary/5 space-y-2">
                              {d.details.map((detail, idx) => (
                                <div key={idx} className="p-3 rounded-lg bg-card border border-border/30">
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider ${
                                      detail.type === "pixel" ? "bg-blue-500/10 text-blue-400" :
                                      detail.type === "creative" ? "bg-purple-500/10 text-purple-400" :
                                      detail.type === "campaign" ? "bg-green-500/10 text-green-400" :
                                      detail.type === "report" ? "bg-amber-500/10 text-amber-400" :
                                      "bg-muted text-muted-foreground"
                                    }`}>{detail.type}</span>
                                    <p className="text-[10px] font-semibold text-foreground">{detail.title}</p>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground leading-relaxed whitespace-pre-line">{detail.content}</p>
                                  {detail.metrics && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 mt-2">
                                      {Object.entries(detail.metrics).map(([key, val]) => (
                                        <div key={key} className="p-1.5 rounded bg-secondary/30 text-center">
                                          <p className="text-[9px] font-bold text-primary">{val}</p>
                                          <p className="text-[8px] text-muted-foreground">{key}</p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-4">Nenhuma produção registrada para este serviço.</p>
                  )}

                  {/* Summary Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 rounded-lg bg-card border border-border/50 text-center">
                      <p className="text-sm font-bold text-green-400">{svc.deliverables?.filter(d => d.status === "done").length || 0}</p>
                      <p className="text-[9px] text-muted-foreground">Entregues</p>
                    </div>
                    <div className="p-2 rounded-lg bg-card border border-border/50 text-center">
                      <p className="text-sm font-bold text-primary">{svc.deliverables?.filter(d => d.status === "running").length || 0}</p>
                      <p className="text-[9px] text-muted-foreground">Em Execução</p>
                    </div>
                    <div className="p-2 rounded-lg bg-card border border-border/50 text-center">
                      <p className="text-sm font-bold text-muted-foreground">{svc.deliverables?.filter(d => d.status === "pending").length || 0}</p>
                      <p className="text-[9px] text-muted-foreground">Pendentes</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
