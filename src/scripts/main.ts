import {
  KEYS,
  formatKeySignature,
  getNeighborIndices,
  getScaleDifference,
  getTriadFrequencies,
  getTriadPitchClasses,
} from "../lib/circleOfFifths.ts";

const ARPEGGIO_STEP_SECONDS = 0.18;
const NOTE_DURATION_SECONDS = 1.1;

const buttons = Array.from(
  document.querySelectorAll<HTMLButtonElement>("[data-key]"),
);

const pianoKeys = Array.from(
  document.querySelectorAll<HTMLElement>("[data-pitch-class]"),
);

const fields = {
  name: document.querySelector<HTMLElement>('[data-field="name"]'),
  scale: document.querySelector<HTMLElement>('[data-field="scale"]'),
  signature: document.querySelector<HTMLElement>('[data-field="signature"]'),
  dominantDiff: document.querySelector<HTMLElement>(
    '[data-field="dominant-diff"]',
  ),
  subdominantDiff: document.querySelector<HTMLElement>(
    '[data-field="subdominant-diff"]',
  ),
};

const placeholder = document.querySelector<HTMLElement>(
  '[data-testid="key-info-placeholder"]',
);

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  audioContext ??= new AudioContext();
  return audioContext;
}

function playTriad(tonicPitchClass: number): void {
  const context = getAudioContext();
  const { root, third, fifth } = getTriadFrequencies(tonicPitchClass);
  const now = context.currentTime;

  [root, third, fifth].forEach((frequency, i) => {
    const startTime = now + i * ARPEGGIO_STEP_SECONDS;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      startTime + NOTE_DURATION_SECONDS,
    );

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + NOTE_DURATION_SECONDS + 0.02);
  });
}

let pendingHighlightTimeouts: ReturnType<typeof setTimeout>[] = [];

function highlightPianoKeys(pitchClasses: number[]): void {
  for (const timeoutId of pendingHighlightTimeouts) {
    clearTimeout(timeoutId);
  }
  pendingHighlightTimeouts = [];

  for (const pianoKey of pianoKeys) {
    pianoKey.classList.remove("piano-key-active");
  }

  pitchClasses.forEach((pitchClass, i) => {
    const timeoutId = setTimeout(
      () => {
        const pianoKey = pianoKeys.find(
          (key) => Number(key.dataset.pitchClass) === pitchClass,
        );
        pianoKey?.classList.add("piano-key-active");
      },
      i * ARPEGGIO_STEP_SECONDS * 1000,
    );
    pendingHighlightTimeouts.push(timeoutId);
  });
}

function updateSelection(index: number): void {
  const key = KEYS[index];
  const { dominant, subdominant } = getNeighborIndices(index);

  for (const button of buttons) {
    const buttonIndex = Number(button.dataset.index);
    button.setAttribute("aria-pressed", String(buttonIndex === index));
    button.classList.toggle("neighbor-dominant", buttonIndex === dominant);
    button.classList.toggle(
      "neighbor-subdominant",
      buttonIndex === subdominant,
    );
  }

  const dominantDiff = getScaleDifference(index, dominant);
  const subdominantDiff = getScaleDifference(index, subdominant);

  if (placeholder) placeholder.hidden = true;
  if (fields.name) fields.name.textContent = `${key.name} major`;
  if (fields.scale)
    fields.scale.textContent =
      `The 7 notes of this key: ${key.scaleSpelling.join(" ")}`;
  if (fields.signature)
    fields.signature.textContent =
      `Key signature (what you'd see on sheet music): ${formatKeySignature(key)}`;
  if (fields.dominantDiff)
    fields.dominantDiff.textContent =
      `One step clockwise, ${KEYS[dominant].name} major (the "dominant"): swap ${dominantDiff.noteOnlyInA} for ${dominantDiff.noteOnlyInB}`;
  if (fields.subdominantDiff)
    fields.subdominantDiff.textContent =
      `One step counter-clockwise, ${KEYS[subdominant].name} major (the "subdominant"): swap ${subdominantDiff.noteOnlyInA} for ${subdominantDiff.noteOnlyInB}`;

  const triadPitchClasses = getTriadPitchClasses(key.tonicPitchClass);
  highlightPianoKeys([
    triadPitchClasses.root,
    triadPitchClasses.third,
    triadPitchClasses.fifth,
  ]);

  playTriad(key.tonicPitchClass);
}

for (const button of buttons) {
  button.addEventListener("click", () => {
    const index = Number(button.dataset.index);
    updateSelection(index);
  });
}
