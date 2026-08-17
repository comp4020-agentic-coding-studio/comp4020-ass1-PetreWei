export interface KeyInfo {
  readonly index: number;
  readonly name: string;
  readonly tonicPitchClass: number;
  readonly scaleSpelling: readonly string[];
  readonly sharps: number;
  readonly flats: number;
  readonly relativeMinorName: string;
  readonly majorColorName: string;
  readonly minorColorName: string;
}

export type KeyQuality = "major" | "minor";

export interface KeyColor {
  readonly hue: number;
  readonly css: string;
  readonly textColor: string;
  readonly name: string;
}

export interface ScaleDifference {
  noteOnlyInA: string;
  noteOnlyInB: string;
}

export interface TriadFrequencies {
  root: number;
  third: number;
  fifth: number;
}

export interface TriadPitchClasses {
  root: number;
  third: number;
  fifth: number;
}

export interface PianoKeyInfo {
  readonly pitchClass: number;
  readonly label: string;
  readonly isBlack: boolean;
  readonly whiteIndex: number;
}

export const MAJOR_SCALE_INTERVALS: readonly number[] = [0, 2, 4, 5, 7, 9, 11];

// Standard major-key data: 12 keys in circle-of-fifths order, clockwise from
// C. Spellings are hardcoded rather than derived by letter-cycling because
// the enharmonic point (F♯/G♭, index 6) needs E♯, not F, as its 7th degree —
// an edge case a generic letter-cycling algorithm gets wrong.
// Relative-minor names and Mr Mars' colour names are hardcoded for the same
// reason: no formula recovers "D♯ / E♭" or "Chrysolite" from a pitch class.
// See getRelativeMinorTonicPitchClass/getRelativeMinorScaleSpelling below for
// the parts that *are* derived (pitch class, scale spelling).
export const KEYS: readonly KeyInfo[] = [
  { index: 0, name: "C", tonicPitchClass: 0, scaleSpelling: ["C", "D", "E", "F", "G", "A", "B"], sharps: 0, flats: 0, relativeMinorName: "A", majorColorName: "Cyan", minorColorName: "Pthalo Green" },
  { index: 1, name: "G", tonicPitchClass: 7, scaleSpelling: ["G", "A", "B", "C", "D", "E", "F♯"], sharps: 1, flats: 0, relativeMinorName: "E", majorColorName: "Chrysolite", minorColorName: "Brunswick Green" },
  { index: 2, name: "D", tonicPitchClass: 2, scaleSpelling: ["D", "E", "F♯", "G", "A", "B", "C♯"], sharps: 2, flats: 0, relativeMinorName: "B", majorColorName: "Bright Green", minorColorName: "Zucchini" },
  { index: 3, name: "A", tonicPitchClass: 9, scaleSpelling: ["A", "B", "C♯", "D", "E", "F♯", "G♯"], sharps: 3, flats: 0, relativeMinorName: "F♯", majorColorName: "Chartreuse", minorColorName: "Oak Leaf" },
  { index: 4, name: "E", tonicPitchClass: 4, scaleSpelling: ["E", "F♯", "G♯", "A", "B", "C♯", "D♯"], sharps: 4, flats: 0, relativeMinorName: "C♯", majorColorName: "Yellow", minorColorName: "Olive Drab" },
  { index: 5, name: "B", tonicPitchClass: 11, scaleSpelling: ["B", "C♯", "D♯", "E", "F♯", "G♯", "A♯"], sharps: 5, flats: 0, relativeMinorName: "G♯", majorColorName: "Turmeric", minorColorName: "Milk Chocolate" },
  { index: 6, name: "F♯ / G♭", tonicPitchClass: 6, scaleSpelling: ["F♯", "G♯", "A♯", "B", "C♯", "D♯", "E♯"], sharps: 6, flats: 0, relativeMinorName: "D♯ / E♭", majorColorName: "Red", minorColorName: "Maroon" },
  { index: 7, name: "D♭", tonicPitchClass: 1, scaleSpelling: ["D♭", "E♭", "F", "G♭", "A♭", "B♭", "C"], sharps: 0, flats: 5, relativeMinorName: "B♭", majorColorName: "Pink", minorColorName: "Elderberry" },
  { index: 8, name: "A♭", tonicPitchClass: 8, scaleSpelling: ["A♭", "B♭", "C", "D♭", "E♭", "F", "G"], sharps: 0, flats: 4, relativeMinorName: "F", majorColorName: "Magenta", minorColorName: "Purple" },
  { index: 9, name: "E♭", tonicPitchClass: 3, scaleSpelling: ["E♭", "F", "G", "A♭", "B♭", "C", "D"], sharps: 0, flats: 3, relativeMinorName: "C", majorColorName: "Violet", minorColorName: "Spectral Violet" },
  { index: 10, name: "B♭", tonicPitchClass: 10, scaleSpelling: ["B♭", "C", "D", "E♭", "F", "G", "A"], sharps: 0, flats: 2, relativeMinorName: "G", majorColorName: "Corn Flower", minorColorName: "Ultramarine" },
  { index: 11, name: "F", tonicPitchClass: 5, scaleSpelling: ["F", "G", "A", "B♭", "C", "D", "E"], sharps: 0, flats: 1, relativeMinorName: "D", majorColorName: "Azure", minorColorName: "Prussian Blue" },
];

export function getScalePitchClasses(tonicPitchClass: number): number[] {
  return MAJOR_SCALE_INTERVALS.map((interval) => (tonicPitchClass + interval) % 12);
}

export function getNeighborIndices(index: number): { dominant: number; subdominant: number } {
  return {
    dominant: (index + 1) % KEYS.length,
    subdominant: (index + KEYS.length - 1) % KEYS.length,
  };
}

// Adjacent keys on the circle of fifths always share exactly 6 of their 7
// pitch classes; this finds the one that doesn't match on each side and
// reads its spelled name back out of that key's own scale.
export function getScaleDifference(indexA: number, indexB: number): ScaleDifference {
  const keyA = KEYS[indexA];
  const keyB = KEYS[indexB];
  const pitchesA = getScalePitchClasses(keyA.tonicPitchClass);
  const pitchesB = getScalePitchClasses(keyB.tonicPitchClass);

  const onlyInAIndex = pitchesA.findIndex((pc) => !pitchesB.includes(pc));
  const onlyInBIndex = pitchesB.findIndex((pc) => !pitchesA.includes(pc));

  if (onlyInAIndex === -1 || onlyInBIndex === -1) {
    throw new Error(`Expected exactly one differing note between ${keyA.name} and ${keyB.name}`);
  }

  return {
    noteOnlyInA: keyA.scaleSpelling[onlyInAIndex],
    noteOnlyInB: keyB.scaleSpelling[onlyInBIndex],
  };
}

export function getRelativeMinorTonicPitchClass(tonicPitchClass: number): number {
  return (tonicPitchClass + 9) % 12;
}

// A natural minor scale is its relative major's scale starting on the 6th
// degree instead of the 1st — same 7 pitch classes, same spellings, just
// rotated. (C major C-D-E-F-G-A-B rotated to start at index 5 gives A minor
// A-B-C-D-E-F-G.) This avoids hand-spelling 12 more enharmonic-edge-case scales.
export function getRelativeMinorScaleSpelling(key: KeyInfo): string[] {
  const spelling = key.scaleSpelling;
  return [...spelling.slice(5), ...spelling.slice(0, 5)];
}

export function pitchClassToFrequency(pitchClass: number, octave = 4): number {
  const semitoneFromA4 = (octave - 4) * 12 + (pitchClass - 9);
  return 440 * 2 ** (semitoneFromA4 / 12);
}

export function getTriadPitchClasses(
  tonicPitchClass: number,
  quality: KeyQuality = "major",
): TriadPitchClasses {
  const thirdInterval = quality === "major" ? 4 : 3;
  return {
    root: tonicPitchClass,
    third: (tonicPitchClass + thirdInterval) % 12,
    fifth: (tonicPitchClass + 7) % 12,
  };
}

export function getTriadFrequencies(
  tonicPitchClass: number,
  quality: KeyQuality = "major",
): TriadFrequencies {
  const { root, third, fifth } = getTriadPitchClasses(tonicPitchClass, quality);
  const thirdInterval = quality === "major" ? 4 : 3;
  const thirdOctave = tonicPitchClass + thirdInterval >= 12 ? 5 : 4;
  const fifthOctave = tonicPitchClass + 7 >= 12 ? 5 : 4;
  return {
    root: pitchClassToFrequency(root, 4),
    third: pitchClassToFrequency(third, thirdOctave),
    fifth: pitchClassToFrequency(fifth, fifthOctave),
  };
}

// One chromatic octave for the on-screen keyboard. whiteIndex doubles as the
// horizontal layout coordinate: 0-6 for white keys, x.5 for the black key
// sitting on the boundary right after white key x.
export const PIANO_KEYS: readonly PianoKeyInfo[] = [
  { pitchClass: 0, label: "C", isBlack: false, whiteIndex: 0 },
  { pitchClass: 1, label: "C♯", isBlack: true, whiteIndex: 0.5 },
  { pitchClass: 2, label: "D", isBlack: false, whiteIndex: 1 },
  { pitchClass: 3, label: "D♯", isBlack: true, whiteIndex: 1.5 },
  { pitchClass: 4, label: "E", isBlack: false, whiteIndex: 2 },
  { pitchClass: 5, label: "F", isBlack: false, whiteIndex: 3 },
  { pitchClass: 6, label: "F♯", isBlack: true, whiteIndex: 3.5 },
  { pitchClass: 7, label: "G", isBlack: false, whiteIndex: 4 },
  { pitchClass: 8, label: "G♯", isBlack: true, whiteIndex: 4.5 },
  { pitchClass: 9, label: "A", isBlack: false, whiteIndex: 5 },
  { pitchClass: 10, label: "A♯", isBlack: true, whiteIndex: 5.5 },
  { pitchClass: 11, label: "B", isBlack: false, whiteIndex: 6 },
];

export function formatKeySignature(key: KeyInfo): string {
  if (key.sharps > 0) return key.sharps === 1 ? "1 sharp" : `${key.sharps} sharps`;
  if (key.flats > 0) return key.flats === 1 ? "1 flat" : `${key.flats} flats`;
  return "no sharps or flats";
}

// Mr Mars' colour wheel (see references) assigns each major key a named hue
// in strict rainbow order around the circle of fifths, anchored on F♯/G♭ =
// Red and stepping 30° per key: F♯/G♭=0° Red, B=30° Turmeric, E=60° Yellow,
// A=90° Chartreuse, D=120° Bright Green, G=150° Chrysolite, C=180° Cyan,
// F=210° Azure, B♭=240° Corn Flower, E♭=270° Violet, A♭=300° Magenta,
// D♭=330° Pink. This derives that hue from a key's circle index instead of
// hardcoding all 12 numbers.
export function getKeyColorHue(index: number): number {
  return ((((6 - index) % 12) + 12) % 12) * 30;
}


// Converts an sRGB channel (0-1) to the linear value used by the WCAG
// relative-luminance formula.
function toLinearChannel(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function hslToRgb(hue: number, saturation: number, lightness: number): [number, number, number] {
  const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = lightness - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (hue < 60) [r, g, b] = [c, x, 0];
  else if (hue < 120) [r, g, b] = [x, c, 0];
  else if (hue < 180) [r, g, b] = [0, c, x];
  else if (hue < 240) [r, g, b] = [0, x, c];
  else if (hue < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [r + m, g + m, b + m];
}

// Picks black or white text for a given HSL colour by WCAG relative
// luminance, so every generated hue (rather than a hand-picked few) stays
// readable without manual per-key tuning.
export function getReadableTextColor(
  hue: number,
  saturation: number,
  lightness: number,
): "#111111" | "#ffffff" {
  const [r, g, b] = hslToRgb(hue, saturation, lightness);
  const luminance =
    0.2126 * toLinearChannel(r) + 0.7152 * toLinearChannel(g) + 0.0722 * toLinearChannel(b);
  return luminance > 0.42 ? "#111111" : "#ffffff";
}

// Major keys get a bright, saturated shade of their hue; minor keys get a
// darker shade of that *same* hue — this is Mr Mars' own stated rule for
// deriving minor colours ("sadness is darker than happiness"), not a
// separately-researched value.
export function getKeyColor(index: number, quality: KeyQuality): KeyColor {
  const hue = getKeyColorHue(index);
  const saturation = quality === "major" ? 0.82 : 0.65;
  const lightness = quality === "major" ? 0.46 : 0.26;
  const key = KEYS[index];
  return {
    hue,
    css: `hsl(${hue}, ${saturation * 100}%, ${lightness * 100}%)`,
    textColor: getReadableTextColor(hue, saturation, lightness),
    name: quality === "major" ? key.majorColorName : key.minorColorName,
  };
}
