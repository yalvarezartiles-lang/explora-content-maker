// Lógica simulada para la futura tabla `carousel_images` (id, image_url, order_index).
// Cada función imita la llamada equivalente de Supabase; sustituir el cuerpo al conectar.
export type CarouselImage = { id: string; image_url: string; order_index: number };

import hero from "@/assets/hero-adassa.jpg";
import oferta from "@/assets/slide-oferta.jpg";
import coche from "@/assets/slide-coche.jpg";

// Estado inicial simulado: 3 imágenes de prueba.
let rows: CarouselImage[] = [hero, coche, oferta].map((image_url, order_index) => ({
  id: `demo-${order_index}`, image_url, order_index,
}));
const delay = () => new Promise((r) => setTimeout(r, 150));
const sorted = () => [...rows].sort((a, b) => a.order_index - b.order_index);

/** SELECT * FROM carousel_images ORDER BY order_index */
export async function listCarouselImages(): Promise<CarouselImage[]> {
  await delay();
  return sorted();
}

/** Subida al bucket + INSERT. En el mock la URL es local (object URL). */
export async function insertCarouselImages(files: File[]): Promise<CarouselImage[]> {
  await delay();
  const start = rows.length ? Math.max(...rows.map((r) => r.order_index)) + 1 : 0;
  rows = [
    ...rows,
    ...files.map((f, i) => ({ id: crypto.randomUUID(), image_url: URL.createObjectURL(f), order_index: start + i })),
  ];
  return sorted();
}

/** Sustituye la imagen de un hueco manteniendo su posición (UPDATE image_url). */
export async function replaceCarouselImage(id: string, file: File): Promise<CarouselImage[]> {
  await delay();
  rows = rows.map((r) => {
    if (r.id !== id) return r;
    if (r.image_url.startsWith("blob:")) URL.revokeObjectURL(r.image_url);
    return { ...r, image_url: URL.createObjectURL(file) };
  });
  return sorted();
}

/** UPDATE order_index de cada fila según el nuevo orden. */
export async function reorderCarouselImages(ids: string[]): Promise<CarouselImage[]> {
  await delay();
  rows = rows.map((r) => ({ ...r, order_index: ids.indexOf(r.id) }));
  return sorted();
}

/** DELETE FROM carousel_images WHERE id = ? (y borrado del archivo). */
export async function deleteCarouselImage(id: string): Promise<CarouselImage[]> {
  await delay();
  const row = rows.find((r) => r.id === id);
  if (row?.image_url.startsWith("blob:")) URL.revokeObjectURL(row.image_url);
  rows = rows.filter((r) => r.id !== id).map((r, i) => ({ ...r, order_index: i }));
  return sorted();
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
