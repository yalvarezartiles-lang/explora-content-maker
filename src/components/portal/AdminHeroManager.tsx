import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageUp, LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { validateHeroFile } from "@/lib/hero-file";
import {
  type CarouselImage,
  deleteCarouselImage,
  insertCarouselImages,
  listCarouselImages,
  moveId,
  reorderCarouselImages,
} from "@/lib/carousel-mock";

export function AdminHeroManager() {
  const [items, setItems] = useState<CarouselImage[]>([]);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => { listCarouselImages().then(setItems); }, []);

  async function run(fn: () => Promise<CarouselImage[]>) {
    setBusy(true);
    try { setItems(await fn()); } catch (e) { toast.error(e instanceof Error ? e.message : "Error."); }
    finally { setBusy(false); }
  }

  function upload(list: FileList | null | undefined) {
    const files = Array.from(list ?? []);
    const valid = files.filter((f) => {
      const err = validateHeroFile(f);
      if (err) toast.error(`${f.name}: ${err}`);
      return !err;
    });
    if (valid.length) run(() => insertCarouselImages(valid)).then(() => toast.success(`${valid.length} imagen(es) añadidas.`));
  }

  const ids = items.map((i) => i.id);

  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="mb-2 flex items-center gap-2 text-xl font-bold"><ImageUp />Gestor de carrusel</h2>
      <p className="mb-5 text-sm text-muted-foreground">Sube, ordena y elimina las imágenes de la portada. (Modo de prueba: los cambios aún no se publican.)</p>

      {items.length > 0 && (
        <ul className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map((img, i) => (
            <li key={img.id} className="rounded-md border bg-card p-2">
              <div className="relative">
                <img src={img.image_url} alt={`Imagen ${i + 1} del carrusel`} className="aspect-[4/3] w-full rounded object-cover" />
                <span className="absolute left-2 top-2 rounded bg-background/90 px-2 text-xs font-bold">{i + 1}</span>
                <Button size="icon" variant="destructive" aria-label="Eliminar imagen" disabled={busy}
                  className="absolute right-2 top-2 size-8" onClick={() => run(() => deleteCarouselImage(img.id))}>
                  <Trash2 />
                </Button>
              </div>
              <div className="mt-2 flex justify-between">
                <Button size="icon" variant="outline" aria-label="Mover a la izquierda" disabled={busy || i === 0}
                  onClick={() => run(() => reorderCarouselImages(moveId(ids, img.id, -1)))}><ChevronLeft /></Button>
                <Button size="icon" variant="outline" aria-label="Mover a la derecha" disabled={busy || i === items.length - 1}
                  onClick={() => run(() => reorderCarouselImages(moveId(ids, img.id, 1)))}><ChevronRight /></Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={() => input.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && input.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); upload(e.dataTransfer.files); }}
        className={`flex min-h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-center transition-colors ${drag ? "border-primary bg-accent" : "border-border bg-card"}`}
      >
        {busy ? <LoaderCircle className="size-8 animate-spin" /> : <ImageUp className="size-8 text-primary-dark" />}
        <span className="text-sm font-semibold">Suelta aquí varias imágenes o pulsa para elegirlas</span>
        <span className="text-xs text-muted-foreground">JPG, PNG o WebP, máx. 8 MB cada una</span>
        <input ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden"
          onChange={(e) => { upload(e.target.files); e.target.value = ""; }} />
      </div>
    </section>
  );
}
