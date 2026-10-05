ALTER TABLE public.missions ADD COLUMN is_pro boolean NOT NULL DEFAULT false;
ALTER TABLE public.opportunities ADD COLUMN is_pro boolean NOT NULL DEFAULT false;
UPDATE public.missions SET is_pro = true WHERE category = 'avancada';
UPDATE public.opportunities SET is_pro = true
  WHERE id IN (SELECT id FROM public.opportunities ORDER BY published_at DESC, title OFFSET 3);

-- PRO+ content
DROP POLICY IF EXISTS "steps readable" ON public.mission_steps;
CREATE POLICY "steps readable" ON public.mission_steps FOR SELECT TO authenticated
USING (NOT EXISTS (SELECT 1 FROM public.missions m WHERE m.id = mission_id AND m.is_pro) OR public.has_pro(auth.uid()));
DROP POLICY IF EXISTS "opps readable" ON public.opportunities;
CREATE POLICY "opps readable" ON public.opportunities FOR SELECT TO authenticated
USING (NOT is_pro OR public.has_pro(auth.uid()));

-- Teasers so Base users see PRO+ items exist (no details)
CREATE OR REPLACE FUNCTION public.pro_opportunity_teasers()
RETURNS TABLE(id uuid, title text, category text, level text, published_at date)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT o.id, o.title, o.category, o.level, o.published_at FROM public.opportunities o
  WHERE o.is_pro AND public.has_base(auth.uid())
  ORDER BY o.published_at DESC
$$;
REVOKE ALL ON FUNCTION public.pro_opportunity_teasers() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.pro_opportunity_teasers() TO authenticated;

-- Base required for all app data (backend enforcement)
CREATE POLICY "requires base" ON public.missions AS RESTRICTIVE FOR ALL TO authenticated USING (public.has_base(auth.uid()));
CREATE POLICY "requires base" ON public.mission_steps AS RESTRICTIVE FOR ALL TO authenticated USING (public.has_base(auth.uid()));
CREATE POLICY "requires base" ON public.user_step_progress AS RESTRICTIVE FOR ALL TO authenticated USING (public.has_base(auth.uid())) WITH CHECK (public.has_base(auth.uid()));
CREATE POLICY "requires base" ON public.daily_missions AS RESTRICTIVE FOR ALL TO authenticated USING (public.has_base(auth.uid()));
CREATE POLICY "requires base" ON public.daily_completions AS RESTRICTIVE FOR ALL TO authenticated USING (public.has_base(auth.uid())) WITH CHECK (public.has_base(auth.uid()));
CREATE POLICY "requires base" ON public.opportunities AS RESTRICTIVE FOR ALL TO authenticated USING (public.has_base(auth.uid()));
CREATE POLICY "requires base" ON public.projects AS RESTRICTIVE FOR ALL TO authenticated USING (public.has_base(auth.uid())) WITH CHECK (public.has_base(auth.uid()));
CREATE POLICY "requires base" ON public.project_tasks AS RESTRICTIVE FOR ALL TO authenticated USING (public.has_base(auth.uid())) WITH CHECK (public.has_base(auth.uid()));
CREATE POLICY "requires base" ON public.project_ideas AS RESTRICTIVE FOR ALL TO authenticated USING (public.has_base(auth.uid())) WITH CHECK (public.has_base(auth.uid()));
CREATE POLICY "requires base" ON public.xp_events AS RESTRICTIVE FOR ALL TO authenticated USING (public.has_base(auth.uid())) WITH CHECK (public.has_base(auth.uid()));

-- Completing PRO+ mission steps requires PRO+
CREATE POLICY "pro steps progress" ON public.user_step_progress AS RESTRICTIVE FOR INSERT TO authenticated
WITH CHECK (NOT EXISTS (SELECT 1 FROM public.mission_steps s JOIN public.missions m ON m.id = s.mission_id WHERE s.id = step_id AND m.is_pro) OR public.has_pro(auth.uid()));