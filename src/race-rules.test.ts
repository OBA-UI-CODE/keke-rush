import { describe, expect, it } from "vitest";
import { collisionPenalty, isValidFinish, maximumSpeed, PASSENGER_CAPACITY } from "./race-rules";

describe("race rules", () => {
  it("requires exactly three passengers for a valid finish", () => {
    expect(isValidFinish(0)).toBe(false);
    expect(isValidFinish(2)).toBe(false);
    expect(isValidFinish(PASSENGER_CAPACITY)).toBe(true);
    expect(isValidFinish(4)).toBe(false);
  });

  it("makes a loaded keke slower without making it unresponsive", () => {
    expect(maximumSpeed(0)).toBe(25);
    expect(maximumSpeed(3)).toBe(21);
    expect(maximumSpeed(3)).toBeGreaterThan(0);
  });

  it("penalizes traffic more than potholes", () => {
    expect(collisionPenalty("traffic")).toBe(2.5);
    expect(collisionPenalty("pothole")).toBe(1.25);
  });
});
