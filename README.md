# Abu Naser MD. Arman — Retro OS Resume

An interactive, CRT-green "retro operating system" resume built with Svelte 5, TypeScript and Vite.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run check    # type + a11y checks
npm run build    # static site in dist/
npm run preview  # serve the build locally
```

`dist/` is fully static and uses relative paths, so it can be hosted anywhere (GitHub Pages, Netlify, a folder on a server).

## Using it

- Double-click a desktop icon (tap on mobile), or press **1–8** to open a window.
- **Esc** closes the focused window; drag windows by their title bar.
- **START** menu: all files, résumé viewer, sound toggle and reboot.
- The **PDF** button (also in START and contact.exe) opens `public/Abu_Naser_Arman_Resume.pdf` in the browser's PDF viewer in a new tab.

## Editing content

All resume content lives in `src/lib/resume.ts`. Desktop icons and window sizes are in `src/lib/apps.ts`. See `resume.md` for the full build guide.
