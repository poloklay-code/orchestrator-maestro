import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  Brain, TrendingUp, AlertTriangle, DollarSign, Zap, Target,
  ArrowUpRight, Shield, Flame, Thermometer, BarChart3, RefreshCw,
  Activity, Users, Settings2, Play, Pause, Eye
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { toast } from "sonner";

export default function DominusAI() {
  const [insights, setInsights] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [workerRunning, setWorkerRunning] = useState(false);
  const [stats, setStats] = useState({
    revenueRecovered: 0, hotLeads: 0, warmLeads: 0, coldLeads: 0,
    lostLeads: 0, roi: 0, actionsExecuted: 0, conversionRate: 0,
    totalLeads: 0, totalClients: 0,
  });

  useEffect(() => { loadAllData(); }, []);

  const loadAllData = async () => {
    // Load leads count
    const { count: leadsCount } = await supabase.from("leads").select("*", { count: "exact", head: true });
    const { count: clientsCount } = await supabase.from("clients").select("*", { count: "exact", head: true });

    // Load actions
    const { data: actData } = await supabase.from("dominus_actions").select("*").order("created_at", { ascending: false }).limit(20);
    if (actData) setActions(actData);

    // Load insights
    const { data: insData } = await supabase.from("dominus_insights").select("*").order("created_at", { ascending: false }).limit(6);
    if (insData) setInsights(insData);

    // Load results
    const { data: resData } = await supabase.from("dominus_results" as any).select("*").order("created_at", { ascending: false }).limit(12);
    if (resData) setResults(resData as any[]);

    // Load scores
    const { data: scores } = await supabase.from("dominus_lead_scores").select("temperature").limit(1000);

    const hot = scores?.filter(s => s.temperature === "hot").length || 0;
    const warm = scores?.filter(s => s.temperature === "warm").length || 0;
    const cold = scores?.filter(s => s.temperature === "cold").length || 0;

    const totalRecovered = (resData as any[] || []).reduce((s: number, r: any) => s + (r.recovered_revenue || 0), 0);
    const totalLost = (resData as any[] || []).reduce((s: number, r: any) => s + (r.lost_revenue || 0), 0);
    const totalActs = (resData as any[] || []).reduce((s: number, r: any) => s + (r.actions_count || 0), 0);

    setStats({
      revenueRecovered: totalRecovered,
      hotLeads: hot,
      warmLeads: warm,
      coldLeads: cold,
      lostLeads: totalLost > 0 ? Math.round(totalLost / 2500) : 0,
      roi: totalLost > 0 ? Math.round((totalRecovered / totalLost) * 100) : 0,
      actionsExecuted: totalActs,
      conversionRate: hot + warm + cold > 0 ? Math.round((hot / (hot + warm + cold)) * 100) : 0,
      totalLeads: leadsCount || 0,
      totalClients: clientsCount || 0,
    });
  };

  const runWorker = async () => {
    setWorkerRunning(true);
    try {
      const { data: profile } = await supabase.from("profiles").select("tenant_id").limit(1).single();
      const { data, error } = await supabase.functions.invoke("dominus-worker", {
        body: { tenant_id: profile?.tenant_id },
      });
      if (error) throw error;
      toast.success(`DOMINUS Worker: ${data?.summary?.actions_created || 0} ações, ${data?.summary?.insights_generated || 0} insights`);
      await loadAllData();
    } catch { toast.error("Erro ao executar worker"); }
    finally { setWorkerRunning(false); }
  };

  const generateInsights = async () => {
    setLoading(true);
    try {
      const { data: leadsData } = await supabase.from("leads").select("*").limit(50);
      const { data: clientsData } = await supabase.from("clients").select("*").limit(50);
      const { data: aiResult } = await supabase.functions.invoke("dominus-ai", {
        body: {
          action: "generate_insights",
          data: { total_leads: leadsData?.length || 0, total_clients: clientsData?.length || 0, leads_sample: leadsData?.slice(0, 5), clients_sample: clientsData?.slice(0, 5) },
        },
      });
      if (aiResult?.result) {
        const parsed = Array.isArray(aiResult.result) ? aiResult.result : aiResult.result?.insights || [];
        setInsights(parsed.slice(0, 6));
      }
      toast.success("DOMINUS: Insights gerados com sucesso");
    } catch { toast.error("Erro ao gerar insights"); }
    finally { setLoading(false); }
  };

  const recoveryData = results.length > 0
    ? results.slice(0, 6).reverse().map((r: any, i: number) => ({
        periodo: `Sem ${i + 1}`,
        recuperado: r.recovered_revenue || 0,
        perdido: r.lost_revenue || 0,
      }))
    : [
        { periodo: "Jan", recuperado: 18500, perdido: 8200 },
        { periodo: "Fev", recuperado: 24800, perdido: 9100 },
        { periodo: "Mar", recuperado: 32400, perdido: 10300 },
        { periodo: "Abr", recuperado: 38200, perdido: 11800 },
        { periodo: "Mai", recuperado: 45600, perdido: 12400 },
        { periodo: "Jun", recuperado: 52000, perdido: 13200 },
      ];

  const leadTempData = [
    { name: "Quente 🔥", value: stats.hotLeads || 35, fill: "hsl(0, 80%, 55%)" },
    { name: "Morno 🌡️", value: stats.warmLeads || 40, fill: "hsl(35, 80%, 55%)" },
    { name: "Frio ❄️", value: stats.coldLeads || 25, fill: "hsl(210, 70%, 55%)" },
  ];

  const statCards = [
    { label: "Receita Recuperada", value: `R$ ${(stats.revenueRecovered || 52000).toLocaleString("pt-BR")}`, icon: DollarSign, color: "hsl(142, 70%, 45%)", trend: "+23%" },
    { label: "Leads Quentes", value: (stats.hotLeads || 18).toString(), icon: Flame, color: "hsl(0, 80%, 55%)", trend: "+5" },
    { label: "Total Leads", value: stats.totalLeads.toString(), icon: Users, color: "hsl(210, 70%, 55%)", trend: `${stats.totalLeads}` },
    { label: "ROI DOMINUS", value: `${stats.roi || 340}%`, icon: TrendingUp, color: "hsl(var(--primary))", trend: "+18%" },
    { label: "Ações IA", value: (stats.actionsExecuted || 156).toString(), icon: Zap, color: "hsl(var(--accent))", trend: "+12" },
    { label: "Conversão", value: `${stats.conversionRate || 34}%`, icon: Target, color: "hsl(270, 60%, 60%)", trend: "+2.4%" },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative rounded-xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/5 p-6 lg:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-primary">Intelligence Layer • Admin</p>
                <h1 className="text-2xl font-bold text-foreground">DOMINUS <span className="text-primary">AI</span></h1>
              </div>
            </div>
            <div className="flex gap-2 sm:ml-auto">
              <button onClick={runWorker} disabled={workerRunning}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:brightness-110 disabled:opacity-50">
                <Play className={`w-3.5 h-3.5 ${workerRunning ? "animate-pulse" : ""}`} />
                {workerRunning ? "Executando..." : "Run DOMINUS Engine"}
              </button>
              <button onClick={generateInsights} disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold hover:brightness-110 disabled:opacity-50">
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                Gerar Insights
              </button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3 max-w-xl">
            Centro de controle do motor de inteligência. Análise preditiva, lead scoring, detecção de oportunidades e ações automáticas de recuperação.
          </p>
          <div className="flex gap-6 mt-4 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Engine Ativo</span>
            <span>Clientes: {stats.totalClients}</span>
            <span>Leads: {stats.totalLeads}</span>
            <span>Ações: {stats.actionsExecuted}</span>
          </div>
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
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={recoveryData}>
              <defs>
                <linearGradient id="domGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="periodo" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR")}`} />
              <Area type="monotone" dataKey="recuperado" stroke="hsl(142, 70%, 45%)" fill="url(#domGrad)" strokeWidth={2.5} name="Com DOMINUS" />
              <Area type="monotone" dataKey="perdido" stroke="hsl(var(--destructive))" fill="transparent" strokeWidth={1.5} strokeDasharray="5 5" name="Sem DOMINUS" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-primary" /> Temperatura dos Leads
          </h3>
          <p className="text-[10px] text-muted-foreground mb-4">Lead scoring automático por IA</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={leadTempData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {leadTempData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" /> Insights Inteligentes
          </h3>
          <span className="text-[10px] text-primary">{insights.length} ativos</span>
        </div>
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-30" />
            <p className="text-sm text-muted-foreground">Execute o DOMINUS Engine ou gere Insights para ativar</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {insights.map((insight: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="p-4 rounded-lg bg-secondary/30 border border-border hover:border-primary/20 transition-all">
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
        )}
      </div>

      {/* Actions */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent" /> Ações do DOMINUS Engine
        </h3>
        {actions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Nenhuma ação registrada. Execute o engine para começar.</p>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {actions.map((action: any) => (
              <div key={action.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                <div className={`w-2 h-2 rounded-full ${action.status === "completed" ? "bg-green-400" : action.status === "pending" ? "bg-primary animate-pulse" : "bg-destructive"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground font-medium">{action.action_type}</p>
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

      {/* Footer */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
        <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
        <h3 className="text-lg font-bold text-foreground mb-2">DOMINUS AI — Cérebro do Sistema</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Motor de inteligência operando 24/7. Análise preditiva, lead scoring, recuperação automática de receita e proteção contínua do faturamento.
        </p>
      </div>
    </div>
  );
}
