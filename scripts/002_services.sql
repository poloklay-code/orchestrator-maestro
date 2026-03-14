CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  platform TEXT,
  status TEXT DEFAULT 'active',
  fee_gestao NUMERIC(10,2) DEFAULT 0,
  verba_midia NUMERIC(10,2) DEFAULT 0,
  start_date DATE,
  end_date DATE,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_services" ON public.services FOR ALL USING (true) WITH CHECK (true);
