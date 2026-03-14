"use client"

import { useState } from "react"
import { Link2, ExternalLink, CheckCircle2, Circle, Search } from "lucide-react"

const integrations = [
  { category: "Automacao", items: [
    { name: "n8n", description: "Workflows visuais de automacao", url: "https://n8n.io", color: "#ea4b71" },
    { name: "Make (Integromat)", description: "Cenarios de integracao avancada", url: "https://make.com", color: "#6d3fc0" },
    { name: "ManyChat", description: "Chatbots para Instagram e Messenger", url: "https://manychat.com", color: "#0084ff" },
    { name: "Zapier", description: "Conectar 5000+ apps", url: "https://zapier.com", color: "#ff4a00" },
    { name: "ActiveCampaign", description: "Email marketing e CRM", url: "https://activecampaign.com", color: "#356ae6" },
  ]},
  { category: "Mensageria", items: [
    { name: "WhatsApp Business API", description: "API oficial do WhatsApp", url: "https://business.whatsapp.com", color: "#25d366" },
    { name: "Evolution API", description: "API nao oficial WhatsApp", url: "https://evolution-api.com", color: "#0dc143" },
    { name: "Chatwoot", description: "Plataforma de atendimento omnichannel", url: "https://chatwoot.com", color: "#1f93ff" },
    { name: "Typebot", description: "Construtor de chatbots conversacionais", url: "https://typebot.io", color: "#0042da" },
    { name: "BotConversa", description: "Chatbot para WhatsApp", url: "https://botconversa.com.br", color: "#00bf63" },
  ]},
  { category: "CRM & Gestao", items: [
    { name: "Kommo (amoCRM)", description: "CRM com foco em vendas", url: "https://kommo.com", color: "#4c8cfb" },
    { name: "HubSpot", description: "CRM completo gratuito", url: "https://hubspot.com", color: "#ff7a59" },
    { name: "RD Station", description: "Marketing e CRM brasileiro", url: "https://rdstation.com", color: "#00a5f7" },
    { name: "Pipedrive", description: "CRM focado em pipeline", url: "https://pipedrive.com", color: "#017737" },
  ]},
  { category: "Trafego Pago", items: [
    { name: "Meta Ads", description: "Facebook e Instagram Ads", url: "https://business.facebook.com", color: "#1877f2" },
    { name: "Google Ads", description: "Anuncios no Google", url: "https://ads.google.com", color: "#4285f4" },
    { name: "TikTok Ads", description: "Anuncios no TikTok", url: "https://ads.tiktok.com", color: "#010101" },
    { name: "LinkedIn Ads", description: "Anuncios profissionais", url: "https://business.linkedin.com", color: "#0a66c2" },
  ]},
  { category: "Afiliados / E-commerce / CPA", items: [
    { name: "Hotmart", description: "Plataforma de infoprodutos", url: "https://hotmart.com", color: "#f04e23" },
    { name: "Monetizze", description: "Afiliados e produtos digitais", url: "https://monetizze.com.br", color: "#00b894" },
    { name: "Eduzz", description: "Plataforma de produtos digitais", url: "https://eduzz.com", color: "#2d4db3" },
    { name: "Kiwify", description: "Vendas de produtos digitais", url: "https://kiwify.com.br", color: "#22c55e" },
    { name: "Braip", description: "Plataforma de afiliados", url: "https://braip.com", color: "#6366f1" },
    { name: "Dig Store", description: "Marketplace digital", url: "https://digstore24.com", color: "#e93e30" },
    { name: "BuyGoods", description: "Plataforma CPA", url: "https://buygoods.com", color: "#f97316" },
    { name: "ClickBank", description: "Marketplace global de afiliados", url: "https://clickbank.com", color: "#2f855a" },
    { name: "MaxWeb", description: "Network de performance", url: "https://maxweb.com", color: "#3b82f6" },
  ]},
  { category: "IA & Assistentes", items: [
    { name: "OpenAI / ChatGPT", description: "Modelos GPT", url: "https://openai.com", color: "#10a37f" },
    { name: "Anthropic / Claude", description: "Modelos Claude", url: "https://anthropic.com", color: "#cc785c" },
    { name: "ElevenLabs", description: "Geracao de voz com IA", url: "https://elevenlabs.io", color: "#000" },
    { name: "Dify.ai", description: "Plataforma de apps de IA", url: "https://dify.ai", color: "#1677ff" },
  ]},
]

export function IntegrationsHub() {
  const [search, setSearch] = useState("")
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([])

  const toggleConnect = (name: string) => {
    setConnectedPlatforms((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar integracoes..."
          className="w-full h-10 bg-card border border-border rounded-lg pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
      </div>

      {integrations.map((cat) => {
        const filteredItems = cat.items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase()))
        if (filteredItems.length === 0) return null
        return (
          <div key={cat.category}>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-primary" />
              {cat.category}
              <span className="text-xs text-muted-foreground font-normal">({filteredItems.length})</span>
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredItems.map((item) => {
                const isConnected = connectedPlatforms.includes(item.name)
                return (
                  <div key={item.name} className={`p-4 rounded-xl border transition-all ${isConnected ? "border-primary/30 bg-primary/5" : "border-border bg-card hover:border-primary/20"}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-sm font-semibold text-foreground">{item.name}</span>
                      </div>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{item.description}</p>
                    <button onClick={() => toggleConnect(item.name)}
                      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${isConnected ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                      {isConnected ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                      {isConnected ? "Conectado" : "Conectar"}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
