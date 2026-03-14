"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import {
  Shield, AlertTriangle, Eye, Zap, CheckCircle2, XCircle, Clock,
  Play, Pause, SkipForward, ArrowDownCircle, Target, RotateCcw, FileCheck
} from "lucide-react"

type Mode = "normal" | "shadow" | "crisis"

interface Change {
  id: string
  title: string
  description: string
  risk: "low" | "medium" | "high" | "critical"
  metric: string
  rollback: string
  status: "pending" | "approved" | "rejected" | "testing"
  mode: Mode
}

export function GovernancePanel() {
  const [mode, setMode] = useState<Mode>("normal")
  const [changes, setChanges] = useState<Change[]>([
    { id: "1", title: "Escalar campanha Facebook Ads", description: "Aumentar budget em 50% para campanha principal", risk: "medium", metric: "CPA manter abaixo de R$25", rollback: "Reverter budget ao valor anterior em 1h", status: "pending", mode: "normal" },
    { id: "2", title: "Novo fluxo ManyChat", description: "Adicionar fluxo de re-engajamento automatico", risk: "low", metric: "Taxa resposta > 40% em 48h", rollback: "Desativar fluxo e reverter ao anterior", status: "approved", mode: "normal" },
    { id: "3", title: "Trocar copy da landing page", description: "Teste A/B com nova headline focada em dor", risk: "medium", metric: "CVR manter acima de 3.5%", rollback: "Restaurar versao anterior da LP", status: "testing", mode: "shadow" },
  ])
  const [showNewChange, setShowNewChange] = useState(false)
  const [form, setForm] = useState({ title: "", description: "", risk: "low" as Change["risk"], metric: "", rollback: "" })
  const [priorities, setPriorities] = useState({ primary: "Escalar trafego pago com ROI positivo", secondary: "Otimizar automacoes de follow-up" })
  const supabase = createClient()

  const riskColor = (r: string) => {
    if (r === "low") return "text-green-400 bg-green-500/10"
    if (r === "medium") return "text-yellow-400 bg-yellow-500/10"
    if (r === "high") return "text-orange-400 bg-orange-500/10"
    return "text-red-400 bg-red-500/10"
  }

  const statusIcon = (s: string) => {
    if (s === "approved") return <CheckCircle2 className="w-4 h-4 text-green-400" />
    if (s === "rejected") return <XCircle className="w-4 h-4 text-red-400" />
    if (s === "testing") return <Eye className="w-4 h-4 text-blue-400" />
    return <Clock className="w-4 h-4 text-yellow-400" />
  }

  const modeConfig = {
    normal: { label: "Normal", color: "text-green-400 bg-green-500/10 border-green-500/20", icon: Play, desc: "Operacao padrao com governanca completa" },
    shadow: { label: "Shadow Mode", color: "text-blue-400 bg-blue-500/10 border-blue-500/20", icon: Eye, desc: "Testar hipoteses sem risco real — simulacao segura" },
    crisis: { label: "Modo Crise", color: "text-red-400 bg-red-500/10 border-red-500/20", icon: AlertTriangle, desc: "Incidente ativo — bloqueio, queda ou mudanca de politica" },
  }

  const handleApprove = async (id: string) => {
    setChanges(changes.map((c) => c.id === id ? { ...c, status: "approved" } : c))
    await supabase.from("audit_logs").insert({ action: `Mudanca aprovada: ${changes.find((c) => c.id === id)?.title}`, entity_type: "governance", severity: "info", source: "admin" })
    toast.success("Mudanca aprovada")
  }

  const handleReject = async (id: string) => {
    setChanges(changes.map((c) => c.id === id ? { ...c, status: "rejected" } : c))
    await supabase.from("audit_logs").insert({ action: `Mudanca rejeitada: ${changes.find((c) => c.id === id)?.title}`, entity_type: "governance", severity: "warning", source: "admin" })
    toast.info("Mudanca rejeitada")
  }

  const handleShadowTest = (id: string) => {
    setChanges(changes.map((c) => c.id === id ? { ...c, status: "testing", mode: "shadow" } : c))
    toast.success("Enviado para Shadow Mode")
  }

  const handleAddChange = async () => {
    if (!form.title || !form.metric || !form.rollback) { toast.error("Preencha todos os campos obrigatorios"); return }
    const newChange: Change = { id: Date.now().toString(), ...form, status: "pending", mode }
    setChanges([newChange, ...changes])
    await supabase.from("audit_logs").insert({ action: `Nova mudanca proposta: ${form.title}`, entity_type: "governance", severity: "info", source: "admin", details: { risk: form.risk, rollback: form.rollback } })
    setShowNewChange(false)
    setForm({ title: "", description: "", risk: "low", metric: "", rollback: "" })
    toast.success("Mudanca registrada")
  }

  const switchMode = async (newMode: Mode) => {
    setMode(newMode)
    await supabase.from("audit_logs").insert({ action: `Modo alterado para: ${modeConfig[newMode].label}`, entity_type: "governance", severity: newMode === "crisis" ? "error" : "info", source: "admin" })
    toast.success(`Modo ${modeConfig[newMode].label} ativado`)
  }

  const currentMode = modeConfig[mode]
  const CurrentIcon = currentMode.icon

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="flex flex-col lg:flex-row gap-4">
        {(Object.entries(modeConfig) as [Mode, typeof modeConfig.normal][]).map(([key, cfg]) => {
          const Icon = cfg.icon
          const isActive = mode === key
          return (
            <button key={key} onClick={() => switchMode(key)}
              className={`flex-1 p-4 rounded-xl border transition-all text-left ${isActive ? cfg.color + " border-current" : "border-border bg-card hover:border-primary/20"}`}>
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${isActive ? "" : "text-muted-foreground"}`} />
                <span className={`text-sm font-semibold ${isActive ? "" : "text-foreground"}`}>{cfg.label}</span>
              </div>
              <p className={`text-xs ${isActive ? "opacity-80" : "text-muted-foreground"}`}>{cfg.desc}</p>
            </button>
          )
        })}
      </div>

      {/* Crisis Alert */}
      {mode === "crisis" && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 flex items-start gap-3 animate-in slide-in-from-top">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-red-400">MODO CRISE ATIVO</h3>
            <p className="text-xs text-red-300/70 mt-0.5">Todas as acoes externas estao bloqueadas. Automacoes pausadas. Apenas rollback e diagnostico permitidos. Documente o incidente abaixo.</p>
          </div>
        </div>
      )}

      {/* Priorities */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Prioridades do Ciclo (MAESTRO)</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-[10px] font-mono text-primary mb-1">PRINCIPAL</p>
            <input value={priorities.primary} onChange={(e) => setPriorities({ ...priorities, primary: e.target.value })}
              className="w-full text-sm text-foreground bg-transparent outline-none" />
          </div>
          <div className="p-3 rounded-lg bg-secondary/50 border border-border">
            <p className="text-[10px] font-mono text-muted-foreground mb-1">SECUNDARIA</p>
            <input value={priorities.secondary} onChange={(e) => setPriorities({ ...priorities, secondary: e.target.value })}
              className="w-full text-sm text-foreground bg-transparent outline-none" />
          </div>
        </div>
      </div>

      {/* Changes / Approvals */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Central de Aprovacoes</h3>
          </div>
          <button onClick={() => setShowNewChange(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-xs text-primary hover:bg-primary/20 transition-all">
            <Zap className="w-3 h-3" /> Nova Mudanca
          </button>
        </div>

        {showNewChange && (
          <div className="mb-4 p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <input placeholder="Titulo da mudanca *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <select value={form.risk} onChange={(e) => setForm({ ...form, risk: e.target.value as Change["risk"] })}
                className="h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="low">Risco Baixo</option>
                <option value="medium">Risco Medio</option>
                <option value="high">Risco Alto</option>
                <option value="critical">Critico</option>
              </select>
            </div>
            <input placeholder="Descricao" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <div className="grid sm:grid-cols-2 gap-3">
              <input placeholder="Metrica de sucesso *" value={form.metric} onChange={(e) => setForm({ ...form, metric: e.target.value })}
                className="h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <input placeholder="Plano de rollback *" value={form.rollback} onChange={(e) => setForm({ ...form, rollback: e.target.value })}
                className="h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowNewChange(false)} className="px-3 py-1.5 text-xs text-muted-foreground">Cancelar</button>
              <button onClick={handleAddChange} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90">Registrar</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {changes.map((change) => (
            <div key={change.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all group">
              {statusIcon(change.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-foreground">{change.title}</p>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${riskColor(change.risk)}`}>{change.risk}</span>
                  {change.mode === "shadow" && <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400">shadow</span>}
                </div>
                {change.description && <p className="text-xs text-muted-foreground mt-0.5">{change.description}</p>}
                <div className="flex items-center gap-4 mt-1.5 text-[10px] text-muted-foreground font-mono">
                  <span className="flex items-center gap-1"><Target className="w-3 h-3" />{change.metric}</span>
                  <span className="flex items-center gap-1"><RotateCcw className="w-3 h-3" />{change.rollback}</span>
                </div>
              </div>
              {change.status === "pending" && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleShadowTest(change.id)} className="p-1.5 rounded hover:bg-blue-500/10 text-muted-foreground hover:text-blue-400" title="Shadow Test">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleApprove(change.id)} className="p-1.5 rounded hover:bg-green-500/10 text-muted-foreground hover:text-green-400" title="Aprovar">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleReject(change.id)} className="p-1.5 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400" title="Rejeitar">
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
