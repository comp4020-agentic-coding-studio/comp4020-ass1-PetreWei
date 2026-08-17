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
  getTriadNotes,
  getTriadPitchClasses,
  pitchClassToFrequency,
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

  it("lays out 3 chromatic octaves for the on-screen keyboard", () => {
    expect(PIANO_KEYS.length).toBe(36);
    const oneOctave = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    expect(PIANO_KEYS.map((k) => k.pitchClass)).toEqual([
      ...oneOctave,
      ...oneOctave,
      ...oneOctave,
    ]);
    expect(PIANO_KEYS.map((k) => k.octave)).toEqual([
      ...Array(12).fill(3),
      ...Array(12).fill(4),
      ...Array(12).fill(5),
    ]);
    expect(PIANO_KEYS.filter((k) => k.isBlack).length).toBe(15);
  });

  it("centers every black key on the boundary with the white key right after it, not inside one", () => {
    PIANO_KEYS.forEach((key, i) => {
      if (!key.isBlack) return;
      const nextWhiteKey = PIANO_KEYS[i + 1];
      expect(nextWhiteKey.isBlack).toBe(false);
      expect(nextWhiteKey.whiteIndex).toBe(key.whiteIndex);
    });
  });

  it("computes each triad note's exact pitch class and octave (root always octave 4)", () => {
    expect(getTriadNotes(0)).toEqual({
      root: { pitchClass: 0, octave: 4 },
      third: { pitchClass: 4, octave: 4 },
      fifth: { pitchClass: 7, octave: 4 },
    });

    // F major: fifth (C) wraps up to octave 5, third (A) doesn't.
    const fMajor = getTriadNotes(5);
    expect(fMajor.root).toEqual({ pitchClass: 5, octave: 4 });
    expect(fMajor.third).toEqual({ pitchClass: 9, octave: 4 });
    expect(fMajor.fifth).toEqual({ pitchClass: 0, octave: 5 });

    // A♭ major: both third (C) and fifth (E♭) wrap up to octave 5.
    const abMajor = getTriadNotes(8);
    expect(abMajor.third).toEqual({ pitchClass: 0, octave: 5 });
    expect(abMajor.fifth).toEqual({ pitchClass: 3, octave: 5 });

    // D♭ major: neither third (F) nor fifth (A♭) wraps.
    const dbMajor = getTriadNotes(1);
    expect(dbMajor.third).toEqual({ pitchClass: 5, octave: 4 });
    expect(dbMajor.fifth).toEqual({ pitchClass: 8, octave: 4 });

    // A minor: still ascends root < third < fifth in frequency.
    const aMinor = getTriadNotes(9, "minor");
    const freqs = [aMinor.root, aMinor.third, aMinor.fifth].map((n) =>
      pitchClassToFrequency(n.pitchClass, n.octave),
    );
    expect(freqs[0]).toBeLessThan(freqs[1]);
    expect(freqs[1]).toBeLessThan(freqs[2]);
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

  it("renders 3 octaves of piano keys matching PIANO_KEYS, each with a pitch class and octave", () => {
    const pianoKeys = Array.from(doc!.querySelectorAll("[data-pitch-class]"));
    expect(pianoKeys.length).toBe(36);
    expect(pianoKeys.map((k) => k.getAttribute("data-pitch-class"))).toEqual(
      PIANO_KEYS.map((k) => String(k.pitchClass)),
    );
    expect(pianoKeys.map((k) => k.getAttribute("data-octave"))).toEqual(
      PIANO_KEYS.map((k) => String(k.octave)),
    );
    expect(
      pianoKeys.filter((k) => k.classList.contains("piano-key-black")).length,
    ).toBe(15);
  });

  it("renders a chord/arpeggio playback toggle, defaulting to arpeggio", () => {
    const modeButtons = Array.from(doc!.querySelectorAll("[data-playback-mode]"));
    expect(modeButtons.map((b) => b.getAttribute("data-playback-mode"))).toEqual([
      "arpeggio",
      "chord",
    ]);
    expect(modeButtons.map((b) => b.getAttribute("aria-pressed"))).toEqual([
      "true",
      "false",
    ]);
  });

  it("links to the theory page with a base-anchored (not page-relative) href", () => {
    const links = Array.from(doc!.querySelectorAll("a")).map((a) => a.getAttribute("href"));
    expect(links).toContain("/comp4020-ass1-PetreWei/theory.html");
  });

  it("renders the nav as tabs, with the current page marked", () => {
    const tabs = Array.from(doc!.querySelectorAll(".tab"));
    expect(tabs.length).toBe(2);
    const current = tabs.find((t) => t.getAttribute("aria-current") === "page");
    expect(current?.textContent?.trim()).toBe("Home");
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

  it("links back to the home page with a base-anchored (not page-relative) href", () => {
    const links = Array.from(doc!.querySelectorAll("a")).map((a) => a.getAttribute("href"));
    expect(links).toContain("/comp4020-ass1-PetreWei/");
  });

  it("marks the theory tab as current", () => {
    const tabs = Array.from(doc!.querySelectorAll(".tab"));
    const current = tabs.find((t) => t.getAttribute("aria-current") === "page");
    expect(current?.textContent?.trim()).toBe("Theory");
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
