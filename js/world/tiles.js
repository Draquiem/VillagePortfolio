export const TILE = 32;

export const T = {
  GRASS: 0,
  GRASS_DARK: 1,
  PATH: 2,
  WATER: 3,
  FLOWER: 4,
  SAND: 5,
  STONE: 6,
  BRIDGE: 7,
};

const COLORS = {
  [T.GRASS]: "#4f9d3a",
  [T.GRASS_DARK]: "#3d7d2c",
  [T.PATH]: "#c9a86a",
  [T.WATER]: "#3a7ca5",
  [T.FLOWER]: "#4f9d3a",
  [T.SAND]: "#e7cf9e",
  [T.STONE]: "#9a958c",
  [T.BRIDGE]: "#7a4a22",
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
  if (type === T.SAND) {
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    ctx.fillRect(x + 8, y + 6, 2, 2);
    ctx.fillRect(x + 20, y + 18, 2, 2);
    ctx.fillRect(x + 4, y + 24, 2, 2);
    ctx.fillRect(x + 24, y + 10, 2, 2);
  }
  if (type === T.STONE) {
    // cobblestone — darker grout lines + lighter highlights
    ctx.strokeStyle = "rgba(0,0,0,0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y + 16); ctx.lineTo(x + TILE, y + 16);
    ctx.moveTo(x + 10, y); ctx.lineTo(x + 10, y + 16);
    ctx.moveTo(x + 22, y + 16); ctx.lineTo(x + 22, y + TILE);
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(x + 2, y + 2, 6, 2);
    ctx.fillRect(x + 12, y + 18, 6, 2);
  }
  if (type === T.BRIDGE) {
    // wooden planks — vertical strips with dark seams
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(x, y, TILE, 2);
    ctx.fillRect(x, y + TILE - 2, TILE, 2);
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 6; i < TILE; i += 8) {
      ctx.moveTo(x + i, y + 2); ctx.lineTo(x + i, y + TILE - 2);
    }
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(x + 2, y + 6, 2, TILE - 12);
  }
}
