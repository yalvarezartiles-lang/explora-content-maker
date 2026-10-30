import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, PenLine } from "lucide-react";
import { T, useText } from "@/lib/site-content";

export type Review = {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  text: string;
};

// Datos simulados — se sustituirán por la respuesta de /api/reviews.
const MOCK_REVIEWS: Review[] = [
  { id: "1", author: "Laura P.", avatar: "https://i.pravatar.cc/96?img=47", rating: 5, text: "Aprobé a la primera. Los profesores tienen muchísima paciencia y te explican todo con calma." },
  { id: "2", author: "Airam S.", avatar: "https://i.pravatar.cc/96?img=12", rating: 5, text: "La app de test me ayudó un montón con el teórico. Trato cercano y horarios flexibles." },
  { id: "3", author: "Nayra M.", avatar: "https://i.pravatar.cc/96?img=32", rating: 5, text: "Volví a conducir tras años sin coger el coche y en pocas clases recuperé la confianza." },
  { id: "4", author: "Jonay R.", avatar: "https://i.pravatar.cc/96?img=15", rating: 5, text: "Muy profesionales y sin gastos sorpresa. La recomiendo a todo el mundo." },
];

export async function fetchGoogleReviews(): Promise<Review[]> {
  // Futuro: const res = await fetch("/api/reviews"); if (!res.ok) throw new Error(); return res.json();
  return MOCK_REVIEWS;
}

function GoogleLogo({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-label="Google">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

export function GoogleReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const url = useText("reviews.url");

  useEffect(() => {
    let alive = true;
    fetchGoogleReviews().then((r) => alive && setReviews(r)).catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="resenas" className="mx-auto max-w-7xl px-5 py-20 md:px-8">
      <div className="flex flex-col items-start gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-bold shadow-soft">
          <GoogleLogo className="size-4" />
          <span>5,0</span>
          <span className="flex">
            {Array.from({ length: 5 }).map((_, s) => (
              <Star key={s} className="size-3.5 fill-amber text-amber" />
            ))}
          </span>
        </div>
        <T k="reviews.title" as="h2" className="text-4xl font-black md:text-5xl" />
        <T k="reviews.kicker" as="p" className="text-muted-foreground" />
      </div>

      <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4">
        {reviews.map((r, i) => (
          <motion.article
            key={r.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className="flex w-[82%] shrink-0 snap-start flex-col rounded-2xl border border-border bg-card p-6 shadow-soft md:w-auto"
          >
            <header className="flex items-center gap-3">
              <img src={r.avatar} alt={r.author} loading="lazy" className="size-11 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{r.author}</p>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className={`size-4 ${s < r.rating ? "fill-amber text-amber" : "text-border"}`} />
                  ))}
                </div>
              </div>
              <GoogleLogo />
            </header>
            <p className="mt-4 text-[15px] leading-relaxed text-foreground/90">{r.text}</p>
          </motion.article>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <motion.a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-black text-primary-foreground shadow-lift"
        >
          <PenLine className="size-5" />
          Dejar una reseña
        </motion.a>
      </div>
    </section>
  );
}
