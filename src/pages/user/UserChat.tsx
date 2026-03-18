import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Brain, Send, Sparkles, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function UserChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Olá! Eu sou a **DOMINUS AI**, seu assistente inteligente. Posso explicar seus resultados, responder dúvidas sobre suas campanhas, coletar pedidos e interpretar seus objetivos. Como posso ajudar?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await supabase.functions.invoke("dominus-ai", {
        body: {
          action: "sales_agent",
          data: {
            message: userMsg.content,
            user_id: user?.id,
            context: "user_chat",
            history: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
          },
        },
      });

      const aiContent = typeof data?.result === "string" ? data.result : data?.result?.response || "Desculpe, não consegui processar. Tente novamente.";
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: aiContent, timestamp: new Date() }]);
    } catch {
      toast.error("Erro ao conectar com DOMINUS AI");
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Desculpe, houve um erro. Tente novamente em instantes.", timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">Chat com DOMINUS AI</h1>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Online • Assistente Inteligente
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-secondary/50 border border-border text-foreground rounded-bl-md"
              }`}>
                {msg.content.split("**").map((part, i) =>
                  i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary animate-pulse" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-secondary/50 border border-border">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0s" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.15s" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Fale com a DOMINUS AI..."
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              className="w-full h-12 px-4 pr-12 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            <Sparkles className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30" />
          </div>
          <button onClick={sendMessage} disabled={loading || !input.trim()}
            className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:brightness-110 disabled:opacity-50 transition-all">
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[9px] text-muted-foreground mt-2 text-center">
          DOMINUS AI • Seus dados são protegidos e isolados por tenant
        </p>
      </div>
    </div>
  );
}
