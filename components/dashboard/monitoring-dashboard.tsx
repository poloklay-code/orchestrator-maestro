"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus, Activity, Cpu, Clock, Zap, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar } from "recharts"

interface Monitor {
  id: string
  ai_name: string
  status: string
  response_time_ms: number
  tokens_used: number
  errors: number
  uptime_percent: number
  last_activity: string
  client_id: string | null
  clients?: { name: string } | null
  services?: { type: string; platform: string } | null
}

export function MonitoringDashboard({ initialMonitors, clients }: { initialMonitors: Monitor[]; clients: Array<{ id: string; name: string }> }) {
  const [monitors, setMonitors] = useState(initialMonitors)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ ai_name: "", client_id: "", status: "online", response_time_ms: 120, tokens_used: 0, errors: 0, uptime_percent: 100 })
  const router = useRouter()
  const supabase = createClient()

  const totalOnline = monitors.filter((m) => m.status === "online").length
  const totalOffline = monitors.filter((m) => m.status === "offline").length
  const avgUptime = monitors.length > 0 ? (monitors.reduce((a, b) => a + b.uptime_percent, 0) / monitors.length).toFixed(1) : "0"
  const avgResponse = monitors.length > 0 ? Math.round(monitors.reduce((a, b) => a + b.response_time_ms, 0) / monitors.length) : 0

  const statusData = [
    { name: "Online", value: totalOnline, fill: "#22c55e" },
    { name: "Offline", value: totalOffline, fill: "#ef4444" },
    { name: "Warning", value: monitors.filter((m) => m.status === "warning").length, fill: "#f59e0b" },
  ].filter((d) => d.value > 0)

  const responseData = monitors.slice(0, 8).map((m) => ({
    name: m.ai_name.slice(0, 10),
    tempo: m.response_time_ms,
    tokens: m.tokens_used,
  }))

  const handleSave = async () => {
    if (!form.ai_name) { toast.error("Nome da IA obrigatorio"); return }
    const payload = { ...form, client_id: form.client_id || null, last_activity: new Date().toISOString() }
    const { error } = await supabase.from("ai_monitoring").insert(payload)
    if (error) { toast.error("Erro ao cadastrar"); return }
    await supabase.from("audit_logs").insert({ action: `IA registrada para monitoramento: ${form.ai_name}`, entity_type: "ai_monitoring", source: "admin", severity: "info" })
    toast.success("IA registrada")
    setShowForm(false)
    const { data } = await supabase.from("ai_monitoring").select("*, clients(name), services(type, platform)").order("last_activity", { ascending: false })
    if (data) setMonitors(data)
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "IAs Online", value: totalOnline, icon: CheckCircle2, color: "#22c55e" },
          { label: "IAs Offline", value: totalOffline, icon: XCircle, color: "#ef4444" },
          { label: "Uptime Medio", value: `${avgUptime}%`, icon: Activity, color: "#0dbfb3" },
          { label: "Resp. Medio", value: `${avgResponse}ms`, icon: Clock, color: "#f59e0b" },
        ].map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4" style={{ color: s.color }} />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Status das IAs</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                  {statusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(210 18% 8%)", border: "1px solid hsl(210 15% 16%)", borderRadius: "8px", color: "#e5e7eb" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">Sem dados de monitoramento</div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Tempo de Resposta por IA</h3>
          {responseData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={responseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 15% 16%)" />
                <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} />
                <Tooltip contentStyle={{ background: "hsl(210 18% 8%)", border: "1px solid hsl(210 15% 16%)", borderRadius: "8px", color: "#e5e7eb" }} />
                <Bar dataKey="tempo" fill="#0dbfb3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">Sem dados</div>
          )}
        </div>
      </div>

      {/* Add + List */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">IAs Monitoradas</h3>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90">
          <Plus className="w-3.5 h-3.5" /> Registrar IA
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Registrar IA para Monitoramento</h2>
            <div className="grid gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Nome da IA *</label>
                <input value={form.ai_name} onChange={(e) => setForm({ ...form, ai_name: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Ex: Assistente WhatsApp" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Cliente</label>
                <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="">Geral / Sistema</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Status Inicial</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="warning">Warning</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Registrar</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {monitors.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Cpu className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Nenhuma IA registrada para monitoramento</p>
          </div>
        ) : (
          monitors.map((m) => (
            <div key={m.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${m.status === "online" ? "bg-green-500 animate-pulse" : m.status === "warning" ? "bg-yellow-500" : "bg-red-500"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{m.ai_name}</p>
                <p className="text-xs text-muted-foreground">{m.clients?.name || "Sistema"} {m.services ? `| ${m.services.type}` : ""}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{m.response_time_ms}ms</span>
                <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{m.tokens_used} tokens</span>
                <span className="flex items-center gap-1"><Activity className="w-3 h-3" />{m.uptime_percent}%</span>
                {m.errors > 0 && <span className="flex items-center gap-1 text-destructive"><AlertTriangle className="w-3 h-3" />{m.errors}</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
