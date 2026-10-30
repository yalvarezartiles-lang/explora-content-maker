// Carrusel del Hero: tabla `carousel_images` (image_url guarda la ruta en el bucket web-assets).
import { supabase } from "@/integrations/supabase/client";

export type CarouselImage = { id: string; image_url: string; order_index: number };
const BUCKET = "web-assets";

async function withUrls(rows: { id: string; image_url: string; order_index: number }[]) {
  if (!rows.length) return [];
  const { data } = await supabase.storage.from(BUCKET).createSignedUrls(rows.map((r) => r.image_url), 60 * 60 * 24 * 7);
  return rows.map((r, i) => ({ ...r, image_url: data?.[i]?.signedUrl ?? "" }));
}

async function raw() {
  const { data, error } = await supabase.from("carousel_images").select("id, image_url, order_index").order("order_index");
  if (error) throw new Error("No se pudieron cargar las imágenes.");
  return data ?? [];
}

export async function listCarouselImages(): Promise<CarouselImage[]> {
  return withUrls(await raw());
}

async function upload(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `carousel/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
  if (error) throw new Error("No se pudo subir la imagen.");
  return path;
}

export async function insertCarouselImages(files: File[]): Promise<CarouselImage[]> {
  const rows = await raw();
  let next = rows.length ? Math.max(...rows.map((r) => r.order_index)) + 1 : 0;
  for (const f of files) {
    const path = await upload(f);
    const { error } = await supabase.from("carousel_images").insert({ image_url: path, order_index: next++ });
    if (error) throw new Error("No se pudo guardar la imagen.");
  }
  return listCarouselImages();
}

export async function replaceCarouselImage(id: string, file: File): Promise<CarouselImage[]> {
  const old = (await raw()).find((r) => r.id === id);
  const path = await upload(file);
  const { error } = await supabase.from("carousel_images").update({ image_url: path }).eq("id", id);
  if (error) throw new Error("No se pudo sustituir la imagen.");
  if (old) await supabase.storage.from(BUCKET).remove([old.image_url]);
  return listCarouselImages();
}

export async function reorderCarouselImages(ids: string[]): Promise<CarouselImage[]> {
  for (const [i, id] of ids.entries()) {
    const { error } = await supabase.from("carousel_images").update({ order_index: i }).eq("id", id);
    if (error) throw new Error("No se pudo reordenar.");
  }
  return listCarouselImages();
}

export async function deleteCarouselImage(id: string): Promise<CarouselImage[]> {
  const old = (await raw()).find((r) => r.id === id);
  const { error } = await supabase.from("carousel_images").delete().eq("id", id);
  if (error) throw new Error("No se pudo eliminar la imagen.");
  if (old) await supabase.storage.from(BUCKET).remove([old.image_url]);
  return listCarouselImages();
}

/** Mueve un elemento una posición y devuelve el nuevo orden de IDs. */
export function moveId(ids: string[], id: string, dir: -1 | 1): string[] {
  const i = ids.indexOf(id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= ids.length) return ids;
  const next = [...ids];
  next[i] = ids[j]!;
  next[j] = ids[i]!;
  return next;
}
