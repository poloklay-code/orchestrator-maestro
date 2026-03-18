
-- Update the handle_new_user trigger to assign admin role ONLY to keomatiago@gmail.com
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _tenant_id uuid;
  _role app_role;
BEGIN
  -- Create a default tenant for the user
  INSERT INTO public.tenants (name, slug)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.id::text
  )
  RETURNING id INTO _tenant_id;

  -- Determine role: admin only for specific email
  IF NEW.email = 'keomatiago@gmail.com' THEN
    _role := 'admin';
  ELSE
    _role := 'user';
  END IF;

  -- Create profile
  INSERT INTO public.profiles (id, tenant_id, full_name, email, cpf, role)
  VALUES (
    NEW.id,
    _tenant_id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'cpf', ''),
    _role::text
  );

  -- Assign role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, _role);

  -- Activate services based on role
  IF _role = 'admin' THEN
    INSERT INTO public.tenant_services (tenant_id, service_name, is_active)
    VALUES
      (_tenant_id, 'crm', true),
      (_tenant_id, 'automations', true),
      (_tenant_id, 'reports', true),
      (_tenant_id, 'dominus', true),
      (_tenant_id, 'agent_forge', true),
      (_tenant_id, 'market_prediction', true);
  ELSE
    INSERT INTO public.tenant_services (tenant_id, service_name, is_active)
    VALUES
      (_tenant_id, 'dominus', false),
      (_tenant_id, 'reports', true);
  END IF;

  RETURN NEW;
END;
$$;
