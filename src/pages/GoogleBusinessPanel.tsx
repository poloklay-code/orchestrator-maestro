import { useState } from "react";
import { toast } from "sonner";
import { MapPin, Star, MessageSquare, BarChart3, Settings, Plus, Search, TrendingUp, Eye, Phone, Globe, Zap, CheckCircle2, AlertTriangle, Camera, FileText, Target, RefreshCw, Shield } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface GBPProfile {
  id: string; clientName: string; businessName: string; category: string; address: string; rating: number; totalReviews: number; status: string; completionScore: number; monthlyViews: number; monthlyClicks: number; monthlyCalls: number;
}

const demoProfiles: GBPProfile[] = [
  { id: "1", clientName: "Cliente A", businessName: "Studio Digital Pro", category: "Agência de Marketing", address: "Av. Paulista, 1000 - SP", rating: 4.8, totalReviews: 127, status: "verified", completionScore: 92, monthlyViews: 3420, monthlyClicks: 890, monthlyCalls: 156 },
  { id: "2", clientName: "Cliente B", businessName: "Restaurante Sabor Real", category: "Restaurante", address: "Rua Augusta, 500 - SP", rating: 4.5, totalReviews: 89, status: "verified", completionScore: 78, monthlyViews: 5200, monthlyClicks: 1340, monthlyCalls: 310 },
];

const performanceData = [
  { month: "Jan", views: 2800, clicks: 720, calls: 130 }, { month: "Fev", views: 3100, clicks: 810, calls: 145 },
  { month: "Mar", views: 3420, clicks: 890, calls: 156 }, { month: "Abr", views: 3800, clicks: 980, calls: 170 },
  { month: "Mai", views: 4200, clicks: 1100, calls: 195 }, { month: "Jun", views: 4600, clicks: 1250, calls: 220 },
];

const actionData = [{ name: "Website", value: 45, fill: "#0dbfb3" }, { name: "Ligações", value: 25, fill: "#22c55e" }, { name: "Rotas", value: 20, fill: "#3b82f6" }, { name: "Mensagens", value: 10, fill: "#f59e0b" }];

const demoReviews = [
  { id: "r1", author: "Maria S.", rating: 5, text: "Excelente serviço!", date: "2026-02-10", replied: true },
  { id: "r2", author: "João P.", rating: 4, text: "Muito bom, recomendo.", date: "2026-02-08", replied: true },
  { id: "r3", author: "Ana L.", rating: 5, text: "Transformaram nosso negócio digital!", date: "2026-02-05", replied: false },
  { id: "r4", author: "Carlos M.", rating: 3, text: "Bom serviço mas prazo poderia ser melhor.", date: "2026-02-01", replied: false },
];

const searchQueries = [
  { query: "agência marketing digital sp", impressions: 1200, position: 2 },
  { query: "marketing digital são paulo", impressions: 890, position: 4 },
  { query: "gestão redes sociais", impressions: 650, position: 3 },
];

export default function GoogleBusinessPanel() {
  const [selectedProfile, setSelectedProfile] = useState<GBPProfile>(demoProfiles[0]);
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "insights">("overview");

  const tabs = [
    { key: "overview" as const, label: "Visão Geral", icon: BarChart3 },
    { key: "reviews" as const, label: "Avaliações", icon: Star },
    { key: "insights" as const, label: "Insights", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2"><MapPin className="w-5 h-5 text-primary" /><h2 className="text-lg font-bold text-foreground">Google Meu Negócio (GBP)</h2></div>
          <p className="text-xs text-muted-foreground">Gerenciamento avançado com IA para perfis empresariais</p>
        </div>
        <select value={selectedProfile.id} onChange={(e) => setSelectedProfile(demoProfiles.find(p => p.id === e.target.value) || demoProfiles[0])}
          className="h-10 bg-card border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-[200px]">
          {demoProfiles.map(p => <option key={p.id} value={p.id}>{p.businessName} ({p.clientName})</option>)}
        </select>
      </div>

      {/* Profile Card */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center"><MapPin className="w-6 h-6 text-primary" /></div>
            <div>
              <div className="flex items-center gap-2"><h3 className="text-sm font-bold text-foreground">{selectedProfile.businessName}</h3><CheckCircle2 className="w-4 h-4 text-green-400" /></div>
              <p className="text-xs text-muted-foreground">{selectedProfile.category} - {selectedProfile.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1 text-yellow-400"><Star className="w-4 h-4 fill-current" /><span className="font-bold">{selectedProfile.rating}</span><span className="text-muted-foreground">({selectedProfile.totalReviews})</span></div>
            <div className="flex items-center gap-1"><div className="h-2 w-24 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${selectedProfile.completionScore}%` }} /></div><span className="text-muted-foreground font-mono">{selectedProfile.completionScore}%</span></div>
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

      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">Performance Mensal</h4>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
                  <Line type="monotone" dataKey="views" stroke="#0dbfb3" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="clicks" stroke="#22c55e" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="calls" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">Ações dos Usuários</h4>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart><Pie data={actionData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={5} dataKey="value">{actionData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}</Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} /></PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 justify-center mt-2">{actionData.map(d => (<div key={d.name} className="flex items-center gap-1.5 text-[10px]"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.fill }} /><span className="text-muted-foreground">{d.name} ({d.value}%)</span></div>))}</div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <h4 className="text-sm font-semibold text-foreground mb-3">Termos de Busca (Discovery)</h4>
            <div className="space-y-2">{searchQueries.map((q, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30"><span className="text-xs font-mono text-primary w-6 text-center">#{q.position}</span><span className="flex-1 text-sm text-foreground">{q.query}</span><span className="text-xs text-muted-foreground font-mono">{q.impressions} imp.</span></div>
            ))}</div>
          </div>
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-card border border-border text-center"><p className="text-2xl font-bold text-yellow-400">{selectedProfile.rating}</p><p className="text-[10px] text-muted-foreground">Nota Média</p></div>
            <div className="p-3 rounded-lg bg-card border border-border text-center"><p className="text-2xl font-bold text-foreground">{selectedProfile.totalReviews}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
            <div className="p-3 rounded-lg bg-card border border-border text-center"><p className="text-2xl font-bold text-green-400">{demoReviews.filter(r => r.replied).length}/{demoReviews.length}</p><p className="text-[10px] text-muted-foreground">Respondidas</p></div>
          </div>
          <div className="space-y-3">{demoReviews.map(review => (
            <div key={review.id} className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><span className="text-sm font-semibold text-foreground">{review.author}</span>
                  <div className="flex items-center gap-0.5">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={`w-3 h-3 ${i < review.rating ? "text-yellow-400 fill-current" : "text-muted"}`} />))}</div>
                </div><span className="text-[10px] text-muted-foreground">{review.date}</span>
              </div>
              <p className="text-sm text-foreground/80 mb-2">{review.text}</p>
              {review.replied ? <span className="text-[10px] text-green-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Respondida</span> :
                <button onClick={() => toast.success("Resposta gerada com IA")} className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 rounded text-[10px] text-primary hover:bg-primary/20 transition-all"><Zap className="w-3 h-3" /> Responder com IA</button>}
            </div>
          ))}</div>
        </div>
      )}

      {activeTab === "insights" && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h4 className="text-sm font-semibold text-foreground mb-3">Insights IA</h4>
          <div className="space-y-3">
            {[
              { icon: TrendingUp, color: "text-green-400", title: "Crescimento de visualizações", desc: "Suas visualizações cresceram 18% no último mês." },
              { icon: Star, color: "text-yellow-400", title: "Avaliações pendentes", desc: `${demoReviews.filter(r => !r.replied).length} avaliações sem resposta. Responder melhora o ranking local em até 15%.` },
              { icon: Target, color: "text-primary", title: "Otimização de perfil", desc: `Perfil ${selectedProfile.completionScore}% completo. Adicione fotos e horários para chegar a 100%.` },
              { icon: Camera, color: "text-orange-400", title: "Fotos", desc: "Negócios com +40 fotos recebem 520% mais ligações." },
            ].map((insight, i) => { const Icon = insight.icon; return (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30"><Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${insight.color}`} /><div><p className="text-sm font-semibold text-foreground">{insight.title}</p><p className="text-xs text-muted-foreground mt-0.5">{insight.desc}</p></div></div>
            ); })}
          </div>
        </div>
      )}
    </div>
  );
}
