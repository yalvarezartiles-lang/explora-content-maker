import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer, WhatsAppFab, CookieBanner } from "@/components/site/Chrome";
import {
  Hero,
  TrustBar,
  Info,
  Pack,
  Courses,
  Dgt,
  Videos,
  Reviews,
  Locations,
  Contact,
} from "@/components/site/Sections";

const title = "Autoescuela Adassa | Sácate el carné en Arinaga y Vecindario";
const description =
  "Autoescuela en Cruce de Arinaga y Vecindario (Gran Canaria): teórica, prácticas y cursos intensivos con trato cercano. Llámanos al 928 18 33 09.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Info />
        <Pack />
        <Courses />
        <Dgt />
        <Videos />
        <Reviews />
        <Locations />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
      <CookieBanner />
    </>
  );
}
