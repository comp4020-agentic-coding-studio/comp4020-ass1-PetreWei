import type { FUNCTION_NAMES, QUALITIES, COLOR_NAMES } from "../lib/i18n.ts";

/**
 * The ~35 strings the client script needs, kept in their own module per
 * locale. main.ts is one bundled chunk shared by every home page, and Rollup
 * does not tree-shake individual properties out of an object literal — so if
 * these lived in the same object as the prose, the browser would download all
 * ~1,800 words × 5 locales on the home page.
 */
export interface RuntimeStrings {
  /** Chord table column headers, in order. */
  readonly chordTableHeaders: readonly [string, string, string];
  /** Degree function names, keyed by the lib's English canonical value. */
  readonly functionNames: Record<(typeof FUNCTION_NAMES)[number], string>;
  /** Chord qualities, keyed by the lib's union members (also displayed text). */
  readonly qualities: Record<(typeof QUALITIES)[number], string>;
  /** Mr Mars' colour names, keyed by the lib's English canonical value. */
  readonly colorNames: Record<(typeof COLOR_NAMES)[number], string>;
  /**
   * A key's display name. Built as a function, not "<note> " + word, because
   * word order and spacing differ: "Do mayor", "C majeur", "C大调" (no space,
   * mode as a suffix).
   */
  keyName(note: string, quality: "major" | "minor"): string;
  /** aria-label for a playable chord-table row. */
  playChordLabel(numeral: string, functionName: string, root: string): string;
}

/**
 * Everything else. Prose values are HTML strings rendered with set:html,
 * because <strong>/<em>/<code>/<a> sit mid-sentence and their position moves
 * under translation — splitting them into leaf-text keys would wreck the
 * translation. Safe here: build-time constant content, never user input.
 */
export interface Strings {
  readonly runtime: RuntimeStrings;

  /** Nav tab labels, and the accessible names of the two header navs. */
  readonly nav: {
    readonly home: string;
    readonly circle: string;
    readonly chords: string;
    readonly colour: string;
    readonly siteIndex: string;
    readonly primaryLabel: string;
    readonly languageLabel: string;
  };

  /** <title> per page. */
  readonly titles: {
    readonly home: string;
    readonly circle: string;
    readonly chords: string;
    readonly colour: string;
    readonly siteIndex: string;
  };

  /**
   * Shared vocabulary, referenced by both the prose and the data-translation
   * layer, so the chord table can never disagree with the body text that
   * explains it.
   */
  readonly terms: {
    readonly dominant: string;
    readonly subdominant: string;
    readonly triad: string;
    readonly happyBirthday: string;
  };

  readonly home: {
    readonly h1: string;
    readonly intro: string;
    readonly playbackLabel: string;
    readonly arpeggio: string;
    readonly chord: string;
    readonly wheelLabel: string;
    readonly keyboardLabel: string;
    readonly pickAKey: string;
    readonly playHappyBirthday: string;
    readonly happyBirthdayCaption: string;
    /** Spoken forms for screen readers, e.g. "F sharp major, or G flat major". */
    readonly enharmonicMajorLabel: string;
    readonly enharmonicMinorLabel: string;
    /** aria-label for one piano key; sharp/flat pairs get both spellings. */
    pianoKeyLabel(label: string, flatLabel: string | undefined, octave: number): string;
  };

  readonly circle: {
    readonly h1: string;
    readonly fifthsHeading: string;
    readonly fifths: string;
    readonly signaturesHeading: string;
    readonly signatures: string;
    readonly badges: string;
    readonly minorsHeading: string;
    readonly minors: string;
    readonly outlineHeading: string;
    readonly outline: string;
    readonly outlineLink: string;
  };

  readonly chords: {
    readonly h1: string;
    readonly triadHeading: string;
    readonly triadIntro: string;
    readonly majorRecipe: string;
    readonly minorRecipe: string;
    readonly diminishedRecipe: string;
    readonly triadOutro: string;
    readonly sevenHeading: string;
    readonly sevenIntro: string;
    readonly tableCaption: string;
    readonly qualityHeader: string;
    readonly sevenOutro: string;
    readonly slicesHeading: string;
    readonly slices: string;
    readonly slicesSeventh: string;
    readonly hearingHeading: string;
    readonly octaveNumbers: string;
    readonly tuning: string;
    readonly playback: string;
    readonly colourLink: string;
  };

  readonly colour: {
    readonly h1: string;
    readonly chromesthesiaHeading: string;
    readonly chromesthesia: string;
    readonly designedHeading: string;
    readonly designed: string;
    readonly approximation: string;
    readonly swatchesHeading: string;
    readonly majorsIntro: string;
    readonly minorsIntro: string;
  };

  readonly siteIndex: {
    readonly h1: string;
    readonly intro: string;
    readonly referencesHeading: string;
    /** One entry per page, in PAGE_ORDER minus none — home included. */
    readonly entries: readonly {
      readonly page: "home" | "circle" | "chords" | "colour";
      readonly summary: string;
      readonly topics: readonly string[];
    }[];
    /**
     * The annotation after each citation's em dash. Source titles and URLs
     * stay English and identical across locales — bibliographic convention,
     * and pointing translated pages at localised Wikipedia editions would
     * multiply the site's distinct external URLs and trip CI's rate limit.
     */
    readonly references: {
      readonly mrMars: string;
      readonly chromesthesia: string;
      readonly circleOfFifths: string;
      readonly romanNumerals: string;
      readonly equalTemperament: string;
      readonly musicca: string;
      readonly chromatone: string;
    };
  };
}
