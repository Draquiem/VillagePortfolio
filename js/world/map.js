// Hand-authored tile map. 30 wide x 20 tall = 960 x 640 px.
// Tile legend:
//   0 grass · 1 grass_dark · 2 path · 3 water · 4 flower
//   5 sand  · 6 stone      · 7 bridge
import { TILE, T } from "./tiles.js";

// prettier-ignore
const RAW = [
  "001000000040000000004000000010", //  0
  "001110000000111100000111000040", //  1  grass_dark clusters mark prop spots
  "001110002220111100222111000000", //  2  approach paths thread between them
  "000000022200000000022200000000", //  3  ← Home(4-6) & Workshop(22-24) sit here
  "000040022000040040020022000400", //  4
  "002222222200002222220022222200", //  5  walkway in front of Home & Workshop
  "000000022222002222000222000000", //  6  paths bend inward toward plaza
  "000040000022200200022200000400", //  7
  "000000000022000000022000000000", //  8  ← Garden(13-16) here
  "000000005666666666666660005000", //  9  stone plaza with sand fringe
  "000000005666666666666660005000", // 10  Garden door zone (cols 13-16)
  "005000005666666666666660005000", // 11
  "053000000022222222220000003000", // 12  paths drop from plaza
  "053500000022000040022000005350", // 13  ← Library(4-6) & Post Office(22-24)
  "033500000022000400022000035500", // 14
  "002222222200000044000022222200", // 15  walkway in front of Library & Post
  "000005550000004444000055500000", // 16  sand patches + flower bed
  "001005533300044444400035550010", // 17  sand bordering a small stream
  "000400003333344444433330004000", // 18  stream curves along the bottom
  "011110000033333333333000011110", // 19  flower beds at corners
];

export const MAP_W = RAW[0].length;
export const MAP_H = RAW.length;

export const tiles = RAW.map(row => row.split("").map(Number));

export const mapPixelBounds = {
  w: MAP_W * TILE,
  h: MAP_H * TILE,
};

export function isWaterAt(px, py) {
  const tx = Math.floor(px / TILE);
  const ty = Math.floor(py / TILE);
  if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return true;
  return tiles[ty][tx] === T.WATER;
}
