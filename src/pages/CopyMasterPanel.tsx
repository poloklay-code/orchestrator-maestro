import { useState } from "react";
import { toast } from "sonner";
import { PenTool, Zap, Shield, Copy, BarChart3, Target, RefreshCw } from "lucide-react";

const CHANNELS = ["Facebook Ads", "Google Ads", "Instagram", "WhatsApp", "Email", "Landing Page", "YouTube"];
const OBJECTIVES = ["Conversão", "Tráfego", "Engajamento", "Remarketing", "Branding", "Lead Gen"];

interface CopyAsset {
  id: string; channel: string; objective: string; version: "A" | "B"; content: string; lowRisk: boolean; performance: number | null;
}

export default function CopyMasterPanel() {
  const [channel, setChannel] = useState("Facebook Ads");
  const [objective, setObjective] = useState("Conversão");
  const [generating, setGenerating] = useState(false);
  const [copies, setCopies] = useState<CopyAsset[]>([
    { id: "1", channel: "Facebook Ads", objective: "Conversão", version: "A", content: "Você está cansado de perder vendas? Descubra o método que já ajudou +500 empresas a faturar 3x mais. Clique e veja como funciona.", lowRisk: false, performance: 4.2 },
    { id: "2", channel: "Facebook Ads", objective: "Conversão", version: "B", content: "Empresas inteligentes estão usando este método para crescer de forma previsível. Veja como aplicar no seu negócio hoje.", lowRisk: true, performance: 3.8 },
    { id: "3", channel: "WhatsApp", objective: "Lead Gen", version: "A", content: "Oi! Vi que você se interessou pelo nosso material. Posso te enviar o conteúdo completo? Responda SIM que mando agora.", lowRisk: true, performance: 6.1 },
  ]);
  const [verbaCalc, setVerbaCalc] = useState({ meta: 0, cpaEstimado: 0 });

  const filteredCopies = copies.filter((c) => c.channel === channel);
  const verbaRecomendada = verbaCalc.meta > 0 && verbaCalc.cpaEstimado > 0 ? Math.round((verbaCalc.meta * verbaCalc.cpaEstimado) * 1.25) : 0;
  const verbaMax = verbaCalc.meta > 0 && verbaCalc.cpaEstimado > 0 ? Math.round((verbaCalc.meta * verbaCalc.cpaEstimado) * 1.3) : 0;

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));
    const newA: CopyAsset = { id: Date.now().toString(), channel, objective, version: "A", lowRisk: false, performance: null, content: `[Versão A - ${channel}/${objective}] Copy gerada pela IA COPYMASTER com foco em performance e conversão. Mensagem persuasiva adaptada ao canal e objetivo selecionado.` };
    const newB: CopyAsset = { id: (Date.now() + 1).toString(), channel, objective, version: "B", lowRisk: true, performance: null, content: `[Versão B - Baixo Risco] Copy conservadora que respeita todas as políticas da plataforma. Linguagem natural e humanizada sem gatilhos agressivos.` };
    setCopies([newA, newB, ...copies]);
    setGenerating(false);
    toast.success("Variações A/B geradas!");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-4"><PenTool className="w-4 h-4 text-primary" /><h3 className="text-sm font-semibold text-foreground">Gerador de Copy & Criativos</h3></div>
        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Canal</label>
            <select value={channel} onChange={(e) => setChannel(e.target.value)} className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
              {CHANNELS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Objetivo</label>
            <select value={objective} onChange={(e) => setObjective(e.target.value)} className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
              {OBJECTIVES.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={handleGenerate} disabled={generating} className="w-full h-9 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all">
              {generating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
              {generating ? "Gerando..." : "Gerar Variações A/B"}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredCopies.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">Nenhuma copy para este canal ainda. Gere variações A/B acima.</p>
          ) : (
            filteredCopies.map((copy) => (
              <div key={copy.id} className="p-3 rounded-lg border border-border bg-secondary/30 group hover:border-primary/20 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${copy.version === "A" ? "bg-primary/10 text-primary" : "bg-blue-500/10 text-blue-400"}`}>Versão {copy.version}</span>
                    <span className="text-[10px] text-muted-foreground">{copy.objective}</span>
                    {copy.lowRisk && <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded"><Shield className="w-2.5 h-2.5" /> Baixo Risco</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    {copy.performance && <span className="text-[10px] font-mono text-primary flex items-center gap-1"><BarChart3 className="w-3 h-3" /> CTR {copy.performance}%</span>}
                    <button onClick={() => { navigator.clipboard.writeText(copy.content); toast.success("Copiado!"); }} className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all"><Copy className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{copy.content}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-4"><Target className="w-4 h-4 text-primary" /><h3 className="text-sm font-semibold text-foreground">Calculadora de Verba (Tráfego Pago)</h3></div>
        <p className="text-xs text-muted-foreground mb-3">Fórmula: Verba = (Meta x CPA estimado) + 20-30% teste</p>
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Meta de Conversões</label>
            <input type="number" value={verbaCalc.meta || ""} onChange={(e) => setVerbaCalc({ ...verbaCalc, meta: Number(e.target.value) })} placeholder="Ex: 100" className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">CPA Estimado (R$)</label>
            <input type="number" value={verbaCalc.cpaEstimado || ""} onChange={(e) => setVerbaCalc({ ...verbaCalc, cpaEstimado: Number(e.target.value) })} placeholder="Ex: 25" className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
        </div>
        {verbaRecomendada > 0 && (
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-[10px] font-mono text-muted-foreground">Base</p>
              <p className="text-lg font-bold text-foreground">R$ {(verbaCalc.meta * verbaCalc.cpaEstimado).toLocaleString("pt-BR")}</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-[10px] font-mono text-primary">Recomendado (+25%)</p>
              <p className="text-lg font-bold text-primary">R$ {verbaRecomendada.toLocaleString("pt-BR")}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
              <p className="text-[10px] font-mono text-yellow-400">Máximo (+30%)</p>
              <p className="text-lg font-bold text-yellow-400">R$ {verbaMax.toLocaleString("pt-BR")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
