// Locale plumbing: which locales exist, what each page's URL is in each of
// them, and how the lib's English data maps into each language. Deliberately
// DOM-free, Astro-free and env-free (base is always a parameter, never read
// from import.meta.env — that is "/" under Vitest, so reading it here would
// let a test pass while production links break), which keeps this module
// unit-testable exactly like circleOfFifths.ts.

export const LOCALES = ["en", "es", "fr", "it", "zh"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

// The value that lands in <html lang>. Regional tag on English only, matching
// what the site shipped before i18n; zh is tagged by script, not region,
// because the translation is Simplified rather than any one country's usage.
export const HTML_LANG: Record<Locale, string> = {
  en: "en-AU",
  es: "es",
  fr: "fr",
  it: "it",
  zh: "zh-Hans",
};

// Each locale named in its own language, for the language switcher.
export const LOCALE_NAME: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  zh: "简体中文",
};

// The client script recovers its locale from <html lang> rather than a second
// data- attribute, so there is one source of truth in the DOM instead of two
// that can drift. Takes a plain string to stay DOM-free.
export function localeFromHtmlLang(lang: string): Locale {
  const normalised = lang.trim().toLowerCase();
  const match = LOCALES.find(
    (locale) =>
      HTML_LANG[locale].toLowerCase() === normalised ||
      normalised === locale ||
      normalised.startsWith(`${locale}-`),
  );
  return match ?? DEFAULT_LOCALE;
}

// "siteIndex" rather than "index": index.html already means the home page in
// this repo, and pageHref("en", "home") returning "" while "index" returned
// "site-index.html" would be a footgun.
export const PAGE_ORDER = ["home", "circle", "chords", "colour", "siteIndex"] as const;
export type PageKey = (typeof PAGE_ORDER)[number];

// Emitted filename per page, relative to a locale's own root. Home is the
// locale root itself, so it has no filename of its own.
const PAGE_FILE: Record<PageKey, string> = {
  home: "",
  circle: "circle.html",
  chords: "chords.html",
  colour: "colour.html",
  siteIndex: "site-index.html",
};

/**
 * URL for a page in a locale, given the site's base path (with or without a
 * trailing slash). English keeps the unprefixed URLs the site already
 * publishes; every other locale is prefixed.
 *
 * With Astro's build.format "file", route /es emits dist/es.html and
 * /es/circle emits dist/es/circle.html — hence the locale home being
 * "<base>es.html" rather than a directory.
 */
export function pageHref(base: string, locale: Locale, page: PageKey): string {
  const root = base.endsWith("/") ? base : `${base}/`;
  const file = PAGE_FILE[page];
  if (locale === DEFAULT_LOCALE) return `${root}${file}`;
  return page === "home" ? `${root}${locale}.html` : `${root}${locale}/${file}`;
}

// Shared getStaticPaths for every src/pages/[lang]/*.astro route. English is
// deliberately absent: including it would emit a duplicate dist/en.html
// alongside the real dist/index.html.
export const TRANSLATED_LOCALES = LOCALES.filter(
  (locale) => locale !== DEFAULT_LOCALE,
);

export function localePaths(): { params: { lang: Locale }; props: { locale: Locale } }[] {
  return TRANSLATED_LOCALES.map((locale) => ({
    params: { lang: locale },
    props: { locale },
  }));
}

// ---------------------------------------------------------------------------
// Translating the lib's human-readable data.
//
// circleOfFifths.ts stays the single source of truth and keeps emitting its
// English canonical values, so its ~100 unit tests are untouched by i18n.
// These maps are keyed off those English values. Note that the type checker
// CANNOT catch a missing entry here — KeyInfo declares majorColorName as
// `string`, so every literal widens and Record<string, string> has no
// exhaustiveness — which is why spec/i18n.test.ts asserts the key sets match
// what the lib actually emits.
// ---------------------------------------------------------------------------

export const FUNCTION_NAMES = [
  "Tonic",
  "Supertonic",
  "Mediant",
  "Subdominant",
  "Dominant",
  "Submediant",
  "Leading Tone",
  "Subtonic",
] as const;

export const QUALITIES = ["major", "minor", "diminished"] as const;

export const COLOR_NAMES = [
  // majors, in circle order from C
  "Cyan",
  "Chrysolite",
  "Bright Green",
  "Chartreuse",
  "Yellow",
  "Turmeric",
  "Red",
  "Pink",
  "Magenta",
  "Violet",
  "Corn Flower",
  "Azure",
  // relative minors, same order
  "Pthalo Green",
  "Brunswick Green",
  "Zucchini",
  "Oak Leaf",
  "Olive Drab",
  "Milk Chocolate",
  "Maroon",
  "Elderberry",
  "Purple",
  "Spectral Violet",
  "Ultramarine",
  "Prussian Blue",
] as const;
