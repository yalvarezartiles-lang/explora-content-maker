import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validDni, normalizeDni, cartTotal, checkoutStub } from './rules';
describe('Student portal rules', () => {
  it('normalizes the DNI identifier', () => assert.equal(normalizeDni('12345678-z'), '12345678Z'));
  it('checks the official DNI letter', () => { assert.equal(validDni('12345678Z'), true); assert.equal(validDni('12345678A'), false); });
  it('calculates totals from quantities in cents', () => assert.equal(cartTotal([{ product: { id: 'p', name: 'Practice', category: 'practice', description: '', price_cents: 2500 }, quantity: 5 }]), 12500));
  it('blocks totals for unconfirmed prices', () => assert.equal(cartTotal([{ product: { id: 'p', name: 'Practice', category: 'practice', description: '', price_cents: null }, quantity: 1 }]), null));
  it('keeps Stripe and Redsys preparatory without a payable result', () => { for (const provider of ['stripe', 'redsys'] as const) assert.deepEqual(checkoutStub(provider, []), { provider, items: [], ready: false }); });
});
