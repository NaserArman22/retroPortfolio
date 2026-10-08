<script lang="ts">
  import { onMount } from 'svelte';
  import { apps, appById, type AppId } from './apps';
  import { wm, type Point } from './wm.svelte';
  import Window from './Window.svelte';
  import Icon from './Icon.svelte';
  import { profile } from './resume';
  import { play, isSoundOn, setSoundOn } from './sound';
  import { viewResume } from './download';

  interface Props {
    onReboot: () => void;
  }

  let { onReboot }: Props = $props();

  let selected = $state<AppId | null>(null);
  let startOpen = $state(false);
  let soundOn = $state(isSoundOn());
  let now = $state(new Date());

  // Icon buttons, used to find where each window should genie out of.
  const iconEls: Partial<Record<AppId, HTMLButtonElement>> = {};

  const clock = $derived(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  // Touch has no double-click, so a tap opens directly. Decided per press (not once at load)
  // so it works on hybrid laptops and when DevTools device mode is toggled after loading.
  let touchMode = $state(
    typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches,
  );

  onMount(() => {
    play('boot');
    const timer = setInterval(() => (now = new Date()), 10_000);
    return () => clearInterval(timer);
  });

  function originOf(id: AppId): Point {
    const el = iconEls[id];
    if (!el) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function openApp(id: AppId) {
    startOpen = false;
    selected = id;
    if (!wm.isOpen(id)) play('open');
    wm.open(id, originOf(id));
  }

  function closeApp(id: AppId) {
    wm.close(id);
    play('close');
  }

  function onIconClick(id: AppId) {
    if (touchMode) {
      openApp(id);
    } else {
      selected = id;
      play('click');
    }
  }

  function toggleSound() {
    soundOn = !soundOn;
    setSoundOn(soundOn);
    play('click');
  }

  function reboot() {
    startOpen = false;
    wm.closeAll();
    onReboot();
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const n = Number(e.key);
    if (Number.isInteger(n) && n >= 1 && n <= apps.length) {
      e.preventDefault();
      openApp(apps[n - 1].id);
      return;
    }

    if (e.key === 'Escape') {
      if (startOpen) {
        startOpen = false;
      } else if (wm.focusedId) {
        closeApp(wm.focusedId);
      }
    }
  }

  function onPointerdown(e: PointerEvent) {
    touchMode = e.pointerType !== 'mouse';
    const target = e.target as Element;
    if (startOpen && !target.closest('.start-area')) startOpen = false;
    if (target.classList.contains('desktop')) selected = null;
  }
</script>

<svelte:window onkeydown={onKeydown} onpointerdowncapture={onPointerdown} onresize={() => wm.fitToViewport()} />

<div class="desktop screen-only">
  <div class="wallpaper" aria-hidden="true">
    <div class="h-display wp-name">{profile.name}</div>
    <div class="wp-title">{profile.title}</div>
  </div>

  <nav class="icons" aria-label="Desktop">
    {#each apps as app, i (app.id)}
      <button
        type="button"
        class="icon"
        class:selected={selected === app.id}
        class:open={wm.isOpen(app.id)}
        bind:this={iconEls[app.id]}
        onclick={() => onIconClick(app.id)}
        ondblclick={() => openApp(app.id)}
        onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), openApp(app.id))}
        title="{app.file} — press {i + 1}"
      >
        <Icon name={app.icon} size={42} />
        <span class="label">{app.file}</span>
      </button>
    {/each}
  </nav>

  <p class="hint" aria-hidden="true">
    {touchMode ? 'tap an icon' : 'double-click an icon'} · 1–8 open · Esc close
  </p>

  {#each wm.windows as w (w.id)}
    {#if !w.minimized}
      {@const App = appById[w.id].component}
      <Window win={w} title={appById[w.id].file} onClose={() => closeApp(w.id)}>
        <App />
      </Window>
    {/if}
  {/each}

  <footer class="taskbar">
    <div class="start-area">
      <button
        type="button"
        class="start"
        class:active={startOpen}
        aria-expanded={startOpen}
        aria-haspopup="menu"
        onclick={() => {
          startOpen = !startOpen;
          play('click');
        }}
      >
        <Icon name="power" size={18} /> START
      </button>

      {#if startOpen}
        <div class="start-menu" role="menu">
          <div class="menu-head">
            <span class="h-display">{profile.handle.toUpperCase()}-OS</span>
            <span class="muted">{profile.title}</span>
          </div>
          {#each apps as app, i (app.id)}
            <button type="button" role="menuitem" onclick={() => openApp(app.id)}>
              <Icon name={app.icon} size={18} />
              <span>{app.file}</span>
              <kbd>{i + 1}</kbd>
            </button>
          {/each}
          <hr />
          <button
            type="button"
            role="menuitem"
            onclick={() => {
              startOpen = false;
              viewResume();
            }}
          >
            <Icon name="doc" size={18} /><span>View résumé (PDF)</span>
          </button>
          <button type="button" role="menuitem" onclick={toggleSound}>
            <Icon name="chip" size={18} /><span>Sound: {soundOn ? 'on' : 'off'}</span>
          </button>
          <button type="button" role="menuitem" onclick={reboot}>
            <Icon name="power" size={18} /><span>Reboot</span>
          </button>
        </div>
      {/if}
    </div>

    <div class="tasks">
      {#each wm.windows as w (w.id)}
        <button
          type="button"
          class="task"
          class:active={wm.focusedId === w.id}
          class:minimized={w.minimized}
          onclick={() => wm.toggle(w.id)}
        >
          {appById[w.id].file}
        </button>
      {/each}
    </div>

    <div class="tray">
      <button type="button" class="tray-btn" onclick={viewResume} title="View résumé (PDF)">
        PDF
      </button>
      <button
        type="button"
        class="tray-btn"
        onclick={toggleSound}
        aria-pressed={soundOn}
        title="Toggle sound"
      >
        {soundOn ? '♪ ON' : '♪ OFF'}
      </button>
      <span class="clock">{clock}</span>
    </div>
  </footer>
</div>

<style>
  .desktop {
    position: fixed;
    inset: 0;
    overflow: hidden;
    background:
      radial-gradient(ellipse at 70% 40%, rgba(57, 255, 106, 0.07), transparent 60%),
      linear-gradient(rgba(57, 255, 106, 0.035) 1px, transparent 1px) 0 0 / 100% 32px,
      linear-gradient(90deg, rgba(57, 255, 106, 0.035) 1px, transparent 1px) 0 0 / 32px 100%,
      var(--bg);
  }

  .wallpaper {
    position: absolute;
    right: 6vw;
    bottom: calc(var(--taskbar-h) + 7vh);
    text-align: right;
    opacity: 0.22;
    pointer-events: none;
    user-select: none;
  }
  .wp-name {
    font-size: clamp(40px, 7vw, 96px);
  }
  .wp-title {
    font-size: clamp(14px, 1.6vw, 22px);
    letter-spacing: 4px;
    text-transform: uppercase;
  }

  .icons {
    position: absolute;
    top: 14px;
    left: 14px;
    bottom: calc(var(--taskbar-h) + 14px);
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(auto-fill, 96px);
    grid-auto-columns: 124px;
    gap: 6px;
  }

  .icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 6px 4px;
    background: transparent;
    border: 1px dashed transparent;
    cursor: pointer;
  }
  .icon:hover {
    border-color: var(--fg-faint);
  }
  .icon.selected {
    border-color: var(--fg-dim);
    background: rgba(57, 255, 106, 0.08);
  }
  .icon.selected .label {
    background: var(--fg);
    color: var(--bg);
    text-shadow: none;
  }
  .label {
    font-size: 13px;
    padding: 0 4px;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .icon.open .label::after {
    content: ' •';
  }

  .hint {
    position: absolute;
    left: 0;
    right: 0;
    bottom: calc(var(--taskbar-h) + 8px);
    margin: 0;
    text-align: center;
    font-size: 12px;
    color: var(--fg-dim);
    pointer-events: none;
  }

  /* ---------- Taskbar ---------- */
  .taskbar {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: var(--taskbar-h);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 8px;
    background: var(--panel-solid);
    border-top: 1px solid var(--fg-dim);
    box-shadow: 0 -4px 18px rgba(57, 255, 106, 0.08);
    z-index: 5000;
  }

  .start-area {
    position: relative;
  }
  .start {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 32px;
    padding: 0 12px;
    background: transparent;
    border: 1px solid var(--fg);
    font-family: var(--font-display);
    font-size: 22px;
    letter-spacing: 2px;
    cursor: pointer;
  }
  .start:hover,
  .start.active {
    background: var(--fg);
    color: var(--bg);
    text-shadow: none;
  }

  .start-menu {
    position: absolute;
    left: 0;
    bottom: calc(100% + 8px);
    width: 270px;
    max-height: calc(100vh - var(--taskbar-h) - 24px);
    overflow-y: auto;
    padding: 6px;
    background: var(--panel-solid);
    border: 1px solid var(--fg);
    box-shadow: var(--box-glow);
  }
  .menu-head {
    display: flex;
    flex-direction: column;
    padding: 6px 8px 10px;
    border-bottom: 1px solid var(--fg-faint);
    margin-bottom: 4px;
  }
  .menu-head .h-display {
    font-size: 26px;
  }
  .menu-head .muted {
    font-size: 12px;
  }
  .start-menu button {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 6px 8px;
    background: transparent;
    border: 0;
    text-align: left;
    cursor: pointer;
  }
  .start-menu button span {
    flex: 1;
  }
  .start-menu button:hover,
  .start-menu button:focus-visible {
    background: var(--fg);
    color: var(--bg);
    text-shadow: none;
    outline: none;
  }
  .start-menu kbd {
    font-family: inherit;
    font-size: 12px;
    border: 1px solid currentColor;
    padding: 0 5px;
  }
  .start-menu hr {
    border: 0;
    border-top: 1px solid var(--fg-faint);
    margin: 4px 0;
  }

  .tasks {
    flex: 1;
    display: flex;
    gap: 6px;
    overflow-x: auto;
    min-width: 0;
  }
  .task {
    flex-shrink: 0;
    height: 30px;
    padding: 0 12px;
    background: transparent;
    border: 1px solid var(--fg-dim);
    font-size: 13px;
    cursor: pointer;
  }
  .task.active {
    background: rgba(57, 255, 106, 0.18);
    border-color: var(--fg);
  }
  .task.minimized {
    color: var(--fg-dim);
    border-style: dashed;
  }

  .tray {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .tray-btn {
    height: 30px;
    padding: 0 8px;
    background: transparent;
    border: 1px solid var(--fg-faint);
    font-size: 13px;
    cursor: pointer;
  }
  .tray-btn:hover {
    border-color: var(--fg);
  }
  .clock {
    padding: 0 6px;
    font-family: var(--font-display);
    font-size: 22px;
  }

  @media (max-width: 699px) {
    .icons {
      grid-auto-flow: row;
      grid-template-rows: none;
      grid-template-columns: repeat(auto-fill, minmax(108px, 1fr));
      grid-auto-rows: 92px;
      right: 14px;
      bottom: auto;
    }
    .wallpaper {
      left: 16px;
      right: 16px;
      text-align: center;
    }
    .hint,
    .clock {
      display: none;
    }
    .start {
      padding: 0 8px;
      font-size: 20px;
    }
  }
</style>
