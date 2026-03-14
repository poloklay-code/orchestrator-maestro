-- ORQUESTRADOR Database Schema

-- Clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  document TEXT,
  type TEXT DEFAULT 'pf' CHECK (type IN ('pf', 'pj')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'paused')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('gestao_trafego', 'automacao', 'assistente_ia', 'copy_criativos', 'funil', 'afiliado', 'ecommerce', 'google_negocios', 'relatorio')),
  platform TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  fee_gestao NUMERIC(10,2) DEFAULT 0,
  verba_midia NUMERIC(10,2) DEFAULT 0,
  start_date DATE,
  end_date DATE,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB DEFAULT '{}',
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AI monitoring table
CREATE TABLE IF NOT EXISTS public.ai_monitoring (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  metric_value NUMERIC(12,2),
  metric_data JSONB DEFAULT '{}',
  platform TEXT,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

-- Automations table
CREATE TABLE IF NOT EXISTS public.automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('n8n', 'make', 'manychat', 'whatsapp_api', 'custom_webhook')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error', 'disabled')),
  webhook_url TEXT,
  config JSONB DEFAULT '{}',
  last_run_at TIMESTAMPTZ,
  run_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Affiliate integrations table
CREATE TABLE IF NOT EXISTS public.affiliate_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('hotmart', 'monetizze', 'eduzz', 'kiwify', 'braip', 'digstore', 'buygoods', 'clickbank', 'maxweb')),
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

-- Proposals table
CREATE TABLE IF NOT EXISTS public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
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
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Chat messages (AI assistant)
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- System settings
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default PIN setting
INSERT INTO public.system_settings (key, value) 
VALUES ('admin_pin', '"834589"')
ON CONFLICT (key) DO NOTHING;

-- Insert system version
INSERT INTO public.system_settings (key, value)
VALUES ('system_version', '"1.0.0"')
ON CONFLICT (key) DO NOTHING;
