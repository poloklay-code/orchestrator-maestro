import { useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Zap, Trash2, Play, Pause, Eye, ChevronDown, ChevronUp, X, ArrowDown, Bot, Clock, CheckCircle2, Activity, Users, GitBranch, Globe, MessageSquare, Mail, Database, TrendingUp, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from "recharts";
import { Link } from "react-router-dom";

const AUTOMATION_PLATFORMS = ["n8n", "Make (Integromat)", "ManyChat", "Zapier", "ActiveCampaign", "RD Station", "HubSpot", "Kommo (amoCRM)", "Typebot", "BotConversa", "WhatsApp Business API", "Twilio", "Evolution API", "Chatwoot"];

interface WorkflowStep {
  id: string; name: string; type: string; description: string; status: "done" | "running" | "pending";
}

interface Automation {
  id: string; platform: string; workflow_name: string | null; status: string;
  trigger_type: string | null; executions: number; clientName?: string; created_at: string;
  description?: string; steps?: WorkflowStep[];
  results?: { leads: number; messages: number; conversions: number };
}

const demoAutomations: Automation[] = [
  {
    id: "1", platform: "n8n", workflow_name: "Lead Capture WhatsApp", status: "active", trigger_type: "webhook", executions: 1247, clientName: "João Silva", created_at: new Date().toISOString(),
    description: "Automação completa de captura de leads via WhatsApp. Quando um lead preenche o formulário no site, o sistema captura os dados, salva no CRM, qualifica o lead com IA e dispara mensagem personalizada no WhatsApp em menos de 30 segundos.",
    steps: [
      { id: "s1", name: "Webhook — Formulário do Site", type: "trigger", description: "Recebe dados do formulário (nome, email, telefone, interesse)", status: "done" },
      { id: "s2", name: "Validação de Dados", type: "filter", description: "Verifica se email e telefone são válidos. Remove duplicados.", status: "done" },
      { id: "s3", name: "Qualificação IA", type: "ai", description: "IA analisa o perfil do lead e atribui score de 0 a 100 baseado no interesse e potencial de compra.", status: "done" },
      { id: "s4", name: "Salvar no CRM", type: "database", description: "Cadastra lead no CRM com tags automáticas: fonte, interesse, score, data.", status: "done" },
      { id: "s5", name: "Segmentação Automática", type: "logic", description: "Se score > 70: lead quente → vendedor. Se 40-70: lead morno → nutrição. Se < 40: lead frio → remarketing.", status: "done" },
      { id: "s6", name: "Enviar WhatsApp", type: "message", description: "Dispara mensagem personalizada.", status: "done" },
      { id: "s7", name: "Notificar Equipe", type: "notification", description: "Se lead quente: notifica vendedor no Slack.", status: "done" },
    ],
    results: { leads: 1247, messages: 1180, conversions: 312 },
  },
  {
    id: "2", platform: "ManyChat", workflow_name: "Follow-up Automático Instagram", status: "active", trigger_type: "event", executions: 834, clientName: "Maria Santos", created_at: new Date().toISOString(),
    description: "Fluxo de atendimento automatizado no Instagram via ManyChat.",
    steps: [
      { id: "s1", name: "Gatilho — Comentário ou DM", type: "trigger", description: "Detecta quando usuário comenta palavra-chave.", status: "done" },
      { id: "s2", name: "Mensagem de Boas-Vindas", type: "message", description: "Olá! Como posso ajudar?", status: "done" },
      { id: "s3", name: "Pergunta de Qualificação", type: "question", description: "Qual área mais te interessa?", status: "done" },
      { id: "s4", name: "Nutrição Personalizada", type: "content", description: "Envia conteúdo específico.", status: "done" },
      { id: "s5", name: "Captura de Contato", type: "form", description: "Solicita nome, email e WhatsApp.", status: "done" },
      { id: "s6", name: "Encaminhar para Vendedor", type: "handoff", description: "Transfere para vendedor humano.", status: "running" },
    ],
    results: { leads: 834, messages: 4200, conversions: 189 },
  },
  {
    id: "3", platform: "Make (Integromat)", workflow_name: "Sync CRM → Email → WhatsApp", status: "active", trigger_type: "schedule", executions: 456, clientName: "Carlos Lima", created_at: new Date().toISOString(),
    description: "Sincronização automática entre CRM, email e WhatsApp.",
    steps: [
      { id: "s1", name: "Agendamento — A cada 30 min", type: "trigger", description: "Executa automaticamente.", status: "done" },
      { id: "s2", name: "Buscar Novos Leads", type: "database", description: "Consulta CRM.", status: "done" },
      { id: "s3", name: "Adicionar na Lista de Email", type: "email", description: "Cadastra lead no ActiveCampaign.", status: "done" },
      { id: "s4", name: "Iniciar Sequência Email", type: "automation", description: "Ativa automação de 7 emails.", status: "done" },
      { id: "s5", name: "Enviar WhatsApp Boas-Vindas", type: "message", description: "Dispara mensagem.", status: "done" },
      { id: "s6", name: "Marcar como Sincronizado", type: "update", description: "Atualiza CRM.", status: "done" },
    ],
    results: { leads: 456, messages: 2736, conversions: 98 },
  },
  {
    id: "4", platform: "n8n", workflow_name: "Cobrança Automática + Follow-up", status: "active", trigger_type: "schedule", executions: 189, clientName: undefined, created_at: new Date().toISOString(),
    description: "Sistema de cobrança automática inteligente.",
    steps: [
      { id: "s1", name: "Verificar Faturas Vencidas", type: "trigger", description: "Todo dia às 8h.", status: "done" },
      { id: "s2", name: "Enviar Lembrete — Dia 1", type: "email", description: "Email amigável.", status: "done" },
      { id: "s3", name: "WhatsApp — Dia 3", type: "message", description: "Mensagem WhatsApp.", status: "done" },
      { id: "s4", name: "Aviso de Suspensão — Dia 7", type: "email", description: "Email formal.", status: "running" },
      { id: "s5", name: "Suspensão — Dia 15", type: "action", description: "Desativa serviço.", status: "pending" },
    ],
    results: { leads: 0, messages: 567, conversions: 145 },
  },
  {
    id: "5", platform: "Zapier", workflow_name: "Post Automático Redes Sociais", status: "active", trigger_type: "schedule", executions: 320, clientName: "Maria Santos", created_at: new Date().toISOString(),
    description: "Automação de publicação em múltiplas redes sociais.",
    steps: [
      { id: "s1", name: "IA Gera Conteúdo Semanal", type: "ai", description: "IA cria 7 posts.", status: "done" },
      { id: "s2", name: "Adaptar para Instagram", type: "format", description: "Ajusta copy.", status: "done" },
      { id: "s3", name: "Adaptar para Facebook", type: "format", description: "Versão expandida.", status: "done" },
      { id: "s4", name: "Adaptar para LinkedIn", type: "format", description: "Tom profissional.", status: "done" },
      { id: "s5", name: "Agendar Publicações", type: "schedule", description: "Agenda nos melhores horários.", status: "running" },
    ],
    results: { leads: 0, messages: 0, conversions: 0 },
  },
];

const demoClients = [{ id: "1", name: "João Silva" }, { id: "2", name: "Maria Santos" }, { id: "3", name: "Carlos Lima" }];

/* Chart Data */
const execByPlatform = [
  { name: "n8n", execucoes: 1436, fill: "hsl(25, 80%, 55%)" },
  { name: "ManyChat", execucoes: 834, fill: "hsl(210, 80%, 55%)" },
  { name: "Make", execucoes: 456, fill: "hsl(270, 60%, 60%)" },
  { name: "Zapier", execucoes: 320, fill: "hsl(35, 80%, 55%)" },
];

const execTrend = [
  { dia: "Seg", execucoes: 180, erros: 3 },
  { dia: "Ter", execucoes: 245, erros: 1 },
  { dia: "Qua", execucoes: 310, erros: 5 },
  { dia: "Qui", execucoes: 280, erros: 2 },
  { dia: "Sex", execucoes: 350, erros: 4 },
  { dia: "Sab", execucoes: 120, erros: 0 },
  { dia: "Dom", execucoes: 85, erros: 1 },
];

const clientAutomations = [
  { cliente: "João Silva", automacoes: 3, execucoes: 1247, conversoes: 312 },
  { cliente: "Maria Santos", automacoes: 2, execucoes: 1154, conversoes: 189 },
  { cliente: "Carlos Lima", automacoes: 1, execucoes: 456, conversoes: 98 },
  { cliente: "Admin", automacoes: 1, execucoes: 189, conversoes: 145 },
];

export default function AutomationsManager() {
  const [automations, setAutomations] = useState<Automation[]>(demoAutomations);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewingAuto, setViewingAuto] = useState<Automation | null>(null);
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiForm, setAiForm] = useState({ clientName: "", businessDescription: "", siteUrl: "", instagramUrl: "", platform: "n8n", objective: "Lead Capture" });
  const [form, setForm] = useState({ client_id: "", platform: "", workflow_name: "", status: "active", trigger_type: "webhook" });

  const filtered = automations.filter((a) =>
    a.platform.toLowerCase().includes(search.toLowerCase()) || a.workflow_name?.toLowerCase().includes(search.toLowerCase()) || a.clientName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!form.platform) { toast.error("Plataforma obrigatória"); return; }
    const clientName = demoClients.find(c => c.id === form.client_id)?.name;
    setAutomations([{ id: Date.now().toString(), ...form, executions: 0, clientName, created_at: new Date().toISOString(), description: "Nova automação criada." } as Automation, ...automations]);
    toast.success("Automação cadastrada"); setShowForm(false);
  };

  const toggleStatus = (auto: Automation) => {
    const newStatus = auto.status === "active" ? "paused" : "active";
    setAutomations(automations.map((a) => a.id === auto.id ? { ...a, status: newStatus } : a));
    toast.success(`Automação ${newStatus === "active" ? "ativada" : "pausada"}`);
  };

  const handleDelete = (auto: Automation) => {
    if (!confirm(`Excluir automação ${auto.workflow_name || auto.platform}?`)) return;
    setAutomations(automations.filter((a) => a.id !== auto.id));
    toast.success("Automação excluída");
  };

  const handleAiGenerate = async () => {
    if (!aiForm.clientName || !aiForm.businessDescription) { toast.error("Preencha nome e descrição"); return; }
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    const newAuto: Automation = {
      id: Date.now().toString(), platform: aiForm.platform, workflow_name: `${aiForm.objective} — ${aiForm.clientName}`,
      status: "active", trigger_type: "webhook", executions: 0, clientName: aiForm.clientName, created_at: new Date().toISOString(),
      description: `Automação criada pela IA: "${aiForm.businessDescription}". ${aiForm.siteUrl ? `Site: ${aiForm.siteUrl}. ` : ""}${aiForm.instagramUrl ? `Instagram: ${aiForm.instagramUrl}. ` : ""}`,
      steps: [
        { id: "s1", name: "Gatilho — Captura Inteligente", type: "trigger", description: `Monitora ${aiForm.siteUrl || "formulários"} e captura dados completos.`, status: "done" },
        { id: "s2", name: "Crackeamento de Dados do Lead", type: "ai", description: "IA enriquece dados: busca redes sociais, empresa, cargo.", status: "done" },
        { id: "s3", name: "Qualificação IA Avançada", type: "ai", description: `Análise profunda: "${aiForm.businessDescription}". Score 0-100.`, status: "done" },
        { id: "s4", name: "Segmentação Inteligente", type: "logic", description: "Score > 70: quente → vendedor. 40-70: nutrição. < 40: remarketing.", status: "running" },
        { id: "s5", name: "Nutrição Multi-Canal", type: "message", description: "WhatsApp (imediato) → Email (2h) → SMS (24h).", status: "pending" },
        { id: "s6", name: "Sync CRM + Relatório", type: "database", description: "Salva no CRM, gera relatório automático.", status: "pending" },
      ],
      results: { leads: 0, messages: 0, conversions: 0 },
    };
    setAutomations([newAuto, ...automations]);
    setGenerating(false); setShowAiGenerator(false);
    toast.success(`Automação criada pela IA para ${aiForm.clientName}!`);
  };

  const stepIcon = (type: string) => {
    if (type === "trigger") return <Zap className="w-3.5 h-3.5 text-yellow-400" />;
    if (type === "message") return <MessageSquare className="w-3.5 h-3.5 text-green-400" />;
    if (type === "email") return <Mail className="w-3.5 h-3.5 text-blue-400" />;
    if (type === "database" || type === "update") return <Database className="w-3.5 h-3.5 text-accent" />;
    if (type === "ai") return <Bot className="w-3.5 h-3.5 text-primary" />;
    if (type === "filter" || type === "logic") return <GitBranch className="w-3.5 h-3.5 text-muted-foreground" />;
    return <Activity className="w-3.5 h-3.5 text-muted-foreground" />;
  };

  const totalExec = automations.reduce((a, b) => a + b.executions, 0);
  const activeCount = automations.filter(a => a.status === "active").length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Zap className="w-7 h-7 text-primary" /> Automações — Central de Workflows
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Todos os fluxos de automação com visualização detalhada de cada etapa, execuções e resultados.</p>
        </div>
        <Link to="/dashboard/workflows" className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 text-accent rounded-lg text-xs font-semibold hover:bg-accent/20 transition-all">
          <GitBranch className="w-4 h-4" /> Ver Workflows
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-foreground">{automations.length}</p>
          <p className="text-[10px] text-muted-foreground">Total Automações</p>
        </div>
        <div className="p-3 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-green-400">{activeCount}</p>
          <p className="text-[10px] text-muted-foreground">Ativas</p>
        </div>
        <div className="p-3 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-primary">{totalExec.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Execuções Total</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> Execuções por Plataforma
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={execByPlatform}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
              <Bar dataKey="execucoes" radius={[6, 6, 0, 0]}>
                {execByPlatform.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent" /> Tendência de Execuções (Semana)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={execTrend}>
              <defs>
                <linearGradient id="execGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="erroGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="dia" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
              <Area type="monotone" dataKey="execucoes" stroke="hsl(var(--primary))" fill="url(#execGrad)" strokeWidth={2.5} name="Execuções" />
              <Area type="monotone" dataKey="erros" stroke="hsl(var(--destructive))" fill="url(#erroGrad)" strokeWidth={1.5} name="Erros" />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Client Automations Performance */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" /> Performance por Cliente
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={clientAutomations}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="cliente" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
            <Bar dataKey="execucoes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Execuções" />
            <Bar dataKey="conversoes" fill="hsl(142, 70%, 45%)" radius={[4, 4, 0, 0]} name="Conversões" />
            <Legend wrapperStyle={{ fontSize: 10 }} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Generator */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">IA Gerador de Automações</h3>
          </div>
          <button onClick={() => setShowAiGenerator(!showAiGenerator)} className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90">
            <Bot className="w-3.5 h-3.5" /> {showAiGenerator ? "Fechar" : "Criar com IA"}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">Descreva o negócio do cliente, insira site ou Instagram — a IA cria automações completas.</p>
        {showAiGenerator && (
          <div className="mt-3 space-y-3 p-4 rounded-lg border border-primary/20 bg-card">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Nome do Cliente *</label>
                <input value={aiForm.clientName} onChange={e => setAiForm({ ...aiForm, clientName: e.target.value })} placeholder="Ex: Studio Digital" className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Plataforma</label>
                <select value={aiForm.platform} onChange={e => setAiForm({ ...aiForm, platform: e.target.value })} className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  {AUTOMATION_PLATFORMS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Descrição do Negócio *</label>
              <textarea value={aiForm.businessDescription} onChange={e => setAiForm({ ...aiForm, businessDescription: e.target.value })} placeholder="Ex: Agência de marketing digital..." rows={2} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Site</label>
                <input value={aiForm.siteUrl} onChange={e => setAiForm({ ...aiForm, siteUrl: e.target.value })} placeholder="https://..." className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Instagram</label>
                <input value={aiForm.instagramUrl} onChange={e => setAiForm({ ...aiForm, instagramUrl: e.target.value })} placeholder="@perfil" className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Objetivo</label>
                <select value={aiForm.objective} onChange={e => setAiForm({ ...aiForm, objective: e.target.value })} className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option>Lead Capture</option><option>Follow-up</option><option>Cobrança</option><option>Onboarding</option><option>Remarketing</option><option>Sync CRM</option>
                </select>
              </div>
            </div>
            <button onClick={handleAiGenerate} disabled={generating} className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
              {generating ? <Clock className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {generating ? "IA Criando Automação..." : "Criar Automação com IA"}
            </button>
          </div>
        )}
      </div>

      {/* Search + Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar automações..."
            className="w-full h-10 bg-card border border-border rounded-lg pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> Nova Automação
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Nova Automação</h2>
            <div className="grid gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Plataforma *</label>
                <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="">Selecionar</option>
                  {AUTOMATION_PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Cliente</label>
                <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="">Geral</option>
                  {demoClients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Nome do Workflow</label>
                  <input value={form.workflow_name} onChange={(e) => setForm({ ...form, workflow_name: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Trigger</label>
                  <select value={form.trigger_type} onChange={(e) => setForm({ ...form, trigger_type: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="webhook">Webhook</option><option value="schedule">Agendado</option><option value="manual">Manual</option><option value="event">Evento</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted-foreground">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* Workflow View Modal */}
      {viewingAuto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={() => setViewingAuto(null)}>
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-primary" /> {viewingAuto.workflow_name}
                </h2>
                <p className="text-xs text-muted-foreground">{viewingAuto.platform} • {viewingAuto.clientName || "Geral"} • {viewingAuto.executions} execuções</p>
              </div>
              <button onClick={() => setViewingAuto(null)} className="p-1 rounded hover:bg-secondary"><X className="w-4 h-4" /></button>
            </div>

            {viewingAuto.description && (
              <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Descrição</p>
                <p className="text-xs text-foreground/80 leading-relaxed">{viewingAuto.description}</p>
              </div>
            )}

            {viewingAuto.steps && (
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-3">Fluxo Completo ({viewingAuto.steps.length} etapas)</p>
                <div className="space-y-0">
                  {viewingAuto.steps.map((step, i) => (
                    <div key={step.id}>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20 border border-border/50 hover:border-primary/20 transition-all">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${step.status === "done" ? "bg-green-500/10" : step.status === "running" ? "bg-primary/10" : "bg-secondary"}`}>
                          {stepIcon(step.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-foreground">{step.name}</p>
                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${step.status === "done" ? "bg-green-500/10 text-green-400" : step.status === "running" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                              {step.status === "done" ? "✓ Concluído" : step.status === "running" ? "⚡ Executando" : "⏳ Pendente"}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                      {i < viewingAuto.steps!.length - 1 && (
                        <div className="flex justify-center py-1"><ArrowDown className="w-4 h-4 text-muted-foreground/50" /></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {viewingAuto.results && (
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-lg bg-card border border-border text-center">
                  <p className="text-lg font-bold text-foreground">{viewingAuto.results.leads.toLocaleString()}</p>
                  <p className="text-[9px] text-muted-foreground">Leads</p>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border text-center">
                  <p className="text-lg font-bold text-primary">{viewingAuto.results.messages.toLocaleString()}</p>
                  <p className="text-[9px] text-muted-foreground">Mensagens</p>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border text-center">
                  <p className="text-lg font-bold text-green-400">{viewingAuto.results.conversions.toLocaleString()}</p>
                  <p className="text-[9px] text-muted-foreground">Conversões</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Automations List */}
      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground"><Zap className="w-10 h-10 mx-auto mb-3 opacity-40" /><p className="text-sm">Nenhuma automação encontrada</p></div>
        ) : (
          filtered.map((auto) => (
            <div key={auto.id} className="rounded-xl border border-border bg-card hover:border-primary/20 transition-all overflow-hidden">
              <div className="flex items-center gap-4 p-4 group">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${auto.status === "active" ? "bg-green-500 animate-pulse" : "bg-muted-foreground"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{auto.workflow_name || auto.platform}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                    <span className="text-primary font-mono">{auto.platform}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {auto.clientName || "Geral"}</span>
                    <span>{auto.executions.toLocaleString()} execuções</span>
                  </div>
                  {auto.description && <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-1">{auto.description}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setViewingAuto(auto)} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" title="Ver workflow">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => setExpandedId(expandedId === auto.id ? null : auto.id)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                    {expandedId === auto.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button onClick={() => toggleStatus(auto)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground">
                    {auto.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleDelete(auto)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              {expandedId === auto.id && (
                <div className="border-t border-border p-4 bg-secondary/10 space-y-3">
                  {auto.description && (
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Descrição</p>
                      <p className="text-xs text-foreground/70 leading-relaxed">{auto.description}</p>
                    </div>
                  )}
                  {auto.steps && (
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Fluxo Resumido</p>
                      <div className="flex flex-wrap items-center gap-1">
                        {auto.steps.map((step, i) => (
                          <div key={step.id} className="flex items-center gap-1">
                            <span className={`text-[10px] px-2 py-1 rounded-lg flex items-center gap-1 ${step.status === "done" ? "bg-green-500/10 text-green-400" : step.status === "running" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                              {stepIcon(step.type)} {step.name.split("—")[0].trim()}
                            </span>
                            {i < auto.steps!.length - 1 && <span className="text-muted-foreground/30">→</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {auto.results && (
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2 rounded-lg bg-card border border-border/50 text-center">
                        <p className="text-sm font-bold text-foreground">{auto.results.leads.toLocaleString()}</p>
                        <p className="text-[9px] text-muted-foreground">Leads</p>
                      </div>
                      <div className="p-2 rounded-lg bg-card border border-border/50 text-center">
                        <p className="text-sm font-bold text-primary">{auto.results.messages.toLocaleString()}</p>
                        <p className="text-[9px] text-muted-foreground">Mensagens</p>
                      </div>
                      <div className="p-2 rounded-lg bg-card border border-border/50 text-center">
                        <p className="text-sm font-bold text-green-400">{auto.results.conversions.toLocaleString()}</p>
                        <p className="text-[9px] text-muted-foreground">Conversões</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
