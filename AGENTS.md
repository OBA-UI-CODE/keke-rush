# AGENTS.md

Instructions for coding agents working on Keke Rush, a competitive Three.js arcade game set on an Isolo-to-Ikotun-inspired route.

## Product goal

The core fantasy is driving a Nigerian keke from Isolo to Ikotun while competing for the fastest valid trip. A valid finish requires all three passenger seats to be occupied. Preserve that rule in every game mode.

The first release is a lightweight browser game that works on desktop and mobile. Prefer a polished, reliable core loop over open-world scope or simulation-level realism.

## Commands

Use pnpm through Corepack because a global pnpm installation is not required.

```powershell
corepack pnpm install
corepack pnpm dev
corepack pnpm check
corepack pnpm build
corepack pnpm preview
```

Run `corepack pnpm build` before declaring work complete. It includes strict TypeScript checking and a production Vite build.

## Technology

- Vite
- TypeScript with strict mode
- Three.js
- Plain HTML and CSS for the interface
- Browser `localStorage` for MVP identity and personal-best persistence

Do not introduce a UI framework, physics engine, backend, or state-management library without a feature that clearly requires it.

## Repository layout

| Path | Purpose |
| --- | --- |
| `index.html` | Accessible interface shell, HUD, menus and touch controls |
| `src/main.ts` | Current scene, entities, input, race state and game loop |
| `src/style.css` | Responsive visual system and HUD styling |
| `public/` | Future models, textures and audio assets |
| `dist/` | Generated production output; never commit it |

As the game grows, extract cohesive systems from `src/main.ts` into `src/game/`, `src/entities/`, `src/systems/`, `src/api/` and `src/types/`. Avoid premature one-class-per-file abstractions.

## Gameplay invariants

- A keke has exactly three passenger seats in the primary game mode.
- Reaching Ikotun without three passengers is not a valid win.
- A passenger boards only while the keke is sufficiently close and nearly stopped.
- Passenger load may affect handling, but controls must remain responsive.
- Collisions should penalize time or speed; they should not normally end a run instantly.
- A complete run should remain understandable without external instructions.
- Keyboard and touch users must have equivalent access to required actions.

When changing movement constants, test the entire route and all pickup locations. Never make a required pickup unreachable at the current steering or braking limits.

## Start.ng integration

Start.ng does not currently expose a verified public character API. Keep player identity behind a replaceable adapter rather than coupling game systems directly to `localStorage`.

The intended boundary is:

```text
Game → CharacterService → LocalCharacterService
                        → StartNgCharacterService (when available)
```

Do not invent or hardcode an undocumented Start.ng endpoint. Do not ship API secrets in the browser. If a future API requires a secret, call it through a server-side endpoint.

## Code conventions

- Keep TypeScript strict and avoid `any`.
- Use descriptive names for gameplay state and constants.
- Keep frame-rate-dependent movement multiplied by `delta`.
- Clamp large frame deltas so tab switches do not launch the vehicle forward.
- Reuse geometries and materials where practical.
- Pool frequently spawned objects instead of allocating them every frame.
- Dispose of replaced Three.js geometries, materials and textures.
- Keep DOM lookups and UI updates outside hot loops when possible.
- Use semantic HTML and accessible names for interactive controls.
- Respect `prefers-reduced-motion` when adding nonessential interface motion.

## Visual direction

Use an original, stylized low-poly interpretation of Lagos rather than copying real businesses, protected branding or another game's assets. The palette should stay warm, lively and readable against the road. Gameplay objects must be recognizable at driving speed.

Use original assets or assets whose licenses permit redistribution. Record third-party attribution in the README before committing an asset.

## Performance targets

- Aim for 60 FPS on an average laptop and at least 30 FPS on a mid-range phone.
- Cap renderer pixel ratio rather than rendering unrestricted device resolution.
- Keep the initial compressed download small; measure before adding large GLB, audio or texture files.
- Prefer instancing or merged static geometry for repeated scenery.
- Avoid per-frame DOM creation and unnecessary temporary Three.js objects.

## Persistence

Current storage keys use the `keke-rush-` prefix. Preserve backward compatibility when renaming stored data or add an explicit migration. Treat local storage as unavailable: privacy settings and embedded browsers may reject it, so gameplay must still function when reads or writes fail.

Do not store credentials, sensitive personal data or access tokens in committed files.

## Testing and verification

For every gameplay change, verify:

1. The start screen accepts a valid driver name and rejects an empty one.
2. Keyboard controls work.
3. Touch controls expose every required action.
4. All three passengers can be boarded.
5. An incomplete passenger load produces an invalid finish.
6. A full passenger load produces a valid finish.
7. Pause and resume do not advance the timer unexpectedly.
8. Refreshing restores the local player name and best time when storage is available.
9. `corepack pnpm build` succeeds.

Add automated tests when logic is extracted into testable modules. Keep rendering checks separate from deterministic race and scoring logic.

## Git workflow

- Work in focused commits with Conventional Commit messages.
- Do not commit `node_modules/`, `dist/`, `.env` files or generated caches.
- Do not rewrite or discard user changes.
- Review `git diff` and `git status` before committing.
- Push only after the production build succeeds.

Examples:

```text
feat: add recorded ghost competitor
fix: require full passenger load at finish
refactor: extract race state from render loop
docs: document character service contract
```
