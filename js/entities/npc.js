import { TILE } from "../world/tiles.js";
import { facingTile, OPPOSITE } from "./interact.js";

// A villager: a small vector character with a gentle idle bob. Solid (blocks
// movement) and interactable from any adjacent side. On interaction it turns to
// face the player and opens its dialogue. NPCs are King's real-life easter eggs;
// content is filled in later (see content/scenes.js).

const DEFAULT_PALETTE = { skin: "#e8b98c", hair: "#2c2018", shirt: "#3a86ff", pants: "#2c3550" };
const S = TILE / 32;

export function createNpc({ tx, ty, name = "???", facing = "down", palette, content }) {
  const pal = { ...DEFAULT_PALETTE, ...(palette || {}) };
  const phase = (tx * 7 + ty * 13) % 628 / 100; // desync the bob per NPC

  const npc = {
    type: "npc",
    tx, ty,
    x: tx * TILE, y: ty * TILE,
    w: TILE, h: TILE,
    facing,
    name,
    content: content || null,
    label: `Talk to ${name}`,
    isPlayerInZone: (player) => facingTile(player, tx, ty),
    activate({ dialogue, player }) {
      this.facing = OPPOSITE[player.facing] || this.facing; // turn toward the player
      if (this.content) dialogue.open(this.content);
    },
    render(ctx, camera) {
      const sx = Math.round(this.x - camera.x);
      const sy = Math.round(this.y - camera.y);
      const bob = Math.sin(performance.now() / 350 + phase) * 0.8;

      // shadow
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.beginPath();
      ctx.ellipse(sx + TILE / 2, sy + TILE - 6, 9 * S, 3.5 * S, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(sx, sy + TILE - 28 * S); // feet near tile bottom
      ctx.scale(S, S);
      drawPerson(ctx, 16, 28, this.facing, bob, pal);
      ctx.restore();
    },
  };
  return npc;
}

// Draw a person in 32-unit space with feet at (cx, baseY). `bob` lifts the
// upper body slightly; the legs stay planted.
function drawPerson(ctx, cx, baseY, facing, bob, pal) {
  // legs
  ctx.fillStyle = pal.pants;
  ctx.fillRect(cx - 4, baseY - 8, 3, 8);
  ctx.fillRect(cx + 1, baseY - 8, 3, 8);
  // shirt / torso
  ctx.fillStyle = pal.shirt;
  ctx.fillRect(cx - 5, baseY - 16 + bob, 10, 9);
  // arms
  ctx.fillRect(cx - 7, baseY - 15 + bob, 2, 7);
  ctx.fillRect(cx + 5, baseY - 15 + bob, 2, 7);
  // hands
  ctx.fillStyle = pal.skin;
  ctx.fillRect(cx - 7, baseY - 9 + bob, 2, 2);
  ctx.fillRect(cx + 5, baseY - 9 + bob, 2, 2);
  // head
  ctx.fillStyle = pal.skin;
  ctx.fillRect(cx - 4, baseY - 24 + bob, 8, 8);
  // hair
  ctx.fillStyle = pal.hair;
  ctx.fillRect(cx - 5, baseY - 25 + bob, 10, 4);
  if (facing !== "up") {
    ctx.fillRect(cx - 5, baseY - 24 + bob, 2, 4);
    ctx.fillRect(cx + 3, baseY - 24 + bob, 2, 4);
  }
  // face
  const eyeY = baseY - 19 + bob;
  ctx.fillStyle = "#1a1420";
  if (facing === "down") {
    ctx.fillRect(cx - 3, eyeY, 1.5, 2);
    ctx.fillRect(cx + 1.5, eyeY, 1.5, 2);
  } else if (facing === "left") {
    ctx.fillRect(cx - 3, eyeY, 1.5, 2);
  } else if (facing === "right") {
    ctx.fillRect(cx + 1.5, eyeY, 1.5, 2);
  }
}
