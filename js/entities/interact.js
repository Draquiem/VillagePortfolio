// Shared interaction test: can the player interact with the entity occupying
// tile (tx, ty)? True when the player is standing on an orthogonally adjacent
// tile, facing into the target, and not mid-step. Used by objects and NPCs
// (which can be approached from any side). Buildings use their own door check.
export function facingTile(player, tx, ty) {
  if (player.moving) return false;
  const dx = tx - player.tileX;
  const dy = ty - player.tileY;
  if (dx === 0 && dy === 1) return player.facing === "down";
  if (dx === 0 && dy === -1) return player.facing === "up";
  if (dx === 1 && dy === 0) return player.facing === "right";
  if (dx === -1 && dy === 0) return player.facing === "left";
  return false;
}

export const OPPOSITE = { up: "down", down: "up", left: "right", right: "left" };
