import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { moveId } from "./carousel-mock";

describe("moveId", () => {
  it("moves right", () => assert.deepEqual(moveId(["a", "b", "c"], "a", 1), ["b", "a", "c"]));
  it("does not move past the start", () => assert.deepEqual(moveId(["a", "b"], "a", -1), ["a", "b"]));
});
