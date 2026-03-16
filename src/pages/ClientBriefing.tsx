import { useState } from "react";
import {
  FileText, Send, Globe, Instagram, Facebook, Mail, Phone, Building2,
  Target, DollarSign, Zap, CheckCircle2, Copy, ExternalLink, Sparkles,
  MessageSquare, BarChart3, Users, Clock, Link2, ArrowRight, Eye, Bot
} from "lucide-react";
import { toast } from "sonner";

interface BriefingResponse {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  instagram: string;
  niche: string;
  currentRevenue: string;
  targetRevenue: string;
  mainGoal: string;
  services: string[];
  budget: string;
  urgency: string;
  competitors: string;
  challenges: string;
  additionalInfo: string;
  submittedAt: string;
  status: "new" | "analyzed" | "proposal_sent" | "approved" | "rejected";
  aiAnalysis?: AIAnalysis;
}

interface AIAnalysis {
  score: number;
  niche_analysis: string;
  recommended_services: string[];
  estimated_roi: string;
  estimated_fee: number;
  estimated_verba: number;
  strategy_summary: string;
  risk_level: "low" | "medium" | "high";
  priority: "low" | "medium" | "high" | "urgent";
  conversion_probability: number;
}

const SERVICE_OPTIONS = [
  "Gestão de Tráfego (Meta Ads)", "Gestão de Tráfego (Google Ads)", "Gestão de Tráfego (TikTok Ads)",
  "Automação Completa (n8n/Make)", "Assistente IA WhatsApp", "Chatbot Instagram",
  "Copywriting & Funis", "SEO & Google Meu Negócio", "Gestão de Redes Sociais",
  "Email Marketing", "Produção de Conteúdo", "Desenvolvimento Web",
  "Plataforma de Afiliados", "Consultoria Estratégica",
];

const BUDGET_RANGES = [
  "R$ 1.000 - R$ 3.000/mês", "R$ 3.000 - R$ 5.000/mês", "R$ 5.000 - R$ 10.000/mês",
  "R$ 10.000 - R$ 20.000/mês", "R$ 20.000+/mês", "A definir",
];

const GOALS = [
  "Gerar mais leads qualificados", "Aumentar vendas online", "Fortalecer presença digital",
  "Automatizar atendimento", "Escalar operação existente", "Lançar produto/serviço novo",
  "Melhorar ranking Google", "Reduzir custo de aquisição",
];

const demoBriefings: BriefingResponse[] = [
  {
    id: "1", clientName: "Tech Solutions Ltda", email: "contato@techsolutions.com",
    phone: "(11) 99999-1234", company: "Tech Solutions", website: "https://techsolutions.com.br",
    instagram: "@techsolutions", niche: "Tecnologia / SaaS", currentRevenue: "R$ 50.000/mês",
    targetRevenue: "R$ 150.000/mês", mainGoal: "Escalar operação existente",
    services: ["Gestão de Tráfego (Meta Ads)", "Automação Completa (n8n/Make)", "Assistente IA WhatsApp"],
    budget: "R$ 5.000 - R$ 10.000/mês", urgency: "high",
    competitors: "CompTech, SaaSBR, CloudPro", challenges: "CPA alto, baixa retenção de leads",
    additionalInfo: "Já temos campanhas rodando mas ROAS está baixo (1.2x)",
    submittedAt: "2026-03-15T14:30:00Z", status: "analyzed",
    aiAnalysis: {
      score: 92, niche_analysis: "Mercado SaaS em expansão no Brasil (+45% YoY). Cliente já possui base digital madura. Oportunidade de otimização é alta — ROAS pode subir de 1.2x para 4x+ com estratégia correta.",
      recommended_services: ["Gestão de Tráfego (Meta Ads)", "Automação Completa (n8n/Make)", "Assistente IA WhatsApp", "Copywriting & Funis"],
      estimated_roi: "300-400% em 90 dias", estimated_fee: 7500, estimated_verba: 8000,
      strategy_summary: "1) Reestruturar campanhas Meta com lookalike 2% baseado em compradores. 2) Implementar automação de nutrição via WhatsApp com IA. 3) Criar funil de vendas com copy otimizada. 4) Setup de retargeting dinâmico.",
      risk_level: "low", priority: "urgent", conversion_probability: 87,
    },
  },
  {
    id: "2", clientName: "Bella Estética", email: "bella@estetica.com",
    phone: "(21) 98888-5678", company: "Bella Estética", website: "",
    instagram: "@bellaestetica", niche: "Estética / Beleza", currentRevenue: "R$ 15.000/mês",
    targetRevenue: "R$ 40.000/mês", mainGoal: "Gerar mais leads qualificados",
    services: ["Gestão de Tráfego (Meta Ads)", "SEO & Google Meu Negócio"],
    budget: "R$ 3.000 - R$ 5.000/mês", urgency: "medium",
    competitors: "ClínicaTop, EsteticaPro", challenges: "Pouca presença online, depende de indicação",
    additionalInfo: "Quer começar do zero no digital",
    submittedAt: "2026-03-14T10:00:00Z", status: "new",
  },
  {
    id: "3", clientName: "Imobiliária Central", email: "central@imob.com",
    phone: "(31) 97777-4321", company: "Imobiliária Central", website: "https://imobcentral.com.br",
    instagram: "@imobcentral", niche: "Imobiliário", currentRevenue: "R$ 80.000/mês",
    targetRevenue: "R$ 200.000/mês", mainGoal: "Aumentar vendas online",
    services: ["Gestão de Tráfego (Google Ads)", "Automação Completa (n8n/Make)", "Chatbot Instagram"],
    budget: "R$ 10.000 - R$ 20.000/mês", urgency: "high",
    competitors: "ZAP Imóveis, QuintoAndar", challenges: "Leads frios, ciclo de venda longo",
    additionalInfo: "Tem equipe comercial de 8 pessoas",
    submittedAt: "2026-03-13T16:00:00Z", status: "proposal_sent",
    aiAnalysis: {
      score: 88, niche_analysis: "Mercado imobiliário digital em crescimento. Potencial para automação de qualificação de leads e redução do ciclo de vendas.",
      recommended_services: ["Gestão de Tráfego (Google Ads)", "Automação Completa (n8n/Make)", "Chatbot Instagram", "Assistente IA WhatsApp"],
      estimated_roi: "200-350% em 120 dias", estimated_fee: 12000, estimated_verba: 15000,
      strategy_summary: "1) Google Ads com campanhas de intenção alta. 2) Chatbot IA para qualificação instantânea. 3) Automação CRM com score de leads. 4) Nurturing via WhatsApp automatizado.",
      risk_level: "medium", priority: "high", conversion_probability: 78,
    },
  },
];

export default function ClientBriefing() {
  const [briefings, setBriefings] = useState<BriefingResponse[]>(demoBriefings);
  const [selectedBriefing, setSelectedBriefing] = useState<BriefingResponse | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [confirmPayment, setConfirmPayment] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "form">("list");

  const handleAnalyze = (briefing: BriefingResponse) => {
    setAnalyzing(briefing.id);
    setTimeout(() => {
      const analysis: AIAnalysis = {
        score: Math.floor(Math.random() * 20) + 75,
        niche_analysis: `Análise profunda do nicho "${briefing.niche}": Mercado em expansão com demanda crescente por soluções digitais. O cliente possui potencial de crescimento de ${briefing.targetRevenue} com as estratégias corretas de marketing digital e automação.`,
        recommended_services: briefing.services,
        estimated_roi: `${Math.floor(Math.random() * 200) + 150}% em 90 dias`,
        estimated_fee: Math.ceil(parseInt(briefing.budget.replace(/\D/g, "").slice(0, 5)) * 0.8 / 100) * 100,
        estimated_verba: Math.ceil(parseInt(briefing.budget.replace(/\D/g, "").slice(0, 5)) * 1.2 / 100) * 100,
        strategy_summary: `1) Implementar ${briefing.services[0]} com foco em ${briefing.mainGoal}. 2) Automação de processos para eficiência operacional. 3) Análise contínua de métricas com otimização semanal. 4) Relatórios detalhados para acompanhamento do ROI.`,
        risk_level: briefing.urgency === "high" ? "low" : "medium",
        priority: briefing.urgency === "high" ? "urgent" : "high",
        conversion_probability: Math.floor(Math.random() * 25) + 65,
      };
      setBriefings(prev => prev.map(b => b.id === briefing.id ? { ...b, status: "analyzed", aiAnalysis: analysis } : b));
      setAnalyzing(null);
      toast.success("Análise IA concluída — Proposta gerada automaticamente!");
    }, 3000);
  };

  const handleConfirmPayment = (id: string) => {
    setBriefings(prev => prev.map(b => b.id === id ? { ...b, status: "approved" } : b));
    setConfirmPayment(null);
    toast.success("Pagamento confirmado — IA iniciando execução automática dos serviços!");
  };

  const handleSendProposal = (briefing: BriefingResponse) => {
    setBriefings(prev => prev.map(b => b.id === briefing.id ? { ...b, status: "proposal_sent" } : b));
    const text = `📋 *PROPOSTA COMERCIAL*\n\n👤 Cliente: ${briefing.clientName}\n📊 Score: ${briefing.aiAnalysis?.score}/100\n💰 Fee: R$ ${briefing.aiAnalysis?.estimated_fee?.toLocaleString("pt-BR")}/mês\n📈 ROI Estimado: ${briefing.aiAnalysis?.estimated_roi}\n\n🎯 Estratégia:\n${briefing.aiAnalysis?.strategy_summary}\n\n✅ Serviços inclusos:\n${briefing.aiAnalysis?.recommended_services?.map(s => `• ${s}`).join("\n")}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    toast.success("Proposta enviada via WhatsApp!");
  };

  const copyFormLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/briefing`);
    toast.success("Link do formulário copiado!");
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    new: { label: "Novo", color: "bg-accent/10 text-accent" },
    analyzed: { label: "Analisado", color: "bg-primary/10 text-primary" },
    proposal_sent: { label: "Proposta Enviada", color: "bg-blue-500/10 text-blue-400" },
    approved: { label: "Aprovado ✓", color: "bg-green-500/10 text-green-400" },
    rejected: { label: "Rejeitado", color: "bg-destructive/10 text-destructive" },
  };

  const riskColor = (r: string) => r === "low" ? "text-green-400" : r === "medium" ? "text-amber-400" : "text-destructive";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Briefing & Intake Inteligente
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            IA analisa formulários de clientes, gera propostas automáticas e inicia serviços após confirmação de pagamento.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={copyFormLink} className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-all">
            <Copy className="w-3.5 h-3.5" /> Copiar Link
          </button>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90">
            <ExternalLink className="w-3.5 h-3.5" /> Preview Formulário
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total Briefings", value: briefings.length, icon: FileText, color: "text-foreground" },
          { label: "Novos", value: briefings.filter(b => b.status === "new").length, icon: Sparkles, color: "text-accent" },
          { label: "Analisados", value: briefings.filter(b => b.status === "analyzed").length, icon: Bot, color: "text-primary" },
          { label: "Propostas Enviadas", value: briefings.filter(b => b.status === "proposal_sent").length, icon: Send, color: "text-blue-400" },
          { label: "Aprovados", value: briefings.filter(b => b.status === "approved").length, icon: CheckCircle2, color: "text-green-400" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-3 text-center">
            <s.icon className={`w-4 h-4 mx-auto mb-1 ${s.color}`} />
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[9px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Form Preview */}
      {showForm && (
        <div className="rounded-xl border border-primary/30 bg-card p-6 space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-foreground">🚀 Formulário de Briefing</h3>
            <p className="text-xs text-muted-foreground">Este é o formulário que seus clientes vão preencher. Compartilhe via link, site ou redes sociais.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Nome Completo / Empresa *</label>
                <input disabled placeholder="Ex: João Silva - Tech Solutions" className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-muted-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Email *</label>
                  <input disabled placeholder="email@empresa.com" className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-muted-foreground" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">WhatsApp *</label>
                  <input disabled placeholder="(11) 99999-9999" className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-muted-foreground" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Site</label>
                  <input disabled placeholder="https://seusite.com.br" className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-muted-foreground" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Instagram</label>
                  <input disabled placeholder="@seuinstagram" className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-muted-foreground" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Nicho / Segmento *</label>
                <input disabled placeholder="Ex: E-commerce, Saúde, Educação..." className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Principal Objetivo *</label>
                <select disabled className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-muted-foreground">
                  <option>Selecione seu objetivo</option>
                  {GOALS.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Serviços de Interesse</label>
                <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto">
                  {SERVICE_OPTIONS.slice(0, 8).map(s => (
                    <div key={s} className="flex items-center gap-1.5 p-1.5 rounded bg-secondary/30 border border-border/50">
                      <div className="w-3 h-3 rounded border border-border" />
                      <span className="text-[9px] text-muted-foreground truncate">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Orçamento Mensal</label>
                <select disabled className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-muted-foreground">
                  {BUDGET_RANGES.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Desafios Atuais</label>
                <textarea disabled placeholder="Descreva seus principais desafios..." rows={2} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground resize-none" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Bot className="w-3 h-3 text-primary" /> IA analisa automaticamente ao receber
            </p>
            <button disabled className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium opacity-50">
              Enviar Briefing
            </button>
          </div>
        </div>
      )}

      {/* Briefings List */}
      <div className="space-y-3">
        {briefings.map(b => (
          <div key={b.id} className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/20 transition-all">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{b.clientName}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted-foreground">{b.niche}</span>
                      <span className="text-[10px] text-muted-foreground">•</span>
                      <span className="text-[10px] text-muted-foreground">{b.budget}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${statusConfig[b.status].color}`}>
                    {statusConfig[b.status].label}
                  </span>
                  <span className="text-[9px] text-muted-foreground">{new Date(b.submittedAt).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {b.services.map(s => (
                  <span key={s} className="text-[8px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{s}</span>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 text-[10px]">
                <div className="flex items-center gap-1 text-muted-foreground"><Mail className="w-3 h-3" /> {b.email}</div>
                <div className="flex items-center gap-1 text-muted-foreground"><Phone className="w-3 h-3" /> {b.phone}</div>
                {b.website && <div className="flex items-center gap-1 text-muted-foreground"><Globe className="w-3 h-3" /> {b.website.replace("https://", "")}</div>}
                {b.instagram && <div className="flex items-center gap-1 text-muted-foreground"><Instagram className="w-3 h-3" /> {b.instagram}</div>}
              </div>

              <div className="flex items-center gap-2">
                {b.status === "new" && (
                  <button onClick={() => handleAnalyze(b)} disabled={analyzing === b.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-[10px] font-medium hover:opacity-90 disabled:opacity-50">
                    {analyzing === b.id ? (
                      <><Zap className="w-3 h-3 animate-pulse" /> Analisando com IA...</>
                    ) : (
                      <><Bot className="w-3 h-3" /> Analisar com IA</>
                    )}
                  </button>
                )}
                {b.status === "analyzed" && (
                  <>
                    <button onClick={() => setSelectedBriefing(selectedBriefing?.id === b.id ? null : b)}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-primary/30 text-primary rounded-lg text-[10px] font-medium hover:bg-primary/10">
                      <Eye className="w-3 h-3" /> Ver Análise
                    </button>
                    <button onClick={() => handleSendProposal(b)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-[10px] font-medium hover:opacity-90">
                      <Send className="w-3 h-3" /> Enviar Proposta
                    </button>
                  </>
                )}
                {b.status === "proposal_sent" && (
                  <button onClick={() => setConfirmPayment(b.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-[10px] font-medium hover:opacity-90">
                    <DollarSign className="w-3 h-3" /> Confirmar Pagamento
                  </button>
                )}
                {b.status === "approved" && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg text-[10px] font-medium">
                    <Zap className="w-3 h-3 animate-pulse" /> IA Executando Serviços Automaticamente
                  </span>
                )}
                {b.aiAnalysis && (
                  <button onClick={() => setSelectedBriefing(selectedBriefing?.id === b.id ? null : b)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-muted-foreground rounded-lg text-[10px] hover:text-foreground">
                    <BarChart3 className="w-3 h-3" /> Detalhes
                  </button>
                )}
              </div>
            </div>

            {/* AI Analysis Expanded */}
            {selectedBriefing?.id === b.id && b.aiAnalysis && (
              <div className="border-t border-border p-4 bg-secondary/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                    <Bot className="w-4 h-4 text-primary animate-pulse" /> Análise IA Detalhada
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">Score: {b.aiAnalysis.score}/100</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full ${b.aiAnalysis.priority === "urgent" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"}`}>
                      {b.aiAnalysis.priority === "urgent" ? "🔥 Urgente" : "⚡ Alta"}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-card border border-border/50">
                  <p className="text-[10px] font-semibold text-foreground mb-1">📊 Análise do Nicho</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{b.aiAnalysis.niche_analysis}</p>
                </div>

                <div className="p-3 rounded-lg bg-card border border-border/50">
                  <p className="text-[10px] font-semibold text-foreground mb-1">🎯 Estratégia Recomendada</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{b.aiAnalysis.strategy_summary}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="p-2 rounded-lg bg-card border border-border/50 text-center">
                    <p className="text-sm font-bold text-primary">R$ {b.aiAnalysis.estimated_fee.toLocaleString("pt-BR")}</p>
                    <p className="text-[9px] text-muted-foreground">Fee Mensal</p>
                  </div>
                  <div className="p-2 rounded-lg bg-card border border-border/50 text-center">
                    <p className="text-sm font-bold text-foreground">R$ {b.aiAnalysis.estimated_verba.toLocaleString("pt-BR")}</p>
                    <p className="text-[9px] text-muted-foreground">Verba Sugerida</p>
                  </div>
                  <div className="p-2 rounded-lg bg-card border border-border/50 text-center">
                    <p className="text-sm font-bold text-green-400">{b.aiAnalysis.estimated_roi}</p>
                    <p className="text-[9px] text-muted-foreground">ROI Estimado</p>
                  </div>
                  <div className="p-2 rounded-lg bg-card border border-border/50 text-center">
                    <p className={`text-sm font-bold ${riskColor(b.aiAnalysis.risk_level)}`}>
                      {b.aiAnalysis.risk_level === "low" ? "Baixo" : b.aiAnalysis.risk_level === "medium" ? "Médio" : "Alto"}
                    </p>
                    <p className="text-[9px] text-muted-foreground">Risco</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-card border border-border/50">
                  <p className="text-[10px] font-semibold text-foreground mb-2">✅ Serviços Recomendados</p>
                  <div className="flex flex-wrap gap-1.5">
                    {b.aiAnalysis.recommended_services.map(s => (
                      <span key={s} className="text-[9px] px-2 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                  <Target className="w-4 h-4 text-green-400" />
                  <p className="text-[10px] text-green-400 font-semibold">Probabilidade de Conversão: {b.aiAnalysis.conversion_probability}%</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Confirm Payment Modal */}
      {confirmPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm space-y-4 text-center">
            <DollarSign className="w-12 h-12 text-primary mx-auto" />
            <h3 className="text-sm font-bold text-foreground">Confirmar Pagamento do Cliente?</h3>
            <p className="text-xs text-muted-foreground">Ao confirmar, o programa automaticamente inicia todos os serviços designados para este cliente.</p>
            <div className="flex gap-3 justify-center pt-2">
              <button onClick={() => setConfirmPayment(null)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancelar</button>
              <button onClick={() => handleConfirmPayment(confirmPayment)} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:opacity-90">
                ✓ Confirmar Pagamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
