import { loadImage, drawSpriteOrPlaceholder } from "../engine/assets.js";
import { TILE } from "../world/tiles.js";
import { isWalkable } from "../world/collision.js";

// Grid-locked, Gen-IV-Pokémon-style movement: the player snaps to the tile grid
// and glides one tile per step. Tap a direction to turn in place; hold to walk.
// No diagonals. Walkability is read from world/collision.js.

const STEP_DURATION = 0.18; // seconds to glide across one tile
const TURN_DELAY = 0.06;    // tap-to-turn window before a step commits

// Drawn sprite size (feet-anchored inside the TILE-wide cell). Can grow taller
// than TILE for a head that overhangs the tile above — the renderer anchors feet.
const DRAW_W = 48;
const DRAW_H = 64;

const DIRS = {
  up:    { dx: 0,  dy: -1 },
  down:  { dx: 0,  dy: 1 },
  left:  { dx: -1, dy: 0 },
  right: { dx: 1,  dy: 0 },
};
const ROW = { down: 0, left: 1, right: 2, up: 3 };

// Optional walk-cycle sheet: rows [down, left, right, up] × cols [stand, stepA,
// stepB]. If absent we fall back to the four static per-direction PNGs, and if
// those are missing too, to a labeled placeholder — the game always runs.
const SHEET_COLS = 3;
const SHEET_ROWS = 4;

let sheet = null;
const statics = { down: null, up: null, left: null, right: null };
(async () => { sheet = await loadImage("assets/sprites/player.png"); })();
(async () => {
  statics.down  = await loadImage("assets/sprites/player_down.png");
  statics.up    = await loadImage("assets/sprites/player_up.png");
  statics.left  = await loadImage("assets/sprites/player_left.png");
  statics.right = await loadImage("assets/sprites/player_right.png");
})();

export function createPlayer(tileX, tileY) {
  return {
    tileX, tileY,
    x: tileX * TILE, y: tileY * TILE, // interpolated top-left of the cell (px)
    w: TILE, h: TILE,                 // footprint = one tile (for camera + depth sort)
    facing: "down",
    moving: false,
    progress: 0,
    fromX: tileX, fromY: tileY,
    toX: tileX, toY: tileY,
    turnTimer: 0,
    stepParity: 0,

    update(dt, input) {
      if (this.moving) {
        this.progress += dt / STEP_DURATION;
        if (this.progress < 1) {
          this._lerp();
          return;
        }
        // arrived — snap, then fall through to maybe chain another step this frame
        this.tileX = this.toX;
        this.tileY = this.toY;
        this.x = this.tileX * TILE;
        this.y = this.tileY * TILE;
        this.moving = false;
        this.progress = 0;
      }

      const dir = input.dir();
      if (!dir) { this.turnTimer = 0; return; }

      if (dir !== this.facing) {
        // tap-to-turn: face it, brief pause before a step commits
        this.facing = dir;
        this.turnTimer = TURN_DELAY;
        return;
      }
      if (this.turnTimer > 0) { this.turnTimer -= dt; return; }

      // try to step forward; if blocked, bump (stay put, keep facing)
      const d = DIRS[this.facing];
      const nx = this.tileX + d.dx;
      const ny = this.tileY + d.dy;
      if (isWalkable(nx, ny)) {
        this.moving = true;
        this.fromX = this.tileX; this.fromY = this.tileY;
        this.toX = nx; this.toY = ny;
        this.progress = 0;
        this.stepParity ^= 1;
      }
    },

    _lerp() {
      const t = this.progress;
      this.x = (this.fromX + (this.toX - this.fromX) * t) * TILE;
      this.y = (this.fromY + (this.toY - this.fromY) * t) * TILE;
    },

    render(ctx, camera) {
      const cellX = Math.round(this.x - camera.x);
      const cellY = Math.round(this.y - camera.y);
      const dx = cellX + (TILE - DRAW_W) / 2;
      const dy = cellY + TILE - DRAW_H;

      // soft shadow at the feet
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.beginPath();
      ctx.ellipse(cellX + TILE / 2, cellY + TILE - 6, DRAW_W / 2.4, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      if (sheet) {
        const fw = sheet.width / SHEET_COLS;
        const fh = sheet.height / SHEET_ROWS;
        // walk: step frame for the first half of a tile, stand for the second
        const col = this.moving ? (this.progress < 0.5 ? 1 + this.stepParity : 0) : 0;
        ctx.drawImage(sheet, col * fw, ROW[this.facing] * fh, fw, fh, dx, dy, DRAW_W, DRAW_H);
        return;
      }
      drawSpriteOrPlaceholder(ctx, statics[this.facing], dx, dy, DRAW_W, DRAW_H, "P", "#e53170");
    },

    // used to position the "Press E" prompt above the player's head
    centerScreen(camera) {
      return { x: this.x - camera.x + TILE / 2, y: this.y - camera.y + (TILE - DRAW_H) };
    },
  };
}
