import { useState } from "react";
import {
  Bot, MessageSquare, Send, Mic, MicOff, DollarSign, TrendingUp,
  Users, Target, Zap, Crown, Phone, Globe, Instagram, Star,
  ArrowUpRight, Activity, Volume2, Settings, BarChart3, CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

interface SalesConversation {
  id: string;
  leadName: string;
  channel: string;
  status: "active" | "won" | "lost" | "follow_up";
  messages: number;
  value: number;
  startedAt: string;
  lastMessage: string;
  score: number;
}

const demoConversations: SalesConversation[] = [
  { id: "1", leadName: "Pedro Mendes", channel: "WhatsApp", status: "active", messages: 12, value: 5000, startedAt: "2026-03-15T10:00:00Z", lastMessage: "Tem interesse no pacote de tráfego?", score: 88 },
  { id: "2", leadName: "Ana Costa", channel: "Instagram", status: "won", messages: 28, value: 8500, startedAt: "2026-03-12T14:00:00Z", lastMessage: "Contrato assinado! Bem-vinda 🎉", score: 95 },
  { id: "3", leadName: "Ricardo Alves", channel: "WhatsApp", status: "follow_up", messages: 8, value: 3000, startedAt: "2026-03-14T09:00:00Z", lastMessage: "Vou analisar a proposta e retorno amanhã", score: 72 },
  { id: "4", leadName: "Camila Ferreira", channel: "Site Chat", status: "active", messages: 5, value: 12000, startedAt: "2026-03-15T13:00:00Z", lastMessage: "Quero saber mais sobre automação completa", score: 82 },
  { id: "5", leadName: "Marcos Oliveira", channel: "WhatsApp", status: "lost", messages: 15, value: 0, startedAt: "2026-03-10T11:00:00Z", lastMessage: "Orçamento não comporta no momento", score: 35 },
];

const chatMessages = [
  { role: "system", content: "🤖 Agente de Vendas IA ativado — Modo persuasão humanizada" },
  { role: "lead", content: "Oi, vi o anúncio de vocês sobre gestão de tráfego. Quanto custa?" },
  { role: "agent", content: "Olá! 😊 Que bom que nos encontrou! Antes de falar sobre valores, me conta: qual é o seu negócio e qual resultado você gostaria de alcançar? Assim posso te mostrar exatamente como podemos te ajudar a chegar lá! 🎯" },
  { role: "lead", content: "Tenho uma loja de roupas online, quero vender mais" },
  { role: "agent", content: "Perfeito! E-commerce de moda é um dos nossos nichos mais fortes 💪\n\nTemos clientes no mesmo segmento que saíram de R$30k/mês para R$120k/mês em 90 dias.\n\nO que fizemos:\n✅ Campanhas Meta Ads otimizadas com IA\n✅ Retargeting dinâmico\n✅ Automação WhatsApp para carrinho abandonado\n\nQual seu faturamento atual? Assim monto uma projeção personalizada pra você 📊" },
  { role: "lead", content: "Faturo uns R$25k por mês" },
  { role: "agent", content: "Excelente base! Com R$25k/mês você tem uma operação que já valida o produto.\n\n📈 *Projeção IA para seu negócio:*\n• Mês 1: R$35-40k (otimização + setup)\n• Mês 2: R$50-60k (escala controlada)\n• Mês 3: R$70-90k (escala agressiva)\n\n💰 Investimento: R$3.500/mês de gestão + verba de anúncios\n📊 ROI médio: 3.5x a 5x\n\nPosso te enviar uma proposta detalhada com a estratégia completa? 🚀" },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof Star }> = {
  active: { label: "Em Atendimento", color: "bg-green-500/10 text-green-400", icon: Activity },
  won: { label: "Fechado ✓", color: "bg-primary/10 text-primary", icon: Crown },
  lost: { label: "Perdido", color: "bg-destructive/10 text-destructive", icon: Target },
  follow_up: { label: "Follow-up", color: "bg-amber-500/10 text-amber-400", icon: Phone },
};

export default function AISalesAgent() {
  const [conversations] = useState(demoConversations);
  const [selectedConv, setSelectedConv] = useState<SalesConversation | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const totalValue = conversations.filter(c => c.status === "won").reduce((a, c) => a + c.value, 0);
  const winRate = Math.round((conversations.filter(c => c.status === "won").length / conversations.length) * 100);
  const activeConvs = conversations.filter(c => c.status === "active").length;

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    toast.success("Mensagem enviada ao lead via IA");
    setInputMessage("");
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.info("🎙️ Gravando áudio — IA transcreve e responde automaticamente");
    } else {
      toast.success("Áudio enviado — IA processando resposta");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" /> Agente de Vendas IA
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            IA especialista em vendas x1 — persuasão humanizada, fechamento direto com clientes, produção de conteúdo e áudios.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-[10px] font-medium">
            <Activity className="w-3 h-3 animate-pulse" /> Agente Online 24/7
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Conversas Ativas", value: activeConvs, icon: MessageSquare, color: "text-green-400" },
          { label: "Taxa de Fechamento", value: `${winRate}%`, icon: Target, color: "text-primary" },
          { label: "Receita Gerada", value: `R$${(totalValue / 1000).toFixed(0)}k`, icon: DollarSign, color: "text-green-400" },
          { label: "Mensagens Hoje", value: "147", icon: Zap, color: "text-accent" },
          { label: "Score Médio", value: Math.round(conversations.reduce((a, c) => a + c.score, 0) / conversations.length), icon: Star, color: "text-amber-400" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-3 text-center">
            <s.icon className={`w-4 h-4 mx-auto mb-1 ${s.color}`} />
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[9px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Conversations List */}
        <div className="lg:col-span-2 space-y-2">
          <h4 className="text-xs font-semibold text-foreground px-1">Conversas de Vendas</h4>
          {conversations.map(conv => {
            const StatusIcon = statusConfig[conv.status].icon;
            return (
              <div key={conv.id} onClick={() => setSelectedConv(conv)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedConv?.id === conv.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/20"}`}>
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{conv.leadName}</p>
                      <p className="text-[9px] text-muted-foreground">{conv.channel}</p>
                    </div>
                  </div>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-medium ${statusConfig[conv.status].color}`}>
                    {statusConfig[conv.status].label}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground truncate mt-1">{conv.lastMessage}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[9px] text-muted-foreground">{conv.messages} msgs</span>
                  {conv.value > 0 && <span className="text-[9px] font-bold text-green-400">R${conv.value.toLocaleString("pt-BR")}</span>}
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono">Score: {conv.score}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card flex flex-col h-[600px]">
          <div className="p-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs font-bold text-foreground">
                  {selectedConv ? `Vendendo para: ${selectedConv.leadName}` : "Agente de Vendas IA"}
                </p>
                <p className="text-[9px] text-muted-foreground">Modo: Persuasão Humanizada + Fechamento x1</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[9px] text-green-400">Online</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "lead" ? "justify-start" : msg.role === "agent" ? "justify-end" : "justify-center"}`}>
                {msg.role === "system" ? (
                  <span className="text-[9px] text-muted-foreground bg-secondary/30 px-3 py-1 rounded-full">{msg.content}</span>
                ) : (
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-line ${
                    msg.role === "agent" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary border border-border text-foreground rounded-bl-sm"
                  }`}>
                    {msg.content}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-2">
              <button onClick={toggleRecording}
                className={`p-2 rounded-lg transition-all ${isRecording ? "bg-destructive/10 text-destructive animate-pulse" : "hover:bg-secondary text-muted-foreground hover:text-foreground"}`}>
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <input value={inputMessage} onChange={e => setInputMessage(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                className="flex-1 h-9 bg-secondary border border-border rounded-lg px-3 text-xs text-foreground placeholder:text-muted-foreground"
                placeholder="IA responde automaticamente ou digite para intervir..." />
              <button onClick={handleSend} className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                <Volume2 className="w-3 h-3" /> Áudio humanizado ativo
              </span>
              <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                <Zap className="w-3 h-3" /> Auto-resposta: ON
              </span>
              <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                <Target className="w-3 h-3" /> Modo: Fechamento
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Capabilities */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <h4 className="text-xs font-bold text-foreground flex items-center gap-2 mb-3">
          <Crown className="w-4 h-4 text-primary" /> Capacidades do Agente de Vendas IA
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: MessageSquare, title: "Venda x1", desc: "Conversa direta personalizada com cada lead" },
            { icon: Mic, title: "Áudios Humanizados", desc: "Grava e envia áudios naturais como humano" },
            { icon: BarChart3, title: "Produção de Conteúdo", desc: "Cria posts, stories e anúncios para vender" },
            { icon: Target, title: "Persuasão IA", desc: "Técnicas de copywriting e gatilhos mentais" },
          ].map(cap => (
            <div key={cap.title} className="p-3 rounded-lg bg-card border border-border/50">
              <cap.icon className="w-4 h-4 text-primary mb-2" />
              <p className="text-[10px] font-semibold text-foreground">{cap.title}</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">{cap.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
