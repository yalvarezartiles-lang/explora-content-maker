import { describe, it, expect } from 'vitest';
import { validDni, normalizeDni, cartTotal, checkoutStub } from './rules';
describe('Student portal rules', () => {
  it('normalizes the DNI identifier', () => expect(normalizeDni('12345678-z')).toBe('12345678Z'));
  it('checks the official DNI letter', () => { expect(validDni('12345678Z')).toBe(true); expect(validDni('12345678A')).toBe(false); });
  it('calculates totals from quantities in cents', () => expect(cartTotal([{ product: { id: 'p', name: 'Practice', category: 'practice', description: '', price_cents: 2500 }, quantity: 5 }])).toBe(12500));
  it('blocks totals for unconfirmed prices', () => expect(cartTotal([{ product: { id: 'p', name: 'Practice', category: 'practice', description: '', price_cents: null }, quantity: 1 }])).toBeNull());
  it('keeps Stripe and Redsys preparatory without a payable result', () => { for (const provider of ['stripe', 'redsys'] as const) expect(checkoutStub(provider, [])).toEqual({ provider, items: [], ready: false }); });
});
