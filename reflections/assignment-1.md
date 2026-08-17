# Assignment 1 reflection

**What was the breakthrough that moved the work forward?**

Splitting the music theory into a plain, DOM-free module and unit-testing it
in isolation *before* writing any markup or client script. Once
`getScaleDifference`, the triad frequencies, and the sharp/flat counts all
passed against hand-checked, textbook values, everything downstream — the
page, the click handler, the audio — was just wiring known-correct data into
the DOM. That separation also surfaced a real constraint in how this repo
tests things: the spec suite parses built HTML with plain JSDOM, which doesn't
execute the client script, so click-driven behaviour was never going to be
something a test could see directly. Writing the logic as a separate testable
module wasn't just cleaner — it was the only part of the interaction that
*could* be tested at all, and I wrote that convention into `CLAUDE.md` so I
don't have to rediscover it.

**What did this work change about who I want to be as a developer?**

I noticed how easy it would have been to skip the isolated unit tests and
just wire everything together, "checking" correctness by clicking around in
a browser and eyeballing whether the numbers looked plausible. Music theory
has exact, checkable answers — a specific frequency in Hz, a specific spelled
note — and treating those as assertions rather than vibes caught the one
genuinely tricky edge case (F♯ major's scale needs E♯, not F) before it ever
reached the page. I want to keep defaulting to "what's the checkable claim
here, and can I assert it" even when a feature feels too small or too visual
to bother testing.
