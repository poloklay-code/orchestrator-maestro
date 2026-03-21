
-- 1. dominus_results: tracked revenue recovery
CREATE TABLE IF NOT EXISTS public.dominus_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES public.tenants(id),
  recovered_revenue numeric DEFAULT 0,
  lost_revenue numeric DEFAULT 0,
  leads_recovered integer DEFAULT 0,
  leads_lost integer DEFAULT 0,
  actions_count integer DEFAULT 0,
  period_start date,
  period_end date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.dominus_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation results" ON public.dominus_results
  FOR ALL TO authenticated
  USING (tenant_id = public.get_user_tenant_id(auth.uid()))
  WITH CHECK (tenant_id = public.get_user_tenant_id(auth.uid()));

-- 2. Index for performance
CREATE INDEX IF NOT EXISTS idx_dominus_results_tenant ON public.dominus_results(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dominus_actions_tenant ON public.dominus_actions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dominus_insights_tenant ON public.dominus_insights(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dominus_lead_scores_tenant ON public.dominus_lead_scores(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_score ON public.leads(score);

-- 3. Add tenant_id to leads if not exists (for future multi-tenant)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'tenant_id') THEN
    ALTER TABLE public.leads ADD COLUMN tenant_id uuid REFERENCES public.tenants(id);
    CREATE INDEX idx_leads_tenant ON public.leads(tenant_id);
  END IF;
END $$;

-- 4. Add tenant_id to campaigns-related tables
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'tenant_id') THEN
    ALTER TABLE public.clients ADD COLUMN tenant_id uuid REFERENCES public.tenants(id);
    CREATE INDEX idx_clients_tenant ON public.clients(tenant_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'automations' AND column_name = 'tenant_id') THEN
    ALTER TABLE public.automations ADD COLUMN tenant_id uuid REFERENCES public.tenants(id);
    CREATE INDEX idx_automations_tenant ON public.automations(tenant_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'tenant_id') THEN
    ALTER TABLE public.services ADD COLUMN tenant_id uuid REFERENCES public.tenants(id);
    CREATE INDEX idx_services_tenant ON public.services(tenant_id);
  END IF;
END $$;
