import { useState } from "react";
import {
  Boxes, Plus, Bot, Play, Pause, Trash2, Eye, Globe, MessageSquare,
  Phone, Zap, Cpu, CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

const AGENT_TYPES = [
  { value: "chatbot", label: "Chatbot Atendimento", desc: "Atendimento ao cliente 24h" },
  { value: "sales", label: "Agente de Vendas", desc: "Qualificacao e conversao de leads" },
  { value: "support", label: "Suporte Tecnico", desc: "Resolucao de problemas e FAQ" },
  { value: "scheduler", label: "Agendamento", desc: "Agendamento de reunioes e consultas" },
  { value: "content", label: "Gerador de Conteudo", desc: "Criacao de posts e copy" },
  { value: "analyst", label: "Analista de Dados", desc: "Analise de metricas e relatorios" },
  { value: "receptionist", label: "Recepcionista Virtual", desc: "Triagem e direcionamento" },
  { value: "custom", label: "Personalizado", desc: "Configuracao 100% customizada" },
];

const MODELS = [
  { value: "gpt-4o", label: "GPT-4o (Recomendado)" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini (Rapido)" },
  { value: "claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
  { value: "claude-3-haiku", label: "Claude 3 Haiku (Rapido)" },
  { value: "gemini-pro", label: "Gemini Pro" },
  { value: "llama-3.1-70b", label: "Llama 3.1 70B" },
];

const DEPLOY_PLATFORMS = [
  { value: "whatsapp", label: "WhatsApp", icon: Phone, color: "hsl(142 70% 49%)" },
  { value: "instagram", label: "Instagram DM", icon: MessageSquare, color: "hsl(330 80% 55%)" },
  { value: "website", label: "Widget no Site", icon: Globe, color: "hsl(187 80% 42%)" },
  { value: "telegram", label: "Telegram", icon: MessageSquare, color: "hsl(200 100% 40%)" },
  { value: "facebook", label: "Facebook Messenger", icon: MessageSquare, color: "hsl(214 89% 52%)" },
  { value: "api", label: "API Endpoint", icon: Zap, color: "hsl(258 90% 66%)" },
];

type Agent = {
  id: string; name: string; type: string; platform: string;
  model: string; system_prompt: string; status: string;
  conversations: number; client_name: string;
};

const DEMO_AGENTS: Agent[] = [
  { id: "1", name: "Atendente Maria", type: "chatbot", platform: "whatsapp", model: "gpt-4o-mini", system_prompt: "Voce e um assistente de atendimento profissional.", status: "active", conversations: 1247, client_name: "Tech Solutions" },
  { id: "2", name: "Vendedor Carlos", type: "sales", platform: "instagram", model: "gpt-4o", system_prompt: "Voce e um agente de vendas consultivo.", status: "active", conversations: 589, client_name: "E-commerce Pro" },
  { id: "3", name: "Suporte Ana", type: "support", platform: "website", model: "claude-3-haiku", system_prompt: "Voce e um agente de suporte tecnico.", status: "paused", conversations: 312, client_name: "SaaS Corp" },
];

export default function AgentForgePanel() {
  const [agents, setAgents] = useState<Agent[]>(DEMO_AGENTS);
  const [showForm, setShowForm] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [testMessages, setTestMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [testInput, setTestInput] = useState("");
  const [form, setForm] = useState({
    name: "", type: "chatbot", model: "gpt-4o-mini", platform: "whatsapp", system_prompt: "",
  });

  function handleCreate() {
    if (!form.name) { toast.error("Preencha o nome do agente"); return; }
    const newAgent: Agent = {
      id: Date.now().toString(), name: form.name, type: form.type, platform: form.platform,
      model: form.model, system_prompt: form.system_prompt || "Prompt padrao do sistema", status: "draft",
      conversations: 0, client_name: "Sem cliente",
    };
    setAgents([newAgent, ...agents]);
    toast.success(`Agente "${form.name}" criado!`);
    setForm({ name: "", type: "chatbot", model: "gpt-4o-mini", platform: "whatsapp", system_prompt: "" });
    setShowForm(false);
  }

  function toggleAgent(agent: Agent) {
    const newStatus = agent.status === "active" ? "paused" : "active";
    setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: newStatus } : a));
    toast.success(newStatus === "active" ? `"${agent.name}" ativado!` : `"${agent.name}" pausado`);
  }

  function deleteAgent(id: string) {
    setAgents(prev => prev.filter(a => a.id !== id));
    toast.success("Agente removido");
  }

  function startTest(agent: Agent) {
    setSelectedAgent(agent);
    setTestMessages([{ role: "assistant", content: `Ola! Eu sou ${agent.name}. Como posso ajudar?` }]);
    setTestOpen(true);
  }

  function sendTestMessage() {
    if (!testInput.trim()) return;
    setTestMessages(prev => [...prev, { role: "user", content: testInput }]);
    setTestInput("");
    setTimeout(() => {
      const responses: Record<string, string[]> = {
        chatbot: ["Entendi sua duvida! Deixa eu verificar.", "Claro! Posso te ajudar com isso."],
        sales: ["Excelente interesse! Esse produto gera otimos resultados.", "Tenho a solucao perfeita para voce."],
        support: ["Vamos resolver isso juntos.", "Identifiquei o problema. Siga estes passos:"],
      };
      const typeResponses = responses[selectedAgent?.type || "chatbot"] || responses.chatbot;
      setTestMessages(prev => [...prev, { role: "assistant", content: typeResponses[Math.floor(Math.random() * typeResponses.length)] }]);
    }, 1200);
  }

  const activeCount = agents.filter(a => a.status === "active").length;
  const totalConversations = agents.reduce((s, a) => s + a.conversations, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Boxes className="w-5 h-5 text-primary" /> Agent Forge</h2>
          <p className="text-xs text-muted-foreground mt-1">Crie e gerencie agentes IA — deploy em WhatsApp, Instagram, site e mais</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90">
          <Plus className="w-3.5 h-3.5" /> Novo Agente
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Agentes", value: agents.length, color: "text-foreground" },
          { label: "Ativos", value: activeCount, color: "text-green-400" },
          { label: "Conversas Total", value: totalConversations, color: "text-primary" },
          { label: "Plataformas", value: new Set(agents.map(a => a.platform)).size, color: "text-foreground" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto space-y-4">
            <h3 className="text-sm font-bold text-foreground">Criar Novo Agente IA</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Nome do Agente *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground mt-1" placeholder="Ex: Atendente Maria" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Tipo do Agente</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {AGENT_TYPES.map(t => (
                    <button key={t.value} onClick={() => setForm({ ...form, type: t.value })}
                      className={`p-2 rounded-lg border text-left transition-all ${form.type === t.value ? "border-primary bg-primary/10" : "border-border bg-secondary/30 hover:border-primary/30"}`}>
                      <p className="text-xs font-medium text-foreground">{t.label}</p>
                      <p className="text-[9px] text-muted-foreground">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Modelo de IA</label>
                  <select value={form.model} onChange={e => setForm({ ...form, model: e.target.value })}
                    className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground mt-1">
                    {MODELS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Deploy em</label>
                  <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}
                    className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground mt-1">
                    {DEPLOY_PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">System Prompt</label>
                <textarea value={form.system_prompt} onChange={e => setForm({ ...form, system_prompt: e.target.value })}
                  className="w-full min-h-[80px] bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground mt-1" placeholder="Deixe vazio para usar prompt padrao..." />
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <div className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5 text-primary" /><p className="text-[10px] text-primary font-semibold">Configuracao Inteligente</p></div>
                <p className="text-[10px] text-muted-foreground mt-1">O sistema configura automaticamente o agente com base no tipo selecionado.</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancelar</button>
              <button onClick={handleCreate} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 flex items-center gap-1.5">
                <Bot className="w-4 h-4" /> Criar Agente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Agent Cards */}
      {agents.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-foreground mb-1">Nenhum agente criado ainda</p>
          <p className="text-xs text-muted-foreground">Crie seu primeiro agente IA e faca deploy direto no WhatsApp, Instagram ou site.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {agents.map(agent => {
            const deployInfo = DEPLOY_PLATFORMS.find(p => p.value === agent.platform);
            const typeInfo = AGENT_TYPES.find(t => t.value === agent.type);
            const DeployIcon = deployInfo?.icon || Globe;
            return (
              <div key={agent.id} className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{agent.name}</h3>
                      <p className="text-[10px] text-muted-foreground">{typeInfo?.label} - {agent.client_name}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
                    agent.status === "active" ? "bg-green-500/10 text-green-400" :
                    agent.status === "paused" ? "bg-yellow-500/10 text-yellow-400" : "bg-muted text-muted-foreground"
                  }`}>{agent.status === "active" ? "Ativo" : agent.status === "paused" ? "Pausado" : "Rascunho"}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 bg-secondary/30 rounded-lg">
                    <p className="text-xs font-bold text-foreground">{agent.model.split("-").slice(0, 2).join("-")}</p>
                    <p className="text-[9px] text-muted-foreground">Modelo</p>
                  </div>
                  <div className="text-center p-2 bg-secondary/30 rounded-lg">
                    <p className="text-xs font-bold text-foreground flex items-center justify-center gap-1"><DeployIcon className="w-3 h-3" />{deployInfo?.label?.split(" ")[0]}</p>
                    <p className="text-[9px] text-muted-foreground">Deploy</p>
                  </div>
                  <div className="text-center p-2 bg-secondary/30 rounded-lg">
                    <p className="text-xs font-bold text-foreground">{agent.conversations}</p>
                    <p className="text-[9px] text-muted-foreground">Conversas</p>
                  </div>
                </div>
                {agent.system_prompt && (
                  <div className="mb-3 p-2 bg-secondary/20 rounded-lg border border-border/50">
                    <p className="text-[9px] text-muted-foreground font-mono line-clamp-2">{agent.system_prompt}</p>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <button onClick={() => startTest(agent)} className="flex-1 h-7 text-[10px] rounded-lg border border-primary/30 text-primary hover:bg-primary/10 flex items-center justify-center gap-1">
                    <Eye className="w-3 h-3" /> Testar
                  </button>
                  <button onClick={() => toggleAgent(agent)} className={`flex-1 h-7 text-[10px] rounded-lg border border-border flex items-center justify-center gap-1 ${agent.status === "active" ? "text-yellow-400 hover:bg-yellow-500/10" : "text-green-400 hover:bg-green-500/10"}`}>
                    {agent.status === "active" ? <><Pause className="w-3 h-3" /> Pausar</> : <><Play className="w-3 h-3" /> Ativar</>}
                  </button>
                  <button onClick={() => deleteAgent(agent.id)} className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Test Chat */}
      {testOpen && selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2"><Bot className="w-4 h-4 text-primary" /> Testar: {selectedAgent.name}</h3>
              <button onClick={() => setTestOpen(false)} className="text-muted-foreground hover:text-foreground text-xs">Fechar</button>
            </div>
            <div className="h-64 overflow-y-auto space-y-3 p-3 bg-secondary/20 rounded-lg">
              {testMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs ${
                    msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary border border-border text-foreground"
                  }`}>{msg.content}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input value={testInput} onChange={e => setTestInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendTestMessage()}
                className="flex-1 h-9 bg-secondary border border-border rounded-lg px-3 text-xs text-foreground" placeholder="Digite uma mensagem..." />
              <button onClick={sendTestMessage} className="h-9 px-3 bg-primary text-primary-foreground rounded-lg">
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-border">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
              <p className="text-[10px] text-muted-foreground">Ambiente de teste — nao afeta conversas reais</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
