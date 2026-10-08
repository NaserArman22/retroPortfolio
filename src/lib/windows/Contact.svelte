<script lang="ts">
  import { fly } from 'svelte/transition';
  import { contacts, profile } from '../resume';
  import { viewResume } from '../download';
</script>

<p class="prompt"><span class="user">{profile.handle}@os</span>:~$ <span class="cmd">./contact.exe</span></p>

<ul class="links">
  {#each contacts as c, i (c.label)}
    <li in:fly|global={{ y: 10, duration: 240, delay: 60 + i * 70 }}>
      <span class="label muted">{c.label}</span>
      <a
        href={c.href}
        target={c.href.startsWith('https://') ? '_blank' : undefined}
        rel={c.href.startsWith('https://') ? 'noopener noreferrer' : undefined}>{c.value}</a
      >
    </li>
  {/each}
</ul>

<div class="actions" in:fly|global={{ y: 10, duration: 240, delay: 60 + contacts.length * 70 }}>
  <button type="button" class="btn" onclick={viewResume}>▤ View résumé (PDF)</button>
</div>

<p class="muted end">connection ready<span class="cursor"></span></p>

<style>
  .links {
    list-style: none;
    margin: 0 0 18px;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  li {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 12px;
    align-items: baseline;
  }
  a {
    word-break: break-all;
  }
  .actions {
    margin-bottom: 16px;
  }
  .end {
    margin: 0;
  }
  @media (max-width: 420px) {
    li {
      grid-template-columns: 1fr;
      gap: 0;
    }
  }
</style>
