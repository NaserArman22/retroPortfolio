<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    onDone: () => void;
  }

  let { onDone }: Props = $props();

  interface BootLine {
    text: string;
    /** ms to wait before this line appears */
    delay: number;
    memory?: boolean;
  }

  const MEMORY_KB = 65536;

  const lines: BootLine[] = [
    { text: 'ARMAN BIOS v2.6  (C) 2026 Abu Naser MD. Arman', delay: 150 },
    { text: 'CPU: Java · Spring Boot · Angular  [full-stack]', delay: 220 },
    { text: 'Memory test: ', delay: 220, memory: true },
    { text: 'Detecting drives ..... experience.log  projects.dir  skills.sys', delay: 700 },
    { text: 'Loading ARMAN-OS kernel ........ OK', delay: 320 },
    { text: 'Mounting /home/arman ........... OK', delay: 260 },
    { text: 'Starting desktop environment ...', delay: 300 },
  ];

  let shown = $state(0);
  let memory = $state(0);
  let finished = false;

  function finish() {
    if (finished) return;
    finished = true;
    onDone();
  }

  onMount(() => {
    const timers: number[] = [];
    let memTimer = 0;
    let at = 0;

    lines.forEach((line, i) => {
      at += line.delay;
      timers.push(
        window.setTimeout(() => {
          shown = i + 1;
          if (line.memory) {
            memTimer = window.setInterval(() => {
              memory = Math.min(MEMORY_KB, memory + 4096);
              if (memory >= MEMORY_KB) clearInterval(memTimer);
            }, 30);
          }
        }, at),
      );
    });
    timers.push(window.setTimeout(finish, at + 800));

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(memTimer);
    };
  });
</script>

<!-- Any key or click skips the boot sequence. -->
<svelte:window onkeydown={finish} onpointerdown={finish} />

<div class="boot screen-only">
  <pre class="log">{#each lines.slice(0, shown) as line (line.text)}{line.text}{#if line.memory}{memory}K {memory >= MEMORY_KB ? 'OK' : ''}{/if}
{/each}<span class="cursor"></span></pre>
  <p class="skip">press any key to skip</p>
</div>

<style>
  .boot {
    position: fixed;
    inset: 0;
    padding: clamp(16px, 4vw, 48px);
    background: var(--bg);
    font-family: var(--font-display);
    font-size: clamp(18px, 2.4vw, 26px);
    cursor: pointer;
  }
  .log {
    margin: 0;
    font: inherit;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .skip {
    position: absolute;
    bottom: 24px;
    left: 0;
    right: 0;
    margin: 0;
    text-align: center;
    color: var(--fg-dim);
    font-size: 0.8em;
    animation: blink 1.4s steps(1) infinite;
  }
</style>
