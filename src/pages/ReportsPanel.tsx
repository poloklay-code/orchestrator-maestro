import { useState } from "react";
import { toast } from "sonner";
import { FileText, Download, Mail, MessageCircle, Copy, BarChart3, TrendingUp, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

type ReportType = "semanal" | "quinzenal" | "mensal" | "sob_demanda";

const CHART_COLORS = ["hsl(var(--ai-active))", "hsl(var(--accent))", "hsl(var(--ai-processing))", "hsl(var(--primary))", "hsl(var(--destructive))"];

const performanceData = [
  { name: "Sem 1", leads: 45, vendas: 12 },
  { name: "Sem 2", leads: 62, vendas: 18 },
  { name: "Sem 3", leads: 55, vendas: 15 },
  { name: "Sem 4", leads: 78, vendas: 24 },
];

const channelData = [
  { name: "Facebook Ads", value: 35 },
  { name: "Google Ads", value: 28 },
  { name: "Instagram Org.", value: 20 },
  { name: "WhatsApp", value: 12 },
  { name: "Email", value: 5 },
];

const reportSections = [
  { icon: BarChart3, title: "Diagnostico", desc: "Analise completa do periodo com dados reais de todas as plataformas" },
  { icon: TrendingUp, title: "Estrategia", desc: "Recomendacoes baseadas em dados e padroes identificados pela IA" },
  { icon: CheckCircle2, title: "Acoes Realizadas", desc: "Detalhamento de cada acao executada com resultado e metrica" },
  { icon: AlertTriangle, title: "Riscos Identificados", desc: "Pontos de atencao e recomendacoes preventivas" },
  { icon: ArrowRight, title: "Proximos Passos", desc: "Plano de acao priorizado para o proximo ciclo com KPIs" },
];

export default function ReportsPanel() {
  const [reportType, setReportType] = useState<ReportType>("semanal");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setGenerating(false);
    toast.success("Relatorio gerado com sucesso!");
  };

  const handleShare = (method: string) => {
    const text = `Relatorio ${reportType} - ORQUESTRADOR MAESTRO\nPeriodo: ${new Date().toLocaleDateString("pt-BR")}`;
    if (method === "whatsapp") window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    else if (method === "email") window.open(`mailto:?subject=${encodeURIComponent(`Relatorio ${reportType}`)}&body=${encodeURIComponent(text)}`, "_blank");
    else { navigator.clipboard.writeText(text); toast.success("Copiado!"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2">
          {(["semanal", "quinzenal", "mensal", "sob_demanda"] as ReportType[]).map((t) => (
            <button key={t} onClick={() => setReportType(t)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${reportType === t ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
              {t === "sob_demanda" ? "Sob Demanda" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={handleGenerate} disabled={generating}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 disabled:opacity-50 transition-all">
          {generating ? <span className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
          {generating ? "Gerando..." : "Gerar Relatorio"}
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Estrutura do Relatorio</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {reportSections.map((sec) => {
            const Icon = sec.icon;
            return (
              <div key={sec.title} className="flex items-start gap-2 p-3 rounded-lg bg-secondary/30">
                <Icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-foreground">{sec.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{sec.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Performance do Periodo</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
              <Bar dataKey="leads" fill="hsl(var(--ai-active))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="vendas" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
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
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Exportar e Compartilhar</h3>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => toast.info("PDF gerado")} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary hover:bg-primary/20 transition-all">
            <Download className="w-3.5 h-3.5" /> Baixar PDF
          </button>
          <button onClick={() => handleShare("whatsapp")} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ai-active/10 border border-ai-active/20 text-xs text-ai-active hover:bg-ai-active/20 transition-all">
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
          </button>
          <button onClick={() => handleShare("email")} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/10 border border-accent/20 text-xs text-accent hover:bg-accent/20 transition-all">
            <Mail className="w-3.5 h-3.5" /> Email
          </button>
          <button onClick={() => handleShare("copy")} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border text-xs text-muted-foreground hover:text-foreground transition-all">
            <Copy className="w-3.5 h-3.5" /> Copiar Resumo
          </button>
        </div>
      </div>
    </div>
  );
}
