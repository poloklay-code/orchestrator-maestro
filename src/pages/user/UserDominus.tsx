import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Brain, TrendingUp, AlertTriangle, DollarSign, Zap, Target,
  ArrowUpRight, ArrowDownRight, Shield, Flame, Thermometer, BarChart3, RefreshCw,
  Activity, Users, Eye, Clock
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { toast } from "sonner";

export default function UserDominus() {
  const { user } = useAuth();
  const [insights, setInsights] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [runningWorker, setRunningWorker] = useState(false);

  const [stats, setStats] = useState({
    revenueRecovered: 0,
    lostRevenue: 0,
    hotLeads: 0,
    warmLeads: 0,
    coldLeads: 0,
    lostLeads: 0,
    actionsExecuted: 0,
    conversionRate: 0,
    roi: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Load actions
    const { data: actionsData } = await supabase
      .from("dominus_actions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (actionsData) setActions(actionsData);

    // Load insights
    const { data: insightsData } = await supabase
      .from("dominus_insights")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6);
    if (insightsData) setInsights(insightsData);

    // Load results
    const { data: resultsData } = await supabase
      .from("dominus_results" as any)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(12);
    if (resultsData && (resultsData as any[]).length > 0) {
      setResults(resultsData as any[]);
      const latest = (resultsData as any[])[0];
      const totalRecovered = (resultsData as any[]).reduce((s: number, r: any) => s + (r.recovered_revenue || 0), 0);
      const totalLost = (resultsData as any[]).reduce((s: number, r: any) => s + (r.lost_revenue || 0), 0);
      const totalActions = (resultsData as any[]).reduce((s: number, r: any) => s + (r.actions_count || 0), 0);
      setStats(prev => ({
        ...prev,
        revenueRecovered: totalRecovered,
        lostRevenue: totalLost,
        hotLeads: latest.leads_recovered || 0,
        lostLeads: latest.leads_lost || 0,
        actionsExecuted: totalActions,
        roi: totalLost > 0 ? Math.round((totalRecovered / totalLost) * 100) : 0,
        conversionRate: latest.leads_recovered && latest.leads_lost
          ? Math.round((latest.leads_recovered / (latest.leads_recovered + latest.leads_lost)) * 100)
          : 0,
      }));
    }

    // Load lead scores
    const { data: scores } = await supabase
      .from("dominus_lead_scores")
      .select("temperature")
      .limit(500);
    if (scores) {
      setStats(prev => ({
        ...prev,
        hotLeads: scores.filter(s => s.temperature === "hot").length,
        warmLeads: scores.filter(s => s.temperature === "warm").length,
        coldLeads: scores.filter(s => s.temperature === "cold").length,
      }));
    }
  };

  const runDominus = async () => {
    setRunningWorker(true);
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("tenant_id")
        .eq("id", user?.id)
        .single();

      const { data, error } = await supabase.functions.invoke("dominus-worker", {
        body: { tenant_id: profile?.tenant_id, user_id: user?.id },
      });

      if (error) throw error;
      toast.success(`DOMINUS executou: ${data?.summary?.actions_created || 0} ações criadas`);
      await loadData();
    } catch (err) {
      toast.error("Erro ao executar DOMINUS");
    } finally {
      setRunningWorker(false);
    }
  };

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
      toast.success("Insights atualizados pela IA");
    } catch {
      toast.error("Erro ao gerar insights");
    } finally {
      setLoading(false);
    }
  };

  const recoveryChartData = results.length > 0
    ? results.slice(0, 6).reverse().map((r: any, i: number) => ({
        periodo: `Sem ${i + 1}`,
        recuperado: r.recovered_revenue || 0,
        perdido: r.lost_revenue || 0,
      }))
    : [
        { periodo: "Sem 1", recuperado: 0, perdido: 0 },
        { periodo: "Sem 2", recuperado: 0, perdido: 0 },
      ];

  const leadTempData = [
    { name: "Quente 🔥", value: stats.hotLeads || 1, fill: "hsl(0, 80%, 55%)" },
    { name: "Morno 🌡️", value: stats.warmLeads || 1, fill: "hsl(35, 80%, 55%)" },
    { name: "Frio ❄️", value: stats.coldLeads || 1, fill: "hsl(210, 70%, 55%)" },
  ];

  const statCards = [
    { label: "Receita Recuperada", value: `R$ ${stats.revenueRecovered.toLocaleString("pt-BR")}`, icon: DollarSign, color: "hsl(142, 70%, 45%)", trend: stats.revenueRecovered > 0 ? `+${Math.round(stats.roi)}%` : "—", up: true },
    { label: "Receita Perdida", value: `R$ ${stats.lostRevenue.toLocaleString("pt-BR")}`, icon: AlertTriangle, color: "hsl(0, 80%, 55%)", trend: stats.lostLeads > 0 ? `-${stats.lostLeads}` : "0", up: false },
    { label: "Leads Quentes", value: stats.hotLeads.toString(), icon: Flame, color: "hsl(0, 80%, 55%)", trend: `+${stats.hotLeads}`, up: true },
    { label: "ROI DOMINUS", value: `${stats.roi}%`, icon: TrendingUp, color: "hsl(var(--primary))", trend: stats.roi > 0 ? "↑" : "—", up: stats.roi > 0 },
    { label: "Ações da IA", value: stats.actionsExecuted.toString(), icon: Zap, color: "hsl(var(--accent))", trend: `+${stats.actionsExecuted}`, up: true },
    { label: "Taxa Conversão", value: `${stats.conversionRate}%`, icon: Target, color: "hsl(270, 60%, 60%)", trend: stats.conversionRate > 0 ? "↑" : "—", up: stats.conversionRate > 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative rounded-xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/5 p-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                DOMINUS <span className="text-primary">AI</span>
              </h1>
              <p className="text-xs text-muted-foreground">Motor de inteligência protegendo seu faturamento</p>
            </div>
          </div>
          <div className="flex gap-2 sm:ml-auto">
            <button onClick={runDominus} disabled={runningWorker}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:brightness-110 disabled:opacity-50">
              <Activity className={`w-3.5 h-3.5 ${runningWorker ? "animate-pulse" : ""}`} />
              {runningWorker ? "Executando..." : "Executar DOMINUS"}
            </button>
            <button onClick={loadInsights} disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold hover:brightness-110 disabled:opacity-50">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Insights IA
            </button>
          </div>
        </div>

        {/* Status bar */}
        <div className="relative z-10 mt-4 flex items-center gap-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Sistema Ativo</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Última execução: agora</span>
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Monitoramento 24/7</span>
        </div>
      </div>

      {/* Stats Grid */}
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
                <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${card.up ? "text-green-400" : "text-destructive"}`}>
                  {card.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {card.trend}
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
        {/* Revenue Recovery */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> Receita: Recuperada vs Perdida
          </h3>
          <p className="text-[10px] text-muted-foreground mb-4">Comparativo por período (R$)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={recoveryChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="periodo" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR")}`} />
              <Bar dataKey="recuperado" fill="hsl(142, 70%, 45%)" radius={[4, 4, 0, 0]} name="Recuperado" />
              <Bar dataKey="perdido" fill="hsl(0, 70%, 55%)" radius={[4, 4, 0, 0]} name="Perdido" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Temperature */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-primary" /> Temperatura dos Leads
          </h3>
          <p className="text-[10px] text-muted-foreground mb-4">Lead scoring automático por IA</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={leadTempData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={4} dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {leadTempData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Actions executed */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent" /> Ações Executadas pelo DOMINUS
        </h3>
        {actions.length === 0 ? (
          <div className="text-center py-8">
            <Zap className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-30" />
            <p className="text-sm text-muted-foreground">Clique em "Executar DOMINUS" para iniciar a análise automática</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {actions.map((action: any) => (
              <div key={action.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                <div className={`w-2 h-2 rounded-full ${action.status === "completed" ? "bg-green-400" : action.status === "pending" ? "bg-primary" : "bg-destructive"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground font-medium">{action.action_type === "first_contact" ? "📞 Primeiro Contato" : action.action_type === "reengagement" ? "🔄 Reengajamento" : action.action_type}</p>
                  <p className="text-[10px] text-muted-foreground">{action.target_type} • {new Date(action.created_at).toLocaleDateString("pt-BR")}</p>
                </div>
                {action.revenue_recovered > 0 && (
                  <span className="text-xs font-bold text-green-400">+R$ {Number(action.revenue_recovered).toLocaleString("pt-BR")}</span>
                )}
              </div>
            ))}
          </div>
        )}
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
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${insight.priority === "high" ? "bg-destructive" : insight.priority === "medium" ? "bg-primary" : "bg-accent"}`} />
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">{insight.category || "insight"}</span>
                </div>
                <p className="text-xs font-semibold text-foreground mb-1">{insight.title}</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{insight.description}</p>
                {insight.impact_value > 0 && (
                  <p className="text-xs font-bold text-green-400 mt-2">Impacto: R$ {Number(insight.impact_value).toLocaleString("pt-BR")}</p>
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
          Monitoramento contínuo, detecção de oportunidades perdidas e ações automáticas de recuperação de receita — tudo em segundo plano.
        </p>
      </div>
    </div>
  );
}
