# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

An interactive HTML5 canvas portfolio rendered as a top-down 2D village. Visitors control a sprite that walks around and presses **E** in front of buildings to surface portfolio content (about, projects, résumé, contact) in a dialogue modal. Plain-résumé fallback lives at `#resume` for recruiters who don't want to play.

Vanilla HTML/CSS/JS only — **no build step, no framework, no npm dependencies**. The site is served directly from the repo root by GitHub Pages.

## Run / develop

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

`file://` won't work — ES modules require an HTTP origin.

There is no test suite, no linter, no bundler. Verification is manual: load the page, walk around, press E on every building, check `#resume` fallback, check the console for errors.

## Architecture

**Entrypoint**: `index.html` loads `js/main.js` as an ES module. `main.js` wires the engine, world, entities, and UI together — every other module is a leaf with a single responsibility.

**Coordinate system**: world coordinates in pixels. The map is a `MAP_W × MAP_H` tile grid (32-px tiles), defined in `js/world/map.js` as character art (`"00022200..."`). The camera (`js/engine/camera.js`) translates world → screen and clamps to map bounds.

**Game loop**: `js/engine/loop.js` runs a fixed-timestep update (60 Hz) with variable render. `main.js` provides `update(dt)` and `render()` callbacks.

**Input**: `js/engine/input.js` normalizes keys into semantic actions (`up`/`down`/`left`/`right`/`interact`/`cancel`). Use `input.axis()` for movement, `input.consumePressed("interact")` for one-shot events. Both WASD and arrows map to the same actions.

**Asset loading with placeholder fallback**: `js/engine/assets.js` is the *important* file. `loadImage(path)` returns `null` instead of throwing when a file is missing, and `drawSpriteOrPlaceholder(ctx, image, ...)` draws a colored labeled rectangle if `image` is `null`. This is why the game runs day-one with zero PNGs — King is drawing custom art later, and the fallback means visual progress isn't blocked by missing assets. **Preserve this contract** when adding new sprite-loading entities.

**Collision**: simple AABB. Buildings have a solid bounding rect plus an `interactZone` rectangle in front of the door. The player checks both for overlap each frame (player.js does the solid check, main.js loops buildings for the interact-zone check). Water tiles are also solid — `isWaterAt(px, py)` in `map.js` checks at four corners of the player's hitbox.

**Rendering order**: tiles → entities sorted by `y + h` (feet-y) → HUD. The feet-y sort gives fake 2.5D depth so the player can stand "in front of" or "behind" a building.

**Interaction → dialogue**: `js/content/buildings.js` defines each building's `content` as structured blocks (`text` / `list` / `link` / `kv`). `js/ui/dialogue.js` renders those blocks into the modal — extending content types means adding a case to `renderBlocks()`.

**Résumé escape hatch**: pure CSS routing. `<section id="resume">` is hidden until the URL hash is `#resume`, at which point `body:has(#resume:target)` selectors hide the game and show the section. No JS routing — this stays robust if the canvas code breaks.

## Editing common things

| Want to... | Edit |
|---|---|
| Change what a building says | `js/content/buildings.js` — find the building, edit its `content.blocks` |
| Add a new building | `js/content/buildings.js` — push a new object with `{id, label, x, y, w, h, doorSide, content}` |
| Reshape the map | `js/world/map.js` — edit the `RAW` string array (each digit = one tile) |
| Add a new tile type | `js/world/tiles.js` — add to enum `T`, `COLORS`, and `drawTile`. Update solidity in `player.js` if relevant |
| Change theme colors | CSS variables at the top of `css/style.css` |
| Edit the plain-résumé view | `index.html` — the `<section id="resume">` block |

## Constraints worth remembering

- **No frameworks.** If a problem feels like it needs React/Vue/etc., it doesn't — the surface area is small enough that vanilla DOM + canvas wins.
- **Sprites are optional, always.** Any code that loads images must use `loadImage` + `drawSpriteOrPlaceholder`. Never throw when a PNG is missing.
- **Keyboard-first.** The village is unplayable on mobile/touch by design — mobile users get the résumé view automatically (eventually via a viewport-width check; for now via the corner link).
- **Content lives in data, not markup.** Building content is in `js/content/buildings.js`, not in HTML or in the dialogue module. Keep it that way so editing copy doesn't require touching engine code.
