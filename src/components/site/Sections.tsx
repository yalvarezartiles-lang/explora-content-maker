import { useEffect, useState, type ReactNode } from "react";
import {
  BookOpen,
  Car,
  Wallet,
  HeartHandshake,
  CalendarDays,
  FileCheck2,
  ListChecks,
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  PlayCircle,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { T, useSite, useText } from "@/lib/site-content";
import heroImg from "@/assets/hero-adassa.jpg";
import slideCoche from "@/assets/slide-coche.jpg";
import slideOferta from "@/assets/slide-oferta.jpg";

const heroSlides = [
  { img: heroImg, alt: "Alumna de Autoescuela Adassa al volante durante una clase práctica", k: 1 },
  { img: slideCoche, alt: "Coche de la flota de Autoescuela Adassa", k: 2 },
  { img: slideOferta, alt: "Alumnos celebrando el aprobado del examen de conducir", k: 3 },
];

function HeroCarousel() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % heroSlides.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative aspect-[4/3.2] w-full overflow-hidden rounded-3xl shadow-lift">
      {heroSlides.map((s, idx) => (
        <div
          key={s.k}
          className={`absolute inset-0 transition-opacity duration-700 ${
            idx === i ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={s.img}
            alt={s.alt}
            width={1408}
            height={1104}
            loading={idx === 0 ? "eager" : "lazy"}
            className="size-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-graphite/85 to-transparent p-5 pb-10 text-left">
            <T
              k={`hero.slide.${s.k}.title`}
              as="p"
              className="font-display text-lg font-bold text-primary-foreground"
            />
            <T
              k={`hero.slide.${s.k}.text`}
              as="p"
              className="mt-1 text-sm text-primary-foreground/80"
            />
          </div>
        </div>
      ))}
      <div className="absolute top-4 right-4 z-10 flex gap-1.5">
        {heroSlides.map((s, idx) => (
          <button
            key={s.k}
            aria-label={`Ver imagen ${idx + 1}`}
            onClick={() => setI(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === i ? "w-6 bg-primary" : "w-2 bg-card/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-24 py-20 md:py-28 ${className}`}>
      <div className="container-page reveal">{children}</div>
    </section>
  );
}

function Kicker({ k }: { k: string }) {
  return (
    <T
      k={k}
      as="p"
      className="inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-bold tracking-wide text-accent-foreground uppercase"
    />
  );
}

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24">
      <div
        className="pointer-events-none absolute -top-40 -right-40 size-[34rem] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--primary-soft), transparent 70%)" }}
      />
      <div className="container-page relative grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div className="reveal">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold shadow-soft">
            <MapPin className="size-3.5 text-primary" />
            <T k="hero.badge" />
          </span>
          <T
            k="hero.title"
            as="h1"
            className="mt-6 text-5xl leading-[0.98] font-black text-balance md:text-7xl"
          />
          <T
            k="hero.subtitle"
            as="p"
            className="mt-5 max-w-lg text-lg text-muted-foreground text-pretty"
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contacto"
              className="rounded-full bg-primary px-6 py-3.5 font-bold text-primary-foreground shadow-cta transition-all duration-250 hover:scale-[1.03] hover:bg-primary-dark"
            >
              <T k="hero.cta1" />
            </a>
            <a
              href="#cursos"
              className="rounded-full border border-border bg-card px-6 py-3.5 font-bold transition-all duration-250 hover:-translate-y-0.5 hover:border-primary hover:text-primary-dark"
            >
              <T k="hero.cta2" />
            </a>
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4 text-primary" />
            <T k="hero.note" />
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4 text-primary" />
            <T k="hero.note2" />
          </p>

        </div>
        <div className="reveal relative">
          <HeroCarousel />
          <div className="absolute -bottom-5 -left-2 z-10 flex items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-lift md:left-6">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary-soft">
              <ShieldCheck className="size-5 text-primary-dark" />
            </span>
            <div className="leading-tight">
              <T k="trust.1.value" as="p" className="font-display text-base font-bold" />
              <T k="trust.1.label" as="p" className="text-xs text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrustBar() {
  return (
    <div className="border-y border-border bg-card">
      <div className="container-page grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="text-center md:text-left">
            <T k={`trust.${i}.value`} as="p" className="font-display text-3xl font-black text-primary-dark" />
            <T k={`trust.${i}.label`} as="p" className="mt-1 text-xs text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Info() {
  const icons = [BookOpen, Car, Wallet, HeartHandshake];
  return (
    <Section id="informacion">
      <div className="max-w-2xl">
        <Kicker k="info.kicker" />
        <T k="info.title" as="h2" className="mt-4 text-4xl font-black text-balance md:text-5xl" />
        <T k="info.text" as="p" className="mt-4 text-lg text-muted-foreground text-pretty" />
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {icons.map((Icon, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft">
              <Icon className="size-5 text-primary-dark" />
            </span>
            <T k={`info.${idx + 1}.title`} as="h3" className="mt-4 text-lg font-bold" />
            <T k={`info.${idx + 1}.text`} as="p" className="mt-2 text-sm text-muted-foreground" />
          </div>
        ))}
      </div>
    </Section>
  );
}

export function Courses() {
  return (
    <Section id="cursos" className="bg-card">
      <div className="max-w-2xl">
        <Kicker k="courses.kicker" />
        <T k="courses.title" as="h2" className="mt-4 text-4xl font-black md:text-5xl" />
        <T k="courses.subtitle" as="p" className="mt-3 text-lg text-muted-foreground" />
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <article
            key={i}
            className="flex flex-col rounded-2xl border border-border bg-background p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-dark">
                <CalendarDays className="size-4" />
                <T k={`courses.${i}.date`} />
              </span>
              <T
                k={`courses.${i}.badge`}
                className="rounded-full bg-amber/20 px-2.5 py-1 text-[11px] font-bold text-amber-foreground"
              />
            </div>
            <T k={`courses.${i}.title`} as="h3" className="mt-4 text-xl font-bold" />
            <T k={`courses.${i}.desc`} as="p" className="mt-2 flex-1 text-sm text-muted-foreground" />
            <a
              href="#contacto"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all duration-250 hover:scale-[1.02] hover:bg-primary-dark"
            >
              <T k={`courses.${i}.cta`} />
            </a>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Dgt() {
  const url1 = useText("dgt.1.url");
  const url2 = useText("dgt.2.url");
  const items = [
    { i: 1, Icon: FileCheck2, url: url1 },
    { i: 2, Icon: ListChecks, url: url2 },
  ];
  return (
    <Section id="dgt">
      <Kicker k="dgt.kicker" />
      <T k="dgt.title" as="h2" className="mt-4 text-4xl font-black md:text-5xl" />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {items.map(({ i, Icon, url }) => (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-border bg-graphite p-8 text-graphite-foreground shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-white/10">
              <Icon className="size-6 text-primary" />
            </span>
            <T k={`dgt.${i}.title`} as="h3" className="mt-5 text-2xl font-bold" />
            <T k={`dgt.${i}.text`} as="p" className="mt-2 text-sm opacity-75" />
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
              <T k={`dgt.${i}.cta`} />
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </a>
        ))}
      </div>
    </Section>
  );
}

export function Videos() {
  const { settings } = useSite();
  if (!settings.showVideos) return null;
  return (
    <Section id="videos" className="bg-card">
      <div className="max-w-2xl">
        <Kicker k="videos.kicker" />
        <T k="videos.title" as="h2" className="mt-4 text-4xl font-black text-balance md:text-5xl" />
        <T k="videos.subtitle" as="p" className="mt-4 text-lg text-muted-foreground text-pretty" />
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <article
            key={i}
            className="flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
          >
            <div className="flex aspect-video items-center justify-center bg-graphite">
              <PlayCircle className="size-12 text-primary" />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <T k={`videos.${i}.title`} as="h3" className="text-xl font-bold" />
              <T k={`videos.${i}.desc`} as="p" className="mt-2 flex-1 text-sm text-muted-foreground" />
              <div className="mt-5 flex items-center justify-between gap-3">
                <T k={`videos.${i}.price`} className="font-display text-2xl font-black text-primary-dark" />
                <a
                  href="#contacto"
                  className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all duration-250 hover:scale-[1.02] hover:bg-primary-dark"
                >
                  <T k={`videos.${i}.cta`} />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
      <T k="videos.note" as="p" className="mt-6 text-xs text-muted-foreground" />
    </Section>
  );
}

export function Reviews() {
  const url = useText("reviews.url");
  return (
    <Section id="resenas">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Kicker k="reviews.kicker" />
          <T k="reviews.title" as="h2" className="mt-4 text-4xl font-black md:text-5xl" />
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-bold transition-colors hover:border-primary hover:text-primary-dark"
        >
          <T k="reviews.cta" />
          <ArrowUpRight className="size-4" />
        </a>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <blockquote
            key={i}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
          >
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className="size-4 fill-amber text-amber" />
              ))}
            </div>
            <T k={`reviews.${i}.text`} as="p" className="mt-4 text-sm leading-relaxed" />
            <T k={`reviews.${i}.author`} as="footer" className="mt-4 text-xs font-bold text-muted-foreground" />
          </blockquote>
        ))}
      </div>
    </Section>
  );
}

export function Locations() {
    const [cookiesAccepted, setCookiesAccepted] = useState(false);

  useEffect(() => {
    const check = () => setCookiesAccepted(localStorage.getItem("adassa-cookies") === "all");
    check();
    window.addEventListener("adassa-cookies-changed", check);
    window.addEventListener("storage", check);
    return () => {
      window.removeEventListener("adassa-cookies-changed", check);
      window.removeEventListener("storage", check);
    };
  }, []);
  const addr1 = useText("locations.1.address");
  const addr2 = useText("locations.2.address");
  const addrs = [addr1, addr2];
  return (
    <Section id="sedes" className="bg-card">
      <Kicker k="locations.kicker" />
      <T k="locations.title" as="h2" className="mt-4 text-4xl font-black md:text-5xl" />
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-border bg-background shadow-soft transition-all duration-300 hover:shadow-lift"
          >
                      {cookiesAccepted ? (
            <iframe
              title={`Mapa sede ${i}`}
              className="h-56 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(addrs[i - 1] ?? "")}&output=embed`}
            />
          ) : (
            <div className="h-56 w-full flex flex-col items-center justify-center gap-2 bg-muted p-4 text-center text-sm text-muted-foreground">
              <p>Para ver el mapa necesitamos tu consentimiento de cookies de terceros (Google Maps).</p>
              <button
                onClick={() => {
                  localStorage.setItem("adassa-cookies", "all");
                  window.dispatchEvent(new Event("adassa-cookies-changed"));
                }}
                className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
              >
                Aceptar cookies y ver el mapa
              </button>
            </div>
          )}
            <div className="p-6">
              <T k={`locations.${i}.name`} as="h3" className="text-xl font-bold" />
              <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <T k={`locations.${i}.address`} />
              </p>
              <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                <T k={`locations.${i}.hours`} />
              </p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addrs[i - 1] ?? "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all duration-250 hover:scale-[1.02] hover:bg-primary-dark"
              >
                <T k="locations.cta" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function Contact() {
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const success = useText("contact.success");
  const privacyError = useText("contact.privacyError");
  const phone = useText("info.phone");
  const whatsapp = useText("info.whatsapp");
  const email = useText("info.email");

  return (
    <Section id="contacto">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <Kicker k="contact.kicker" />
          <T k="contact.title" as="h2" className="mt-4 text-4xl font-black md:text-5xl" />
          <T k="contact.subtitle" as="p" className="mt-3 text-lg text-muted-foreground" />
          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <Phone className="size-4 text-primary" />
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="font-semibold hover:text-primary-dark">
                {phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="size-4 text-primary" />
              <a
                href={`https://wa.me/34${whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:text-primary-dark"
              >
                {whatsapp} (WhatsApp)
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-4 text-primary" />
              <a href={`mailto:${email}`} className="font-semibold hover:text-primary-dark">
                {email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
              <T k="info.hours" className="text-muted-foreground" />
            </li>
          </ul>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary-soft mb-4">
              <svg className="size-7 text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <T k="contact.success" as="h3" className="text-xl font-bold" />
            <p className="mt-2 text-sm text-muted-foreground">Hemos recibido tu mensaje. Te contactaremos muy pronto.</p>
          </div>
        ) : (
          <form
            name="contacto-adassa"
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={(e) => {
              e.preventDefault();
              if (!accepted) {
                toast.error(privacyError);
                return;
              }
              const form = e.currentTarget;
              const formData = new FormData(form);
              if (String(formData.get("bot-field") ?? "")) return;

              void supabase
                .from("contact_submissions")
                .insert({
                  name: String(formData.get("name") ?? ""),
                  phone: String(formData.get("phone") ?? ""),
                  email: String(formData.get("email") ?? ""),
                  message: String(formData.get("message") ?? ""),
                })
                .then(({ error }) => {
                  if (error) {
                    toast.error("Error al enviar. Inténtalo de nuevo o escríbenos por WhatsApp.");
                    return;
                  }
                  setSubmitted(true);
                  form.reset();
                  setAccepted(false);
                });
            }}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8"
          >
            {/* Campo honeypot anti-spam (oculto) */}
            <p className="hidden">
              <label>
                No rellenes esto: <input name="bot-field" />
              </label>
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                <T k="contact.name" />
                <input
                  required
                  name="name"
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
                />
              </label>
              <label className="text-sm font-semibold">
                <T k="contact.phone" />
                <input
                  required
                  name="phone"
                  type="tel"
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
                />
              </label>
            </div>
            <label className="mt-4 block text-sm font-semibold">
              <T k="contact.email" />
              <input
                required
                name="email"
                type="email"
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
              />
            </label>
            <label className="mt-4 block text-sm font-semibold">
              <T k="contact.message" />
              <textarea
                required
                name="message"
                rows={4}
                placeholder={useText("contact.messagePlaceholder")}
                className="mt-1.5 w-full resize-y rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
              />
            </label>
            <label className="mt-4 flex items-start gap-2.5 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-0.5 size-4 accent-[oklch(0.63_0.17_152)]"
              />
              <span>
                <T k="contact.privacy" />{" "}
                <Link
                  to="/legal/$doc"
                  params={{ doc: "privacidad" }}
                  className="font-semibold text-primary-dark underline underline-offset-2"
                >
                  Ver política
                </Link>
              </span>
            </label>
            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-primary px-6 py-3.5 font-bold text-primary-foreground shadow-cta transition-all duration-250 hover:scale-[1.01] hover:bg-primary-dark"
            >
              <T k="contact.submit" />
            </button>
          </form>
        )}
      </div>
    </Section>
  );
}
