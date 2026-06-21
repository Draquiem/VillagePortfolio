import { parseMap } from "./map.js";
import { createGrid } from "./grid.js";
import { TILE, drawTile } from "./tiles.js";
import { createObject } from "../entities/object.js";
import { createNpc } from "../entities/npc.js";
import { createPortal } from "../entities/portal.js";
import * as Banner from "../ui/banner.js";

// Builds a live scene runtime from a scene definition (see content/scenes.js):
// parses the map, seeds collision, instantiates objects / NPCs / portals, and
// stamps their footprints as solid.
export function buildScene(def) {
  const map = parseMap(def.map);
  const grid = createGrid(map.tiles, map.w, map.h);

  const objects = (def.objects || []).map(createObject);
  const npcs = (def.npcs || []).map(createNpc);
  const portals = (def.portals || []).map(createPortal);

  for (const p of portals) if (p.footprint) grid.markSolidRect(p.footprint.tx, p.footprint.ty, p.footprint.w, p.footprint.h);
  for (const o of objects) if (o.solid) grid.markSolid(o.tx, o.ty);
  for (const n of npcs) grid.markSolid(n.tx, n.ty);

  const interactables = [...portals, ...objects, ...npcs].filter((e) => typeof e.isPlayerInZone === "function");
  const stepPortals = portals.filter((p) => p.trigger === "step");

  return {
    id: def.id,
    name: def.name,
    bg: def.bg ?? "#0f0e17",
    map,
    spawns: def.spawns || {},
    objects, npcs, portals,
    bounds: map.pixelBounds,

    isWalkable(tx, ty) { return grid.isWalkable(tx, ty); },

    interactableInFront(player) {
      for (const e of interactables) if (e.isPlayerInZone(player)) return e;
      return null;
    },
    stepPortalAt(tx, ty) {
      for (const p of stepPortals) if (p.tx === tx && p.ty === ty) return p;
      return null;
    },

    render(ctx, camera, canvas, player) {
      ctx.fillStyle = this.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const startX = Math.max(0, Math.floor(camera.x / TILE));
      const endX = Math.min(map.w, Math.ceil((camera.x + canvas.width) / TILE));
      const startY = Math.max(0, Math.floor(camera.y / TILE));
      const endY = Math.min(map.h, Math.ceil((camera.y + canvas.height) / TILE));
      for (let ty = startY; ty < endY; ty++) {
        for (let tx = startX; tx < endX; tx++) {
          drawTile(ctx, map.tiles[ty][tx], tx * TILE - camera.x, ty * TILE - camera.y);
        }
      }

      // depth-sort all standing entities (incl. the player) by feet-y
      const ents = [...portals, ...objects, ...npcs, player].sort((a, b) => (a.y + a.h) - (b.y + b.h));
      for (const e of ents) e.render(ctx, camera);
    },
  };
}

// The world manager owns the active scene and animates fade transitions between
// scenes. A return stack lets interior exits drop the player back exactly where
// they entered, so buildings can be nested arbitrarily deep.
const FADE_TIME = 0.26; // seconds for each half of a transition

export function createWorld(registry, startId, startSpawn, player, camera) {
  let current = null;
  const stack = [];
  let fade = 0;   // 0 = clear, 1 = full black
  let dir = 0;    // +1 fading out, -1 fading in, 0 idle
  let pending = null;

  function resolveSpawn(scene, spawn) {
    let s = typeof spawn === "string" ? scene.spawns[spawn] : spawn;
    return s || scene.spawns.default || { tx: 1, ty: 1, facing: "down" };
  }

  function doLoad({ sceneId, spawn, facing }) {
    const def = registry[sceneId];
    if (!def) throw new Error(`Unknown scene: ${sceneId}`);
    current = buildScene(def);
    const s = resolveSpawn(current, spawn);
    player.placeAt(s.tx, s.ty, facing || s.facing || "down");
    camera.follow(player, current.bounds);
    Banner.show(current.name);
  }

  doLoad({ sceneId: startId, spawn: startSpawn });

  const world = {
    get scene() { return current; },
    get transitioning() { return dir !== 0; },

    enter(sceneId, spawn, facing, push = false) {
      if (dir !== 0) return;
      if (push) stack.push({ sceneId: current.id, tx: player.tileX, ty: player.tileY, facing: player.facing });
      pending = { sceneId, spawn, facing };
      dir = 1;
    },
    back() {
      if (dir !== 0) return;
      const r = stack.pop();
      pending = r
        ? { sceneId: r.sceneId, spawn: { tx: r.tx, ty: r.ty }, facing: r.facing }
        : { sceneId: startId, spawn: startSpawn };
      dir = 1;
    },
    trigger(portal) {
      if (portal.to === "@back") this.back();
      else this.enter(portal.to, portal.toSpawn, portal.toFacing, true);
    },

    update(dt) {
      if (dir === 0) return;
      fade += (dt / FADE_TIME) * dir;
      if (dir > 0 && fade >= 1) {
        fade = 1;
        doLoad(pending);
        pending = null;
        dir = -1;
      } else if (dir < 0 && fade <= 0) {
        fade = 0;
        dir = 0;
      }
    },
    renderOverlay(ctx, canvas) {
      if (fade <= 0) return;
      ctx.fillStyle = `rgba(8,7,12,${Math.min(1, fade)})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
  };
  return world;
}
