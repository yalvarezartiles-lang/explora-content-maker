import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateHeroFile } from './hero-file';

describe('validateHeroFile', () => {
  it('acepta JPG de 2 MB', () => assert.equal(validateHeroFile({ type: 'image/jpeg', size: 2_000_000 }), null));
  it('rechaza más de 8 MB', () => assert.notEqual(validateHeroFile({ type: 'image/png', size: 9 * 1024 * 1024 }), null));
  it('rechaza PDF', () => assert.notEqual(validateHeroFile({ type: 'application/pdf', size: 1000 }), null));
});
