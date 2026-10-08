<script lang="ts">
  import { fly } from 'svelte/transition';
  import { experience, profile } from '../resume';

  let selected = $state(0);
  const job = $derived(experience[selected]);
</script>

<p class="prompt"><span class="user">{profile.handle}@os</span>:~$ <span class="cmd">less experience.log</span></p>

<div class="split">
  <ul class="list" aria-label="Positions">
    {#each experience as item, i (item.company + item.period)}
      <li in:fly|global={{ x: -10, duration: 240, delay: 60 + i * 70 }}>
        <button
          type="button"
          class:active={selected === i}
          aria-current={selected === i}
          onclick={() => (selected = i)}
        >
          <span class="role">{item.role}</span>
          <span class="company">{item.company}</span>
          <span class="period muted">{item.period}</span>
        </button>
      </li>
    {/each}
  </ul>

  <article class="detail">
    {#key selected}
      <header in:fly|global={{ y: 8, duration: 220 }}>
        <h2 class="h-display">{job.role}</h2>
        <p class="meta">{job.company} <span class="muted">· {job.period}</span></p>
      </header>
      <ul class="bullets">
        {#each job.bullets as bullet, i (bullet)}
          <li in:fly|global={{ y: 8, duration: 220, delay: 60 + i * 50 }}>{bullet}</li>
        {/each}
      </ul>
      <ul class="tags" in:fly|global={{ y: 8, duration: 220, delay: 120 + job.bullets.length * 50 }}>
        {#each job.tech as t (t)}
          <li class="tag">{t}</li>
        {/each}
      </ul>
    {/key}
  </article>
</div>

<style>
  .split {
    display: grid;
    grid-template-columns: 230px 1fr;
    gap: 18px;
    min-width: 0;
  }

  .list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .list button {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 8px 10px;
    text-align: left;
    background: transparent;
    border: 1px solid var(--fg-faint);
    cursor: pointer;
  }
  .list button:hover {
    border-color: var(--fg-dim);
  }
  .list button.active {
    border-color: var(--fg);
    background: rgba(57, 255, 106, 0.12);
  }
  .role {
    font-size: 14px;
  }
  .company {
    color: var(--fg-soft);
    font-size: 13px;
  }
  .period {
    font-size: 12px;
  }

  .detail {
    min-width: 0;
  }
  .detail h2 {
    font-size: 30px;
  }
  .meta {
    margin: 2px 0 14px;
    color: var(--fg-soft);
  }

  @media (max-width: 760px) {
    .split {
      grid-template-columns: 1fr;
    }
    .list {
      flex-direction: row;
      overflow-x: auto;
      padding-bottom: 4px;
    }
    .list li {
      flex: 0 0 200px;
    }
    .list button {
      height: 100%;
    }
  }
</style>
