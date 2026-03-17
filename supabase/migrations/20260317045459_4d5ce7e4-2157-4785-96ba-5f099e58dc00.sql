
-- =============================================
-- DOMINUS AI: Multi-Tenant Architecture
-- =============================================

-- 1. Tenants table
CREATE TABLE IF NOT EXISTS public.tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  plan text NOT NULL DEFAULT 'free',
  dominus_active boolean NOT NULL DEFAULT false,
  dominus_plan text DEFAULT NULL,
  max_users integer DEFAULT 5,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  cpf text,
  phone text,
  avatar_url text,
  role text NOT NULL DEFAULT 'user',
  pin_code text,
  is_active boolean DEFAULT true,
  last_login_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. User roles table (separate from profiles for security)
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'user');

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- 4. Tenant services (controls feature access per tenant)
CREATE TABLE IF NOT EXISTS public.tenant_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  service_name text NOT NULL,
  is_active boolean DEFAULT false,
  activated_at timestamptz,
  expires_at timestamptz,
  config jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE (tenant_id, service_name)
);

-- 5. Subscription / Billing records
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  plan text NOT NULL DEFAULT 'premium',
  price numeric NOT NULL DEFAULT 297,
  status text NOT NULL DEFAULT 'active',
  payment_method text,
  gateway text DEFAULT 'stripe',
  gateway_subscription_id text,
  current_period_start timestamptz DEFAULT now(),
  current_period_end timestamptz DEFAULT (now() + interval '30 days'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6. DOMINUS AI Intelligence - Lead scoring history
CREATE TABLE IF NOT EXISTS public.dominus_lead_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  score integer NOT NULL DEFAULT 0,
  temperature text NOT NULL DEFAULT 'cold',
  conversion_probability numeric DEFAULT 0,
  factors jsonb DEFAULT '[]'::jsonb,
  recommendations jsonb DEFAULT '[]'::jsonb,
  scored_at timestamptz DEFAULT now()
);

-- 7. DOMINUS AI Actions log
CREATE TABLE IF NOT EXISTS public.dominus_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  target_type text NOT NULL,
  target_id uuid,
  status text DEFAULT 'pending',
  result jsonb DEFAULT '{}'::jsonb,
  revenue_recovered numeric DEFAULT 0,
  executed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 8. DOMINUS AI Insights
CREATE TABLE IF NOT EXISTS public.dominus_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
  category text NOT NULL,
  title text NOT NULL,
  description text,
  impact_value numeric DEFAULT 0,
  priority text DEFAULT 'medium',
  status text DEFAULT 'new',
  ai_analysis jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- 9. Quiz responses (for the landing page funnel)
CREATE TABLE IF NOT EXISTS public.quiz_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  phone text,
  leads_per_month integer,
  response_time text,
  lost_clients_pct integer,
  estimated_loss numeric,
  niche text,
  answers jsonb DEFAULT '{}'::jsonb,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dominus_lead_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dominus_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dominus_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Get user's tenant_id
CREATE OR REPLACE FUNCTION public.get_user_tenant_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id FROM public.profiles WHERE id = _user_id LIMIT 1
$$;

-- RLS Policies

-- Profiles: users see own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

-- Admins can view all profiles in their tenant
CREATE POLICY "Admins view tenant profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (tenant_id = public.get_user_tenant_id(auth.uid()) AND public.has_role(auth.uid(), 'admin'));

-- Tenants: users see own tenant
CREATE POLICY "Users view own tenant" ON public.tenants
  FOR SELECT TO authenticated
  USING (id = public.get_user_tenant_id(auth.uid()));

CREATE POLICY "Admins update own tenant" ON public.tenants
  FOR UPDATE TO authenticated
  USING (id = public.get_user_tenant_id(auth.uid()) AND public.has_role(auth.uid(), 'admin'));

-- User roles
CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Tenant services
CREATE POLICY "Users view tenant services" ON public.tenant_services
  FOR SELECT TO authenticated
  USING (tenant_id = public.get_user_tenant_id(auth.uid()));

-- Subscriptions
CREATE POLICY "Users view tenant subscriptions" ON public.subscriptions
  FOR SELECT TO authenticated
  USING (tenant_id = public.get_user_tenant_id(auth.uid()));

-- Dominus tables: tenant-isolated
CREATE POLICY "Tenant isolation lead scores" ON public.dominus_lead_scores
  FOR ALL TO authenticated
  USING (tenant_id = public.get_user_tenant_id(auth.uid()))
  WITH CHECK (tenant_id = public.get_user_tenant_id(auth.uid()));

CREATE POLICY "Tenant isolation actions" ON public.dominus_actions
  FOR ALL TO authenticated
  USING (tenant_id = public.get_user_tenant_id(auth.uid()))
  WITH CHECK (tenant_id = public.get_user_tenant_id(auth.uid()));

CREATE POLICY "Tenant isolation insights" ON public.dominus_insights
  FOR ALL TO authenticated
  USING (tenant_id = public.get_user_tenant_id(auth.uid()))
  WITH CHECK (tenant_id = public.get_user_tenant_id(auth.uid()));

-- Quiz responses: public insert, admin read
CREATE POLICY "Anyone can submit quiz" ON public.quiz_responses
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins read quiz responses" ON public.quiz_responses
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for auto-creating profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _tenant_id uuid;
BEGIN
  -- Create a default tenant for the user
  INSERT INTO public.tenants (name, slug)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.id::text
  )
  RETURNING id INTO _tenant_id;

  -- Create profile
  INSERT INTO public.profiles (id, tenant_id, full_name, email, cpf)
  VALUES (
    NEW.id,
    _tenant_id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'cpf', '')
  );

  -- Assign admin role to first user of tenant
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'admin');

  -- Activate default services
  INSERT INTO public.tenant_services (tenant_id, service_name, is_active)
  VALUES
    (_tenant_id, 'crm', true),
    (_tenant_id, 'automations', true),
    (_tenant_id, 'reports', true),
    (_tenant_id, 'dominus', false);

  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at triggers
CREATE OR REPLACE TRIGGER update_tenants_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_tenant ON public.profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_dominus_lead_scores_tenant ON public.dominus_lead_scores(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dominus_lead_scores_lead ON public.dominus_lead_scores(lead_id);
CREATE INDEX IF NOT EXISTS idx_dominus_actions_tenant ON public.dominus_actions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dominus_insights_tenant ON public.dominus_insights(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_services_tenant ON public.tenant_services(tenant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_tenant ON public.subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_email ON public.quiz_responses(email);
