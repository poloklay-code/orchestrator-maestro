import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DollarSign, TrendingUp, TrendingDown, Plus, ArrowUpRight, ArrowDownRight, Filter, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const PLATFORMS = ["Google Ads", "Meta Ads", "TikTok Ads", "LinkedIn Ads", "Hotmart", "Monetizze", "Eduzz", "Kiwify", "n8n", "Make", "ManyChat", "OpenAI", "Outros"];
const CATEGORIES = ["trafego_pago", "trafego_organico", "automacao", "ia", "ferramentas", "afiliados", "outros"];
const PIE_COLORS = ["#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef"];

type FinancialRecord = { id: string; platform: string; type: string; amount: number; description: string; category: string; date: string; clientName?: string; };

const demoRecords: FinancialRecord[] = [
  { id: "1", platform: "Meta Ads", type: "expense", amount: 5200, description: "Campanha Facebook Q1", category: "trafego_pago", date: "2026-03-10", clientName: "João Silva" },
  { id: "2", platform: "Google Ads", type: "expense", amount: 3800, description: "Search + Display", category: "trafego_pago", date: "2026-03-09", clientName: "Maria Santos" },
  { id: "3", platform: "Hotmart", type: "revenue", amount: 12500, description: "Vendas curso digital", category: "afiliados", date: "2026-03-08", clientName: "João Silva" },
  { id: "4", platform: "n8n", type: "expense", amount: 150, description: "Licença mensal", category: "ferramentas", date: "2026-03-07", clientName: null },
  { id: "5", platform: "OpenAI", type: "expense", amount: 320, description: "API GPT-4", category: "ia", date: "2026-03-06", clientName: null },
];

const demoClients = [{ id: "1", name: "João Silva" }, { id: "2", name: "Maria Santos" }];

export default function FinancialPanel() {
  const [records, setRecords] = useState<FinancialRecord[]>(demoRecords);
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ client_id: "", platform: "", type: "expense", amount: "", description: "", category: "trafego_pago" });

  const filtered = filterPlatform === "all" ? records : records.filter(r => r.platform === filterPlatform);
  const totalExpenses = filtered.filter(r => r.type === "expense").reduce((s, r) => s + r.amount, 0);
  const totalRevenue = filtered.filter(r => r.type === "revenue").reduce((s, r) => s + r.amount, 0);
  const profit = totalRevenue - totalExpenses;

  const platformData = Object.entries(
    filtered.filter(r => r.type === "expense").reduce((acc, r) => { acc[r.platform] = (acc[r.platform] || 0) + r.amount; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name: name.length > 12 ? name.slice(0, 12) + ".." : name, value }));

  const handleSubmit = () => {
    if (!form.platform || !form.amount) { toast.error("Preencha todos os campos obrigatórios"); return; }
    const clientName = demoClients.find(c => c.id === form.client_id)?.name;
    setRecords([{ id: Date.now().toString(), platform: form.platform, type: form.type, amount: parseFloat(form.amount), description: form.description, category: form.category, date: new Date().toISOString().split("T")[0], clientName }, ...records]);
    toast.success("Registro financeiro salvo");
    setForm({ client_id: "", platform: "", type: "expense", amount: "", description: "", category: "trafego_pago" });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><DollarSign className="w-5 h-5 text-primary" /> Sistema Financeiro</h2>
          <p className="text-xs text-muted-foreground mt-1">Monitoramento de gastos e receitas por cliente e plataforma</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={filterPlatform} onValueChange={setFilterPlatform}>
            <SelectTrigger className="w-40 h-8 text-xs bg-secondary/50 border-border"><SelectValue placeholder="Plataforma" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Plataformas</SelectItem>
              {PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="sm" className="h-8 gap-1 text-xs"><Plus className="w-3.5 h-3.5" />Novo Registro</Button></DialogTrigger>
            <DialogContent className="bg-card border-border max-w-md">
              <DialogHeader><DialogTitle className="text-foreground">Novo Registro Financeiro</DialogTitle></DialogHeader>
              <div className="grid gap-3 mt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs text-muted-foreground">Cliente</Label>
                    <Select value={form.client_id} onValueChange={v => setForm({ ...form, client_id: v })}>
                      <SelectTrigger className="bg-secondary/50 border-border mt-1"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{demoClients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label className="text-xs text-muted-foreground">Tipo *</Label>
                    <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                      <SelectTrigger className="bg-secondary/50 border-border mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="expense">Despesa</SelectItem><SelectItem value="revenue">Receita</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs text-muted-foreground">Plataforma *</Label>
                    <Select value={form.platform} onValueChange={v => setForm({ ...form, platform: v })}>
                      <SelectTrigger className="bg-secondary/50 border-border mt-1"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label className="text-xs text-muted-foreground">Categoria</Label>
                    <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                      <SelectTrigger className="bg-secondary/50 border-border mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace("_", " ")}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label className="text-xs text-muted-foreground">Valor (R$) *</Label>
                  <Input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="bg-secondary/50 border-border mt-1" placeholder="0.00" />
                </div>
                <div><Label className="text-xs text-muted-foreground">Descrição</Label>
                  <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="bg-secondary/50 border-border mt-1" placeholder="Descrição do registro" />
                </div>
                <Button onClick={handleSubmit} className="w-full mt-2">Salvar Registro</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card border-border"><CardContent className="p-4">
          <div className="flex items-center justify-between"><div><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Despesas</p><p className="text-xl font-bold text-red-400 mt-1">R$ {totalExpenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p></div>
          <div className="p-2 bg-red-500/10 rounded-lg"><ArrowDownRight className="w-5 h-5 text-red-400" /></div></div>
        </CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4">
          <div className="flex items-center justify-between"><div><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Receitas</p><p className="text-xl font-bold text-green-400 mt-1">R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p></div>
          <div className="p-2 bg-green-500/10 rounded-lg"><ArrowUpRight className="w-5 h-5 text-green-400" /></div></div>
        </CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4">
          <div className="flex items-center justify-between"><div><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Lucro / Prejuízo</p><p className={`text-xl font-bold mt-1 ${profit >= 0 ? "text-green-400" : "text-red-400"}`}>R$ {profit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p></div>
          <div className={`p-2 rounded-lg ${profit >= 0 ? "bg-green-500/10" : "bg-red-500/10"}`}>{profit >= 0 ? <TrendingUp className="w-5 h-5 text-green-400" /> : <TrendingDown className="w-5 h-5 text-red-400" />}</div></div>
        </CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" />Gastos por Plataforma</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={platformData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: R$${value.toFixed(0)}`}>{platformData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}</Pie>
              <Tooltip formatter={(v: number) => `R$ ${v.toFixed(2)}`} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} /></PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2"><Filter className="w-4 h-4 text-primary" />Registros Recentes</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {filtered.map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${r.type === "expense" ? "bg-red-500/10" : "bg-green-500/10"}`}>
                      {r.type === "expense" ? <ArrowDownRight className="w-4 h-4 text-red-400" /> : <ArrowUpRight className="w-4 h-4 text-green-400" />}
                    </div>
                    <div><p className="text-xs font-medium text-foreground">{r.description || r.platform}</p><p className="text-[10px] text-muted-foreground">{r.clientName || "N/A"} - {r.platform}</p></div>
                  </div>
                  <p className={`text-sm font-bold ${r.type === "expense" ? "text-red-400" : "text-green-400"}`}>{r.type === "expense" ? "-" : "+"}R$ {r.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
