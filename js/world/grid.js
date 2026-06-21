// Tile-based walkability for one scene. Each scene builds its own grid from its
// parsed map; main.js then stamps building footprints, object bases, and NPC
// tiles as solid on top. Replaces the old singleton collision module.
import { SOLID_TILES } from "./tiles.js";

export function createGrid(tiles, w, h) {
  // seed solidity from the map itself (water, walls, hedges...)
  const solid = tiles.map((row) => row.map((t) => SOLID_TILES.has(t)));

  function inBounds(tx, ty) {
    return tx >= 0 && ty >= 0 && tx < w && ty < h;
  }

  return {
    w,
    h,
    markSolid(tx, ty) {
      if (inBounds(tx, ty)) solid[ty][tx] = true;
    },
    // Stamp a w×h rectangle of tiles (tile coords) as solid.
    markSolidRect(tx, ty, rw, rh) {
      for (let y = ty; y < ty + rh; y++) {
        for (let x = tx; x < tx + rw; x++) this.markSolid(x, y);
      }
    },
    isWalkable(tx, ty) {
      if (!inBounds(tx, ty)) return false;
      return !solid[ty][tx];
    },
  };
}
