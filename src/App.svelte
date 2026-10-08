<script lang="ts">
  import Boot from './lib/Boot.svelte';
  import Desktop from './lib/Desktop.svelte';
  import PrintResume from './lib/PrintResume.svelte';

  let booted = $state(false);
</script>

{#if booted}
  <Desktop onReboot={() => (booted = false)} />
{:else}
  <Boot onDone={() => (booted = true)} />
{/if}

<PrintResume />

<div class="crt-overlay" aria-hidden="true"></div>
