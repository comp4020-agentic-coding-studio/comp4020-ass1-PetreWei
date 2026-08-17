import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import {
  KEYS,
  getNeighborIndices,
  getScaleDifference,
  getScalePitchClasses,
  getTriadFrequencies,
} from "../src/lib/circleOfFifths.ts";

describe("circle of fifths: pure logic", () => {
  it("orders 12 keys clockwise in fifths starting at C", () => {
    expect(KEYS.map((k) => k.tonicPitchClass)).toEqual([
      0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5,
    ]);
  });

  it("derives G major's pitch classes numerically", () => {
    expect(getScalePitchClasses(7)).toEqual([7, 9, 11, 0, 2, 4, 6]);
  });

  it("keeps each scale's spelling index-aligned with its pitch classes", () => {
    for (const key of KEYS) {
      expect(key.scaleSpelling.length).toBe(
        getScalePitchClasses(key.tonicPitchClass).length,
      );
    }
  });

  it("identifies C's dominant and subdominant neighbors", () => {
    const { dominant, subdominant } = getNeighborIndices(0);
    expect(KEYS[dominant].name).toBe("G");
    expect(KEYS[subdominant].name).toBe("F");
  });

  it("finds the single note that differs between C and G (F becomes F♯)", () => {
    expect(getScaleDifference(0, 1)).toEqual({
      noteOnlyInA: "F",
      noteOnlyInB: "F♯",
    });
  });

  it("finds exactly one differing note between every key and its dominant", () => {
    for (let i = 0; i < KEYS.length; i++) {
      const { dominant } = getNeighborIndices(i);
      expect(() => getScaleDifference(i, dominant)).not.toThrow();
    }
  });

  it("computes standard concert-pitch triad frequencies for C major", () => {
    const { root, third, fifth } = getTriadFrequencies(0);
    expect(root).toBeCloseTo(261.63, 1);
    expect(third).toBeCloseTo(329.63, 1);
    expect(fifth).toBeCloseTo(392.0, 1);
  });

  it("keeps the triad ascending across an octave wrap (B major)", () => {
    const { root, third, fifth } = getTriadFrequencies(11);
    expect(root).toBeLessThan(third);
    expect(third).toBeLessThan(fifth);
    expect(third).toBeCloseTo(622.25, 1);
    expect(fifth).toBeCloseTo(739.99, 1);
  });

  it("matches the standard key-signature sharp/flat counts", () => {
    expect(KEYS.map((k) => k.sharps)).toEqual([0, 1, 2, 3, 4, 5, 6, 0, 0, 0, 0, 0]);
    expect(KEYS.map((k) => k.flats)).toEqual([0, 0, 0, 0, 0, 0, 0, 5, 4, 3, 2, 1]);
  });
});

describe("circle of fifths: built page structure (static parse, no script execution)", () => {
  const distPath = resolve("dist/index.html");
  const doc = existsSync(distPath)
    ? new JSDOM(readFileSync(distPath, "utf8")).window.document
    : null;

  it("built dist/index.html", () => {
    expect(doc, `${distPath} not found — run the build first`).toBeTruthy();
  });

  it("renders exactly 12 key buttons matching the circle-of-fifths data", () => {
    const buttons = Array.from(doc!.querySelectorAll("button[data-key]"));
    expect(buttons.length).toBe(12);
    expect(buttons.map((b) => b.getAttribute("data-key"))).toEqual(
      KEYS.map((k) => k.name),
    );
  });

  it("wires each button's data-index to its circle position", () => {
    const buttons = Array.from(doc!.querySelectorAll("button[data-key]"));
    buttons.forEach((b, i) => {
      expect(b.getAttribute("data-index")).toBe(String(i));
    });
  });

  it("gives each key button an accessible pressed state", () => {
    for (const b of doc!.querySelectorAll("button[data-key]")) {
      expect(b.hasAttribute("aria-pressed")).toBe(true);
    }
  });

  it("provides an info panel target for the client script to update", () => {
    expect(doc!.querySelector('[data-testid="key-info"]')).toBeTruthy();
  });
});
