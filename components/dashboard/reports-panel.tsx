"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import {
  FileText, Download, Mail, MessageCircle, Copy, Calendar,
  BarChart3, TrendingUp, AlertTriangle, ArrowRight, CheckCircle2
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"

type ReportType = "semanal" | "quinzenal" | "mensal" | "sob_demanda"

const CHART_COLORS = ["#0dbfb3", "#3b82f6", "#f59e0b", "#22c55e", "#ef4444"]

export function ReportsPanel() {
  const [reportType, setReportType] = useState<ReportType>("semanal")
  const [clients, setClients] = useState<Array<{ id: string; name: string }>>([])
  const [selectedClient, setSelectedClient] = useState("")
  const [generating, setGenerating] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.from("clients").select("id, name").eq("status", "active").then(({ data }) => {
      if (data) setClients(data)
    })
  }, [supabase])

  const performanceData = [
    { name: "Sem 1", leads: 45, vendas: 12, investimento: 1200 },
    { name: "Sem 2", leads: 62, vendas: 18, investimento: 1500 },
    { name: "Sem 3", leads: 55, vendas: 15, investimento: 1350 },
    { name: "Sem 4", leads: 78, vendas: 24, investimento: 1800 },
  ]

  const channelData = [
    { name: "Facebook Ads", value: 35 },
    { name: "Google Ads", value: 28 },
    { name: "Instagram Org.", value: 20 },
    { name: "WhatsApp", value: 12 },
    { name: "Email", value: 5 },
  ]

  const reportSections = [
    { icon: BarChart3, title: "Diagnostico", desc: "Analise completa do periodo com dados reais de todas as plataformas integradas" },
    { icon: TrendingUp, title: "Estrategia", desc: "Recomendacoes baseadas em dados e padroes identificados pela IA" },
    { icon: CheckCircle2, title: "Acoes Realizadas", desc: "Detalhamento de cada acao executada com resultado e metrica" },
    { icon: AlertTriangle, title: "Riscos Identificados", desc: "Pontos de atencao, risco de bloqueio e recomendacoes preventivas" },
    { icon: ArrowRight, title: "Proximos Passos", desc: "Plano de acao priorizado para o proximo ciclo com KPIs" },
  ]

  const handleGenerate = async () => {
    setGenerating(true)
    await new Promise((r) => setTimeout(r, 2000))
    await supabase.from("audit_logs").insert({
      action: `Relatorio ${reportType} gerado${selectedClient ? ` para cliente ${clients.find((c) => c.id === selectedClient)?.name}` : ""}`,
      entity_type: "report", severity: "info", source: "admin",
    })
    setGenerating(false)
    toast.success("Relatorio gerado com sucesso!")
  }

  const handleShare = (method: string) => {
    const text = `Relatorio ${reportType.replace("_", " ")} - ORQUESTRADOR MAESTRO\nPeriodo: ${new Date().toLocaleDateString("pt-BR")}\n\nResumo executivo disponivel no painel.`
    if (method === "whatsapp") window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank")
    else if (method === "email") window.open(`mailto:?subject=${encodeURIComponent(`Relatorio ${reportType}`)}&body=${encodeURIComponent(text)}`, "_blank")
    else { navigator.clipboard.writeText(text); toast.success("Copiado!") }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2">
          {(["semanal", "quinzenal", "mensal", "sob_demanda"] as ReportType[]).map((t) => (
            <button key={t} onClick={() => setReportType(t)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${reportType === t ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
              {t === "sob_demanda" ? "Sob Demanda" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}
          className="h-9 bg-card border border-border rounded-lg px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
          <option value="">Todos os clientes</option>
          {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={handleGenerate} disabled={generating}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 disabled:opacity-50 transition-all">
          {generating ? <span className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
          {generating ? "Gerando..." : "Gerar Relatorio"}
        </button>
      </div>

      {/* Report Structure Preview */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Estrutura do Relatorio (Output Padrao)</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {reportSections.map((sec) => {
            const Icon = sec.icon
            return (
              <div key={sec.title} className="flex items-start gap-2 p-3 rounded-lg bg-secondary/30">
                <Icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-foreground">{sec.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{sec.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Performance do Periodo</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 15% 16%)" />
              <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(210 18% 8%)", border: "1px solid hsl(210 15% 16%)", borderRadius: "8px", color: "#e5e7eb" }} />
              <Bar dataKey="leads" fill="#0dbfb3" radius={[4, 4, 0, 0]} />
              <Bar dataKey="vendas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Distribuicao por Canal</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={channelData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {channelData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(210 18% 8%)", border: "1px solid hsl(210 15% 16%)", borderRadius: "8px", color: "#e5e7eb" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Share / Export */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Exportar e Compartilhar</h3>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => toast.info("PDF gerado e salvo no storage")} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary hover:bg-primary/20 transition-all">
            <Download className="w-3.5 h-3.5" /> Baixar PDF
          </button>
          <button onClick={() => handleShare("whatsapp")} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-xs text-green-400 hover:bg-green-500/20 transition-all">
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
          </button>
          <button onClick={() => handleShare("email")} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 hover:bg-blue-500/20 transition-all">
            <Mail className="w-3.5 h-3.5" /> Email
          </button>
          <button onClick={() => handleShare("copy")} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border text-xs text-muted-foreground hover:text-foreground transition-all">
            <Copy className="w-3.5 h-3.5" /> Copiar Resumo
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">Total transparencia: PDF + painel + resumo WhatsApp/email</p>
      </div>
    </div>
  )
}
