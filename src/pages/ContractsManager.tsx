import { useState } from "react";
import {
  FileSignature, FileText, CheckCircle2, Clock, AlertTriangle, Send,
  Download, Plus, Users, DollarSign, Calendar, Shield, Pen, Eye
} from "lucide-react";

interface Contract {
  id: string;
  client: string;
  type: string;
  value: string;
  status: "draft" | "sent" | "signed" | "expired" | "cancelled";
  createdAt: string;
  signedAt?: string;
  expiresAt: string;
  signPlatform: string;
  services: string[];
}

const contracts: Contract[] = [
  { id: "CTR-001", client: "Tech Solutions", type: "Gestão de Tráfego + Automação", value: "R$ 4.500/mês", status: "signed", createdAt: "2026-01-15", signedAt: "2026-01-16", expiresAt: "2027-01-15", signPlatform: "Clicksign", services: ["Google Ads", "Meta Ads", "n8n Automação"] },
  { id: "CTR-002", client: "StartupXYZ", type: "Automação Completa", value: "R$ 3.200/mês", status: "signed", createdAt: "2026-02-01", signedAt: "2026-02-03", expiresAt: "2027-02-01", signPlatform: "DocuSign", services: ["n8n", "ManyChat", "Email Marketing"] },
  { id: "CTR-003", client: "E-commerce Plus", type: "Marketing 360°", value: "R$ 8.000/mês", status: "sent", createdAt: "2026-03-10", expiresAt: "2027-03-10", signPlatform: "ZapSign", services: ["Tráfego", "Social Media", "Copywriting", "Automação"] },
  { id: "CTR-004", client: "Clínica Saúde", type: "Google Meu Negócio + SEO", value: "R$ 2.000/mês", status: "draft", createdAt: "2026-03-14", expiresAt: "2027-03-14", signPlatform: "Autentique", services: ["SEO Local", "Google Business", "Avaliações"] },
  { id: "CTR-005", client: "Restaurante Sabor", type: "Social Media", value: "R$ 1.500/mês", status: "expired", createdAt: "2025-03-01", signedAt: "2025-03-02", expiresAt: "2026-03-01", signPlatform: "Clicksign", services: ["Instagram", "TikTok"] },
  { id: "CTR-006", client: "Fitness Pro", type: "Funil Completo", value: "R$ 5.000/mês", status: "cancelled", createdAt: "2026-02-15", expiresAt: "2027-02-15", signPlatform: "DocuSign", services: ["Landing Page", "Email", "Tráfego"] },
];

const statusConfig = {
  draft: { label: "Rascunho", color: "text-muted-foreground bg-secondary", icon: Pen },
  sent: { label: "Enviado", color: "text-accent bg-accent/10", icon: Send },
  signed: { label: "Assinado", color: "text-green-400 bg-green-500/10", icon: CheckCircle2 },
  expired: { label: "Expirado", color: "text-amber-400 bg-amber-500/10", icon: Clock },
  cancelled: { label: "Cancelado", color: "text-destructive bg-destructive/10", icon: AlertTriangle },
};

export default function ContractsManager() {
  const [filter, setFilter] = useState<string>("all");
  const [showCreate, setShowCreate] = useState(false);

  const filtered = filter === "all" ? contracts : contracts.filter(c => c.status === filter);

  const stats = {
    total: contracts.length,
    signed: contracts.filter(c => c.status === "signed").length,
    pending: contracts.filter(c => c.status === "sent" || c.status === "draft").length,
    revenue: "R$ 24.200",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <FileSignature className="w-7 h-7 text-primary" /> Contratos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Geração automática, assinatura digital e gestão de contratos com IA.</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" /> Gerar Contrato
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <FileText className="w-5 h-5 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          <p className="text-[10px] text-muted-foreground">Total</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <CheckCircle2 className="w-5 h-5 mx-auto mb-2 text-green-400" />
          <p className="text-2xl font-bold text-green-400">{stats.signed}</p>
          <p className="text-[10px] text-muted-foreground">Assinados</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <Clock className="w-5 h-5 mx-auto mb-2 text-accent" />
          <p className="text-2xl font-bold text-accent">{stats.pending}</p>
          <p className="text-[10px] text-muted-foreground">Pendentes</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <DollarSign className="w-5 h-5 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold text-primary">{stats.revenue}</p>
          <p className="text-[10px] text-muted-foreground">Receita Mensal</p>
        </div>
      </div>

      {/* Signature Platforms */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" /> Plataformas de Assinatura Digital
        </h3>
        <div className="flex flex-wrap gap-3">
          {["Clicksign", "Autentique", "DocuSign", "ZapSign"].map((p) => (
            <span key={p} className="px-4 py-2 rounded-lg bg-secondary/50 border border-border text-xs text-foreground font-medium">{p}</span>
          ))}
        </div>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Gerar Novo Contrato com IA</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-muted-foreground font-semibold uppercase">Cliente</label>
              <select className="w-full mt-1 p-2 rounded-lg bg-card border border-border text-sm text-foreground">
                <option>Selecionar cliente...</option>
                <option>Tech Solutions</option>
                <option>StartupXYZ</option>
                <option>E-commerce Plus</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground font-semibold uppercase">Tipo de Contrato</label>
              <select className="w-full mt-1 p-2 rounded-lg bg-card border border-border text-sm text-foreground">
                <option>Gestão de Tráfego</option>
                <option>Automação Completa</option>
                <option>Marketing 360°</option>
                <option>Social Media</option>
                <option>Personalizado</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground font-semibold uppercase">Valor Mensal</label>
              <input className="w-full mt-1 p-2 rounded-lg bg-card border border-border text-sm text-foreground" placeholder="R$ 0,00" />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground font-semibold uppercase">Plataforma de Assinatura</label>
              <select className="w-full mt-1 p-2 rounded-lg bg-card border border-border text-sm text-foreground">
                <option>Clicksign</option>
                <option>DocuSign</option>
                <option>ZapSign</option>
                <option>Autentique</option>
              </select>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:opacity-90">
            <Pen className="w-4 h-4" /> Gerar com IA
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "draft", "sent", "signed", "expired", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "all" ? "Todos" : statusConfig[f as keyof typeof statusConfig].label}
          </button>
        ))}
      </div>

      {/* Contracts Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="p-3 text-left text-xs text-muted-foreground">ID</th>
                <th className="p-3 text-left text-xs text-muted-foreground">Cliente</th>
                <th className="p-3 text-left text-xs text-muted-foreground">Tipo</th>
                <th className="p-3 text-left text-xs text-muted-foreground">Valor</th>
                <th className="p-3 text-left text-xs text-muted-foreground">Status</th>
                <th className="p-3 text-left text-xs text-muted-foreground">Plataforma</th>
                <th className="p-3 text-left text-xs text-muted-foreground">Vencimento</th>
                <th className="p-3 text-left text-xs text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const cfg = statusConfig[c.status];
                const Icon = cfg.icon;
                return (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/20">
                    <td className="p-3 text-xs font-mono text-primary">{c.id}</td>
                    <td className="p-3 text-xs font-semibold text-foreground">{c.client}</td>
                    <td className="p-3 text-xs text-muted-foreground">{c.type}</td>
                    <td className="p-3 text-xs text-primary font-bold">{c.value}</td>
                    <td className="p-3">
                      <span className={`flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full w-fit ${cfg.color}`}>
                        <Icon className="w-3 h-3" /> {cfg.label}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">{c.signPlatform}</td>
                    <td className="p-3 text-xs text-muted-foreground">{c.expiresAt}</td>
                    <td className="p-3 flex gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground"><Download className="w-3.5 h-3.5" /></button>
                      {c.status === "draft" && <button className="p-1.5 rounded-lg hover:bg-accent/10 text-accent"><Send className="w-3.5 h-3.5" /></button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Auto Billing Flow */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" /> Fluxo de Cobrança Automática
        </h3>
        <div className="flex flex-wrap gap-2 items-center text-[10px]">
          {["Criar Fatura", "→", "Enviar Email", "→", "Enviar WhatsApp", "→", "Aguardar Pagamento", "→", "Confirmar", "→", "Renovar Serviço"].map((step, i) => (
            <span key={i} className={step === "→" ? "text-primary font-bold" : "px-2 py-1 rounded-lg bg-card border border-border text-foreground"}>{step}</span>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
            <p className="text-[10px] text-amber-400 font-semibold">3 dias</p>
            <p className="text-[9px] text-muted-foreground">Aviso</p>
          </div>
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-center">
            <p className="text-[10px] text-primary font-semibold">7 dias</p>
            <p className="text-[9px] text-muted-foreground">Suspensão</p>
          </div>
          <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20 text-center">
            <p className="text-[10px] text-destructive font-semibold">15 dias</p>
            <p className="text-[9px] text-muted-foreground">Cancelamento</p>
          </div>
        </div>
      </div>
    </div>
  );
}
