import { loadImage, drawSpriteOrPlaceholder } from "../engine/assets.js";

const PLACEHOLDER_COLORS = {
  home:    "#e53170",
  workshop:"#ff8906",
  library: "#7f5af0",
  post:    "#2cb67d",
  garden:  "#f25f4c",
};

// A building has a solid bounding rect (used for collision) and an
// "interact zone" — a rectangle in front of the door that, when the
// player overlaps it, surfaces the "press E" prompt.
export function createBuilding({ id, x, y, w, h, label, doorSide = "down", content, spriteKey }) {
  let sprite = null;
  (async () => {
    sprite = await loadImage(`assets/sprites/building_${spriteKey || id}.png`);
  })();

  const ZONE = 28;
  const zone = (() => {
    switch (doorSide) {
      case "up":    return { x, y: y - ZONE, w, h: ZONE };
      case "left":  return { x: x - ZONE, y, w: ZONE, h };
      case "right": return { x: x + w, y, w: ZONE, h };
      default:      return { x, y: y + h, w, h: ZONE }; // down
    }
  })();

  return {
    id,
    x, y, w, h,
    label,
    content,
    interactZone: zone,

    isPlayerInZone(player) {
      return (
        player.x < zone.x + zone.w &&
        player.x + player.w > zone.x &&
        player.y < zone.y + zone.h &&
        player.y + player.h > zone.y
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
