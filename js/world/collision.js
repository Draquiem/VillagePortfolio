// Tile-based walkability — the single source of truth for grid movement.
//
// Built once from the map (water is solid; everything else walkable, so bridges
// over water stay crossable). main.js then stamps building footprints and prop
// base tiles as solid via markSolid / markSolidRect after those entities exist.
import { tiles, MAP_W, MAP_H } from "./map.js";
import { T } from "./tiles.js";

const solid = Array.from({ length: MAP_H }, (_, ty) =>
  Array.from({ length: MAP_W }, (_, tx) => tiles[ty][tx] === T.WATER)
);

export function markSolid(tx, ty) {
  if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return;
  solid[ty][tx] = true;
}

// Stamp a w×h rectangle of tiles (tile coords) as solid.
export function markSolidRect(tx, ty, w, h) {
  for (let y = ty; y < ty + h; y++) {
    for (let x = tx; x < tx + w; x++) markSolid(x, y);
  }
}

export function isWalkable(tx, ty) {
  if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return false;
  return !solid[ty][tx];
}
