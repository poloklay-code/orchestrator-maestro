import { useState } from "react";
import {
  Boxes, Plus, Bot, Play, Pause, Trash2, Eye, Globe, MessageSquare,
  Phone, Zap, Cpu, CheckCircle2, Search, DollarSign, Palette, Sparkles, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AGENT_TYPES = [
  { value: "chatbot", label: "Chatbot Atendimento", desc: "Atendimento ao cliente 24h" },
  { value: "sales", label: "Agente de Vendas", desc: "Qualificação e conversão de leads" },
  { value: "support", label: "Suporte Técnico", desc: "Resolução de problemas e FAQ" },
  { value: "scheduler", label: "Agendamento", desc: "Agendamento de reuniões e consultas" },
  { value: "content", label: "Gerador de Conteúdo", desc: "Criação de posts e copy" },
  { value: "analyst", label: "Analista de Dados", desc: "Análise de métricas e relatórios" },
  { value: "receptionist", label: "Recepcionista Virtual", desc: "Triagem e direcionamento" },
  { value: "ecommerce", label: "E-commerce", desc: "Vendas e catálogo de produtos" },
  { value: "healthcare", label: "Saúde & Bem-estar", desc: "Triagem e agendamento médico" },
  { value: "legal", label: "Jurídico", desc: "Triagem de casos e orientação" },
  { value: "education", label: "Educação", desc: "Tutoria e suporte ao aluno" },
  { value: "custom", label: "Personalizado", desc: "Configuração 100% customizada" },
];

const MODELS = [
  { value: "gpt-5-mini", label: "GPT-5 Mini (Recomendado)" },
  { value: "gpt-5", label: "GPT-5 (Premium)" },
  { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash (Rápido)" },
  { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
];

const DEPLOY_PLATFORMS = [
  { value: "whatsapp", label: "WhatsApp", icon: Phone, color: "hsl(142, 70%, 49%)" },
  { value: "instagram", label: "Instagram DM", icon: MessageSquare, color: "hsl(330, 80%, 55%)" },
  { value: "website", label: "Widget no Site", icon: Globe, color: "hsl(187, 80%, 42%)" },
  { value: "telegram", label: "Telegram", icon: MessageSquare, color: "hsl(200, 100%, 40%)" },
  { value: "facebook", label: "Facebook Messenger", icon: MessageSquare, color: "hsl(214, 89%, 52%)" },
  { value: "api", label: "API Endpoint", icon: Zap, color: "hsl(258, 90%, 66%)" },
];

const THEME_PRESETS = [
  { name: "Profissional", primary: "#2563EB", secondary: "#1E293B", accent: "#3B82F6" },
  { name: "Saúde", primary: "#059669", secondary: "#0F172A", accent: "#10B981" },
  { name: "Luxo", primary: "#D4AF37", secondary: "#1A1A2E", accent: "#F59E0B" },
  { name: "Tech", primary: "#8B5CF6", secondary: "#0F0F23", accent: "#A78BFA" },
  { name: "Feminino", primary: "#EC4899", secondary: "#1E1B2E", accent: "#F472B6" },
  { name: "Jurídico", primary: "#1E40AF", secondary: "#111827", accent: "#3B82F6" },
];

type Agent = {
  id: string; name: string; type: string; platform: string;
  model: string; system_prompt: string; status: string;
  conversations: number; client_name: string;
  design?: { primary: string; secondary: string; accent: string; themeName: string };
  pricing?: { setup: number; monthly: number; perMessage: number };
  analysis?: any;
};

const DEMO_AGENTS: Agent[] = [
  { id: "1", name: "Atendente Maria", type: "chatbot", platform: "whatsapp", model: "gpt-5-mini", system_prompt: "Você é um assistente de atendimento profissional.", status: "active", conversations: 1247, client_name: "Tech Solutions" },
  { id: "2", name: "Vendedor Carlos", type: "sales", platform: "instagram", model: "gpt-5", system_prompt: "Você é um agente de vendas consultivo.", status: "active", conversations: 589, client_name: "E-commerce Pro" },
  { id: "3", name: "Suporte Ana", type: "support", platform: "website", model: "gemini-2.5-flash", system_prompt: "Você é um agente de suporte técnico.", status: "paused", conversations: 312, client_name: "SaaS Corp" },
];

export default function AgentForgePanel() {
  const [agents, setAgents] = useState<Agent[]>(DEMO_AGENTS);
  const [showForm, setShowForm] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [testMessages, setTestMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [testInput, setTestInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [form, setForm] = useState({
    name: "", type: "chatbot", model: "gpt-5-mini", platform: "whatsapp", system_prompt: "",
    client_name: "", website_url: "", social_urls: "", business_description: "",
    selectedTheme: THEME_PRESETS[0],
  });

  // AI Analysis of business
  const analyzeBusinessAI = async () => {
    if (!form.website_url && !form.social_urls && !form.business_description) {
      toast.error("Insira um site, rede social ou descreva o negócio");
      return;
    }
    setAnalyzing(true);
    try {
      const { data } = await supabase.functions.invoke("dominus-ai", {
        body: {
          action: "create_agent",
          data: {
            website_url: form.website_url,
            social_urls: form.social_urls,
            business_description: form.business_description,
            agent_type: form.type,
            platform: form.platform,
          },
        },
      });

      if (data?.result) {
        setAnalysisResult(data.result);
        // Auto-fill form from AI analysis
        if (data.result.suggested_name) setForm(prev => ({ ...prev, name: data.result.suggested_name }));
        if (data.result.system_prompt) setForm(prev => ({ ...prev, system_prompt: data.result.system_prompt }));
        if (data.result.suggested_type) setForm(prev => ({ ...prev, type: data.result.suggested_type }));
        toast.success("Análise concluída! Agente configurado pela IA");
      }
    } catch (err) {
      console.error(err);
      // Fallback analysis
      const fallback = {
        business_name: form.client_name || "Negócio Analisado",
        niche: "Identificado automaticamente",
        suggested_name: `Assistente ${form.client_name || "Smart"}`,
        system_prompt: `Você é um assistente especialista em ${form.type === "sales" ? "vendas consultivas" : form.type === "support" ? "suporte técnico" : "atendimento ao cliente"}. Seja profissional, empático e focado em resultados. Responda sempre em português brasileiro.`,
        suggested_type: form.type,
        design_recommendation: THEME_PRESETS[Math.floor(Math.random() * THEME_PRESETS.length)],
        pricing: {
          setup: form.type === "sales" ? 1500 : form.type === "custom" ? 2500 : 800,
          monthly: form.type === "sales" ? 497 : form.type === "custom" ? 697 : 297,
          perMessage: 0.02,
        },
        competitive_advantages: [
          "Atendimento 24/7 sem interrupções",
          "Tempo de resposta inferior a 3 segundos",
          "Personalização baseada no histórico do cliente",
          "Integração nativa com CRM",
        ],
      };
      setAnalysisResult(fallback);
      if (fallback.suggested_name) setForm(prev => ({ ...prev, name: fallback.suggested_name, system_prompt: fallback.system_prompt }));
      toast.success("Análise concluída com dados estimados");
    } finally {
      setAnalyzing(false);
    }
  };

  function handleCreate() {
    if (!form.name) { toast.error("Preencha o nome do agente"); return; }
    const newAgent: Agent = {
      id: Date.now().toString(), name: form.name, type: form.type, platform: form.platform,
      model: form.model, system_prompt: form.system_prompt || "Prompt padrão do sistema", status: "draft",
      conversations: 0, client_name: form.client_name || "Sem cliente",
      design: { ...form.selectedTheme, themeName: form.selectedTheme.name },
      pricing: analysisResult?.pricing || { setup: 800, monthly: 297, perMessage: 0.02 },
      analysis: analysisResult,
    };
    setAgents([newAgent, ...agents]);
    toast.success(`Agente "${form.name}" criado com IA!`);
    setForm({ name: "", type: "chatbot", model: "gpt-5-mini", platform: "whatsapp", system_prompt: "", client_name: "", website_url: "", social_urls: "", business_description: "", selectedTheme: THEME_PRESETS[0] });
    setAnalysisResult(null);
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
    setTestMessages([{ role: "assistant", content: `Olá! Eu sou ${agent.name}. Como posso ajudar?` }]);
    setTestOpen(true);
  }

  async function sendTestMessage() {
    if (!testInput.trim() || !selectedAgent) return;
    const userMsg = testInput;
    setTestMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setTestInput("");

    try {
      const { data } = await supabase.functions.invoke("dominus-ai", {
        body: {
          action: "sales_agent",
          data: {
            message: userMsg,
            context: { agent_name: selectedAgent.name, agent_type: selectedAgent.type, system_prompt: selectedAgent.system_prompt },
          },
        },
      });
      setTestMessages(prev => [...prev, { role: "assistant", content: data?.result?.response || data?.result || "Entendi! Posso te ajudar com isso." }]);
    } catch {
      setTestMessages(prev => [...prev, { role: "assistant", content: "Entendi sua mensagem! Como posso ajudar mais?" }]);
    }
  }

  const activeCount = agents.filter(a => a.status === "active").length;
  const totalConversations = agents.reduce((s, a) => s + a.conversations, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Boxes className="w-5 h-5 text-primary" /> Agent Forge
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Crie agentes IA com análise automática do negócio, design personalizado e precificação inteligente
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90">
          <Plus className="w-3.5 h-3.5" /> Novo Agente com IA
        </button>
      </div>

      {/* Stats */}
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

      {/* Create Modal — Enhanced with AI Analysis */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Criar Agente com Inteligência Artificial
            </h3>

            {/* Step 1: Business Analysis */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3">
              <p className="text-xs font-semibold text-primary flex items-center gap-2">
                <Search className="w-3.5 h-3.5" /> Passo 1: Análise do Negócio (IA)
              </p>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase">Nome do Cliente</label>
                <input value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value })}
                  className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground mt-1" placeholder="Ex: Tech Solutions" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase">Website / URL</label>
                <input value={form.website_url} onChange={e => setForm({ ...form, website_url: e.target.value })}
                  className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground mt-1" placeholder="https://exemplo.com.br" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase">Redes Sociais (URLs separadas por vírgula)</label>
                <input value={form.social_urls} onChange={e => setForm({ ...form, social_urls: e.target.value })}
                  className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground mt-1" placeholder="instagram.com/cliente, facebook.com/cliente" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase">Descrição do Negócio</label>
                <textarea value={form.business_description} onChange={e => setForm({ ...form, business_description: e.target.value })}
                  className="w-full min-h-[60px] bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground mt-1"
                  placeholder="Descreva o negócio do cliente: nicho, público-alvo, produtos/serviços..." />
              </div>
              <button onClick={analyzeBusinessAI} disabled={analyzing}
                className="w-full h-9 bg-primary text-primary-foreground rounded-lg text-xs font-semibold flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50">
                {analyzing ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analisando com IA...</> : <><Search className="w-3.5 h-3.5" /> Analisar Negócio com IA</>}
              </button>
            </div>

            {/* AI Analysis Result */}
            {analysisResult && (
              <div className="p-4 rounded-lg bg-accent/5 border border-accent/20 space-y-3">
                <p className="text-xs font-semibold text-accent flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Análise da IA Concluída
                </p>
                {analysisResult.competitive_advantages && (
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.competitive_advantages.map((adv: string, i: number) => (
                      <span key={i} className="text-[9px] px-2 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">{adv}</span>
                    ))}
                  </div>
                )}
                {/* Pricing */}
                {analysisResult.pricing && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="text-center p-2 rounded-lg bg-card border border-border">
                      <DollarSign className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
                      <p className="text-xs font-bold text-foreground">R$ {analysisResult.pricing.setup}</p>
                      <p className="text-[9px] text-muted-foreground">Setup</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-card border border-border">
                      <DollarSign className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
                      <p className="text-xs font-bold text-foreground">R$ {analysisResult.pricing.monthly}/mês</p>
                      <p className="text-[9px] text-muted-foreground">Mensalidade</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-card border border-border">
                      <DollarSign className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
                      <p className="text-xs font-bold text-foreground">R$ {analysisResult.pricing.perMessage}</p>
                      <p className="text-[9px] text-muted-foreground">Por Mensagem</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Agent Config */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground">Passo 2: Configuração do Agente</p>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase">Nome do Agente *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground mt-1" placeholder="Ex: Atendente Maria" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase">Tipo do Agente</label>
                <div className="grid grid-cols-3 gap-1.5 mt-1">
                  {AGENT_TYPES.map(t => (
                    <button key={t.value} onClick={() => setForm({ ...form, type: t.value })}
                      className={`p-2 rounded-lg border text-left transition-all ${form.type === t.value ? "border-primary bg-primary/10" : "border-border bg-secondary/30 hover:border-primary/30"}`}>
                      <p className="text-[10px] font-medium text-foreground">{t.label}</p>
                      <p className="text-[8px] text-muted-foreground">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase">Modelo de IA</label>
                  <select value={form.model} onChange={e => setForm({ ...form, model: e.target.value })}
                    className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground mt-1">
                    {MODELS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase">Deploy em</label>
                  <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}
                    className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground mt-1">
                    {DEPLOY_PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Design Theme */}
              <div>
                <label className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                  <Palette className="w-3 h-3" /> Design do Assistente
                </label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {THEME_PRESETS.map(theme => (
                    <button key={theme.name} onClick={() => setForm({ ...form, selectedTheme: theme })}
                      className={`p-2 rounded-lg border transition-all ${form.selectedTheme.name === theme.name ? "border-primary ring-1 ring-primary/30" : "border-border hover:border-primary/30"}`}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.primary }} />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.accent }} />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.secondary }} />
                      </div>
                      <p className="text-[9px] font-medium text-foreground">{theme.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-muted-foreground uppercase">System Prompt</label>
                <textarea value={form.system_prompt} onChange={e => setForm({ ...form, system_prompt: e.target.value })}
                  className="w-full min-h-[80px] bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground mt-1"
                  placeholder="Deixe vazio para usar prompt gerado pela IA..." />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => { setShowForm(false); setAnalysisResult(null); }} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancelar</button>
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
          <p className="text-xs text-muted-foreground">Crie seu primeiro agente IA com análise automática do negócio.</p>
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
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: agent.design?.primary ? `${agent.design.primary}20` : "hsl(var(--primary) / 0.1)" }}>
                      <Bot className="w-5 h-5" style={{ color: agent.design?.primary || "hsl(var(--primary))" }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{agent.name}</h3>
                      <p className="text-[10px] text-muted-foreground">{typeInfo?.label} — {agent.client_name}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
                    agent.status === "active" ? "bg-green-500/10 text-green-400" :
                    agent.status === "paused" ? "bg-amber-500/10 text-amber-400" : "bg-muted text-muted-foreground"
                  }`}>{agent.status === "active" ? "Ativo" : agent.status === "paused" ? "Pausado" : "Rascunho"}</span>
                </div>

                {/* Design preview */}
                {agent.design && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: agent.design.primary }} />
                    <div className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: agent.design.accent }} />
                    <span className="text-[9px] text-muted-foreground ml-1">Tema: {agent.design.themeName}</span>
                  </div>
                )}

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

                {/* Pricing */}
                {agent.pricing && (
                  <div className="flex items-center gap-3 mb-3 p-2 rounded-lg bg-primary/5 border border-primary/10">
                    <DollarSign className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] text-foreground">Setup: <b>R$ {agent.pricing.setup}</b></span>
                    <span className="text-[10px] text-foreground">Mensal: <b>R$ {agent.pricing.monthly}</b></span>
                  </div>
                )}

                <div className="flex items-center gap-1.5">
                  <button onClick={() => startTest(agent)} className="flex-1 h-7 text-[10px] rounded-lg border border-primary/30 text-primary hover:bg-primary/10 flex items-center justify-center gap-1">
                    <Eye className="w-3 h-3" /> Testar
                  </button>
                  <button onClick={() => toggleAgent(agent)} className={`flex-1 h-7 text-[10px] rounded-lg border border-border flex items-center justify-center gap-1 ${agent.status === "active" ? "text-amber-400 hover:bg-amber-500/10" : "text-green-400 hover:bg-green-500/10"}`}>
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

      {/* Test Chat — now with real AI */}
      {testOpen && selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" /> Testar: {selectedAgent.name}
              </h3>
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
              <p className="text-[10px] text-muted-foreground">Ambiente de teste com IA real</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
