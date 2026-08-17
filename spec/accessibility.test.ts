import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  INK_DARK,
  INK_LIGHT,
  KEYS,
  contrastRatio,
  getKeyColor,
  getKeyLabelContrast,
  relativeLuminance,
} from "../src/lib/circleOfFifths.ts";
import { LOCALES } from "../src/lib/i18n.ts";
import { DIST, docFor } from "./support/dist.ts";

// WCAG 2.2 contrast minimums.
const AA_NORMAL_TEXT = 4.5;

describe("colour contrast on the wheel", () => {
  // The wedge labels render around 10-15px, which is not "large text" by
  // WCAG's definition (18.66px bold / 24px), so the 4.5:1 threshold applies.
  it.each(
    KEYS.flatMap((key) =>
      (["major", "minor"] as const).map((quality) => ({
        name: `${quality === "major" ? key.name : key.relativeMinorName} ${quality}`,
        index: key.index,
        quality,
      })),
    ),
  )("$name label meets WCAG AA against its own wedge", ({ index, quality }) => {
    expect(getKeyLabelContrast(index, quality)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
  });

  it("picks each label's ink by measured contrast, not one uniform colour", () => {
    const inks = new Set(
      KEYS.flatMap((key) =>
        (["major", "minor"] as const).map((quality) => getKeyColor(key.index, quality).ink),
      ),
    );
    // Both inks must actually be in use — a single uniform ink is what failed.
    expect(inks).toEqual(new Set([INK_LIGHT, INK_DARK]));
  });

  it("computes WCAG luminance and contrast correctly on known values", () => {
    // Anchors the maths itself, so the assertions above cannot pass because of
    // a broken formula: black on white is exactly 21:1.
    const white = relativeLuminance(1, 1, 1);
    const black = relativeLuminance(0, 0, 0);
    expect(white).toBeCloseTo(1, 5);
    expect(black).toBeCloseTo(0, 5);
    expect(contrastRatio(white, black)).toBeCloseTo(21, 5);
    expect(contrastRatio(white, white)).toBeCloseTo(1, 5);
  });

  it("keeps the wheel usable without colour vision at all", () => {
    // Colour is this site's subject, so it cannot be removed — but it must not
    // be the ONLY way to tell one wedge from another. Every wedge carries its
    // own text label, and the selected key's colour is also named in words.
    const doc = existsSync(DIST) ? docFor("en", "home") : null;
    const labels = Array.from(doc!.querySelectorAll(".wedge-name")).map((el) =>
      el.textContent?.trim(),
    );
    expect(labels.length).toBe(24);
    expect(labels.every((label) => (label?.length ?? 0) > 0)).toBe(true);
    expect(new Set(labels).size).toBe(24);
    expect(doc!.querySelector('[data-field="colour"]')).toBeTruthy();
  });
});

describe("keyboard and focus", () => {
  const doc = existsSync(DIST) ? docFor("en", "home") : null;

  it("makes every interactive control reachable by keyboard", () => {
    // All of them are real <button>s rather than click-handled divs, so they
    // are focusable and operable by Enter/Space without extra tabindex.
    const controls = Array.from(
      doc!.querySelectorAll(".key-wedge, .piano-key, .mode-button, .happy-birthday-button"),
    );
    expect(controls.length).toBeGreaterThan(50);
    for (const control of controls) {
      expect(control.tagName).toBe("BUTTON");
      expect(control.getAttribute("tabindex")).toBeNull();
    }
  });

  it("gives focus a visible style distinct from hover", () => {
    // JSDOM cannot evaluate :focus-visible, so this asserts the rules exist and
    // differ. They were byte-identical, which left keyboard users on the wheel
    // with no visible focus at all.
    const css = cssText();
    const hover = ruleBody(css, ".key-wedge:hover");
    const focus = ruleBody(css, ".key-wedge:focus-visible");
    expect(hover, "no .key-wedge:hover rule").toBeTruthy();
    expect(focus, "no .key-wedge:focus-visible rule").toBeTruthy();
    expect(focus).not.toBe(hover);
    // Outline does not follow a clip-path, so the wedge ring is drop-shadow.
    expect(focus).toContain("drop-shadow");
    expect(ruleBody(css, ".piano-key:focus-visible"), "piano keys have no focus ring").toBeTruthy();
  });
});

describe("light / dark theme", () => {
  it("defines every theme token in both themes", () => {
    const css = cssText();
    // The minifier drops the attribute quotes, so match either form.
    const block = (pattern: RegExp) => css.match(pattern)?.[1] ?? "";
    const names = (body: string) => new Set(body.match(/--[\w-]+(?=\s*:)/g) ?? []);
    const light = names(block(/:root\s*\{([^}]*)\}/));
    const dark = names(block(/:root\[data-theme=["']?dark["']?\]\s*\{([^}]*)\}/));
    expect(light.size).toBeGreaterThan(10);
    // Anything the light theme defines and the dark theme forgets keeps its
    // light value on a dark page — the classic half-themed bug.
    const themed = [...light].filter(
      (name) => !["--wedge-ink", "--piano-black", "--piano-edge", "--piano-ink-on-white"].includes(name),
    );
    for (const name of themed) {
      expect(dark, `${name} has no dark value`).toContain(name);
    }
  });

  it("leaves the wheel and the piano out of the theme, on purpose", () => {
    // The 24 wheel colours are the site's cited subject, and their label ink is
    // chosen by measured contrast; a piano key's colour is what identifies it.
    // Both must look the same in either theme, so neither may be redefined in
    // the dark block.
    const css = cssText();
    const dark =
      css.match(/:root\[data-theme=["']?dark["']?\]\s*\{([^}]*)\}/)?.[1] ?? "";
    for (const name of ["--wedge-ink", "--piano-black", "--piano-edge", "--piano-ink-on-white"]) {
      expect(dark, `${name} must not be themed`).not.toContain(name);
    }
  });

  it("still honours the OS setting before any explicit choice", () => {
    // The head script sets data-theme, but it must not be the only path: a
    // prefers-color-scheme block covers the moment before it runs.
    expect(cssText()).toMatch(/prefers-color-scheme:\s*dark/);
  });
});

describe("a non-audio path to the content", () => {
  it.each(LOCALES)("%s home page names what is sounding, in text", (locale) => {
    const doc = existsSync(DIST) ? docFor(locale, "home") : null;
    // Chords and the melody are otherwise audio-only. The keyboard highlight
    // shows where a note is; this element names it.
    const readout = doc!.querySelector('[data-testid="now-playing"]');
    expect(readout, "no now-playing readout").toBeTruthy();
    // Visual channel only: a screen-reader user already has the audio, and
    // announcing every note of an arpeggio would be noise.
    expect(readout!.getAttribute("aria-hidden")).toBe("true");
    expect(doc!.querySelector('[data-testid="piano-keyboard"]')).toBeTruthy();
  });
});

import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

function cssText(): string {
  return readdirSync(resolve(DIST, "_astro"))
    .filter((name) => name.endsWith(".css"))
    .map((name) => readFileSync(resolve(DIST, "_astro", name), "utf8"))
    .join("\n");
}

function ruleBody(css: string, selector: string): string | null {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
  return match ? match[1].trim() : null;
}
