const MAX_BYTES = 8 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Valida un archivo de imagen antes de subirlo. Devuelve un mensaje de error o null. */
export function validateHeroFile(file: { type: string; size: number }): string | null {
  if (!TYPES.includes(file.type)) return "Formato no válido. Usa JPG, PNG o WebP.";
  if (file.size > MAX_BYTES) return "La imagen supera los 8 MB.";
  return null;
}
