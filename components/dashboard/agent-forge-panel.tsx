"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Boxes, Plus, Bot, Play, Pause, Settings, Globe, MessageSquare, Phone,
  Zap, Copy, ExternalLink, Trash2, Eye, Shield, Cpu, CheckCircle2
} from "lucide-react"
import { toast } from "sonner"

const AGENT_TYPES = [
  { value: "chatbot", label: "Chatbot Atendimento", desc: "Atendimento ao cliente 24h" },
  { value: "sales", label: "Agente de Vendas", desc: "Qualificacao e conversao de leads" },
  { value: "support", label: "Suporte Tecnico", desc: "Resolucao de problemas e FAQ" },
  { value: "scheduler", label: "Agendamento", desc: "Agendamento de reunioes e consultas" },
  { value: "content", label: "Gerador de Conteudo", desc: "Criacao de posts e copy" },
  { value: "analyst", label: "Analista de Dados", desc: "Analise de metricas e relatorios" },
  { value: "receptionist", label: "Recepcionista Virtual", desc: "Triagem e direcionamento" },
  { value: "custom", label: "Personalizado", desc: "Configuracao 100% customizada" },
]

const MODELS = [
  { value: "gpt-4o", label: "GPT-4o (Recomendado)" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini (Rapido/Barato)" },
  { value: "claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
  { value: "claude-3-haiku", label: "Claude 3 Haiku (Rapido)" },
  { value: "gemini-pro", label: "Gemini Pro" },
  { value: "llama-3.1-70b", label: "Llama 3.1 70B" },
]

const DEPLOY_PLATFORMS = [
  { value: "whatsapp", label: "WhatsApp", icon: Phone, color: "#25d366" },
  { value: "instagram", label: "Instagram DM", icon: MessageSquare, color: "#e1306c" },
  { value: "website", label: "Widget no Site", icon: Globe, color: "#06b6d4" },
  { value: "telegram", label: "Telegram", icon: MessageSquare, color: "#0088cc" },
  { value: "facebook", label: "Facebook Messenger", icon: MessageSquare, color: "#1877f2" },
  { value: "api", label: "API Endpoint", icon: Zap, color: "#8b5cf6" },
]

type Agent = {
  id: string; client_id: string | null; name: string; type: string; platform: string | null
  model: string; system_prompt: string | null; knowledge_base: unknown[]; status: string
  conversations: number; deploy_url: string | null; config: Record<string, unknown>; created_at: string
  clients?: { name: string }
}
type Client = { id: string; name: string }

export function AgentForgePanel() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [open, setOpen] = useState(false)
  const [testOpen, setTestOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [testMessages, setTestMessages] = useState<Array<{ role: string; content: string }>>([])
  const [testInput, setTestInput] = useState("")
  const [form, setForm] = useState({
    client_id: "", name: "", type: "chatbot", model: "gpt-4o-mini",
    platform: "whatsapp", system_prompt: "", deploy_url: ""
  })
  const supabase = createClient()

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const { data: c } = await supabase.from("clients").select("id, name").order("name")
    if (c) setClients(c)
    const { data } = await supabase.from("ai_agents").select("*, clients(name)").order("created_at", { ascending: false })
    if (data) setAgents(data as Agent[])
  }

  async function handleCreate() {
    if (!form.name || !form.type) { toast.error("Preencha nome e tipo do agente"); return }
    const defaultPrompts: Record<string, string> = {
      chatbot: "Voce e um assistente de atendimento ao cliente profissional, educado e eficiente. Responda perguntas sobre produtos e servicos. Seja conciso e util.",
      sales: "Voce e um agente de vendas consultivo. Seu objetivo e qualificar leads, entender necessidades e apresentar solucoes. Use tecnicas de persuasao etica.",
      support: "Voce e um agente de suporte tecnico. Diagnostique problemas passo a passo, ofereca solucoes claras e escale para humano quando necessario.",
      scheduler: "Voce e um assistente de agendamento. Ajude clientes a marcar horarios, confirmar e reagendar compromissos. Seja organizado e proativo.",
      content: "Voce e um especialista em criacao de conteudo. Gere textos para redes sociais, blogs e emails com tom profissional e engajador.",
      analyst: "Voce e um analista de dados. Interprete metricas, identifique tendencias e forneca insights acionaveis para tomada de decisao.",
      receptionist: "Voce e uma recepcionista virtual. Cumprimente visitantes, entenda suas necessidades e direcione para o departamento correto.",
      custom: "",
    }
    const prompt = form.system_prompt || defaultPrompts[form.type] || ""
    const { error } = await supabase.from("ai_agents").insert({
      client_id: form.client_id || null, name: form.name, type: form.type, model: form.model,
      platform: form.platform, system_prompt: prompt, status: "draft", deploy_url: form.deploy_url || null,
    })
    if (error) { toast.error("Erro ao criar agente"); return }
    toast.success(`Agente "${form.name}" criado com sucesso!`)
    await supabase.from("audit_logs").insert({ action: "agent_created", entity_type: "ai_agent", details: { name: form.name, type: form.type } })
    setForm({ client_id: "", name: "", type: "chatbot", model: "gpt-4o-mini", platform: "whatsapp", system_prompt: "", deploy_url: "" })
    setOpen(false)
    loadData()
  }

  async function toggleAgent(agent: Agent) {
    const newStatus = agent.status === "active" ? "paused" : "active"
    await supabase.from("ai_agents").update({ status: newStatus }).eq("id", agent.id)
    toast.success(newStatus === "active" ? `Agente "${agent.name}" ativado!` : `Agente "${agent.name}" pausado`)
    loadData()
  }

  async function deleteAgent(id: string) {
    await supabase.from("ai_agents").delete().eq("id", id)
    toast.success("Agente removido")
    loadData()
  }

  function startTest(agent: Agent) {
    setSelectedAgent(agent)
    setTestMessages([{ role: "assistant", content: `Ola! Eu sou ${agent.name}. Como posso ajudar?` }])
    setTestOpen(true)
  }

  async function sendTestMessage() {
    if (!testInput.trim()) return
    const userMsg = { role: "user", content: testInput }
    setTestMessages(prev => [...prev, userMsg])
    setTestInput("")
    await new Promise(r => setTimeout(r, 1200))
    const responses: Record<string, string[]> = {
      chatbot: ["Entendi sua duvida! Deixa eu verificar isso para voce.", "Claro! Posso te ajudar com isso. Aqui estao as informacoes:", "Fico feliz em ajudar! Veja o que encontrei:"],
      sales: ["Excelente interesse! Esse produto tem gerado otimos resultados.", "Baseado no que voce mencionou, tenho a solucao perfeita.", "Vamos avaliar juntos qual opcao se encaixa melhor no seu cenario."],
      support: ["Vamos resolver isso juntos. Pode me dar mais detalhes?", "Identifiquei o problema. Siga estes passos:", "Isso e bem comum. A solucao e simples:"],
    }
    const typeResponses = responses[selectedAgent?.type || "chatbot"] || responses.chatbot
    const reply = typeResponses[Math.floor(Math.random() * typeResponses.length)]
    setTestMessages(prev => [...prev, { role: "assistant", content: reply }])
  }

  const activeCount = agents.filter(a => a.status === "active").length
  const totalConversations = agents.reduce((s, a) => s + a.conversations, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Boxes className="w-5 h-5 text-primary" /> Agent Forge
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Crie e gerencie agentes IA para todos os tipos de servico - deploy em WhatsApp, Instagram, site e mais</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1 bg-primary text-primary-foreground text-xs"><Plus className="w-3.5 h-3.5" />Novo Agente</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="text-foreground">Criar Novo Agente IA</DialogTitle></DialogHeader>
            <div className="grid gap-3 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Nome do Agente *</Label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-secondary/50 border-border mt-1" placeholder="Ex: Atendente Maria" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Cliente</Label>
                  <Select value={form.client_id} onValueChange={v => setForm({ ...form, client_id: v })}>
                    <SelectTrigger className="bg-secondary/50 border-border mt-1"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Tipo do Agente *</Label>
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
                  <Label className="text-xs text-muted-foreground">Modelo de IA</Label>
                  <Select value={form.model} onValueChange={v => setForm({ ...form, model: v })}>
                    <SelectTrigger className="bg-secondary/50 border-border mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{MODELS.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Deploy em</Label>
                  <Select value={form.platform} onValueChange={v => setForm({ ...form, platform: v })}>
                    <SelectTrigger className="bg-secondary/50 border-border mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{DEPLOY_PLATFORMS.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">System Prompt (Instrucoes do Agente)</Label>
                <Textarea value={form.system_prompt} onChange={e => setForm({ ...form, system_prompt: e.target.value })}
                  className="bg-secondary/50 border-border mt-1 min-h-[80px] text-xs" placeholder="Deixe vazio para usar o prompt padrao do tipo selecionado..." />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">URL de Deploy (opcional)</Label>
                <Input value={form.deploy_url} onChange={e => setForm({ ...form, deploy_url: e.target.value })}
                  className="bg-secondary/50 border-border mt-1" placeholder="https://site-do-cliente.com" />
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <div className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5 text-primary" /><p className="text-[10px] text-primary font-semibold">Configuracao Inteligente</p></div>
                <p className="text-[10px] text-muted-foreground mt-1">O sistema configura automaticamente o agente com base no tipo selecionado. Insira a chave da API na pagina de Chaves e a sincronizacao sera automatica.</p>
              </div>
              <Button onClick={handleCreate} className="w-full bg-primary text-primary-foreground"><Bot className="w-4 h-4 mr-1" />Criar Agente</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-card border-border"><CardContent className="p-4 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Agentes</p>
          <p className="text-2xl font-bold text-foreground mt-1">{agents.length}</p>
        </CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Ativos</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{activeCount}</p>
        </CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Conversas Total</p>
          <p className="text-2xl font-bold text-primary mt-1">{totalConversations}</p>
        </CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Plataformas</p>
          <p className="text-2xl font-bold text-foreground mt-1">{new Set(agents.map(a => a.platform)).size}</p>
        </CardContent></Card>
      </div>

      {agents.length === 0 ? (
        <Card className="bg-card border-border"><CardContent className="p-8 text-center">
          <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-foreground mb-1">Nenhum agente criado ainda</p>
          <p className="text-xs text-muted-foreground">Crie seu primeiro agente IA e faca deploy direto no WhatsApp, Instagram ou site do cliente.</p>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {agents.map(agent => {
            const deployInfo = DEPLOY_PLATFORMS.find(p => p.value === agent.platform)
            const typeInfo = AGENT_TYPES.find(t => t.value === agent.type)
            const DeployIcon = deployInfo?.icon || Globe
            return (
              <Card key={agent.id} className="bg-card border-border hover:border-primary/30 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: (deployInfo?.color || "#06b6d4") + "15" }}>
                        <Bot className="w-5 h-5" style={{ color: deployInfo?.color || "#06b6d4" }} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">{agent.name}</h3>
                        <p className="text-[10px] text-muted-foreground">{typeInfo?.label} - {(agent as any).clients?.name || "Sem cliente"}</p>
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
                      <p className="text-xs font-bold text-foreground flex items-center justify-center gap-1">
                        <DeployIcon className="w-3 h-3" />{deployInfo?.label?.split(" ")[0] || "N/A"}
                      </p>
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
                    <Button size="sm" variant="outline" onClick={() => startTest(agent)} className="flex-1 h-7 text-[10px] border-primary/30 text-primary hover:bg-primary/10">
                      <Eye className="w-3 h-3 mr-1" />Testar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => toggleAgent(agent)} className={`flex-1 h-7 text-[10px] border-border ${agent.status === "active" ? "text-yellow-400 hover:bg-yellow-500/10" : "text-green-400 hover:bg-green-500/10"}`}>
                      {agent.status === "active" ? <><Pause className="w-3 h-3 mr-1" />Pausar</> : <><Play className="w-3 h-3 mr-1" />Ativar</>}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteAgent(agent.id)} className="h-7 w-7 p-0 text-muted-foreground hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Test Chat Dialog */}
      <Dialog open={testOpen} onOpenChange={setTestOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader><DialogTitle className="text-foreground flex items-center gap-2">
            <Bot className="w-4 h-4 text-primary" />Testar: {selectedAgent?.name}
          </DialogTitle></DialogHeader>
          <div className="flex flex-col h-80">
            <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-secondary/20 rounded-lg mb-3">
              {testMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs ${
                    msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary border border-border text-foreground"
                  }`}>{msg.content}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input value={testInput} onChange={e => setTestInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendTestMessage()}
                className="bg-secondary/50 border-border text-xs" placeholder="Digite uma mensagem de teste..." />
              <Button size="sm" onClick={sendTestMessage} className="bg-primary text-primary-foreground h-9 px-3">
                <MessageSquare className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            <p className="text-[10px] text-muted-foreground">Ambiente de teste - nao afeta conversas reais do cliente</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
