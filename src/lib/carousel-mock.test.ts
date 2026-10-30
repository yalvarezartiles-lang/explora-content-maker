import { describe, expect, it } from "vitest";
import { moveId } from "./carousel-mock";

describe("moveId", () => {
  it("moves right", () => expect(moveId(["a", "b", "c"], "a", 1)).toEqual(["b", "a", "c"]));
  it("does not move past the start", () => expect(moveId(["a", "b"], "a", -1)).toEqual(["a", "b"]));
});
