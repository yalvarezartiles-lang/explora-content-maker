import { supabase } from "@/integrations/supabase/client";

export const HERO_BUCKET = "web-assets";
const MAX_BYTES = 8 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Valida un archivo de imagen antes de subirlo. Devuelve un mensaje de error o null. */
export function validateHeroFile(file: { type: string; size: number }): string | null {
  if (!TYPES.includes(file.type)) return "Formato no válido. Usa JPG, PNG o WebP.";
  if (file.size > MAX_BYTES) return "La imagen supera los 8 MB.";
  return null;
}

async function signed(path: string) {
  const { data } = await supabase.storage.from(HERO_BUCKET).createSignedUrl(path, 60 * 60 * 24 * 7);
  return data?.signedUrl ?? null;
}

/** URL de la imagen publicitaria activa (o null si no hay ninguna). */
export async function fetchActiveHeroUrl(): Promise<string | null> {
  const { data } = await supabase
    .from("hero_banners")
    .select("storage_path")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data ? signed(data.storage_path) : null;
}

/** Sube la imagen al bucket y la marca como la imagen activa del Hero (solo administradores). */
export async function uploadHeroImage(file: File): Promise<string> {
  const err = validateHeroFile(file);
  if (err) throw new Error(err);
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `hero/${crypto.randomUUID()}.${ext}`;
  const up = await supabase.storage.from(HERO_BUCKET).upload(path, file, { contentType: file.type });
  if (up.error) throw new Error("No se pudo subir la imagen.");
  const off = await supabase.from("hero_banners").update({ active: false }).eq("active", true);
  if (off.error) throw new Error("No se pudo actualizar la imagen activa.");
  const ins = await supabase.from("hero_banners").insert({ storage_path: path, active: true });
  if (ins.error) throw new Error("No se pudo activar la imagen.");
  return (await signed(path)) ?? "";
}

/** Quita la imagen activa: el Hero vuelve a las fotos por defecto. */
export async function clearHeroImage() {
  const { error } = await supabase.from("hero_banners").update({ active: false }).eq("active", true);
  if (error) throw new Error("No se pudo restablecer el Hero.");
}
