import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import {
  HAPPY_BIRTHDAY_BEATS,
  HAPPY_BIRTHDAY_SENTENCE_COUNT,
  KEYS,
  PIANO_KEYS,
  getAccidentalBadgeText,
  getDiatonicChords,
  getHappyBirthdayNotes,
  getHappyBirthdaySequence,
  getKeyColor,
  getKeyColorHue,
  getNeighborIndices,
  getRelativeMinorScaleSpelling,
  getRelativeMinorTonicPitchClass,
  getScaleDifference,
  getScalePitchClasses,
  getTriadFrequencies,
  getTriadNotes,
  getTriadPitchClasses,
  getWheelNumerals,
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

  it("gives a diminished triad a minor third and a diminished fifth (B°)", () => {
    expect(getTriadPitchClasses(11, "diminished")).toEqual({
      root: 11,
      third: 2,
      fifth: 5,
    });
  });

  it("lays out 2 chromatic octaves for the on-screen keyboard", () => {
    expect(PIANO_KEYS.length).toBe(24);
    const oneOctave = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    expect(PIANO_KEYS.map((k) => k.pitchClass)).toEqual([
      ...oneOctave,
      ...oneOctave,
    ]);
    expect(PIANO_KEYS.map((k) => k.octave)).toEqual([
      ...Array(12).fill(4),
      ...Array(12).fill(5),
    ]);
    expect(PIANO_KEYS.filter((k) => k.isBlack).length).toBe(10);
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
      doubledRoot: { pitchClass: 0, octave: 5 },
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

  it("brightens flat major keys relative to sharp majors at the same lightness rule", () => {
    const dFlatMajor = KEYS.find((k) => k.name === "D♭")!;
    const gMajor = KEYS.find((k) => k.name === "G")!;
    expect(dFlatMajor.flats).toBeGreaterThan(0);
    expect(gMajor.flats).toBe(0);
    const flatLightness = Number(getKeyColor(dFlatMajor.index, "major").css.match(/(\d+)%\)$/)![1]);
    const sharpLightness = Number(getKeyColor(gMajor.index, "major").css.match(/(\d+)%\)$/)![1]);
    expect(flatLightness).toBeGreaterThan(sharpLightness);
  });

  it("lists C major's 7 diatonic chords with standard roman numerals and functions", () => {
    const cMajor = KEYS.find((k) => k.name === "C")!;
    expect(getDiatonicChords(cMajor, "major")).toEqual([
      { numeral: "I", root: "C", rootPitchClass: 0, quality: "major", functionName: "Tonic" },
      { numeral: "ii", root: "D", rootPitchClass: 2, quality: "minor", functionName: "Supertonic" },
      { numeral: "iii", root: "E", rootPitchClass: 4, quality: "minor", functionName: "Mediant" },
      { numeral: "IV", root: "F", rootPitchClass: 5, quality: "major", functionName: "Subdominant" },
      { numeral: "V", root: "G", rootPitchClass: 7, quality: "major", functionName: "Dominant" },
      { numeral: "vi", root: "A", rootPitchClass: 9, quality: "minor", functionName: "Submediant" },
      { numeral: "vii°", root: "B", rootPitchClass: 11, quality: "diminished", functionName: "Leading Tone" },
    ]);
  });

  it("lists A minor's 7 diatonic chords, matching musicca's reference table", () => {
    const cMajor = KEYS.find((k) => k.name === "C")!;
    expect(getDiatonicChords(cMajor, "minor")).toEqual([
      { numeral: "i", root: "A", rootPitchClass: 9, quality: "minor", functionName: "Tonic" },
      { numeral: "ii°", root: "B", rootPitchClass: 11, quality: "diminished", functionName: "Supertonic" },
      { numeral: "III", root: "C", rootPitchClass: 0, quality: "major", functionName: "Mediant" },
      { numeral: "iv", root: "D", rootPitchClass: 2, quality: "minor", functionName: "Subdominant" },
      { numeral: "v", root: "E", rootPitchClass: 4, quality: "minor", functionName: "Dominant" },
      { numeral: "VI", root: "F", rootPitchClass: 5, quality: "major", functionName: "Submediant" },
      { numeral: "VII", root: "G", rootPitchClass: 7, quality: "major", functionName: "Subtonic" },
    ]);
  });

  it("maps C major's 6 non-diminished diatonic chords onto exactly 3 wheel positions", () => {
    const cIndex = KEYS.findIndex((k) => k.name === "C");
    expect(getWheelNumerals(cIndex, "major")).toEqual([
      { index: cIndex, mode: "major", numeral: "I" },
      { index: cIndex, mode: "minor", numeral: "vi" },
      { index: 1, mode: "major", numeral: "V" },
      { index: 1, mode: "minor", numeral: "iii" },
      { index: 11, mode: "major", numeral: "IV" },
      { index: 11, mode: "minor", numeral: "ii" },
    ]);
  });

  it("maps A minor's 6 non-diminished diatonic chords onto exactly 3 wheel positions", () => {
    const cIndex = KEYS.findIndex((k) => k.name === "C");
    expect(getWheelNumerals(cIndex, "minor")).toEqual([
      { index: cIndex, mode: "minor", numeral: "i" },
      { index: cIndex, mode: "major", numeral: "III" },
      { index: 1, mode: "major", numeral: "VII" },
      { index: 1, mode: "minor", numeral: "v" },
      { index: 11, mode: "major", numeral: "VI" },
      { index: 11, mode: "minor", numeral: "iv" },
    ]);
  });

  it("badges each key with its own accidental glyph repeated once per sharp/flat", () => {
    const byName = (name: string) => KEYS.find((k) => k.name === name)!;
    expect(getAccidentalBadgeText(byName("C"))).toBe("♮");
    expect(getAccidentalBadgeText(byName("G"))).toBe("♯");
    expect(getAccidentalBadgeText(byName("D"))).toBe("♯♯");
    expect(getAccidentalBadgeText(byName("F"))).toBe("♭");
  });

  it("transposes 'Happy Birthday' into any major key as scale degrees (C major: C C D C F E)", () => {
    const cMajor = KEYS.find((k) => k.name === "C")!;
    expect(getHappyBirthdayNotes(cMajor, "major")).toEqual([
      { pitchClass: 0, octave: 4 },
      { pitchClass: 0, octave: 4 },
      { pitchClass: 2, octave: 4 },
      { pitchClass: 0, octave: 4 },
      { pitchClass: 5, octave: 4 },
      { pitchClass: 4, octave: 4 },
    ]);
  });

  it("transposes 'Happy Birthday' into any minor key using the natural minor scale (C minor: C C D C F E♭)", () => {
    const ebMajor = KEYS.find((k) => k.name === "E♭")!;
    expect(getHappyBirthdayNotes(ebMajor, "minor")).toEqual([
      { pitchClass: 0, octave: 4 },
      { pitchClass: 0, octave: 4 },
      { pitchClass: 2, octave: 4 },
      { pitchClass: 0, octave: 4 },
      { pitchClass: 5, octave: 4 },
      { pitchClass: 3, octave: 4 },
    ]);
  });

  it("gives 'Happy Birthday' a syncopated pickup and a held final note (beats: 0.5 0.5 1 1 1 2)", () => {
    expect(HAPPY_BIRTHDAY_BEATS).toEqual([0.5, 0.5, 1, 1, 1, 2]);
  });

  it("repeats the full transposed phrase 4 times to play all 4 sung lines", () => {
    const cMajor = KEYS.find((k) => k.name === "C")!;
    const sequence = getHappyBirthdaySequence(cMajor, "major");
    const phrase = getHappyBirthdayNotes(cMajor, "major");
    expect(sequence.length).toBe(phrase.length * HAPPY_BIRTHDAY_SENTENCE_COUNT);
    expect(HAPPY_BIRTHDAY_SENTENCE_COUNT).toBe(4);
    expect(sequence.map((n) => n.beats)).toEqual([
      ...HAPPY_BIRTHDAY_BEATS,
      ...HAPPY_BIRTHDAY_BEATS,
      ...HAPPY_BIRTHDAY_BEATS,
      ...HAPPY_BIRTHDAY_BEATS,
    ]);
    expect(sequence.map((n) => ({ pitchClass: n.pitchClass, octave: n.octave }))).toEqual([
      ...phrase,
      ...phrase,
      ...phrase,
      ...phrase,
    ]);
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

  it("merges the picked-key name into the centre of the circle, not a separate panel", () => {
    const wrapper = doc!.querySelector(".circle-wrapper");
    const center = doc!.querySelector('[data-testid="circle-center"]');
    expect(center).toBeTruthy();
    expect(wrapper!.contains(center)).toBe(true);
    expect(center!.querySelector('[data-field="name"]')).toBeTruthy();
    expect(center!.querySelector('[data-field="colour"]')).toBeTruthy();
    // Only one key-info section exists — it's no longer duplicated as a
    // separate side-by-side panel outside the circle column.
    expect(doc!.querySelectorAll('[data-testid="key-info"]').length).toBe(1);
  });

  it("gives the circle both an outer and an inner border ring", () => {
    expect(doc!.querySelector(".circle-wrapper")).toBeTruthy();
    expect(doc!.querySelector(".circle-inner-border")).toBeTruthy();
  });

  it("renders a key-signature accidental badge for every major key", () => {
    const badges = Array.from(doc!.querySelectorAll(".key-signature-badge"));
    expect(badges.length).toBe(12);
  });

  it("provides an empty chord-table body for the client script to populate on click", () => {
    const tableBody = doc!.querySelector('[data-testid="chord-table-body"]');
    expect(tableBody).toBeTruthy();
    expect(tableBody!.children.length).toBe(0);
    const headers = Array.from(
      doc!.querySelectorAll('[data-testid="chord-table"] th'),
    ).map((th) => th.textContent);
    expect(headers).toEqual(["Chord", "Function", "Root"]);
  });

  it("renders a roman-numeral slot on every one of the 24 wedges", () => {
    const numerals = doc!.querySelectorAll('[data-testid="wedge-numeral"]');
    expect(numerals.length).toBe(24);
  });

  it("renders 2 octaves of piano keys matching PIANO_KEYS, each with a pitch class and octave", () => {
    const pianoKeys = Array.from(doc!.querySelectorAll("[data-pitch-class]"));
    expect(pianoKeys.length).toBe(24);
    expect(pianoKeys.map((k) => k.getAttribute("data-pitch-class"))).toEqual(
      PIANO_KEYS.map((k) => String(k.pitchClass)),
    );
    expect(pianoKeys.map((k) => k.getAttribute("data-octave"))).toEqual(
      PIANO_KEYS.map((k) => String(k.octave)),
    );
    expect(
      pianoKeys.filter((k) => k.classList.contains("piano-key-black")).length,
    ).toBe(10);
  });

  it("renders each piano key as a clickable button labeled with its note name", () => {
    const pianoKeys = Array.from(doc!.querySelectorAll("[data-pitch-class]"));
    for (const key of pianoKeys) {
      expect(key.tagName).toBe("BUTTON");
      expect(key.querySelector(".piano-key-label")?.textContent).toBeTruthy();
    }
  });

  it("labels every black key with both its sharp and flat names", () => {
    const blackKeys = Array.from(doc!.querySelectorAll(".piano-key-black"));
    expect(blackKeys.length).toBe(10);
    for (const key of blackKeys) {
      const spans = Array.from(key.querySelectorAll(".piano-key-label-black span")).map(
        (el) => el.textContent,
      );
      expect(spans.length).toBe(2);
      expect(spans[0]).toContain("♯");
      expect(spans[1]).toContain("♭");
    }
  });

  it("renders a Happy Birthday button, disabled until a key is picked", () => {
    const button = doc!.querySelector('[data-testid="happy-birthday-button"]');
    expect(button).toBeTruthy();
    expect(button!.hasAttribute("disabled")).toBe(true);
  });

  it("renders no ring legend or caption text", () => {
    expect(doc!.querySelector(".legend")).toBeFalsy();
    expect(doc!.querySelector(".circle-caption")).toBeFalsy();
  });

  it("labels minor wedges with the 'm' suffix (Am, Em, ...) instead of a bare letter name", () => {
    const minorNames = Array.from(
      doc!.querySelectorAll('button[data-mode="minor"] .wedge-name'),
    ).map((el) => el.textContent?.trim());
    expect(minorNames.length).toBe(12);
    for (const name of minorNames) {
      expect(name).toMatch(/m(?: \/ .+m)?$/);
    }
    expect(minorNames).toContain("Am");
    expect(minorNames).toContain("Em");
  });

  it("gives every wedge an SVG border tracing its own sector, for the neighbour-highlight outline", () => {
    const paths = doc!.querySelectorAll(".wedge-border path");
    expect(paths.length).toBe(24);
    for (const path of paths) {
      expect(path.getAttribute("d")).toBeTruthy();
    }
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

    it(`${name} cites musicca.com and chromatone.center as circle-of-fifths references`, () => {
      const links = Array.from(doc.querySelectorAll("footer a")).map((a) =>
        a.getAttribute("href"),
      );
      expect(links).toContain("https://www.musicca.com/circle-of-fifths");
      expect(links).toContain("https://fifths.chromatone.center/");
    });
  }
});
