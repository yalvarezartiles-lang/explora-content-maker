CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, text) TO authenticated;

CREATE TABLE public.hero_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path text NOT NULL,
  active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hero_banners TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hero_banners TO authenticated;
GRANT ALL ON public.hero_banners TO service_role;
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY hero_banners_public_read ON public.hero_banners FOR SELECT TO anon, authenticated USING (active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY hero_banners_admin_insert ON public.hero_banners FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY hero_banners_admin_update ON public.hero_banners FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY hero_banners_admin_delete ON public.hero_banners FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY web_assets_public_read ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'web-assets');
CREATE POLICY web_assets_admin_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'web-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY web_assets_admin_delete ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'web-assets' AND public.has_role(auth.uid(), 'admin'));