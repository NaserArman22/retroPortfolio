<script lang="ts">
  // Plain, ink-friendly layout used only when printing (or "Save as PDF").
  import {
    contacts,
    education,
    experience,
    honors,
    profile,
    projects,
    skills,
    volunteering,
  } from './resume';
</script>

<div class="print-only print">
  <header>
    <h1>{profile.name}</h1>
    <p class="sub">{profile.title} · {profile.location}</p>
    <p class="contacts">{contacts.map((c) => c.value).join('  |  ')}</p>
  </header>

  <section>
    <h2>Summary</h2>
    <p>{profile.tagline} {profile.summary}</p>
  </section>

  <section>
    <h2>Experience</h2>
    {#each experience as job (job.company + job.period)}
      <div class="item">
        <div class="row"><strong>{job.role} — {job.company}</strong><span>{job.period}</span></div>
        <ul>
          {#each job.bullets as b (b)}<li>{b}</li>{/each}
        </ul>
        <p class="tech">Tech: {job.tech.join(', ')}</p>
      </div>
    {/each}
  </section>

  <section>
    <h2>Projects</h2>
    {#each projects as p (p.name)}
      <div class="item">
        <div class="row"><strong>{p.name}</strong><span>{p.period}</span></div>
        <p>{p.description}{#if p.link} ({p.link.label}){/if}</p>
        <p class="tech">Tech: {p.tech.join(', ')}</p>
      </div>
    {/each}
  </section>

  <section>
    <h2>Skills</h2>
    {#each skills as g (g.label)}
      <p><strong>{g.label}:</strong> {g.items.join(', ')}</p>
    {/each}
  </section>

  <section>
    <h2>Education</h2>
    <div class="row"><strong>{education.school}</strong><span>{education.year}</span></div>
    <p>{education.degree}{#if education.detail} · {education.detail}{/if}</p>
  </section>

  <section>
    <h2>Honors & Awards</h2>
    <ul>
      {#each honors as h (h.title)}
        <li>{h.title}{#if h.period || h.detail} — {[h.period, h.detail].filter(Boolean).join(', ')}{/if}</li>
      {/each}
    </ul>
  </section>

  <section>
    <h2>Volunteering</h2>
    <ul>
      {#each volunteering as v (v.org)}<li><strong>{v.org}</strong> — {v.description}</li>{/each}
    </ul>
  </section>

  <section>
    <h2>Languages</h2>
    <p>{profile.languages.join(', ')}</p>
  </section>
</div>

<style>
  .print {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 10.5pt;
    line-height: 1.35;
    color: #000;
    text-shadow: none;
  }
  h1 {
    margin: 0;
    font-size: 20pt;
  }
  h2 {
    margin: 12pt 0 4pt;
    font-size: 11pt;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 1px solid #000;
  }
  p {
    margin: 2pt 0;
  }
  .sub,
  .contacts {
    font-size: 10pt;
  }
  .item {
    margin-bottom: 6pt;
    break-inside: avoid;
  }
  .row {
    display: flex;
    justify-content: space-between;
    gap: 12pt;
  }
  ul {
    margin: 2pt 0;
    padding-left: 16pt;
  }
  .tech {
    font-style: italic;
  }
</style>
