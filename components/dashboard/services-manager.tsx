"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus, Search, Briefcase, Pencil, Trash2, Eye, ChevronDown, ChevronUp, FileText, Zap, Globe, Target, BarChart3, CheckCircle2 } from "lucide-react"

const SERVICE_TYPES = [
  "Gestao de Trafego", "Automacao", "Criacao de Assistente IA", "Copywriting",
  "Gestao de Redes Sociais", "Email Marketing", "SEO", "Desenvolvimento Web",
  "Design Grafico", "Consultoria", "Funil de Vendas", "Chatbot WhatsApp",
]

const PLATFORMS = [
  "Meta Ads", "Google Ads", "TikTok Ads", "n8n", "Make", "ManyChat",
  "WhatsApp", "Instagram", "YouTube", "LinkedIn", "Hotmart", "Kiwify",
  "Monetizze", "Eduzz", "Braip", "ClickBank",
]

interface Service {
  id: string
  client_id: string | null
  type: string
  platform: string | null
  description: string | null
  status: string
  priority: string
  fee_gestao: number
  verba: number
  clients?: { name: string } | null
  created_at: string
}

export function ServicesManager({
  initialServices,
  clients,
}: {
  initialServices: Service[]
  clients: Array<{ id: string; name: string }>
}) {
  const [services, setServices] = useState(initialServices)
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [productions, setProductions] = useState<Record<string, any[]>>({})
  const [form, setForm] = useState({
    client_id: "", type: "", platform: "", description: "",
    status: "pending", priority: "medium", fee_gestao: 0, verba: 0,
  })
  const router = useRouter()
  const supabase = createClient()

  const filtered = services.filter((s) =>
    s.type.toLowerCase().includes(search.toLowerCase()) ||
    s.platform?.toLowerCase().includes(search.toLowerCase()) ||
    s.clients?.name?.toLowerCase().includes(search.toLowerCase())
  )

  const resetForm = () => {
    setForm({ client_id: "", type: "", platform: "", description: "", status: "pending", priority: "medium", fee_gestao: 0, verba: 0 })
    setEditing(null)
    setShowForm(false)
  }

  const handleSave = async () => {
    if (!form.type) { toast.error("Tipo de servico obrigatorio"); return }
    const payload = {
      ...form,
      client_id: form.client_id || null,
      fee_gestao: Number(form.fee_gestao),
      verba: Number(form.verba),
    }

    if (editing) {
      const { error } = await supabase.from("services").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", editing.id)
      if (error) { toast.error("Erro ao atualizar"); return }
      toast.success("Servico atualizado")
    } else {
      const { error } = await supabase.from("services").insert(payload)
      if (error) { toast.error("Erro ao cadastrar"); return }
      toast.success("Servico cadastrado")
    }

    await supabase.from("audit_logs").insert({
      action: editing ? `Servico atualizado: ${form.type}` : `Novo servico: ${form.type}`,
      entity_type: "service", source: "admin", severity: "info",
    })
    resetForm()
    router.refresh()
    const { data } = await supabase.from("services").select("*, clients(name)").order("created_at", { ascending: false })
    if (data) setServices(data)
  }

  const handleDelete = async (svc: Service) => {
    if (!confirm(`Excluir servico ${svc.type}?`)) return
    await supabase.from("services").delete().eq("id", svc.id)
    await supabase.from("audit_logs").insert({
      action: `Servico excluido: ${svc.type}`, entity_type: "service", source: "admin", severity: "warning",
    })
    toast.success("Servico excluido")
    setServices(services.filter((s) => s.id !== svc.id))
  }

  const toggleExpand = async (svcId: string) => {
    if (expandedId === svcId) { setExpandedId(null); return }
    setExpandedId(svcId)
    if (!productions[svcId]) {
      const { data } = await supabase.from("service_production").select("*").eq("service_id", svcId).order("created_at", { ascending: false })
      setProductions(prev => ({ ...prev, [svcId]: data || [] }))
    }
  }

  const addProduction = async (svc: Service) => {
    const typeMap: Record<string, { type: string; title: string; desc: string; details: object }> = {
      "Gestao de Trafego": { type: "campaign", title: `Campanha ${svc.platform || "Meta Ads"} - ${new Date().toLocaleDateString("pt-BR")}`, desc: "Campanha criada com segmentacao otimizada, criativos A/B e copy humanizada", details: { platform: svc.platform, objective: "conversao", budget_daily: svc.verba / 30, audiences: ["Lookalike 1%", "Interesses", "Retargeting"], creatives: 3, ab_variants: 2 } },
      "Automacao": { type: "workflow", title: `Workflow ${svc.platform || "n8n"} - Automacao Completa`, desc: "Fluxo automatizado com triggers, condicoes e acoes configuradas", details: { platform: svc.platform, nodes: 12, triggers: ["Webhook", "Schedule"], actions: ["Send Email", "Update CRM", "Notify WhatsApp"], status: "active" } },
      "Criacao de Assistente IA": { type: "agent", title: `Agente IA - ${svc.clients?.name || "Cliente"}`, desc: "Assistente virtual configurado com prompt otimizado e knowledge base", details: { model: "gpt-4o-mini", platform: svc.platform, conversations: 0, prompt_tokens: 500 } },
      "Copywriting": { type: "copy", title: `Copy ${svc.platform || "Multi-canal"} - A/B Test`, desc: "Copy com variacao A/B, versao baixo risco e CTA otimizado", details: { channel: svc.platform, variants: ["Versao A - Urgencia", "Versao B - Beneficio"], lowRisk: true, cta: "Saiba Mais" } },
    }
    const prod = typeMap[svc.type] || { type: "general", title: `Producao - ${svc.type}`, desc: `Material produzido para ${svc.type}`, details: { service: svc.type, platform: svc.platform } }
    await supabase.from("service_production").insert({ service_id: svc.id, client_id: svc.client_id, ...prod, status: "completed" })
    toast.success("Producao registrada com sucesso!")
    const { data } = await supabase.from("service_production").select("*").eq("service_id", svc.id).order("created_at", { ascending: false })
    setProductions(prev => ({ ...prev, [svc.id]: data || [] }))
  }

  const prodTypeIcon = (type: string) => {
    if (type === "campaign") return <Target className="w-3.5 h-3.5 text-blue-400" />
    if (type === "workflow") return <Zap className="w-3.5 h-3.5 text-orange-400" />
    if (type === "agent") return <Globe className="w-3.5 h-3.5 text-green-400" />
    if (type === "copy") return <FileText className="w-3.5 h-3.5 text-purple-400" />
    return <BarChart3 className="w-3.5 h-3.5 text-primary" />
  }

  const statusColor = (s: string) => {
    if (s === "active") return "bg-green-500/10 text-green-400"
    if (s === "pending") return "bg-yellow-500/10 text-yellow-400"
    if (s === "completed") return "bg-blue-500/10 text-blue-400"
    return "bg-muted text-muted-foreground"
  }

  const priorityColor = (p: string) => {
    if (p === "high") return "bg-red-500/10 text-red-400"
    if (p === "medium") return "bg-yellow-500/10 text-yellow-400"
    return "bg-green-500/10 text-green-400"
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar servicos..."
            className="w-full h-10 bg-card border border-border rounded-lg pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Novo Servico
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-foreground">{editing ? "Editar Servico" : "Novo Servico"}</h2>
            <div className="grid gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Cliente</label>
                <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })}
                  className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="">Selecionar cliente</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Tipo de Servico *</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Selecionar</option>
                    {SERVICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Plataforma</label>
                  <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}
                    className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Selecionar</option>
                    {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="pending">Pendente</option>
                    <option value="active">Ativo</option>
                    <option value="completed">Concluido</option>
                    <option value="paused">Pausado</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Fee Gestao (R$)</label>
                  <input type="number" value={form.fee_gestao} onChange={(e) => setForm({ ...form, fee_gestao: Number(e.target.value) })}
                    className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Verba (R$)</label>
                  <input type="number" value={form.verba} onChange={(e) => setForm({ ...form, verba: Number(e.target.value) })}
                    className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Descricao</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={resetForm} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Salvar</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Nenhum servico encontrado</p>
          </div>
        ) : (
          filtered.map((svc) => (
            <div key={svc.id}>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-all group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground">{svc.type}</p>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${statusColor(svc.status)}`}>
                      {svc.status === "active" ? "Ativo" : svc.status === "pending" ? "Pendente" : svc.status === "completed" ? "Concluido" : "Pausado"}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${priorityColor(svc.priority)}`}>
                      {svc.priority === "high" ? "Alta" : svc.priority === "medium" ? "Media" : "Baixa"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">{svc.clients?.name || "Sem cliente"}</span>
                    {svc.platform && <span className="text-xs text-primary font-mono">{svc.platform}</span>}
                    {(svc.fee_gestao > 0 || svc.verba > 0) && (
                      <span className="text-xs text-muted-foreground">
                        Fee: R${svc.fee_gestao} | Verba: R${svc.verba}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleExpand(svc.id)}
                    className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" title="Ver producao">
                    {expandedId === svc.id ? <ChevronUp className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => { setEditing(svc); setForm({ client_id: svc.client_id || "", type: svc.type, platform: svc.platform || "", description: svc.description || "", status: svc.status, priority: svc.priority, fee_gestao: svc.fee_gestao, verba: svc.verba }); setShowForm(true) }}
                    className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(svc)}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              {expandedId === svc.id && (
                <div className="mt-3 mx-4 mb-4 p-4 bg-secondary/20 rounded-xl border border-border/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-foreground flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-primary" />Producao e Entregaveis
                    </h4>
                    <button onClick={() => addProduction(svc)}
                      className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-[10px] font-medium hover:bg-primary/20 transition-all">
                      <Plus className="w-3 h-3" />Registrar Producao
                    </button>
                  </div>
                  {(!productions[svc.id] || productions[svc.id].length === 0) ? (
                    <p className="text-xs text-muted-foreground text-center py-4">Nenhuma producao registrada para este servico.</p>
                  ) : (
                    <div className="space-y-2">
                      {productions[svc.id].map((prod: any) => (
                        <div key={prod.id} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border/50">
                          <div className="mt-0.5">{prodTypeIcon(prod.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-medium text-foreground">{prod.title}</p>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${prod.status === "completed" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                                {prod.status === "completed" ? "Entregue" : "Em Producao"}
                              </span>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{prod.description}</p>
                            {prod.details && typeof prod.details === "object" && (
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {Object.entries(prod.details).slice(0, 5).map(([k, v]) => (
                                  <span key={k} className="text-[9px] px-1.5 py-0.5 bg-secondary rounded text-muted-foreground">
                                    {k}: {Array.isArray(v) ? (v as string[]).join(", ") : String(v)}
                                  </span>
                                ))}
                              </div>
                            )}
                            <p className="text-[9px] text-muted-foreground mt-1">{new Date(prod.created_at).toLocaleString("pt-BR")}</p>
                          </div>
                          <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
