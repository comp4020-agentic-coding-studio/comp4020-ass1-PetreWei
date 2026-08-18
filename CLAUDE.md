# COMP4020 prototype

This is a static site written in HTML, CSS and TypeScript. It builds to plain HTML, CSS and JS and deploys to GitHub Pages. **The deployed site is what gets marked** — not this repo, and not "it works on my machine". A marker opens the live URL in Chrome at two sizes, 1920×1080 (desktop) and 390×844 (phone). Both count in full, so the site has to be good at both, and the checks below are how you find out whether it is.

The course website publishes each deliverable's brief and spec. The brief poses the problem; the spec is the fixed contract every answer must meet. This repo's name tells you which deliverable applies. Run the course plugin's **start** skill at the beginning of each week: it fetches the right spec, carries last week's harness forward, and helps turn the spec's checkable lines into your own tests. Read the brief and spec before planning or building, and see `spec/README.md` for how the checks relate to them.

## What this prototype is

An interactive explainer of the circle of fifths that you **see and hear at the same time**. Colour and sound are the two channels, and the point is that neither one teaches the idea alone. Click a wedge and you hear its triad. At the same moment the wheel outlines the three slices its chords live in, roman numerals appear on exactly the wedges that belong to that key, and the piano lights up the notes that are actually sounding. Every claim the page makes about music, you can hear for yourself.

Three goals shape the site beyond the music itself:

- **Diversity — it speaks five languages.** Every page, every label and every paragraph exists in English, Spanish, French, Italian and Simplified Chinese, at `/`, `/es/`, `/fr/`, `/it/` and `/zh/`. The music theory is not translated, because note names are letters everywhere (see the rule below); everything a reader reads is. Translation is checked by tests, not by hoping: `spec/i18n.test.ts` compares each language's keys against what the library actually produces.
- **Accessibility — it aims at WCAG AA, and proves it.** Every one of the 24 wedge labels is measured against the colour behind it and must reach the 4.5:1 contrast ratio WCAG asks for at this text size. Every control is a real `<button>` you can reach with Tab and see when it has focus. Everything the page plays is also written out in text, so a reader who cannot hear still gets the whole explanation. These are assertions in `spec/accessibility.test.ts`, not intentions.
- **Usability — it follows the reader's theme.** The site starts in whichever theme the operating system is set to, and a toggle overrides it and remembers the choice. The theme script runs inline in `<head>` so a reader who chose dark never sees a white flash. The 24 wheel colours and the piano's black and white keys deliberately do not change with the theme, because they are content.

Four rules follow from all of this and constrain every change:

- **Audio is content, not decoration.** Anything the page plays must also be visible: the keys light up, and a line of text names the notes. Otherwise the explanation simply does not exist for a deaf reader.
- **Colour is content, not styling.** The 24 wheel colours are Mr Mars' scheme, cited on the Colour page. They never change with the theme, and they are never the only signal: every wedge is also labelled, and the selected key's colour is named in words.
- **Note names stay letters in every language** (`C`, `F♯`, `Dm`). That way `src/lib/circleOfFifths.ts` never has to know about languages and its 340 tests stay valid. Solfège (`do`, `re`, `mi`) was considered and rejected; see `PROCESS.md`.
- **Both viewports count.** Anything that only works at 1920px is half-finished. The header, the wheel, the chord table and the keyboard all get checked at 390px before a commit claims they work.

## How to work in here

- Keep the dev server running (`pnpm dev`) so you see changes as you make them.
- Run `pnpm check` before you push. It runs most of what CI runs — typecheck, build, lint and the tests — so you find those problems in seconds instead of waiting for the pipeline. The link check, the evidence check, the secrets scan and the deploy only run in CI. For the link check without waiting, run `pnpm dlx linkinator ./dist --silent` against a fresh `pnpm build`.
- To see what the page really looks like, open it in a browser rather than imagining it. The `agent-browser` CLI, documented on [the course site](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/backpressure/#agent-browser-the-rendered-page-as-ground-truth), works well. The rendered page is the truth; your mental picture of it is not.
- When a check fails, read its output before changing anything. The failure message names the file, the line or the contract, and that is the instruction. A red check is right until proven otherwise: the page is wrong until the check is green, not until you decide it should be.
- Commit when the checks pass. Never commit a red state.

## The checks (your sensors)

CI runs these on every push once the repo is public. GitHub shows two jobs, `check` and `deploy`, rather than one status per item below. Inside `check` the steps run in order, because `pnpm check` chains typecheck, build, lint and the tests with `&&`, so an early failure such as a broken build stops the later steps from running at all; fix it and push again to see the rest. While the repo is private the CI jobs stay skipped, and `pnpm check` is the same list on your machine anyway, which is the faster loop. These are not hoops. Each one is a way of finding out something true about the site that you cannot reliably see by looking at it.

They also carry marks at a crit. The automated sweep runs fifteen minutes after your cutoff, and green checks at that moment are worth half the week's shipped mark. Still running counts as not green, so ship with time for CI to finish.

- **typecheck** — `astro check` runs first, so a type error stops everything before the build starts. A red here is the compiler saying a claim in the code is false.
- **build** — the site must build (`pnpm build`). If it does not, the deployed site is broken or stale and nothing else matters until this is green.
- **deploy / online** — the live GitHub Pages URL must load and return the page you expect. An asset that 404s on the live URL counts as broken even if it loads locally.
- **spec** — `spec/invariants.test.ts` checks what should be true of any decent website, whatever the brief asks. The tests you write for the week run alongside it; any `spec/*.test.ts` is picked up. A failure names the contract you have not met yet.
- **lint** — `stylelint` for CSS and `oxlint` for TypeScript. They flag code that is wrong, fragile or unusual. Read the rule they name.
- **tests** — any other tests you write, anywhere you put them, must pass. Vitest runs these and the spec suite together in one `vitest run`, the last step of `pnpm check`. A failing test is a claim about the site that is no longer true.
- **evidence** (`pnpm check:evidence`) — checks the process files: that every commit `PROCESS.md` cites really exists, that the right reflection for this deliverable is in `reflections/` (worked out from the repo name against the course API), and that `CLAUDE.md` is present. This gates the deploy, since `deploy` needs `check` to pass, so missing evidence blocks the deploy like anything else.
- **links** — internal links must resolve. A broken link is a dead end you did not mean to ship. This site links to nothing outside itself, on purpose; see the rules below.
- **secrets** — the repo is scanned for committed credentials. Never put a key, token or password in a tracked file, and rotate it if one leaks. A local pre-commit hook (`.githooks/pre-commit`, installed by `pnpm install`) also blocks any commit containing something shaped like an API key. By the time CI sees a key it is already pushed, so the hook is the sensor that matters.

Nothing here measures **performance**. Wiring that up (Lighthouse, or whatever you choose) is your work, and later in the course the spec will ask how you tested it. When you do, read a green result honestly: it is one lab measurement on a CI machine, not proof the site is fast for real people.

**Accessibility is wired up**, in `spec/accessibility.test.ts`, but by hand rather than with an off-the-shelf tool like axe-core. Every wedge label's contrast is worked out from the WCAG formula — implemented here and anchored against known answers, so the tests cannot pass on a broken formula — and required to be at least 4.5:1 for all 24 keys. Another test checks that both the light and the near-black ink are actually in use, because a single uniform ink is exactly the failure this project shipped once (see `PROCESS.md`). It also checks that every control is a real, focusable `<button>`, that `:focus-visible` and `:hover` produce different CSS rather than the identical rules this repo also shipped once, and that everything the page plays has a text form for a reader who cannot hear it. This is not a substitute for a real screen-reader pass or an axe-core run — neither has happened here — and it only covers what it was built to cover.

## The stack

Astro. 5 pages × 5 languages = 25 built pages, with English at the plain URLs and `es`, `fr`, `it` and `zh` under `/<language>/`. `build.format: "file"` means the route `/es` becomes `dist/es.html` and `/es/circle` becomes `dist/es/circle.html`.

Where things live:

- `src/lib/` — logic with no DOM and no Astro in it, so it can be unit-tested directly. `circleOfFifths.ts` is the single source of truth for all music theory and colour; `i18n.ts` owns the language list, the page list and `pageHref()`.
- `src/i18n/<language>/` — the text, split into `runtime.ts` (the ~35 strings the browser script needs) and the rest. **`main.ts` must only ever import `runtime.ts`.** It is one bundled file shared by every home page, and Rollup cannot strip unused properties out of an object literal, so importing the whole tree would ship every language's prose to every visitor.
- `src/components/*Page.astro` — the page bodies, written once, each taking a `locale` prop. `src/pages/*.astro` are thin wrappers around them.

The stack is still swappable, since nothing in CI names a tool. The whole contract is that `pnpm build` puts the complete site in `dist/`, that the `package.json` scripts (`check`, `check:evidence`, `build`) keep working, and that whatever lands in `dist/` still passes `spec/`.

Two things bite if you swap it. The live site sits under a path (`…github.io/<repo>/`), so the generator's base path has to be set; getting it wrong looks fine locally while every asset 404s on the live URL. And commit the updated `pnpm-lock.yaml`, because CI installs with `--frozen-lockfile`.

## Rules that came from a specific failure

Each of these is here because something went wrong once. They are guides, not sensors — the checks cannot enforce most of them — so they only work if they are read.

- **Never edit `.github/workflows/`.** The course CI is the sensor this work has to satisfy, not a part of the work you get to adjust. When a check went red because Wikipedia rate-limited a shared CI machine, the one-line fix was to tell the link check to skip that host. That turns a real signal into a green light. It was drafted and thrown away. When a check fails for a reason outside this repo, remove the dependency instead, which is why nothing on this site is an external link any more.
- **Verify against the built site, not the dev server.** A leftover `astro dev` was still holding port 4321, so `serve dist` quietly took a random port and a whole session of "verification" was actually reading the dev server, including the toolbar it injects, which got mistaken for a layout bug. Run `pnpm build && pnpm preview --port <port>` and read the port the tool actually printed, not the one you asked for.
- **Never show a plausible-looking guess.** `findPianoKey` used to fall back to the nearest octave of the same note, so a key that was not sounding lit up exactly like one that was. A wrong answer that looks right is worse than no answer: fail visibly, or show nothing.
- **When a change is asked for as an outcome, measure first.** "Make the labels readable" or "add accessibility" invites a plausible-looking diff that gets approved by eye. Produce the numbers before the diff. That is what found 9 of the 24 wedge labels below the WCAG AA minimum, one of them at 1.57:1, after every one of them had looked fine.
- **Focus rings on wedges must use `filter: drop-shadow()`, never `outline`.** The wedges are drawn with `clip-path`, which also clips anything inside them, and an `outline` follows the element's rectangle rather than its visible shape, so an outline draws a box straight across the wheel.

## Testing interactive client scripts

The tests in `spec/*.test.ts` run against the **built** files in `dist/` (25 pages: 5 pages × 5 languages) parsed with plain JSDOM. JSDOM does not reliably run `<script type="module">`, so a test cannot click something and then check what `main.ts` did to the page. It also has no layout engine at all, so it cannot measure contrast, focus rings, or whether something overflows at 390px. Do not try to test those things this way. It will look like it should work and then quietly not run the script, or quietly not measure the thing you cared about.

What gets real coverage instead: keep the actual logic — data, derivations, colour maths — in plain modules under `src/lib/` with no DOM in them, and unit-test those by importing them directly. Separately, check against the built HTML that the elements and attributes the browser script needs are really there. `main.ts` stays thin glue with nothing worth unit-testing on its own. For anything the DOM genuinely cannot tell you — does a real browser paint this contrast, does the focus ring actually differ from hover, does the header wrap at 320px — do two things: write a test for the *structure* that makes the property possible (the rule exists, the token is defined in both themes, every table sits in a scrolling container) with a comment saying it cannot verify the rendered result, and check the rendered result by hand in a real browser at both marking viewports before the commit that claims it works.

Two patterns this project's tests lean on, worth reusing rather than reinventing:

- **`spec/support/dist.ts`** remembers parsed documents (`docFor(locale, page)`) and builds the expected page list from `LOCALES × PAGE_ORDER`, so all 25 pages get checked without 25 hand-written paths and without parsing the same 60KB file three times.
- **Translation completeness is a test problem, not a type problem.** A `Record<EnglishLiteral, string>` looks exhaustive but is not: once a library value such as a colour name is exposed as `string`, TypeScript widens the type and `astro check` cannot catch a missing translation. `spec/i18n.test.ts` compares each language's keys against what the library actually produces, rather than against a hand-copied list that can drift.

## Your process is part of the mark

The deployed page is only half of it. How you got there is marked too: the commit history, the agent files, and the decisions visible across them. The checks cannot see any of that, so a person reads it directly, which makes building legibly part of building well.

- **Commit as you go.** Small, frequent commits are the record of how the work came together, and that record is read, not just the final state. A trail that grew alongside the code is the strongest evidence; one big dump the night before is the weakest.
- **Keep a process overview** (`PROCESS.md`). A short reading guide, not an essay: what you built, and the moments that mattered, each pointing at a commit, a `CLAUDE.md` change, or a prompt and the commit it produced. It points a marker at the evidence; it does not stand in for it, and claims the history does not back do not count. Cite with the commit hash or range as the link text and the GitHub commit or compare URL as the target; `pnpm check:evidence` confirms they resolve. Markers follow those citations and do not go hunting for evidence you did not cite.
- **Write the reflection in `reflections/`** — a short markdown file named for the deliverable it answers, so the number in the filename matches the number in the repo name (`crit-1.md` in `comp4020-crit1-<you>`, `assignment-1.md` in `comp4020-ass1-<you>`). `reflections/README.md` has the full rule, and `pnpm check:evidence` checks the exact name against the course API rather than just the presence of some well-named file. It answers two standing questions: the breakthrough that moved the work forward, and what this work changed about the developer you want to be. It stays out of the deployed site. It is due at the cutoff, and if it is not in the repo by then the week does not count as shipped, however good the prototype is.
- **This file is process evidence.** The harness you build to direct the agent, meaning this `CLAUDE.md` and any `AGENTS.md`, is read as part of how you worked. Keep it honest and current.

You do not need a name, a student number or any identity file in the repo: we know whose repo it is. Spend the effort on the work.

## This file is yours

This CLAUDE.md started as a template and is not a fixed rulebook. As you learn what the prototype needs — a convention to hold the agent to, a sensor that keeps catching you out, a fact about the stack the agent keeps getting wrong — write it down here. Growing this file is the work of harness engineering, and the gap between the boilerplate and your own version is part of what the prototype says about the developer you are becoming.
