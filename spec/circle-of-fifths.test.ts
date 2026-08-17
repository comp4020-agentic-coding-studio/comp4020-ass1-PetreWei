import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { HTML_LANG, LOCALES, PAGE_ORDER, pageHref } from "../src/lib/i18n.ts";
import { STRINGS } from "../src/i18n/index.ts";
import {
  BASE,
  DIST,
  builtPages,
  distFileFor,
  docFor,
  docForFile,
  expectedPages,
  hrefs,
} from "./support/dist.ts";
import {
  HAPPY_BIRTHDAY_LINES,
  KEYS,
  PIANO_KEYS,
  getAccidentalBadgeText,
  getDiatonicChords,
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
    // On the G-rotated keyboard, C's own register is octave 5 (one octave
    // above the textbook octave-4 C major triad).
    const { root, third, fifth } = getTriadFrequencies(0);
    expect(root).toBeCloseTo(523.25, 1);
    expect(third).toBeCloseTo(659.26, 1);
    expect(fifth).toBeCloseTo(784.0, 1);
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

  it("lays out 2 chromatic octaves plus a trailing high G for the on-screen keyboard, rotated to start on G", () => {
    expect(PIANO_KEYS.length).toBe(25);
    const rotatedOctave = [7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6];
    expect(PIANO_KEYS.map((k) => k.pitchClass)).toEqual([
      ...rotatedOctave,
      ...rotatedOctave,
      7,
    ]);
    // Each block starts at G, so its G–B half sits a register below its own
    // C–F♯ half: G4–B4, C5–F♯5, then G5–B5, C6–F♯6, then a lone G6 capping
    // off the right end.
    expect(PIANO_KEYS.map((k) => k.octave)).toEqual([
      ...Array(5).fill(4),
      ...Array(7).fill(5),
      ...Array(5).fill(5),
      ...Array(7).fill(6),
      6,
    ]);
    expect(PIANO_KEYS.filter((k) => k.isBlack).length).toBe(10);
  });

  it("centers every black key on the boundary with the white key right after it, not inside one", () => {
    PIANO_KEYS.forEach((key, i) => {
      if (!key.isBlack) return;
      // The trailing high G means every black key, including the final F♯,
      // now has a white key right after it.
      const nextWhiteKey = PIANO_KEYS[i + 1];
      expect(nextWhiteKey.isBlack).toBe(false);
      expect(nextWhiteKey.whiteIndex).toBe(key.whiteIndex);
    });
  });

  it("computes each triad note's exact pitch class and octave on the G-rotated keyboard", () => {
    // C major: C's own register on this keyboard is 5 (it sits in a block's
    // upper C–F♯ half), so root, third (E) and fifth (G) all land there.
    expect(getTriadNotes(0)).toEqual({
      root: { pitchClass: 0, octave: 5 },
      third: { pitchClass: 4, octave: 5 },
      fifth: { pitchClass: 7, octave: 5 },
      doubledRoot: { pitchClass: 0, octave: 6 },
    });

    // F major: root, third (A) and fifth (C) all share F's own register.
    const fMajor = getTriadNotes(5);
    expect(fMajor.root).toEqual({ pitchClass: 5, octave: 5 });
    expect(fMajor.third).toEqual({ pitchClass: 9, octave: 5 });
    expect(fMajor.fifth).toEqual({ pitchClass: 0, octave: 6 });

    // A♭ major: root stays in the G–B half (octave 4); third (C) and fifth
    // (E♭) land in that block's upper C–F♯ half.
    const abMajor = getTriadNotes(8);
    expect(abMajor.root).toEqual({ pitchClass: 8, octave: 4 });
    expect(abMajor.third).toEqual({ pitchClass: 0, octave: 5 });
    expect(abMajor.fifth).toEqual({ pitchClass: 3, octave: 5 });

    // D♭ major: root, third (F) and fifth (A♭) all share the same register.
    const dbMajor = getTriadNotes(1);
    expect(dbMajor.root).toEqual({ pitchClass: 1, octave: 5 });
    expect(dbMajor.third).toEqual({ pitchClass: 5, octave: 5 });
    expect(dbMajor.fifth).toEqual({ pitchClass: 8, octave: 5 });

    // A minor: still ascends root < third < fifth in frequency.
    const aMinor = getTriadNotes(9, "minor");
    const freqs = [aMinor.root, aMinor.third, aMinor.fifth].map((n) =>
      pitchClassToFrequency(n.pitchClass, n.octave),
    );
    expect(freqs[0]).toBeLessThan(freqs[1]);
    expect(freqs[1]).toBeLessThan(freqs[2]);
  });

  it("places every triad note (root/third/fifth/doubled-root) exactly on the rendered keyboard", () => {
    // A triad's widest span (root to doubled-root) is exactly 1 octave, which
    // always fits somewhere in the keyboard's 2-octave window, in any key.
    const isOnKeyboard = (note: { pitchClass: number; octave: number }) =>
      PIANO_KEYS.some((k) => k.pitchClass === note.pitchClass && k.octave === note.octave);

    for (const key of KEYS) {
      for (const quality of ["major", "minor"] as const) {
        const tonicPitchClass =
          quality === "major" ? key.tonicPitchClass : getRelativeMinorTonicPitchClass(key.tonicPitchClass);
        const triad = getTriadNotes(tonicPitchClass, quality);
        expect(isOnKeyboard(triad.root)).toBe(true);
        expect(isOnKeyboard(triad.third)).toBe(true);
        expect(isOnKeyboard(triad.fifth)).toBe(true);
        expect(isOnKeyboard(triad.doubledRoot)).toBe(true);
      }
    }
  });

  it("lands every Happy Birthday note of every transposition on an exact rendered key, octave included", () => {
    // The highlight looks up (pitchClass, octave) exactly, so anything not on
    // the keyboard would light no key at all — or, worse, before the melody
    // was anchored on its own lowest note, light the wrong octave. The tune
    // spans exactly one octave and the keyboard spans two, so there is room
    // for all 24 transpositions; this asserts it holds for every one of them.
    const keysOnKeyboard = new Set(PIANO_KEYS.map((k) => `${k.pitchClass}:${k.octave}`));
    for (const key of KEYS) {
      for (const quality of ["major", "minor"] as const) {
        for (const note of getHappyBirthdaySequence(key, quality)) {
          expect(
            keysOnKeyboard.has(`${note.pitchClass}:${note.octave}`),
            `${key.name} ${quality}: pitch class ${note.pitchClass} octave ${note.octave} is not a rendered key`,
          ).toBe(true);
        }
      }
    }
  });

  it("keeps the last line of Happy Birthday above the first, never an octave below it", () => {
    // The regression this guards: transcribing the opening dominant *above*
    // the tonic instead of below it left the final line — the tune's highest
    // — sounding a full octave under the three lines before it.
    const semitones = (note: { pitchClass: number; octave: number }) =>
      note.octave * 12 + note.pitchClass;
    for (const key of KEYS) {
      for (const quality of ["major", "minor"] as const) {
        const sequence = getHappyBirthdaySequence(key, quality);
        const firstLineOpening = sequence[0];
        const lastLine = sequence.slice(-6);
        const label = `${key.name} ${quality}`;
        // "Happy birth-" of the last line is the tune's peak region: its
        // opening subdominant sits a minor 7th above the opening dominant.
        expect(semitones(lastLine[0]) - semitones(firstLineOpening), label).toBe(10);
        // And no note anywhere falls below that opening dominant.
        for (const note of sequence) {
          expect(semitones(note), label).toBeGreaterThanOrEqual(semitones(firstLineOpening));
        }
      }
    }
  });

  it("spans exactly one octave, from the dominant below the tonic to the dominant above it", () => {
    const semitones = (note: { pitchClass: number; octave: number }) =>
      note.octave * 12 + note.pitchClass;
    for (const key of KEYS) {
      for (const quality of ["major", "minor"] as const) {
        const pitches = getHappyBirthdaySequence(key, quality).map(semitones);
        expect(Math.max(...pitches) - Math.min(...pitches), `${key.name} ${quality}`).toBe(12);
      }
    }
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

  it("plays all 4 distinct sung lines of 'Happy Birthday' with no repetition (25 notes total)", () => {
    expect(HAPPY_BIRTHDAY_LINES.length).toBe(4);
    expect(HAPPY_BIRTHDAY_LINES.map((line) => line.length)).toEqual([6, 6, 7, 6]);
    const totalNotes = HAPPY_BIRTHDAY_LINES.reduce((sum, line) => sum + line.length, 0);
    expect(totalNotes).toBe(25);

    const cMajor = KEYS.find((k) => k.name === "C")!;
    const sequence = getHappyBirthdaySequence(cMajor, "major");
    expect(sequence.length).toBe(25);

    // The whole tune in C major, note for note as it is actually sung, with
    // the tonic at C5: it opens on the G *below* that tonic and never dips
    // under it again.
    // Line 1 "Happy birthday to you" — G4 G4 A4 G4 C5 B4.
    expect(sequence.slice(0, 6)).toEqual([
      { pitchClass: 7, octave: 4, beats: 0.5 },
      { pitchClass: 7, octave: 4, beats: 0.5 },
      { pitchClass: 9, octave: 4, beats: 1 },
      { pitchClass: 7, octave: 4, beats: 1 },
      { pitchClass: 0, octave: 5, beats: 1 },
      { pitchClass: 11, octave: 4, beats: 2 },
    ]);
    // Line 3 "Happy birthday dear <name>" — G4 G4 G5 E5 C5 B4 A4, whose
    // octave leap up to G5 is the tune's highest note.
    expect(sequence.slice(12, 19)).toEqual([
      { pitchClass: 7, octave: 4, beats: 0.5 },
      { pitchClass: 7, octave: 4, beats: 0.5 },
      { pitchClass: 7, octave: 5, beats: 1 },
      { pitchClass: 4, octave: 5, beats: 1 },
      { pitchClass: 0, octave: 5, beats: 1 },
      { pitchClass: 11, octave: 4, beats: 1 },
      { pitchClass: 9, octave: 4, beats: 2 },
    ]);
    // Line 4 "Happy birthday to you" — F5 F5 E5 C5 D5 C5, sitting above the
    // tonic, not an octave below the lines before it.
    expect(sequence.slice(-6)).toEqual([
      { pitchClass: 5, octave: 5, beats: 0.5 },
      { pitchClass: 5, octave: 5, beats: 0.5 },
      { pitchClass: 4, octave: 5, beats: 1 },
      { pitchClass: 0, octave: 5, beats: 1 },
      { pitchClass: 2, octave: 5, beats: 1 },
      { pitchClass: 0, octave: 5, beats: 2 },
    ]);
  });

  it("transposes 'Happy Birthday' into a minor key using the natural minor scale", () => {
    const ebMajor = KEYS.find((k) => k.name === "E♭")!;
    const sequence = getHappyBirthdaySequence(ebMajor, "minor");
    expect(sequence.length).toBe(25);
    // Its relative minor is C minor, so this reads G4 G4 A♭4 G4 C5 B♭4.
    // Line 1's 6th note lands on the natural (flattened) 7th degree — pitch
    // class 10, not major's 11 — the one note in line 1 where the minor scale
    // actually diverges from the major one.
    expect(sequence[5]).toEqual({ pitchClass: 10, octave: 4, beats: 2 });
    // The 3rd note is the flattened 6th (A♭, pitch class 8) where C major's
    // line 1 has a natural A.
    expect(sequence[2]).toEqual({ pitchClass: 8, octave: 4, beats: 1 });
  });
});

describe.each(LOCALES)(
  "circle of fifths: built home page — %s (static parse, no script execution)",
  (locale) => {
  const t = STRINGS[locale];
  const doc = existsSync(DIST) ? docFor(locale, "home") : null;

  it(`built dist/${distFileFor(locale, "home")}`, () => {
    expect(doc, `dist/${distFileFor(locale, "home")} not found — run the build first`).toBeTruthy();
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
    expect(headers).toEqual([...t.runtime.chordTableHeaders]);
    // Read from the same module the page reads, so the check above only proves
    // the wiring. One hardcoded non-English expectation proves the content.
    if (locale === "es") {
      expect(headers).toEqual(["Acorde", "Función", "Fundamental"]);
    }
  });

  it("renders a roman-numeral slot on every one of the 24 wedges", () => {
    const numerals = doc!.querySelectorAll('[data-testid="wedge-numeral"]');
    expect(numerals.length).toBe(24);
  });

  it("renders 2 octaves plus a trailing high G of piano keys matching PIANO_KEYS, each with a pitch class and octave", () => {
    const pianoKeys = Array.from(doc!.querySelectorAll("[data-pitch-class]"));
    expect(pianoKeys.length).toBe(25);
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

  it("renders each piano key as a clickable button, white keys labeled with their note name and octave", () => {
    const pianoKeys = Array.from(doc!.querySelectorAll("[data-pitch-class]"));
    pianoKeys.forEach((key, i) => {
      expect(key.tagName).toBe("BUTTON");
      const label = key.querySelector(".piano-key-label")?.textContent;
      expect(label).toBeTruthy();
      if (!key.classList.contains("piano-key-black")) {
        expect(label).toBe(`${PIANO_KEYS[i].label}${PIANO_KEYS[i].octave}`);
      }
    });
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
    const minorWedgeNames = Array.from(
      doc!.querySelectorAll('button[data-mode="minor"] .wedge-name'),
    );
    expect(minorWedgeNames.length).toBe(12);
    for (const nameEl of minorWedgeNames) {
      // Every wedge, including the enharmonic one, is a single name — no
      // slash, no second spelling. See the preferredSpelling test below.
      expect(nameEl.textContent?.trim()).toMatch(/m$/);
      expect(nameEl.textContent).not.toContain("/");
    }
    const flatNames = Array.from(
      doc!.querySelectorAll('button[data-mode="minor"] .wedge-name'),
    ).map((el) => el.textContent?.trim());
    expect(flatNames).toContain("Am");
    expect(flatNames).toContain("Em");
  });

  it("draws one unified sector border per key, spanning the selected key and its 2 neighbours", () => {
    const sectors = doc!.querySelectorAll(".sector-border");
    expect(sectors.length).toBe(12);
    const indices = Array.from(sectors).map((el) => el.getAttribute("data-sector-index"));
    expect(new Set(indices).size).toBe(12);
    for (const sector of sectors) {
      const path = sector.querySelector("path");
      expect(path?.getAttribute("d")).toBeTruthy();
    }
    // The old per-wedge sector-border SVGs are gone.
    expect(doc!.querySelector(".wedge-border")).toBeFalsy();
  });

  it("shows only the sharp spelling on the one enharmonic wedge, so its label is no longer than any other", () => {
    // This wedge is two keys spelled two ways. Showing both ("G♭F♯", "E♭mD♯m")
    // made it much the longest label on the wheel and overflowed on a phone,
    // so only the sharp spelling is displayed.
    const major = doc!.querySelector('button[data-mode="major"][data-key="F♯ / G♭"]');
    const minor = doc!.querySelector('button[data-mode="minor"][data-key="D♯ / E♭"]');
    expect(major).toBeTruthy();
    expect(minor).toBeTruthy();
    expect(major!.querySelector(".wedge-name")?.textContent?.trim()).toBe("F♯");
    expect(minor!.querySelector(".wedge-name")?.textContent?.trim()).toBe("D♯m");

    // The dropped spelling is not merely hidden — it is gone from the label.
    for (const button of [major!, minor!]) {
      const label = button.querySelector(".wedge-name")!.textContent ?? "";
      expect(label).not.toContain("♭");
      expect(label).not.toContain("/");
      // No leftover two-span markup.
      expect(button.querySelectorAll(".wedge-name-part").length).toBe(0);
    }

    // Both spellings survive where they cost nothing: the data attribute keeps
    // the key findable, and the aria-label still announces both to a screen
    // reader — in this locale's own words for "flat" ("sol bemol", "降G").
    expect(major!.getAttribute("aria-label")).toBe(t.home.enharmonicMajorLabel);
    expect(minor!.getAttribute("aria-label")).toBe(t.home.enharmonicMinorLabel);
  });

  it("gives the enharmonic minor wedge the same label size as every other inner-ring wedge", () => {
    // It used to carry a smaller font purely to fit two spellings; with one
    // spelling it must match its neighbours, so no wedge is styled specially.
    const minorLabels = Array.from(doc!.querySelectorAll('button[data-mode="minor"] .wedge-name'));
    expect(minorLabels.length).toBe(12);
    for (const label of minorLabels) {
      expect(label.className.trim()).toBe("wedge-name");
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

  it("links to every other page in its OWN locale, base-anchored", () => {
    // The likeliest bug in an i18n refactor is a translated page linking back
    // into English, which nothing else here would catch.
    const links = hrefs(doc!);
    for (const page of PAGE_ORDER) {
      if (page === "home") continue;
      expect(links, `${locale} home should link to its own ${page}`).toContain(
        pageHref(BASE, locale, page),
      );
    }
    const foreign = links.filter(
      (href) =>
        href.startsWith(`${BASE}/`) &&
        !LOCALES.some((other) =>
          PAGE_ORDER.some((page) => pageHref(BASE, other, page) === href),
        ),
    );
    expect(foreign, "unrecognised internal links").toEqual([]);
  });

  it("renders the nav as tabs, with the current page marked", () => {
    const tabs = Array.from(doc!.querySelectorAll(".tab"));
    expect(tabs.length).toBe(5);
    const current = tabs.filter((tab) => tab.getAttribute("aria-current") === "page");
    expect(current.length).toBe(1);
    expect(current[0].textContent?.trim()).toBe(t.nav.home);
  });

  it("declares the right language and offers every other one", () => {
    expect(doc!.documentElement.getAttribute("lang")).toBe(
      locale === "en" ? "en-AU" : locale === "zh" ? "zh-Hans" : locale,
    );
    const langLinks = Array.from(doc!.querySelectorAll(".lang-link"));
    expect(langLinks.length).toBe(LOCALES.length);
    // aria-current="true", not "page" — "page" belongs to the tab nav, where
    // exactly one current tab is an asserted contract.
    const current = langLinks.filter((a) => a.getAttribute("aria-current") === "true");
    expect(current.length).toBe(1);
    expect(current[0].getAttribute("href")).toBe(pageHref(BASE, locale, "home"));
    // Switching language keeps you on the same page.
    for (const other of LOCALES) {
      expect(hrefs(doc!, ".lang-link")).toContain(pageHref(BASE, other, "home"));
    }
  });

  it("keeps the interactive circle, chord table and keyboard on the home page", () => {
    expect(doc!.querySelectorAll(".key-wedge").length).toBe(24);
    expect(doc!.querySelector('[data-testid="chord-table"]')).toBeTruthy();
    expect(doc!.querySelector('[data-testid="piano-keyboard"]')).toBeTruthy();
    expect(doc!.querySelector('[data-testid="happy-birthday-button"]')).toBeTruthy();
    // The client script is what makes them interactive, and it belongs here
    // and nowhere else — see the theory-pages suite below.
    expect(doc!.querySelector("script[src]")).toBeTruthy();
  });
  },
);

// The single long theory page was split into one page per topic. Each is
// prose only: the interactive wheel, chord table and keyboard stay on the
// home page, so none of these may ship a client script.
// The prose pages. Each is text only: the interactive wheel, chord table and
// keyboard stay on the home page, so none of these may ship a client script.
const PROSE_PAGES = ["circle", "chords", "colour", "siteIndex"] as const;

const localePagePairs = LOCALES.flatMap((locale) =>
  PROSE_PAGES.map((page) => ({ locale, page })),
);

describe.each(localePagePairs)("$locale/$page (static parse)", ({ locale, page }) => {
  const t = STRINGS[locale];
  const file = distFileFor(locale, page);
  const doc = existsSync(DIST) ? docFor(locale, page) : null;

  it(`built dist/${file}`, () => {
    expect(doc, `dist/${file} not found — run the build first`).toBeTruthy();
  });

  it("has exactly one top-level heading, naming its topic in its own language, and a nav", () => {
    expect(doc!.querySelectorAll("h1").length).toBe(1);
    expect(doc!.querySelector("h1")?.textContent?.trim()).toBe(t[page].h1);
    expect(doc!.querySelector("nav")).toBeTruthy();
  });

  it("links back to its own locale's home page, base-anchored", () => {
    expect(hrefs(doc!)).toContain(pageHref(BASE, locale, "home"));
  });

  it("marks its own tab as current, and only that one", () => {
    const tabs = Array.from(doc!.querySelectorAll(".tab"));
    expect(tabs.length).toBe(5);
    const current = tabs.filter((tab) => tab.getAttribute("aria-current") === "page");
    // Exactly one, not just "the first one found": marking two tabs current
    // would still satisfy a .find() lookup while being wrong on the page.
    expect(current.length).toBe(1);
    expect(current[0].textContent?.trim()).toBe(t.nav[page]);
  });

  it("carries no client script — the interactive parts live on the home page", () => {
    expect(doc!.querySelectorAll("script").length).toBe(0);
  });

  it("keeps any wide table inside a scroll box, so the page never scrolls sideways", () => {
    // JSDOM cannot measure width, so this asserts the structure that makes
    // overflow impossible rather than the absence of overflow. It exists
    // because the Chords table DID push the Spanish and Italian pages
    // sideways at 390px: their degree names are much longer than English's.
    for (const table of Array.from(doc!.querySelectorAll("table"))) {
      expect(
        table.closest(".chord-table-scroll"),
        `a table on ${file} is not inside a scroll container`,
      ).toBeTruthy();
    }
  });

  it("keeps every prose section's inline markup intact under translation", () => {
    // Prose is stored as HTML strings, which astro check cannot look inside.
    // Comparing the tag multiset against English catches a translation that
    // dropped or mangled a <strong>/<em>/<code>/<a>.
    const shape = (document_: Document) => {
      const counts: Record<string, number> = {};
      for (const el of document_.querySelectorAll("main p *, main li *")) {
        counts[el.tagName] = (counts[el.tagName] ?? 0) + 1;
      }
      return counts;
    };
    expect(shape(doc!)).toEqual(shape(docFor("en", page)));
  });
});

describe.each(LOCALES)("site index — %s (static parse)", (locale) => {
  const doc = existsSync(DIST) ? docFor(locale, "siteIndex") : null;

  it("lists every other page in its table of contents", () => {
    const entries = Array.from(doc!.querySelectorAll(".site-index-entry"));
    expect(entries.length).toBe(4);
    const links = entries.flatMap((entry) =>
      Array.from(entry.querySelectorAll("a")).map((a) => a.getAttribute("href")),
    );
    for (const page of ["home", "circle", "chords", "colour"] as const) {
      expect(links, `${locale} index should link to its own ${page}`).toContain(
        pageHref(BASE, locale, page),
      );
    }
  });

  it("summarises what each page covers", () => {
    for (const entry of Array.from(doc!.querySelectorAll(".site-index-entry"))) {
      expect(entry.querySelector("h2")?.textContent?.trim()).toBeTruthy();
      expect(entry.querySelector("p")?.textContent?.trim().length ?? 0).toBeGreaterThan(20);
    }
  });
});

describe("the built site as a whole", () => {
  // Discovered rather than listed, so adding a page or a locale can't quietly
  // opt it out of these checks.
  const pages = builtPages().map((name) => ({ name, doc: docForFile(name) }));

  it("built the site", () => {
    expect(pages.length, "dist/ not found — run the build first").toBeGreaterThan(0);
  });

  it("emits exactly one page per locale per page key, and no en.html", () => {
    expect(pages.map((page) => page.name)).toEqual(expectedPages());
    expect(pages.length).toBe(LOCALES.length * PAGE_ORDER.length);
    // English lives at index.html; an "en" entry in getStaticPaths would emit a
    // second, competing home page.
    expect(pages.map((page) => page.name)).not.toContain("en.html");
  });

  it("declares the correct language on every page", () => {
    // The course-owned invariants suite only checks that lang is non-empty, so
    // a Spanish page shipping lang="en-AU" would pass there. This is the check
    // that actually matters once there are five languages.
    for (const locale of LOCALES) {
      for (const page of PAGE_ORDER) {
        expect(
          docFor(locale, page).documentElement.getAttribute("lang"),
          `${distFileFor(locale, page)}`,
        ).toBe(HTML_LANG[locale]);
      }
    }
  });

  it("never repeats a footer on any page", () => {
    for (const { name, doc } of pages) {
      expect(doc.querySelector("footer"), `${name} should have no footer`).toBeNull();
    }
  });

  // CI's link check crawls every external URL it can find, on every run.
  // Third-party hosts turned it red twice — a 403 from bot protection and a
  // 429 from rate limiting — neither of which said anything true about this
  // site. So the site now links to nothing external at all: citations are
  // rendered as text instead. This is the guard on that, and it is much
  // stronger than the URL-count ceiling it replaced.
  it("links to nothing external, anywhere", () => {
    for (const { name, doc } of pages) {
      const external = Array.from(doc.querySelectorAll("a[href]"))
        .map((a) => a.getAttribute("href") ?? "")
        .filter((href) => /^(https?:)?\/\//.test(href));
      expect(external, `${name} still links off-site`).toEqual([]);
    }
  });

  it("ships the mobile rules that keep the five tabs on one line", () => {
    // JSDOM has no layout engine, so a test cannot measure that the tabs
    // occupy one row — that is verified in a real browser at 320/360/390px
    // across all five locales. What this CAN do is fail if the breakpoints are
    // deleted or the selectors renamed, which is how the compaction would
    // realistically get lost.
    const css = readdirSync(resolve(DIST, "_astro"))
      .filter((name) => name.endsWith(".css"))
      .map((name) => readFileSync(resolve(DIST, "_astro", name), "utf8"))
      .join("\n");
    expect(css, "no phone breakpoint").toMatch(/width\s*<=\s*480px|max-width:\s*480px/);
    expect(css, "no small-phone breakpoint").toMatch(/width\s*<=\s*340px|max-width:\s*340px/);
    // The compaction works by shrinking the tab font and its horizontal
    // padding; if .tab stops being styled inside a breakpoint, it regressed.
    const mobileBlocks = css.match(/@media[^{]*(?:480px|340px)[^{]*\{(?:[^{}]|\{[^{}]*\})*\}/g) ?? [];
    expect(mobileBlocks.length).toBeGreaterThanOrEqual(2);
    expect(mobileBlocks.join("\n")).toContain(".tab");
  });

  it("links only to pages this site actually builds", () => {
    const known = new Set(
      LOCALES.flatMap((locale) => PAGE_ORDER.map((page) => pageHref(BASE, locale, page))),
    );
    for (const { name, doc } of pages) {
      const unknown = hrefs(doc).filter((href) => !known.has(href));
      expect(unknown, `${name} has links to nowhere`).toEqual([]);
    }
  });
});

describe.each(LOCALES)("references — %s", (locale) => {
  const doc = existsSync(DIST) ? docFor(locale, "siteIndex") : null;
  // Citations are text now, not links, so these read the rendered URL text
  // rather than an href — that is the whole point of the change.
  const citedUrls = () =>
    Array.from(doc!.querySelectorAll(".references-section .reference-url")).map(
      (el) => el.textContent?.trim() ?? "",
    );

  it("gathers all seven sources into one reference list on the index page", () => {
    expect(doc!.querySelector(".references-section")).toBeTruthy();
    expect(doc!.querySelectorAll(".references li").length).toBe(7);
  });

  it("shows every source's URL as copyable text, never as a link", () => {
    expect(citedUrls().length).toBe(7);
    expect(doc!.querySelectorAll(".references-section a").length).toBe(0);
    for (const url of citedUrls()) {
      expect(url, "a citation lost its URL").toMatch(/^https:\/\//);
    }
  });

  it("credits Mr Mars, whose colour scheme the whole site borrows", () => {
    // Attribution is the one citation that is not optional: every colour on
    // the wheel comes from this source. Cited at its canonical URL — safe now
    // that citations are text, since that host 403s crawlers but is never
    // fetched.
    expect(citedUrls()).toContain(
      "https://warrenmars.com/visual_art/theory/colour_wheel/music_colours/music_colours.htm",
    );
    expect(doc!.body.textContent).toContain("Mr Mars");
  });

  it("cites musicca.com and chromatone.center as circle-of-fifths references", () => {
    expect(citedUrls()).toContain("https://www.musicca.com/circle-of-fifths");
    expect(citedUrls()).toContain("https://fifths.chromatone.center/");
  });

  it("cites the sources for the theory the prose pages explain", () => {
    for (const url of [
      "https://en.wikipedia.org/wiki/Chromesthesia",
      "https://en.wikipedia.org/wiki/Circle_of_fifths",
      "https://en.wikipedia.org/wiki/Roman_numeral_analysis",
      "https://en.wikipedia.org/wiki/12_equal_temperament",
    ]) {
      expect(citedUrls(), `missing reference: ${url}`).toContain(url);
    }
  });

  it("marks the English-language source titles with lang, for screen readers", () => {
    // WCAG 3.1.2, Language of Parts: bibliographic convention keeps the title
    // of an English work in English, so it must be tagged as such on a page
    // that is otherwise not in English.
    expect(doc!.querySelectorAll('.references-section cite[lang="en"]').length).toBe(7);
  });
});
