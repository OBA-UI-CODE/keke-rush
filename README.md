# Keke Rush

A competitive Three.js arcade game set on an Isolo-to-Ikotun-inspired route. Race to the destination, but do not arrive empty: the first driver to reach Ikotun with all three passenger seats filled wins.

## Run locally

```bash
corepack pnpm install
corepack pnpm dev
```

Run all verification with:

```bash
corepack pnpm test
corepack pnpm build
corepack pnpm test:e2e
```

## Controls

- `W` / `Arrow Up`: accelerate
- `S` / `Arrow Down`: brake
- `A D` / arrow keys: steer
- `E`: board a passenger while stopped in a pickup zone
- `P` / `Escape`: pause

Touch controls appear automatically on smaller screens.

## Features

- Procedural low-poly Three.js environment
- Arcade keke driving and follow camera
- Three passenger pickup zones
- Three-seat capacity and boarding interaction
- Isolo start and Ikotun finish validation
- Local player identity and best-time persistence
- Responsive keyboard and touch controls
- Oncoming traffic and pothole hazards
- Collision slowdown and time penalties
- Live speed and vehicle-status display
- Best valid run recording and translucent ghost replay
- Live lead-distance comparison against the player's ghost
- Deterministic player recognition with persistent driver and keke styling
- Optional Start.ng character API adapter with automatic local fallback
- Persistent local top-five leaderboard
- Procedural engine, pickup, collision and finish audio
- Automated race-rule, character, leaderboard and browser-flow tests

## Game rules

1. Start in Isolo with an empty three-seat keke.
2. Stop beside a waiting passenger and hold the pickup control until boarding completes.
3. Avoid traffic and potholes, which reduce speed and add time penalties.
4. Reach Ikotun with exactly three passengers to record a valid finish.

Crossing the finish without a full passenger load ends the attempt as an invalid run.

## Start.ng character integration

The public Start.ng site does not currently publish a verified character API contract. Keke Rush therefore uses a replaceable `CharacterService` boundary:

```text
Game → StartNgCharacterService → LocalCharacterService fallback
```

Without configuration, the local service recognizes returning players through an anonymous browser ID and recreates the same character appearance on every visit.

When a compatible endpoint becomes available, copy `.env.example` to `.env` and set:

```text
VITE_STARTNG_CHARACTER_API_URL=https://example.com/api/characters/me
```

The request includes browser credentials and an `X-Player-Id` header. The endpoint should return:

```json
{
  "id": "player-id",
  "displayName": "Tolu",
  "driverStyle": "Road Captain",
  "primaryColor": "#f3c32e",
  "secondaryColor": "#17211c",
  "kekePattern": "Sunburst",
  "source": "startng"
}
```

Invalid responses or unavailable endpoints fall back to the local character without preventing gameplay. Do not expose secret API credentials through `VITE_*` variables.
