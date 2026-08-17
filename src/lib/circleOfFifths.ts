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

export interface TriadNote {
  readonly pitchClass: number;
  readonly octave: number;
}

export interface TriadNotes {
  root: TriadNote;
  third: TriadNote;
  fifth: TriadNote;
  doubledRoot: TriadNote;
}

export interface PianoKeyInfo {
  readonly pitchClass: number;
  readonly label: string;
  readonly flatLabel?: string;
  readonly isBlack: boolean;
  readonly whiteIndex: number;
  readonly octave: number;
}

export type ChordQuality = "major" | "minor" | "diminished";

export interface DiatonicChord {
  readonly numeral: string;
  readonly root: string;
  readonly rootPitchClass: number;
  readonly quality: ChordQuality;
  readonly functionName: string;
}

export interface WheelNumeralAssignment {
  readonly index: number;
  readonly mode: KeyQuality;
  readonly numeral: string;
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
  quality: ChordQuality = "major",
): TriadPitchClasses {
  const thirdInterval = quality === "major" ? 4 : 3;
  const fifthInterval = quality === "diminished" ? 6 : 7;
  return {
    root: tonicPitchClass,
    third: (tonicPitchClass + thirdInterval) % 12,
    fifth: (tonicPitchClass + fifthInterval) % 12,
  };
}

// The on-screen keyboard is rotated to start on G rather than C (see
// PIANO_KEYS below), so "does stacking this interval wrap into the
// keyboard's next block" has to be judged against a G-anchored ordering
// (G=0 ... F♯=11), not raw pitch-class order from C.
function keyboardBlockPosition(pitchClass: number): number {
  return (pitchClass + 5) % 12;
}

// Each rendered block's G–B half sits one register below its own C–F♯ half
// (e.g. block "4" is G4–B4 followed by C5–F♯5) — this mirrors PIANO_KEYS's
// own octaveOffset so every pitch class's "home" register matches the key
// it's actually drawn on.
function keyboardBaseOctave(pitchClass: number): number {
  return pitchClass < 7 ? 5 : 4;
}

// Single source of truth for exactly which note (pitch class + octave) a
// tonic-relative interval lands on. Bumps up a register each time the
// interval carries past the keyboard's own G block boundary (not past C),
// so any note built this way — triad tone or melody note — is guaranteed to
// exist among PIANO_KEYS and the triad/melody always ascends in pitch.
function keyboardOctaveFor(tonicPitchClass: number, semitoneOffset: number): TriadNote {
  const pitchClass = (((tonicPitchClass + semitoneOffset) % 12) + 12) % 12;
  const registerBumps = Math.floor(
    (keyboardBlockPosition(tonicPitchClass) + semitoneOffset) / 12,
  );
  return { pitchClass, octave: keyboardBaseOctave(pitchClass) + registerBumps };
}

// Both audio playback and piano-key highlighting consume this same data, so
// they can never disagree about what note is actually sounding.
export function getTriadNotes(
  tonicPitchClass: number,
  quality: ChordQuality = "major",
): TriadNotes {
  const thirdInterval = quality === "major" ? 4 : 3;
  const fifthInterval = quality === "diminished" ? 6 : 7;
  return {
    root: keyboardOctaveFor(tonicPitchClass, 0),
    third: keyboardOctaveFor(tonicPitchClass, thirdInterval),
    fifth: keyboardOctaveFor(tonicPitchClass, fifthInterval),
    doubledRoot: keyboardOctaveFor(tonicPitchClass, 12),
  };
}

export function getTriadFrequencies(
  tonicPitchClass: number,
  quality: ChordQuality = "major",
): TriadFrequencies {
  const notes = getTriadNotes(tonicPitchClass, quality);
  return {
    root: pitchClassToFrequency(notes.root.pitchClass, notes.root.octave),
    third: pitchClassToFrequency(notes.third.pitchClass, notes.third.octave),
    fifth: pitchClassToFrequency(notes.fifth.pitchClass, notes.fifth.octave),
  };
}

// One chromatic block's worth of key shapes, rotated to start on G rather
// than C. whiteIndex doubles as the horizontal layout coordinate: 0-6 for
// white keys within a block. A black key's whiteIndex is the *next* white
// key's own integer index (not a fractional midpoint of the previous one)
// so it lands exactly on the boundary between two white keys, where a real
// black key sits — not centered inside one. Because the block starts on G,
// it spans parts of two real scientific-pitch octaves: octaveOffset marks
// which half a key belongs to (0 for G–B, 1 for C–F♯).
const PIANO_OCTAVE_TEMPLATE: readonly (Omit<PianoKeyInfo, "octave"> & {
  readonly octaveOffset: 0 | 1;
})[] = [
  { pitchClass: 7, label: "G", isBlack: false, whiteIndex: 0, octaveOffset: 0 },
  { pitchClass: 8, label: "G♯", flatLabel: "A♭", isBlack: true, whiteIndex: 1, octaveOffset: 0 },
  { pitchClass: 9, label: "A", isBlack: false, whiteIndex: 1, octaveOffset: 0 },
  { pitchClass: 10, label: "A♯", flatLabel: "B♭", isBlack: true, whiteIndex: 2, octaveOffset: 0 },
  { pitchClass: 11, label: "B", isBlack: false, whiteIndex: 2, octaveOffset: 0 },
  { pitchClass: 0, label: "C", isBlack: false, whiteIndex: 3, octaveOffset: 1 },
  { pitchClass: 1, label: "C♯", flatLabel: "D♭", isBlack: true, whiteIndex: 4, octaveOffset: 1 },
  { pitchClass: 2, label: "D", isBlack: false, whiteIndex: 4, octaveOffset: 1 },
  { pitchClass: 3, label: "D♯", flatLabel: "E♭", isBlack: true, whiteIndex: 5, octaveOffset: 1 },
  { pitchClass: 4, label: "E", isBlack: false, whiteIndex: 5, octaveOffset: 1 },
  { pitchClass: 5, label: "F", isBlack: false, whiteIndex: 6, octaveOffset: 1 },
  { pitchClass: 6, label: "F♯", flatLabel: "G♭", isBlack: true, whiteIndex: 7, octaveOffset: 1 },
];

// The two rendered blocks: block 0 is G4–B4 then C5–F♯5, block 1 is
// G5–B5 then C6–F♯6 — matching keyboardBaseOctave/keyboardOctaveFor above.
const PIANO_BASE_OCTAVES: readonly number[] = [4, 5];
const WHITE_KEYS_PER_OCTAVE = PIANO_OCTAVE_TEMPLATE.filter((k) => !k.isBlack).length;

export const PIANO_KEYS: readonly PianoKeyInfo[] = PIANO_BASE_OCTAVES.flatMap(
  (baseOctave, blockIndex) =>
    PIANO_OCTAVE_TEMPLATE.map(({ octaveOffset, ...key }) => ({
      ...key,
      octave: baseOctave + octaveOffset,
      whiteIndex: key.whiteIndex + blockIndex * WHITE_KEYS_PER_OCTAVE,
    })),
);

export function formatKeySignature(key: KeyInfo): string {
  if (key.sharps > 0) return key.sharps === 1 ? "1 sharp" : `${key.sharps} sharps`;
  if (key.flats > 0) return key.flats === 1 ? "1 flat" : `${key.flats} flats`;
  return "no sharps or flats";
}

// Repeats the key's own accidental glyph (♯ or ♭) once per sharp/flat, for a
// compact badge next to each key on the wheel — count only, not the specific
// note letters, which already appear in formatKeySignature's full sentence.
export function getAccidentalBadgeText(key: KeyInfo): string {
  if (key.sharps > 0) return "♯".repeat(key.sharps);
  if (key.flats > 0) return "♭".repeat(key.flats);
  return "♮";
}

const MAJOR_DEGREE_NUMERALS: readonly string[] = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
const MAJOR_DEGREE_QUALITIES: readonly ChordQuality[] = [
  "major",
  "minor",
  "minor",
  "major",
  "major",
  "minor",
  "diminished",
];
const MAJOR_DEGREE_FUNCTIONS: readonly string[] = [
  "Tonic",
  "Supertonic",
  "Mediant",
  "Subdominant",
  "Dominant",
  "Submediant",
  "Leading Tone",
];
const MINOR_DEGREE_NUMERALS: readonly string[] = ["i", "ii°", "III", "iv", "v", "VI", "VII"];
const MINOR_DEGREE_QUALITIES: readonly ChordQuality[] = [
  "minor",
  "diminished",
  "major",
  "minor",
  "minor",
  "major",
  "major",
];
// Natural minor's unraised 7th sits a whole step below the tonic, not a half
// step, so convention calls it "Subtonic" rather than "Leading Tone".
const MINOR_DEGREE_FUNCTIONS: readonly string[] = [
  "Tonic",
  "Supertonic",
  "Mediant",
  "Subdominant",
  "Dominant",
  "Submediant",
  "Subtonic",
];

function rotateToSixthDegree<T>(items: readonly T[]): T[] {
  return [...items.slice(5), ...items.slice(0, 5)];
}

// The 7 diatonic triads of a key, one per scale degree, labeled with the
// standard roman-numeral convention (uppercase = major, lowercase = minor,
// lowercase+° = diminished). Reuses the same scale spelling already used for
// the "7 notes of this key" display, so the chord roots and the scale notes
// can never disagree; rootPitchClass is rotated the identical way, so the
// spelled name and the pitch class that plays it can't disagree either.
export function getDiatonicChords(key: KeyInfo, quality: KeyQuality): DiatonicChord[] {
  const spelling = quality === "major" ? key.scaleSpelling : getRelativeMinorScaleSpelling(key);
  const pitchClasses = quality === "major"
    ? getScalePitchClasses(key.tonicPitchClass)
    : rotateToSixthDegree(getScalePitchClasses(key.tonicPitchClass));
  const numerals = quality === "major" ? MAJOR_DEGREE_NUMERALS : MINOR_DEGREE_NUMERALS;
  const qualities = quality === "major" ? MAJOR_DEGREE_QUALITIES : MINOR_DEGREE_QUALITIES;
  const functions = quality === "major" ? MAJOR_DEGREE_FUNCTIONS : MINOR_DEGREE_FUNCTIONS;
  return spelling.map((root, i) => ({
    numeral: numerals[i],
    root,
    rootPitchClass: pitchClasses[i],
    quality: qualities[i],
    functionName: functions[i],
  }));
}

// The 6 non-diminished diatonic chords of any selected key always land on
// exactly 3 wheel positions (the key itself, its dominant, its subdominant)
// across both rings — that's the whole reason the circle of fifths works.
// This maps those positions to the roman numeral they represent relative to
// the selected key, so the wheel can label only what's actually diatonic.
export function getWheelNumerals(index: number, quality: KeyQuality): WheelNumeralAssignment[] {
  const { dominant, subdominant } = getNeighborIndices(index);
  if (quality === "major") {
    return [
      { index, mode: "major", numeral: "I" },
      { index, mode: "minor", numeral: "vi" },
      { index: dominant, mode: "major", numeral: "V" },
      { index: dominant, mode: "minor", numeral: "iii" },
      { index: subdominant, mode: "major", numeral: "IV" },
      { index: subdominant, mode: "minor", numeral: "ii" },
    ];
  }
  return [
    { index, mode: "minor", numeral: "i" },
    { index, mode: "major", numeral: "III" },
    { index: dominant, mode: "major", numeral: "VII" },
    { index: dominant, mode: "minor", numeral: "v" },
    { index: subdominant, mode: "major", numeral: "VI" },
    { index: subdominant, mode: "minor", numeral: "iv" },
  ];
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

// Major keys get a bright, saturated shade of their hue; minor keys get a
// darker shade of that *same* hue — this is Mr Mars' own stated rule for
// deriving minor colours ("sadness is darker than happiness"), not a
// separately-researched value. Flat majors sit on blue/violet/magenta hues,
// which read muddier than the sharps' yellow/green hues at the same
// lightness, so they get an extra lift to stay visually "bright" too.
export function getKeyColor(index: number, quality: KeyQuality): KeyColor {
  const hue = getKeyColorHue(index);
  const key = KEYS[index];
  const isBrightFlatMajor = quality === "major" && key.flats > 0;
  const saturation = quality === "major" ? (isBrightFlatMajor ? 0.75 : 0.82) : 0.65;
  const lightness = quality === "major" ? (isBrightFlatMajor ? 0.6 : 0.46) : 0.26;
  return {
    hue,
    css: `hsl(${hue}, ${saturation * 100}%, ${lightness * 100}%)`,
    name: quality === "major" ? key.majorColorName : key.minorColorName,
  };
}

export const NATURAL_MINOR_SCALE_INTERVALS: readonly number[] = [0, 2, 3, 5, 7, 8, 10];

interface HappyBirthdayNoteSpec {
  readonly degree: number;
  readonly octaveAbove: 0 | 1;
  readonly beats: number;
}

// "Happy Birthday to You"'s 4 sung lines, transcribed as scale degrees
// (0 = tonic ... 6 = leading tone, indexing MAJOR_SCALE_INTERVALS /
// NATURAL_MINOR_SCALE_INTERVALS) plus which octave above the tonic's own
// octave each note sits, so the same shape transposes into any key — major
// or natural minor. In C major this reads: line 1 "G G A G C(up) B" (held),
// line 2 "G G A G D(up) C(up)" (held), line 3 "G G G(up) E(up) C(up) B A"
// (held), line 4 "F F E C D C" (held) — the real tune in full, no line
// repeated.
export const HAPPY_BIRTHDAY_LINES: readonly (readonly HappyBirthdayNoteSpec[])[] = [
  [
    { degree: 4, octaveAbove: 0, beats: 0.5 },
    { degree: 4, octaveAbove: 0, beats: 0.5 },
    { degree: 5, octaveAbove: 0, beats: 1 },
    { degree: 4, octaveAbove: 0, beats: 1 },
    { degree: 0, octaveAbove: 1, beats: 1 },
    { degree: 6, octaveAbove: 0, beats: 2 },
  ],
  [
    { degree: 4, octaveAbove: 0, beats: 0.5 },
    { degree: 4, octaveAbove: 0, beats: 0.5 },
    { degree: 5, octaveAbove: 0, beats: 1 },
    { degree: 4, octaveAbove: 0, beats: 1 },
    { degree: 1, octaveAbove: 1, beats: 1 },
    { degree: 0, octaveAbove: 1, beats: 2 },
  ],
  [
    { degree: 4, octaveAbove: 0, beats: 0.5 },
    { degree: 4, octaveAbove: 0, beats: 0.5 },
    { degree: 4, octaveAbove: 1, beats: 1 },
    { degree: 2, octaveAbove: 1, beats: 1 },
    { degree: 0, octaveAbove: 1, beats: 1 },
    { degree: 6, octaveAbove: 0, beats: 1 },
    { degree: 5, octaveAbove: 0, beats: 2 },
  ],
  [
    { degree: 3, octaveAbove: 0, beats: 0.5 },
    { degree: 3, octaveAbove: 0, beats: 0.5 },
    { degree: 2, octaveAbove: 0, beats: 1 },
    { degree: 0, octaveAbove: 0, beats: 1 },
    { degree: 1, octaveAbove: 0, beats: 1 },
    { degree: 0, octaveAbove: 0, beats: 2 },
  ],
];

export interface HappyBirthdayNote extends TriadNote {
  readonly beats: number;
}

// Flattens all 4 lines into one playable sequence, resolving each note's
// (pitchClass, octave) with the same keyboardOctaveFor helper triads use —
// so every melody note is guaranteed to exist among PIANO_KEYS too.
export function getHappyBirthdaySequence(key: KeyInfo, quality: KeyQuality): HappyBirthdayNote[] {
  const tonicPitchClass =
    quality === "major" ? key.tonicPitchClass : getRelativeMinorTonicPitchClass(key.tonicPitchClass);
  const intervals = quality === "major" ? MAJOR_SCALE_INTERVALS : NATURAL_MINOR_SCALE_INTERVALS;
  return HAPPY_BIRTHDAY_LINES.flat().map((note) => ({
    ...keyboardOctaveFor(tonicPitchClass, intervals[note.degree] + note.octaveAbove * 12),
    beats: note.beats,
  }));
}
