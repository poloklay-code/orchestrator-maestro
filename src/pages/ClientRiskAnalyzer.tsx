import { useState } from "react";
import {
  ShieldAlert, Users, CheckCircle2, AlertTriangle, XCircle, TrendingUp,
  DollarSign, Clock, BarChart3, Eye, Calendar, CreditCard
} from "lucide-react";

interface ClientRisk {
  id: string;
  name: string;
  risk: "low" | "medium" | "high";
  score: number;
  monthlyValue: string;
  paymentHistory: { onTime: number; late: number; missed: number };
  avgDelay: number;
  contractSince: string;
  lastPayment: string;
  services: string[];
  alerts: string[];
}

const clients: ClientRisk[] = [
  {
    id: "1", name: "Tech Solutions", risk: "low", score: 95, monthlyValue: "R$ 4.500",
    paymentHistory: { onTime: 12, late: 0, missed: 0 }, avgDelay: 0, contractSince: "2025-03-01",
    lastPayment: "2026-03-05", services: ["Tráfego", "Automação"], alerts: [],
  },
  {
    id: "2", name: "StartupXYZ", risk: "low", score: 88, monthlyValue: "R$ 3.200",
    paymentHistory: { onTime: 10, late: 1, missed: 0 }, avgDelay: 2, contractSince: "2025-05-01",
    lastPayment: "2026-03-07", services: ["Automação", "Email Marketing"], alerts: [],
  },
  {
    id: "3", name: "E-commerce Plus", risk: "medium", score: 65, monthlyValue: "R$ 8.000",
    paymentHistory: { onTime: 6, late: 4, missed: 1 }, avgDelay: 8, contractSince: "2025-08-01",
    lastPayment: "2026-02-20", services: ["Marketing 360°"], alerts: ["Pagamento de março pendente", "3 atrasos nos últimos 6 meses"],
  },
  {
    id: "4", name: "Clínica Saúde", risk: "medium", score: 60, monthlyValue: "R$ 2.000",
    paymentHistory: { onTime: 4, late: 3, missed: 1 }, avgDelay: 10, contractSince: "2025-10-01",
    lastPayment: "2026-02-15", services: ["SEO Local", "Google Business"], alerts: ["Tendência de atraso crescente"],
  },
  {
    id: "5", name: "InfoProduto BR", risk: "high", score: 30, monthlyValue: "R$ 5.000",
    paymentHistory: { onTime: 2, late: 3, missed: 3 }, avgDelay: 18, contractSince: "2025-09-01",
    lastPayment: "2026-01-10", services: ["Funil", "Tráfego", "Copy"], alerts: ["2 meses sem pagar", "Contrato em risco de cancelamento", "Cobranças automáticas falharam"],
  },
  {
    id: "6", name: "Moda Fashion", risk: "low", score: 92, monthlyValue: "R$ 6.000",
    paymentHistory: { onTime: 8, late: 0, missed: 0 }, avgDelay: 0, contractSince: "2025-07-01",
    lastPayment: "2026-03-01", services: ["E-commerce", "Social Media", "Tráfego"], alerts: [],
  },
];

const riskConfig = {
  low: { label: "Confiável", color: "text-green-400 bg-green-500/10", icon: CheckCircle2, border: "border-green-500/20" },
  medium: { label: "Médio", color: "text-amber-400 bg-amber-500/10", icon: AlertTriangle, border: "border-amber-500/20" },
  high: { label: "Alto Risco", color: "text-destructive bg-destructive/10", icon: XCircle, border: "border-destructive/20" },
};

export default function ClientRiskAnalyzer() {
  const [selectedRisk, setSelectedRisk] = useState<string>("all");

  const filtered = selectedRisk === "all" ? clients : clients.filter(c => c.risk === selectedRisk);

  const totalRevenue = clients.reduce((a, c) => a + parseInt(c.monthlyValue.replace(/\D/g, "")), 0);
  const atRiskRevenue = clients.filter(c => c.risk === "high").reduce((a, c) => a + parseInt(c.monthlyValue.replace(/\D/g, "")), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <ShieldAlert className="w-7 h-7 text-primary" /> Client Risk Analyzer
        </h1>
        <p className="text-sm text-muted-foreground mt-1">IA que analisa risco de clientes baseado em histórico de pagamento, atrasos e comportamento.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <Users className="w-5 h-5 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold text-foreground">{clients.length}</p>
          <p className="text-[10px] text-muted-foreground">Clientes Analisados</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <CheckCircle2 className="w-5 h-5 mx-auto mb-2 text-green-400" />
          <p className="text-2xl font-bold text-green-400">{clients.filter(c => c.risk === "low").length}</p>
          <p className="text-[10px] text-muted-foreground">Confiáveis</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <XCircle className="w-5 h-5 mx-auto mb-2 text-destructive" />
          <p className="text-2xl font-bold text-destructive">{clients.filter(c => c.risk === "high").length}</p>
          <p className="text-[10px] text-muted-foreground">Alto Risco</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <DollarSign className="w-5 h-5 mx-auto mb-2 text-amber-400" />
          <p className="text-2xl font-bold text-amber-400">R$ {atRiskRevenue.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Receita em Risco</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "low", "medium", "high"].map((f) => (
          <button
            key={f}
            onClick={() => setSelectedRisk(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedRisk === f ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "all" ? "Todos" : riskConfig[f as keyof typeof riskConfig].label}
          </button>
        ))}
      </div>

      {/* Client Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((client) => {
          const cfg = riskConfig[client.risk];
          const Icon = cfg.icon;
          const total = client.paymentHistory.onTime + client.paymentHistory.late + client.paymentHistory.missed;
          const onTimePercent = total > 0 ? (client.paymentHistory.onTime / total * 100) : 0;

          return (
            <div key={client.id} className={`rounded-xl border bg-card p-5 ${cfg.border}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{client.name}</h3>
                  <p className="text-[10px] text-muted-foreground">{client.services.join(", ")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-center">
                    <p className={`text-lg font-bold ${client.score >= 70 ? "text-green-400" : client.score >= 40 ? "text-amber-400" : "text-destructive"}`}>{client.score}</p>
                    <p className="text-[8px] text-muted-foreground">Score</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-medium flex items-center gap-1 ${cfg.color}`}>
                    <Icon className="w-3 h-3" /> {cfg.label}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 rounded-lg bg-green-500/5 border border-green-500/10">
                  <p className="text-sm font-bold text-green-400">{client.paymentHistory.onTime}</p>
                  <p className="text-[9px] text-muted-foreground">Em dia</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
                  <p className="text-sm font-bold text-amber-400">{client.paymentHistory.late}</p>
                  <p className="text-[9px] text-muted-foreground">Atrasados</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-destructive/5 border border-destructive/10">
                  <p className="text-sm font-bold text-destructive">{client.paymentHistory.missed}</p>
                  <p className="text-[9px] text-muted-foreground">Não pagos</p>
                </div>
              </div>

              {/* Payment Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-[9px] text-muted-foreground mb-1">
                  <span>Pontualidade</span>
                  <span>{onTimePercent.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-green-400 rounded-full" style={{ width: `${onTimePercent}%` }} />
                </div>
              </div>

              <div className="flex justify-between text-[10px] text-muted-foreground mb-2">
                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {client.monthlyValue}/mês</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Atraso médio: {client.avgDelay}d</span>
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Desde: {client.contractSince}</span>
                <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> Último: {client.lastPayment}</span>
              </div>

              {client.alerts.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border space-y-1">
                  {client.alerts.map((alert, i) => (
                    <p key={i} className="text-[10px] text-destructive flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 flex-shrink-0" /> {alert}
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
