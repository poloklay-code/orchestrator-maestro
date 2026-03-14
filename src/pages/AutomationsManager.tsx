import { useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Zap, Trash2, Play, Pause, Eye, ChevronDown, ChevronUp, X, ArrowDown, Bot, Clock, CheckCircle2, Activity, Users, GitBranch, Globe, MessageSquare, Mail, Database } from "lucide-react";

const AUTOMATION_PLATFORMS = ["n8n", "Make (Integromat)", "ManyChat", "Zapier", "ActiveCampaign", "RD Station", "HubSpot", "Kommo (amoCRM)", "Typebot", "BotConversa", "WhatsApp Business API", "Twilio", "Evolution API", "Chatwoot"];

interface WorkflowStep {
  id: string;
  name: string;
  type: string;
  description: string;
  status: "done" | "running" | "pending";
}

interface Automation {
  id: string; platform: string; workflow_name: string | null; status: string;
  trigger_type: string | null; executions: number; clientName?: string; created_at: string;
  description?: string;
  steps?: WorkflowStep[];
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
      { id: "s6", name: "Enviar WhatsApp", type: "message", description: "Dispara mensagem personalizada: 'Oi [NOME]! Vi que você se interessou por [INTERESSE]. Posso te ajudar?'", status: "done" },
      { id: "s7", name: "Notificar Equipe", type: "notification", description: "Se lead quente: notifica vendedor no Slack com dados completos do lead.", status: "done" },
    ],
    results: { leads: 1247, messages: 1180, conversions: 312 },
  },
  {
    id: "2", platform: "ManyChat", workflow_name: "Follow-up Automático Instagram", status: "active", trigger_type: "event", executions: 834, clientName: "Maria Santos", created_at: new Date().toISOString(),
    description: "Fluxo de atendimento automatizado no Instagram via ManyChat. Quando um usuário comenta em um post ou envia DM, o bot inicia uma conversa inteligente que qualifica, nutre e encaminha o lead para a equipe de vendas.",
    steps: [
      { id: "s1", name: "Gatilho — Comentário ou DM", type: "trigger", description: "Detecta quando usuário comenta palavra-chave no post ou envia mensagem direta.", status: "done" },
      { id: "s2", name: "Mensagem de Boas-Vindas", type: "message", description: "Olá! 👋 Obrigado pelo interesse! Posso te ajudar com informações sobre nossos serviços?", status: "done" },
      { id: "s3", name: "Pergunta de Qualificação", type: "question", description: "Qual área mais te interessa? 1️⃣ Marketing Digital 2️⃣ Automação 3️⃣ IA para Negócios", status: "done" },
      { id: "s4", name: "Nutrição Personalizada", type: "content", description: "Envia conteúdo específico baseado na resposta: vídeo, PDF ou link do serviço escolhido.", status: "done" },
      { id: "s5", name: "Captura de Contato", type: "form", description: "Solicita nome completo, email e WhatsApp para contato personalizado.", status: "done" },
      { id: "s6", name: "Encaminhar para Vendedor", type: "handoff", description: "Se lead qualificado: transfere para vendedor humano com histórico completo da conversa.", status: "running" },
    ],
    results: { leads: 834, messages: 4200, conversions: 189 },
  },
  {
    id: "3", platform: "Make (Integromat)", workflow_name: "Sync CRM → Email → WhatsApp", status: "active", trigger_type: "schedule", executions: 456, clientName: "Carlos Lima", created_at: new Date().toISOString(),
    description: "Sincronização automática entre CRM, plataforma de email marketing e WhatsApp. A cada 30 minutos, verifica novos leads no CRM, adiciona na lista de email e envia sequência de boas-vindas pelo WhatsApp.",
    steps: [
      { id: "s1", name: "Agendamento — A cada 30 min", type: "trigger", description: "Executa automaticamente a cada 30 minutos, 24 horas por dia.", status: "done" },
      { id: "s2", name: "Buscar Novos Leads no CRM", type: "database", description: "Consulta CRM filtrando leads criados nos últimos 30 minutos que ainda não foram sincronizados.", status: "done" },
      { id: "s3", name: "Adicionar na Lista de Email", type: "email", description: "Cadastra lead no ActiveCampaign com tags: data_entrada, fonte, interesse, score.", status: "done" },
      { id: "s4", name: "Iniciar Sequência Email (7 dias)", type: "automation", description: "Ativa automação de 7 emails: boas-vindas, educação, cases, oferta, urgência, última chance, feedback.", status: "done" },
      { id: "s5", name: "Enviar WhatsApp Boas-Vindas", type: "message", description: "Dispara mensagem: 'Bem-vindo! Acabamos de enviar um material exclusivo no seu email. Confira!'", status: "done" },
      { id: "s6", name: "Marcar como Sincronizado", type: "update", description: "Atualiza CRM marcando lead como sincronizado para evitar duplicação.", status: "done" },
    ],
    results: { leads: 456, messages: 2736, conversions: 98 },
  },
  {
    id: "4", platform: "n8n", workflow_name: "Cobrança Automática + Follow-up", status: "active", trigger_type: "schedule", executions: 189, clientName: undefined, created_at: new Date().toISOString(),
    description: "Sistema de cobrança automática inteligente. Monitora faturas vencidas, envia lembretes progressivos por email e WhatsApp, e escala para suspensão automática após 15 dias sem pagamento.",
    steps: [
      { id: "s1", name: "Verificar Faturas Vencidas", type: "trigger", description: "Todo dia às 8h: consulta faturas com vencimento passado e status 'pendente'.", status: "done" },
      { id: "s2", name: "Enviar Lembrete — Dia 1", type: "email", description: "Email amigável: 'Olá! Sua fatura de R$[VALOR] venceu ontem. Segue link para pagamento.'", status: "done" },
      { id: "s3", name: "WhatsApp — Dia 3", type: "message", description: "Mensagem WhatsApp: 'Oi! Notamos que sua fatura está pendente. Podemos ajudar? Segue PIX.'", status: "done" },
      { id: "s4", name: "Aviso de Suspensão — Dia 7", type: "email", description: "Email formal: 'Aviso: seu serviço será suspenso em 8 dias caso o pagamento não seja confirmado.'", status: "running" },
      { id: "s5", name: "Suspensão Automática — Dia 15", type: "action", description: "Desativa serviço automaticamente. Notifica cliente e equipe interna.", status: "pending" },
      { id: "s6", name: "Cancelamento — Dia 30", type: "action", description: "Cancela contrato definitivamente. Gera relatório final para arquivo.", status: "pending" },
    ],
    results: { leads: 0, messages: 567, conversions: 145 },
  },
  {
    id: "5", platform: "Zapier", workflow_name: "Post Automático Redes Sociais", status: "active", trigger_type: "schedule", executions: 320, clientName: "Maria Santos", created_at: new Date().toISOString(),
    description: "Automação de publicação em múltiplas redes sociais. A IA cria o conteúdo, adapta para cada plataforma e agenda publicação nos melhores horários.",
    steps: [
      { id: "s1", name: "IA Gera Conteúdo Semanal", type: "ai", description: "Todo domingo às 20h: IA cria 7 posts (1 por dia) baseados no calendário editorial do cliente.", status: "done" },
      { id: "s2", name: "Adaptar para Instagram", type: "format", description: "Ajusta copy para 2200 caracteres, adiciona hashtags relevantes e sugere imagem.", status: "done" },
      { id: "s3", name: "Adaptar para Facebook", type: "format", description: "Versão expandida com link, emoji e CTA para engajamento.", status: "done" },
      { id: "s4", name: "Adaptar para LinkedIn", type: "format", description: "Tom profissional, sem emoji excessivo, foco em autoridade e valor.", status: "done" },
      { id: "s5", name: "Agendar Publicações", type: "schedule", description: "Agenda nos melhores horários de cada plataforma com base no histórico de engajamento.", status: "running" },
    ],
    results: { leads: 0, messages: 0, conversions: 0 },
  },
];

const demoClients = [{ id: "1", name: "João Silva" }, { id: "2", name: "Maria Santos" }, { id: "3", name: "Carlos Lima" }];

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
    setAutomations([{ id: Date.now().toString(), ...form, executions: 0, clientName, created_at: new Date().toISOString(), description: "Nova automação criada pela IA. Configuração em andamento..." } as Automation, ...automations]);
    toast.success("Automação cadastrada — IA configurando fluxo...");
    setShowForm(false);
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

  const stepIcon = (type: string) => {
    if (type === "trigger") return <Zap className="w-3.5 h-3.5 text-yellow-400" />;
    if (type === "message") return <MessageSquare className="w-3.5 h-3.5 text-green-400" />;
    if (type === "email") return <Mail className="w-3.5 h-3.5 text-blue-400" />;
    if (type === "database" || type === "update") return <Database className="w-3.5 h-3.5 text-accent" />;
    if (type === "ai") return <Bot className="w-3.5 h-3.5 text-primary" />;
    if (type === "filter" || type === "logic") return <GitBranch className="w-3.5 h-3.5 text-muted-foreground" />;
    return <Activity className="w-3.5 h-3.5 text-muted-foreground" />;
  };

  // Stats
  const totalExec = automations.reduce((a, b) => a + b.executions, 0);
  const activeCount = automations.filter(a => a.status === "active").length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Zap className="w-7 h-7 text-primary" /> Automações — Central de Workflows
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Todos os fluxos de automação com visualização detalhada de cada etapa, execuções e resultados em tempo real.</p>
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
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancelar</button>
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
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Descrição do Workflow</p>
                <p className="text-xs text-foreground/80 leading-relaxed">{viewingAuto.description}</p>
              </div>
            )}

            {/* Workflow Steps */}
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
                        <div className="flex justify-center py-1">
                          <ArrowDown className="w-4 h-4 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            {viewingAuto.results && (
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-lg bg-card border border-border text-center">
                  <p className="text-lg font-bold text-foreground">{viewingAuto.results.leads.toLocaleString()}</p>
                  <p className="text-[9px] text-muted-foreground">Leads Capturados</p>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border text-center">
                  <p className="text-lg font-bold text-primary">{viewingAuto.results.messages.toLocaleString()}</p>
                  <p className="text-[9px] text-muted-foreground">Mensagens Enviadas</p>
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
                    {auto.trigger_type && <span className="font-mono">{auto.trigger_type}</span>}
                  </div>
                  {auto.description && <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-1">{auto.description}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setViewingAuto(auto)} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" title="Ver workflow completo">
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

              {/* Inline Expanded */}
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
