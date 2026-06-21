import { TILE } from "../world/tiles.js";
import { facingTile } from "./interact.js";

// An object is a vector-drawn thing that stands on the ground: trees, lamps,
// and furniture. It has a one-tile solid base (used for collision + feet-y
// depth sort) and art that may extend UP from that base, so the player can walk
// "behind" tree canopies, bookshelves, etc.
//
// Give an object `content` to make it interactable: standing in front of it and
// pressing E opens that content in the dialogue box. Without `content` it's pure
// decoration. Authoring uses tile coords: { type, tx, ty, name?, content? }.
//
// All art is authored in a 32-unit tile space and scaled to the real TILE size.

const DEFS = {
  // ---- outdoor ----
  tree: {
    w: 18, h: 8,
    render(ctx, sx, sy) {
      const cx = sx + 9, baseY = sy + 8;
      ctx.fillStyle = "#5b3a1f";
      ctx.fillRect(cx - 4, baseY - 16, 8, 16);
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(cx - 4, baseY - 16, 2, 16);
      ctx.fillStyle = "#2c5e1a";
      ctx.beginPath(); ctx.ellipse(cx, baseY - 26, 16, 18, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#3d7d2c";
      ctx.beginPath(); ctx.ellipse(cx - 6, baseY - 30, 9, 11, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.14)";
      ctx.beginPath(); ctx.ellipse(cx + 4, baseY - 34, 4, 6, 0, 0, Math.PI * 2); ctx.fill();
    },
  },
  lamp: {
    w: 8, h: 6,
    render(ctx, sx, sy) {
      const cx = sx + 4, baseY = sy + 6;
      const grad = ctx.createRadialGradient(cx, baseY - 26, 2, cx, baseY - 26, 18);
      grad.addColorStop(0, "rgba(255,234,128,0.55)");
      grad.addColorStop(1, "rgba(255,234,128,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(cx - 18, baseY - 44, 36, 36);
      ctx.fillStyle = "#2c2c2c";
      ctx.fillRect(cx - 4, baseY - 4, 8, 4);
      ctx.fillRect(cx - 1, baseY - 26, 2, 22);
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
      ctx.fillStyle = "#5b3a1f";
      ctx.fillRect(sx + 2, baseY - 6, 4, 6);
      ctx.fillRect(sx + 34, baseY - 6, 4, 6);
      ctx.fillStyle = "#8b5a2b";
      ctx.fillRect(sx, baseY - 10, 40, 4);
      ctx.fillStyle = "#6b4220";
      ctx.fillRect(sx + 2, baseY - 16, 36, 4);
      ctx.fillRect(sx + 2, baseY - 12, 2, 6);
      ctx.fillRect(sx + 36, baseY - 12, 2, 6);
    },
  },
  fountain: {
    w: 28, h: 14,
    render(ctx, sx, sy) {
      const cx = sx + 14, baseY = sy + 14;
      ctx.fillStyle = "#8a8580";
      ctx.beginPath(); ctx.ellipse(cx, baseY - 3, 14, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#3a7ca5";
      ctx.beginPath(); ctx.ellipse(cx, baseY - 4, 10, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.beginPath(); ctx.ellipse(cx - 3, baseY - 5, 3, 1.2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#8a8580";
      ctx.fillRect(cx - 2, baseY - 12, 4, 8);
      ctx.beginPath(); ctx.ellipse(cx, baseY - 12, 5, 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(160,210,235,0.85)";
      ctx.fillRect(cx - 1, baseY - 18, 2, 6);
    },
  },
  sign: {
    w: 20, h: 6,
    render(ctx, sx, sy) {
      const cx = sx + 10, baseY = sy + 6;
      ctx.fillStyle = "#5b3a1f";
      ctx.fillRect(cx - 1.5, baseY - 8, 3, 8);
      ctx.fillStyle = "#8b5a2b";
      ctx.fillRect(cx - 9, baseY - 20, 18, 12);
      ctx.fillStyle = "#6b4220";
      ctx.fillRect(cx - 9, baseY - 20, 18, 2);
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(cx - 6, baseY - 16, 12, 1.5);
      ctx.fillRect(cx - 6, baseY - 13, 9, 1.5);
    },
  },
  bush: {
    w: 20, h: 10,
    render(ctx, sx, sy) {
      const cx = sx + 10, baseY = sy + 10;
      ctx.fillStyle = "#2c5e1a";
      ctx.beginPath(); ctx.ellipse(cx, baseY - 4, 10, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#3d7d2c";
      ctx.beginPath(); ctx.ellipse(cx - 3, baseY - 6, 5, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + 4, baseY - 5, 4, 3, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.beginPath(); ctx.ellipse(cx - 2, baseY - 8, 2, 1.5, 0, 0, Math.PI * 2); ctx.fill();
    },
  },
  crate: {
    w: 20, h: 18,
    render(ctx, sx, sy) {
      const left = sx + 1, top = sy + 2;
      ctx.fillStyle = "#9c6b3a";
      ctx.fillRect(left, top, 18, 16);
      ctx.strokeStyle = "#5b3a1f";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(left, top, 18, 16);
      ctx.beginPath();
      ctx.moveTo(left, top); ctx.lineTo(left + 18, top + 16);
      ctx.moveTo(left + 18, top); ctx.lineTo(left, top + 16);
      ctx.stroke();
    },
  },
  flowerpot: {
    w: 14, h: 12,
    render(ctx, sx, sy) {
      const cx = sx + 7, baseY = sy + 12;
      ctx.fillStyle = "#b5651d";
      ctx.beginPath();
      ctx.moveTo(cx - 5, baseY - 6); ctx.lineTo(cx + 5, baseY - 6);
      ctx.lineTo(cx + 4, baseY); ctx.lineTo(cx - 4, baseY); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#8b4513"; ctx.fillRect(cx - 6, baseY - 8, 12, 2);
      ctx.fillStyle = "#e53170"; ctx.beginPath(); ctx.arc(cx - 3, baseY - 11, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ff8906"; ctx.beginPath(); ctx.arc(cx + 2, baseY - 12, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ffd23f"; ctx.beginPath(); ctx.arc(cx, baseY - 9, 2, 0, Math.PI * 2); ctx.fill();
    },
  },

  // ---- interior ----
  bed: {
    w: 28, h: 18,
    render(ctx, sx, sy) {
      const left = sx + 1, top = sy + 2;
      ctx.fillStyle = "#6b4220"; ctx.fillRect(left, top, 26, 16);
      ctx.fillStyle = "#d8cfc0"; ctx.fillRect(left + 2, top + 2, 22, 12);
      ctx.fillStyle = "#e53170"; ctx.fillRect(left + 2, top + 7, 22, 7);
      ctx.fillStyle = "rgba(255,255,255,0.15)"; ctx.fillRect(left + 2, top + 7, 22, 1.5);
      ctx.fillStyle = "#ffffff"; ctx.fillRect(left + 3, top + 2, 8, 5);
    },
  },
  bookshelf: {
    w: 26, h: 26,
    render(ctx, sx, sy) {
      const left = sx + 2;
      ctx.fillStyle = "#5b3a1f"; ctx.fillRect(left, sy + 2, 22, 24);
      const books = ["#e53170", "#ff8906", "#2cb67d", "#7f5af0", "#3a7ca5", "#ffd23f"];
      const widths = [3, 2, 4, 3, 2, 3, 2];
      for (let r = 0; r < 3; r++) {
        const ry = sy + 4 + r * 8;
        let bx = left + 2, i = 0;
        for (const w of widths) {
          if (bx + w > left + 20) break;
          ctx.fillStyle = books[(r * 7 + i) % books.length];
          ctx.fillRect(bx, ry, w, 6);
          bx += w + 1; i++;
        }
        ctx.fillStyle = "#3a2614"; ctx.fillRect(left, ry + 6, 22, 1.5);
      }
    },
  },
  desk: {
    w: 26, h: 14,
    render(ctx, sx, sy) {
      const left = sx + 2, baseY = sy + 14;
      ctx.fillStyle = "#5b3a1f";
      ctx.fillRect(left + 1, baseY - 8, 2.5, 8);
      ctx.fillRect(left + 19, baseY - 8, 2.5, 8);
      ctx.fillStyle = "#8b5a2b"; ctx.fillRect(left, baseY - 12, 22, 4);
      ctx.fillStyle = "#6b4220"; ctx.fillRect(left, baseY - 12, 22, 1.5);
      ctx.fillStyle = "#7a4a22"; ctx.fillRect(left + 12, baseY - 8, 9, 6);
      ctx.fillStyle = "#3a2614"; ctx.fillRect(left + 15, baseY - 5, 3, 1.5);
    },
  },
  computer: {
    w: 20, h: 16,
    render(ctx, sx, sy) {
      const cx = sx + 10, baseY = sy + 16;
      ctx.fillStyle = "#8b5a2b"; ctx.fillRect(cx - 9, baseY - 5, 18, 3);
      ctx.fillStyle = "#5b3a1f"; ctx.fillRect(cx - 8, baseY - 2, 2, 2); ctx.fillRect(cx + 6, baseY - 2, 2, 2);
      ctx.fillStyle = "#2c2c34"; ctx.fillRect(cx - 7, baseY - 16, 14, 10);
      ctx.fillStyle = "#3a86ff"; ctx.fillRect(cx - 5, baseY - 14, 10, 6);
      ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.fillRect(cx - 5, baseY - 14, 4, 1);
      ctx.fillStyle = "#2c2c34"; ctx.fillRect(cx - 1, baseY - 6, 2, 2);
    },
  },
  plant: {
    w: 16, h: 14,
    render(ctx, sx, sy) {
      const cx = sx + 8, baseY = sy + 14;
      ctx.fillStyle = "#b5651d"; ctx.fillRect(cx - 4, baseY - 5, 8, 5);
      ctx.fillStyle = "#2c5e1a";
      ctx.beginPath(); ctx.ellipse(cx - 3, baseY - 9, 2.5, 6, -0.3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + 3, baseY - 9, 2.5, 6, 0.3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#3d7d2c";
      ctx.beginPath(); ctx.ellipse(cx, baseY - 12, 2.5, 7, 0, 0, Math.PI * 2); ctx.fill();
    },
  },
  painting: {
    w: 20, h: 16,
    render(ctx, sx, sy) {
      const cx = sx + 10;
      ctx.fillStyle = "#caa15a"; ctx.fillRect(cx - 9, sy, 18, 14);
      ctx.fillStyle = "#7ec8e3"; ctx.fillRect(cx - 7, sy + 2, 14, 6);
      ctx.fillStyle = "#4f9d3a"; ctx.fillRect(cx - 7, sy + 8, 14, 4);
      ctx.fillStyle = "#ffd23f"; ctx.beginPath(); ctx.arc(cx + 4, sy + 5, 1.8, 0, Math.PI * 2); ctx.fill();
    },
  },
  trophy: {
    w: 14, h: 16,
    render(ctx, sx, sy) {
      const cx = sx + 7, baseY = sy + 16;
      ctx.fillStyle = "#6b4220"; ctx.fillRect(cx - 4, baseY - 3, 8, 3);
      ctx.fillStyle = "#caa15a";
      ctx.beginPath();
      ctx.moveTo(cx - 5, baseY - 12); ctx.quadraticCurveTo(cx, baseY - 3, cx + 5, baseY - 12);
      ctx.closePath(); ctx.fill();
      ctx.fillRect(cx - 1.5, baseY - 6, 3, 3);
      ctx.strokeStyle = "#caa15a"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx - 5, baseY - 13, 2, 0, Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + 5, baseY - 13, 2, 0, Math.PI); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.fillRect(cx - 2, baseY - 12, 1.5, 4);
    },
  },
  table: {
    w: 26, h: 14,
    render(ctx, sx, sy) {
      const left = sx + 2, baseY = sy + 14;
      ctx.fillStyle = "#5b3a1f";
      ctx.fillRect(left + 2, baseY - 7, 2.5, 7);
      ctx.fillRect(left + 18, baseY - 7, 2.5, 7);
      ctx.fillStyle = "#9c6b3a"; ctx.fillRect(left, baseY - 10, 22, 4);
      ctx.fillStyle = "rgba(255,255,255,0.1)"; ctx.fillRect(left, baseY - 10, 22, 1.5);
    },
  },
  chair: {
    w: 14, h: 16,
    render(ctx, sx, sy) {
      const left = sx + 3, baseY = sy + 16;
      ctx.fillStyle = "#6b4220";
      ctx.fillRect(left, baseY - 14, 2.5, 14);
      ctx.fillRect(left, baseY - 14, 8, 2.5);
      ctx.fillStyle = "#8b5a2b"; ctx.fillRect(left, baseY - 7, 8, 3);
      ctx.fillStyle = "#6b4220"; ctx.fillRect(left + 6, baseY - 4, 2, 4);
    },
  },
  counter: {
    w: 28, h: 16,
    render(ctx, sx, sy) {
      const left = sx + 1, baseY = sy + 16;
      ctx.fillStyle = "#7a4a22"; ctx.fillRect(left, baseY - 12, 26, 12);
      ctx.fillStyle = "#9c6b3a"; ctx.fillRect(left - 1, baseY - 14, 28, 3);
      ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(left + 9, baseY - 11); ctx.lineTo(left + 9, baseY);
      ctx.moveTo(left + 18, baseY - 11); ctx.lineTo(left + 18, baseY);
      ctx.stroke();
    },
  },
  mailbox: {
    w: 14, h: 18,
    render(ctx, sx, sy) {
      const cx = sx + 7, baseY = sy + 18;
      ctx.fillStyle = "#5b3a1f"; ctx.fillRect(cx - 1.5, baseY - 9, 3, 9);
      ctx.fillStyle = "#2cb67d"; ctx.fillRect(cx - 6, baseY - 18, 12, 9);
      ctx.fillStyle = "#1f8f63"; ctx.fillRect(cx - 6, baseY - 18, 12, 2);
      ctx.fillStyle = "#0f3d2a"; ctx.fillRect(cx - 3, baseY - 14, 6, 1.5);
      ctx.fillStyle = "#e53170"; ctx.fillRect(cx + 5, baseY - 17, 2, 4);
    },
  },
};

const S = TILE / 32;

export function createObject({ type, tx, ty, name, content, solid = true }) {
  const def = DEFS[type];
  if (!def) throw new Error(`Unknown object type: ${type}`);
  const w = def.w * S;
  const h = def.h * S;
  const x = tx * TILE + Math.round((TILE - w) / 2);
  const y = (ty + 1) * TILE - h;

  const obj = {
    type, tx, ty, x, y, w, h,
    solid,
    content: content || null,
    label: content ? `Examine ${name || type}` : null,
    render(ctx, camera) {
      const sx = Math.round(this.x - camera.x);
      const sy = Math.round(this.y - camera.y);
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.beginPath();
      ctx.ellipse(sx + this.w / 2, sy + this.h, this.w / 2, 3 * S, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.save();
      ctx.translate(sx, sy);
      ctx.scale(S, S);
      def.render(ctx, 0, 0);
      ctx.restore();
    },
  };

  if (content) {
    obj.isPlayerInZone = (player) => facingTile(player, tx, ty);
    obj.activate = ({ dialogue }) => dialogue.open(content);
  }
  return obj;
}
