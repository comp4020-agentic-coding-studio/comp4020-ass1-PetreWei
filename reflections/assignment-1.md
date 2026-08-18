# Assignment 1 reflection

**What was the breakthrough that moved the work forward?**

Asking the agent to measure instead of to change.

Before, my prompts named a result — "make the labels readable", "add accessibility" — and the agent gave back a believable diff that I approved by looking at it. Looking had already let two failures through: every wedge label used the same white ink, a choice I made on purpose so a future dark theme would have one value to swap, and `:focus-visible` was identical to `:hover`, so the wheel showed nothing to a keyboard user. The page teaches by sight and sound together, so a label nobody can read breaks half of it.

The change was to withhold the change: measure all 24 wedges first and report the numbers. What came back was not a diff but evidence — E major at 1.57:1, and 9 of 24 below WCAG AA's 4.5:1. That reframed the bug. The sameness was not near the problem, it was the problem, so the fix was to reverse a deliberate decision rather than tune around it.

It worked because a number can be wrong and a believable edit cannot, and it stuck because it went into the harness rather than the conversation: 24 contrast checks in CI, anchored on the WCAG formula so they cannot pass on a broken one. The same habit shaped the rest of the site — the five translations are checked by tests instead of trusted, and the light/dark theme deliberately leaves the wheel's colours alone, because they carry meaning.

**What did this work change about who I want to be as a developer?**

I want to point an agent at evidence, not at outcomes. Producing a believable change is the cheap part now; deciding what would prove it wrong is the part I cannot hand over — including when the thing to be proved wrong is a decision of my own.
