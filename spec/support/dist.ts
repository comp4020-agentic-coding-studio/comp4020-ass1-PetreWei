import { existsSync, readFileSync, readdirSync } from "node:fs";
import { relative, resolve } from "node:path";
import { JSDOM } from "jsdom";
import { LOCALES, PAGE_ORDER, pageHref } from "../../src/lib/i18n.ts";
import type { Locale, PageKey } from "../../src/lib/i18n.ts";

export const DIST = resolve("dist");
export const BASE = "/comp4020-ass1-PetreWei";

/**
 * dist-relative filename for a page in a locale, derived from the same
 * pageHref() the site builds its links with, so the tests can never disagree
 * with the markup about where a page lives.
 */
export function distFileFor(locale: Locale, page: PageKey): string {
  const href = pageHref(BASE, locale, page);
  const path = href.slice(`${BASE}/`.length);
  return path === "" ? "index.html" : path;
}

// Parsing is memoised because the home page alone is ~62 KB and three separate
// suites want the same documents; without this the run does ~75 JSDOM parses.
const cache = new Map<string, Document>();

export function docForFile(file: string): Document {
  const cached = cache.get(file);
  if (cached) return cached;
  const doc = new JSDOM(readFileSync(resolve(DIST, file), "utf8")).window.document;
  cache.set(file, doc);
  return doc;
}

export function docFor(locale: Locale, page: PageKey): Document {
  return docForFile(distFileFor(locale, page));
}

/** Every built page, discovered rather than listed. */
export function builtPages(): string[] {
  if (!existsSync(DIST)) return [];
  return readdirSync(DIST, { recursive: true })
    .map(String)
    .filter((name) => name.endsWith(".html"))
    .map((name) => relative("", name))
    .sort();
}

/** The 25 pages the site is expected to emit, in the same sort order. */
export function expectedPages(): string[] {
  return LOCALES.flatMap((locale) =>
    PAGE_ORDER.map((page) => distFileFor(locale, page)),
  ).sort();
}

export const hrefs = (doc: Document, selector = "a"): string[] =>
  Array.from(doc.querySelectorAll(selector)).map((a) => a.getAttribute("href") ?? "");
