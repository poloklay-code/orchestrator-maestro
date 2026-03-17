import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Brain, ArrowRight, ArrowLeft, AlertTriangle, DollarSign, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const questions = [
  {
    id: "leads_month",
    question: "Quantos leads você recebe por mês?",
    options: [
      { label: "Menos de 50", value: 30 },
      { label: "50 a 200", value: 125 },
      { label: "200 a 500", value: 350 },
      { label: "Mais de 500", value: 750 },
    ],
  },
  {
    id: "response_time",
    question: "Quanto tempo você leva para responder um lead?",
    options: [
      { label: "Menos de 5 minutos", value: 5 },
      { label: "5 a 30 minutos", value: 20 },
      { label: "30 min a 2 horas", value: 60 },
      { label: "Mais de 2 horas", value: 180 },
    ],
  },
  {
    id: "lost_pct",
    question: "Qual porcentagem de leads você acredita que perde?",
    options: [
      { label: "Menos de 20%", value: 15 },
      { label: "20% a 40%", value: 30 },
      { label: "40% a 60%", value: 50 },
      { label: "Mais de 60%", value: 70 },
    ],
  },
  {
    id: "ticket_medio",
    question: "Qual o ticket médio do seu serviço/produto?",
    options: [
      { label: "R$ 100 a R$ 500", value: 300 },
      { label: "R$ 500 a R$ 2.000", value: 1250 },
      { label: "R$ 2.000 a R$ 5.000", value: 3500 },
      { label: "Mais de R$ 5.000", value: 7500 },
    ],
  },
  {
    id: "niche",
    question: "Qual o seu nicho de atuação?",
    options: [
      { label: "E-commerce / Loja Online", value: "ecommerce" },
      { label: "Serviços (Agência, Clínica, etc)", value: "servicos" },
      { label: "Infoprodutos / Cursos", value: "infoprodutos" },
      { label: "Outro", value: "outro" },
    ],
  },
];

export default function QuizPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);

  const currentQ = questions[step];
  const isContactStep = step === questions.length;
  const totalSteps = questions.length + 1;

  const handleSelect = (value: any) => {
    setAnswers({ ...answers, [currentQ.id]: value });
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setStep(questions.length); // contact step
    }
  };

  const calculateLoss = () => {
    const leads = answers.leads_month || 100;
    const lostPct = (answers.lost_pct || 30) / 100;
    const ticket = answers.ticket_medio || 1000;
    const conversionRate = 0.15; // 15% conversion
    const weeklyLoss = (leads / 4) * lostPct * conversionRate * ticket;
    return Math.round(weeklyLoss);
  };

  const handleSubmit = async () => {
    if (!name || !email) { toast.error("Preencha nome e email"); return; }
    setSaving(true);

    const weeklyLoss = calculateLoss();

    try {
      await supabase.from("quiz_responses").insert({
        name,
        email,
        phone,
        leads_per_month: answers.leads_month,
        response_time: String(answers.response_time),
        lost_clients_pct: answers.lost_pct,
        estimated_loss: weeklyLoss,
        niche: answers.niche,
        answers: answers as any,
      });
      setShowResult(true);
    } catch {
      toast.error("Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const weeklyLoss = calculateLoss();
  const monthlyLoss = weeklyLoss * 4;

  if (showResult) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full rounded-2xl border border-primary/20 bg-card p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Resultado do Diagnóstico</h2>
          <p className="text-sm text-muted-foreground mb-6">{name}, baseado nas suas respostas:</p>

          <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-6 mb-6">
            <p className="text-sm text-muted-foreground mb-2">Você pode estar perdendo</p>
            <p className="text-4xl font-bold text-destructive">R$ {weeklyLoss.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">por semana</p>
            <div className="mt-3 pt-3 border-t border-destructive/20">
              <p className="text-lg font-bold text-foreground">R$ {monthlyLoss.toLocaleString()} / mês</p>
              <p className="text-xs text-muted-foreground">em oportunidades perdidas</p>
            </div>
          </div>

          <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 mb-6 text-left">
            <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" /> Com DOMINUS AI, você pode:
            </h3>
            <ul className="space-y-1.5">
              {["Recuperar até 60% dos leads perdidos", "Aumentar conversão em 35%", "Automatizar follow-up 24/7", "Gerar relatórios de ROI em tempo real"].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <a href={`https://wa.me/5500000000000?text=Olá! Fiz o diagnóstico DOMINUS AI e descobri que posso estar perdendo R$ ${weeklyLoss.toLocaleString()} por semana. Quero saber mais!`}
              target="_blank" rel="noopener noreferrer"
              className="w-full py-3.5 rounded-xl bg-green-600 text-white font-bold text-sm uppercase tracking-wider hover:bg-green-700 transition-all flex items-center justify-center gap-2">
              Falar no WhatsApp <ArrowRight className="w-4 h-4" />
            </a>
            <button onClick={() => navigate("/")}
              className="w-full py-3 rounded-xl bg-secondary text-foreground text-xs font-semibold hover:bg-secondary/80 transition-all">
              Acessar o Sistema
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-foreground">Diagnóstico DOMINUS</span>
            </div>
            <span className="text-xs text-muted-foreground">{step + 1} / {totalSteps}</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isContactStep ? (
            <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="rounded-2xl border border-border bg-card p-6 lg:p-8">
              <h2 className="text-lg font-bold text-foreground mb-6">{currentQ.question}</h2>
              <div className="space-y-3">
                {currentQ.options.map((opt, i) => (
                  <button key={i} onClick={() => handleSelect(opt.value)}
                    className={`w-full text-left p-4 rounded-xl border transition-all hover:border-primary/50 hover:bg-primary/5 ${answers[currentQ.id] === opt.value ? "border-primary bg-primary/10" : "border-border"}`}>
                    <span className="text-sm text-foreground">{opt.label}</span>
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button onClick={() => setStep(step - 1)} className="mt-4 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-3 h-3" /> Voltar
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div key="contact" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl border border-border bg-card p-6 lg:p-8">
              <h2 className="text-lg font-bold text-foreground mb-2">Último passo!</h2>
              <p className="text-sm text-muted-foreground mb-6">Informe seus dados para ver o resultado do diagnóstico.</p>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-display text-muted-foreground uppercase tracking-wider">NOME</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required
                    className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Seu nome" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-display text-muted-foreground uppercase tracking-wider">EMAIL</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="seu@email.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-display text-muted-foreground uppercase tracking-wider">WHATSAPP</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="(00) 00000-0000" />
                </div>
                <button onClick={handleSubmit} disabled={saving}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                  {saving ? "Calculando..." : "Ver Meu Resultado"} <DollarSign className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => setStep(step - 1)} className="mt-4 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-3 h-3" /> Voltar
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
