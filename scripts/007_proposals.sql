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
  status TEXT DEFAULT 'draft',
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_proposals" ON public.proposals FOR ALL USING (true) WITH CHECK (true);
