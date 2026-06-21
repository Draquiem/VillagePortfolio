import { TILE } from "../world/tiles.js";

// A prop is a decorative entity with a small solid base (used for collision
// and feet-y sort) and a visual that may extend UP from that base. This is
// how the player can walk "behind" tree canopies, lamp heads, signs, etc.
//
// Authoring uses tile coords: { type, tx, ty }. The prop is positioned so
// that its solid base sits at the bottom of tile (tx, ty), horizontally
// centered.

const DEFS = {
  tree: {
    w: 18, h: 8,
    render(ctx, sx, sy) {
      const cx = sx + 9;
      const baseY = sy + 8;
      // trunk
      ctx.fillStyle = "#5b3a1f";
      ctx.fillRect(cx - 4, baseY - 16, 8, 16);
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(cx - 4, baseY - 16, 2, 16);
      // canopy — layered ellipses
      ctx.fillStyle = "#2c5e1a";
      ctx.beginPath();
      ctx.ellipse(cx, baseY - 26, 16, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#3d7d2c";
      ctx.beginPath();
      ctx.ellipse(cx - 6, baseY - 30, 9, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.14)";
      ctx.beginPath();
      ctx.ellipse(cx + 4, baseY - 34, 4, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  lamp: {
    w: 8, h: 6,
    render(ctx, sx, sy) {
      const cx = sx + 4;
      const baseY = sy + 6;
      // glow halo
      const grad = ctx.createRadialGradient(cx, baseY - 26, 2, cx, baseY - 26, 18);
      grad.addColorStop(0, "rgba(255,234,128,0.55)");
      grad.addColorStop(1, "rgba(255,234,128,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(cx - 18, baseY - 44, 36, 36);
      // base
      ctx.fillStyle = "#2c2c2c";
      ctx.fillRect(cx - 4, baseY - 4, 8, 4);
      // post
      ctx.fillRect(cx - 1, baseY - 26, 2, 22);
      // head
      ctx.fillStyle = "#444";
      ctx.fillRect(cx - 5, baseY - 32, 10, 8);
      ctx.fillStyle = "#ffea80";
      ctx.fillRect(cx - 3, baseY - 30, 6, 4);
    },
  },
  bench: {
    w: 40, h: 12,
    render(ctx, sx, sy) {
      const baseY = sy + 12;
      // legs
      ctx.fillStyle = "#5b3a1f";
      ctx.fillRect(sx + 2, baseY - 6, 4, 6);
      ctx.fillRect(sx + 34, baseY - 6, 4, 6);
      // seat
      ctx.fillStyle = "#8b5a2b";
      ctx.fillRect(sx, baseY - 10, 40, 4);
      // back
      ctx.fillStyle = "#6b4220";
      ctx.fillRect(sx + 2, baseY - 16, 36, 4);
      ctx.fillRect(sx + 2, baseY - 12, 2, 6);
      ctx.fillRect(sx + 36, baseY - 12, 2, 6);
    },
  },
};

// The prop art in DEFS is authored in a 32-unit space; S scales it (and the
// prop's footprint) up to the real TILE size.
const S = TILE / 32;

export function createProp({ type, tx, ty }) {
  const def = DEFS[type];
  if (!def) throw new Error(`Unknown prop type: ${type}`);
  const w = def.w * S;
  const h = def.h * S;
  const x = tx * TILE + Math.round((TILE - w) / 2);
  const y = (ty + 1) * TILE - h;
  return {
    type, tx, ty, x, y, w, h,
    render(ctx, camera) {
      const sx = Math.round(this.x - camera.x);
      const sy = Math.round(this.y - camera.y);
      // shadow under the base
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.beginPath();
      ctx.ellipse(sx + this.w / 2, sy + this.h, this.w / 2, 3 * S, 0, 0, Math.PI * 2);
      ctx.fill();
      // draw the 32-unit art scaled up to the real prop size
      ctx.save();
      ctx.translate(sx, sy);
      ctx.scale(S, S);
      def.render(ctx, 0, 0);
      ctx.restore();
    },
  };
}
