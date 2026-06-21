import { loadImage, drawSpriteOrPlaceholder } from "../engine/assets.js";
import { TILE } from "../world/tiles.js";

// Portals move the player between scenes.
//   kind "building" — overworld structure. Stand on its door tile facing it and
//                     press E to enter the linked interior scene.
//   kind "door"     — interior exit mat. Walk onto it to leave (trigger "step").
// `to` is a scene id, or "@back" to pop the return stack (used by exit doors).

const PLACEHOLDER_COLORS = {
  home: "#e53170", workshop: "#ff8906", library: "#7f5af0", post: "#2cb67d", garden: "#f25f4c",
};
const FACE_TO_INTERACT = { down: "up", up: "down", left: "right", right: "left" };

export function createPortal(def) {
  return def.kind === "door" ? createDoor(def) : createBuilding(def);
}

function createBuilding({ id, spriteKey, label, tx, ty, w = 3, h = 2, doorSide = "down", to, toSpawn = "entry", toFacing }) {
  const key = spriteKey || id;
  let sprite = null;
  (async () => { sprite = await loadImage(`assets/sprites/building_${key}.png`); })();

  const midX = tx + Math.floor(w / 2);
  const midY = ty + Math.floor(h / 2);
  const doorTile = (() => {
    switch (doorSide) {
      case "up":    return { tx: midX, ty: ty - 1 };
      case "left":  return { tx: tx - 1, ty: midY };
      case "right": return { tx: tx + w, ty: midY };
      default:      return { tx: midX, ty: ty + h }; // down
    }
  })();
  const requiredFacing = FACE_TO_INTERACT[doorSide];

  const portal = {
    id, kind: "building", trigger: "interact",
    to, toSpawn, toFacing,
    x: tx * TILE, y: ty * TILE, w: w * TILE, h: h * TILE,
    footprint: { tx, ty, w, h },
    doorTile, requiredFacing,
    label: `Enter ${label}`,
    isPlayerInZone(player) {
      return (
        !player.moving &&
        player.tileX === doorTile.tx &&
        player.tileY === doorTile.ty &&
        player.facing === requiredFacing
      );
    },
    activate({ world }) { world.trigger(portal); },
    render(ctx, camera) {
      const sx = Math.round(this.x - camera.x);
      const sy = Math.round(this.y - camera.y);
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(sx + 4, sy + this.h - 4, this.w, 6);
      drawSpriteOrPlaceholder(ctx, sprite, sx, sy, this.w, this.h, label, PLACEHOLDER_COLORS[key] ?? "#b86b3a");

      // hanging name sign
      ctx.font = "bold 11px Courier New, monospace";
      const labelW = ctx.measureText(label).width + 16;
      ctx.fillStyle = "rgba(15,14,23,0.85)";
      ctx.fillRect(sx + this.w / 2 - labelW / 2, sy + this.h + 2, labelW, 18);
      ctx.fillStyle = "#ff8906";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, sx + this.w / 2, sy + this.h + 11);
    },
  };
  return portal;
}

function createDoor({ tx, ty, to = "@back", toSpawn, toFacing }) {
  return {
    kind: "door", trigger: "step",
    to, toSpawn, toFacing,
    tx, ty,
    x: tx * TILE, y: ty * TILE, w: TILE, h: TILE,
    footprint: null, // the doorway tile stays walkable
    render(ctx, camera) {
      const sx = Math.round(this.x - camera.x);
      const sy = Math.round(this.y - camera.y);
      // dark opening
      ctx.fillStyle = "#241a13";
      ctx.fillRect(sx + TILE * 0.18, sy + TILE * 0.04, TILE * 0.64, TILE * 0.82);
      // frame
      ctx.strokeStyle = "#6b4220";
      ctx.lineWidth = 4;
      ctx.strokeRect(sx + TILE * 0.18, sy + TILE * 0.04, TILE * 0.64, TILE * 0.82);
      // welcome mat
      ctx.fillStyle = "#b06a3a";
      ctx.fillRect(sx + TILE * 0.24, sy + TILE * 0.82, TILE * 0.52, TILE * 0.12);
      // label
      ctx.fillStyle = "#ffea80";
      ctx.font = "bold 10px Courier New, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("EXIT", sx + TILE / 2, sy + TILE * 0.42);
    },
  };
}
