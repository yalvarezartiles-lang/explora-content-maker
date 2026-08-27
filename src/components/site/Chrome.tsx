import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle, Pencil, RotateCcw, Eye, Copy, Check } from "lucide-react";
import { T, useSite, useText } from "@/lib/site-content";

export function WhatsAppFab() {
  const number = useText("info.whatsapp").replace(/\D/g, "");
  const message = useText("whatsapp.message");
  return (
    <a
      href={`https://wa.me/34${number}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="pulse-cta fixed right-5 bottom-5 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-cta transition-transform duration-250 hover:scale-105"
    >
      <MessageCircle className="size-7" />
    </a>
  );
}

export function CookieBanner() {
  const [choice, setChoice] = useState<string | null>("accepted");
  const [config, setConfig] = useState(false);

  useEffect(() => {
    setChoice(localStorage.getItem("adassa-cookies"));
  }, []);

const decide = (v: string) => {
  localStorage.setItem("adassa-cookies", v);
  window.dispatchEvent(new Event("adassa-cookies-changed"));
  setChoice(v);
};

  if (choice) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-60 rounded-2xl border border-border bg-card p-5 shadow-lift md:inset-x-auto md:right-5 md:bottom-5 md:max-w-md">
      <h2 className="font-display text-base font-bold">Cookies</h2>
      <T k="cookies.text" as="p" className="mt-2 text-sm text-muted-foreground" />
      {config && (
        <div className="mt-3 space-y-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
          <p>
            <strong className="text-foreground">Necesarias:</strong> siempre activas.
          </p>
          <p>
            <strong className="text-foreground">Terceros (Maps, vídeos, analítica):</strong> solo si
            las aceptas.
          </p>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => decide("all")}
          className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          <T k="cookies.accept" />
        </button>
        <button
          onClick={() => decide("none")}
          className="rounded-full border border-border px-4 py-2 text-sm font-bold transition-colors hover:bg-muted"
        >
          <T k="cookies.reject" />
        </button>
        <button
          onClick={() => setConfig((v) => !v)}
          className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground underline-offset-4 hover:underline"
        >
          <T k="cookies.config" />
        </button>
      </div>
    </div>
  );
}

export function Footer() {
  const { settings } = useSite();
  return (
    <footer className="bg-graphite text-graphite-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <T k="brand.name" as="h2" className="font-display text-xl font-bold" />
          <T k="footer.text" as="p" className="mt-3 max-w-sm text-sm opacity-70" />
          <T k="footer.legalName" as="p" className="mt-4 text-xs opacity-55" />
        </div>
        <div>
          <p className="text-sm font-bold">Secciones</p>
          <ul className="mt-3 space-y-2 text-sm opacity-75">
            <li>
              <a href="#informacion" className="hover:text-primary">
                <T k="nav.info" />
              </a>
            </li>
            <li>
              <a href="#cursos" className="hover:text-primary">
                <T k="nav.cursos" />
              </a>
            </li>
            {settings.showVideos && (
              <li>
                <a href="#videos" className="hover:text-primary">
                  <T k="nav.videos" />
                </a>
              </li>
            )}
            <li>
              <a href="#sedes" className="hover:text-primary">
                <T k="nav.sedes" />
              </a>
            </li>
            <li>
              <a href="#contacto" className="hover:text-primary">
                <T k="nav.contacto" />
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold">Legal</p>
          <ul className="mt-3 space-y-2 text-sm opacity-75">
            <li>
              <Link to="/legal/$doc" params={{ doc: "aviso-legal" }} className="hover:text-primary">
                Aviso Legal
              </Link>
            </li>
            <li>
              <Link to="/legal/$doc" params={{ doc: "privacidad" }} className="hover:text-primary">
                Política de Privacidad
              </Link>
            </li>
            <li>
              <Link to="/legal/$doc" params={{ doc: "cookies" }} className="hover:text-primary">
                Política de Cookies
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  localStorage.removeItem("adassa-cookies");
                  window.location.reload();
                }}
                className="hover:text-primary"
              >
                Configurar cookies
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <T k="footer.rights" as="p" className="container-page text-xs opacity-55" />
      </div>
    </footer>
  );
}

/** Panel de edición: activa el modo edición de textos y muestra/oculta secciones. */
export function EditorBar() {
  const { editing, setEditing, settings, setSetting, reset, exportJson } = useSite();
  const [copied, setCopied] = useState(false);

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        aria-label="Editar textos"
        className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2.5 text-xs font-bold shadow-soft transition-transform hover:scale-[1.03]"
      >
        <Pencil className="size-4 text-primary" />
        Editar textos
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 left-5 z-60 w-[min(20rem,calc(100vw-2.5rem))] rounded-2xl border border-border bg-card p-4 shadow-lift">
      <p className="font-display text-sm font-bold">Modo edición</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Haz clic sobre cualquier texto de la web y escribe. Se guarda solo en este navegador.
      </p>

      <label className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-muted px-3 py-2.5 text-xs font-semibold">
        Sección de vídeos de examen
        <input
          type="checkbox"
          checked={settings.showVideos}
          onChange={(e) => setSetting("showVideos", e.target.checked)}
          className="size-4 accent-[oklch(0.63_0.17_152)]"
        />
      </label>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => setEditing(false)}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-bold text-primary-foreground"
        >
          <Eye className="size-3.5" /> Vista previa
        </button>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(exportJson());
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-bold hover:bg-muted"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />} Copiar JSON
        </button>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-bold hover:bg-muted"
        >
          <RotateCcw className="size-3.5" /> Restaurar
        </button>
      </div>
    </div>
  );
}
