/**
 * Configuración del formulario de Google Forms.
 * Enlace: https://forms.gle/giAS9aYNeUBe3Yrq7
 * Los identificadores (entry.XXXX) salen del HTML público del formulario.
 */
export const GOOGLE_FORM = {
  FORM_ID: "1FAIpQLSeywNsuy_rsyT4blfH-BTXPDHB_Y9JCW-6FpfZ6-elfFAgFHA",
  ENTRY_IDS: {
    name: "entry.2021154661",
    phone: "entry.1891195714",
    email: "entry.484024409",
    message: "entry.1480395927",
  },
  /** Opcional: enlace para incrustar el formulario tal cual (iframe). */
  EMBED_URL: "",
};

export const isGoogleFormConfigured = () =>
  Boolean(GOOGLE_FORM.FORM_ID && GOOGLE_FORM.ENTRY_IDS.name);

/**
 * Envía los datos a Google Forms. Google no permite leer la respuesta desde
 * el navegador (CORS), por eso se usa mode: "no-cors": la respuesta se guarda
 * igualmente en la hoja de cálculo del formulario.
 */
export async function submitToGoogleForm(values: {
  name: string;
  phone: string;
  email: string;
  message: string;
}) {
  if (!isGoogleFormConfigured()) {
    throw new Error("Google Forms no está configurado todavía.");
  }

  const body = new URLSearchParams();
  for (const [field, entry] of Object.entries(GOOGLE_FORM.ENTRY_IDS)) {
    if (entry) body.append(entry, values[field as keyof typeof values] ?? "");
  }

  await fetch(
    `https://docs.google.com/forms/d/e/${GOOGLE_FORM.FORM_ID}/formResponse`,
    {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    },
  );
}
