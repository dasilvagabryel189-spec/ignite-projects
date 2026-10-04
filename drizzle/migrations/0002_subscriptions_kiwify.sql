CREATE TABLE public.subscriptions (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  base_active boolean NOT NULL DEFAULT false,
  pro_active boolean NOT NULL DEFAULT false,
  base_subscription_id text,
  pro_subscription_id text,
  base_status text,
  pro_status text,
  base_next_renewal timestamptz,
  pro_next_renewal timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own subscription read" ON public.subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.subscription_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text,
  plan text,
  product_id text,
  subscription_id text,
  order_id text,
  status text,
  event_type text,
  started_at timestamptz,
  next_renewal timestamptz,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.subscription_events TO service_role;
ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_base(_user_id uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT coalesce((SELECT base_active FROM public.subscriptions WHERE user_id = _user_id), false)
$$;
CREATE OR REPLACE FUNCTION public.has_pro(_user_id uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT coalesce((SELECT base_active AND pro_active FROM public.subscriptions WHERE user_id = _user_id), false)
$$;

CREATE OR REPLACE FUNCTION public.user_id_by_email(_email text) RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, auth AS $$
  SELECT id FROM auth.users WHERE lower(email) = lower(_email) LIMIT 1
$$;
REVOKE ALL ON FUNCTION public.user_id_by_email(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.user_id_by_email(text) TO service_role;

-- PRO+ backend enforcement: advanced mission steps + saving generator ideas
DROP POLICY IF EXISTS "steps readable" ON public.mission_steps;
CREATE POLICY "steps readable" ON public.mission_steps FOR SELECT TO authenticated
USING (
  NOT EXISTS (SELECT 1 FROM public.missions m WHERE m.id = mission_id AND m.category = 'avancada')
  OR public.has_pro(auth.uid())
);
DROP POLICY IF EXISTS "own ideas" ON public.project_ideas;
CREATE POLICY "own ideas read" ON public.project_ideas FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own ideas delete" ON public.project_ideas FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "pro ideas insert" ON public.project_ideas FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND public.has_pro(auth.uid()));
CREATE POLICY "pro ideas update" ON public.project_ideas FOR UPDATE TO authenticated USING (auth.uid() = user_id AND public.has_pro(auth.uid()));