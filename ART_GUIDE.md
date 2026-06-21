# Art Guide

This is the visual playbook for VillagePortfolio. Read this before you start drawing — the order and constraints here are what separate "8-bit pixel art" from "blurry colored squares."

## 1. Pick a tool (Linux)

| Tool | Cost | Notes |
|---|---|---|
| **Aseprite** | $20 | Industry standard. Best timeline + animation tools. Buy once you know you'll keep at it. |
| **Libresprite** | Free | Fork of an older Aseprite. In `apt`. ~90% of what you need. Good place to start. |
| **Piskel** | Free | Browser-based, zero install. Easiest to try right now. |

## 2. Pick a palette FIRST — before any drawing

This is the single biggest decision. Constrain yourself to ~16 colors and use **only** those across every sprite. Pin the palette as a swatch in your editor so you literally can't pick anything else.

Two solid defaults:

- **PICO-8 (16 colors)** — extremely cohesive, classic-feeling.
- **DawnBringer 16** — slightly more painterly, popular in indie games.

Discipline beats variety. A scene drawn from 16 colors will look more "real" than one drawn from 256.

## 3. Size reference — 64-px world

The world runs on a **64×64 base tile**, modeled on the Nintendo DS Pokémon games
(Diamond/Pearl/Platinum). Draw at these exact sizes — 4× the pixels of the old 32-px
scaffold, so there's room for real detail:

| Asset | Size | Notes |
|---|---|---|
| Tile | 64×64 | one grid cell |
| Player | 48×64 | feet-anchored; can overhang taller if you want a bigger head |
| Building | 192×128 | 3×2 tiles |
| Garden | 256×128 | 4×2 tiles |

These are "modern pixel art" proportions (Stardew / DS-Pokémon territory) — easy to draw
recognizable faces, signs, and texture.

Engine constants, if you ever want to rescale again:

- `js/world/tiles.js` → `TILE`
- `js/entities/player.js` → `DRAW_W`, `DRAW_H`, plus `STEP_DURATION` / `TURN_DELAY` (walk feel)
- `js/content/buildings.js` → each building's `w`, `h` (in multiples of `TILE`)
- `index.html` → canvas `width`/`height` (controls how many tiles are visible on screen)

## 4. Drawing order — for fastest visible payoff

Don't try to draw everything at once. Go in this order:

1. **`player_down.png`** (48×64) — one sprite, immediate gratification. Reload and the pink rectangle is gone. Confirms the fallback → real-art swap is working.
2. **Other three player facings** (`up`, `left`, `right`). Left/right are mirrored, so it's really only one new drawing.
3. **`player.png` walk sheet** — once the four facings look right, combine them into the 3×4 animated sheet (see `assets/sprites/README.md`) to get the Pokémon walk cycle. The sheet takes priority over the static PNGs.
4. **One building** (`building_home.png`). Now you can see how player + building read together visually.
5. **The remaining four buildings.**
6. **Tiles last** — grass, path, water, flower variants. These are subtle; do them once your palette and style are locked in from the sprites.

## 5. Export rules

- **Format:** PNG with transparent background.
- **Size:** the exact pixel dimensions from `assets/sprites/README.md`. No padding, no scaling.
- **Don't draw at 4× and downscale.** Draw at the actual target size from the start. Downscaling muddies pixel edges.
- **Save into `assets/sprites/`** with the exact filenames the engine expects.

## 6. Iteration loop

Keep two windows open side by side:

- `http://localhost:8000` (the game)
- Your editor (Libresprite / Aseprite / Piskel)

Save the PNG → <kbd>Ctrl+Shift+R</kbd> in the browser → see it. Tight feedback loop is the whole point.

## 7. Animation (already supported)

The engine **already** does walk-cycle animation — you just need to supply the art. Drop a
`player.png` sheet laid out as **3 columns (stand / step A / step B) × 4 rows (down, left,
right, up)** and the player animates while walking and stands still when idle. Full spec and
an ASCII layout are in `assets/sprites/README.md`.

No code changes needed. If `player.png` is absent the engine falls back to the four static
facings, and if those are missing too, to the placeholder rectangle — so the game always runs.
Treat the sheet as a polish pass: get the four static facings looking right first, then combine
them into the sheet.
