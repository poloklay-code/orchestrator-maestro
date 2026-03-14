import { useState } from "react";
import { toast } from "sonner";
import {
  Plus, Search, Pencil, Trash2, Phone, Mail, Building2, User, Eye, X, ChevronDown, ChevronUp,
  Briefcase, Zap, PenTool, MapPin, DollarSign, BarChart3, CheckCircle2, Clock, Activity,
  Key, Globe, Link2, Play, Pause, Settings2, FileSignature, ShieldAlert
} from "lucide-react";

interface ClientCredential {
  platform: string;
  loginEmail: string;
  notes: string;
}

interface ClientService {
  id: string;
  type: string;
  platform: string;
  status: string;
  progress: number;
  description: string;
  deliverables: string[];
  aiAgent: string;
}

interface Client {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  document: string | null;
  type: string;
  status: string;
  notes: string | null;
  created_at: string;
  credentials: ClientCredential[];
  services: ClientService[];
  totalRevenue: number;
  totalLeads: number;
  contractStatus: string;
}

const SERVICE_TYPES = [
  "Gestão de Tráfego — Google Ads", "Gestão de Tráfego — Meta Ads", "Gestão de Tráfego — TikTok Ads",
  "Automação — n8n", "Automação — ManyChat", "Automação — Make",
  "Copywriting Completo", "SEO & Google Meu Negócio", "Email Marketing",
  "Social Media Management", "Funil de Vendas Completo", "Marketing 360°",
];

const PLATFORMS = ["Google Ads", "Meta Ads", "TikTok Ads", "Google Business", "Instagram", "n8n", "ManyChat", "Make", "Hotmart", "ActiveCampaign", "RD Station", "Outros"];

const demoClients: Client[] = [
  {
    id: "1", name: "João Silva", company: "Studio Digital", email: "joao@studio.com", phone: "(11) 99999-0001", document: "12.345.678/0001-90", type: "pj", status: "active", notes: "Cliente premium — contrato anual",
    created_at: "2025-06-01", contractStatus: "signed", totalRevenue: 8500, totalLeads: 1247,
    credentials: [
      { platform: "Meta Ads", loginEmail: "joao@studio.com", notes: "Business Manager ID: 123456789" },
      { platform: "Google Ads", loginEmail: "joao@studio.com", notes: "MCC: 987-654-3210" },
      { platform: "Google Business", loginEmail: "joao@studio.com", notes: "Perfil: Studio Digital SP" },
    ],
    services: [
      { id: "s1", type: "Gestão de Tráfego", platform: "Meta Ads", status: "active", progress: 78, aiAgent: "Traffic AI",
        description: "Enquanto seus concorrentes brigam por atenção nas redes sociais, nós criamos um sistema inteligente que atrai clientes, automatiza vendas e escala seus resultados. Campanha principal: 'Captação Leads SP' — 3 conjuntos de anúncios ativos com segmentação por interesse (Empreendedores 25-45, Brasil). Orçamento: R$50/dia. ROAS atual: 4.2x. Leads no último mês: 847. CPA médio: R$3.20.",
        deliverables: ["Campanha: Captação Leads SP — R$50/dia — ROAS 4.2x", "Conjunto 1: Empreendedores 25-35 — CTR 3.8%", "Conjunto 2: Donos de Negócio 35-45 — CTR 4.1%", "Conjunto 3: Retargeting Site — CTR 6.2%", "Copy A: 'Quer escalar seu negócio? Descubra como...' — 847 leads", "Copy B: 'Pare de perder dinheiro com anúncios...' — 623 leads", "Criativo: Carrossel 5 slides — Engajamento 12%"],
      },
      { id: "s2", type: "Copywriting", platform: "Multi", status: "active", progress: 60, aiAgent: "CopyMaster AI",
        description: "Produção completa de copies persuasivas para anúncios, landing pages, emails e scripts de VSL. A IA CopyMaster gerou 156 variações com CTR médio de 4.2%. Cada copy é testada em A/B com monitoramento automático de performance.",
        deliverables: ["Anúncio Facebook: 'Enquanto seus concorrentes brigam por atenção nas redes sociais, nós criamos um sistema inteligente que atrai clientes, automatiza vendas e escala seus resultados.' — CTR 4.8%", "Landing Page: Headline 'Transforme seu Marketing em Máquina de Vendas' — Conv. 8.3%", "Email Sequência Boas-Vindas: 7 emails — Taxa abertura 42%", "VSL Script: 'Os 3 Erros Fatais do Marketing Digital' — 12min — Retenção 68%", "WhatsApp Copy: Sequência de 5 msgs follow-up — Response rate 34%"],
      },
      { id: "s3", type: "Google Meu Negócio", platform: "Google Business", status: "active", progress: 92, aiAgent: "SEO Local AI",
        description: "Otimização completa do perfil GBP — ranking #1 para 'agência marketing digital SP'. 127 avaliações 5 estrelas com IA respondendo automaticamente a cada avaliação em menos de 2 horas.",
        deliverables: ["Perfil otimizado: Score 98/100 — Ranking #1 'marketing digital SP'", "Post semanal: 'Dica da Semana: Como Aumentar suas Vendas com IA' — 2.4k views", "Post semanal: 'Case de Sucesso: Cliente faturou 3x mais em 60 dias' — 1.8k views", "127 avaliações respondidas pela IA — Nota média 4.9★", "Fotos otimizadas: 45 fotos com geo-tag — +340% impressões"],
      },
    ],
  },
  {
    id: "2", name: "Maria Santos", company: "E-commerce Plus", email: "maria@ecommerce.com", phone: "(11) 98888-0002", document: "98.765.432/0001-10", type: "pj", status: "active", notes: "Projeto de escala rápida",
    created_at: "2025-08-01", contractStatus: "signed", totalRevenue: 12000, totalLeads: 2340,
    credentials: [
      { platform: "n8n", loginEmail: "maria@ecommerce.com", notes: "Server: n8n.ecommerceplus.com" },
      { platform: "ManyChat", loginEmail: "maria@ecommerce.com", notes: "Bot: E-commerce Plus Atendimento" },
      { platform: "ActiveCampaign", loginEmail: "maria@ecommerce.com", notes: "Account ID: AC-456789" },
    ],
    services: [
      { id: "s4", type: "Automação Completa", platform: "n8n + ManyChat", status: "active", progress: 92, aiAgent: "Automation AI",
        description: "12 fluxos de automação operando 24/7. O sistema captura leads automaticamente via WhatsApp, qualifica com IA, salva no CRM, envia sequência de nurturing e dispara alertas para o time de vendas quando o lead está quente.",
        deliverables: ["Workflow 1: Lead Capture WhatsApp → Webhook → AI Qualification → CRM → WhatsApp Follow-up (1.247 execuções)", "Workflow 2: Abandono de Carrinho → Email 1h → WhatsApp 24h → SMS 48h (834 recuperações)", "Workflow 3: Sync CRM → Planilha → Dashboard (executa a cada 15min)", "Workflow 4: Cobrança Automática → Email → WhatsApp → Pix (98% taxa pagamento)", "ManyChat: Fluxo Atendimento → Bot responde → Qualifica → Encaminha vendedor (2.340 interações)", "ManyChat: Fluxo Pós-Venda → NPS → Avaliação Google → Indicação (456 avaliações geradas)"],
      },
      { id: "s5", type: "Email Marketing", platform: "ActiveCampaign", status: "active", progress: 80, aiAgent: "Email AI",
        description: "Sistema completo de email marketing com sequências automatizadas de boas-vindas, nutrição e reativação. A IA personaliza cada email baseado no comportamento do lead.",
        deliverables: ["Sequência Boas-Vindas: 7 emails — Taxa abertura 42% — Conversão 8.3%", "Campanha Nutrição: 'Os 5 Passos para Vender Online' — 3 emails/semana", "Campanha Reativação: Leads inativos há 30 dias — Reativação 12%", "Newsletter Semanal: Conteúdo + Oferta — 15.000 disparos/semana", "Template: Design responsivo com cores da marca — CTR médio 6.1%"],
      },
    ],
  },
  {
    id: "3", name: "Carlos Lima", company: "Restaurante Sabor", email: "carlos@sabor.com", phone: "(21) 97777-0003", document: "456.789.123-00", type: "pf", status: "active", notes: "Negócio local — foco em Google Meu Negócio",
    created_at: "2026-01-15", contractStatus: "signed", totalRevenue: 2000, totalLeads: 520,
    credentials: [
      { platform: "Google Business", loginEmail: "carlos@sabor.com", notes: "Perfil: Restaurante Sabor - Copacabana" },
      { platform: "Instagram", loginEmail: "carlos@sabor.com", notes: "@restaurantesabor — 12k seguidores" },
    ],
    services: [
      { id: "s7", type: "Google Meu Negócio", platform: "Google Business", status: "active", progress: 75, aiAgent: "SEO Local AI",
        description: "Otimização completa do perfil Google Business para restaurante local. Ranking subiu de #8 para #2 em 'restaurante copacabana'. Posts semanais publicados pela IA com fotos otimizadas e geo-tags.",
        deliverables: ["Perfil otimizado: Score 42% → 85% — Ranking #2 'restaurante copacabana'", "Post: 'Promo Almoço Executivo — R$29,90 com sobremesa' — 3.2k views", "Post: 'Chef especial hoje: Risoto de Camarão' — 2.8k views", "Post: 'Ambiente renovado! Venha conhecer' — 4.1k views com foto", "89 avaliações respondidas pela IA — Nota 4.8★", "Menu digital atualizado com fotos profissionais — +180% cliques"],
      },
      { id: "s8", type: "Social Media", platform: "Instagram", status: "active", progress: 55, aiAgent: "Social AI",
        description: "Gestão completa do Instagram com criação de conteúdo, stories e reels. IA gera legendas, hashtags otimizadas e agenda publicações nos melhores horários.",
        deliverables: ["12 posts/mês criados pela IA — Engajamento médio 5.2%", "Reel: 'Bastidores da Cozinha' — 45k views — 1.2k likes", "Story: Cardápio do dia (diário) — 800 views médio", "Hashtags otimizadas: #restaurantecopacabana #comidaboa — Alcance +230%", "Bio otimizada com CTA para reserva via WhatsApp"],
      },
    ],
  },
];

export default function ClientsManager() {
  const [clients, setClients] = useState<Client[]>(demoClients);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState<"services" | "credentials" | "production">("services");

  // Form state
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "", document: "", type: "pf", notes: "",
    credentials: [] as ClientCredential[],
    selectedServices: [] as string[],
  });
  const [newCred, setNewCred] = useState({ platform: "", loginEmail: "", notes: "" });

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm({ name: "", company: "", email: "", phone: "", document: "", type: "pf", notes: "", credentials: [], selectedServices: [] });
    setNewCred({ platform: "", loginEmail: "", notes: "" });
    setEditingClient(null);
    setShowForm(false);
  };

  const addCredential = () => {
    if (!newCred.platform) { toast.error("Selecione a plataforma"); return; }
    setForm({ ...form, credentials: [...form.credentials, { ...newCred }] });
    setNewCred({ platform: "", loginEmail: "", notes: "" });
    toast.success(`Credencial ${newCred.platform} adicionada`);
  };

  const toggleService = (svc: string) => {
    setForm({
      ...form,
      selectedServices: form.selectedServices.includes(svc)
        ? form.selectedServices.filter(s => s !== svc)
        : [...form.selectedServices, svc],
    });
  };

  const handleSave = () => {
    if (!form.name) { toast.error("Nome é obrigatório"); return; }
    if (form.selectedServices.length === 0 && !editingClient) { toast.error("Selecione ao menos um serviço"); return; }

    const generatedServices: ClientService[] = form.selectedServices.map((svc, i) => ({
      id: `new-${Date.now()}-${i}`,
      type: svc.split(" — ")[0],
      platform: svc.split(" — ")[1] || "Multi",
      status: "active",
      progress: 5,
      aiAgent: svc.includes("Tráfego") ? "Traffic AI" : svc.includes("Copy") ? "CopyMaster AI" : svc.includes("Automação") ? "Automation AI" : svc.includes("SEO") ? "SEO Local AI" : "Strategy AI",
      description: `IA ${svc.includes("Tráfego") ? "Traffic AI" : "especialista"} iniciou a produção para este serviço. Análise de mercado em andamento, estratégia sendo criada automaticamente. O sistema vai gerar campanhas, copies e automações de forma inteligente baseado nos dados do cliente e credenciais fornecidas.`,
      deliverables: [`Serviço ${svc} — Iniciando produção automática...`, "Análise de mercado em andamento", "Estratégia sendo criada pela IA", "Credenciais configuradas — acesso às plataformas OK"],
    }));

    if (editingClient) {
      setClients(clients.map(c => c.id === editingClient.id ? { ...c, name: form.name, company: form.company || null, email: form.email || null, phone: form.phone || null, document: form.document || null, type: form.type, notes: form.notes || null, credentials: form.credentials } : c));
      toast.success("Cliente atualizado com sucesso");
    } else {
      const newClient: Client = {
        id: Date.now().toString(), name: form.name, company: form.company || null, email: form.email || null, phone: form.phone || null, document: form.document || null, type: form.type, status: "active", notes: form.notes || null,
        created_at: new Date().toISOString(), credentials: form.credentials, services: generatedServices,
        totalRevenue: 0, totalLeads: 0, contractStatus: "pending",
      };
      setClients([newClient, ...clients]);
      toast.success("🤖 Cliente cadastrado! IAs especializadas já estão produzindo os serviços designados.");
    }
    resetForm();
  };

  const handleDelete = (client: Client) => {
    if (!confirm(`Excluir cliente ${client.name}?`)) return;
    setClients(clients.filter(c => c.id !== client.id));
    toast.success("Cliente excluído");
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setForm({
      name: client.name, company: client.company || "", email: client.email || "", phone: client.phone || "",
      document: client.document || "", type: client.type, notes: client.notes || "",
      credentials: client.credentials || [], selectedServices: [],
    });
    setShowForm(true);
  };

  const totalRevenue = clients.reduce((a, c) => a + c.totalRevenue, 0);
  const totalLeads = clients.reduce((a, c) => a + c.totalLeads, 0);
  const totalServices = clients.reduce((a, c) => a + c.services.length, 0);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <User className="w-7 h-7 text-primary" /> Gestão de Clientes
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Cadastro completo com credenciais, serviços designados e produção detalhada por cliente. IAs especializadas trabalham automaticamente.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "Total Clientes", value: clients.length, color: "text-foreground" },
          { label: "Ativos", value: clients.filter(c => c.status === "active").length, color: "text-green-400" },
          { label: "Receita/Mês", value: `R$${totalRevenue.toLocaleString()}`, color: "text-primary" },
          { label: "Leads Gerados", value: totalLeads.toLocaleString(), color: "text-accent" },
          { label: "Serviços Ativos", value: totalServices, color: "text-primary" },
        ].map((s, i) => (
          <div key={i} className="p-3 rounded-xl border border-border bg-card text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar clientes..."
            className="w-full h-10 bg-card border border-border rounded-lg pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Novo Cliente
        </button>
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">{editingClient ? "Editar Cliente" : "Cadastrar Novo Cliente"}</h2>
              <button onClick={resetForm} className="p-1 hover:bg-secondary rounded"><X className="w-4 h-4" /></button>
            </div>

            {/* Basic Info */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Dados do Cliente</p>
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-muted-foreground mb-1 block">Nome *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
                  <div><label className="text-xs text-muted-foreground mb-1 block">Empresa</label><input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-muted-foreground mb-1 block">Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
                  <div><label className="text-xs text-muted-foreground mb-1 block">Telefone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-muted-foreground mb-1 block">CPF/CNPJ</label><input value={form.document} onChange={e => setForm({ ...form, document: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
                  <div><label className="text-xs text-muted-foreground mb-1 block">Tipo</label>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                      <option value="pf">Pessoa Física</option><option value="pj">Pessoa Jurídica</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Credentials */}
            <div className="space-y-2 pt-2 border-t border-border">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Key className="w-3 h-3" /> Credenciais das Plataformas</p>
              <p className="text-[10px] text-muted-foreground">Insira os acessos do cliente às plataformas de marketing para que as IAs possam trabalhar.</p>
              <div className="grid grid-cols-3 gap-2">
                <select value={newCred.platform} onChange={e => setNewCred({ ...newCred, platform: e.target.value })} className="h-9 bg-secondary border border-border rounded-lg px-2 text-xs text-foreground">
                  <option value="">Plataforma...</option>
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <input value={newCred.loginEmail} onChange={e => setNewCred({ ...newCred, loginEmail: e.target.value })} placeholder="Email/Login" className="h-9 bg-secondary border border-border rounded-lg px-2 text-xs text-foreground" />
                <div className="flex gap-1">
                  <input value={newCred.notes} onChange={e => setNewCred({ ...newCred, notes: e.target.value })} placeholder="ID/Notas" className="h-9 flex-1 bg-secondary border border-border rounded-lg px-2 text-xs text-foreground" />
                  <button onClick={addCredential} className="h-9 px-3 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90">+</button>
                </div>
              </div>
              {form.credentials.length > 0 && (
                <div className="space-y-1 mt-2">
                  {form.credentials.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 border border-border/50">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3 h-3 text-primary" />
                        <span className="text-xs font-semibold text-foreground">{c.platform}</span>
                        <span className="text-[10px] text-muted-foreground">{c.loginEmail}</span>
                        {c.notes && <span className="text-[10px] text-primary">{c.notes}</span>}
                      </div>
                      <button onClick={() => setForm({ ...form, credentials: form.credentials.filter((_, j) => j !== i) })} className="text-destructive hover:text-destructive/80"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Select Services */}
            {!editingClient && (
              <div className="space-y-2 pt-2 border-t border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Briefcase className="w-3 h-3" /> Designar Serviços *</p>
                <p className="text-[10px] text-muted-foreground">Selecione os serviços que serão executados para este cliente. As IAs começam a produzir automaticamente.</p>
                <div className="grid grid-cols-2 gap-2">
                  {SERVICE_TYPES.map(svc => (
                    <button key={svc} onClick={() => toggleService(svc)}
                      className={`p-2.5 rounded-lg text-xs text-left transition-all border ${
                        form.selectedServices.includes(svc) ? "bg-primary/10 border-primary/30 text-primary font-semibold" : "bg-secondary/30 border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {form.selectedServices.includes(svc) ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-muted-foreground" />}
                        {svc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div><label className="text-xs text-muted-foreground mb-1 block">Observações</label><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>

            <div className="flex gap-3 justify-end pt-2">
              <button onClick={resetForm} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancelar</button>
              <button onClick={handleSave} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 flex items-center gap-2">
                <Play className="w-4 h-4" /> {editingClient ? "Salvar" : "Cadastrar & Iniciar Produção"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Client Detail Modal */}
      {viewingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={() => setViewingClient(null)}>
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">{viewingClient.name[0]?.toUpperCase()}</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">{viewingClient.name}</h2>
                  <p className="text-xs text-muted-foreground">{viewingClient.company || "Pessoa Física"} • {viewingClient.email} • {viewingClient.document}</p>
                </div>
              </div>
              <button onClick={() => setViewingClient(null)} className="p-1 rounded hover:bg-secondary"><X className="w-4 h-4" /></button>
            </div>

            {/* Client Stats */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Serviços", value: viewingClient.services.length, color: "text-foreground" },
                { label: "Receita/Mês", value: `R$${viewingClient.totalRevenue.toLocaleString()}`, color: "text-primary" },
                { label: "Leads", value: viewingClient.totalLeads.toLocaleString(), color: "text-green-400" },
                { label: "Contrato", value: viewingClient.contractStatus === "signed" ? "Assinado ✓" : "Pendente", color: viewingClient.contractStatus === "signed" ? "text-green-400" : "text-amber-400" },
              ].map((s, i) => (
                <div key={i} className="p-3 rounded-lg bg-secondary/30 border border-border text-center">
                  <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-[9px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-border pb-2">
              {[
                { key: "services" as const, label: "Serviços & Produção", icon: Briefcase },
                { key: "credentials" as const, label: "Credenciais", icon: Key },
                { key: "production" as const, label: "Entregáveis", icon: Eye },
              ].map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === tab.key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                </button>
              ))}
            </div>

            {/* Credentials Tab */}
            {activeTab === "credentials" && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Credenciais das Plataformas do Cliente</p>
                {viewingClient.credentials.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">Nenhuma credencial cadastrada</p>
                ) : (
                  viewingClient.credentials.map((cred, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20 border border-border/50">
                      <Globe className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{cred.platform}</p>
                        <p className="text-[10px] text-muted-foreground">{cred.loginEmail} {cred.notes && `— ${cred.notes}`}</p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto" />
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Services Tab */}
            {activeTab === "services" && viewingClient.services.length > 0 && (
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Serviços Designados & Produção Detalhada</p>
                {viewingClient.services.map(svc => (
                  <div key={svc.id} className="p-4 rounded-lg bg-secondary/20 border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Briefcase className="w-3.5 h-3.5 text-primary" />
                        <span className="text-sm font-semibold text-foreground">{svc.type}</span>
                        <span className="text-[10px] text-primary font-mono px-1.5 py-0.5 rounded bg-primary/10">{svc.platform}</span>
                        <span className="text-[10px] text-accent font-mono px-1.5 py-0.5 rounded bg-accent/10">🤖 {svc.aiAgent}</span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${svc.status === "active" ? "bg-green-500/10 text-green-400" : "bg-secondary text-muted-foreground"}`}>
                          {svc.status === "active" ? "● Produzindo" : "Inativo"}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">{svc.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-3">
                      <div className={`h-full rounded-full transition-all ${svc.progress > 70 ? "bg-green-400" : svc.progress > 40 ? "bg-primary" : "bg-amber-400"}`} style={{ width: `${svc.progress}%` }} />
                    </div>
                    <p className="text-xs text-foreground/80 leading-relaxed mb-3">{svc.description}</p>
                    {svc.deliverables && svc.deliverables.length > 0 && (
                      <div className="space-y-1 pt-2 border-t border-border/50">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">Entregáveis Produzidos:</p>
                        {svc.deliverables.map((d, i) => (
                          <div key={i} className="flex items-start gap-2 py-1">
                            <CheckCircle2 className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                            <p className="text-[11px] text-foreground/70 leading-relaxed">{d}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Production Tab - All deliverables flat */}
            {activeTab === "production" && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Todos os Conteúdos Produzidos pelas IAs</p>
                {viewingClient.services.flatMap(svc =>
                  (svc.deliverables || []).map((d, i) => (
                    <div key={`${svc.id}-${i}`} className="flex items-start gap-3 p-2 rounded-lg bg-secondary/10 border border-border/30">
                      <div className="flex-shrink-0 mt-0.5">
                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono">{svc.type}</span>
                      </div>
                      <p className="text-[11px] text-foreground/80 leading-relaxed">{d}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Clients List */}
      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <User className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Nenhum cliente encontrado</p>
          </div>
        ) : (
          filtered.map(client => (
            <div key={client.id} className="rounded-xl border border-border bg-card hover:border-primary/20 transition-all overflow-hidden">
              <div className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">{client.name[0]?.toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground truncate">{client.name}</p>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${client.status === "active" ? "bg-green-500/10 text-green-400" : "bg-muted text-muted-foreground"}`}>
                      {client.status === "active" ? "● Ativo" : "Inativo"}
                    </span>
                    <span className="text-[10px] text-primary">{client.services.length} serviço(s)</span>
                    <span className="text-[10px] text-muted-foreground">{client.credentials.length} credencial(is)</span>
                    {client.contractStatus === "signed" && <span className="text-[10px] text-green-400 flex items-center gap-0.5"><FileSignature className="w-3 h-3" /> Contrato</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    {client.company && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Building2 className="w-3 h-3" />{client.company}</span>}
                    {client.email && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Mail className="w-3 h-3" />{client.email}</span>}
                  </div>
                  {client.totalRevenue > 0 && (
                    <div className="flex items-center gap-3 mt-1 text-[10px]">
                      <span className="text-primary flex items-center gap-1"><DollarSign className="w-3 h-3" /> R${client.totalRevenue.toLocaleString()}/mês</span>
                      <span className="text-green-400 flex items-center gap-1"><BarChart3 className="w-3 h-3" /> {client.totalLeads.toLocaleString()} leads</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setViewingClient(client)} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary" title="Ver tudo"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => setExpandedId(expandedId === client.id ? null : client.id)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground">
                    {expandedId === client.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleEdit(client)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(client)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Expanded Quick View */}
              {expandedId === client.id && client.services.length > 0 && (
                <div className="border-t border-border p-4 bg-secondary/10 space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Produção Ativa — IAs Trabalhando</p>
                  {client.services.map(svc => (
                    <div key={svc.id} className="p-3 rounded-lg bg-card border border-border/50 hover:border-primary/20 transition-all">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground">{svc.type}</span>
                          <span className="text-[10px] text-primary font-mono">{svc.platform}</span>
                          <span className="text-[10px] text-accent">🤖 {svc.aiAgent}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${svc.progress > 70 ? "bg-green-400" : "bg-primary"}`} style={{ width: `${svc.progress}%` }} />
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground">{svc.progress}%</span>
                        </div>
                      </div>
                      <p className="text-xs text-foreground/70 leading-relaxed">{svc.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
