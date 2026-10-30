CREATE TABLE public.carousel_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.carousel_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.carousel_images TO authenticated;
GRANT ALL ON public.carousel_images TO service_role;
ALTER TABLE public.carousel_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY carousel_public_read ON public.carousel_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY carousel_admin_insert ON public.carousel_images FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY carousel_admin_update ON public.carousel_images FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY carousel_admin_delete ON public.carousel_images FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));