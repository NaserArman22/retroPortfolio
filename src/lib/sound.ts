// Tiny square-wave UI sounds generated with Web Audio — no audio files to load.
// The on/off preference is remembered per browser.

const STORAGE_KEY = 'arman-os:sound';

export type Sfx = 'click' | 'open' | 'close' | 'boot';

/** [frequency Hz, duration s, start offset s] */
type Note = [number, number, number];

const patterns: Record<Sfx, Note[]> = {
  click: [[1200, 0.03, 0]],
  open: [
    [520, 0.06, 0],
    [880, 0.08, 0.06],
  ],
  close: [
    [700, 0.06, 0],
    [380, 0.09, 0.06],
  ],
  boot: [
    [440, 0.09, 0],
    [660, 0.09, 0.1],
    [990, 0.16, 0.2],
  ],
};

let ctx: AudioContext | null = null;
let enabled = readPreference();

function readPreference(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    // Storage blocked (private mode, sandbox) — default to on.
    return true;
  }
}

export function isSoundOn(): boolean {
  return enabled;
}

export function setSoundOn(on: boolean): void {
  enabled = on;
  try {
    localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
  } catch {
    // Preference just won't persist; the toggle still works for this visit.
  }
}

export function play(sfx: Sfx): void {
  if (!enabled) return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();

    for (const [freq, duration, offset] of patterns[sfx]) {
      const start = ctx.currentTime + offset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.035, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration + 0.02);
    }
  } catch {
    // Web Audio unavailable — sounds are decorative, so stay silent.
  }
}
