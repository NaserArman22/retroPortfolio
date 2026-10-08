import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// Relative base so the built site works from any sub-path (GitHub Pages, a folder, etc.).
export default defineConfig({
  base: './',
  plugins: [svelte()],
});
