
-- ====================================================================
-- ORQUESTRADOR AI — Schema Completo do Banco de Dados
-- ====================================================================

-- Função para updated_at automático
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ====================================================================
-- 1. CLIENTS — Clientes do sistema
-- ====================================================================
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  document TEXT,
  type TEXT DEFAULT 'pf' CHECK (type IN ('pf', 'pj')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'paused')),
  website TEXT,
  instagram TEXT,
  niche TEXT,
  current_revenue TEXT,
  target_revenue TEXT,
  notes TEXT,
  risk_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ====================================================================
-- 2. SERVICES — Serviços prestados aos clientes
-- ====================================================================
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  platform TEXT,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'completed', 'paused', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  fee_gestao NUMERIC(10,2) DEFAULT 0,
  verba NUMERIC(10,2) DEFAULT 0,
  progress INTEGER DEFAULT 0,
  tasks_total INTEGER DEFAULT 0,
  tasks_done INTEGER DEFAULT 0,
  ia_agent TEXT,
  config JSONB DEFAULT '{}',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to services" ON public.services FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ====================================================================
-- 3. SERVICE_DELIVERABLES — Entregáveis detalhados por serviço
-- ====================================================================
CREATE TABLE public.service_deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'done', 'cancelled')),
  date DATE,
  result TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.service_deliverables ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to service_deliverables" ON public.service_deliverables FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 4. DELIVERABLE_DETAILS — Conteúdo detalhado de cada entregável
-- ====================================================================
CREATE TABLE public.deliverable_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deliverable_id UUID REFERENCES public.service_deliverables(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pixel', 'creative', 'campaign', 'report', 'content', 'config', 'workflow', 'copy', 'seo')),
  title TEXT NOT NULL,
  content TEXT,
  metrics JSONB DEFAULT '{}',
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.deliverable_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to deliverable_details" ON public.deliverable_details FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 5. LEADS — Gerenciamento de leads
-- ====================================================================
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  source TEXT,
  channel TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'negotiation', 'converted', 'lost')),
  score INTEGER DEFAULT 0,
  service_interest TEXT,
  entry_page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  notes TEXT,
  assigned_agent TEXT,
  last_activity TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ====================================================================
-- 6. BRIEFINGS — Formulários/briefings de clientes
-- ====================================================================
CREATE TABLE public.briefings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  website TEXT,
  instagram TEXT,
  niche TEXT,
  current_revenue TEXT,
  target_revenue TEXT,
  main_goal TEXT,
  services TEXT[] DEFAULT '{}',
  budget TEXT,
  urgency TEXT DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'urgent')),
  competitors TEXT,
  challenges TEXT,
  additional_info TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'analyzed', 'proposal_sent', 'approved', 'rejected', 'paid', 'in_progress')),
  ai_analysis JSONB DEFAULT '{}',
  payment_confirmed BOOLEAN DEFAULT false,
  payment_confirmed_at TIMESTAMPTZ,
  auto_started BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.briefings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to briefings" ON public.briefings FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER update_briefings_updated_at BEFORE UPDATE ON public.briefings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ====================================================================
-- 7. PROPOSALS — Propostas comerciais
-- ====================================================================
CREATE TABLE public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  briefing_id UUID REFERENCES public.briefings(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  diagnostico TEXT,
  estrategia TEXT,
  escopo TEXT,
  kpis TEXT,
  riscos TEXT,
  fee_gestao NUMERIC(10,2) DEFAULT 0,
  verba_recomendada NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected')),
  pdf_url TEXT,
  sent_via TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to proposals" ON public.proposals FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON public.proposals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ====================================================================
-- 8. AUTOMATIONS — Automações do sistema
-- ====================================================================
CREATE TABLE public.automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('n8n', 'make', 'manychat', 'whatsapp_api', 'custom_webhook', 'zapier')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error', 'disabled', 'building')),
  webhook_url TEXT,
  workflow_steps JSONB DEFAULT '[]',
  config JSONB DEFAULT '{}',
  last_run_at TIMESTAMPTZ,
  run_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  success_rate NUMERIC(5,2) DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to automations" ON public.automations FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER update_automations_updated_at BEFORE UPDATE ON public.automations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ====================================================================
-- 9. AI_AGENTS — Agentes de IA criados no Agent Forge
-- ====================================================================
CREATE TABLE public.ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('chatbot', 'sales', 'support', 'scheduler', 'content', 'analyst', 'receptionist', 'custom')),
  platform TEXT NOT NULL CHECK (platform IN ('whatsapp', 'instagram', 'website', 'telegram', 'facebook', 'api')),
  model TEXT DEFAULT 'gpt-4o-mini',
  system_prompt TEXT,
  knowledge_base JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'testing')),
  conversations INTEGER DEFAULT 0,
  satisfaction_rate NUMERIC(5,2) DEFAULT 0,
  design_config JSONB DEFAULT '{}',
  website_url TEXT,
  social_urls JSONB DEFAULT '{}',
  business_description TEXT,
  niche_analysis JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to ai_agents" ON public.ai_agents FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER update_ai_agents_updated_at BEFORE UPDATE ON public.ai_agents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ====================================================================
-- 10. SALES_CONVERSATIONS — Conversas do agente de vendas
-- ====================================================================
CREATE TABLE public.sales_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  lead_name TEXT NOT NULL,
  channel TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'won', 'lost', 'follow_up')),
  messages_count INTEGER DEFAULT 0,
  deal_value NUMERIC(12,2) DEFAULT 0,
  score INTEGER DEFAULT 0,
  last_message TEXT,
  ai_agent_id UUID REFERENCES public.ai_agents(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.sales_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to sales_conversations" ON public.sales_conversations FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 11. SALES_MESSAGES — Mensagens das conversas de vendas
-- ====================================================================
CREATE TABLE public.sales_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.sales_conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('agent', 'lead', 'system', 'admin')),
  content TEXT NOT NULL,
  content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'audio', 'image', 'video', 'document')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.sales_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to sales_messages" ON public.sales_messages FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 12. OPPORTUNITIES — Oportunidades detectadas pela IA
-- ====================================================================
CREATE TABLE public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  source TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('niche', 'product', 'keyword', 'trend')),
  score INTEGER DEFAULT 0,
  growth TEXT,
  volume TEXT,
  competition TEXT CHECK (competition IN ('low', 'medium', 'high')),
  description TEXT,
  platforms TEXT[] DEFAULT '{}',
  profit_estimate TEXT,
  risk_analysis TEXT,
  implementation_plan JSONB DEFAULT '{}',
  admin_approved BOOLEAN DEFAULT false,
  admin_approved_at TIMESTAMPTZ,
  auto_implemented BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'detected' CHECK (status IN ('detected', 'reviewing', 'approved', 'implementing', 'active', 'rejected')),
  detected_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to opportunities" ON public.opportunities FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 13. STRATEGIES — Estratégias geradas pelo Strategy Engine
-- ====================================================================
CREATE TABLE public.strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  channels JSONB DEFAULT '[]',
  funnel JSONB DEFAULT '[]',
  competitors JSONB DEFAULT '[]',
  recommendations TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'generated' CHECK (status IN ('generated', 'pending', 'approved', 'active')),
  performance_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to strategies" ON public.strategies FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 14. AUTOSCALE_CAMPAIGNS — Campanhas em escala automática
-- ====================================================================
CREATE TABLE public.autoscale_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  platform TEXT NOT NULL,
  budget NUMERIC(12,2) DEFAULT 0,
  original_budget NUMERIC(12,2) DEFAULT 0,
  roas NUMERIC(8,2) DEFAULT 0,
  leads INTEGER DEFAULT 0,
  cpl NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'monitoring' CHECK (status IN ('scaling', 'monitoring', 'paused', 'limit_reached')),
  auto_scale_enabled BOOLEAN DEFAULT true,
  scale_limit_pct INTEGER DEFAULT 20,
  scale_history JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.autoscale_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to autoscale_campaigns" ON public.autoscale_campaigns FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 15. AFFILIATE_INTEGRATIONS — Integrações de afiliados
-- ====================================================================
CREATE TABLE public.affiliate_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  product_name TEXT,
  product_id TEXT,
  api_key TEXT,
  webhook_url TEXT,
  status TEXT DEFAULT 'active',
  total_sales INTEGER DEFAULT 0,
  total_revenue NUMERIC(12,2) DEFAULT 0,
  total_refunds INTEGER DEFAULT 0,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.affiliate_integrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to affiliate_integrations" ON public.affiliate_integrations FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 16. AI_MONITORING — Monitoramento de IAs
-- ====================================================================
CREATE TABLE public.ai_monitoring (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.ai_agents(id) ON DELETE SET NULL,
  metric_type TEXT NOT NULL,
  metric_value NUMERIC(12,2),
  metric_data JSONB DEFAULT '{}',
  platform TEXT,
  recorded_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.ai_monitoring ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to ai_monitoring" ON public.ai_monitoring FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 17. AUDIT_LOGS — Logs de auditoria
-- ====================================================================
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB DEFAULT '{}',
  source TEXT DEFAULT 'system',
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to audit_logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 18. CHAT_MESSAGES — Mensagens do assistente IA
-- ====================================================================
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to chat_messages" ON public.chat_messages FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 19. NOTIFICATIONS — Sistema de notificações
-- ====================================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'briefing', 'payment', 'opportunity')),
  entity_type TEXT,
  entity_id UUID,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 20. SYSTEM_SETTINGS — Configurações do sistema
-- ====================================================================
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to system_settings" ON public.system_settings FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 21. REPORTS — Relatórios gerados
-- ====================================================================
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('weekly', 'monthly', 'bimonthly', 'quarterly', 'custom')),
  title TEXT NOT NULL,
  content JSONB DEFAULT '{}',
  metrics JSONB DEFAULT '{}',
  pdf_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generated', 'sent')),
  period_start DATE,
  period_end DATE,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to reports" ON public.reports FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 22. FINANCIAL_RECORDS — Registros financeiros
-- ====================================================================
CREATE TABLE public.financial_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'fee', 'media_budget')),
  amount NUMERIC(12,2) NOT NULL,
  description TEXT,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'overdue', 'cancelled')),
  due_date DATE,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to financial_records" ON public.financial_records FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 23. INTEGRATIONS — Status das integrações
-- ====================================================================
CREATE TABLE public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  platform TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'connected' CHECK (status IN ('connected', 'disconnected', 'error', 'pending')),
  api_key_ref TEXT,
  config JSONB DEFAULT '{}',
  last_sync_at TIMESTAMPTZ DEFAULT now(),
  health_check_at TIMESTAMPTZ DEFAULT now(),
  auto_reconnect BOOLEAN DEFAULT true,
  error_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to integrations" ON public.integrations FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 24. THEME_SETTINGS — Temas sincronizados entre dispositivos
-- ====================================================================
CREATE TABLE public.theme_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT,
  theme TEXT DEFAULT 'dark',
  accent_color TEXT DEFAULT 'orange',
  font_size TEXT DEFAULT 'medium',
  config JSONB DEFAULT '{}',
  synced_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to theme_settings" ON public.theme_settings FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- INDEXES para performance
-- ====================================================================
CREATE INDEX idx_services_client_id ON public.services(client_id);
CREATE INDEX idx_services_status ON public.services(status);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_source ON public.leads(source);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX idx_briefings_status ON public.briefings(status);
CREATE INDEX idx_automations_client_id ON public.automations(client_id);
CREATE INDEX idx_automations_status ON public.automations(status);
CREATE INDEX idx_ai_agents_client_id ON public.ai_agents(client_id);
CREATE INDEX idx_ai_agents_status ON public.ai_agents(status);
CREATE INDEX idx_opportunities_score ON public.opportunities(score DESC);
CREATE INDEX idx_opportunities_status ON public.opportunities(status);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_financial_records_client_id ON public.financial_records(client_id);
CREATE INDEX idx_reports_client_id ON public.reports(client_id);
CREATE INDEX idx_service_deliverables_service_id ON public.service_deliverables(service_id);
CREATE INDEX idx_deliverable_details_deliverable_id ON public.deliverable_details(deliverable_id);
CREATE INDEX idx_sales_conversations_status ON public.sales_conversations(status);

-- Insert default settings
INSERT INTO public.system_settings (key, value) VALUES ('admin_pin', '"834589"') ON CONFLICT (key) DO NOTHING;
INSERT INTO public.system_settings (key, value) VALUES ('system_version', '"2.0.0"') ON CONFLICT (key) DO NOTHING;
