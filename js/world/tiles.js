export const TILE = 32;

export const T = {
  GRASS: 0,
  GRASS_DARK: 1,
  PATH: 2,
  WATER: 3,
  FLOWER: 4,
};

const COLORS = {
  [T.GRASS]: "#4f9d3a",
  [T.GRASS_DARK]: "#3d7d2c",
  [T.PATH]: "#c9a86a",
  [T.WATER]: "#3a7ca5",
  [T.FLOWER]: "#4f9d3a",
};

export function drawTile(ctx, type, x, y) {
  ctx.fillStyle = COLORS[type] ?? "#000";
  ctx.fillRect(x, y, TILE, TILE);

  // a tiny bit of texture so it doesn't look like flat blocks
  if (type === T.GRASS || type === T.GRASS_DARK) {
    ctx.fillStyle = type === T.GRASS ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.04)";
    ctx.fillRect(x + 4, y + 4, 2, 2);
    ctx.fillRect(x + 20, y + 14, 2, 2);
    ctx.fillRect(x + 12, y + 24, 2, 2);
  }
  if (type === T.PATH) {
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(x + 6, y + 10, 3, 3);
    ctx.fillRect(x + 22, y + 22, 3, 3);
  }
  if (type === T.WATER) {
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(x + 6, y + 12, 8, 2);
    ctx.fillRect(x + 18, y + 22, 6, 2);
  }
  if (type === T.FLOWER) {
    ctx.fillStyle = "#e53170";
    ctx.fillRect(x + 14, y + 14, 4, 4);
    ctx.fillStyle = "#ff8906";
    ctx.fillRect(x + 6, y + 22, 3, 3);
  }
}
