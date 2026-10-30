import { useEffect, useRef, useState } from "react";
import { ImageUp, LoaderCircle, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { validateHeroFile } from "@/lib/hero-file";
import {
  type CarouselImage,
  deleteCarouselImage,
  insertCarouselImages,
  listCarouselImages,
  replaceCarouselImage,
} from "@/lib/carousel-mock";

export function AdminHeroManager() {
  const [items, setItems] = useState<CarouselImage[]>([]);
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const target = useRef<string | null>(null); // id a sustituir, o null = añadir

  useEffect(() => { listCarouselImages().then(setItems); }, []);

  async function run(fn: () => Promise<CarouselImage[]>) {
    setBusy(true);
    try { setItems(await fn()); } catch (e) { toast.error(e instanceof Error ? e.message : "Error."); }
    finally { setBusy(false); }
  }

  function pick(id: string | null) {
    if (busy) return;
    target.current = id;
    input.current?.click();
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    const err = validateHeroFile(file);
    if (err) { toast.error(err); return; }
    const id = target.current;
    run(() => (id ? replaceCarouselImage(id, file) : insertCarouselImages([file])));
  }

  const slot = "relative size-28 shrink-0 overflow-hidden rounded-md sm:size-32";

  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="mb-2 flex items-center gap-2 text-xl font-bold"><ImageUp />Gestor de carrusel</h2>
      <p className="mb-5 text-sm text-muted-foreground">Pulsa una foto para sustituirla, la X para quitarla o el + para añadir otra al final. (Modo de prueba.)</p>

      <div className="flex flex-row gap-3 overflow-x-auto pb-3 pt-2">
        {items.map((img, i) => (
          <div key={img.id} className={`${slot} border-2 border-border`}>
            <button type="button" onClick={() => pick(img.id)} aria-label={`Sustituir imagen ${i + 1}`}
              className="group block size-full">
              <img src={img.image_url} alt={`Imagen ${i + 1} del carrusel`} className="size-full object-cover" />
              <span className="absolute inset-0 flex items-center justify-center bg-foreground/50 text-xs font-bold text-background opacity-0 transition-opacity group-hover:opacity-100">Cambiar</span>
              <span className="absolute bottom-1 left-1 rounded bg-background/90 px-1.5 text-xs font-bold">{i + 1}</span>
            </button>
            <button type="button" aria-label={`Eliminar imagen ${i + 1}`} disabled={busy}
              onClick={() => run(() => deleteCarouselImage(img.id))}
              className="absolute right-1 top-1 flex size-7 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow">
              <X className="size-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => pick(null)} aria-label="Añadir imagen" disabled={busy}
          className={`${slot} flex items-center justify-center border-2 border-dashed border-primary text-primary hover:bg-accent`}>
          {busy ? <LoaderCircle className="size-8 animate-spin" /> : <Plus className="size-12" />}
        </button>
      </div>

      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
        onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ""; }} />
    </section>
  );
}
