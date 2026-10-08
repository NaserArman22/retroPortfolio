import type { Component } from 'svelte';
import type { IconName } from './Icon.svelte';
import About from './windows/About.svelte';
import Experience from './windows/Experience.svelte';
import Projects from './windows/Projects.svelte';
import Skills from './windows/Skills.svelte';
import EducationWin from './windows/Education.svelte';
import Honors from './windows/Honors.svelte';
import VolunteeringWin from './windows/Volunteering.svelte';
import Contact from './windows/Contact.svelte';

export type AppId =
  | 'about'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'education'
  | 'honors'
  | 'volunteering'
  | 'contact';

export interface AppDef {
  id: AppId;
  /** Retro file name shown under the icon and in the title bar. */
  file: string;
  icon: IconName;
  /** Preferred window size in px (clamped to the viewport). */
  w: number;
  h: number;
  component: Component;
}

// Order matters: it is the desktop order and the number-key shortcut (1 = first).
export const apps: AppDef[] = [
  { id: 'about', file: 'about.txt', icon: 'doc', w: 560, h: 460, component: About },
  { id: 'experience', file: 'experience.log', icon: 'folder', w: 860, h: 560, component: Experience },
  { id: 'projects', file: 'projects.dir', icon: 'disk', w: 560, h: 380, component: Projects },
  { id: 'skills', file: 'skills.sys', icon: 'chip', w: 600, h: 440, component: Skills },
  { id: 'education', file: 'education.dat', icon: 'save', w: 560, h: 340, component: EducationWin },
  { id: 'honors', file: 'honors.txt', icon: 'star', w: 520, h: 380, component: Honors },
  {
    id: 'volunteering',
    file: 'volunteer.log',
    icon: 'folder',
    w: 520,
    h: 340,
    component: VolunteeringWin,
  },
  { id: 'contact', file: 'contact.exe', icon: 'term', w: 500, h: 380, component: Contact },
];

export const appById = Object.fromEntries(apps.map((a) => [a.id, a])) as Record<AppId, AppDef>;
