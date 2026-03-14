import { useState } from "react";
import {
  Calculator, TrendingUp, DollarSign, Users, Target, BarChart3,
  ArrowUpRight, Zap
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";

export default function ROISimulator() {
  const [investment, setInvestment] = useState(5000);
  const [conversionRate, setConversionRate] = useState(3);
  const [ticketMedio, setTicketMedio] = useState(500);
  const [cpl, setCpl] = useState(15);

  const leads = Math.round(investment / cpl);
  const conversions = Math.round(leads * (conversionRate / 100));
  const revenue = conversions * ticketMedio;
  const roi = investment > 0 ? ((revenue - investment) / investment * 100) : 0;
  const profit = revenue - investment;

  const projectionData = Array.from({ length: 6 }, (_, i) => {
    const month = i + 1;
    const scale = 1 + (i * 0.15);
    const inv = Math.round(investment * scale);
    const ld = Math.round(inv / cpl);
    const conv = Math.round(ld * (conversionRate / 100));
    const rev = conv * ticketMedio;
    return { name: `Mês ${month}`, investimento: inv, receita: rev, leads: ld, lucro: rev - inv };
  });

  const funnelData = [
    { name: "Impressões", value: leads * 50 },
    { name: "Cliques", value: leads * 10 },
    { name: "Leads", value: leads },
    { name: "Qualificados", value: Math.round(leads * 0.4) },
    { name: "Vendas", value: conversions },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Calculator className="w-7 h-7 text-primary" /> ROI Simulator
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Simulador inteligente de retorno sobre investimento com projeções e funil de conversão.</p>
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: "Investimento Mensal", value: investment, setter: setInvestment, prefix: "R$", min: 500, max: 100000, step: 500 },
          { label: "Taxa de Conversão", value: conversionRate, setter: setConversionRate, prefix: "%", min: 0.5, max: 20, step: 0.5 },
          { label: "Ticket Médio", value: ticketMedio, setter: setTicketMedio, prefix: "R$", min: 50, max: 10000, step: 50 },
          { label: "Custo por Lead", value: cpl, setter: setCpl, prefix: "R$", min: 1, max: 200, step: 1 },
        ].map((ctrl) => (
          <div key={ctrl.label} className="rounded-xl border border-border bg-card p-4">
            <label className="text-[10px] text-muted-foreground font-semibold uppercase">{ctrl.label}</label>
            <p className="text-xl font-bold text-foreground mt-1">{ctrl.prefix} {ctrl.value.toLocaleString()}</p>
            <input
              type="range"
              min={ctrl.min}
              max={ctrl.max}
              step={ctrl.step}
              value={ctrl.value}
              onChange={(e) => ctrl.setter(Number(e.target.value))}
              className="w-full mt-2 accent-primary"
            />
          </div>
        ))}
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Leads Gerados", value: leads.toLocaleString(), icon: Users, color: "text-accent" },
          { label: "Conversões", value: conversions.toLocaleString(), icon: Target, color: "text-green-400" },
          { label: "Receita", value: `R$ ${revenue.toLocaleString()}`, icon: DollarSign, color: "text-primary" },
          { label: "Lucro", value: `R$ ${profit.toLocaleString()}`, icon: TrendingUp, color: profit > 0 ? "text-green-400" : "text-destructive" },
          { label: "ROI", value: `${roi.toFixed(0)}%`, icon: ArrowUpRight, color: roi > 0 ? "text-green-400" : "text-destructive" },
        ].map((r) => (
          <div key={r.label} className="rounded-xl border border-border bg-card p-4 text-center">
            <r.icon className={`w-5 h-5 mx-auto mb-2 ${r.color}`} />
            <p className="text-lg font-bold text-foreground">{r.value}</p>
            <p className="text-[10px] text-muted-foreground">{r.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Projeção de Crescimento (6 Meses)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
              <Area type="monotone" dataKey="receita" fill="hsl(var(--ai-active) / 0.2)" stroke="hsl(var(--ai-active))" strokeWidth={2} />
              <Area type="monotone" dataKey="investimento" fill="hsl(var(--primary) / 0.2)" stroke="hsl(var(--primary))" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Funil de Conversão</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={funnelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} width={90} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Projection Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Mês</th>
              <th className="p-3 text-right text-xs font-semibold text-muted-foreground">Investimento</th>
              <th className="p-3 text-right text-xs font-semibold text-muted-foreground">Leads</th>
              <th className="p-3 text-right text-xs font-semibold text-muted-foreground">Receita</th>
              <th className="p-3 text-right text-xs font-semibold text-muted-foreground">Lucro</th>
              <th className="p-3 text-right text-xs font-semibold text-muted-foreground">ROI</th>
            </tr>
          </thead>
          <tbody>
            {projectionData.map((row) => (
              <tr key={row.name} className="border-b border-border/50 hover:bg-secondary/20">
                <td className="p-3 text-xs text-foreground">{row.name}</td>
                <td className="p-3 text-xs text-right text-muted-foreground">R$ {row.investimento.toLocaleString()}</td>
                <td className="p-3 text-xs text-right text-accent">{row.leads}</td>
                <td className="p-3 text-xs text-right text-green-400">R$ {row.receita.toLocaleString()}</td>
                <td className={`p-3 text-xs text-right font-semibold ${row.lucro > 0 ? "text-green-400" : "text-destructive"}`}>R$ {row.lucro.toLocaleString()}</td>
                <td className="p-3 text-xs text-right text-primary">{row.investimento > 0 ? ((row.receita - row.investimento) / row.investimento * 100).toFixed(0) : 0}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
