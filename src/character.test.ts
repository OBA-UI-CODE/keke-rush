import { describe, expect, it } from "vitest";
import { buildLocalCharacter, hashText } from "./character";

describe("local character generation", () => {
  it("returns the same appearance for the same player id", () => {
    expect(buildLocalCharacter("player-1", "Tolu")).toEqual(buildLocalCharacter("player-1", "Tolu"));
  });

  it("keeps identity styling independent from the display name", () => {
    const first = buildLocalCharacter("player-1", "Tolu");
    const renamed = buildLocalCharacter("player-1", "Oba");
    expect(renamed.primaryColor).toBe(first.primaryColor);
    expect(renamed.driverStyle).toBe(first.driverStyle);
    expect(renamed.displayName).toBe("Oba");
  });

  it("uses an unsigned stable hash", () => {
    expect(hashText("keke-rush")).toBe(hashText("keke-rush"));
    expect(hashText("keke-rush")).toBeGreaterThanOrEqual(0);
  });
});
