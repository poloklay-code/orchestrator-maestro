"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import {
  MapPin, Star, Image as ImageIcon, MessageSquare, BarChart3, Settings, Plus, Search,
  Clock, TrendingUp, Eye, Phone, Globe, Pencil, Trash2, Zap, CheckCircle2, AlertTriangle,
  Calendar, ThumbsUp, Reply, Camera, FileText, Target, RefreshCw, Shield
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"

interface GBPProfile {
  id: string
  clientName: string
  businessName: string
  category: string
  address: string
  phone: string
  website: string
  rating: number
  totalReviews: number
  status: "verified" | "pending" | "suspended"
  completionScore: number
  monthlyViews: number
  monthlyClicks: number
  monthlyCalls: number
}

const demoProfiles: GBPProfile[] = [
  { id: "1", clientName: "Cliente A", businessName: "Studio Digital Pro", category: "Agencia de Marketing", address: "Av. Paulista, 1000 - SP", phone: "(11) 99999-0000", website: "https://studiopro.com.br", rating: 4.8, totalReviews: 127, status: "verified", completionScore: 92, monthlyViews: 3420, monthlyClicks: 890, monthlyCalls: 156 },
  { id: "2", clientName: "Cliente B", businessName: "Restaurante Sabor Real", category: "Restaurante", address: "Rua Augusta, 500 - SP", phone: "(11) 98888-0000", website: "https://saborreal.com", rating: 4.5, totalReviews: 89, status: "verified", completionScore: 78, monthlyViews: 5200, monthlyClicks: 1340, monthlyCalls: 310 },
]

const performanceData = [
  { month: "Jan", views: 2800, clicks: 720, calls: 130 },
  { month: "Fev", views: 3100, clicks: 810, calls: 145 },
  { month: "Mar", views: 3420, clicks: 890, calls: 156 },
  { month: "Abr", views: 3800, clicks: 980, calls: 170 },
  { month: "Mai", views: 4200, clicks: 1100, calls: 195 },
  { month: "Jun", views: 4600, clicks: 1250, calls: 220 },
]

const searchQueries = [
  { query: "agencia marketing digital sp", impressions: 1200, position: 2 },
  { query: "marketing digital sao paulo", impressions: 890, position: 4 },
  { query: "gestao redes sociais", impressions: 650, position: 3 },
  { query: "trafego pago sp", impressions: 420, position: 5 },
  { query: "automacao whatsapp empresa", impressions: 380, position: 1 },
]

const actionData = [
  { name: "Website", value: 45, fill: "#0dbfb3" },
  { name: "Ligacoes", value: 25, fill: "#22c55e" },
  { name: "Rotas", value: 20, fill: "#3b82f6" },
  { name: "Mensagens", value: 10, fill: "#f59e0b" },
]

export function GoogleBusinessPanel({ clients }: { clients: Array<{ id: string; name: string }> }) {
  const [profiles, setProfiles] = useState<GBPProfile[]>(demoProfiles)
  const [selectedProfile, setSelectedProfile] = useState<GBPProfile | null>(demoProfiles[0])
  const [showSettings, setShowSettings] = useState(false)
  const [showPostCreator, setShowPostCreator] = useState(false)
  const [showReviewManager, setShowReviewManager] = useState(false)
  const [postContent, setPostContent] = useState("")
  const [postType, setPostType] = useState("update")
  const [aiGenerating, setAiGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "posts" | "reviews" | "insights" | "settings">("overview")
  const supabase = createClient()

  const demoReviews = [
    { id: "r1", author: "Maria S.", rating: 5, text: "Excelente servico! Atendimento impecavel e resultados acima do esperado.", date: "2026-02-10", replied: true },
    { id: "r2", author: "Joao P.", rating: 4, text: "Muito bom, profissionais competentes. Recomendo.", date: "2026-02-08", replied: true },
    { id: "r3", author: "Ana L.", rating: 5, text: "Transformaram nosso negocio digital. ROI fantastico!", date: "2026-02-05", replied: false },
    { id: "r4", author: "Carlos M.", rating: 3, text: "Bom servico mas o prazo poderia ser melhor.", date: "2026-02-01", replied: false },
  ]

  const demoPosts = [
    { id: "p1", type: "update", content: "Novidades na agencia! Lancamos nosso novo pacote de automacao inteligente.", date: "2026-02-12", views: 340, clicks: 45 },
    { id: "p2", type: "offer", content: "Promocao de fevereiro: 20% off em pacotes de gestao de trafego.", date: "2026-02-08", views: 520, clicks: 89 },
    { id: "p3", type: "event", content: "Workshop gratuito: Como escalar seu negocio com IA. Dia 20/02 as 19h.", date: "2026-02-05", views: 890, clicks: 156 },
  ]

  const generateAIPost = async () => {
    setAiGenerating(true)
    await new Promise((r) => setTimeout(r, 1500))
    const posts: Record<string, string> = {
      update: `Estamos sempre evoluindo para entregar o melhor resultado para nossos clientes! Esta semana implementamos novas estrategias de automacao que ja estao gerando +35% de conversoes. Quer saber como aplicar no seu negocio? Fale conosco!`,
      offer: `Oferta especial por tempo limitado! Pacote completo de gestao digital com trafego pago + automacoes + assistente IA por um valor imperdivel. Vagas limitadas - garanta a sua agora mesmo!`,
      event: `Participe do nosso proximo evento exclusivo sobre estrategias digitais que realmente funcionam. Vagas limitadas, inscricoes abertas. Clique no link para garantir seu lugar!`,
    }
    setPostContent(posts[postType] || posts.update)
    setAiGenerating(false)
    toast.success("Post gerado com IA")
  }

  const generateAIReply = async (reviewId: string) => {
    toast.success("Resposta gerada com IA e publicada")
    await supabase.from("audit_logs").insert({ action: `Resposta IA gerada para avaliacao GBP`, entity_type: "google_business", source: "admin", severity: "info" })
  }

  const tabs = [
    { key: "overview", label: "Visao Geral", icon: BarChart3 },
    { key: "posts", label: "Publicacoes", icon: FileText },
    { key: "reviews", label: "Avaliacoes", icon: Star },
    { key: "insights", label: "Insights", icon: TrendingUp },
    { key: "settings", label: "Config. Avancadas", icon: Settings },
  ] as const

  return (
    <div className="space-y-6">
      {/* Profile Selector */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Google Meu Negocio (GBP)</h2>
          </div>
          <p className="text-xs text-muted-foreground">Gerenciamento avancado com IA para perfis empresariais no Google</p>
        </div>
        <select value={selectedProfile?.id || ""} onChange={(e) => setSelectedProfile(profiles.find((p) => p.id === e.target.value) || null)}
          className="h-10 bg-card border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-[200px]">
          {profiles.map((p) => <option key={p.id} value={p.id}>{p.businessName} ({p.clientName})</option>)}
        </select>
      </div>

      {selectedProfile && (
        <>
          {/* Profile Card */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">{selectedProfile.businessName}</h3>
                    {selectedProfile.status === "verified" && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                    {selectedProfile.status === "suspended" && <AlertTriangle className="w-4 h-4 text-red-400" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{selectedProfile.category} - {selectedProfile.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold">{selectedProfile.rating}</span>
                  <span className="text-muted-foreground">({selectedProfile.totalReviews})</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${selectedProfile.completionScore}%` }} />
                  </div>
                  <span className="text-muted-foreground font-mono">{selectedProfile.completionScore}%</span>
                </div>
              </div>
            </div>
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="p-3 rounded-lg bg-secondary/30 text-center">
                <Eye className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{selectedProfile.monthlyViews.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">Visualizacoes/mes</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 text-center">
                <Globe className="w-4 h-4 text-green-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{selectedProfile.monthlyClicks.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">Cliques/mes</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 text-center">
                <Phone className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{selectedProfile.monthlyCalls.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">Ligacoes/mes</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}>
                  <Icon className="w-3.5 h-3.5" /> {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-card p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Performance Mensal</h4>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 15% 16%)" />
                      <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} />
                      <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} />
                      <Tooltip contentStyle={{ background: "hsl(210 18% 8%)", border: "1px solid hsl(210 15% 16%)", borderRadius: "8px", color: "#e5e7eb" }} />
                      <Line type="monotone" dataKey="views" stroke="#0dbfb3" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="clicks" stroke="#22c55e" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="calls" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Acoes dos Usuarios</h4>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={actionData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={5} dataKey="value">
                        {actionData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "hsl(210 18% 8%)", border: "1px solid hsl(210 15% 16%)", borderRadius: "8px", color: "#e5e7eb" }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-3 justify-center mt-2">
                    {actionData.map((d) => (
                      <div key={d.name} className="flex items-center gap-1.5 text-[10px]">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.fill }} />
                        <span className="text-muted-foreground">{d.name} ({d.value}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <h4 className="text-sm font-semibold text-foreground mb-3">Termos de Busca (Discovery)</h4>
                <div className="space-y-2">
                  {searchQueries.map((q, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
                      <span className="text-xs font-mono text-primary w-6 text-center">#{q.position}</span>
                      <span className="flex-1 text-sm text-foreground">{q.query}</span>
                      <span className="text-xs text-muted-foreground font-mono">{q.impressions} imp.</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "posts" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">Publicacoes GBP</h4>
                <button onClick={() => setShowPostCreator(true)} className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90">
                  <Plus className="w-3.5 h-3.5" /> Criar Post
                </button>
              </div>
              {showPostCreator && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <select value={postType} onChange={(e) => setPostType(e.target.value)}
                      className="h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                      <option value="update">Atualizacao</option>
                      <option value="offer">Oferta</option>
                      <option value="event">Evento</option>
                    </select>
                    <button onClick={generateAIPost} disabled={aiGenerating}
                      className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg text-xs text-primary hover:bg-primary/20 transition-all disabled:opacity-50">
                      {aiGenerating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                      {aiGenerating ? "Gerando..." : "Gerar com IA"}
                    </button>
                  </div>
                  <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)} rows={4} placeholder="Escreva ou gere com IA..."
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => { setShowPostCreator(false); setPostContent("") }} className="px-3 py-1.5 text-xs text-muted-foreground">Cancelar</button>
                    <button onClick={() => { toast.success("Post publicado!"); setShowPostCreator(false); setPostContent("") }} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90">Publicar</button>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                {demoPosts.map((post) => (
                  <div key={post.id} className="p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${post.type === "offer" ? "bg-green-500/10 text-green-400" : post.type === "event" ? "bg-blue-500/10 text-blue-400" : "bg-muted text-muted-foreground"}`}>
                        {post.type === "update" ? "Atualizacao" : post.type === "offer" ? "Oferta" : "Evento"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{post.date}</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed mb-2">{post.content}</p>
                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.views} views</span>
                      <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {post.clicks} cliques</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-card border border-border text-center">
                  <p className="text-2xl font-bold text-yellow-400">{selectedProfile.rating}</p>
                  <p className="text-[10px] text-muted-foreground">Nota Media</p>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border text-center">
                  <p className="text-2xl font-bold text-foreground">{selectedProfile.totalReviews}</p>
                  <p className="text-[10px] text-muted-foreground">Total Avaliacoes</p>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border text-center">
                  <p className="text-2xl font-bold text-green-400">{demoReviews.filter((r) => r.replied).length}/{demoReviews.length}</p>
                  <p className="text-[10px] text-muted-foreground">Respondidas</p>
                </div>
              </div>
              <div className="space-y-3">
                {demoReviews.map((review) => (
                  <div key={review.id} className="p-4 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{review.author}</span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? "text-yellow-400 fill-current" : "text-muted"}`} />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-sm text-foreground/80 mb-2">{review.text}</p>
                    <div className="flex items-center gap-2">
                      {review.replied ? (
                        <span className="text-[10px] text-green-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Respondida</span>
                      ) : (
                        <button onClick={() => generateAIReply(review.id)}
                          className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 rounded text-[10px] text-primary hover:bg-primary/20 transition-all">
                          <Zap className="w-3 h-3" /> Responder com IA
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "insights" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <h4 className="text-sm font-semibold text-foreground mb-3">Insights IA - Google Meu Negocio</h4>
                <div className="space-y-3">
                  {[
                    { icon: TrendingUp, color: "text-green-400", title: "Crescimento de visualizacoes", desc: "Suas visualizacoes cresceram 18% no ultimo mes. Continue postando conteudo relevante 2-3x por semana." },
                    { icon: Star, color: "text-yellow-400", title: "Avaliacoes pendentes", desc: `Voce tem ${demoReviews.filter((r) => !r.replied).length} avaliacoes sem resposta. Responder rapidamente melhora o ranking local em ate 15%.` },
                    { icon: Target, color: "text-primary", title: "Otimizacao de perfil", desc: `Seu perfil esta ${selectedProfile.completionScore}% completo. Adicione fotos do interior e horarios atualizados para chegar a 100%.` },
                    { icon: Shield, color: "text-blue-400", title: "SEO Local", desc: "Inclua palavras-chave no descritivo do negocio. Os termos mais buscados sao 'marketing digital sp' e 'automacao whatsapp'." },
                    { icon: Camera, color: "text-orange-400", title: "Fotos", desc: "Negocios com +40 fotos recebem 520% mais ligacoes. Voce tem 12 fotos - adicione mais!" },
                  ].map((insight, i) => {
                    const Icon = insight.icon
                    return (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                        <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${insight.color}`} />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{insight.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{insight.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><Settings className="w-4 h-4 text-primary" /> Configuracoes Avancadas GBP</h4>
                <div className="space-y-4">
                  {[
                    { label: "Auto-resposta IA para avaliacoes", desc: "Responder automaticamente avaliacoes positivas (4-5 estrelas) com IA", enabled: true },
                    { label: "Alerta de avaliacoes negativas", desc: "Notificar admin imediatamente quando receber avaliacao 1-2 estrelas", enabled: true },
                    { label: "Post automatico semanal", desc: "Gerar e publicar conteudo automaticamente toda segunda-feira", enabled: false },
                    { label: "Monitoramento de concorrentes", desc: "Rastrear avaliacoes e posts dos principais concorrentes locais", enabled: false },
                    { label: "Sync com CRM", desc: "Sincronizar leads do GBP automaticamente com o CRM configurado", enabled: true },
                    { label: "Relatorio mensal GBP", desc: "Incluir metricas do Google Meu Negocio no relatorio mensal do cliente", enabled: true },
                    { label: "Sugestoes de SEO Local IA", desc: "IA analisa perfil semanalmente e sugere otimizacoes de SEO local", enabled: true },
                    { label: "Gestao de fotos com IA", desc: "IA sugere quais fotos publicar e qual legenda usar para mais engajamento", enabled: false },
                  ].map((setting, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <div>
                        <p className="text-sm font-medium text-foreground">{setting.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{setting.desc}</p>
                      </div>
                      <button className={`relative w-10 h-5 rounded-full transition-colors ${setting.enabled ? "bg-primary" : "bg-muted"}`}>
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-transform ${setting.enabled ? "left-5.5 translate-x-0" : "left-0.5"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <h4 className="text-sm font-semibold text-foreground mb-3">API e Webhook GBP</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Google Business API Key</label>
                    <input type="password" placeholder="AIzaSy..." className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Webhook URL (Avaliacoes)</label>
                    <input type="text" placeholder="https://..." className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90">Salvar Configuracoes</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
