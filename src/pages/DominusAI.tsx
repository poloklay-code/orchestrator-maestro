import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Brain, TrendingUp, AlertTriangle, DollarSign, Users, Zap, Target, ArrowUpRight, Shield, Flame, Thermometer, Snowflake, BarChart3, RefreshCw } from "lucide-react";
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

export default function DominusAI() {
  const [insights, setInsights] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
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
      const { data: leadsData } = await supabase.from("leads").select("*").limit(50);
      const { data: clientsData } = await supabase.from("clients").select("*").limit(50);

      // Call DOMINUS AI for insights
      const { data: aiResult } = await supabase.functions.invoke("dominus-ai", {
        body: {
          action: "generate_insights",
          data: {
            total_leads: leadsData?.length || 0,
            total_clients: clientsData?.length || 0,
            leads_sample: leadsData?.slice(0, 5),
            clients_sample: clientsData?.slice(0, 5),
          },
        },
      });

      if (aiResult?.result) {
        const parsed = Array.isArray(aiResult.result) ? aiResult.result : aiResult.result?.insights || [];
        setInsights(parsed.slice(0, 6));
      }
      toast.success("DOMINUS AI: Insights atualizados");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao gerar insights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load recent actions from DB
    supabase.from("dominus_actions").select("*").order("created_at", { ascending: false }).limit(10)
      .then(({ data }) => { if (data) setActions(data); });
  }, []);

  const statCards = [
    { label: "Receita Recuperada", value: `R$ ${stats.revenueRecovered.toLocaleString()}`, icon: DollarSign, color: "hsl(142, 70%, 45%)", trend: "+23%" },
    { label: "Leads Quentes", value: stats.hotLeads.toString(), icon: Flame, color: "hsl(0, 80%, 55%)", trend: "+5" },
    { label: "Leads Perdidos", value: stats.lostLeads.toString(), icon: AlertTriangle, color: "hsl(35, 80%, 55%)", trend: "-3" },
    { label: "ROI DOMINUS", value: `${stats.roi}%`, icon: TrendingUp, color: "hsl(var(--primary))", trend: "+18%" },
    { label: "Ações Executadas", value: stats.actionsExecuted.toString(), icon: Zap, color: "hsl(var(--accent))", trend: "+12" },
    { label: "Taxa Conversão", value: `${stats.conversionRate}%`, icon: Target, color: "hsl(270, 60%, 60%)", trend: "+2.4%" },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative rounded-xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/5 p-6 lg:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-primary font-display">Intelligence Layer</p>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                DOMINUS <span className="text-gold-gradient">AI</span>
              </h1>
            </div>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            O cérebro que protege e aumenta o faturamento do seu negócio. Análise preditiva, detecção de oportunidades perdidas e ações automáticas de recuperação.
          </p>
          <button onClick={loadInsights} disabled={loading}
            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition-all disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Analisando..." : "Gerar Insights com IA"}
          </button>
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

      {/* Charts: Com vs Sem DOMINUS */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> Com DOMINUS vs Sem DOMINUS
          </h3>
          <p className="text-[10px] text-muted-foreground mb-4">Receita acumulada (R$) — demonstração do impacto</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={recoveryData}>
              <defs>
                <linearGradient id="domGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="semGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} formatter={(v: number) => `R$ ${v.toLocaleString()}`} />
              <Area type="monotone" dataKey="com_dominus" stroke="hsl(142, 70%, 45%)" fill="url(#domGrad)" strokeWidth={2.5} name="Com DOMINUS" />
              <Area type="monotone" dataKey="sem_dominus" stroke="hsl(var(--destructive))" fill="url(#semGrad)" strokeWidth={1.5} strokeDasharray="5 5" name="Sem DOMINUS" />
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
              <Pie data={leadTemperature} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {leadTemperature.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" /> Insights Inteligentes
          </h3>
          <span className="text-[10px] text-primary font-display">{insights.length} insights ativos</span>
        </div>
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-30" />
            <p className="text-sm text-muted-foreground">Clique em "Gerar Insights com IA" para ativar o DOMINUS</p>
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
                {insight.impact_value && (
                  <p className="text-xs font-bold text-green-400 mt-2">Impacto: R$ {Number(insight.impact_value).toLocaleString()}</p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Actions */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent" /> Ações Executadas pelo DOMINUS
        </h3>
        {actions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Nenhuma ação automática registrada ainda.</p>
        ) : (
          <div className="space-y-2">
            {actions.map((action: any) => (
              <div key={action.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                <div className={`w-2 h-2 rounded-full ${action.status === "completed" ? "bg-green-400" : action.status === "pending" ? "bg-primary" : "bg-destructive"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground">{action.action_type}</p>
                  <p className="text-[10px] text-muted-foreground">{action.target_type}</p>
                </div>
                {action.revenue_recovered > 0 && (
                  <span className="text-xs font-bold text-green-400">+R$ {action.revenue_recovered.toLocaleString()}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dominus Value Prop */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
        <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
        <h3 className="text-lg font-bold text-foreground mb-2">DOMINUS AI está protegendo seu negócio</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Monitoramento 24/7, detecção de oportunidades perdidas, lead scoring inteligente e ações automáticas de recuperação de receita.
        </p>
      </div>
    </div>
  );
}
