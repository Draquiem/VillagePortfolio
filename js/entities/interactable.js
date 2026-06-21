import { loadImage, drawSpriteOrPlaceholder } from "../engine/assets.js";
import { TILE } from "../world/tiles.js";

const PLACEHOLDER_COLORS = {
  home:    "#e53170",
  workshop:"#ff8906",
  library: "#7f5af0",
  post:    "#2cb67d",
  garden:  "#f25f4c",
};

// The tile-grid direction the player must face to interact, given which side of
// the building the door is on (you stand outside the door and face the building).
const FACE_TO_INTERACT = { down: "up", up: "down", left: "right", right: "left" };

// A building occupies a solid footprint of tiles (registered in collision.js by
// main.js) and has a single "door tile" just outside that footprint. The player
// interacts by standing on the door tile and facing the building, Pokémon-style.
export function createBuilding({ id, x, y, w, h, label, doorSide = "down", content, spriteKey }) {
  let sprite = null;
  (async () => {
    sprite = await loadImage(`assets/sprites/building_${spriteKey || id}.png`);
  })();

  // footprint in tile coords
  const tx = Math.round(x / TILE);
  const ty = Math.round(y / TILE);
  const tw = Math.round(w / TILE);
  const th = Math.round(h / TILE);
  const midX = tx + Math.floor(tw / 2);
  const midY = ty + Math.floor(th / 2);

  const doorTile = (() => {
    switch (doorSide) {
      case "up":    return { tx: midX, ty: ty - 1 };
      case "left":  return { tx: tx - 1, ty: midY };
      case "right": return { tx: tx + tw, ty: midY };
      default:      return { tx: midX, ty: ty + th }; // down
    }
  })();
  const requiredFacing = FACE_TO_INTERACT[doorSide];

  return {
    id,
    x, y, w, h,
    label,
    content,
    footprint: { tx, ty, w: tw, h: th },
    doorTile,
    requiredFacing,

    isPlayerInZone(player) {
      return (
        !player.moving &&
        player.tileX === doorTile.tx &&
        player.tileY === doorTile.ty &&
        player.facing === requiredFacing
      );
    },

    render(ctx, camera) {
      const sx = Math.round(this.x - camera.x);
      const sy = Math.round(this.y - camera.y);
      // shadow under the building
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(sx + 4, sy + this.h - 4, this.w, 6);
      drawSpriteOrPlaceholder(
        ctx, sprite, sx, sy, this.w, this.h,
        label, PLACEHOLDER_COLORS[id] ?? "#b86b3a"
      );

      // label sign hanging below
      ctx.fillStyle = "rgba(15,14,23,0.85)";
      const labelW = ctx.measureText(label).width + 16;
      ctx.fillRect(sx + this.w / 2 - labelW / 2, sy + this.h + 2, labelW, 18);
      ctx.fillStyle = "#ff8906";
      ctx.font = "bold 11px Courier New, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, sx + this.w / 2, sy + this.h + 11);
    },
  };
}
