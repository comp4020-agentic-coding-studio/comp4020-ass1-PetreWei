import {
  KEYS,
  getDiatonicChords,
  getHappyBirthdayNotes,
  getKeyColor,
  getNeighborIndices,
  getRelativeMinorTonicPitchClass,
  getTriadNotes,
  getWheelNumerals,
  pitchClassToFrequency,
} from "../lib/circleOfFifths.ts";
import type { ChordQuality, KeyQuality, TriadNote } from "../lib/circleOfFifths.ts";

type PlaybackMode = "chord" | "arpeggio";

const ARPEGGIO_STEP_SECONDS = 0.18;
const NOTE_DURATION_SECONDS = 1.1;

let playbackMode: PlaybackMode = "arpeggio";

const buttons = Array.from(
  document.querySelectorAll<HTMLButtonElement>("[data-key]"),
);

const modeButtons = Array.from(
  document.querySelectorAll<HTMLButtonElement>("[data-playback-mode]"),
);

const pianoKeys = Array.from(
  document.querySelectorAll<HTMLElement>("[data-pitch-class]"),
);

const wedgeNumerals = Array.from(
  document.querySelectorAll<HTMLElement>('[data-testid="wedge-numeral"]'),
);

const happyBirthdayButton = document.querySelector<HTMLButtonElement>(
  '[data-testid="happy-birthday-button"]',
);

const fields = {
  name: document.querySelector<HTMLElement>('[data-field="name"]'),
  colour: document.querySelector<HTMLElement>('[data-field="colour"]'),
};

const chordTableBody = document.querySelector<HTMLElement>(
  '[data-testid="chord-table-body"]',
);

const keyInfoSection = document.querySelector<HTMLElement>(
  '[data-testid="key-info"]',
);

const placeholder = document.querySelector<HTMLElement>(
  '[data-testid="key-info-placeholder"]',
);

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  audioContext ??= new AudioContext();
  return audioContext;
}

function stepSecondsForMode(mode: PlaybackMode): number {
  return mode === "chord" ? 0 : ARPEGGIO_STEP_SECONDS;
}

function playNotes(notes: TriadNote[], stepSeconds: number): void {
  const context = getAudioContext();
  const now = context.currentTime;

  notes.forEach((note, i) => {
    const frequency = pitchClassToFrequency(note.pitchClass, note.octave);
    const startTime = now + i * stepSeconds;
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

function highlightPianoKeys(notes: TriadNote[], stepSeconds: number): void {
  for (const timeoutId of pendingHighlightTimeouts) {
    clearTimeout(timeoutId);
  }
  pendingHighlightTimeouts = [];

  for (const pianoKey of pianoKeys) {
    pianoKey.classList.remove("piano-key-active");
  }

  notes.forEach((note, i) => {
    const timeoutId = setTimeout(
      () => {
        const pianoKey = pianoKeys.find(
          (key) =>
            Number(key.dataset.pitchClass) === note.pitchClass &&
            Number(key.dataset.octave) === note.octave,
        );
        pianoKey?.classList.add("piano-key-active");
      },
      i * stepSeconds * 1000,
    );
    pendingHighlightTimeouts.push(timeoutId);
  });
}

function playAndHighlight(rootPitchClass: number, quality: ChordQuality): void {
  const triadNotes = getTriadNotes(rootPitchClass, quality);
  const notes = [triadNotes.root, triadNotes.third, triadNotes.fifth, triadNotes.doubledRoot];
  const stepSeconds = stepSecondsForMode(playbackMode);
  highlightPianoKeys(notes, stepSeconds);
  playNotes(notes, stepSeconds);
}

function playSingleNote(pitchClass: number, octave: number): void {
  const notes = [{ pitchClass, octave }];
  highlightPianoKeys(notes, 0);
  playNotes(notes, 0);
}

const HAPPY_BIRTHDAY_STEP_SECONDS = 0.42;

let selectedIndex: number | null = null;
let selectedQuality: KeyQuality | null = null;

function playHappyBirthday(): void {
  if (selectedIndex === null || selectedQuality === null) return;
  const notes = getHappyBirthdayNotes(KEYS[selectedIndex], selectedQuality);
  highlightPianoKeys(notes, HAPPY_BIRTHDAY_STEP_SECONDS);
  playNotes(notes, HAPPY_BIRTHDAY_STEP_SECONDS);
}

function updateSelection(index: number, quality: KeyQuality): void {
  selectedIndex = index;
  selectedQuality = quality;
  if (happyBirthdayButton) happyBirthdayButton.disabled = false;

  const key = KEYS[index];
  const { dominant, subdominant } = getNeighborIndices(index);

  for (const button of buttons) {
    const buttonIndex = Number(button.dataset.index);
    const buttonQuality = button.dataset.mode as KeyQuality;
    const isPressed = buttonIndex === index && buttonQuality === quality;
    button.setAttribute("aria-pressed", String(isPressed));
    button.classList.toggle(
      "neighbor-dominant",
      buttonIndex === dominant && buttonQuality === quality,
    );
    button.classList.toggle(
      "neighbor-subdominant",
      buttonIndex === subdominant && buttonQuality === quality,
    );
  }

  for (const numeral of wedgeNumerals) {
    numeral.textContent = "";
  }
  for (const assignment of getWheelNumerals(index, quality)) {
    const numeral = wedgeNumerals.find((el) => {
      const wedge = el.closest<HTMLButtonElement>("[data-index]");
      return (
        Number(wedge?.dataset.index) === assignment.index &&
        wedge?.dataset.mode === assignment.mode
      );
    });
    if (numeral) numeral.textContent = assignment.numeral;
  }

  const isMinor = quality === "minor";
  const displayName = isMinor ? key.relativeMinorName : key.name;
  const colorName = getKeyColor(index, quality).name;

  if (placeholder) placeholder.hidden = true;
  if (keyInfoSection) keyInfoSection.hidden = false;
  if (fields.name)
    fields.name.textContent = `${displayName} ${isMinor ? "minor" : "major"}`;
  if (fields.colour) fields.colour.textContent = colorName;

  if (chordTableBody) {
    const chords = getDiatonicChords(key, quality);
    chordTableBody.replaceChildren(
      ...chords.map((chord) => {
        const row = document.createElement("tr");
        row.tabIndex = 0;
        row.setAttribute("role", "button");
        row.setAttribute(
          "aria-label",
          `Play ${chord.numeral}, ${chord.functionName}, ${chord.root}`,
        );

        const numeralCell = document.createElement("td");
        numeralCell.textContent = chord.numeral;
        const functionCell = document.createElement("td");
        functionCell.textContent = chord.functionName;
        const rootCell = document.createElement("td");
        rootCell.textContent = chord.root;
        row.append(numeralCell, functionCell, rootCell);

        const play = () => playAndHighlight(chord.rootPitchClass, chord.quality);
        row.addEventListener("click", play);
        row.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            play();
          }
        });

        return row;
      }),
    );
  }

  const tonicPitchClass = isMinor
    ? getRelativeMinorTonicPitchClass(key.tonicPitchClass)
    : key.tonicPitchClass;
  playAndHighlight(tonicPitchClass, quality);
}

for (const button of buttons) {
  button.addEventListener("click", () => {
    const index = Number(button.dataset.index);
    const quality = button.dataset.mode as KeyQuality;
    updateSelection(index, quality);
  });
}

for (const modeButton of modeButtons) {
  modeButton.addEventListener("click", () => {
    playbackMode = modeButton.dataset.playbackMode as PlaybackMode;
    for (const button of modeButtons) {
      button.setAttribute("aria-pressed", String(button === modeButton));
    }
  });
}

for (const pianoKey of pianoKeys) {
  pianoKey.addEventListener("click", () => {
    playSingleNote(Number(pianoKey.dataset.pitchClass), Number(pianoKey.dataset.octave));
  });
}

happyBirthdayButton?.addEventListener("click", playHappyBirthday);
