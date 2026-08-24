import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Phone } from "lucide-react";
import { T, useSite, useText } from "@/lib/site-content";

function Traffic() {
  return (
    <span className="flex h-9 w-4 flex-col items-center justify-center gap-[3px] rounded-full bg-graphite px-[3px]">
      <span
        className="h-2 w-2 rounded-full bg-destructive"
        style={{ animation: "light-red 4.5s infinite" }}
      />
      <span
        className="h-2 w-2 rounded-full bg-amber"
        style={{ animation: "light-amber 4.5s infinite" }}
      />
      <span
        className="h-2 w-2 rounded-full bg-primary"
        style={{ animation: "light-green 4.5s infinite" }}
      />
    </span>
  );
}

export function Header() {
  const { settings } = useSite();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const phone = useText("info.phone");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links: { href: string; k: string }[] = [
    { href: "#inicio", k: "nav.inicio" },
    { href: "#informacion", k: "nav.info" },
    { href: "#cursos", k: "nav.cursos" },
    { href: "#dgt", k: "nav.dgt" },
    ...(settings.showVideos ? [{ href: "#videos", k: "nav.videos" }] : []),
    { href: "#resenas", k: "nav.resenas" },
    { href: "#sedes", k: "nav.sedes" },
    { href: "#contacto", k: "nav.contacto" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/90 shadow-soft backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container-page flex h-18 items-center justify-between gap-4 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <Traffic />
          <span className="flex flex-col leading-tight">
            <T k="brand.name" className="font-display text-base font-bold" />
            <T k="brand.tagline" className="text-[11px] text-muted-foreground" />
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-2.5 py-2 text-sm font-medium text-foreground/80 transition-all duration-200 hover:-translate-y-0.5 hover:text-primary-dark"
            >
              <T k={l.k} />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="hidden items-center gap-2 rounded-full border border-border px-3.5 py-2 text-sm font-semibold transition-colors hover:border-primary hover:text-primary-dark md:inline-flex"
          >
            <Phone className="size-4" />
            {phone}
          </a>
          <a
            href="#contacto"
            className="hidden rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-cta transition-all duration-250 hover:scale-[1.03] hover:bg-primary-dark sm:inline-block"
          >
            <T k="nav.cta" />
          </a>
          <button
            aria-label="Abrir menú"
            onClick={() => setOpen((v) => !v)}
            className="rounded-md border border-border p-2 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container-page grid gap-1 py-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-sm font-semibold hover:bg-accent hover:text-accent-foreground"
              >
                <T k={l.k} />
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
