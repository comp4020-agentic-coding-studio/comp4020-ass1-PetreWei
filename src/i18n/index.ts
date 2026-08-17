import type { Locale } from "../lib/i18n.ts";
import type { Strings } from "./types.ts";
import { en } from "./en/index.ts";

// Page components import this. main.ts must NOT — it imports ./runtime.ts
// instead, so the ~1,800 words of prose per locale never reach the browser.
export const STRINGS: Record<Locale, Strings> = {
  en,
  // Filled in as each locale lands; typed so a missing one fails astro check.
  es: en,
  fr: en,
  it: en,
  zh: en,
};

export function stringsFor(locale: Locale): Strings {
  return STRINGS[locale];
}
