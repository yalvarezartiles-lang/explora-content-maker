import { useEffect, useRef, useState } from "react";
import { ImageUp, LoaderCircle, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { clearHeroImage, fetchActiveHeroUrl, uploadHeroImage, validateHeroFile } from "@/lib/hero-banner";

export function AdminHeroManager() {
  const [url, setUrl] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchActiveHeroUrl().then(setUrl); }, []);

  async function handle(file: File | undefined) {
    if (!file) return;
    const err = validateHeroFile(file);
    if (err) return toast.error(err);
    setBusy(true);
    try { setUrl(await uploadHeroImage(file)); toast.success("Imagen publicada en la portada."); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Error al subir."); }
    finally { setBusy(false); }
  }

  return (
    <section className="mt-12 max-w-xl border-t pt-8">
      <h2 className="mb-2 flex items-center gap-2 text-xl font-bold"><ImageUp />Imagen publicitaria de portada</h2>
      <p className="mb-5 text-sm text-muted-foreground">Arrastra una foto (JPG, PNG o WebP, máx. 8 MB). Sustituye a la primera imagen del carrusel.</p>
      <div
        role="button"
        tabIndex={0}
        onClick={() => input.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && input.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]); }}
        className={`flex min-h-44 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-center transition-colors ${drag ? "border-primary bg-accent" : "border-border bg-card"}`}
      >
        {busy ? <LoaderCircle className="size-8 animate-spin" /> : <ImageUp className="size-8 text-primary-dark" />}
        <span className="text-sm font-semibold">{busy ? "Subiendo…" : "Suelta aquí la imagen o pulsa para elegirla"}</span>
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { handle(e.target.files?.[0]); e.target.value = ""; }} />
      </div>
      {url && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold">Imagen activa</p>
          <img src={url} alt="Imagen activa de la portada" className="aspect-[4/3] w-full rounded-md object-cover" />
          <Button variant="outline" className="mt-3" disabled={busy} onClick={async () => { try { await clearHeroImage(); setUrl(null); toast.success("Portada restablecida."); } catch (e) { toast.error((e as Error).message); } }}><RotateCcw />Volver a la foto por defecto</Button>
        </div>
      )}
    </section>
  );
}
