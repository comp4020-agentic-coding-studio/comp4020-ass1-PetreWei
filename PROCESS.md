# Process overview

## What I built

An interactive circle-of-fifths explainer: twelve major keys arranged in the
standard circle, each a clickable button. Clicking one plays its major triad
through the Web Audio API, highlights its two neighbors (the dominant and
subdominant), and shows the single note that changes going to each — the
actual answer to "why is this a circle": every step around it swaps exactly
one note.

## The moments that mattered

1. **Keeping the music theory out of the DOM, and proving it before touching
   any markup.** The obvious way to build this is to write the click handler
   and the theory logic together in one script. Instead, all the data (the
   12-key table, scale derivation, neighbor lookup, triad frequency math) went
   into a plain, DOM-free module (`src/lib/circleOfFifths.ts`) first, with its
   own unit tests written against hand-checked values — e.g. C major's triad
   against the standard 261.63/329.63/392.00 Hz concert-pitch figures, and the
   F♯/G♭ key's scale spelled with E♯ rather than F, the one point on the
   circle a naive letter-cycling implementation gets wrong. Running just that
   test file green *before* writing `index.astro` or `main.ts` is what told me
   the underlying logic was actually correct, independent of whatever the UI
   later did with it
   ([`525b1ef`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-PetreWei/commit/525b1ef)).

2. **Discovering that this repo's tests can't see click-driven DOM changes,
   and writing that constraint down rather than re-discovering it later.**
   While designing the test file, `spec/starter.test.ts`'s existing pattern
   (parse the built `dist/index.html` with plain JSDOM) revealed why it never
   tried to simulate an interaction: JSDOM doesn't reliably execute
   `<script type="module">`. Re-prompting for a way to "test the click" would
   have failed the same way twice, so instead the convention itself changed —
   put the interactive script's actual data/logic somewhere unit-testable and
   only assert statically that the elements it needs exist — and I added that
   as a rule in `CLAUDE.md` so it's a decision made once, not re-litigated
   next time a client script needs testing
   ([`806b816`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-PetreWei/commit/806b816)).

3. **Checking the actual HTTP response before trusting the failure.** Manually
   verifying the built interaction with a headless browser, the first run
   found zero key buttons on the page at all. The obvious next step is to
   assume the markup or the click wiring is broken and start reading
   `main.ts`. Instead I checked what the browser actually got back first —
   a 404 page, because Astro's dev server serves the site under this repo's
   configured base path (`/comp4020-ass1-PetreWei/`), not `/`. That one status
   check saved a debugging pass through code that was already correct; once
   the base path was in the request URL, the same script found all 12
   buttons, clicked one, and confirmed the info panel, `aria-pressed` state,
   and neighbor-highlight classes all updated correctly at both 1920×1080 and
   390×844
   ([`b93f5e8`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-PetreWei/commit/b93f5e8)).

4. **Trusting the API over a stale push message.** After bumping dependencies
   (`pnpm update`) to clear GitHub's Dependabot warnings, `git push` still
   reported "9 vulnerabilities" on the branch. The obvious read is that the
   update didn't fully work and more bumping is needed. Instead of guessing
   from that count, I queried the Dependabot Alerts API directly
   (`gh api repos/.../dependabot/alerts?state=open`) and got back an empty
   list — every alert (nanoid, js-yaml, nested `undici` advisories, fast-uri,
   postcss) was already `state: fixed` by the one update. The push message was
   just counting from before Dependabot finished rescanning the new lockfile,
   not a sign of unresolved work
   ([`01699ad`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-PetreWei/commit/01699ad)).

## Before you ship

*Note to self: re-read this against the actual final commit history before the
cutoff, and check the citations still resolve with `pnpm check:evidence`.*
