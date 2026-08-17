import {
  KEYS,
  formatKeySignature,
  getNeighborIndices,
  getScaleDifference,
  getTriadFrequencies,
} from "../lib/circleOfFifths.ts";

const buttons = Array.from(
  document.querySelectorAll<HTMLButtonElement>("[data-key]"),
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

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  audioContext ??= new AudioContext();
  return audioContext;
}

function playTriad(tonicPitchClass: number): void {
  const context = getAudioContext();
  const { root, third, fifth } = getTriadFrequencies(tonicPitchClass);
  const now = context.currentTime;
  const duration = 0.8;

  for (const frequency of [root, third, fifth]) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }
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

  if (fields.name) fields.name.textContent = `${key.name} major`;
  if (fields.scale)
    fields.scale.textContent = `Scale: ${key.scaleSpelling.join(" ")}`;
  if (fields.signature)
    fields.signature.textContent = `Key signature: ${formatKeySignature(key)}`;
  if (fields.dominantDiff)
    fields.dominantDiff.textContent =
      `Dominant (${KEYS[dominant].name}): ${dominantDiff.noteOnlyInA} becomes ${dominantDiff.noteOnlyInB}`;
  if (fields.subdominantDiff)
    fields.subdominantDiff.textContent =
      `Subdominant (${KEYS[subdominant].name}): ${subdominantDiff.noteOnlyInA} becomes ${subdominantDiff.noteOnlyInB}`;

  playTriad(key.tonicPitchClass);
}

for (const button of buttons) {
  button.addEventListener("click", () => {
    const index = Number(button.dataset.index);
    updateSelection(index);
  });
}
