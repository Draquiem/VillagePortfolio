export const TILE = 64;

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

  ctx.restore();
}
