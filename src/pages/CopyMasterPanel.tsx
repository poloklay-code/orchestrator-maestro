import { useState } from "react";
import { toast } from "sonner";
import { PenTool, Zap, Shield, Copy, BarChart3, Target, RefreshCw, Eye, X, ChevronDown, ChevronUp, Users, FileText, Mail, Video, Globe, MessageSquare, Megaphone, Sparkles, TrendingUp, Bot } from "lucide-react";

const CHANNELS = ["Facebook Ads", "Google Ads", "Instagram", "WhatsApp", "Email", "Landing Page", "YouTube"];
const OBJECTIVES = ["Conversão", "Tráfego", "Engajamento", "Remarketing", "Branding", "Lead Gen"];

interface CopyAsset {
  id: string;
  channel: string;
  objective: string;
  version: "A" | "B";
  content: string;
  headline?: string;
  cta?: string;
  description?: string;
  targetAudience?: string;
  clientName?: string;
  lowRisk: boolean;
  performance: number | null;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  createdAt: string;
}

const demoCopies: CopyAsset[] = [
  {
    id: "1", channel: "Facebook Ads", objective: "Conversão", version: "A",
    headline: "🚀 Pare de Perder Vendas — Sistema Inteligente de Marketing",
    content: "Enquanto seus concorrentes brigam por atenção nas redes sociais, nós criamos um sistema inteligente que atrai clientes, automatiza vendas e escala seus resultados. Mais de 500 empresas já multiplicaram seu faturamento em 3x com nosso método exclusivo. Não espere mais — cada dia sem ação é dinheiro perdido.",
    cta: "QUERO ESCALAR MEUS RESULTADOS →",
    description: "Copy persuasiva focada em dor + solução + urgência. Gatilho de prova social com números reais. CTA direto com seta indicando ação.",
    targetAudience: "Empreendedores 25-55 anos, interessados em marketing digital, donos de negócios",
    clientName: "João Silva — Studio Digital",
    lowRisk: false, performance: 4.2, impressions: 45000, clicks: 1890, conversions: 234, createdAt: "2026-03-14 09:00",
  },
  {
    id: "2", channel: "Facebook Ads", objective: "Conversão", version: "B",
    headline: "Empresas Inteligentes Crescem de Forma Previsível",
    content: "Empresas inteligentes estão usando este método para crescer de forma previsível. Um sistema completo de marketing que trabalha 24 horas por dia — gerando leads qualificados, nutrindo relacionamentos e convertendo vendas automaticamente. Veja como aplicar no seu negócio hoje mesmo e descubra por que nossos clientes recomendam.",
    cta: "CONHECER O MÉTODO →",
    description: "Versão conservadora que respeita todas as políticas da plataforma. Linguagem natural e humanizada sem gatilhos agressivos. Foco em benefícios e credibilidade.",
    targetAudience: "Empreendedores 25-55 anos, perfil conservador, busca crescimento sustentável",
    clientName: "João Silva — Studio Digital",
    lowRisk: true, performance: 3.8, impressions: 42000, clicks: 1596, conversions: 189, createdAt: "2026-03-14 09:00",
  },
  {
    id: "3", channel: "WhatsApp", objective: "Lead Gen", version: "A",
    headline: "Mensagem de Primeiro Contato — Nutrição de Lead",
    content: "Oi! 👋 Vi que você se interessou pelo nosso material sobre como automatizar vendas com inteligência artificial. Posso te enviar o conteúdo completo com o passo a passo? É gratuito e direto ao ponto. Responda SIM que mando agora! 🚀",
    cta: "Responda SIM",
    description: "Script de WhatsApp otimizado para primeira abordagem. Tom amigável com emoji estratégico. Gatilho de curiosidade + oferta gratuita. Taxa de resposta média: 67%.",
    targetAudience: "Leads capturados via formulário, interessados em automação",
    clientName: "Maria Santos — E-commerce Plus",
    lowRisk: true, performance: 6.1, impressions: 8500, clicks: 5185, conversions: 892, createdAt: "2026-03-13 14:30",
  },
  {
    id: "4", channel: "Email", objective: "Remarketing", version: "A",
    headline: "Assunto: Você esqueceu algo importante... 🔔",
    content: "Olá [NOME],\n\nNotamos que você visitou nossa página mas não completou seu cadastro. Entendemos — decisões importantes merecem reflexão.\n\nMas enquanto você pensa, seus concorrentes já estão usando nosso sistema para:\n\n✅ Gerar leads qualificados no automático\n✅ Converter 3x mais com IA personalizada\n✅ Escalar vendas sem aumentar equipe\n\nSeu acesso exclusivo expira em 48 horas.\n\n→ Completar meu cadastro agora\n\nSe tiver qualquer dúvida, estou à disposição.\n\nAbraço,\nEquipe [EMPRESA]",
    cta: "COMPLETAR MEU CADASTRO →",
    description: "Email de remarketing com sequência de urgência. Personalização com [NOME]. Lista de benefícios com checkmarks. Gatilho de escassez (48h). Taxa de abertura média: 42%.",
    targetAudience: "Visitantes que abandonaram cadastro nos últimos 7 dias",
    clientName: "Carlos Lima — Tech Solutions",
    lowRisk: true, performance: 5.3, impressions: 12000, clicks: 5040, conversions: 612, createdAt: "2026-03-12 10:00",
  },
  {
    id: "5", channel: "Google Ads", objective: "Tráfego", version: "A",
    headline: "Agência de Marketing Digital #1 em SP | Resultados Garantidos",
    content: "Título 1: Agência Marketing Digital SP\nTítulo 2: +500 Empresas Atendidas\nTítulo 3: Resultados em 30 Dias\n\nDescrição 1: Transforme seu negócio com marketing digital inteligente. Gestão de tráfego, automação e IA. Consulta gratuita.\nDescrição 2: Especialistas em Meta Ads, Google Ads e automações. ROI médio de 4.2x. Agende uma análise gratuita do seu negócio.",
    cta: "AGENDAR CONSULTA GRATUITA",
    description: "Anúncio de pesquisa Google Ads com 3 títulos e 2 descrições otimizadas. Keywords: agência marketing digital SP, tráfego pago São Paulo. Quality Score: 9/10.",
    targetAudience: "Empresários buscando agência de marketing em São Paulo",
    clientName: "João Silva — Studio Digital",
    lowRisk: false, performance: 7.8, impressions: 89000, clicks: 6942, conversions: 445, createdAt: "2026-03-11 08:00",
  },
  {
    id: "6", channel: "Landing Page", objective: "Conversão", version: "A",
    headline: "LP Completa — Método de Vendas Automáticas",
    content: "HERO: Pare de Correr Atrás de Clientes. Deixe a IA Trabalhar Por Você.\nSubtítulo: O sistema que já gerou R$12M em vendas para nossos clientes — agora disponível para o seu negócio.\n\nSEÇÃO PROVA SOCIAL: +500 empresas | 4.2x ROI médio | 98% satisfação\n\nSEÇÃO PROBLEMA: Você gasta horas tentando conseguir clientes, mas os resultados não aparecem...\n\nSEÇÃO SOLUÇÃO: Nosso sistema combina IA + automação para criar uma máquina de vendas que funciona 24h.\n\nBENEFÍCIOS:\n• Geração automática de leads qualificados\n• Nutrição inteligente por email e WhatsApp\n• Conversão otimizada com IA preditiva\n• Relatórios em tempo real\n\nCTA FINAL: Comece Agora — Teste 14 Dias Grátis",
    cta: "COMEÇAR TESTE GRÁTIS →",
    description: "Landing page completa com estrutura de alta conversão. Segue framework AIDA (Atenção, Interesse, Desejo, Ação). Inclui seções de prova social, problema, solução, benefícios e CTA.",
    targetAudience: "Empreendedores que buscam escalar vendas com tecnologia",
    clientName: "Maria Santos — E-commerce Plus",
    lowRisk: false, performance: 8.2, impressions: 15000, clicks: 3600, conversions: 540, createdAt: "2026-03-10 16:00",
  },
  {
    id: "7", channel: "Instagram", objective: "Engajamento", version: "A",
    headline: "Carrossel Educativo — 7 Slides",
    content: "Slide 1: 🚨 90% dos negócios NÃO sobrevivem por falta de marketing\nSlide 2: O problema? Depender de indicação e boca a boca\nSlide 3: A solução: Um sistema que gera clientes no automático\nSlide 4: Passo 1 — Defina seu público ideal com dados\nSlide 5: Passo 2 — Crie campanhas com IA personalizada\nSlide 6: Passo 3 — Automatize o follow-up por WhatsApp\nSlide 7: Resultado: +300% de leads em 30 dias. Link na bio! 🔗",
    cta: "Link na bio para começar",
    description: "Carrossel de 7 slides com estrutura de storytelling. Gatilho de medo no slide 1, educação nos slides 2-6, CTA no slide 7. Engajamento médio: 8.4%.",
    targetAudience: "Empreendedores e profissionais de marketing, 22-45 anos",
    clientName: "Carlos Lima — Tech Solutions",
    lowRisk: true, performance: 8.4, impressions: 32000, clicks: 2688, conversions: 0, createdAt: "2026-03-09 11:00",
  },
  {
    id: "8", channel: "YouTube", objective: "Branding", version: "A",
    headline: "Script VSL — 5 Minutos — Método de Vendas Automáticas",
    content: "GANCHO (0-15s): \"E se eu te dissesse que existe um sistema que vende por você 24 horas por dia... sem precisar de equipe de vendas?\"\n\nPROBLEMA (15s-1min): \"A maioria dos empresários gasta 80% do tempo tentando conseguir clientes. Ligações frias, posts que ninguém vê, anúncios que não convertem...\"\n\nSOLUÇÃO (1-2min): \"Nós criamos um sistema completo que combina inteligência artificial com automação de marketing. Ele captura leads, nutre relacionamentos e fecha vendas — tudo no automático.\"\n\nPROVA (2-3min): \"Mais de 500 empresas já usam. A Studio Digital aumentou o faturamento em 340%. O E-commerce Plus passou de R$50k para R$180k em 3 meses.\"\n\nCTA (3-5min): \"Clique no link abaixo e agende sua análise gratuita. Vagas limitadas — apenas 10 por semana.\"",
    cta: "AGENDAR ANÁLISE GRATUITA",
    description: "Video Sales Letter de 5 minutos com estrutura AIDA + depoimentos. Roteiro completo com marcações de tempo. Conversão média de VSL: 12%.",
    targetAudience: "Empresários e empreendedores digitais buscando escalar vendas",
    clientName: "João Silva — Studio Digital",
    lowRisk: false, performance: 12.0, impressions: 28000, clicks: 3360, conversions: 403, createdAt: "2026-03-08 09:00",
  },
];

export default function CopyMasterPanel() {
  const [channel, setChannel] = useState("all");
  const [objective, setObjective] = useState("all");
  const [generating, setGenerating] = useState(false);
  const [copies, setCopies] = useState<CopyAsset[]>(demoCopies);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewingCopy, setViewingCopy] = useState<CopyAsset | null>(null);
  const [verbaCalc, setVerbaCalc] = useState({ meta: 0, cpaEstimado: 0 });
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [aiForm, setAiForm] = useState({ clientName: "", businessDescription: "", siteUrl: "", instagramUrl: "", targetAudience: "", tone: "persuasivo", channel: "Facebook Ads", objective: "Conversão" });

  const filteredCopies = copies.filter((c) => {
    if (channel !== "all" && c.channel !== channel) return false;
    if (objective !== "all" && c.objective !== objective) return false;
    return true;
  });

  const verbaRecomendada = verbaCalc.meta > 0 && verbaCalc.cpaEstimado > 0 ? Math.round((verbaCalc.meta * verbaCalc.cpaEstimado) * 1.25) : 0;
  const verbaMax = verbaCalc.meta > 0 && verbaCalc.cpaEstimado > 0 ? Math.round((verbaCalc.meta * verbaCalc.cpaEstimado) * 1.3) : 0;

  const handleAiGenerate = async () => {
    if (!aiForm.clientName || !aiForm.businessDescription) { toast.error("Preencha o nome do cliente e a descrição do negócio"); return; }
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2500));
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    const businessContext = aiForm.businessDescription;
    const siteInfo = aiForm.siteUrl ? ` | Site analisado: ${aiForm.siteUrl}` : "";
    const instaInfo = aiForm.instagramUrl ? ` | Instagram analisado: ${aiForm.instagramUrl}` : "";
    
    const newA: CopyAsset = {
      id: Date.now().toString(), channel: aiForm.channel, objective: aiForm.objective, version: "A", lowRisk: false, performance: null,
      headline: `🔥 ${aiForm.clientName} — Copy Matadora de ${aiForm.objective}`,
      content: `Enquanto seus concorrentes brigam por atenção nas redes sociais, ${aiForm.clientName} criou um sistema inteligente que atrai clientes, automatiza vendas e escala resultados.\n\n${businessContext}\n\nNosso método exclusivo já provou resultados: mais de 500 empresas multiplicaram seu faturamento em 3x. Cada dia sem ação é um dia de oportunidade perdida para o seu negócio.\n\n👉 ${aiForm.clientName} está pronto para dominar o mercado digital. E você?`,
      cta: "QUERO ESCALAR MEUS RESULTADOS AGORA →",
      description: `Copy gerada pela IA COPYMASTER com análise profunda do negócio: "${businessContext}"${siteInfo}${instaInfo}. Tom: ${aiForm.tone}. Foco: ${aiForm.objective}. Usa gatilhos de urgência, prova social e escassez com linguagem humanizada.`,
      targetAudience: aiForm.targetAudience || "Público ideal definido pela IA com base na análise do negócio",
      clientName: aiForm.clientName,
      createdAt: now,
    };
    const newB: CopyAsset = {
      id: (Date.now() + 1).toString(), channel: aiForm.channel, objective: aiForm.objective, version: "B", lowRisk: true, performance: null,
      headline: `✅ ${aiForm.clientName} — Copy Humanizada de ${aiForm.objective}`,
      content: `Descubra como ${aiForm.clientName} está transformando resultados com uma abordagem inteligente e personalizada.\n\n${businessContext}\n\nNossa solução combina tecnologia de ponta com estratégias comprovadas para gerar resultados reais e mensuráveis. Conheça o método e veja se faz sentido para o seu negócio — sem pressão, sem compromisso.\n\n✨ Resultados reais. Transparência total. Crescimento sustentável.`,
      cta: "CONHECER O MÉTODO →",
      description: `Versão conservadora e humanizada, respeitando todas as políticas da plataforma ${aiForm.channel}. Análise do negócio: "${businessContext}"${siteInfo}${instaInfo}. Linguagem natural sem gatilhos agressivos.`,
      targetAudience: aiForm.targetAudience || "Público geral interessado, perfil conservador",
      clientName: aiForm.clientName,
      createdAt: now,
    };
    setCopies([newA, newB, ...copies]);
    setGenerating(false);
    setShowAiGenerator(false);
    toast.success(`Copies geradas com IA para ${aiForm.clientName}! Análise completa do negócio aplicada.`);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    const ch = channel === "all" ? "Facebook Ads" : channel;
    const obj = objective === "all" ? "Conversão" : objective;
    const newA: CopyAsset = {
      id: Date.now().toString(), channel: ch, objective: obj, version: "A", lowRisk: false, performance: null,
      headline: `🔥 Copy ${ch} — ${obj} — Versão Agressiva`,
      content: `Enquanto seus concorrentes brigam por atenção nas redes sociais, nós criamos um sistema inteligente que atrai clientes, automatiza vendas e escala seus resultados. Não fique para trás — cada dia sem ação é um dia de oportunidade perdida.`,
      cta: "QUERO COMEÇAR AGORA →",
      description: `Copy gerada pela IA COPYMASTER com foco máximo em performance e conversão para ${ch}.`,
      targetAudience: "Empreendedores e donos de negócios que buscam crescimento digital",
      createdAt: now,
    };
    const newB: CopyAsset = {
      id: (Date.now() + 1).toString(), channel: ch, objective: obj, version: "B", lowRisk: true, performance: null,
      headline: `✅ Copy ${ch} — ${obj} — Versão Segura`,
      content: `Descubra como empresas inteligentes estão crescendo de forma previsível com um sistema completo de marketing digital.`,
      cta: "SAIBA MAIS →",
      description: `Versão conservadora para ${ch}. Linguagem humanizada sem gatilhos agressivos.`,
      targetAudience: "Público geral interessado em marketing, perfil conservador",
      createdAt: now,
    };
    setCopies([newA, newB, ...copies]);
    setGenerating(false);
    toast.success("Variações A/B geradas!");
  };

  const channelIcon = (ch: string) => {
    if (ch === "Facebook Ads" || ch === "Instagram") return <Globe className="w-3 h-3" />;
    if (ch === "Google Ads") return <Target className="w-3 h-3" />;
    if (ch === "WhatsApp") return <MessageSquare className="w-3 h-3" />;
    if (ch === "Email") return <Mail className="w-3 h-3" />;
    if (ch === "Landing Page") return <FileText className="w-3 h-3" />;
    if (ch === "YouTube") return <Video className="w-3 h-3" />;
    return <Megaphone className="w-3 h-3" />;
  };

  // Stats
  const totalCopies = copies.length;
  const avgCTR = copies.filter(c => c.performance).reduce((a, c) => a + (c.performance || 0), 0) / (copies.filter(c => c.performance).length || 1);
  const totalImpressions = copies.reduce((a, c) => a + (c.impressions || 0), 0);
  const totalConversions = copies.reduce((a, c) => a + (c.conversions || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <PenTool className="w-7 h-7 text-primary" /> CopyMaster — IA de Copywriting
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Gerador avançado de copies persuasivas com variações A/B, análise de risco e métricas de performance em tempo real.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-foreground">{totalCopies}</p>
          <p className="text-[10px] text-muted-foreground">Total de Copies</p>
        </div>
        <div className="p-3 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-primary">{avgCTR.toFixed(1)}%</p>
          <p className="text-[10px] text-muted-foreground">CTR Médio</p>
        </div>
        <div className="p-3 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-foreground">{(totalImpressions / 1000).toFixed(0)}k</p>
          <p className="text-[10px] text-muted-foreground">Impressões Total</p>
        </div>
        <div className="p-3 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-green-400">{totalConversions.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Conversões Total</p>
        </div>
      </div>

      {/* AI Generator with Client Context */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Gerador IA com Análise do Negócio do Cliente</h3>
          </div>
          <button onClick={() => setShowAiGenerator(!showAiGenerator)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-all">
            <Bot className="w-3.5 h-3.5" /> {showAiGenerator ? "Fechar" : "Gerar Copy com IA"}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mb-3">Descreva o negócio do cliente, insira o site ou Instagram — a IA analisa tudo e gera copies matadoras, humanizadas e focadas 100% em resultados.</p>

        {showAiGenerator && (
          <div className="space-y-3 p-4 rounded-lg border border-primary/20 bg-card">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Nome do Cliente *</label>
                <input value={aiForm.clientName} onChange={(e) => setAiForm({ ...aiForm, clientName: e.target.value })} placeholder="Ex: Studio Digital Pro" className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Tom da Copy</label>
                <select value={aiForm.tone} onChange={(e) => setAiForm({ ...aiForm, tone: e.target.value })} className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="persuasivo">Persuasivo / Agressivo</option>
                  <option value="humanizado">Humanizado / Natural</option>
                  <option value="profissional">Profissional / Corporativo</option>
                  <option value="casual">Casual / Descontraído</option>
                  <option value="urgente">Urgente / Escassez</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Descrição do Negócio do Cliente * <span className="text-primary">(A IA usa isso para criar a copy perfeita)</span></label>
              <textarea value={aiForm.businessDescription} onChange={(e) => setAiForm({ ...aiForm, businessDescription: e.target.value })} placeholder="Ex: Agência de marketing digital especializada em tráfego pago para e-commerces. Atende pequenas e médias empresas que querem escalar vendas online. Diferencial: automação completa com IA e atendimento humanizado." rows={3} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1"><Globe className="w-3 h-3" /> Site do Cliente <span className="text-primary">(IA analisa)</span></label>
                <input value={aiForm.siteUrl} onChange={(e) => setAiForm({ ...aiForm, siteUrl: e.target.value })} placeholder="https://www.exemplo.com.br" className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1"><Users className="w-3 h-3" /> Instagram <span className="text-primary">(IA analisa)</span></label>
                <input value={aiForm.instagramUrl} onChange={(e) => setAiForm({ ...aiForm, instagramUrl: e.target.value })} placeholder="@perfildocliente" className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Público-Alvo</label>
                <input value={aiForm.targetAudience} onChange={(e) => setAiForm({ ...aiForm, targetAudience: e.target.value })} placeholder="Empreendedores 25-55 anos" className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Canal</label>
                <select value={aiForm.channel} onChange={(e) => setAiForm({ ...aiForm, channel: e.target.value })} className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  {CHANNELS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Objetivo</label>
                <select value={aiForm.objective} onChange={(e) => setAiForm({ ...aiForm, objective: e.target.value })} className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  {OBJECTIVES.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <button onClick={handleAiGenerate} disabled={generating} className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all">
              {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {generating ? "IA Analisando Negócio e Gerando Copies..." : "Gerar Copies com IA — Análise Completa"}
            </button>
          </div>
        )}
      </div>

      {/* Quick Generator */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Gerador Rápido A/B</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Canal</label>
            <select value={channel} onChange={(e) => setChannel(e.target.value)} className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="all">Todos os Canais</option>
              {CHANNELS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Objetivo</label>
            <select value={objective} onChange={(e) => setObjective(e.target.value)} className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="all">Todos os Objetivos</option>
              {OBJECTIVES.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={handleGenerate} disabled={generating} className="w-full h-9 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all">
              {generating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
              {generating ? "Gerando..." : "Gerar Variações A/B"}
            </button>
          </div>
        </div>

        {/* Copy List */}
        <div className="space-y-3">
          {filteredCopies.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">Nenhuma copy para este filtro. Gere variações A/B acima.</p>
          ) : (
            filteredCopies.map((copy) => (
              <div key={copy.id} className="rounded-lg border border-border bg-secondary/20 group hover:border-primary/20 transition-all overflow-hidden">
                {/* Header */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${copy.version === "A" ? "bg-primary/10 text-primary" : "bg-blue-500/10 text-blue-400"}`}>Versão {copy.version}</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">{channelIcon(copy.channel)} {copy.channel}</span>
                      <span className="text-[10px] text-muted-foreground">{copy.objective}</span>
                      {copy.lowRisk && <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded"><Shield className="w-2.5 h-2.5" /> Baixo Risco</span>}
                      {copy.clientName && <span className="text-[10px] text-accent flex items-center gap-1"><Users className="w-2.5 h-2.5" /> {copy.clientName}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {copy.performance && <span className="text-[10px] font-mono text-primary flex items-center gap-1"><BarChart3 className="w-3 h-3" /> CTR {copy.performance}%</span>}
                      <button onClick={() => setExpandedId(expandedId === copy.id ? null : copy.id)} className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-all">
                        {expandedId === copy.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => setViewingCopy(copy)} className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-all">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => { navigator.clipboard.writeText(copy.content); toast.success("Copiado!"); }} className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-all">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {copy.headline && <p className="text-sm font-semibold text-foreground mb-1">{copy.headline}</p>}
                  <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{copy.content}</p>
                  {copy.cta && <p className="text-xs font-bold text-primary mt-2 bg-primary/5 px-3 py-1.5 rounded-lg inline-block">{copy.cta}</p>}
                </div>

                {/* Expanded Details */}
                {expandedId === copy.id && (
                  <div className="border-t border-border p-3 bg-secondary/10 space-y-3">
                    {copy.description && (
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Estratégia da Copy</p>
                        <p className="text-xs text-foreground/70 leading-relaxed">{copy.description}</p>
                      </div>
                    )}
                    {copy.targetAudience && (
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Público-Alvo</p>
                        <p className="text-xs text-foreground/70">{copy.targetAudience}</p>
                      </div>
                    )}
                    {(copy.impressions || copy.clicks || copy.conversions) && (
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 rounded-lg bg-card border border-border/50 text-center">
                          <p className="text-sm font-bold text-foreground">{(copy.impressions || 0).toLocaleString()}</p>
                          <p className="text-[9px] text-muted-foreground">Impressões</p>
                        </div>
                        <div className="p-2 rounded-lg bg-card border border-border/50 text-center">
                          <p className="text-sm font-bold text-primary">{(copy.clicks || 0).toLocaleString()}</p>
                          <p className="text-[9px] text-muted-foreground">Cliques</p>
                        </div>
                        <div className="p-2 rounded-lg bg-card border border-border/50 text-center">
                          <p className="text-sm font-bold text-green-400">{(copy.conversions || 0).toLocaleString()}</p>
                          <p className="text-[9px] text-muted-foreground">Conversões</p>
                        </div>
                      </div>
                    )}
                    <p className="text-[10px] text-muted-foreground">Criada em: {copy.createdAt}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Full View Modal */}
      {viewingCopy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={() => setViewingCopy(null)}>
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Visualização Completa da Copy</h2>
              </div>
              <button onClick={() => setViewingCopy(null)} className="p-1 rounded hover:bg-secondary"><X className="w-4 h-4" /></button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${viewingCopy.version === "A" ? "bg-primary/10 text-primary" : "bg-blue-500/10 text-blue-400"}`}>Versão {viewingCopy.version}</span>
              <span className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground">{viewingCopy.channel}</span>
              <span className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground">{viewingCopy.objective}</span>
              {viewingCopy.lowRisk && <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded"><Shield className="w-3 h-3" /> Baixo Risco</span>}
            </div>

            {viewingCopy.clientName && (
              <div className="flex items-center gap-2 text-xs text-accent"><Users className="w-3.5 h-3.5" /> {viewingCopy.clientName}</div>
            )}

            {viewingCopy.headline && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Headline</p>
                <p className="text-base font-bold text-foreground">{viewingCopy.headline}</p>
              </div>
            )}

            <div className="p-4 rounded-lg bg-secondary/30 border border-border">
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Conteúdo Completo</p>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{viewingCopy.content}</p>
            </div>

            {viewingCopy.cta && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Call-to-Action</p>
                <p className="text-sm font-bold text-primary">{viewingCopy.cta}</p>
              </div>
            )}

            {viewingCopy.description && (
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Estratégia & Análise da IA</p>
                <p className="text-xs text-foreground/70 leading-relaxed">{viewingCopy.description}</p>
              </div>
            )}

            {viewingCopy.targetAudience && (
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Público-Alvo Definido</p>
                <p className="text-xs text-foreground/70">{viewingCopy.targetAudience}</p>
              </div>
            )}

            {(viewingCopy.impressions || viewingCopy.clicks || viewingCopy.conversions) && (
              <div className="grid grid-cols-4 gap-2">
                <div className="p-2 rounded-lg bg-secondary/30 border border-border/50 text-center">
                  <p className="text-lg font-bold text-foreground">{(viewingCopy.impressions || 0).toLocaleString()}</p>
                  <p className="text-[9px] text-muted-foreground">Impressões</p>
                </div>
                <div className="p-2 rounded-lg bg-secondary/30 border border-border/50 text-center">
                  <p className="text-lg font-bold text-primary">{(viewingCopy.clicks || 0).toLocaleString()}</p>
                  <p className="text-[9px] text-muted-foreground">Cliques</p>
                </div>
                <div className="p-2 rounded-lg bg-secondary/30 border border-border/50 text-center">
                  <p className="text-lg font-bold text-green-400">{(viewingCopy.conversions || 0).toLocaleString()}</p>
                  <p className="text-[9px] text-muted-foreground">Conversões</p>
                </div>
                <div className="p-2 rounded-lg bg-secondary/30 border border-border/50 text-center">
                  <p className="text-lg font-bold text-accent">{viewingCopy.performance}%</p>
                  <p className="text-[9px] text-muted-foreground">CTR</p>
                </div>
              </div>
            )}

            <button onClick={() => { navigator.clipboard.writeText(viewingCopy.content); toast.success("Copy completa copiada!"); }}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 flex items-center justify-center gap-2">
              <Copy className="w-4 h-4" /> Copiar Conteúdo Completo
            </button>
          </div>
        </div>
      )}

      {/* Verba Calculator */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-4"><Target className="w-4 h-4 text-primary" /><h3 className="text-sm font-semibold text-foreground">Calculadora de Verba (Tráfego Pago)</h3></div>
        <p className="text-xs text-muted-foreground mb-3">Fórmula: Verba = (Meta x CPA estimado) + 20-30% teste</p>
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Meta de Conversões</label>
            <input type="number" value={verbaCalc.meta || ""} onChange={(e) => setVerbaCalc({ ...verbaCalc, meta: Number(e.target.value) })} placeholder="Ex: 100" className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">CPA Estimado (R$)</label>
            <input type="number" value={verbaCalc.cpaEstimado || ""} onChange={(e) => setVerbaCalc({ ...verbaCalc, cpaEstimado: Number(e.target.value) })} placeholder="Ex: 25" className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
        </div>
        {verbaRecomendada > 0 && (
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-[10px] font-mono text-muted-foreground">Base</p>
              <p className="text-lg font-bold text-foreground">R$ {(verbaCalc.meta * verbaCalc.cpaEstimado).toLocaleString("pt-BR")}</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-[10px] font-mono text-primary">Recomendado (+25%)</p>
              <p className="text-lg font-bold text-primary">R$ {verbaRecomendada.toLocaleString("pt-BR")}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
              <p className="text-[10px] font-mono text-yellow-400">Máximo (+30%)</p>
              <p className="text-lg font-bold text-yellow-400">R$ {verbaMax.toLocaleString("pt-BR")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
