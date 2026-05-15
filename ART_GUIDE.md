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

## 3. Size decision — current vs strict 8-bit

The scaffold ships with these sizes:

| Asset | Current | Strict 8-bit (NES-era) |
|---|---|---|
| Tile | 32×32 | 16×16 |
| Player | 24×28 | 16×16 |
| Building | 96×64 (3×2 tiles) | 48×32 (3×2 tiles) |

**Current sizes** = "modern pixel art" (Stardew Valley territory). Easier to draw recognizable detail.

**Strict 8-bit** = chunkier, more authentic, harder to draw faces or text but more unmistakably retro.

If you want to switch to strict 8-bit, the engine constants live in:

- `js/world/tiles.js` → `TILE`
- `js/entities/player.js` → `W`, `H`
- `js/content/buildings.js` → each building's `w`, `h` (in multiples of `TILE`)

## 4. Drawing order — for fastest visible payoff

Don't try to draw everything at once. Go in this order:

1. **`player_down.png`** — one sprite, immediate gratification. Reload and the pink rectangle is gone. Confirms the fallback → real-art swap is working.
2. **Other three player facings** (`up`, `left`, `right`). Left/right are mirrored, so it's really only one new drawing.
3. **One building** (`building_home.png`). Now you can see how player + building read together visually.
4. **The remaining four buildings.**
5. **Tiles last** — grass, path, water, flower variants. These are subtle; do them once your palette and style are locked in from the sprites.

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

## 7. Animation (later, not v0)

The engine currently loads one static image per direction. When you want walk-cycle animations, that requires:

- A horizontal sprite-sheet strip per direction (e.g., 4 frames of 24×28 = 96×28 image).
- A small update to `js/engine/assets.js` and `js/entities/player.js` to track frame index and slice from the sheet.

Don't worry about this until you have all the static art. Walking animations are a polish pass, not a blocker.
