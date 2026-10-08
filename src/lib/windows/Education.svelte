<script lang="ts">
  import { fly } from 'svelte/transition';
  import { education, profile } from '../resume';
</script>

<p class="prompt"><span class="user">{profile.handle}@os</span>:~$ <span class="cmd">cat education.dat</span></p>

<article in:fly|global={{ y: 10, duration: 260, delay: 60 }}>
  <span class="year h-display">{education.year}</span>
  <h2 class="h-display">{education.degree}</h2>
  <p class="school">{education.school}</p>
  {#if education.detail}
    <p class="detail" in:fly|global={{ y: 10, duration: 260, delay: 160 }}>{education.detail}</p>
  {/if}
</article>

<style>
  article {
    padding: 14px 16px;
    border: 1px solid var(--fg-dim);
    position: relative;
  }
  .year {
    float: right;
    margin-left: 12px;
    font-size: 32px;
    color: var(--fg-dim);
  }
  h2 {
    font-size: 30px;
  }
  .school {
    margin: 6px 0 0;
    color: var(--fg-soft);
  }
  .detail {
    display: inline-block;
    margin: 14px 0 0;
    padding: 2px 10px;
    background: var(--fg);
    color: var(--bg);
    text-shadow: none;
  }
</style>
