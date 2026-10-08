// Window manager: which windows are open, where they are, and which one is on top.
// A single shared instance so the desktop, taskbar and windows all see the same state.

import { appById, type AppId } from './apps';

export interface Point {
  x: number;
  y: number;
}

export interface WinState {
  id: AppId;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  /** Screen point the window "genies" out of (its desktop icon). */
  origin: Point;
}

const TASKBAR_H = 46;
const MOBILE_BREAKPOINT = 700;
const MARGIN = 8;

export const isMobile = (): boolean => window.innerWidth < MOBILE_BREAKPOINT;

class WindowManager {
  windows = $state<WinState[]>([]);

  /** Top-most visible window, or null when the desktop has focus. */
  focusedId = $derived.by((): AppId | null => {
    let top: WinState | null = null;
    for (const w of this.windows) {
      if (!w.minimized && (!top || w.z > top.z)) top = w;
    }
    return top?.id ?? null;
  });

  #zCounter = 10;
  #cascade = 0;

  isOpen(id: AppId): boolean {
    return this.windows.some((w) => w.id === id);
  }

  open(id: AppId, origin?: Point): void {
    const existing = this.#find(id);
    if (existing) {
      existing.minimized = false;
      if (origin) existing.origin = origin;
      this.focus(id);
      return;
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight - TASKBAR_H;
    const def = appById[id];
    let x: number, y: number, w: number, h: number;

    if (isMobile()) {
      // Small screens: windows fill the screen above the taskbar.
      x = MARGIN;
      y = MARGIN;
      w = vw - MARGIN * 2;
      h = vh - MARGIN * 2;
    } else {
      w = Math.min(def.w, vw - MARGIN * 2);
      h = Math.min(def.h, vh - MARGIN * 2);
      // Cascade new windows from a centered start so they don't stack exactly.
      const step = (this.#cascade++ % 6) * 28;
      x = Math.max(MARGIN, Math.min((vw - w) / 2 - 60 + step, vw - w - MARGIN));
      y = Math.max(MARGIN, Math.min((vh - h) / 2 - 60 + step, vh - h - MARGIN));
    }

    this.windows.push({
      id,
      x: Math.round(x),
      y: Math.round(y),
      w: Math.round(w),
      h: Math.round(h),
      z: ++this.#zCounter,
      minimized: false,
      origin: origin ?? { x: vw / 2, y: vh / 2 },
    });
  }

  close(id: AppId): void {
    this.windows = this.windows.filter((w) => w.id !== id);
    if (this.windows.length === 0) this.#cascade = 0;
  }

  closeAll(): void {
    this.windows = [];
    this.#cascade = 0;
  }

  focus(id: AppId): void {
    const w = this.#find(id);
    if (w && w.z !== this.#zCounter) w.z = ++this.#zCounter;
  }

  minimize(id: AppId): void {
    const w = this.#find(id);
    if (w) w.minimized = true;
  }

  /** Taskbar behaviour: focused → minimize, otherwise restore and focus. */
  toggle(id: AppId): void {
    if (this.focusedId === id) this.minimize(id);
    else this.open(id);
  }

  /** Move a window, keeping its title bar reachable on screen. */
  move(id: AppId, x: number, y: number): void {
    const w = this.#find(id);
    if (!w) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight - TASKBAR_H;
    w.x = Math.round(Math.min(Math.max(x, 60 - w.w), vw - 60));
    w.y = Math.round(Math.min(Math.max(y, 0), vh - 32));
  }

  /** Keep windows inside the viewport after a resize. */
  fitToViewport(): void {
    for (const w of this.windows) {
      if (isMobile()) {
        w.x = MARGIN;
        w.y = MARGIN;
        w.w = window.innerWidth - MARGIN * 2;
        w.h = window.innerHeight - TASKBAR_H - MARGIN * 2;
      } else {
        const def = appById[w.id];
        w.w = Math.min(def.w, window.innerWidth - MARGIN * 2);
        w.h = Math.min(def.h, window.innerHeight - TASKBAR_H - MARGIN * 2);
        this.move(w.id, w.x, w.y);
      }
    }
  }

  #find(id: AppId): WinState | undefined {
    return this.windows.find((w) => w.id === id);
  }
}

export const wm = new WindowManager();
