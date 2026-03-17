import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Brain, TrendingUp, AlertTriangle, DollarSign, Zap, Target,
  ArrowUpRight, Shield, Flame, Thermometer, BarChart3, RefreshCw
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";

const recoveryData = [
  { mes: "Jan", com_dominus: 18500, sem_dominus: 8200 },
  { mes: "Fev", com_dominus: 24800, sem_dominus: 9100 },
  { mes: "Mar", com_dominus: 32400, sem_dominus: 10300 },
  { mes: "Abr", com_dominus: 38200, sem_dominus: 11800 },
  { mes: "Mai", com_dominus: 45600, sem_dominus: 12400 },
  { mes: "Jun", com_dominus: 52000, sem_dominus: 13200 },
];

const leadTemperature = [
  { name: "Quente 🔥", value: 35, fill: "hsl(0, 80%, 55%)" },
  { name: "Morno 🌡️", value: 40, fill: "hsl(35, 80%, 55%)" },
  { name: "Frio ❄️", value: 25, fill: "hsl(210, 70%, 55%)" },
];

export default function UserDominus() {
  const { user } = useAuth();
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats] = useState({
    revenueRecovered: 52000,
    hotLeads: 18,
    lostLeads: 7,
    roi: 340,
    actionsExecuted: 156,
    conversionRate: 34.2,
  });

  const loadInsights = async () => {
    setLoading(true);
    try {
      const { data: aiResult } = await supabase.functions.invoke("dominus-ai", {
        body: { action: "generate_insights", data: { user_id: user?.id } },
      });
      if (aiResult?.result) {
        const parsed = Array.isArray(aiResult.result) ? aiResult.result : aiResult.result?.insights || [];
        setInsights(parsed.slice(0, 6));
      }
      toast.success("Insights atualizados");
    } catch {
      toast.error("Erro ao gerar insights");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Receita Recuperada", value: `R$ ${stats.revenueRecovered.toLocaleString()}`, icon: DollarSign, color: "hsl(142, 70%, 45%)", trend: "+23%" },
    { label: "Leads Quentes", value: stats.hotLeads.toString(), icon: Flame, color: "hsl(0, 80%, 55%)", trend: "+5" },
    { label: "Leads Perdidos", value: stats.lostLeads.toString(), icon: AlertTriangle, color: "hsl(35, 80%, 55%)", trend: "-3" },
    { label: "ROI", value: `${stats.roi}%`, icon: TrendingUp, color: "hsl(var(--primary))", trend: "+18%" },
    { label: "Ações IA", value: stats.actionsExecuted.toString(), icon: Zap, color: "hsl(var(--accent))", trend: "+12" },
    { label: "Conversão", value: `${stats.conversionRate}%`, icon: Target, color: "hsl(270, 60%, 60%)", trend: "+2.4%" },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative rounded-xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/5 p-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              DOMINUS <span className="text-primary">AI</span>
            </h1>
            <p className="text-xs text-muted-foreground">Protegendo e aumentando seu faturamento</p>
          </div>
          <button onClick={loadInsights} disabled={loading}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:brightness-110 disabled:opacity-50">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            {loading ? "..." : "Atualizar"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
                <span className="text-[10px] font-semibold text-green-400 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" /> {card.trend}
                </span>
              </div>
              <p className="text-lg font-bold text-foreground">{card.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> Com DOMINUS vs Sem DOMINUS
          </h3>
          <p className="text-[10px] text-muted-foreground mb-4">Receita acumulada (R$)</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={recoveryData}>
              <defs>
                <linearGradient id="uDomGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} formatter={(v: number) => `R$ ${v.toLocaleString()}`} />
              <Area type="monotone" dataKey="com_dominus" stroke="hsl(142, 70%, 45%)" fill="url(#uDomGrad)" strokeWidth={2.5} name="Com DOMINUS" />
              <Area type="monotone" dataKey="sem_dominus" stroke="hsl(var(--destructive))" fill="transparent" strokeWidth={1.5} strokeDasharray="5 5" name="Sem DOMINUS" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-primary" /> Temperatura dos Leads
          </h3>
          <p className="text-[10px] text-muted-foreground mb-4">Scoring automático por IA</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={leadTemperature} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={4} dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {leadTemperature.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" /> Insights Inteligentes
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {insights.map((insight: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="p-4 rounded-lg bg-secondary/30 border border-border">
                <p className="text-xs font-semibold text-foreground mb-1">{insight.title}</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{insight.description}</p>
                {insight.impact_value && (
                  <p className="text-xs font-bold text-green-400 mt-2">Impacto: R$ {Number(insight.impact_value).toLocaleString()}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
        <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
        <h3 className="text-lg font-bold text-foreground mb-1">DOMINUS AI protege seu negócio 24/7</h3>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Monitoramento contínuo, detecção de oportunidades e ações automáticas de recuperação de receita.
        </p>
      </div>
    </div>
  );
}
