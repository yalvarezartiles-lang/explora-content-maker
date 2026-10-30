export function normalizeDni(value: string) { return value.replace(/[\s-]/g, '').toUpperCase(); }
export function validDni(value: string) {
  const dni = normalizeDni(value);
  return /^\d{8}[A-Z]$/.test(dni) && 'TRWAGMYFPDXBNJZSQVHLCKE'[Number(dni.slice(0, 8)) % 23] === dni[8];
}
export type Product = { id: string; name: string; description: string; category: string; price_cents: number | null; };
export type CartItem = { product: Product; quantity: number };
export function cartTotal(items: CartItem[]) {
  if (items.some(i => i.product.price_cents === null)) return null;
  return items.reduce((total, i) => total + (i.product.price_cents ?? 0) * i.quantity, 0);
}
export const money = (cents: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(cents / 100);
export function checkoutStub(provider: 'stripe' | 'redsys', items: CartItem[]) {
  // Replace with an authenticated server function. Send IDs/quantities only;
  // the server must reload prices, verify ownership and create the pending order.
  return { provider, items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })), ready: false as const };
}
export const exampleProducts: Product[] = [
  { id: 'example-practice', name: 'Práctica de circulación', description: '45 minutos al volante con tu profesor.', category: 'practice', price_cents: null },
  ...[5, 10, 20].map(n => ({ id: `example-pack-${n}`, name: `Pack ${n} prácticas`, description: `${n} clases para avanzar con confianza.`, category: 'pack', price_cents: null })),
  { id: 'example-fee', name: 'Tasa de tráfico', description: 'Tasa oficial para la presentación a examen.', category: 'fee', price_cents: null },
  { id: 'example-renewal', name: 'Renovación de expediente', description: 'Continúa tu formación y preparación.', category: 'fee', price_cents: null },
];
export function portalHead(title: string, description: string) {
  return { meta: [{ title: `${title} | Alumnos Adassa` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} | Alumnos Adassa` }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex,nofollow' }] };
}
