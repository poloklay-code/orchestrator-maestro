"use client"

import { useState } from "react"
import { Shield, Search, Filter, AlertTriangle, Info, AlertCircle, Clock } from "lucide-react"

interface Log {
  id: string
  action: string
  entity_type: string | null
  severity: string
  source: string
  created_at: string
}

export function AuditLog({ initialLogs }: { initialLogs: Log[] }) {
  const [search, setSearch] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")

  const filtered = initialLogs.filter((log) => {
    const matchSearch = log.action.toLowerCase().includes(search.toLowerCase()) || log.entity_type?.toLowerCase().includes(search.toLowerCase())
    const matchSeverity = severityFilter === "all" || log.severity === severityFilter
    return matchSearch && matchSeverity
  })

  const severityIcon = (s: string) => {
    if (s === "error") return <AlertCircle className="w-4 h-4 text-destructive" />
    if (s === "warning") return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    return <Info className="w-4 h-4 text-blue-400" />
  }

  const severityBg = (s: string) => {
    if (s === "error") return "border-l-destructive bg-destructive/5"
    if (s === "warning") return "border-l-yellow-500 bg-yellow-500/5"
    return "border-l-blue-500 bg-blue-500/5"
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar nos logs..."
            className="w-full h-10 bg-card border border-border rounded-lg pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {["all", "info", "warning", "error"].map((s) => (
            <button key={s} onClick={() => setSeverityFilter(s)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${severityFilter === s ? "bg-primary/10 border-primary/30 text-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}>
              {s === "all" ? "Todos" : s === "info" ? "Info" : s === "warning" ? "Aviso" : "Erro"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Shield className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Nenhum registro de auditoria</p>
          </div>
        ) : (
          filtered.map((log) => (
            <div key={log.id} className={`flex items-start gap-3 p-3 rounded-lg border-l-2 ${severityBg(log.severity)}`}>
              {severityIcon(log.severity)}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{log.action}</p>
                <div className="flex items-center gap-3 mt-1">
                  {log.entity_type && <span className="text-[10px] font-mono text-primary px-1.5 py-0.5 bg-primary/10 rounded">{log.entity_type}</span>}
                  <span className="text-[10px] text-muted-foreground">{log.source}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground flex-shrink-0">
                <Clock className="w-3 h-3" />
                {new Date(log.created_at).toLocaleString("pt-BR")}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
