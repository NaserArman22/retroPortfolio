<script lang="ts">
  import { fly } from 'svelte/transition';
  import { profile } from '../resume';
</script>

<p class="prompt"><span class="user">{profile.handle}@os</span>:~$ <span class="cmd">cat about.txt</span></p>

<h1 class="h-display name" in:fly|global={{ y: 10, duration: 260, delay: 60 }}>{profile.name}</h1>
<p class="title" in:fly|global={{ y: 10, duration: 260, delay: 120 }}>{profile.title}</p>
<p class="tagline" in:fly|global={{ y: 10, duration: 260, delay: 180 }}>{profile.tagline}</p>

<dl in:fly|global={{ y: 10, duration: 260, delay: 240 }}>
  <dt>LOCATION</dt>
  <dd>{profile.location}</dd>
  <dt>LANGUAGES</dt>
  <dd>{profile.languages.join(' · ')}</dd>
</dl>

<p class="summary" in:fly|global={{ y: 10, duration: 260, delay: 300 }}>{profile.summary}</p>

<p class="muted end">-- EOF --<span class="cursor"></span></p>

<style>
  .name {
    font-size: clamp(34px, 6vw, 46px);
  }
  .title {
    margin: 2px 0 12px;
    color: var(--fg-soft);
    letter-spacing: 3px;
    text-transform: uppercase;
    font-size: 14px;
  }
  .tagline {
    margin: 0 0 16px;
    padding-left: 12px;
    border-left: 2px solid var(--fg);
  }
  dl {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 4px 16px;
    margin: 0 0 16px;
  }
  dt {
    color: var(--fg-dim);
  }
  dd {
    margin: 0;
  }
  .summary {
    margin: 0 0 16px;
    color: var(--fg-soft);
  }
  .end {
    margin: 0;
  }
  @media (max-width: 460px) {
    dl {
      grid-template-columns: 1fr;
      gap: 0;
    }
    dd {
      margin-bottom: 8px;
    }
  }
</style>
