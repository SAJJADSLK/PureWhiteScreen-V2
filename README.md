# Pure White Screen

48 free browser-based tools (colors, lighting scenes, timers and clocks, noise generators, calibration, effects, image tools) plus 8 guides. React 19 + Vite + Tailwind v4. No backend.

## Run
```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # vite build + prerender (static HTML per page + sitemap.xml)
npm run test:smoke # needs `npx vite preview --port 4173` running; set CHROMIUM_PATH if needed
```

## Deploy (Vercel)
Import the repo. `vercel.json` sets the build and SPA fallback.

Optional environment variables:
- `VITE_CONTACT_EMAIL` - shown on the Contact page (default `contact@purewhitescreen.online`; change it).
- `VITE_ADSENSE_BANNER_SLOT` - AdSense ad-unit ID for the banner under the tools.

AdSense loads only after a visitor clicks Accept in the cookie banner.

## Adding a tool
1. Simple screen or color page: add an entry to `src/lib/toolsData.js` with `file: 'ScreenTool'` and a `preset` (mode, color or temp, brightness). No new component needed.
2. Custom tool: create `src/pages/tools/MyTool.jsx` (default export) and add an entry with `file: 'MyTool'`. `src/components/ToolShell.jsx` gives you fullscreen, auto-hiding controls and the F key.
3. Add help text in `src/lib/toolContentNew.js` (how-to, uses, FAQ).

Guides live in `src/content/guides.js`.
Routing, navigation, home grid, search, sitemap and prerendered page are generated from those two files.

## Notes
- Settings for several tools are remembered in localStorage (`usePersistedState`).
- Tools keep the screen awake (Wake Lock API) and the site is installable (PWA: `public/manifest.webmanifest`, `public/sw.js`).
- Ambient sound is synthesized with the Web Audio API (`src/lib/ambientAudio.js`); no audio files.
