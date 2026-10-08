<script lang="ts">
  import { fly } from 'svelte/transition';
  import { profile, skills } from '../resume';
</script>

<p class="prompt"><span class="user">{profile.handle}@os</span>:~$ <span class="cmd">lsmod --skills</span></p>

<div class="groups">
  {#each skills as group, g (group.label)}
    <section in:fly|global={{ y: 10, duration: 240, delay: 60 + g * 70 }}>
      <h2 class="h-display">[{group.label}]</h2>
      <ul class="tags">
        {#each group.items as item (item)}
          <li class="tag">{item}</li>
        {/each}
      </ul>
    </section>
  {/each}
</div>

<style>
  .groups {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  h2 {
    font-size: 24px;
    margin-bottom: 6px;
    color: var(--fg-soft);
  }
</style>
