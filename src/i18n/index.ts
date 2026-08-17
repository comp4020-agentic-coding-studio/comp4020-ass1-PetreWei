import type { Locale } from "../lib/i18n.ts";
import type { Strings } from "./types.ts";
import { en } from "./en/index.ts";
import { es } from "./es/index.ts";
import { fr } from "./fr/index.ts";
import { it } from "./it/index.ts";
import { zh } from "./zh/index.ts";

// Page components import this. main.ts must NOT — it imports ./runtime.ts
// instead, so the ~1,800 words of prose per locale never reach the browser.
export const STRINGS: Record<Locale, Strings> = { en, es, fr, it, zh };

export function stringsFor(locale: Locale): Strings {
  return STRINGS[locale];
}
