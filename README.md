# Red Horizon

**Every choice counts. Every decision teaches.** Red Horizon is a browser-based Mars mission trainer for junior astronauts, built with Phaser 3 and Vite. It uses original vector-style art drawn in Phaser, so no external image assets or API data are needed.

## Run locally

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Create a production build with `npm run build`, and preview it with `npm run preview`.

Run the resource decision checks with `npm test`.

## Play

Start a mission from the main menu, read or skip each typed dialogue line, then choose one of two responses. Each response lowers exactly one assigned resource by 15 percentage points. Resources carry over through all three missions; there is no resource-based game over. Each decision is followed by a consequence and a NASA science lesson with source links. Play Again starts a fresh playthrough.

## Audio recordings

Audio playback is optional and missing files never prevent play. Put recorded dialogue under `public/assets/audio/voice-over/astro/`, `junior-commander/`, or `captain-nova/`; music and effects can go under `music/` and `sound-effects/`. Dialogue data already has stable keys for the prologue and mission intros/outcomes. Register the clips that have been recorded in a Phaser preload scene, then call `AudioManager.playVoice(key)` for the matching line. `playMusic(key)` and `playEffect(key)` provide optional music/effect playback. Voice, music, and effects can be muted independently. Missing keys are skipped. No generated voice files are included.

## Project structure

- `src/game/data/missions.js` — mission text, choices, resource costs, and science sources.
- `src/game/systems/ResourceManager.js` — bounded, persistent resource state.
- `src/game/systems/AudioManager.js` — optional non-overlapping voice playback and audio controls.
- `src/game/components/` — Phaser-drawn character portraits and resource HUD.
- `src/game/scenes/RedHorizonScene.js` — menus, prologue, mission scenes, decision feedback, lessons, and report.
- `public/assets/` — reserved for future original/appropriately licensed art and team recordings.

## Credits and data

All current illustrations are original Phaser Graphics drawings. The science lesson reference links are educational sources, not live API integrations. Only add audio/image assets whose licences permit the intended use.
