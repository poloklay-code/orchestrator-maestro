import { useState } from "react";
import { toast } from "sonner";
import { MapPin, Star, MessageSquare, BarChart3, Settings, Plus, Search, TrendingUp, Eye, Phone, Globe, Zap, CheckCircle2, AlertTriangle, Camera, FileText, Target, RefreshCw, Shield, Key, Lock, Bot, Clock, ArrowUpRight, Pencil, Trash2, Layers, Cpu, Rocket } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area } from "recharts";

/* ── Interfaces ── */
interface GBPProfile {
  id: string; clientName: string; businessName: string; category: string; address: string;
  rating: number; totalReviews: number; status: string; completionScore: number;
  monthlyViews: number; monthlyClicks: number; monthlyCalls: number;
  phone?: string; website?: string; hours?: string; description?: string;
  googleApiKey?: string; placeId?: string;
}

interface GBPCredential {
  id: string; clientName: string; email: string; apiKey: string; placeId: string; status: string; lastSync: string;
}

/* ── Demo Data ── */
const demoProfiles: GBPProfile[] = [
  { id: "1", clientName: "Cliente A", businessName: "Studio Digital Pro", category: "Agência de Marketing", address: "Av. Paulista, 1000 - SP", rating: 4.8, totalReviews: 127, status: "verified", completionScore: 92, monthlyViews: 3420, monthlyClicks: 890, monthlyCalls: 156, phone: "(11) 99999-0001", website: "https://studiodigital.com.br", hours: "Seg-Sex 9h-18h", description: "Agência líder em marketing digital em SP" },
  { id: "2", clientName: "Cliente B", businessName: "Restaurante Sabor Real", category: "Restaurante", address: "Rua Augusta, 500 - SP", rating: 4.5, totalReviews: 89, status: "verified", completionScore: 78, monthlyViews: 5200, monthlyClicks: 1340, monthlyCalls: 310, phone: "(11) 99999-0002", website: "https://saborreal.com.br", hours: "Todos os dias 11h-23h", description: "O melhor da culinária brasileira" },
  { id: "3", clientName: "Cliente C", businessName: "Tech Solutions LTDA", category: "Tecnologia", address: "Rua Faria Lima, 200 - SP", rating: 4.2, totalReviews: 45, status: "pending", completionScore: 55, monthlyViews: 1200, monthlyClicks: 320, monthlyCalls: 45, phone: "(11) 99999-0003", website: "https://techsolutions.com.br", hours: "Seg-Sex 8h-17h", description: "Soluções em tecnologia empresarial" },
];

const demoCredentials: GBPCredential[] = [
  { id: "cr1", clientName: "Cliente A", email: "admin@studiodigital.com.br", apiKey: "AIza***...8x2Q", placeId: "ChIJ***...Studio", status: "active", lastSync: "2026-03-14 08:30" },
  { id: "cr2", clientName: "Cliente B", email: "gerente@saborreal.com.br", apiKey: "AIza***...4k9R", placeId: "ChIJ***...Sabor", status: "active", lastSync: "2026-03-14 07:45" },
];

const performanceData = [
  { month: "Set", views: 1800, clicks: 420, calls: 80, ranking: 8 },
  { month: "Out", views: 2200, clicks: 580, calls: 95, ranking: 6 },
  { month: "Nov", views: 2800, clicks: 720, calls: 130, ranking: 4 },
  { month: "Dez", views: 3100, clicks: 810, calls: 145, ranking: 3 },
  { month: "Jan", views: 3420, clicks: 890, calls: 156, ranking: 2 },
  { month: "Fev", views: 3900, clicks: 1050, calls: 180, ranking: 1 },
  { month: "Mar", views: 4600, clicks: 1250, calls: 220, ranking: 1 },
];

const actionData = [
  { name: "Website", value: 45, fill: "hsl(var(--primary))" },
  { name: "Ligações", value: 25, fill: "#22c55e" },
  { name: "Rotas", value: 20, fill: "#3b82f6" },
  { name: "Mensagens", value: 10, fill: "#f59e0b" },
];

const demoReviews = [
  { id: "r1", author: "Maria S.", rating: 5, text: "Excelente serviço! Transformaram nosso marketing digital.", date: "2026-03-10", replied: true, response: "Obrigado Maria! É um prazer contribuir com seu sucesso." },
  { id: "r2", author: "João P.", rating: 4, text: "Muito bom, recomendo para empresas.", date: "2026-03-08", replied: true, response: "Agradecemos João! Conte conosco." },
  { id: "r3", author: "Ana L.", rating: 5, text: "Transformaram nosso negócio digital! Resultados incríveis.", date: "2026-03-05", replied: false },
  { id: "r4", author: "Carlos M.", rating: 3, text: "Bom serviço mas prazo poderia ser melhor.", date: "2026-03-01", replied: false },
  { id: "r5", author: "Fernanda R.", rating: 5, text: "Melhor agência que já trabalhei!", date: "2026-02-28", replied: false },
];

const searchQueries = [
  { query: "agência marketing digital sp", impressions: 1200, position: 1, change: 2 },
  { query: "marketing digital são paulo", impressions: 890, position: 2, change: 1 },
  { query: "gestão redes sociais sp", impressions: 650, position: 1, change: 3 },
  { query: "tráfego pago são paulo", impressions: 520, position: 3, change: 0 },
  { query: "automação marketing digital", impressions: 380, position: 2, change: 1 },
];

const aiOptimizations = [
  { id: "opt1", type: "SEO Local", action: "Otimizar descrição com palavras-chave de alta conversão", impact: "Alto", status: "done", result: "+32% impressões" },
  { id: "opt2", type: "Posts GBP", action: "Publicar post semanal com oferta e CTA", impact: "Alto", status: "running", result: "+18% cliques" },
  { id: "opt3", type: "Fotos", action: "Adicionar 15 fotos profissionais ao perfil", impact: "Médio", status: "running", result: "+520% ligações esperadas" },
  { id: "opt4", type: "Q&A", action: "Responder 25 perguntas frequentes no perfil", impact: "Médio", status: "pending" },
  { id: "opt5", type: "Avaliações", action: "Responder todas avaliações em até 2h com IA", impact: "Alto", status: "running", result: "+15% ranking" },
  { id: "opt6", type: "Categorias", action: "Adicionar categorias secundárias relevantes", impact: "Médio", status: "done", result: "+8% discovery" },
  { id: "opt7", type: "Horários", action: "Atualizar horários especiais e feriados", impact: "Baixo", status: "done" },
  { id: "opt8", type: "Produtos", action: "Cadastrar todos produtos/serviços no GBP", impact: "Alto", status: "pending" },
];

export default function GoogleBusinessPanel() {
  const [selectedProfile, setSelectedProfile] = useState<GBPProfile>(demoProfiles[0]);
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "insights" | "credentials" | "ai-optimize">("overview");
  const [credentials, setCredentials] = useState(demoCredentials);
  const [showCredForm, setShowCredForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [credForm, setCredForm] = useState({ clientName: "", email: "", apiKey: "", placeId: "" });
  const [profileForm, setProfileForm] = useState({ clientName: "", businessName: "", category: "", address: "", phone: "", website: "", hours: "", description: "" });

  const tabs = [
    { key: "overview" as const, label: "Visão Geral", icon: BarChart3 },
    { key: "reviews" as const, label: "Avaliações", icon: Star },
    { key: "ai-optimize" as const, label: "IA Otimização", icon: Rocket },
    { key: "insights" as const, label: "Insights", icon: TrendingUp },
    { key: "credentials" as const, label: "Credenciais", icon: Key },
  ];

  const handleAddCredential = () => {
    if (!credForm.clientName || !credForm.apiKey) { toast.error("Preencha os campos obrigatórios"); return; }
    setCredentials([...credentials, { id: Date.now().toString(), ...credForm, status: "active", lastSync: new Date().toISOString().slice(0, 16).replace("T", " ") }]);
    setCredForm({ clientName: "", email: "", apiKey: "", placeId: "" });
    setShowCredForm(false);
    toast.success("Credencial cadastrada! IA conectando ao Google...");
  };

  const handleAddProfile = () => {
    if (!profileForm.businessName) { toast.error("Nome do negócio obrigatório"); return; }
    const newProfile: GBPProfile = {
      id: Date.now().toString(), clientName: profileForm.clientName, businessName: profileForm.businessName,
      category: profileForm.category, address: profileForm.address, rating: 0, totalReviews: 0,
      status: "pending", completionScore: 25, monthlyViews: 0, monthlyClicks: 0, monthlyCalls: 0,
      phone: profileForm.phone, website: profileForm.website, hours: profileForm.hours, description: profileForm.description,
    };
    demoProfiles.push(newProfile);
    setSelectedProfile(newProfile);
    setProfileForm({ clientName: "", businessName: "", category: "", address: "", phone: "", website: "", hours: "", description: "" });
    setShowProfileForm(false);
    toast.success("Negócio cadastrado! IA iniciando otimização automática...");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Google Meu Negócio — IA Avançada</h2>
          </div>
          <p className="text-xs text-muted-foreground">Gerenciamento autônomo com IA: otimização, ranking #1, avaliações, posts e mais</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowProfileForm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Cadastrar Negócio
          </button>
          <select value={selectedProfile.id} onChange={(e) => setSelectedProfile(demoProfiles.find(p => p.id === e.target.value) || demoProfiles[0])}
            className="h-10 bg-card border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-[200px]">
            {demoProfiles.map(p => <option key={p.id} value={p.id}>{p.businessName} ({p.clientName})</option>)}
          </select>
        </div>
      </div>

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
                {selectedProfile.status === "pending" && <Clock className="w-4 h-4 text-yellow-400" />}
              </div>
              <p className="text-xs text-muted-foreground">{selectedProfile.category} — {selectedProfile.address}</p>
              {selectedProfile.phone && <p className="text-[10px] text-muted-foreground">{selectedProfile.phone} • {selectedProfile.website}</p>}
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-4 h-4 fill-current" /><span className="font-bold">{selectedProfile.rating}</span>
              <span className="text-muted-foreground">({selectedProfile.totalReviews})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${selectedProfile.completionScore >= 90 ? "bg-green-400" : selectedProfile.completionScore >= 70 ? "bg-primary" : "bg-yellow-400"}`} style={{ width: `${selectedProfile.completionScore}%` }} />
              </div>
              <span className="text-muted-foreground font-mono">{selectedProfile.completionScore}%</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="p-3 rounded-lg bg-secondary/30 text-center"><Eye className="w-4 h-4 text-primary mx-auto mb-1" /><p className="text-lg font-bold text-foreground">{selectedProfile.monthlyViews.toLocaleString()}</p><p className="text-[10px] text-muted-foreground">Visualizações/mês</p></div>
          <div className="p-3 rounded-lg bg-secondary/30 text-center"><Globe className="w-4 h-4 text-green-400 mx-auto mb-1" /><p className="text-lg font-bold text-foreground">{selectedProfile.monthlyClicks.toLocaleString()}</p><p className="text-[10px] text-muted-foreground">Cliques/mês</p></div>
          <div className="p-3 rounded-lg bg-secondary/30 text-center"><Phone className="w-4 h-4 text-blue-400 mx-auto mb-1" /><p className="text-lg font-bold text-foreground">{selectedProfile.monthlyCalls.toLocaleString()}</p><p className="text-[10px] text-muted-foreground">Ligações/mês</p></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {tabs.map(tab => { const Icon = tab.icon; return (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}>
            <Icon className="w-3.5 h-3.5" /> {tab.label}
          </button>
        ); })}
      </div>

      {/* ── Overview Tab ── */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">Performance & Ranking</h4>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
                  <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Views" />
                  <Line type="monotone" dataKey="clicks" stroke="#22c55e" strokeWidth={2} dot={false} name="Cliques" />
                  <Line type="monotone" dataKey="calls" stroke="#3b82f6" strokeWidth={2} dot={false} name="Ligações" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">Ações dos Usuários</h4>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={actionData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={5} dataKey="value">
                    {actionData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 justify-center mt-2">
                {actionData.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5 text-[10px]">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.fill }} />
                    <span className="text-muted-foreground">{d.name} ({d.value}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Search Rankings */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-primary" /> Ranking de Busca — Posições Conquistadas
            </h4>
            <div className="space-y-2">
              {searchQueries.map((q, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
                  <span className={`text-xs font-bold w-8 h-8 rounded-lg flex items-center justify-center ${q.position <= 2 ? "bg-green-500/10 text-green-400" : "bg-primary/10 text-primary"}`}>
                    #{q.position}
                  </span>
                  <span className="flex-1 text-sm text-foreground">{q.query}</span>
                  {q.change > 0 && (
                    <span className="text-[10px] text-green-400 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3 h-3" /> +{q.change} posições
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground font-mono">{q.impressions} imp.</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Reviews Tab ── */}
      {activeTab === "reviews" && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-card border border-border text-center"><p className="text-2xl font-bold text-yellow-400">{selectedProfile.rating}</p><p className="text-[10px] text-muted-foreground">Nota Média</p></div>
            <div className="p-3 rounded-lg bg-card border border-border text-center"><p className="text-2xl font-bold text-foreground">{selectedProfile.totalReviews}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
            <div className="p-3 rounded-lg bg-card border border-border text-center"><p className="text-2xl font-bold text-green-400">{demoReviews.filter(r => r.replied).length}/{demoReviews.length}</p><p className="text-[10px] text-muted-foreground">Respondidas</p></div>
            <div className="p-3 rounded-lg bg-card border border-border text-center"><p className="text-2xl font-bold text-primary">&lt;2h</p><p className="text-[10px] text-muted-foreground">Tempo Resposta IA</p></div>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-center gap-3">
            <Bot className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">IA Auto-Resposta Ativa</p>
              <p className="text-[10px] text-muted-foreground">Todas avaliações são respondidas automaticamente em até 2h com tom profissional e personalizado</p>
            </div>
            <button onClick={() => toast.success("IA respondeu todas avaliações pendentes!")} className="ml-auto px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-[10px] font-medium hover:opacity-90">
              Responder Todas
            </button>
          </div>

          <div className="space-y-3">{demoReviews.map(review => (
            <div key={review.id} className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{review.author}</span>
                  <div className="flex items-center gap-0.5">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={`w-3 h-3 ${i < review.rating ? "text-yellow-400 fill-current" : "text-muted"}`} />))}</div>
                </div>
                <span className="text-[10px] text-muted-foreground">{review.date}</span>
              </div>
              <p className="text-sm text-foreground/80 mb-2">{review.text}</p>
              {review.replied ? (
                <div className="mt-2 p-2 rounded-lg bg-green-500/5 border border-green-500/20">
                  <span className="text-[10px] text-green-400 flex items-center gap-1 mb-1"><CheckCircle2 className="w-3 h-3" /> Respondida pela IA</span>
                  <p className="text-[10px] text-muted-foreground">{review.response}</p>
                </div>
              ) : (
                <button onClick={() => toast.success(`Resposta gerada para ${review.author}`)} className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 rounded text-[10px] text-primary hover:bg-primary/20 transition-all">
                  <Zap className="w-3 h-3" /> Responder com IA
                </button>
              )}
            </div>
          ))}</div>
        </div>
      )}

      {/* ── AI Optimization Tab ── */}
      {activeTab === "ai-optimize" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-card via-card to-primary/5 p-4">
            <div className="flex items-center gap-3 mb-3">
              <Rocket className="w-5 h-5 text-primary" />
              <div>
                <h4 className="text-sm font-semibold text-foreground">Motor de Otimização IA — Ranking #1</h4>
                <p className="text-[10px] text-muted-foreground">Sistema autônomo que executa todas as otimizações para colocar o negócio na 1ª posição</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="p-2 rounded-lg bg-card border border-border text-center">
                <p className="text-lg font-bold text-green-400">{aiOptimizations.filter(o => o.status === "done").length}</p>
                <p className="text-[9px] text-muted-foreground">Concluídas</p>
              </div>
              <div className="p-2 rounded-lg bg-card border border-border text-center">
                <p className="text-lg font-bold text-primary">{aiOptimizations.filter(o => o.status === "running").length}</p>
                <p className="text-[9px] text-muted-foreground">Em Execução</p>
              </div>
              <div className="p-2 rounded-lg bg-card border border-border text-center">
                <p className="text-lg font-bold text-yellow-400">{aiOptimizations.filter(o => o.status === "pending").length}</p>
                <p className="text-[9px] text-muted-foreground">Pendentes</p>
              </div>
              <div className="p-2 rounded-lg bg-card border border-border text-center">
                <p className="text-lg font-bold text-foreground">{Math.round((aiOptimizations.filter(o => o.status === "done").length / aiOptimizations.length) * 100)}%</p>
                <p className="text-[9px] text-muted-foreground">Progresso</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {aiOptimizations.map((opt) => (
              <div key={opt.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/20 transition-all">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${opt.status === "done" ? "bg-green-400" : opt.status === "running" ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{opt.type}</span>
                    <p className="text-xs font-semibold text-foreground">{opt.action}</p>
                  </div>
                  {opt.result && <p className="text-[10px] text-green-400 mt-0.5">Resultado: {opt.result}</p>}
                </div>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
                  opt.impact === "Alto" ? "bg-red-500/10 text-red-400" : opt.impact === "Médio" ? "bg-yellow-500/10 text-yellow-400" : "bg-green-500/10 text-green-400"
                }`}>
                  {opt.impact}
                </span>
                {opt.status === "pending" && (
                  <button onClick={() => toast.success(`IA executando: ${opt.action}`)} className="px-2 py-1 bg-primary/10 text-primary rounded text-[10px] hover:bg-primary/20">
                    Executar
                  </button>
                )}
              </div>
            ))}
          </div>

          <button onClick={() => toast.success("IA executando todas otimizações pendentes...")} className="w-full p-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" /> Executar Todas Otimizações Automaticamente
          </button>
        </div>
      )}

      {/* ── Insights Tab ── */}
      {activeTab === "insights" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" /> Análise IA Profunda
            </h4>
            <div className="space-y-3">
              {[
                { icon: TrendingUp, color: "text-green-400", title: "Crescimento Acelerado", desc: "Suas visualizações cresceram 64% nos últimos 3 meses. A IA projeta 6.000 views/mês até maio." },
                { icon: Star, color: "text-yellow-400", title: "Gestão de Avaliações", desc: `${demoReviews.filter(r => !r.replied).length} avaliações pendentes. IA programada para responder em até 2h. Isso melhora ranking em até 15%.` },
                { icon: Target, color: "text-primary", title: "Ranking Local", desc: `Você está na posição #1 para "${searchQueries[0].query}". IA mantendo otimização contínua.` },
                { icon: Camera, color: "text-orange-400", title: "Estratégia Visual", desc: "Negócios com +40 fotos recebem 520% mais ligações. IA agendou sessão de fotos." },
                { icon: Globe, color: "text-blue-400", title: "Presença Multi-canal", desc: "Sincronizando dados com Google Maps, Waze, Apple Maps para máxima visibilidade." },
                { icon: Shield, color: "text-green-400", title: "Proteção de Marca", desc: "IA monitorando avaliações negativas e sugestões de edição de concorrentes 24/7." },
              ].map((insight, i) => { const Icon = insight.icon; return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                  <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${insight.color}`} />
                  <div><p className="text-sm font-semibold text-foreground">{insight.title}</p><p className="text-xs text-muted-foreground mt-0.5">{insight.desc}</p></div>
                </div>
              ); })}
            </div>
          </div>
        </div>
      )}

      {/* ── Credentials Tab ── */}
      {activeTab === "credentials" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" /> Credenciais Google Business API
            </h4>
            <button onClick={() => setShowCredForm(true)} className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90">
              <Plus className="w-3.5 h-3.5" /> Nova Credencial
            </button>
          </div>

          <div className="space-y-3">
            {credentials.map((cred) => (
              <div key={cred.id} className="p-4 rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">{cred.clientName}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${cred.status === "active" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                      {cred.status === "active" ? "Ativa" : "Inativa"}
                    </span>
                  </div>
                  <button onClick={() => { setCredentials(credentials.filter(c => c.id !== cred.id)); toast.success("Credencial removida"); }} className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div><span className="text-muted-foreground">Email:</span> <span className="text-foreground font-mono">{cred.email}</span></div>
                  <div><span className="text-muted-foreground">API Key:</span> <span className="text-foreground font-mono">{cred.apiKey}</span></div>
                  <div><span className="text-muted-foreground">Place ID:</span> <span className="text-foreground font-mono">{cred.placeId}</span></div>
                  <div><span className="text-muted-foreground">Último Sync:</span> <span className="text-foreground font-mono">{cred.lastSync}</span></div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
            <p className="text-[10px] text-muted-foreground">
              <strong className="text-foreground">Como funciona:</strong> Cadastre as credenciais do Google Business Profile API de cada cliente. A IA usa essas credenciais para gerenciar automaticamente o perfil: publicar posts, responder avaliações, atualizar informações e otimizar para ranking #1.
            </p>
          </div>
        </div>
      )}

      {/* ── Credential Form Modal ── */}
      {showCredForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Nova Credencial GBP</h2>
            <div className="grid gap-3">
              {[
                { label: "Nome do Cliente *", key: "clientName", placeholder: "Ex: Cliente A" },
                { label: "Email Google", key: "email", placeholder: "admin@empresa.com.br" },
                { label: "API Key *", key: "apiKey", placeholder: "AIzaSy..." },
                { label: "Place ID", key: "placeId", placeholder: "ChIJ..." },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-xs text-muted-foreground mb-1 block">{field.label}</label>
                  <input type="text" value={(credForm as any)[field.key]} onChange={(e) => setCredForm({ ...credForm, [field.key]: e.target.value })} placeholder={field.placeholder}
                    className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => setShowCredForm(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancelar</button>
              <button onClick={handleAddCredential} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Profile Form Modal ── */}
      {showProfileForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-foreground">Cadastrar Novo Negócio</h2>
            <div className="grid gap-3">
              {[
                { label: "Nome do Cliente", key: "clientName", placeholder: "Ex: Cliente D" },
                { label: "Nome do Negócio *", key: "businessName", placeholder: "Ex: Padaria Central" },
                { label: "Categoria", key: "category", placeholder: "Ex: Padaria, Restaurante..." },
                { label: "Endereço", key: "address", placeholder: "Rua, Número - Cidade" },
                { label: "Telefone", key: "phone", placeholder: "(11) 99999-0000" },
                { label: "Website", key: "website", placeholder: "https://..." },
                { label: "Horários", key: "hours", placeholder: "Seg-Sex 9h-18h" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-xs text-muted-foreground mb-1 block">{field.label}</label>
                  <input type="text" value={(profileForm as any)[field.key]} onChange={(e) => setProfileForm({ ...profileForm, [field.key]: e.target.value })} placeholder={field.placeholder}
                    className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              ))}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Descrição do Negócio</label>
                <textarea value={profileForm.description} onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })} rows={3} placeholder="Descreva o negócio..."
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => setShowProfileForm(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancelar</button>
              <button onClick={handleAddProfile} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Cadastrar e Otimizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
