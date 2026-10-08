<script lang="ts">
  import { fly } from 'svelte/transition';
  import { honors, profile } from '../resume';
</script>

<p class="prompt"><span class="user">{profile.handle}@os</span>:~$ <span class="cmd">cat honors.txt</span></p>

<ol class="timeline">
  {#each honors as honor, i (honor.title)}
    <li in:fly|global={{ x: -10, duration: 240, delay: 60 + i * 80 }}>
      <h2>{honor.title}</h2>
      {#if honor.period || honor.detail}
        <p class="muted">{[honor.period, honor.detail].filter(Boolean).join(' · ')}</p>
      {/if}
    </li>
  {/each}
</ol>

<style>
  .timeline {
    list-style: none;
    margin: 0 0 0 6px;
    padding: 0 0 0 20px;
    border-left: 1px dashed var(--fg-dim);
  }
  li {
    position: relative;
    margin-bottom: 16px;
  }
  li::before {
    content: '';
    position: absolute;
    left: -26px;
    top: 6px;
    width: 10px;
    height: 10px;
    background: var(--fg);
    box-shadow: var(--glow);
  }
  h2 {
    margin: 0;
    font-size: 16px;
    font-weight: normal;
  }
  p {
    margin: 2px 0 0;
    font-size: 13px;
  }
</style>
