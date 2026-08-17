export interface KeyInfo {
  readonly index: number;
  readonly name: string;
  readonly tonicPitchClass: number;
  readonly scaleSpelling: readonly string[];
  readonly sharps: number;
  readonly flats: number;
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

export const MAJOR_SCALE_INTERVALS: readonly number[] = [0, 2, 4, 5, 7, 9, 11];

// Standard major-key data: 12 keys in circle-of-fifths order, clockwise from
// C. Spellings are hardcoded rather than derived by letter-cycling because
// the enharmonic point (F♯/G♭, index 6) needs E♯, not F, as its 7th degree —
// an edge case a generic letter-cycling algorithm gets wrong.
export const KEYS: readonly KeyInfo[] = [
  { index: 0, name: "C", tonicPitchClass: 0, scaleSpelling: ["C", "D", "E", "F", "G", "A", "B"], sharps: 0, flats: 0 },
  { index: 1, name: "G", tonicPitchClass: 7, scaleSpelling: ["G", "A", "B", "C", "D", "E", "F♯"], sharps: 1, flats: 0 },
  { index: 2, name: "D", tonicPitchClass: 2, scaleSpelling: ["D", "E", "F♯", "G", "A", "B", "C♯"], sharps: 2, flats: 0 },
  { index: 3, name: "A", tonicPitchClass: 9, scaleSpelling: ["A", "B", "C♯", "D", "E", "F♯", "G♯"], sharps: 3, flats: 0 },
  { index: 4, name: "E", tonicPitchClass: 4, scaleSpelling: ["E", "F♯", "G♯", "A", "B", "C♯", "D♯"], sharps: 4, flats: 0 },
  { index: 5, name: "B", tonicPitchClass: 11, scaleSpelling: ["B", "C♯", "D♯", "E", "F♯", "G♯", "A♯"], sharps: 5, flats: 0 },
  { index: 6, name: "F♯ / G♭", tonicPitchClass: 6, scaleSpelling: ["F♯", "G♯", "A♯", "B", "C♯", "D♯", "E♯"], sharps: 6, flats: 0 },
  { index: 7, name: "D♭", tonicPitchClass: 1, scaleSpelling: ["D♭", "E♭", "F", "G♭", "A♭", "B♭", "C"], sharps: 0, flats: 5 },
  { index: 8, name: "A♭", tonicPitchClass: 8, scaleSpelling: ["A♭", "B♭", "C", "D♭", "E♭", "F", "G"], sharps: 0, flats: 4 },
  { index: 9, name: "E♭", tonicPitchClass: 3, scaleSpelling: ["E♭", "F", "G", "A♭", "B♭", "C", "D"], sharps: 0, flats: 3 },
  { index: 10, name: "B♭", tonicPitchClass: 10, scaleSpelling: ["B♭", "C", "D", "E♭", "F", "G", "A"], sharps: 0, flats: 2 },
  { index: 11, name: "F", tonicPitchClass: 5, scaleSpelling: ["F", "G", "A", "B♭", "C", "D", "E"], sharps: 0, flats: 1 },
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

export function pitchClassToFrequency(pitchClass: number, octave = 4): number {
  const semitoneFromA4 = (octave - 4) * 12 + (pitchClass - 9);
  return 440 * 2 ** (semitoneFromA4 / 12);
}

export function getTriadFrequencies(tonicPitchClass: number): TriadFrequencies {
  const thirdOctave = tonicPitchClass + 4 >= 12 ? 5 : 4;
  const fifthOctave = tonicPitchClass + 7 >= 12 ? 5 : 4;
  return {
    root: pitchClassToFrequency(tonicPitchClass, 4),
    third: pitchClassToFrequency((tonicPitchClass + 4) % 12, thirdOctave),
    fifth: pitchClassToFrequency((tonicPitchClass + 7) % 12, fifthOctave),
  };
}

export function formatKeySignature(key: KeyInfo): string {
  if (key.sharps > 0) return key.sharps === 1 ? "1 sharp" : `${key.sharps} sharps`;
  if (key.flats > 0) return key.flats === 1 ? "1 flat" : `${key.flats} flats`;
  return "no sharps or flats";
}
