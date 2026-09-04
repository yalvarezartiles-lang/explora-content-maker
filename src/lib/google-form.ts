/**
 * Configuración del formulario de Google Forms.
 *
 * CÓMO RELLENARLO:
 * 1. Abre tu formulario en Google Forms y pulsa "Enviar" > icono del enlace.
 *    El enlace es del tipo:
 *      https://docs.google.com/forms/d/e/1FAIpQLSxxxxxxxxxxxxxxxxxxx/viewform
 *    Copia ese ID largo (1FAIpQLSxxxx...) en FORM_ID.
 * 2. Abre el formulario público, pulsa clic derecho > "Inspeccionar" en cada
 *    campo y copia el atributo name (tiene la forma "entry.123456789").
 *    Pega cada uno en ENTRY_IDS.
 *
 * Mientras FORM_ID esté vacío, el formulario avisa de que falta configurarlo.
 */
export const GOOGLE_FORM = {
  FORM_ID: "",
  ENTRY_IDS: {
    name: "",
    phone: "",
    email: "",
    message: "",
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
