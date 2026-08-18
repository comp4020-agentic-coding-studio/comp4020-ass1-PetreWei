# Assignment 1 reflection

**What was the breakthrough that moved the work forward?**

Asking the agent to measure instead of to change.

Before, my prompts named an outcome — "make the labels readable", "add accessibility features" — and the agent returned a plausible diff that I approved by looking at it. Looking had already shipped two failures I could not see: every wedge label used one uniform white ink, a choice I made on purpose so a future dark theme would swap one value, and `:focus-visible` was byte-identical to `:hover`, leaving the wheel with no keyboard focus. The page argues by sight and sound at once, so an unreadable label breaks half the argument.

The change was to withhold the change: audit all 24 wedges' contrast first and report the numbers. What came back was not a diff but evidence — E major's label at 1.57:1, and 9 of 24 under WCAG AA's 4.5:1. That reframed the bug: the uniform ink was not near the problem, it was the problem, so the fix was to reverse a deliberate decision rather than tune around it.

It worked because a number can be wrong and a plausible edit cannot, and it stuck because it landed in the harness, not the conversation: a contrast function in the theory module and 24 assertions in CI, anchored on the WCAG formula so they cannot pass on a broken implementation. The rule holds for all 24 wedges, not the one I noticed.

**What did this work change about who I want to be as a developer?**

I want to point an agent at evidence, not at outcomes. Generating a plausible change is the cheap part now; deciding what would prove it wrong is the part I cannot hand over — including when the thing to be proved wrong is a decision of my own.
