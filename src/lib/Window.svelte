<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Action } from 'svelte/action';
  import { cubicOut, cubicIn } from 'svelte/easing';
  import type { TransitionConfig } from 'svelte/transition';
  import { wm, isMobile, type Point, type WinState } from './wm.svelte';

  interface Props {
    win: WinState;
    title: string;
    onClose: () => void;
    children: Snippet;
  }

  let { win, title, onClose, children }: Props = $props();

  const focused = $derived(wm.focusedId === win.id);

  /**
   * "Genie" open/close: the window grows out of (and shrinks back into) its desktop icon.
   * Squashing Y faster than X gives the classic stretched look.
   */
  function genie(
    node: HTMLElement,
    { origin, intro }: { origin: Point; intro: boolean },
  ): TransitionConfig {
    const rect = node.getBoundingClientRect();
    const dx = origin.x - (rect.left + rect.width / 2);
    const dy = origin.y - (rect.top + rect.height / 2);
    // The window's position is itself a transform, so the animation must include it.
    const { x, y } = win;
    return {
      duration: intro ? 320 : 220,
      easing: intro ? cubicOut : cubicIn,
      css: (t, u) => {
        const sx = 0.04 + 0.96 * t;
        const sy = 0.02 + 0.98 * t * t;
        return `transform: translate3d(${x + dx * u}px, ${y + dy * u}px, 0) scale(${sx}, ${sy}); opacity: ${Math.min(1, t * 1.6)};`;
      },
    };
  }

  // Bring the window to front on any pointer press inside it.
  // (An action rather than an inline handler: the window itself isn't a control.)
  const focusOnPress: Action<HTMLElement, () => void> = (node, onPress) => {
    const handler = () => onPress?.();
    node.addEventListener('pointerdown', handler, { capture: true });
    return { destroy: () => node.removeEventListener('pointerdown', handler, { capture: true }) };
  };

  // Drag by the title bar using pointer capture so fast moves never "lose" the window.
  // Moves are batched to one per animation frame; mice can fire several events per frame.
  const dragHandle: Action<HTMLElement> = (node) => {
    let startX = 0;
    let startY = 0;
    let winX = 0;
    let winY = 0;
    let dragging = false;
    let frame = 0;
    let pendingX = 0;
    let pendingY = 0;

    const flush = () => {
      frame = 0;
      wm.move(win.id, pendingX, pendingY);
    };

    const down = (e: PointerEvent) => {
      if (e.button !== 0 || isMobile()) return;
      if ((e.target as Element).closest('button')) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      winX = win.x;
      winY = win.y;
      node.setPointerCapture(e.pointerId);
      e.preventDefault();
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      pendingX = winX + e.clientX - startX;
      pendingY = winY + e.clientY - startY;
      frame ||= requestAnimationFrame(flush);
    };
    const up = (e: PointerEvent) => {
      if (dragging && frame) {
        cancelAnimationFrame(frame);
        flush();
      }
      dragging = false;
      if (node.hasPointerCapture(e.pointerId)) node.releasePointerCapture(e.pointerId);
    };

    node.addEventListener('pointerdown', down);
    node.addEventListener('pointermove', move);
    node.addEventListener('pointerup', up);
    node.addEventListener('pointercancel', up);
    return {
      destroy() {
        cancelAnimationFrame(frame);
        node.removeEventListener('pointerdown', down);
        node.removeEventListener('pointermove', move);
        node.removeEventListener('pointerup', up);
        node.removeEventListener('pointercancel', up);
      },
    };
  };
</script>

<div
  class="window"
  class:focused
  style:transform="translate3d({win.x}px, {win.y}px, 0)"
  style:width="{win.w}px"
  style:height="{win.h}px"
  style:z-index={win.z}
  role="dialog"
  aria-label={title}
  use:focusOnPress={() => wm.focus(win.id)}
  in:genie|global={{ origin: win.origin, intro: true }}
  out:genie|global={{ origin: win.origin, intro: false }}
>
  <header class="titlebar" use:dragHandle>
    <span class="title">▌{title}</span>
    <div class="controls">
      <button type="button" aria-label="Minimize {title}" onclick={() => wm.minimize(win.id)}>_</button>
      <button type="button" class="close" aria-label="Close {title}" onclick={onClose}>×</button>
    </div>
  </header>
  <div class="body">
    {@render children()}
  </div>
</div>

<style>
  .window {
    /* Positioned with transform (see style:transform) so moving a window never triggers
       layout; will-change keeps it on its own GPU layer while dragging and animating. */
    position: absolute;
    left: 0;
    top: 0;
    will-change: transform;
    contain: layout paint;
    display: flex;
    flex-direction: column;
    background: var(--panel);
    border: 1px solid var(--fg-dim);
    box-shadow:
      var(--box-glow),
      6px 6px 0 rgba(0, 0, 0, 0.6);
    transform-origin: center;
    min-width: 0;
  }
  .window.focused {
    border-color: var(--fg);
    box-shadow:
      0 0 0 1px var(--fg),
      0 0 26px rgba(57, 255, 106, 0.25),
      6px 6px 0 rgba(0, 0, 0, 0.6);
  }

  .titlebar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    height: 32px;
    padding: 0 4px 0 10px;
    border-bottom: 1px solid var(--fg-dim);
    background: repeating-linear-gradient(
      to bottom,
      rgba(57, 255, 106, 0.1) 0 2px,
      transparent 2px 4px
    );
    cursor: grab;
    user-select: none;
    touch-action: none;
    flex-shrink: 0;
  }
  .titlebar:active {
    cursor: grabbing;
  }
  .focused .titlebar {
    background: var(--fg);
    color: var(--bg);
    text-shadow: none;
  }

  .title {
    font-family: var(--font-display);
    font-size: 21px;
    letter-spacing: 1px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .controls {
    display: flex;
    gap: 4px;
  }
  .controls button {
    width: 26px;
    height: 24px;
    padding: 0;
    line-height: 1;
    font-size: 16px;
    background: transparent;
    border: 1px solid currentColor;
    cursor: pointer;
  }
  .controls button:hover,
  .controls button:focus-visible {
    background: var(--bg);
    color: var(--fg);
    outline: none;
  }
  .controls .close:hover,
  .controls .close:focus-visible {
    color: var(--danger);
    border-color: var(--danger);
  }

  .body {
    flex: 1;
    overflow: auto;
    padding: 16px 18px 20px;
    overscroll-behavior: contain;
  }

  @media (max-width: 699px) {
    .titlebar {
      cursor: default;
    }
    .body {
      padding: 14px 14px 18px;
    }
  }
</style>
