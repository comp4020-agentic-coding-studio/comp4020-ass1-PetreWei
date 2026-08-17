import type { Strings } from "../types.ts";
import { runtime } from "./runtime.ts";

export const en: Strings = {
  runtime,

  nav: {
    home: "Home",
    circle: "Circle",
    chords: "Chords",
    colour: "Colour",
    siteIndex: "Index",
    primaryLabel: "Primary",
    languageLabel: "Language",
    darkMode: "Dark mode",
  },

  titles: {
    home: "Chromesthesia Circle of Fifths",
    circle: "The circle — Chromesthesia Circle of Fifths",
    chords: "Chords — Chromesthesia Circle of Fifths",
    colour: "Colour — Chromesthesia Circle of Fifths",
    siteIndex: "Index — Chromesthesia Circle of Fifths",
  },

  terms: {
    dominant: "dominant",
    subdominant: "subdominant",
    triad: "triad",
    happyBirthday: "Happy Birthday",
  },

  home: {
    h1: "Chromesthesia Circle of Fifths",
    intro:
      "Click a key on the outer ring for its major chord, or the inner ring for its relative minor. A thin outline traces its three related keys on each ring, labelled with their roman numeral — click a row in the chord table below to hear it on its own.",
    playbackLabel: "Playback style",
    arpeggio: "Arpeggio",
    chord: "Chord",
    wheelLabel: "Circle of fifths keys",
    keyboardLabel: "Two-octave piano keyboard",
    pickAKey: "Pick a key",
    playHappyBirthday: "Play Happy Birthday",
    happyBirthdayCaption:
      'Plays "Happy Birthday" transposed into the key you\'ve picked.',
    enharmonicMajorLabel: "F sharp major, or G flat major",
    enharmonicMinorLabel: "D sharp minor, or E flat minor",
    pianoKeyLabel: (label, flatLabel, octave) =>
      flatLabel ? `${label} / ${flatLabel} ${octave}` : `${label} ${octave}`,
  },

  circle: {
    h1: "What the circle of fifths shows",
    fifthsHeading: "A fifth, and why it makes a circle",
    fifths:
      'A "fifth" is just two notes seven semitones apart — one of the most consonant intervals in music, which is why stacking fifths on top of each other (C, then G a fifth above it, then D a fifth above that, and so on) produces a sequence of keys that all sound closely related to their neighbours. Keep stacking and you pass through all 12 possible keys before landing back on C — hence the circle. The outer ring on the home page is exactly that sequence, going clockwise.',
    signaturesHeading: "Key signatures: one accidental per step",
    signatures:
      "Each step around the circle changes exactly one note in the scale: G major is C major's scale with F swapped for F♯, D major swaps in C♯ as well, and so on. That's also why <strong>key signatures</strong> (the sharps or flats written at the start of a piece of sheet music) grow by exactly one accidental per step clockwise, and by one flat per step counter-clockwise.",
    badges:
      "The small ♯ and ♭ marks printed around the outside of the wheel are those counts: one ♯ next to G, two next to D, and so on round to the flats on the other side. C sits at the top with neither, because C major uses no sharps or flats at all.",
    minorsHeading: "The inner ring: relative minors",
    minors:
      "Every major key also has a <strong>relative minor</strong>: a minor key that shares its exact key signature. It sits at the same position on the circle — the inner ring on the home page — and its natural minor scale uses the same seven notes as its major, just starting three semitones lower. A minor is C major's seven notes starting on A instead of C, which is why both wedges sit in the same slice of the wheel and carry the same accidental count.",
    outlineHeading: "The outline: three closely-related keys",
    outline:
      "Pick a key on the home page and a thin outline traces three slices: the key you picked, plus its immediate neighbour on either side. Those neighbours are its <strong>closely-related keys</strong> — one step clockwise is the <strong>dominant</strong> (a fifth up), one step counter-clockwise is the <strong>subdominant</strong> (a fifth down). Because each step changes only one note, those three keys differ from each other by a single accidental, which is what makes moving between them sound smooth rather than abrupt.",
    outlineLink:
      "Those same three slices are where all of the picked key's chords live. That's the subject of the {link} page.",
  },

  chords: {
    h1: "Chords, numerals and functions",
    triadHeading: "Building a triad",
    triadIntro:
      "A <strong>triad</strong> is a three-note chord: pick a note of the scale, then add the note two steps up and the note four steps up — every other note. Whether the result sounds major, minor or diminished depends only on how many semitones those two additions land at:",
    majorRecipe: "<strong>Major</strong> — 4 semitones to the middle note, 7 to the top.",
    minorRecipe: "<strong>Minor</strong> — 3 semitones to the middle note, 7 to the top.",
    diminishedRecipe:
      "<strong>Diminished</strong> — 3 semitones to the middle note, 6 to the top.",
    triadOutro:
      "That single semitone difference in the middle note is the whole difference between a chord sounding bright and sounding sad.",
    sevenHeading: "The seven chords of a key",
    sevenIntro:
      "Build a triad on each of the seven notes of a scale, using only notes from that scale, and you get the seven chords that belong to the key — its <em>diatonic</em> chords. Their pattern of qualities is the same in every major key, which is why the wheel can label them at all. Each degree also has a traditional name for the job it does, and a <strong>roman numeral</strong> that encodes its quality: uppercase for major, lowercase for minor, and a small ° for diminished.",
    tableCaption: "The seven diatonic chords of C major",
    qualityHeader: "Quality",
    sevenOutro:
      "The two that do most of the work are the <strong>dominant</strong> (V) and the <strong>subdominant</strong> (IV): V tends to pull back to the tonic, which is why so much music ends V → I. In a minor key the same construction gives a different pattern — i, ii°, III, iv, v, VI, VII — because the natural minor scale's own notes differ, and its seventh degree sits a whole step below the tonic rather than a half step, so it's called the <em>subtonic</em> instead of the leading tone.",
    slicesHeading: "Why only three slices light up",
    slices:
      "Pick a key on the home page and roman numerals appear on six wedges, spread across just three slices of the wheel — the key itself, its dominant, and its subdominant. That isn't a simplification; it's the reason the circle of fifths is useful. Six of a key's seven chords are the major and minor chords of exactly those three neighbouring positions: for C major, I and vi sit in C's own slice, V and iii in G's, and IV and ii in F's.",
    slicesSeventh:
      "The seventh, vii°, is diminished. It has no key of its own on the wheel, so it gets no wedge — but it still appears in the chord table, which lists all seven.",
    hearingHeading: "Hearing it",
    octaveNumbers:
      "The keyboard's white keys are labelled with an octave number — <code>C5</code>, <code>D5</code> and so on. That's <strong>scientific pitch notation</strong>: the letter names the note, the number says which octave it belongs to, and the number ticks over at every C rather than at every A. It's how two keys that are both \"C\" can be told apart.",
    tuning:
      "The pitch each key actually plays comes from <strong>12-tone equal temperament</strong> tuned to A440: the octave is divided into twelve equal steps, so each semitone multiplies the frequency by the twelfth root of two (about 1.0595), counting up or down from A4 at 440 Hz. Every note you hear here is worked out with that one formula.",
    playback:
      "The <strong>Arpeggio / Chord</strong> toggle changes only how a chord is delivered, not what it contains: arpeggio plays the three notes one after another, chord sounds them together. And because every chord is described as a scale degree rather than as fixed notes, the same tune can be rebuilt in any key — <strong>transposition</strong>. That's what the Happy Birthday button does: it plays the tune's shape, starting from whichever key you picked.",
    colourLink:
      "Which colour each of those keys is drawn in is a separate story — see the {link} page.",
  },

  colour: {
    h1: "Where the colours come from",
    chromesthesiaHeading: "Chromesthesia: sound that comes with colour",
    chromesthesia:
      'Chromesthesia is a real, well-documented form of synesthesia in which sound involuntarily triggers an experience of colour. It has a genetic component, and the colour a person "sees" for a given note or voice is highly personal and consistent for them over time — one synesthete\'s C might always look red, while someone else\'s C is purple. There\'s no single sound-to-colour mapping shared by everyone with the condition, though researchers have found a general tendency, even among non-synesthetes, to associate higher pitches with lighter colours and lower pitches with darker ones.',
    designedHeading: "This site's colours are designed, not measured",
    designed:
      'The specific colour shown for each key on this site is <strong>not</strong> measured chromesthesia data — no such single mapping exists, since real synesthetes don\'t agree with each other. Instead it\'s borrowed from artist "Mr Mars\'" own deliberately designed {link}, built from his own decades of composing experience rather than clinical measurement. His stated rules: sharp keys, which he associates with brighter-sounding instruments like violin, get bright hues; flat keys, associated with darker brass tones, get dark hues; E major is fixed as the "brightest" key and anchors the wheel as yellow; and each minor key gets a darker shade of its relative major\'s hue, on the reasoning that "sadness is darker than happiness." Mr Mars is explicit that he does not personally experience chromesthesia and that his wheel is a designed system, not a scientific one.',
    approximation:
      'His page names a hue for each key but doesn\'t publish exact colour codes, so the specific shade rendered on this site is this site\'s own approximation: each major key\'s named hue is placed evenly around a 360° colour wheel in the order he lists them, and each relative minor reuses that same hue at lower saturation and lightness — a literal reading of his "darker shade" rule.',
    swatchesHeading: "The 24 keys and their colours",
    majorsIntro:
      "The twelve major keys of the outer ring, each with the colour name Mr Mars gives it:",
    minorsIntro:
      "And the twelve relative minors of the inner ring, each a darker shade of its major:",
  },

  siteIndex: {
    h1: "Index",
    intro:
      "Four pages: the wheel you can play with, and three that explain what it's showing you. Everything here stays at the level of fundamentals.",
    referencesHeading: "References",
    entries: [
      {
        page: "home",
        summary:
          "The interactive wheel itself: click a key for its chord, read its roman numerals, play its chords on the keyboard, and hear Happy Birthday in that key.",
        topics: ["the wheel", "chord table", "keyboard", "Happy Birthday"],
      },
      {
        page: "circle",
        summary:
          "Why twelve keys form a ring, and what the ♯/♭ badges, the inner ring and the thin outline on the wheel each mean.",
        topics: [
          "what a fifth is",
          "key signatures",
          "relative minors",
          "closely-related keys",
        ],
      },
      {
        page: "chords",
        summary:
          "How a key's seven chords are built, why they carry roman numerals, and how the notes are tuned and played back.",
        topics: [
          "triads",
          "diatonic chords",
          "scale-degree functions",
          "roman numerals",
          "octave numbers",
          "equal temperament and A440",
          "transposition",
        ],
      },
      {
        page: "colour",
        summary:
          "What chromesthesia actually is, why these particular colours are a designed system rather than measured data, and the full list of 24.",
        topics: ["chromesthesia", "Mr Mars' colour wheel", "all 24 key colours"],
      },
    ],
    references: {
      mrMars:
        "— the 24-key colour scheme this site borrows for its highlights.",
      chromesthesia: "— background on the real sound-to-colour phenomenon.",
      circleOfFifths: "— background on the music theory this diagram is built from.",
      romanNumerals:
        "— the triads, roman numerals, scale-degree names and chord qualities shown on the wheel and in the chord table.",
      equalTemperament:
        "— the A440 tuning the played frequencies are derived from, and the octave numbering printed on the keyboard's white keys.",
      musicca:
        "— reference for showing key signatures on the wheel and listing each key's diatonic chords with roman numerals.",
      chromatone:
        "— reference for keeping every key's colour visible permanently and showing the selected key's detail at the centre of the wheel.",
    },
  },
};
