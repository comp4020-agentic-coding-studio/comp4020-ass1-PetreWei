import type { Locale } from "../lib/i18n.ts";
import type { RuntimeStrings } from "./types.ts";
import { runtime as enRuntime } from "./en/runtime.ts";
import { runtime as esRuntime } from "./es/runtime.ts";
import { runtime as frRuntime } from "./fr/runtime.ts";
import { runtime as itRuntime } from "./it/runtime.ts";
import { runtime as zhRuntime } from "./zh/runtime.ts";

// The only dictionary the client script may import. Keeping it separate from
// ./index.ts is load-bearing, not tidiness: main.ts is one bundled chunk shared
// by every home page, and Rollup does not tree-shake individual properties out
// of an object literal — so importing the full Strings tree here would ship
// every locale's prose to the browser.
export const RUNTIME: Record<Locale, RuntimeStrings> = {
  en: enRuntime,
  es: esRuntime,
  fr: frRuntime,
  it: itRuntime,
  zh: zhRuntime,
};

export function runtimeFor(locale: Locale): RuntimeStrings {
  return RUNTIME[locale];
}

/** Degree function name ("Tonic" …) in the reader's language. */
export function translateFunctionName(englishName: string, locale: Locale): string {
  const names = RUNTIME[locale].functionNames as Record<string, string>;
  return names[englishName] ?? englishName;
}

/** Mr Mars' colour name ("Cyan" …) in the reader's language. */
export function translateColorName(englishName: string, locale: Locale): string {
  const names = RUNTIME[locale].colorNames as Record<string, string>;
  return names[englishName] ?? englishName;
}

/**
 * Chord quality as display text. The union members are also type discriminants
 * and dataset values in main.ts, so they are never renamed — only mapped here
 * for display.
 */
export function translateQuality(quality: string, locale: Locale): string {
  const names = RUNTIME[locale].qualities as Record<string, string>;
  return names[quality] ?? quality;
}
