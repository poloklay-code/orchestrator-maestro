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

ALTER TABLE public.ai_monitoring ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_ai_monitoring" ON public.ai_monitoring FOR ALL USING (true) WITH CHECK (true);
