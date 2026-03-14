import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DollarSign, TrendingUp, TrendingDown, Plus, ArrowUpRight, ArrowDownRight, Filter, BarChart3,
  Users, CreditCard, Smartphone, QrCode, Mail, MessageSquare, Bell, Calendar, FileText,
  CheckCircle2, Clock, AlertTriangle, XCircle, RefreshCw, Send, Eye, Settings2
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, AreaChart, Area } from "recharts";

const PLATFORMS = ["Google Ads", "Meta Ads", "TikTok Ads", "LinkedIn Ads", "Hotmart", "Monetizze", "Eduzz", "Kiwify", "n8n", "Make", "ManyChat", "OpenAI", "Outros"];
const CATEGORIES = ["trafego_pago", "trafego_organico", "automacao", "ia", "ferramentas", "afiliados", "servicos", "outros"];
const PIE_COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
const PAYMENT_METHODS = ["PIX", "Cartão de Crédito", "Cartão de Débito"];

type FinancialRecord = { id: string; platform: string; type: string; amount: number; description: string; category: string; date: string; clientName?: string; };

type Invoice = {
  id: string; clientName: string; amount: number; dueDate: string; status: "paid" | "pending" | "overdue" | "cancelled";
  paymentMethod: string; service: string; sentVia: string[];
};

type Subscription = {
  id: string; clientName: string; service: string; amount: number; startDate: string; nextBilling: string;
  status: "active" | "suspended" | "cancelled"; paymentMethod: string; autoRenew: boolean;
};

const demoRecords: FinancialRecord[] = [
  { id: "1", platform: "Meta Ads", type: "expense", amount: 5200, description: "Campanha Facebook Q1 — João Silva", category: "trafego_pago", date: "2026-03-10", clientName: "João Silva" },
  { id: "2", platform: "Google Ads", type: "expense", amount: 3800, description: "Search + Display — Maria Santos", category: "trafego_pago", date: "2026-03-09", clientName: "Maria Santos" },
  { id: "3", platform: "Hotmart", type: "revenue", amount: 12500, description: "Vendas curso digital", category: "afiliados", date: "2026-03-08", clientName: "João Silva" },
  { id: "4", platform: "Serviço", type: "revenue", amount: 8500, description: "Gestão Tráfego + Copy — João Silva", category: "servicos", date: "2026-03-05", clientName: "João Silva" },
  { id: "5", platform: "Serviço", type: "revenue", amount: 12000, description: "Automação + Email — Maria Santos", category: "servicos", date: "2026-03-05", clientName: "Maria Santos" },
  { id: "6", platform: "Serviço", type: "revenue", amount: 2000, description: "Google Negócio + Social — Carlos Lima", category: "servicos", date: "2026-03-05", clientName: "Carlos Lima" },
  { id: "7", platform: "n8n", type: "expense", amount: 150, description: "Licença mensal", category: "ferramentas", date: "2026-03-07" },
  { id: "8", platform: "OpenAI", type: "expense", amount: 320, description: "API GPT-4", category: "ia", date: "2026-03-06" },
];

const demoInvoices: Invoice[] = [
  { id: "INV-001", clientName: "João Silva", amount: 8500, dueDate: "2026-03-15", status: "paid", paymentMethod: "PIX", service: "Gestão Tráfego + Copy", sentVia: ["Email", "WhatsApp"] },
  { id: "INV-002", clientName: "Maria Santos", amount: 12000, dueDate: "2026-03-15", status: "paid", paymentMethod: "Cartão de Crédito", service: "Automação + Email Marketing", sentVia: ["Email"] },
  { id: "INV-003", clientName: "Carlos Lima", amount: 2000, dueDate: "2026-03-15", status: "pending", paymentMethod: "PIX", service: "Google Negócio + Social", sentVia: ["Email", "WhatsApp"] },
  { id: "INV-004", clientName: "InfoProduto BR", amount: 5000, dueDate: "2026-02-15", status: "overdue", paymentMethod: "Cartão de Débito", service: "Funil + Tráfego + Copy", sentVia: ["Email", "WhatsApp"] },
];

const demoSubscriptions: Subscription[] = [
  { id: "SUB-001", clientName: "João Silva", service: "Gestão Tráfego + Copy + GBP", amount: 8500, startDate: "2025-06-01", nextBilling: "2026-04-01", status: "active", paymentMethod: "PIX", autoRenew: true },
  { id: "SUB-002", clientName: "Maria Santos", service: "Automação + Email Marketing", amount: 12000, startDate: "2025-08-01", nextBilling: "2026-04-01", status: "active", paymentMethod: "Cartão de Crédito", autoRenew: true },
  { id: "SUB-003", clientName: "Carlos Lima", service: "Google Negócio + Social", amount: 2000, startDate: "2026-01-15", nextBilling: "2026-04-15", status: "active", paymentMethod: "PIX", autoRenew: true },
  { id: "SUB-004", clientName: "InfoProduto BR", service: "Funil + Tráfego + Copy", amount: 5000, startDate: "2025-09-01", nextBilling: "—", status: "suspended", paymentMethod: "Cartão de Débito", autoRenew: false },
];

const revenueChart = [
  { month: "Out", receita: 18000, despesa: 8500 },
  { month: "Nov", receita: 20500, despesa: 9200 },
  { month: "Dez", receita: 22000, despesa: 9800 },
  { month: "Jan", receita: 25000, despesa: 10500 },
  { month: "Fev", receita: 28000, despesa: 11000 },
  { month: "Mar", receita: 35000, despesa: 12470 },
];

const invoiceStatusConfig = {
  paid: { label: "Pago", color: "text-green-400 bg-green-500/10", icon: CheckCircle2 },
  pending: { label: "Pendente", color: "text-amber-400 bg-amber-500/10", icon: Clock },
  overdue: { label: "Atrasado", color: "text-destructive bg-destructive/10", icon: AlertTriangle },
  cancelled: { label: "Cancelado", color: "text-muted-foreground bg-secondary", icon: XCircle },
};

type Tab = "dashboard" | "invoices" | "subscriptions" | "billing" | "config";

export default function FinancialPanel() {
  const [records] = useState<FinancialRecord[]>(demoRecords);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [billingConfig, setBillingConfig] = useState({
    companyName: "Orquestrador Digital", pixKey: "", cardGateway: "Stripe",
    reminderDays: "3", suspensionDays: "7", cancellationDays: "15",
    emailNotify: true, whatsappNotify: true,
  });

  const totalExpenses = records.filter(r => r.type === "expense").reduce((s, r) => s + r.amount, 0);
  const totalRevenue = records.filter(r => r.type === "revenue").reduce((s, r) => s + r.amount, 0);
  const profit = totalRevenue - totalExpenses;

  const platformData = Object.entries(
    records.filter(r => r.type === "expense").reduce((acc, r) => { acc[r.platform] = (acc[r.platform] || 0) + r.amount; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name: name.length > 10 ? name.slice(0, 10) + ".." : name, value }));

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: "dashboard", label: "Dashboard", icon: BarChart3 },
    { key: "subscriptions", label: "Assinaturas", icon: RefreshCw },
    { key: "invoices", label: "Faturas", icon: FileText },
    { key: "billing", label: "Cobranças", icon: Send },
    { key: "config", label: "Configuração", icon: Settings2 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><DollarSign className="w-6 h-6 text-primary" /> Sistema Financeiro</h1>
          <p className="text-xs text-muted-foreground mt-1">Dashboard financeiro completo com cobranças automáticas, faturas, pagamentos e renovações.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === tab.key ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:text-foreground"}`}>
            <tab.icon className="w-3.5 h-3.5" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Despesas", value: totalExpenses, color: "text-red-400", icon: ArrowDownRight, bg: "bg-red-500/10" },
              { label: "Total Receitas", value: totalRevenue, color: "text-green-400", icon: ArrowUpRight, bg: "bg-green-500/10" },
              { label: "Lucro Líquido", value: profit, color: profit >= 0 ? "text-green-400" : "text-red-400", icon: profit >= 0 ? TrendingUp : TrendingDown, bg: profit >= 0 ? "bg-green-500/10" : "bg-red-500/10" },
              { label: "Clientes Pagantes", value: 3, color: "text-primary", icon: Users, bg: "bg-primary/10", isCurrency: false },
            ].map((stat, i) => (
              <Card key={i} className="bg-card border-border"><CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    <p className={`text-xl font-bold mt-1 ${stat.color}`}>
                      {(stat as any).isCurrency === false ? stat.value : `R$ ${(stat.value as number).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.bg}`}><stat.icon className={`w-5 h-5 ${stat.color}`} /></div>
                </div>
              </CardContent></Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Receita vs Despesa (6 meses)</CardTitle></CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Area type="monotone" dataKey="receita" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
                    <Area type="monotone" dataKey="despesa" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" /> Gastos por Plataforma</CardTitle></CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={platformData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: R$${value}`}>
                    {platformData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `R$ ${v.toFixed(2)}`} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} /></PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods Accepted */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2"><CreditCard className="w-4 h-4 text-primary" /> Métodos de Pagamento Aceitos</CardTitle></CardHeader>
            <CardContent>
              <div className="flex gap-3">
                {[
                  { icon: QrCode, label: "PIX", desc: "Pagamento instantâneo" },
                  { icon: CreditCard, label: "Cartão de Crédito", desc: "Parcelamento disponível" },
                  { icon: CreditCard, label: "Cartão de Débito", desc: "Débito à vista" },
                ].map((m, i) => (
                  <div key={i} className="flex-1 p-3 rounded-lg bg-secondary/30 border border-border text-center">
                    <m.icon className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs font-semibold text-foreground">{m.label}</p>
                    <p className="text-[9px] text-muted-foreground">{m.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Records */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2"><Filter className="w-4 h-4 text-primary" /> Registros Recentes</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {records.map(r => (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${r.type === "expense" ? "bg-red-500/10" : "bg-green-500/10"}`}>
                        {r.type === "expense" ? <ArrowDownRight className="w-4 h-4 text-red-400" /> : <ArrowUpRight className="w-4 h-4 text-green-400" />}
                      </div>
                      <div><p className="text-xs font-medium text-foreground">{r.description}</p><p className="text-[10px] text-muted-foreground">{r.platform} • {r.date}</p></div>
                    </div>
                    <p className={`text-sm font-bold ${r.type === "expense" ? "text-red-400" : "text-green-400"}`}>{r.type === "expense" ? "-" : "+"}R$ {r.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Subscriptions Tab */}
      {activeTab === "subscriptions" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Assinaturas Ativas", value: demoSubscriptions.filter(s => s.status === "active").length, color: "text-green-400" },
              { label: "Suspensas", value: demoSubscriptions.filter(s => s.status === "suspended").length, color: "text-amber-400" },
              { label: "Receita Recorrente", value: `R$${demoSubscriptions.filter(s => s.status === "active").reduce((a, s) => a + s.amount, 0).toLocaleString()}`, color: "text-primary" },
              { label: "Auto-Renovação", value: `${demoSubscriptions.filter(s => s.autoRenew).length}/${demoSubscriptions.length}`, color: "text-accent" },
            ].map((s, i) => (
              <div key={i} className="p-3 rounded-xl border border-border bg-card text-center">
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-secondary/30">
                <th className="p-3 text-left text-xs text-muted-foreground">Cliente</th>
                <th className="p-3 text-left text-xs text-muted-foreground">Serviço</th>
                <th className="p-3 text-left text-xs text-muted-foreground">Valor</th>
                <th className="p-3 text-left text-xs text-muted-foreground">Pagamento</th>
                <th className="p-3 text-left text-xs text-muted-foreground">Próx. Cobrança</th>
                <th className="p-3 text-left text-xs text-muted-foreground">Status</th>
                <th className="p-3 text-left text-xs text-muted-foreground">Auto-Renovar</th>
              </tr></thead>
              <tbody>
                {demoSubscriptions.map(sub => (
                  <tr key={sub.id} className="border-b border-border/50 hover:bg-secondary/20">
                    <td className="p-3 text-xs font-semibold text-foreground">{sub.clientName}</td>
                    <td className="p-3 text-xs text-muted-foreground">{sub.service}</td>
                    <td className="p-3 text-xs text-primary font-bold">R$ {sub.amount.toLocaleString()}</td>
                    <td className="p-3 text-xs text-muted-foreground">{sub.paymentMethod}</td>
                    <td className="p-3 text-xs text-muted-foreground">{sub.nextBilling}</td>
                    <td className="p-3">
                      <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${sub.status === "active" ? "bg-green-500/10 text-green-400" : sub.status === "suspended" ? "bg-amber-500/10 text-amber-400" : "bg-destructive/10 text-destructive"}`}>
                        {sub.status === "active" ? "Ativa" : sub.status === "suspended" ? "Suspensa" : "Cancelada"}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] px-2 py-1 rounded-full ${sub.autoRenew ? "bg-green-500/10 text-green-400" : "bg-secondary text-muted-foreground"}`}>
                        {sub.autoRenew ? "✓ Sim" : "✗ Não"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === "invoices" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Faturas emitidas e status de pagamento</p>
            <Button size="sm" className="gap-1 text-xs" onClick={() => setShowNewInvoice(true)}><Plus className="w-3.5 h-3.5" /> Nova Fatura</Button>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-secondary/30">
                <th className="p-3 text-left text-xs text-muted-foreground">ID</th>
                <th className="p-3 text-left text-xs text-muted-foreground">Cliente</th>
                <th className="p-3 text-left text-xs text-muted-foreground">Serviço</th>
                <th className="p-3 text-left text-xs text-muted-foreground">Valor</th>
                <th className="p-3 text-left text-xs text-muted-foreground">Vencimento</th>
                <th className="p-3 text-left text-xs text-muted-foreground">Pagamento</th>
                <th className="p-3 text-left text-xs text-muted-foreground">Enviado via</th>
                <th className="p-3 text-left text-xs text-muted-foreground">Status</th>
              </tr></thead>
              <tbody>
                {demoInvoices.map(inv => {
                  const cfg = invoiceStatusConfig[inv.status];
                  const Icon = cfg.icon;
                  return (
                    <tr key={inv.id} className="border-b border-border/50 hover:bg-secondary/20">
                      <td className="p-3 text-xs font-mono text-primary">{inv.id}</td>
                      <td className="p-3 text-xs font-semibold text-foreground">{inv.clientName}</td>
                      <td className="p-3 text-xs text-muted-foreground">{inv.service}</td>
                      <td className="p-3 text-xs text-primary font-bold">R$ {inv.amount.toLocaleString()}</td>
                      <td className="p-3 text-xs text-muted-foreground">{inv.dueDate}</td>
                      <td className="p-3 text-xs text-muted-foreground">{inv.paymentMethod}</td>
                      <td className="p-3">
                        <div className="flex gap-1">{inv.sentVia.map(v => (
                          <span key={v} className="text-[9px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{v === "Email" ? "📧" : "💬"} {v}</span>
                        ))}</div>
                      </td>
                      <td className="p-3">
                        <span className={`flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full w-fit ${cfg.color}`}>
                          <Icon className="w-3 h-3" /> {cfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === "billing" && (
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2"><Send className="w-4 h-4 text-primary" /> Fluxo de Cobrança Automática</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 items-center text-[10px] mb-4">
                {["Criar Fatura", "→", "Enviar Email", "→", "Enviar WhatsApp", "→", "Aguardar Pagamento", "→", "Confirmar", "→", "Renovar Serviço"].map((step, i) => (
                  <span key={i} className={step === "→" ? "text-primary font-bold text-sm" : "px-3 py-1.5 rounded-lg bg-secondary border border-border text-foreground font-medium"}>{step}</span>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                  <Bell className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                  <p className="text-sm font-bold text-amber-400">3 dias</p>
                  <p className="text-[10px] text-muted-foreground">Aviso por Email + WhatsApp</p>
                  <p className="text-[9px] text-muted-foreground mt-1">"Seu pagamento vence em 3 dias"</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
                  <AlertTriangle className="w-4 h-4 mx-auto mb-1 text-primary" />
                  <p className="text-sm font-bold text-primary">7 dias</p>
                  <p className="text-[10px] text-muted-foreground">Suspensão do Serviço</p>
                  <p className="text-[9px] text-muted-foreground mt-1">"Serviço suspenso por falta de pagamento"</p>
                </div>
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-center">
                  <XCircle className="w-4 h-4 mx-auto mb-1 text-destructive" />
                  <p className="text-sm font-bold text-destructive">15 dias</p>
                  <p className="text-[10px] text-muted-foreground">Cancelamento Automático</p>
                  <p className="text-[9px] text-muted-foreground mt-1">"Contrato cancelado definitivamente"</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Templates */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2"><MessageSquare className="w-4 h-4 text-primary" /> Modelos de Notificação</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { type: "Email de Cobrança", channel: "📧 Email", template: "Olá {{cliente}}, sua fatura de R${{valor}} referente ao serviço {{servico}} vence em {{data}}. Pague via PIX: {{pix_key}} ou acesse o link de pagamento." },
                { type: "WhatsApp de Cobrança", channel: "💬 WhatsApp", template: "Olá {{cliente}}! 👋 Sua fatura de *R${{valor}}* vence em *{{data}}*. Pague via PIX ou cartão no link: {{link}}. Dúvidas? Responda aqui!" },
                { type: "Aviso de Suspensão", channel: "📧 + 💬", template: "⚠️ {{cliente}}, seu serviço {{servico}} será *suspenso em 24h* por falta de pagamento. Regularize agora: {{link}}" },
              ].map((n, i) => (
                <div key={i} className="p-3 rounded-lg bg-secondary/20 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-foreground">{n.type}</span>
                    <span className="text-[10px] text-primary">{n.channel}</span>
                  </div>
                  <p className="text-[11px] text-foreground/70 leading-relaxed font-mono bg-secondary/30 p-2 rounded">{n.template}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Config Tab */}
      {activeTab === "config" && (
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2"><Settings2 className="w-4 h-4 text-primary" /> Configuração de Cobrança</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-xs text-muted-foreground">Nome da Empresa</Label>
                  <Input value={billingConfig.companyName} onChange={e => setBillingConfig({ ...billingConfig, companyName: e.target.value })} className="bg-secondary/50 border-border mt-1" /></div>
                <div><Label className="text-xs text-muted-foreground">Chave PIX</Label>
                  <Input value={billingConfig.pixKey} onChange={e => setBillingConfig({ ...billingConfig, pixKey: e.target.value })} className="bg-secondary/50 border-border mt-1" placeholder="email@empresa.com" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><Label className="text-xs text-muted-foreground">Dias p/ Aviso</Label>
                  <Input value={billingConfig.reminderDays} onChange={e => setBillingConfig({ ...billingConfig, reminderDays: e.target.value })} className="bg-secondary/50 border-border mt-1" /></div>
                <div><Label className="text-xs text-muted-foreground">Dias p/ Suspensão</Label>
                  <Input value={billingConfig.suspensionDays} onChange={e => setBillingConfig({ ...billingConfig, suspensionDays: e.target.value })} className="bg-secondary/50 border-border mt-1" /></div>
                <div><Label className="text-xs text-muted-foreground">Dias p/ Cancelamento</Label>
                  <Input value={billingConfig.cancellationDays} onChange={e => setBillingConfig({ ...billingConfig, cancellationDays: e.target.value })} className="bg-secondary/50 border-border mt-1" /></div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs text-foreground">
                  <input type="checkbox" checked={billingConfig.emailNotify} onChange={e => setBillingConfig({ ...billingConfig, emailNotify: e.target.checked })} className="rounded border-border" />
                  📧 Notificar por Email
                </label>
                <label className="flex items-center gap-2 text-xs text-foreground">
                  <input type="checkbox" checked={billingConfig.whatsappNotify} onChange={e => setBillingConfig({ ...billingConfig, whatsappNotify: e.target.checked })} className="rounded border-border" />
                  💬 Notificar por WhatsApp
                </label>
              </div>
              <div><Label className="text-xs text-muted-foreground">Gateway de Pagamento</Label>
                <Select value={billingConfig.cardGateway} onValueChange={v => setBillingConfig({ ...billingConfig, cardGateway: v })}>
                  <SelectTrigger className="bg-secondary/50 border-border mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Stripe", "Mercado Pago", "Asaas", "Pagar.me"].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => toast.success("Configuração de cobrança salva!")} className="w-full">Salvar Configuração</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
