CREATE TABLE IF NOT EXISTS public.affiliate_integrations (
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
CREATE POLICY "allow_all_affiliates" ON public.affiliate_integrations FOR ALL USING (true) WITH CHECK (true);
