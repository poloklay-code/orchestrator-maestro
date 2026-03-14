import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Sparkles } from "lucide-react";
import OrchestratorBust from "@/components/OrchestratorBust";

interface Message { id: string; role: "user" | "assistant"; content: string; }

const defaultResponses: Record<string, string> = {
  "otimizar": "Para otimizar suas automações, recomendo revisar os fluxos com menor taxa de conversão, eliminar etapas redundantes e implementar testes A/B nos pontos de decisão. Posso analisar cada workflow em detalhe se precisar.",
  "performance": "A performance geral está excelente! Seus agentes de IA mantêm 94% de eficiência com latência média de 12ms. O ROI das campanhas de tráfego cresceu 23% no último mês.",
  "feature": "Ótima ideia! Para implementar uma nova feature, sugiro documentar o escopo, definir métricas de sucesso e usar o Shadow Mode para testar sem risco. Qual área você quer melhorar?",
  "trafego": "Estratégias recomendadas: 1) Escalar campanhas com CPA abaixo da meta em 20%, 2) Testar novos públicos com lookalike 1-3%, 3) Implementar retargeting dinâmico, 4) Usar copy A/B com versão baixo risco.",
};

export default function AssistantChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));

    const key = Object.keys(defaultResponses).find(k => input.toLowerCase().includes(k));
    const response = key ? defaultResponses[key] : `Entendi sua solicitação sobre "${input}". Como seu assistente MAESTRO, posso ajudar com automações, análise de dados, estratégias de tráfego, gestão de clientes e otimização de processos. Quer que eu detalhe algum ponto específico?`;

    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: response }]);
    setIsTyping(false);
  };

  const sendQuickMessage = (text: string) => {
    setInput(text);
    setTimeout(() => {
      const form = document.querySelector("form");
      form?.dispatchEvent(new Event("submit", { bubbles: true }));
    }, 100);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-3 pb-4 border-b border-border mb-4">
        <OrchestratorBust size="small" className="w-10 h-10" />
        <div>
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">Assistente MAESTRO <Sparkles className="w-3.5 h-3.5 text-primary" /></h2>
          <p className="text-[10px] text-muted-foreground font-mono">{isTyping ? "Pensando..." : "Online | IA Assistente do Sistema"}</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4">
            <OrchestratorBust size="small" className="w-20 h-20" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">Olá, Admin!</h3>
              <p className="text-sm text-muted-foreground max-w-md mt-1">Sou o MAESTRO, seu assistente IA. Pergunte sobre o sistema, peça sugestões ou analise dados.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 max-w-md">
              {["Como otimizar as automações ativas?", "Analise a performance dos clientes", "Quero implementar uma nova feature", "Sugira estratégias de tráfego pago"].map(q => (
                <button key={q} onClick={() => sendQuickMessage(q)} className="p-3 rounded-lg border border-border bg-card text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all text-left">{q}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5"><Bot className="w-3.5 h-3.5 text-primary" /></div>}
            <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}>
              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
            </div>
            {msg.role === "user" && <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5"><User className="w-3.5 h-3.5 text-muted-foreground" /></div>}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><Bot className="w-3.5 h-3.5 text-primary animate-pulse" /></div>
            <div className="bg-card border border-border rounded-xl px-4 py-3">
              <div className="flex gap-1"><span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} /><span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} /><span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} /></div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Digite sua mensagem para o MAESTRO..."
          className="flex-1 h-12 bg-card border border-border rounded-xl px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" disabled={isTyping} />
        <button type="submit" disabled={!input.trim() || isTyping} className="h-12 px-4 bg-primary text-primary-foreground rounded-xl flex items-center gap-2 text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-all"><Send className="w-4 h-4" /></button>
      </form>
    </div>
  );
}
