import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import {
  KEYS,
  PIANO_KEYS,
  getKeyColor,
  getKeyColorHue,
  getNeighborIndices,
  getReadableTextColor,
  getRelativeMinorScaleSpelling,
  getRelativeMinorTonicPitchClass,
  getScaleDifference,
  getScalePitchClasses,
  getTriadFrequencies,
  getTriadPitchClasses,
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

  it("computes triad pitch classes for C major", () => {
    expect(getTriadPitchClasses(0)).toEqual({ root: 0, third: 4, fifth: 7 });
  });

  it("wraps triad pitch classes mod 12 for B major", () => {
    expect(getTriadPitchClasses(11)).toEqual({ root: 11, third: 3, fifth: 6 });
  });

  it("lays out exactly one chromatic octave for the on-screen keyboard", () => {
    expect(PIANO_KEYS.map((k) => k.pitchClass)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    ]);
    expect(PIANO_KEYS.filter((k) => k.isBlack).map((k) => k.pitchClass)).toEqual([
      1, 3, 6, 8, 10,
    ]);
  });

  it("derives each relative minor's tonic a minor third below its major", () => {
    expect(KEYS.map((k) => getRelativeMinorTonicPitchClass(k.tonicPitchClass))).toEqual([
      9, 4, 11, 6, 1, 8, 3, 10, 5, 0, 7, 2,
    ]);
  });

  it("spells the natural minor scale as its major's scale rotated to the 6th degree", () => {
    const cMajor = KEYS[0];
    expect(getRelativeMinorScaleSpelling(cMajor)).toEqual([
      "A", "B", "C", "D", "E", "F", "G",
    ]);
    const ebMajor = KEYS.find((k) => k.name === "E♭")!;
    expect(getRelativeMinorScaleSpelling(ebMajor)).toEqual([
      "C", "D", "E♭", "F", "G", "A♭", "B♭",
    ]);
  });

  it("computes a minor triad a minor third above the tonic (A minor)", () => {
    const aMinorTonic = getRelativeMinorTonicPitchClass(KEYS[0].tonicPitchClass);
    expect(getTriadPitchClasses(aMinorTonic, "minor")).toEqual({
      root: 9,
      third: 0,
      fifth: 4,
    });
  });

  it("gives the minor triad a lower frequency third than the major triad at the same tonic", () => {
    const majorThird = getTriadFrequencies(0, "major").third;
    const minorThird = getTriadFrequencies(0, "minor").third;
    expect(minorThird).toBeLessThan(majorThird);
  });

  it("assigns each major key a 30°-step hue anchored on F♯/G♭ = red", () => {
    const fSharpIndex = KEYS.findIndex((k) => k.name === "F♯ / G♭");
    const cIndex = KEYS.findIndex((k) => k.name === "C");
    const dFlatIndex = KEYS.findIndex((k) => k.name === "D♭");
    expect(getKeyColorHue(fSharpIndex)).toBe(0);
    expect(getKeyColorHue(cIndex)).toBe(180);
    expect(getKeyColorHue(dFlatIndex)).toBe(330);

    const hues = KEYS.map((_, i) => getKeyColorHue(i));
    expect(new Set(hues).size).toBe(12);
    for (const hue of hues) expect(hue % 30).toBe(0);
  });

  it("gives minor keys a darker, less saturated shade of their major's hue", () => {
    const major = getKeyColor(0, "major");
    const minor = getKeyColor(0, "minor");
    expect(minor.hue).toBe(major.hue);
    expect(minor.css).not.toBe(major.css);
  });

  it("picks readable text colour by luminance for both light and dark hues", () => {
    expect(getReadableTextColor(60, 0.9, 0.9)).toBe("#111111");
    expect(getReadableTextColor(240, 0.7, 0.15)).toBe("#ffffff");
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

  it("renders 12 major and 12 minor key buttons matching the circle-of-fifths data", () => {
    const majorButtons = Array.from(doc!.querySelectorAll('button[data-mode="major"]'));
    const minorButtons = Array.from(doc!.querySelectorAll('button[data-mode="minor"]'));
    expect(majorButtons.length).toBe(12);
    expect(minorButtons.length).toBe(12);
    expect(majorButtons.map((b) => b.getAttribute("data-key"))).toEqual(
      KEYS.map((k) => k.name),
    );
    expect(minorButtons.map((b) => b.getAttribute("data-key"))).toEqual(
      KEYS.map((k) => k.relativeMinorName),
    );
  });

  it("wires each button's data-index to its circle position, per ring", () => {
    for (const mode of ["major", "minor"]) {
      const buttons = Array.from(doc!.querySelectorAll(`button[data-mode="${mode}"]`));
      buttons.forEach((b, i) => {
        expect(b.getAttribute("data-index")).toBe(String(i));
      });
    }
  });

  it("gives every key button an accessible pressed state and a colour", () => {
    for (const b of doc!.querySelectorAll("button[data-key]")) {
      expect(b.hasAttribute("aria-pressed")).toBe(true);
      expect(b.getAttribute("style")).toContain("--key-color");
    }
  });

  it("provides an info panel target for the client script to update", () => {
    expect(doc!.querySelector('[data-testid="key-info"]')).toBeTruthy();
  });

  it("renders exactly one chromatic octave of piano keys matching PIANO_KEYS", () => {
    const pianoKeys = Array.from(doc!.querySelectorAll("[data-pitch-class]"));
    expect(pianoKeys.length).toBe(12);
    expect(pianoKeys.map((k) => k.getAttribute("data-pitch-class"))).toEqual(
      PIANO_KEYS.map((k) => String(k.pitchClass)),
    );
    expect(
      pianoKeys.filter((k) => k.classList.contains("piano-key-black")).length,
    ).toBe(5);
  });

  it("links to the theory page", () => {
    const links = Array.from(doc!.querySelectorAll("a")).map((a) => a.getAttribute("href"));
    expect(links).toContain("./theory.html");
  });
});

describe("chromesthesia theory page (static parse)", () => {
  const distPath = resolve("dist/theory.html");
  const doc = existsSync(distPath)
    ? new JSDOM(readFileSync(distPath, "utf8")).window.document
    : null;

  it("built dist/theory.html", () => {
    expect(doc, `${distPath} not found — run the build first`).toBeTruthy();
  });

  it("has exactly one top-level heading and a nav", () => {
    expect(doc!.querySelectorAll("h1").length).toBe(1);
    expect(doc!.querySelector("nav")).toBeTruthy();
  });

  it("links back to the home page", () => {
    const links = Array.from(doc!.querySelectorAll("a")).map((a) => a.getAttribute("href"));
    expect(links).toContain("./");
  });
});

describe("references section on every built page", () => {
  const distDir = resolve("dist");
  const pages = existsSync(distDir)
    ? ["index.html", "theory.html"].map((name) => ({
        name,
        doc: new JSDOM(readFileSync(resolve(distDir, name), "utf8")).window.document,
      }))
    : [];

  it("built the site", () => {
    expect(pages.length, "dist/ not found — run the build first").toBeGreaterThan(0);
  });

  for (const { name, doc } of pages) {
    it(`${name} cites Mr Mars' colour wheel as a reference`, () => {
      const links = Array.from(doc.querySelectorAll("footer a")).map((a) =>
        a.getAttribute("href"),
      );
      expect(links).toContain(
        "https://warrenmars.com/visual_art/theory/colour_wheel/music_colours/music_colours.htm",
      );
    });
  }
});
