import { describe, expect, it } from "vitest";
import { KEYS, getDiatonicChords } from "../src/lib/circleOfFifths.ts";
import {
  COLOR_NAMES,
  DEFAULT_LOCALE,
  FUNCTION_NAMES,
  HTML_LANG,
  LOCALES,
  LOCALE_NAME,
  PAGE_ORDER,
  QUALITIES,
  TRANSLATED_LOCALES,
  localeFromHtmlLang,
  localePaths,
  pageHref,
} from "../src/lib/i18n.ts";
import { STRINGS } from "../src/i18n/index.ts";
import { RUNTIME } from "../src/i18n/runtime.ts";

const BASE = "/comp4020-ass1-PetreWei";

describe("locale plumbing", () => {
  it("has English as the default and four translations", () => {
    expect(DEFAULT_LOCALE).toBe("en");
    expect(LOCALES).toEqual(["en", "es", "fr", "it", "zh"]);
    expect(TRANSLATED_LOCALES).toEqual(["es", "fr", "it", "zh"]);
  });

  it("never generates a route for the default locale", () => {
    // Including "en" would emit a duplicate dist/en.html beside the real
    // dist/index.html.
    const langs = localePaths().map((entry) => entry.params.lang);
    expect(langs).not.toContain("en");
    expect(langs).toEqual(["es", "fr", "it", "zh"]);
    // getStaticPaths must hand the typed locale through as a prop, since
    // Astro.params.lang is string | undefined under strict TS.
    expect(localePaths().every((entry) => entry.props.locale === entry.params.lang)).toBe(true);
  });

  it("names every locale in its own language", () => {
    expect(LOCALE_NAME).toEqual({
      en: "English",
      es: "Español",
      fr: "Français",
      it: "Italiano",
      zh: "简体中文",
    });
  });
});

describe("pageHref", () => {
  it("keeps English on the unprefixed URLs the site already publishes", () => {
    expect(pageHref(BASE, "en", "home")).toBe("/comp4020-ass1-PetreWei/");
    expect(pageHref(BASE, "en", "circle")).toBe("/comp4020-ass1-PetreWei/circle.html");
    expect(pageHref(BASE, "en", "chords")).toBe("/comp4020-ass1-PetreWei/chords.html");
    expect(pageHref(BASE, "en", "colour")).toBe("/comp4020-ass1-PetreWei/colour.html");
    expect(pageHref(BASE, "en", "siteIndex")).toBe(
      "/comp4020-ass1-PetreWei/site-index.html",
    );
  });

  it("prefixes every other locale, with its home as <locale>.html", () => {
    // Astro's build.format "file" emits route /es as dist/es.html and
    // /es/circle as dist/es/circle.html.
    expect(pageHref(BASE, "es", "home")).toBe("/comp4020-ass1-PetreWei/es.html");
    expect(pageHref(BASE, "es", "circle")).toBe("/comp4020-ass1-PetreWei/es/circle.html");
    expect(pageHref(BASE, "zh", "siteIndex")).toBe(
      "/comp4020-ass1-PetreWei/zh/site-index.html",
    );
  });

  it("accepts a base with or without a trailing slash", () => {
    expect(pageHref("/x/", "en", "circle")).toBe("/x/circle.html");
    expect(pageHref("/x", "en", "circle")).toBe("/x/circle.html");
    expect(pageHref("/x/", "fr", "home")).toBe("/x/fr.html");
  });

  it("gives every locale/page pair a distinct URL", () => {
    const hrefs = LOCALES.flatMap((locale) =>
      PAGE_ORDER.map((page) => pageHref(BASE, locale, page)),
    );
    expect(new Set(hrefs).size).toBe(LOCALES.length * PAGE_ORDER.length);
  });
});

describe("html lang round trip", () => {
  it("recovers the locale the client script runs in", () => {
    for (const locale of LOCALES) {
      expect(localeFromHtmlLang(HTML_LANG[locale])).toBe(locale);
    }
  });

  it("tolerates casing, whitespace and unknown tags", () => {
    expect(localeFromHtmlLang("EN-AU")).toBe("en");
    expect(localeFromHtmlLang("  es  ")).toBe("es");
    expect(localeFromHtmlLang("fr-CA")).toBe("fr");
    expect(localeFromHtmlLang("de")).toBe(DEFAULT_LOCALE);
    expect(localeFromHtmlLang("")).toBe(DEFAULT_LOCALE);
  });
});

describe("the translation keys match what the lib actually emits", () => {
  // These are the assertions astro check cannot make: KeyInfo declares
  // majorColorName as `string`, so every literal widens and a Record keyed by
  // string has no exhaustiveness. Without this, a missing colour name ships.
  it("covers every colour name in KEYS", () => {
    const fromLib = new Set(
      KEYS.flatMap((key) => [key.majorColorName, key.minorColorName]),
    );
    expect([...fromLib].sort()).toEqual([...COLOR_NAMES].sort());
    expect(fromLib.size).toBe(24);
  });

  it("covers every degree function name getDiatonicChords can return", () => {
    const fromLib = new Set(
      KEYS.flatMap((key) =>
        (["major", "minor"] as const).flatMap((quality) =>
          getDiatonicChords(key, quality).map((chord) => chord.functionName),
        ),
      ),
    );
    expect([...fromLib].sort()).toEqual([...FUNCTION_NAMES].sort());
  });

  it("covers every chord quality getDiatonicChords can return", () => {
    const fromLib = new Set(
      KEYS.flatMap((key) =>
        (["major", "minor"] as const).flatMap((quality) =>
          getDiatonicChords(key, quality).map((chord) => chord.quality),
        ),
      ),
    );
    expect([...fromLib].sort()).toEqual([...QUALITIES].sort());
  });
});

describe.each(LOCALES)("%s dictionary", (locale) => {
  const runtime = RUNTIME[locale];
  const strings = STRINGS[locale];

  it("translates every colour name, function name and quality", () => {
    for (const name of COLOR_NAMES) {
      expect(runtime.colorNames[name], `${locale}: colour ${name}`).toBeTruthy();
    }
    for (const name of FUNCTION_NAMES) {
      expect(runtime.functionNames[name], `${locale}: function ${name}`).toBeTruthy();
    }
    for (const quality of QUALITIES) {
      expect(runtime.qualities[quality], `${locale}: quality ${quality}`).toBeTruthy();
    }
  });

  it("has three chord-table headers", () => {
    expect(runtime.chordTableHeaders).toHaveLength(3);
    expect(runtime.chordTableHeaders.every((header) => header.trim().length > 0)).toBe(true);
  });

  it("builds a key name and a chord aria-label without leaving placeholders", () => {
    const keyName = runtime.keyName("C", "major");
    expect(keyName).toContain("C");
    expect(keyName).not.toMatch(/[{}]/);
    const label = runtime.playChordLabel("ii", runtime.functionNames.Supertonic, "D");
    expect(label).toContain("ii");
    expect(label).toContain("D");
    expect(label).not.toMatch(/[{}]/);
  });

  it("has an index entry for each of the four described pages", () => {
    expect(strings.siteIndex.entries.map((entry) => entry.page)).toEqual([
      "home",
      "circle",
      "chords",
      "colour",
    ]);
    for (const entry of strings.siteIndex.entries) {
      expect(entry.summary.length, `${locale}: ${entry.page} summary`).toBeGreaterThan(10);
      expect(entry.topics.length, `${locale}: ${entry.page} topics`).toBeGreaterThan(2);
    }
  });

  it("keeps the {link} placeholder in exactly the prose that needs one", () => {
    expect(strings.circle.outlineLink).toContain("{link}");
    expect(strings.chords.colourLink).toContain("{link}");
    expect(strings.colour.designed).toContain("{link}");
  });

  it("actually translates — no string left identical to English", () => {
    // Catches a locale still pointing at the English dictionary, or a key
    // copy-pasted and never translated. The allowlist is genuinely needed:
    // some colour and proper names are the same word in several languages.
    if (locale === "en") return;
    // Words that genuinely are the same in the target language.
    const IDENTICAL_IS_FINE = new Set([
      "Chartreuse", // fr/it/es
      "Magenta", // es/it
      "Cyan", // fr
      "Chrysolite", // fr
      "Violet", // fr
      "transposition", // fr
      "Index", // fr
      "Home", // it
      "Arpeggio", // it
    ]);
    // entries[].page is a page-key identifier, not copy, so it must match.
    const isIdentifier = (path: string) => path.endsWith(".page");
    const same: string[] = [];
    const walk = (value: unknown, english: unknown, path: string): void => {
      if (typeof value === "string" && typeof english === "string") {
        if (
          value === english &&
          value.length > 2 &&
          !IDENTICAL_IS_FINE.has(value) &&
          !isIdentifier(path)
        ) {
          same.push(`${path}: ${value}`);
        }
        return;
      }
      if (Array.isArray(value) && Array.isArray(english)) {
        value.forEach((item, i) => walk(item, english[i], `${path}[${i}]`));
        return;
      }
      if (value && english && typeof value === "object" && typeof english === "object") {
        for (const [key, inner] of Object.entries(value)) {
          walk(inner, (english as Record<string, unknown>)[key], `${path}.${key}`);
        }
      }
    };
    walk(strings, STRINGS.en, locale);
    expect(same, `untranslated strings:\n${same.join("\n")}`).toEqual([]);
  });

  it("has no empty string anywhere", () => {
    const empties: string[] = [];
    const walk = (value: unknown, path: string): void => {
      if (typeof value === "string") {
        if (value.trim() === "") empties.push(path);
        return;
      }
      if (Array.isArray(value)) {
        value.forEach((item, i) => walk(item, `${path}[${i}]`));
        return;
      }
      if (value && typeof value === "object") {
        for (const [key, inner] of Object.entries(value)) walk(inner, `${path}.${key}`);
      }
    };
    walk(strings, locale);
    expect(empties).toEqual([]);
  });
});
