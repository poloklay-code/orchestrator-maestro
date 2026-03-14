import { useState } from "react";
import { toast } from "sonner";
import { Shield, AlertTriangle, Eye, Zap, CheckCircle2, XCircle, Clock, Play, Target, RotateCcw, FileCheck, Activity, Users, PenTool, MapPin, Store, DollarSign, Bot, BarChart3, Radio, Cpu, TrendingUp, RefreshCw } from "lucide-react";

type Mode = "normal" | "shadow" | "crisis";

interface Change {
  id: string; title: string; description: string; risk: "low" | "medium" | "high" | "critical";
  metric: string; rollback: string; status: "pending" | "approved" | "rejected" | "testing"; mode: Mode;
}

interface ModuleStatus {
  name: string; icon: any; status: "online" | "warning" | "offline"; tasks: number; lastSync: string; description: string;
}

export default function GovernancePanel() {
  const [mode, setMode] = useState<Mode>("normal");
  const [changes, setChanges] = useState<Change[]>([
    { id: "1", title: "Escalar campanha Facebook Ads — João Silva", description: "Aumentar budget em 50% para campanha principal. IA detectou janela de oportunidade com CPA abaixo da média.", risk: "medium", metric: "CPA manter abaixo de R$25", rollback: "Reverter budget ao valor anterior em 1h", status: "pending", mode: "normal" },
    { id: "2", title: "Novo fluxo ManyChat — Maria Santos", description: "Adicionar fluxo de re-engajamento automático para leads inativos há 7 dias. IA personalizará mensagens.", risk: "low", metric: "Taxa resposta > 40% em 48h", rollback: "Desativar fluxo e reverter ao anterior", status: "approved", mode: "normal" },
    { id: "3", title: "Trocar copy da landing page — Carlos Lima", description: "Teste A/B com nova headline focada em dor. Copy gerada pelo CopyMaster com análise profunda.", risk: "medium", metric: "CVR manter acima de 3.5%", rollback: "Restaurar versão anterior da LP", status: "testing", mode: "shadow" },
    { id: "4", title: "Otimização SEO Google Meu Negócio — Cliente A", description: "IA adicionando 15 fotos profissionais e otimizando descrição com keywords de alta conversão.", risk: "low", metric: "Ranking top 3 em 30 dias", rollback: "Restaurar descrição anterior", status: "approved", mode: "normal" },
    { id: "5", title: "Automação cobrança — Sistema Financeiro", description: "Ativar fluxo de cobrança automática: email dia 1, WhatsApp dia 3, suspensão dia 15.", risk: "high", metric: "Inadimplência reduzir para < 5%", rollback: "Pausar automação e notificar admin", status: "pending", mode: "normal" },
  ]);
  const [showNewChange, setShowNewChange] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", risk: "low" as Change["risk"], metric: "", rollback: "" });
  const [priorities, setPriorities] = useState({ primary: "Escalar tráfego pago com ROI positivo para todos os clientes", secondary: "Otimizar automações de follow-up e reduzir inadimplência" });

  const modules: ModuleStatus[] = [
    { name: "CopyMaster IA", icon: PenTool, status: "online", tasks: 8, lastSync: "agora", description: "Gerando copies persuasivas para 3 clientes ativos" },
    { name: "Automações", icon: Zap, status: "online", tasks: 5, lastSync: "2min", description: "5 workflows ativos — 3.046 execuções hoje" },
    { name: "Gestão de Tráfego", icon: TrendingUp, status: "online", tasks: 12, lastSync: "1min", description: "Gerenciando R$4.500/dia em 4 plataformas" },
    { name: "Google Meu Negócio", icon: MapPin, status: "online", tasks: 3, lastSync: "5min", description: "3 perfis otimizados — 2 no top 3 do ranking" },
    { name: "Afiliados", icon: Store, status: "online", tasks: 3, lastSync: "10min", description: "127 vendas hoje — R$25.400 receita" },
    { name: "Financeiro", icon: DollarSign, status: "warning", tasks: 2, lastSync: "3min", description: "2 faturas pendentes — cobrança automática ativa" },
    { name: "Contratos", icon: FileCheck, status: "online", tasks: 1, lastSync: "1h", description: "Todos contratos assinados e ativos" },
    { name: "AI Command Center", icon: Radio, status: "online", tasks: 200, lastSync: "agora", description: "200 agentes IA operando 24/7 sem interrupção" },
    { name: "Monitoramento", icon: Activity, status: "online", tasks: 15, lastSync: "agora", description: "Todos os KPIs dentro da meta" },
    { name: "Clientes", icon: Users, status: "online", tasks: 6, lastSync: "5min", description: "6 clientes ativos com serviços em produção" },
  ];

  const riskColor = (r: string) => { if (r === "low") return "text-green-400 bg-green-500/10"; if (r === "medium") return "text-yellow-400 bg-yellow-500/10"; if (r === "high") return "text-orange-400 bg-orange-500/10"; return "text-red-400 bg-red-500/10"; };
  const statusIcon = (s: string) => { if (s === "approved") return <CheckCircle2 className="w-4 h-4 text-green-400" />; if (s === "rejected") return <XCircle className="w-4 h-4 text-red-400" />; if (s === "testing") return <Eye className="w-4 h-4 text-blue-400" />; return <Clock className="w-4 h-4 text-yellow-400" />; };

  const modeConfig = {
    normal: { label: "Normal", color: "text-green-400 bg-green-500/10 border-green-500/20", icon: Play, desc: "Operação padrão — todos módulos sincronizados e operando" },
    shadow: { label: "Shadow Mode", color: "text-blue-400 bg-blue-500/10 border-blue-500/20", icon: Eye, desc: "Testar hipóteses sem risco real — simulação segura em todos os módulos" },
    crisis: { label: "Modo Crise", color: "text-red-400 bg-red-500/10 border-red-500/20", icon: AlertTriangle, desc: "Incidente ativo — todos módulos em modo defensivo, apenas rollback" },
  };

  const handleApprove = (id: string) => { setChanges(changes.map((c) => c.id === id ? { ...c, status: "approved" } : c)); toast.success("Mudança aprovada — módulos sincronizados"); };
  const handleReject = (id: string) => { setChanges(changes.map((c) => c.id === id ? { ...c, status: "rejected" } : c)); toast.info("Mudança rejeitada"); };
  const handleShadowTest = (id: string) => { setChanges(changes.map((c) => c.id === id ? { ...c, status: "testing", mode: "shadow" } : c)); toast.success("Enviado para Shadow Mode — simulação segura"); };

  const handleAddChange = () => {
    if (!form.title || !form.metric || !form.rollback) { toast.error("Preencha todos os campos obrigatórios"); return; }
    setChanges([{ id: Date.now().toString(), ...form, status: "pending", mode }, ...changes]);
    setShowNewChange(false);
    setForm({ title: "", description: "", risk: "low", metric: "", rollback: "" });
    toast.success("Mudança registrada — governança ativa");
  };

  const switchMode = (newMode: Mode) => { setMode(newMode); toast.success(`Modo ${modeConfig[newMode].label} ativado em todos os módulos`); };

  const onlineModules = modules.filter(m => m.status === "online").length;
  const totalTasks = modules.reduce((a, b) => a + b.tasks, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Shield className="w-7 h-7 text-primary" /> Governança — Orquestração de Todo o Sistema
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Central de governança que gerencia e sincroniza todos os módulos do programa de ponta a ponta. Controle total sobre operações, aprovações e modos de operação.</p>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-green-400">{onlineModules}/{modules.length}</p>
          <p className="text-[10px] text-muted-foreground">Módulos Online</p>
        </div>
        <div className="p-3 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-primary">{totalTasks}</p>
          <p className="text-[10px] text-muted-foreground">Tarefas Ativas</p>
        </div>
        <div className="p-3 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-foreground">{changes.filter(c => c.status === "pending").length}</p>
          <p className="text-[10px] text-muted-foreground">Pendentes Aprovação</p>
        </div>
        <div className="p-3 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-foreground">99.8%</p>
          <p className="text-[10px] text-muted-foreground">Uptime Sistema</p>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex flex-col lg:flex-row gap-4">
        {(Object.entries(modeConfig) as [Mode, typeof modeConfig.normal][]).map(([key, cfg]) => {
          const Icon = cfg.icon;
          const isActive = mode === key;
          return (
            <button key={key} onClick={() => switchMode(key)}
              className={`flex-1 p-4 rounded-xl border transition-all text-left ${isActive ? cfg.color + " border-current" : "border-border bg-card hover:border-primary/20"}`}>
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${isActive ? "" : "text-muted-foreground"}`} />
                <span className={`text-sm font-semibold ${isActive ? "" : "text-foreground"}`}>{cfg.label}</span>
              </div>
              <p className={`text-xs ${isActive ? "opacity-80" : "text-muted-foreground"}`}>{cfg.desc}</p>
            </button>
          );
        })}
      </div>

      {mode === "crisis" && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-red-400">MODO CRISE ATIVO EM TODOS OS MÓDULOS</h3>
            <p className="text-xs text-red-300/70 mt-0.5">Todas as ações externas bloqueadas. Automações pausadas. Campanhas congeladas. CopyMaster em standby. Apenas rollback e diagnóstico permitidos em todos os módulos.</p>
          </div>
        </div>
      )}

      {/* Module Status Grid */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Status de Todos os Módulos do Sistema</h3>
          <span className="ml-auto text-[10px] text-green-400 flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Sincronizado</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div key={mod.name} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${mod.status === "online" ? "bg-green-500/10" : mod.status === "warning" ? "bg-yellow-500/10" : "bg-red-500/10"}`}>
                  <Icon className={`w-4 h-4 ${mod.status === "online" ? "text-green-400" : mod.status === "warning" ? "text-yellow-400" : "text-red-400"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-foreground">{mod.name}</p>
                    <span className={`w-2 h-2 rounded-full ${mod.status === "online" ? "bg-green-400" : mod.status === "warning" ? "bg-yellow-400" : "bg-red-400"}`} />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{mod.description}</p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground font-mono">
                    <span>{mod.tasks} tarefas</span>
                    <span>sync: {mod.lastSync}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Priorities */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-3"><Target className="w-4 h-4 text-primary" /><h3 className="text-sm font-semibold text-foreground">Prioridades do Ciclo (MAESTRO) — Todos os Módulos Seguem</h3></div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-[10px] font-mono text-primary mb-1">PRIORIDADE PRINCIPAL</p>
            <input value={priorities.primary} onChange={(e) => setPriorities({ ...priorities, primary: e.target.value })} className="w-full text-sm text-foreground bg-transparent outline-none" />
          </div>
          <div className="p-3 rounded-lg bg-secondary/50 border border-border">
            <p className="text-[10px] font-mono text-muted-foreground mb-1">PRIORIDADE SECUNDÁRIA</p>
            <input value={priorities.secondary} onChange={(e) => setPriorities({ ...priorities, secondary: e.target.value })} className="w-full text-sm text-foreground bg-transparent outline-none" />
          </div>
        </div>
      </div>

      {/* Changes / Approvals */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2"><FileCheck className="w-4 h-4 text-primary" /><h3 className="text-sm font-semibold text-foreground">Central de Aprovações — Governança de Todos os Módulos</h3></div>
          <button onClick={() => setShowNewChange(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-xs text-primary hover:bg-primary/20 transition-all"><Zap className="w-3 h-3" /> Nova Mudança</button>
        </div>

        {showNewChange && (
          <div className="mb-4 p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <input placeholder="Título da mudança *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <select value={form.risk} onChange={(e) => setForm({ ...form, risk: e.target.value as Change["risk"] })} className="h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="low">Risco Baixo</option><option value="medium">Risco Médio</option><option value="high">Risco Alto</option><option value="critical">Crítico</option>
              </select>
            </div>
            <input placeholder="Descrição detalhada" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <div className="grid sm:grid-cols-2 gap-3">
              <input placeholder="Métrica de sucesso *" value={form.metric} onChange={(e) => setForm({ ...form, metric: e.target.value })} className="h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <input placeholder="Plano de rollback *" value={form.rollback} onChange={(e) => setForm({ ...form, rollback: e.target.value })} className="h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
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
                  <button onClick={() => handleShadowTest(change.id)} className="p-1.5 rounded hover:bg-blue-500/10 text-muted-foreground hover:text-blue-400" title="Shadow Test"><Eye className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleApprove(change.id)} className="p-1.5 rounded hover:bg-green-500/10 text-muted-foreground hover:text-green-400" title="Aprovar"><CheckCircle2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleReject(change.id)} className="p-1.5 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400" title="Rejeitar"><XCircle className="w-3.5 h-3.5" /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
