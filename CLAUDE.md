# COMP4020 prototype

This is your starter repo for a COMP4020 prototype: a static site written in
HTML/CSS/TypeScript that builds to plain HTML/CSS/JS and deploys to GitHub
Pages. The **deployed site is what gets marked** --- not this repo, and not "it
works on my machine". It's marked live in Chrome against the deployed URL at two
viewports --- 1920×1080 (desktop) and 390×844 (phone) --- and both count in
full, so make that artefact good at both and use the checks below to know
whether it is.

The course website publishes this deliverable's brief and spec. The brief poses
the problem; the spec is the fixed contract every response must satisfy. This
repo's name tells you which deliverable applies. Run the course plugin's
**start** skill at the start of each week: it pulls the right spec from the
course API, carries your harness forward from last week, and helps you turn the
spec's checkable lines into tests of your own. Read the brief and spec before
you plan or build, and see `spec/README.md` for how the checks relate to them.

## How to work in here

- Keep the dev server running (`pnpm dev`) so you see changes as you make them.
- Before you push, run `pnpm check`. It runs most of what CI runs --- build,
  lint, and the spec --- so you catch those in seconds instead of waiting for
  the pipeline. The links check, the evidence check, the secrets scan, and the
  deploy itself only run in CI; run `pnpm dlx linkinator ./dist --silent`
  locally against a fresh `pnpm build` for the links check without waiting for
  CI.
- To see what the page actually looks like rather than what you assume it looks
  like, open it in a browser (the `agent-browser` CLI, documented on
  [the course site](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/backpressure/#agent-browser-the-rendered-page-as-ground-truth),
  works well for this). The rendered page is the truth; your mental model of it
  isn't.
- When a check fails, read its output before changing anything. Each check below
  names what it measures, and the failure message is the instruction: it tells
  you the file, the line, or the contract. Treat a red check as authoritative
  --- the page is wrong until the check is green, not until you decide it should
  be.
- Commit when the checks pass. Never commit a red state.

## The checks (your sensors)

CI runs these on every push once your repo is public. GitHub's checks UI shows
two jobs, `check` and `deploy` --- not one status per sensor below --- and
within `check` the steps run in sequence (`pnpm check` chains typecheck, build,
lint, and the spec with `&&`), so an early failure like a broken build stops the
later sensors from running for that push; fix it and push again to see the rest.
While the repo is private (all week, until you ship) the CI jobs stay skipped
--- `pnpm check` is the same roster on your machine, and it's the faster loop
anyway. They aren't hoops. Each is a different way of finding out something true
about the site that you can't reliably see by looking at it.

They also carry a mark at a crit: the sweep runs fifteen minutes after your
cutoff, and green checks there are worth half that week's shipped mark. Still
running counts as not green, so ship with time for CI to finish.

- **typecheck** --- `tsc --noEmit` runs first in `pnpm check`, so a type error
  stops the roster before the build even starts. The types are extra
  backpressure: a red here is the compiler telling you a claim in the code is
  false.
- **build** --- the site must build (`pnpm build`). A build failure means the
  deployed site is broken or stale, so nothing else matters until this is green.
- **deploy / online** --- the live GitHub Pages URL must load and return the
  page you expect. An asset that 404s on the deployed URL counts as broken even
  if it loads locally.
- **spec** --- `spec/invariants.test.ts` asserts what's true of any good
  website, whatever the week's brief asks; the tests you write for the week's
  spec run alongside it (any `spec/*.test.ts`). A failure names the contract
  you haven't met yet.
- **lint** --- `stylelint` for CSS, `oxlint` for TypeScript. Flags code that's
  wrong, fragile, or non-idiomatic. Read the rule it names.
- **tests** --- any other tests you write, wherever you put them (co-located
  with your source is fine, not just `spec/`), must pass. Vitest picks up both
  this and the spec suite in one `vitest run`, the last step of `pnpm check`. A
  failing test is a claim about the site that's no longer true.
- **evidence** (`pnpm check:evidence`) --- checks your process evidence:
  `PROCESS.md`'s citations resolve to real commits, the current deliverable's
  exact reflection is in `reflections/` (worked out from this repo's name
  against the public course API), and your `CLAUDE.md` is present. Evidence
  gates the deploy --- `deploy` needs `check` to pass, so failing evidence
  blocks the deploy alongside everything else. See
  [Your process is part of the mark](#your-process-is-part-of-the-mark) below,
  and the course website's
  [assessment page](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/assessment/#what-you-submit)
  for what counts as evidence.
- **links** --- internal links must resolve. A broken link is a dead end you
  didn't mean to ship.
- **secrets** --- the repo is scanned for committed credentials. Never put a
  key, token, or password in a tracked file. If one leaks, rotate it. A local
  pre-commit hook (`.githooks/pre-commit`, installed by `pnpm install`) also
  blocks any commit containing something shaped like an API key --- by the time
  CI sees a key it's already pushed, so the hook is the sensor that matters.

Nothing here measures **performance** --- wiring that sensor (Lighthouse or
whatever you choose) is your work, and later in the course the spec will ask
you to show how you tested it. When you do, read a green result honestly:
it's a lab estimate from one run on a CI machine, not proof the site is fast
for real users.

**Accessibility** *is* wired, in `spec/accessibility.test.ts`, but by hand
rather than by an off-the-shelf tool like axe-core: every wedge's label
contrast is computed from the WCAG formula (implemented and anchored against
known values, not just called), asserted at ≥4.5:1 for all 24 keys, with a
test that both light and near-black ink are actually in use --- a uniform ink
is exactly the failure this project shipped once (see `PROCESS.md`). It also
asserts every interactive control is a real, focusable `<button>`, that
`:focus-visible` and `:hover` render different CSS rather than the
byte-identical rules this repo also shipped once, and that the audio content
(chords, the Happy Birthday melody) has a text form for a reader who can't
hear it. This is not a substitute for a real screen-reader pass or an
axe-core run --- neither has happened here --- it only covers what it was
built to check.

## What this prototype is

An interactive explainer of the circle of fifths that you **see and hear at the
same time**. Colour and sound are the two channels, and the whole point is that
neither alone teaches the thing: click a wedge and you hear its triad while the
wheel shows which three slices its chords live in, the roman numerals appear on
exactly the wedges that are diatonic to it, and the piano lights the notes that
are actually sounding. Every claim the page makes about music, you can hear.

Consequences that constrain every change:

- **Audio is content, not decoration.** Anything the page plays must also be
  visible (highlighted keys, and a text readout naming the notes), or the
  explanation is unavailable to a deaf reader.
- **Colour is content, not theme.** The 24 wheel colours are Mr Mars' cited
  scheme. They never change with the light/dark theme, and they are never the
  only channel: every wedge is also labelled, and the selected key's colour is
  named in words.
- **Note names stay letters in every locale** (`C`, `F♯`, `Dm`), so
  `src/lib/circleOfFifths.ts` never becomes locale-aware and its ~100 unit tests
  stay valid. Solfège was considered and rejected: see `PROCESS.md`.

## The stack

Astro, 5 pages × 5 locales = 25 built pages, English at the unprefixed URLs and
`es`/`fr`/`it`/`zh` under `/<locale>/`. `build.format: "file"` means route `/es`
emits `dist/es.html` and `/es/circle` emits `dist/es/circle.html`.

Where things live:

- `src/lib/` --- DOM-free, unit-testable logic. `circleOfFifths.ts` is the
  single source of truth for all music theory and colour; `i18n.ts` owns
  locales, page keys and `pageHref()`. Neither imports Astro or touches the DOM.
- `src/i18n/<locale>/` --- strings, split into `runtime.ts` (the ~35 the client
  script needs) and the rest. **`main.ts` must only ever import `runtime.ts`**:
  it is one bundled chunk shared by every home page, and Rollup does not
  tree-shake properties out of an object literal, so importing the full tree
  ships every locale's prose to the browser.
- `src/components/*Page.astro` --- page bodies, authored once, taking a `locale`
  prop. `src/pages/*.astro` are thin wrappers.

The stack is still swappable --- nothing in CI names a tool --- and the whole
contract is:

- `pnpm build` emits the complete site into `dist/`
- the `package.json` scripts (`check`, `check:evidence`, `build`) keep working
- whatever lands in `dist/` still passes the invariants in `spec/`

Two things bite in a swap. The deployed site lives under a path
(`…github.io/<repo>/`), so configure your generator's base path --- this
template's Vite config uses relative asset URLs to sidestep that, but most
generators (Astro included) need `base` set explicitly, and getting it wrong
looks fine locally while every asset 404s on the live URL. And commit the
updated `pnpm-lock.yaml`: CI installs with `--frozen-lockfile`.

## Rules that came from a specific failure

Each of these is here because something went wrong once. They are guides, not
sensors --- the checks can't enforce most of them --- so they only work if
they're read.

- **Never edit `.github/workflows/`.** The course CI is the sensor this work has
  to satisfy, not part of the response. When a check went red because
  Wikipedia rate-limited a shared runner IP, the one-line fix was to make the
  link check skip the host; that converts a real signal into a green light.
  Drafted and thrown away. When a check fails for a reason outside this repo,
  remove the dependency instead --- which is why nothing on this site is an
  external link any more.
- **Verify against the built site, not the dev server.** A stale `astro dev`
  still holding port 4321 meant `serve dist` silently bound a random port and a
  whole session's "verification" was reading the dev server, including its
  injected toolbar, mistaken for a layout bug. Use
  `pnpm build && pnpm preview --port <port>` and read the port the tool
  actually printed, not the one you asked for.
- **No plausible-looking fallback in a display path.** `findPianoKey` used to
  fall back to the nearest octave of the same pitch class, so a key that wasn't
  sounding lit up exactly like one that was. A wrong answer that looks right is
  worse than none: fail visibly, or show nothing.
- **When a change is asked for as an outcome, measure first.** "Make the labels
  readable" or "add accessibility" invites a plausible diff that gets approved
  by eye. Produce the numbers before the diff --- that's what found 9 of 24
  wedge labels under WCAG AA, and one of them at 1.57:1, after every one of
  them had looked fine to me.
- **Focus rings on wedges must be `filter: drop-shadow()`, never `outline`.**
  The wedges are drawn with `clip-path`, which clips descendants, and an
  `outline` follows the element's box rather than its painted shape --- so an
  outline draws a rectangle across the whole wheel.

## Your process is part of the mark

The deployed page is only half of it. How you got there is marked too: your
commit history, your agent files, and the decisions visible across them. The
checks above can't see any of that, so a person reads it directly --- which
means building legibly is part of building well.

- **Commit as you go.** Small, frequent commits are the record of how the work
  came together, and that record is read, not just the final state. A trail that
  grew alongside the code is the strongest evidence of your process; a single
  dump the night before is the weakest.
- **Keep a process overview** (`PROCESS.md`). A short reading-guide, not an
  essay: what you built, the moments that mattered --- each pointing at a
  commit, a `CLAUDE.md` change, or a prompt and the commit it produced --- and
  where to look in the history. It points a marker at the evidence; it doesn't
  stand in for it, and claims the history doesn't back don't count. The
  `PROCESS.md` in this repo is a template showing the shape and the citation
  format (link text the commit hash or range, target the commit or compare URL);
  `pnpm check:evidence` verifies your citations resolve to real commits before
  you ship. Markers follow those citations and don't trawl the repo for evidence
  you didn't cite.
- **Write your reflection in `reflections/`** --- a short markdown file in this
  repo, named for the deliverable it answers, so the number in the filename is
  the number in this repo's name (`crit-1.md` in `comp4020-crit1-<you>`,
  `assignment-1.md` in `comp4020-ass1-<you>`); `reflections/README.md` has the
  full rule. `pnpm check:evidence` checks the exact current name against the
  course API, not merely the presence of any well-named file. It answers the two
  standing prompts: the breakthrough that moved the work forward, and what this
  work changed about the developer you want to be. It stays out of the deployed
  site. It's due at the cutoff, and if it isn't in the repo by then the week
  doesn't count as shipped, however good the prototype is.
- **This file is process evidence.** The harness you build to direct the agent,
  this `CLAUDE.md` and any `AGENTS.md`, is itself read as part of how you
  worked. Keep it honest and current (see below).

You don't need a name, a student number, or any identity file in the repo: we
know whose repo it is. Spend the effort on the work.

## Testing interactive client scripts

`spec/*.test.ts` runs against the **built** `dist/**/*.html` (25 pages: 5
pages × 5 locales) parsed with plain JSDOM --- JSDOM does not reliably execute
`<script type="module">`, so a test cannot simulate a click and assert on the
DOM changes that `main.ts` makes in a real browser, and it has no layout
engine at all, so it cannot measure contrast, focus rings, or whether
something overflows at 390px. Don't try to integration-test those things this
way; it'll look like it should work and then silently not run the script, or
silently not measure the thing you actually care about.

The convention that gets real coverage instead: keep all the actual logic
(data, derivations, colour maths) in plain DOM-free modules under `src/lib/`,
unit-test those directly by importing them in the spec file, and separately
assert (statically, against the built HTML) that the interactive elements and
the targets the client script needs exist with the right attributes. `main.ts`
itself stays thin glue with nothing worth unit-testing on its own. For
anything the DOM genuinely can't tell you --- does a real browser paint this
contrast, does the keyboard focus ring actually differ from hover, does the
header wrap at 320px --- two things happen: a spec assertion checks the
*structure* that makes the property possible (a rule exists, a token is
defined in both themes, every table sits in a scroll container) and says in a
comment that it cannot verify the rendered result itself, and the rendered
result gets checked by hand in a real browser at both marking viewports
before the commit that claims it.

Two patterns this project's spec suite leans on, worth reusing rather than
reinventing:

- **`spec/support/dist.ts`** memoises parsed documents (`docFor(locale, page)`)
  and derives the expected page list from `LOCALES × PAGE_ORDER`, so 25 pages
  get checked without 25 separate hand-written paths and without re-parsing
  the same 60KB file three times.
- **Translation completeness is a spec problem, not a type problem.** A
  `Record<EnglishLiteral, string>` looks exhaustive but isn't --- once a
  library value like a colour name is exposed as `string`, TypeScript widens
  it and `astro check` cannot catch a missing translation. `spec/i18n.test.ts`
  asserts the translated key sets against what the library actually emits, not
  against a hand-copied list that can drift out of sync with it.

## This file is yours

This CLAUDE.md is a starting point, not a fixed rulebook. As you learn what your
prototype needs --- a convention to hold the agent to, a sensor that keeps
catching you out, a fact about the stack the agent keeps getting wrong --- write
it down here. Growing this file is the work of harness engineering, and the gap
between this boilerplate and your own version is part of what your prototype
says about the developer you're becoming.
