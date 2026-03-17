import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, TrendingDown, DollarSign, AlertTriangle, Shield, Zap, ArrowRight, CheckCircle2, Users, BarChart3, Target, Star } from "lucide-react";

const painPoints = [
  { icon: TrendingDown, title: "Leads que nunca respondem", desc: "60% dos leads são perdidos por falta de follow-up rápido" },
  { icon: DollarSign, title: "Dinheiro jogado fora", desc: "Você paga R$15-50 por lead que nunca vira cliente" },
  { icon: AlertTriangle, title: "Oportunidades invisíveis", desc: "Clientes prontos para comprar que você nem sabe que existem" },
];

const features = [
  { icon: Brain, title: "Lead Scoring Inteligente", desc: "IA classifica leads em quente, morno e frio automaticamente" },
  { icon: Zap, title: "Ações Automáticas", desc: "Reengajamento automático via WhatsApp e email" },
  { icon: Shield, title: "Proteção de Receita", desc: "Detecta e recupera oportunidades perdidas 24/7" },
  { icon: Target, title: "Previsão de Conversão", desc: "Saiba quais leads vão fechar antes do contato" },
  { icon: BarChart3, title: "ROI em Tempo Real", desc: "Veja exatamente quanto o DOMINUS está gerando" },
  { icon: Users, title: "CRM Inteligente", desc: "Gestão de clientes com insights preditivos" },
];

const plans = [
  { name: "PREMIUM", price: "R$ 297", period: "/mês", features: ["Lead Scoring IA", "Dashboard Inteligente", "Alertas Automáticos", "Relatórios Semanais", "Suporte por Email"], popular: false },
  { name: "PRO", price: "R$ 697", period: "/mês", features: ["Tudo do Premium", "Ações Automáticas", "WhatsApp Automation", "Agente de Vendas IA", "Strategy Engine", "Suporte Prioritário"], popular: true },
  { name: "ELITE", price: "R$ 1.500", period: "/mês", features: ["Tudo do Pro", "Serviço Completo Incluso", "Gestão de Tráfego", "Criação de Conteúdo", "Agentes IA Ilimitados", "Gerente de Conta Dedicado"], popular: false },
];

const testimonials = [
  { name: "Carlos M.", role: "E-commerce", text: "Recuperamos R$38.000 em leads perdidos no primeiro mês.", stars: 5 },
  { name: "Ana P.", role: "Clínica Estética", text: "O DOMINUS identificou 23 leads quentes que eu nem sabia que existiam.", stars: 5 },
  { name: "Roberto S.", role: "Agência Digital", text: "ROI de 450% no primeiro trimestre. Inacreditável.", stars: 5 },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            <span className="font-bold text-foreground">DOMINUS <span className="text-gold-gradient">AI</span></span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/quiz" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Diagnóstico Grátis</Link>
            <Link to="/" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:brightness-110 transition-all">Entrar</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-orchestrator" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-display text-primary uppercase tracking-[0.3em] mb-4">INTELIGÊNCIA ARTIFICIAL PARA SEU NEGÓCIO</p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Você está pagando por leads e{" "}
              <span className="text-gold-gradient">deixando dinheiro ir embora</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              A cada 10 leads que chegam, 6 são perdidos por falta de resposta rápida. O DOMINUS AI detecta, classifica e recupera esses leads automaticamente — 24 horas por dia.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => navigate("/quiz")}
                className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2 glow-gold">
                Fazer Diagnóstico Grátis <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-xs text-muted-foreground">Descubra quanto você está perdendo</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-20 px-4 bg-card">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">O problema que <span className="text-destructive">está custando caro</span></h2>
          <div className="grid md:grid-cols-3 gap-6">
            {painPoints.map((point, i) => {
              const Icon = point.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-xl border border-destructive/20 bg-destructive/5">
                  <Icon className="w-8 h-8 text-destructive mb-4" />
                  <h3 className="text-lg font-bold text-foreground mb-2">{point.title}</h3>
                  <p className="text-sm text-muted-foreground">{point.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-display text-primary uppercase tracking-[0.3em] mb-2">A SOLUÇÃO</p>
            <h2 className="text-2xl md:text-3xl font-bold">DOMINUS AI: o cérebro que <span className="text-gold-gradient">protege seu faturamento</span></h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-all">
                  <Icon className="w-6 h-6 text-primary mb-3" />
                  <h3 className="text-sm font-bold text-foreground mb-1">{feat.title}</h3>
                  <p className="text-xs text-muted-foreground">{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 bg-card">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Resultados <span className="text-gold-gradient">reais</span></h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="p-6 rounded-xl border border-border bg-background">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => <Star key={j} className="w-4 h-4 text-primary fill-primary" />)}
                </div>
                <p className="text-sm text-foreground mb-4">"{t.text}"</p>
                <div>
                  <p className="text-xs font-bold text-foreground">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4" id="pricing">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-display text-primary uppercase tracking-[0.3em] mb-2">PLANOS</p>
            <h2 className="text-2xl md:text-3xl font-bold">Escolha o plano ideal para <span className="text-gold-gradient">seu negócio</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className={`p-6 rounded-xl border ${plan.popular ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card"} relative`}>
                {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full uppercase">Mais Popular</span>}
                <h3 className="text-lg font-bold text-foreground mb-1">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate("/quiz")}
                  className={`w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${plan.popular ? "bg-primary text-primary-foreground hover:brightness-110" : "bg-secondary text-foreground hover:bg-secondary/80"}`}>
                  Começar Agora
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-accent/5">
        <div className="max-w-3xl mx-auto text-center">
          <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Pare de perder dinheiro. <span className="text-gold-gradient">Comece hoje.</span></h2>
          <p className="text-muted-foreground mb-6">Faça o diagnóstico gratuito e descubra quanto você pode recuperar com o DOMINUS AI.</p>
          <button onClick={() => navigate("/quiz")}
            className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider hover:brightness-110 transition-all glow-gold">
            Diagnóstico Gratuito →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">DOMINUS AI © 2026</span>
          </div>
          <span className="text-[10px] text-muted-foreground">O cérebro que protege seu faturamento</span>
        </div>
      </footer>
    </div>
  );
}
