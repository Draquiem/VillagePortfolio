// Parses a hand-authored tile map into a usable grid.
//
// A map is an array of equal-length strings, one character per tile, encoded in
// base-36 so we can address >10 tile types: digits 0-9, then letters a, b, c...
// See the tile legend in content/scenes.js and the enum in tiles.js.
import { TILE } from "./tiles.js";

export function parseMap(RAW) {
  const tiles = RAW.map((row) => row.split("").map((ch) => parseInt(ch, 36)));
  const h = tiles.length;
  const w = tiles[0].length;
  return {
    tiles,
    w,
    h,
    pixelBounds: { w: w * TILE, h: h * TILE },
  };
}
