# Keke Rush

A competitive Three.js arcade game set on an Isolo-to-Ikotun-inspired route. Race to the destination, but do not arrive empty: the first driver to reach Ikotun with all three passenger seats filled wins.

## Run locally

```bash
corepack pnpm install
corepack pnpm dev
```

Create a production build with `corepack pnpm build`.

## Controls

- `W` / `Arrow Up`: accelerate
- `S` / `Arrow Down`: brake
- `A D` / arrow keys: steer
- `E`: board a passenger while stopped in a pickup zone
- `P` / `Escape`: pause

Touch controls appear automatically on smaller screens.

## Current milestone

- Procedural low-poly Three.js environment
- Arcade keke driving and follow camera
- Three passenger pickup zones
- Three-seat capacity and boarding interaction
- Isolo start and Ikotun finish validation
- Local player identity and best-time persistence
- Responsive keyboard and touch controls
