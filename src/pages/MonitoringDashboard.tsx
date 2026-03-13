import { useState } from "react";
import { toast } from "sonner";
import { Plus, Activity, Cpu, Clock, Zap, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Monitor {
  id: string;
  ai_name: string;
  status: string;
  response_time_ms: number;
  tokens_used: number;
  errors: number;
  uptime_percent: number;
}

const initialMonitors: Monitor[] = Array.from({ length: 20 }, (_, i) => ({
  id: String(i + 1),
  ai_name: `IA-Agent-${String(i + 1).padStart(3, "0")}`,
  status: i < 16 ? "online" : i < 18 ? "warning" : "offline",
  response_time_ms: 80 + Math.floor(Math.random() * 200),
  tokens_used: Math.floor(Math.random() * 50000),
  errors: i >= 18 ? Math.floor(Math.random() * 5) : 0,
  uptime_percent: i < 16 ? 99 + Math.random() : 85 + Math.random() * 10,
}));

export default function MonitoringDashboard() {
  const [monitors, setMonitors] = useState(initialMonitors);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ai_name: "", status: "online" });

  const totalOnline = monitors.filter((m) => m.status === "online").length;
  const totalOffline = monitors.filter((m) => m.status === "offline").length;
  const avgUptime = (monitors.reduce((a, b) => a + b.uptime_percent, 0) / monitors.length).toFixed(1);
  const avgResponse = Math.round(monitors.reduce((a, b) => a + b.response_time_ms, 0) / monitors.length);

  const statusData = [
    { name: "Online", value: totalOnline, fill: "hsl(var(--ai-active))" },
    { name: "Offline", value: totalOffline, fill: "hsl(var(--destructive))" },
    { name: "Warning", value: monitors.filter((m) => m.status === "warning").length, fill: "hsl(var(--ai-processing))" },
  ].filter((d) => d.value > 0);

  const responseData = monitors.slice(0, 8).map((m) => ({
    name: m.ai_name.slice(-7),
    tempo: m.response_time_ms,
  }));

  const handleSave = () => {
    if (!form.ai_name) { toast.error("Nome da IA obrigatorio"); return; }
    const newMonitor: Monitor = {
      id: Date.now().toString(),
      ai_name: form.ai_name,
      status: form.status,
      response_time_ms: 120,
      tokens_used: 0,
      errors: 0,
      uptime_percent: 100,
    };
    setMonitors([newMonitor, ...monitors]);
    setShowForm(false);
    setForm({ ai_name: "", status: "online" });
    toast.success("IA registrada");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "IAs Online", value: totalOnline, icon: CheckCircle2, color: "text-ai-active" },
          { label: "IAs Offline", value: totalOffline, icon: XCircle, color: "text-destructive" },
          { label: "Uptime Medio", value: `${avgUptime}%`, icon: Activity, color: "text-accent" },
          { label: "Resp. Medio", value: `${avgResponse}ms`, icon: Clock, color: "text-ai-processing" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${s.color}`} />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Status das IAs</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                {statusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Tempo de Resposta por IA</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={responseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
              <Bar dataKey="tempo" fill="hsl(var(--ai-active))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">IAs Monitoradas ({monitors.length})</h3>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90">
          <Plus className="w-3.5 h-3.5" /> Registrar IA
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Registrar IA</h2>
            <input value={form.ai_name} onChange={(e) => setForm({ ...form, ai_name: e.target.value })}
              className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Nome da IA" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="warning">Warning</option>
            </select>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted-foreground">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Registrar</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {monitors.map((m) => (
          <div key={m.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${m.status === "online" ? "bg-ai-active glow-pulse" : m.status === "warning" ? "bg-ai-processing" : "bg-destructive"}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{m.ai_name}</p>
              <p className="text-xs text-muted-foreground">{m.status === "online" ? "Operacional" : m.status === "warning" ? "Atenção" : "Inativo"}</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{m.response_time_ms}ms</span>
              <span className="flex items-center gap-1 hidden sm:flex"><Zap className="w-3 h-3" />{m.tokens_used.toLocaleString()} tok</span>
              <span className="flex items-center gap-1"><Activity className="w-3 h-3" />{m.uptime_percent.toFixed(1)}%</span>
              {m.errors > 0 && <span className="flex items-center gap-1 text-destructive"><AlertTriangle className="w-3 h-3" />{m.errors}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
