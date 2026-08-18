# Process overview

## What I built

An interactive circle-of-fifths explainer you see and hear at once. Click a
wedge and its triad plays while a thin outline traces the three related
wedges its chords actually live on, roman numerals appear on exactly those
six positions, and the piano lights the notes as they sound — with a text
readout naming them for anyone who can't hear the audio at all. Colour is
Mr Mars' cited chromesthesia scheme, never themed, never the only channel:
every wedge is also lettered. The site ships in English, Spanish, French,
Italian and Simplified Chinese, with a light/dark theme that leaves the
wheel's colours and the piano's black/white keys untouched.

## The moments that mattered

1. **Proving the theory before touching the DOM.** All music-theory data and
   maths went into a plain, DOM-free module first, unit-tested against
   hand-checked values — C major's triad against the standard 261.63/329.63
   /392.00 Hz figures, F♯ major's scale spelled with E♯. That module later
   became the one place both channels read from, so the visual wheel and the
   audio can't independently drift
   ([`525b1ef`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-PetreWei/commit/525b1ef)).

2. **The highlight was lying about the sound, and the fix was deleting the
   code that hid it.** Happy Birthday's melody was transcribed with its
   opening note above the tonic instead of a fifth below, so the tune's
   highest line played a full octave under the other three; anchoring it on
   the tonic also pushed 12 of 24 keys' top notes off the rendered keyboard.
   `findPianoKey` papered over that second bug with a nearest-octave
   fallback — the wrong key lit up, and a wrong highlight looks exactly like
   a right one. The real fix was re-anchoring the melody on its own lowest
   note so every key fits, then **deleting the fallback**, so a note with no
   exact key now lights nothing rather than something plausible-looking. I
   verified it with a MutationObserver recording every key as it lit against
   five keys' computed pitches, not by eye
   ([`640421f`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-PetreWei/commit/640421f)).

3. **Auditing contrast turned up a decision I'd made and had to reverse.**
   Asked for accessibility, I measured every wedge's WCAG contrast before
   changing anything: E major's white label sat at 1.57:1, and 9 of 24
   wedges failed 4.5:1 AA. The cause was a uniform ink I'd deliberately
   chosen earlier "for future theming" — that choice was the bug, not
   incidental to it, and I said so and reversed it rather than patching
   around it. Each wedge now picks white or near-black by measured contrast
   (worst case 4.61:1, checked on the rendered page), and the same audit
   found focus was invisible on the wheel — hover and focus-visible were
   byte-identical CSS. Since the audio still needed a non-audio path, I added
   a text readout of whatever is sounding, `aria-hidden` so it doesn't double
   up on a screen reader that already has the audio. 24 contrast assertions
   now run in CI, anchored against the WCAG formula itself so they can't pass
   via a broken implementation
   ([`c8ade29`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-PetreWei/commit/c8ade29)).

## Before you ship

*Note to self: re-read this against the actual final commit history before the
cutoff, and check the citations still resolve with `pnpm check:evidence`.*
