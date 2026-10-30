import { describe, expect, it } from "vitest";
import { validateHeroFile } from "./hero-banner";

describe("validateHeroFile", () => {
  it("acepta JPG de 2 MB", () => expect(validateHeroFile({ type: "image/jpeg", size: 2_000_000 })).toBeNull());
  it("rechaza más de 8 MB", () => expect(validateHeroFile({ type: "image/png", size: 9 * 1024 * 1024 })).not.toBeNull());
  it("rechaza PDF", () => expect(validateHeroFile({ type: "application/pdf", size: 1000 })).not.toBeNull());
});
