import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer, WhatsAppFab, CookieBanner, EditorBar } from "@/components/site/Chrome";
import { T, defaultTexts } from "@/lib/site-content";

const DOCS = {
  "aviso-legal": {
    key: "aviso",
    title: "Aviso Legal | Autoescuela Adassa",
    description:
      "Aviso legal de Autoescuela Adassa: titular del sitio, condiciones de uso, propiedad intelectual y exclusión de responsabilidad.",
  },
  privacidad: {
    key: "privacidad",
    title: "Política de Privacidad | Autoescuela Adassa",
    description:
      "Cómo trata Autoescuela Adassa tus datos personales: finalidad, base legal, conservación y derechos RGPD.",
  },
  cookies: {
    key: "cookies",
    title: "Política de Cookies | Autoescuela Adassa",
    description:
      "Tipos de cookies que usa la web de Autoescuela Adassa y cómo aceptarlas, rechazarlas o configurarlas.",
  },
} as const;

type DocSlug = keyof typeof DOCS;

export const Route = createFileRoute("/legal/$doc")({
  loader: ({ params }) => {
    if (!(params.doc in DOCS)) throw notFound();
    return { doc: params.doc as DocSlug };
  },
  head: ({ params }) => {
    const meta = DOCS[params.doc as DocSlug];
    if (!meta) return {};
    return {
      meta: [
        { title: meta.title },
        { name: "description", content: meta.description },
        { property: "og:title", content: meta.title },
        { property: "og:description", content: meta.description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: LegalPage,
});

function LegalPage() {
  const { doc } = Route.useLoaderData();
  const base = `legal.${DOCS[doc].key}`;
  const body = defaultTexts[`${base}.body` as keyof typeof defaultTexts];

  return (
    <>
      <Header />
      <main className="container-page py-16 md:py-24">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary-dark"
        >
          <ArrowLeft className="size-4" /> Volver al inicio
        </Link>
        <T k={`${base}.title`} as="h1" className="mt-6 text-4xl font-black md:text-5xl" />
        <div className="mt-8 max-w-3xl space-y-5 text-sm leading-relaxed text-muted-foreground">
          {body.split("\n\n").map((p, i) => (
            <T key={i} k={`${base}.body.p${i}`} as="p" />
          ))}
        </div>
      </main>
      <Footer />
      <WhatsAppFab />
      <CookieBanner />
      <EditorBar />
    </>
  );
}
