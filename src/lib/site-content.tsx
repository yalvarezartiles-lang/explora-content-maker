import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

/**
 * Todos los textos de la web viven aquí.
 * Se pueden editar en vivo desde el modo edición (?edit=1) y se guardan
 * en el navegador. "Restaurar" vuelve a estos valores por defecto.
 */
export const defaultTexts = {
  "brand.name": "Autoescuela Adassa",
  "brand.tagline": "Educación vial en Gran Canaria",

  "nav.inicio": "Inicio",
  "nav.info": "Información",
  "nav.cursos": "Cursos intensivos",
  "nav.dgt": "DGT",
  "nav.videos": "Vídeos de examen",
  "nav.resenas": "Reseñas",
  "nav.sedes": "Sedes",
  "nav.contacto": "Contacto",
  "nav.cta": "Matricúlate",

  "hero.badge": "Cruce de Arinaga · Vecindario",
  "hero.title": "Sácate el carné sin líos, a tu ritmo",
  "hero.subtitle":
    "Teórica y práctica con profes que te tratan como de la familia. Rápido, eficaz y económico, en el sureste de Gran Canaria.",
  "hero.cta1": "Matricúlate ahora",
  "hero.cta2": "Ver cursos intensivos",
  "hero.note": "Lunes a viernes · 10:00–13:00 y 15:00–20:00",

  "trust.1.value": "5,0★",
  "trust.1.label": "Valoración media en Google",
  "trust.2.value": "+300",
  "trust.2.label": "Alumnos aprobados",
  "trust.3.value": "2",
  "trust.3.label": "Sedes en el sureste",
  "trust.4.value": "100%",
  "trust.4.label": "Trato cercano y familiar",

  "info.kicker": "Quiénes somos",
  "info.title": "Aprender a conducir puede ser fácil",
  "info.text":
    "En Adassa llevamos años enseñando a conducir en Agüimes y Santa Lucía. Clases teóricas claras, prácticas adaptadas a tu nivel y un equipo que va contigo hasta que apruebas. Sin prisas absurdas, sin letra pequeña.",
  "info.1.title": "Formación teórica",
  "info.1.text": "Clases presenciales y tests ilimitados para llegar al examen con seguridad.",
  "info.2.title": "Formación práctica",
  "info.2.text": "Flota moderna y revisada, y prácticas por las zonas reales de examen.",
  "info.3.title": "Financiación",
  "info.3.text": "Facilidades de pago y ayudas del Cabildo de Gran Canaria (consúltanos).",
  "info.4.title": "Trato cercano",
  "info.4.text": "Profes con paciencia infinita. Aquí no te sientes un número.",

  "courses.kicker": "Próximas convocatorias",
  "courses.title": "Cursos intensivos",
  "courses.subtitle": "Plazas limitadas. Reserva con antelación para asegurar la tuya.",
  "courses.1.date": "Del 8 al 19 de septiembre",
  "courses.1.title": "Intensivo teórico B",
  "courses.1.desc": "Dos semanas de clases diarias + tests guiados hasta el examen.",
  "courses.1.badge": "Últimas plazas",
  "courses.1.cta": "Reservar plaza",
  "courses.2.date": "Del 6 al 17 de octubre",
  "courses.2.title": "Intensivo teórico + práctico",
  "courses.2.desc": "Teoría acelerada y prácticas concentradas para sacarlo en un mes.",
  "courses.2.badge": "Plazas abiertas",
  "courses.2.cta": "Reservar plaza",
  "courses.3.date": "Fechas a consultar",
  "courses.3.title": "Recuperación de puntos",
  "courses.3.desc": "Curso homologado para recuperar puntos del permiso de conducir.",
  "courses.3.badge": "Consultar",
  "courses.3.cta": "Pedir información",

  "dgt.kicker": "Trámites DGT",
  "dgt.title": "Tu examen, a un clic",
  "dgt.1.title": "Consulta tu nota",
  "dgt.1.text": "Accede a la Sede Electrónica de la DGT y mira el resultado de tu examen.",
  "dgt.1.cta": "Ir a la Sede Electrónica",
  "dgt.1.url": "https://sede.dgt.gob.es/es/permisos-de-conducir/consulta-notas-examen/",
  "dgt.2.title": "Practica el test teórico",
  "dgt.2.text": "Tests oficiales de la DGT para entrenar antes del examen teórico.",
  "dgt.2.cta": "Hacer tests oficiales",
  "dgt.2.url": "https://www.dgt.es/permisos-de-conducir/pruebas-y-examenes/",

  "videos.kicker": "Novedad",
  "videos.title": "Vídeos de los recorridos de examen",
  "videos.subtitle":
    "Grabaciones reales de los itinerarios más habituales del examen práctico. Repásalos en casa las veces que quieras y llega al examen sabiendo por dónde vas.",
  "videos.1.title": "Recorridos de Vecindario",
  "videos.1.desc": "5 itinerarios completos comentados, con las maniobras y los puntos críticos.",
  "videos.1.price": "19 €",
  "videos.1.cta": "Comprar acceso",
  "videos.2.title": "Recorridos de Cruce de Arinaga",
  "videos.2.desc": "4 itinerarios completos con rotondas, incorporaciones y zonas de riesgo.",
  "videos.2.price": "19 €",
  "videos.2.cta": "Comprar acceso",
  "videos.3.title": "Pack completo",
  "videos.3.desc": "Todos los recorridos de ambas sedes + guía de maniobras en PDF.",
  "videos.3.price": "29 €",
  "videos.3.cta": "Comprar pack",
  "videos.note": "Acceso online durante 3 meses. Pago seguro. Sin permanencia.",

  "reviews.kicker": "Lo que dicen los alumnos",
  "reviews.title": "Reseñas reales de Google",
  "reviews.cta": "Ver todas las reseñas en Google",
  "reviews.url": "https://www.google.com/maps",
  "reviews.1.text":
    "Los mejores. Mucha paciencia y te explican todo con calma hasta que lo entiendes. Aprobé a la primera.",
  "reviews.1.author": "Laura P.",
  "reviews.2.text":
    "Trato familiar y muy buen ambiente. Los profes de prácticas son un 10, te quitan los nervios enseguida.",
  "reviews.2.author": "Airam S.",
  "reviews.3.text":
    "Rápido y sin complicaciones. En dos meses tenía el carné. Recomendable al 100%.",
  "reviews.3.author": "Nayra M.",

  "locations.kicker": "Dónde estamos",
  "locations.title": "Dos sedes en el sureste",
  "locations.1.name": "Cruce de Arinaga",
  "locations.1.address": "Av. Ansite, 57, 35118 Cruce de Arinaga, Agüimes, Las Palmas",
  "locations.1.hours": "L-V: 10:00–13:00 y 15:00–20:00",
  "locations.2.name": "Vecindario",
  "locations.2.address": "Av. de la Unión, 46, 35110 Vecindario, Santa Lucía de Tirajana, Las Palmas",
  "locations.2.hours": "L-V: 10:00–13:00 y 15:00–20:00",
  "locations.cta": "Cómo llegar",

  "contact.kicker": "Hablamos",
  "contact.title": "Cuéntanos qué necesitas",
  "contact.subtitle": "Te respondemos el mismo día laborable. Sin compromiso.",
  "contact.name": "Nombre",
  "contact.phone": "Teléfono",
  "contact.email": "Email",
  "contact.message": "Mensaje",
  "contact.messagePlaceholder": "Quiero información sobre el carné B...",
  "contact.privacy": "He leído y acepto la Política de Privacidad.",
  "contact.submit": "Enviar mensaje",
  "contact.success": "¡Gracias! Te contactaremos muy pronto.",
  "contact.privacyError": "Debes aceptar la Política de Privacidad.",

  "info.phone": "928 18 33 09",
  "info.whatsapp": "638 87 02 00",
  "info.email": "autoescueladassa@hotmail.com",
  "info.hours": "Lunes a viernes: 10:00–13:00 y 15:00–20:00. Cerrado sábados y domingos.",

  "whatsapp.message": "Hola, quiero información sobre matricularme en Autoescuela Adassa",

  "footer.text": "Centro de educación vial en Agüimes y Santa Lucía de Tirajana.",
  "footer.legalName": "Titular: [Nombre / Razón social] · NIF/CIF: [Completar]",
  "footer.rights": "© 2026 Autoescuela Adassa. Todos los derechos reservados.",

  "cookies.text":
    "Usamos cookies técnicas necesarias y, si lo aceptas, cookies de terceros (Google Maps, analítica). Puedes cambiar tu elección cuando quieras.",
  "cookies.accept": "Aceptar todas",
  "cookies.reject": "Rechazar",
  "cookies.config": "Configurar",

  "legal.aviso.title": "Aviso Legal",
  "legal.aviso.body":
    "Titular del sitio web: Autoescuela Adassa. NIF/CIF: [completar antes de publicar]. Domicilio: Av. Ansite, 57, 35118 Cruce de Arinaga, Agüimes, Las Palmas. Teléfono: 928 18 33 09. Email: autoescueladassa@hotmail.com. Datos registrales: [completar].\n\nCondiciones de uso: el acceso a este sitio implica la aceptación de estas condiciones. El usuario se compromete a hacer un uso lícito y adecuado de los contenidos.\n\nPropiedad intelectual e industrial: todos los contenidos (textos, imágenes, vídeos, logotipos y código) son titularidad de Autoescuela Adassa o de terceros que han autorizado su uso, quedando prohibida su reproducción sin autorización.\n\nExclusión de responsabilidad: Autoescuela Adassa no se responsabiliza de los daños derivados del uso del sitio ni del contenido de sitios de terceros enlazados (DGT, Google Maps, Google Business).",
  "legal.privacidad.title": "Política de Privacidad",
  "legal.privacidad.body":
    "Responsable del tratamiento: Autoescuela Adassa, NIF/CIF [completar], Av. Ansite, 57, 35118 Cruce de Arinaga (Agüimes), autoescueladassa@hotmail.com.\n\nFinalidad: atender las solicitudes de información enviadas a través del formulario de contacto, WhatsApp o email, y gestionar la posible matrícula.\n\nBase legitimadora: el consentimiento explícito del interesado (art. 6.1.a RGPD) y, en su caso, la aplicación de medidas precontractuales (art. 6.1.b RGPD).\n\nConservación: los datos se conservarán mientras dure la relación o hasta que solicites su supresión, y después el tiempo legalmente exigible.\n\nDestinatarios: proveedores de servicios de correo electrónico, hosting y mensajería (WhatsApp Business) como encargados de tratamiento. No se realizan otras cesiones salvo obligación legal.\n\nDerechos: puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a autoescueladassa@hotmail.com, acreditando tu identidad. También puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).",
  "legal.cookies.title": "Política de Cookies",
  "legal.cookies.body":
    "Este sitio utiliza cookies propias técnicas o necesarias, imprescindibles para el funcionamiento de la web, que no requieren consentimiento.\n\nCon tu consentimiento, se pueden utilizar cookies de terceros: Google Maps (mapas de las sedes), vídeos embebidos y, en su caso, herramientas de analítica. Estas cookies pueden recoger datos de navegación.\n\nAl entrar en la web se muestra un banner donde puedes aceptar todas, rechazarlas o configurarlas con la misma facilidad. Puedes revocar o modificar tu consentimiento en cualquier momento borrando las cookies del navegador o volviendo a abrir el panel de configuración desde el pie de página.\n\nTambién puedes configurar o bloquear cookies desde las opciones de tu navegador (Chrome, Safari, Firefox, Edge).",
} satisfies Record<string, string>;

export type TextKey = keyof typeof defaultTexts;

export type SiteSettings = {
  showVideos: boolean;
};

export const defaultSettings: SiteSettings = {
  // Sección de vídeos de recorridos de examen: ponla en true para lanzarla.
  showVideos: false,
};

type Store = {
  texts: Record<string, string>;
  settings: SiteSettings;
};

const STORAGE_KEY = "adassa-site-content-v1";

type Ctx = {
  texts: Record<string, string>;
  settings: SiteSettings;
  editing: boolean;
  setEditing: (v: boolean) => void;
  setText: (key: string, value: string) => void;
  setSetting: <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => void;
  reset: () => void;
  exportJson: () => string;
};

const SiteContext = createContext<Ctx | null>(null);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store>({
    texts: { ...defaultTexts },
    settings: { ...defaultSettings },
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Store>;
        setStore({
          texts: { ...defaultTexts, ...(parsed.texts ?? {}) },
          settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
        });
      }
    } catch {
      /* ignore */
    }
    if (new URLSearchParams(window.location.search).get("edit") === "1") {
      setEditing(true);
    }
  }, []);

  const persist = useCallback((next: Store) => {
    setStore(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      texts: store.texts,
      settings: store.settings,
      editing,
      setEditing,
      setText: (key, val) => persist({ ...store, texts: { ...store.texts, [key]: val } }),
      setSetting: (key, val) => persist({ ...store, settings: { ...store.settings, [key]: val } }),
      reset: () => {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
        setStore({ texts: { ...defaultTexts }, settings: { ...defaultSettings } });
      },
      exportJson: () => JSON.stringify(store, null, 2),
    }),
    [store, editing, persist],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite debe usarse dentro de SiteContentProvider");
  return ctx;
}

export function useText(key: TextKey | string) {
  const { texts } = useSite();
  return texts[key] ?? String(key);
}

/** Texto editable. En modo edición se puede escribir directamente encima. */
export function T({
  k,
  as: Tag = "span",
  className,
}: {
  k: TextKey | string;
  as?: ElementType;
  className?: string;
}) {
  const { texts, editing, setText } = useSite();
  const value = texts[k] ?? String(k);

  if (!editing) {
    return <Tag className={className}>{value}</Tag>;
  }

  return (
    <Tag
      className={`${className ?? ""} rounded-sm outline-2 outline-dashed outline-primary/50 outline-offset-2 focus:outline-solid focus:outline-primary`}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      data-key={k}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const next = e.currentTarget.innerText.trim();
        if (next !== value) setText(k, next);
      }}
    >
      {value}
    </Tag>
  );
}
