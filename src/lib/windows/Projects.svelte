<script lang="ts">
  import { fly } from 'svelte/transition';
  import { profile, projects } from '../resume';
</script>

<p class="prompt"><span class="user">{profile.handle}@os</span>:~$ <span class="cmd">ls -l projects.dir</span></p>

<ul class="projects">
  {#each projects as project, i (project.name)}
    <li in:fly|global={{ y: 10, duration: 240, delay: 60 + i * 80 }}>
      <header>
        <h2 class="h-display">{project.name}</h2>
        <span class="muted">{project.period}</span>
      </header>
      <p>{project.description}</p>
      {#if project.link}
        <p class="link">
          <span class="muted">src →</span>
          <a href={project.link.href} target="_blank" rel="noopener noreferrer">{project.link.label}</a>
        </p>
      {/if}
      <ul class="tags">
        {#each project.tech as t (t)}
          <li class="tag">{t}</li>
        {/each}
      </ul>
    </li>
  {/each}
</ul>

<style>
  .projects {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .projects > li {
    padding: 12px 14px;
    border: 1px solid var(--fg-faint);
    border-left: 3px solid var(--fg);
  }
  header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: baseline;
    gap: 4px 12px;
  }
  h2 {
    font-size: 28px;
  }
  p {
    margin: 6px 0 10px;
  }
  .link {
    word-break: break-all;
  }
</style>
