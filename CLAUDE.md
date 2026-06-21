# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

An interactive HTML5 canvas portfolio rendered as a top-down 2D village. Visitors control a sprite that walks around the overworld and presses **E** in front of a building to **warp into that building's interior scene** (Pokémon-style, with a fade + location banner). Inside, they press **E** on furniture/objects and **talk to NPCs** to surface portfolio content in a dialogue modal, and walk onto the **EXIT** mat to leave. NPCs scattered across town are real-life easter eggs. Plain-résumé fallback lives at `#resume` for recruiters who don't want to play.

Vanilla HTML/CSS/JS only — **no build step, no framework, no npm dependencies**. The site is served directly from the repo root by GitHub Pages.

## Run / develop

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

`file://` won't work — ES modules require an HTTP origin.

There is no test suite, no linter, no bundler. Verification is manual: load the page, enter every building, press E on objects/NPCs, walk onto the EXIT mat to return, check `#resume` fallback, check the console for errors.

Two cheap checks worth running after editing the world (Node only, no browser): syntax-check every module with `for f in $(find js -name '*.js'); do node --check --input-type=module < "$f"; done`, and validate scene data (map dimensions, placement, BFS reachability of every door/asset/NPC) by importing `js/content/scenes.js` + `js/world/{map,grid,tiles}.js` in a throwaway `.mjs` (drop a temporary `{"type":"module"}` package.json so Node treats the `.js` files as ES modules, then delete it).

## Architecture

**Entrypoint**: `index.html` loads `js/main.js` as an ES module. `main.js` wires the engine, world, entities, and UI together — every other module is a leaf with a single responsibility.

**Scene system (the core abstraction)**: the world is a set of **scenes** — one overworld plus one interior per building — all defined as data in `js/content/scenes.js`. `js/world/scene.js` has two parts: `buildScene(def)` turns a scene definition into a live runtime (parsed map, collision grid, instantiated objects/NPCs/portals, depth-sorted render), and `createWorld(...)` is the **manager** that owns the active scene, animates fade transitions, and keeps a **return stack** so an interior's EXIT drops the player back exactly where they entered (supports arbitrarily nested interiors). The player object persists across scenes; only its position is reset (`player.placeAt`) on each load.

**Coordinate system**: world coordinates in pixels. Each scene's map is a tile grid (**64-px tiles**, modeled on the Nintendo DS Pokémon games), authored in `js/content/scenes.js` as character art and parsed by `js/world/map.js` (`parseMap`). Tiles are encoded **one base-36 character per tile** (`0-9` then `a,b,c…`) so we can address >10 tile types; see the legend in `scenes.js` and the enum in `js/world/tiles.js`. The camera (`js/engine/camera.js`) clamps to map bounds and rounds to integer px; when a map is smaller than the viewport (interiors) it **centers** that axis instead of clamping. The canvas is `1024×576` (16×9 tiles visible).

**Game loop**: `js/engine/loop.js` runs a fixed-timestep update (60 Hz) with variable render. `main.js` provides `update(dt)` and `render()` callbacks.

**Input**: `js/engine/input.js` normalizes keys into semantic actions (`up`/`down`/`left`/`right`/`interact`/`cancel`). Use `input.dir()` for grid movement (the most-recently-pressed held direction, 4-dir, or `null`) and `input.consumePressed("interact")` for one-shot events. Both WASD and arrows map to the same actions.

**Asset loading with placeholder fallback**: `js/engine/assets.js` is the *important* file. `loadImage(path)` returns `null` instead of throwing when a file is missing, and `drawSpriteOrPlaceholder(ctx, image, ...)` draws a colored labeled rectangle if `image` is `null`. This is why the game runs day-one with zero PNGs — King is drawing custom art later, and the fallback means visual progress isn't blocked by missing assets. **Preserve this contract** when adding new sprite-loading entities.

**Movement (grid-locked, Gen-IV Pokémon style)**: `js/entities/player.js` snaps to the tile grid and glides exactly one tile per step (`STEP_DURATION`). Tapping a direction turns in place (a `TURN_DELAY` window distinguishes a tap from a hold); holding walks continuously. No diagonals. The player tracks logical `tileX/tileY` plus an interpolated pixel `x/y` (top-left of the cell) used by the camera and the feet-y depth sort; `w/h` are one tile.

**Collision (tile-based, per scene)**: `js/world/grid.js` is a factory — `createGrid(tiles, w, h)` builds one boolean `solid` grid per scene, seeded from the map (tiles in `SOLID_TILES`: water, walls, hedges; bridges stay walkable). `buildScene` then stamps building footprints (`markSolidRect`), object bases, and NPC tiles (`markSolid`) into it. The player calls `scene.isWalkable(tx, ty)` before each step and **bumps** (stays put, keeps facing) when blocked or at the map edge. There is no global collision singleton.

**Entities & interaction**: three entity types live in `js/entities/`, all sharing the `facingTile` adjacency check in `interact.js`:
- `portal.js` — `kind:"building"` (overworld) warps into an interior when you stand on its door tile facing it and press E; `kind:"door"` (interior EXIT mat) warps back via `trigger:"step"` when walked onto. `to:"@back"` pops the return stack.
- `object.js` — furniture/decor drawn from a vector-art `DEFS` registry (authored in 32-unit space, scaled to `TILE`). One-tile solid base; art may extend upward (walk behind it). Give an object `content` to make it readable on E; otherwise it's pure decoration.
- `npc.js` — villagers with an idle bob, interactable from any side; they turn to face you and open their dialogue. These are the real-life easter eggs.

`main.js` finds the interactable in front via `scene.interactableInFront(player)` and calls `entity.activate({ world, dialogue, player })` — portals trigger a scene change, objects/NPCs open the dialogue.

**Rendering order**: per scene, tiles → all standing entities (portals, objects, NPCs, player) sorted by `y + h` (feet-y) → fade overlay. The feet-y sort gives fake 2.5D depth so the player can stand "in front of" or "behind" things.

**Dialogue**: object/NPC `content` is structured blocks (`text` / `list` / `link` / `kv`) rendered by `js/ui/dialogue.js` — extend content types by adding a case to `renderBlocks()`. `js/ui/banner.js` flashes the scene name on entry.

**Résumé escape hatch**: pure CSS routing. `<section id="resume">` is hidden until the URL hash is `#resume`, at which point `body:has(#resume:target)` selectors hide the game and show the section. No JS routing — this stays robust if the canvas code breaks.

## Editing common things

Everything about the world lives in `js/content/scenes.js`.

| Want to... | Edit |
|---|---|
| Change what an asset/NPC says | `js/content/scenes.js` — find it and edit its `content.blocks` (the five marquee assets carry the real bio; everything else is a `placeholder`/`mystery`) |
| Add an interactable object | `js/content/scenes.js` — push `{ type, tx, ty, name, content }` to a scene's `objects` (omit `content` for pure decor) |
| Add an NPC (easter egg) | `js/content/scenes.js` — push `{ tx, ty, name, facing, palette, content }` to a scene's `npcs` |
| Add a new building + interior | `js/content/scenes.js` — add a `kind:"building"` portal to `village.portals` with `to:"<newId>"`, then add a `<newId>` scene (copy `woodRoom`/`tileRoom`, give it an `EXIT_DOOR`) |
| Reshape a map | `js/content/scenes.js` — edit the scene's `map` strings (one base-36 char per tile; keep rows equal length) |
| Add a furniture/decor shape | `js/entities/object.js` — add a `DEFS` entry (32-unit vector art) |
| Add a new tile type | `js/world/tiles.js` — add to enum `T`, `COLORS`, `drawTile`, and `SOLID_TILES` if it should block movement |
| Change theme colors | CSS variables at the top of `css/style.css` |
| Edit the plain-résumé view | `index.html` — the `<section id="resume">` block |

Note: `scripts/map_to_png.py` / `png_to_map.py` predate the base-36 / multi-tile map format and the move of maps into `scenes.js`; they need updating before reuse.

## Constraints worth remembering

- **No frameworks.** If a problem feels like it needs React/Vue/etc., it doesn't — the surface area is small enough that vanilla DOM + canvas wins.
- **Sprites are optional, always.** Any code that loads images must use `loadImage` + `drawSpriteOrPlaceholder`. Never throw when a PNG is missing.
- **Keyboard-first.** The village is unplayable on mobile/touch by design — mobile users get the résumé view automatically (eventually via a viewport-width check; for now via the corner link).
- **Content lives in data, not markup.** The whole world — maps, objects, NPCs, and their copy — is in `js/content/scenes.js`, not in HTML or engine modules. Keep it that way so editing the world doesn't require touching engine code.
