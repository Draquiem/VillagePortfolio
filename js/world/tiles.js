export const TILE = 64;

// Tile enum. Map files (see content/scenes.js) encode one tile per character
// in base-36, so indices 0-9 use digits and 10+ use letters a, b, c, ...
export const T = {
  // outdoor
  GRASS: 0,
  GRASS_DARK: 1,
  PATH: 2,
  WATER: 3,
  FLOWER: 4,
  SAND: 5,
  STONE: 6,
  BRIDGE: 7,
  // interior
  FLOOR_WOOD: 8,
  FLOOR_TILE: 9,
  RUG: 10,        // 'a' — floor decal, drawn under entities
  WALL: 11,       // 'b' — solid
  WALL_DARK: 12,  // 'c' — solid (top wall accent)
  HEDGE: 13,      // 'd' — solid (outdoor + garden walls)
  DIRT: 14,       // 'e'
};

// Tiles that block movement. The grid (world/grid.js) seeds its solid map from
// this set; bridges stay walkable so they can cross water.
export const SOLID_TILES = new Set([T.WATER, T.WALL, T.WALL_DARK, T.HEDGE]);

const COLORS = {
  [T.GRASS]: "#4f9d3a",
  [T.GRASS_DARK]: "#3d7d2c",
  [T.PATH]: "#c9a86a",
  [T.WATER]: "#3a7ca5",
  [T.FLOWER]: "#4f9d3a",
  [T.SAND]: "#e7cf9e",
  [T.STONE]: "#9a958c",
  [T.BRIDGE]: "#7a4a22",
  [T.FLOOR_WOOD]: "#8a5a34",
  [T.FLOOR_TILE]: "#c9c3b6",
  [T.RUG]: "#7a3b63",
  [T.WALL]: "#7d6b57",
  [T.WALL_DARK]: "#5b4d3e",
  [T.HEDGE]: "#2f7d2a",
  [T.DIRT]: "#7c5a3a",
};

// Decorations below are authored in a 32-unit tile space and scaled up to the
// real TILE size, so the texturing stays proportional no matter how big TILE is.
export function drawTile(ctx, type, x, y) {
  ctx.fillStyle = COLORS[type] ?? "#000";
  ctx.fillRect(x, y, TILE, TILE);

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(TILE / 32, TILE / 32);

  // a tiny bit of texture so it doesn't look like flat blocks
  if (type === T.GRASS || type === T.GRASS_DARK) {
    ctx.fillStyle = type === T.GRASS ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.04)";
    ctx.fillRect(4, 4, 2, 2);
    ctx.fillRect(20, 14, 2, 2);
    ctx.fillRect(12, 24, 2, 2);
  }
  if (type === T.PATH) {
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(6, 10, 3, 3);
    ctx.fillRect(22, 22, 3, 3);
  }
  if (type === T.WATER) {
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(6, 12, 8, 2);
    ctx.fillRect(18, 22, 6, 2);
  }
  if (type === T.FLOWER) {
    ctx.fillStyle = "#e53170";
    ctx.fillRect(14, 14, 4, 4);
    ctx.fillStyle = "#ff8906";
    ctx.fillRect(6, 22, 3, 3);
  }
  if (type === T.SAND) {
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    ctx.fillRect(8, 6, 2, 2);
    ctx.fillRect(20, 18, 2, 2);
    ctx.fillRect(4, 24, 2, 2);
    ctx.fillRect(24, 10, 2, 2);
  }
  if (type === T.STONE) {
    // cobblestone — darker grout lines + lighter highlights
    ctx.strokeStyle = "rgba(0,0,0,0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 16); ctx.lineTo(32, 16);
    ctx.moveTo(10, 0); ctx.lineTo(10, 16);
    ctx.moveTo(22, 16); ctx.lineTo(22, 32);
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(2, 2, 6, 2);
    ctx.fillRect(12, 18, 6, 2);
  }
  if (type === T.BRIDGE) {
    // wooden planks — vertical strips with dark seams
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(0, 0, 32, 2);
    ctx.fillRect(0, 30, 32, 2);
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 6; i < 32; i += 8) {
      ctx.moveTo(i, 2); ctx.lineTo(i, 30);
    }
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(2, 6, 2, 20);
  }
  if (type === T.FLOOR_WOOD) {
    // horizontal planks with vertical seams offset per row
    ctx.strokeStyle = "rgba(0,0,0,0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 11); ctx.lineTo(32, 11);
    ctx.moveTo(0, 22); ctx.lineTo(32, 22);
    ctx.moveTo(16, 0); ctx.lineTo(16, 11);
    ctx.moveTo(8, 11); ctx.lineTo(8, 22);
    ctx.moveTo(24, 22); ctx.lineTo(24, 32);
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fillRect(0, 1, 32, 1);
  }
  if (type === T.FLOOR_TILE) {
    // checkered floor grid
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, 16, 16);
    ctx.fillRect(16, 16, 16, 16);
    ctx.strokeStyle = "rgba(0,0,0,0.10)";
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, 31, 31);
  }
  if (type === T.RUG) {
    // bordered rug with a center diamond
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 2;
    ctx.strokeRect(3, 3, 26, 26);
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.beginPath();
    ctx.moveTo(16, 8); ctx.lineTo(24, 16); ctx.lineTo(16, 24); ctx.lineTo(8, 16);
    ctx.closePath();
    ctx.fill();
  }
  if (type === T.WALL || type === T.WALL_DARK) {
    // brick courses with offset verticals + a lit top edge
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(0, 0, 32, 3);
    ctx.strokeStyle = "rgba(0,0,0,0.22)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 11); ctx.lineTo(32, 11);
    ctx.moveTo(0, 22); ctx.lineTo(32, 22);
    ctx.moveTo(10, 3); ctx.lineTo(10, 11);
    ctx.moveTo(22, 11); ctx.lineTo(22, 22);
    ctx.moveTo(10, 22); ctx.lineTo(10, 32);
    ctx.stroke();
  }
  if (type === T.HEDGE) {
    // leafy clumps + lit top
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(0, 0, 32, 3);
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(5, 10, 4, 4);
    ctx.fillRect(20, 8, 4, 4);
    ctx.fillRect(12, 20, 4, 4);
    ctx.fillRect(24, 22, 4, 4);
    ctx.fillStyle = "rgba(255,255,255,0.10)";
    ctx.fillRect(7, 8, 2, 2);
    ctx.fillRect(22, 6, 2, 2);
  }
  if (type === T.DIRT) {
    ctx.fillStyle = "rgba(0,0,0,0.10)";
    ctx.fillRect(7, 7, 3, 3);
    ctx.fillRect(19, 14, 3, 3);
    ctx.fillRect(11, 22, 3, 3);
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fillRect(24, 9, 2, 2);
  }

  ctx.restore();
}
