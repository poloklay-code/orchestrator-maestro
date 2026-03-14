"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Bot, Send, User, Sparkles, Loader2 } from "lucide-react"
import Image from "next/image"

export function AssistantChat() {
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isStreaming = status === "streaming" || status === "submitted"

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isStreaming) return
    sendMessage({ text: input })
    setInput("")
  }

  const getMessageText = (msg: { parts?: Array<{ type: string; text?: string }> }) => {
    if (!msg.parts || !Array.isArray(msg.parts)) return ""
    return msg.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("")
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Chat Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border mb-4">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-primary/30">
          <Image src="/images/orquestrador-robot.jpg" alt="Maestro" fill sizes="40px" className="object-cover" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            Assistente MAESTRO
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </h2>
          <p className="text-[10px] text-muted-foreground font-mono">
            {isStreaming ? "Pensando..." : "Online | IA Assistente do Sistema"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden glow-cyan border border-primary/30">
              <Image src="/images/orquestrador-robot.jpg" alt="Maestro" fill sizes="80px" className="object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Ola, Admin!</h3>
              <p className="text-sm text-muted-foreground max-w-md mt-1">
                Sou o MAESTRO, seu assistente IA. Pergunte sobre o sistema, peca sugestoes, avalie ideias ou analise dados.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 max-w-md">
              {[
                "Como otimizar as automacoes ativas?",
                "Analise a performance dos clientes",
                "Quero implementar uma nova feature",
                "Sugira estrategias de trafego pago",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => { sendMessage({ text: q }) }}
                  className="p-3 rounded-lg border border-border bg-card text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const text = getMessageText(msg)
          if (!text) return null
          const isUser = msg.role === "user"
          return (
            <div key={msg.id} className={`flex gap-3 ${isUser ? "justify-end" : ""}`}>
              {!isUser && (
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-primary" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                isUser ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"
              }`}>
                <div className="whitespace-pre-wrap leading-relaxed">{text}</div>
              </div>
              {isUser && (
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              )}
            </div>
          )
        })}

        {isStreaming && messages.length > 0 && !getMessageText(messages[messages.length - 1]) && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
            </div>
            <div className="bg-card border border-border rounded-xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem para o MAESTRO..."
          className="flex-1 h-12 bg-card border border-border rounded-xl px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          disabled={isStreaming}
        />
        <button
          type="submit"
          disabled={!input.trim() || isStreaming}
          className="h-12 px-4 bg-primary text-primary-foreground rounded-xl flex items-center gap-2 text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
