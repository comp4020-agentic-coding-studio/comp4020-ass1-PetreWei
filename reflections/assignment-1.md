# Assignment 1 reflection

**What was the breakthrough that moved the work forward?**

The breakthrough was measuring before trusting a decision I'd already made,
not just before writing new code. Every wedge label used one uniform white
ink — chosen deliberately so a later dark theme would have one colour to
swap, and never questioned since. Asked to add accessibility, I audited
actual contrast first: E major's label came back at 1.57:1 against white, 9
of 24 labels failing WCAG AA's 4.5:1. The uniform ink was the cause, not
incidental to it, so I reversed that decision instead of tuning around it —
each wedge now picks white or near-black by its own measured contrast (worst
case 4.61:1), with 24 assertions in CI so it can't regress silently. The same
audit caught keyboard focus being invisible on the wheel: hover and
focus-visible were byte-identical CSS, a failure eyeballing had already
missed once.

It also sharpened what "audio is content" means here. The wheel already
highlighted a triad's notes the instant it played them, so sight and sound
were redundant by design for anyone who could see it. Missing was a path for
someone who couldn't hear at all: a text readout naming whatever's sounding,
`aria-hidden` so it stays silent to a screen reader that already has the
audio. Colour, highlight and text now all carry the same claim.

**What did this work change about who I want to be as a developer?**

I want to default to measuring before trusting a past decision, not only
before writing new code. "Uniform for future theming" sounded reasonable
when I wrote it and was wrong the moment I checked it against real numbers —
the bug was in a choice made on purpose, not code written carelessly. Fixing
the harness, a contrast function and a spec test, rather than the one failing
wedge, is the habit I want to keep: it turned a fixable bug into a rule that
holds for all 24, not just the one I happened to notice.
