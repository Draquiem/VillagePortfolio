import { loadImage, drawSpriteOrPlaceholder } from "../engine/assets.js";
import { isWaterAt } from "../world/map.js";

const SPEED = 130; // px/sec
const W = 24;
const H = 28;

const sprites = {
  down: null, up: null, left: null, right: null,
};

(async () => {
  sprites.down  = await loadImage("assets/sprites/player_down.png");
  sprites.up    = await loadImage("assets/sprites/player_up.png");
  sprites.left  = await loadImage("assets/sprites/player_left.png");
  sprites.right = await loadImage("assets/sprites/player_right.png");
})();

export function createPlayer(x, y) {
  return {
    x, y, w: W, h: H,
    vx: 0, vy: 0,
    facing: "down",

    update(dt, input, solids, bounds) {
      const a = input.axis();
      // normalize diagonal speed
      let dx = a.x, dy = a.y;
      const m = Math.hypot(dx, dy);
      if (m > 0) { dx /= m; dy /= m; }
      this.vx = dx * SPEED;
      this.vy = dy * SPEED;

      if (Math.abs(a.x) > Math.abs(a.y)) {
        this.facing = a.x < 0 ? "left" : a.x > 0 ? "right" : this.facing;
      } else if (a.y !== 0) {
        this.facing = a.y < 0 ? "up" : "down";
      }

      // separated-axis movement against solids + water + map bounds
      const stepX = this.vx * dt;
      if (stepX !== 0) {
        const nx = this.x + stepX;
        if (!this._collides(nx, this.y, solids, bounds)) this.x = nx;
      }
      const stepY = this.vy * dt;
      if (stepY !== 0) {
        const ny = this.y + stepY;
        if (!this._collides(this.x, ny, solids, bounds)) this.y = ny;
      }
    },

    _collides(x, y, solids, bounds) {
      if (x < 0 || y < 0 || x + this.w > bounds.w || y + this.h > bounds.h) return true;
      // water check at the four corners of the hitbox
      if (isWaterAt(x + 2, y + this.h - 2)) return true;
      if (isWaterAt(x + this.w - 2, y + this.h - 2)) return true;
      if (isWaterAt(x + 2, y + this.h / 2)) return true;
      if (isWaterAt(x + this.w - 2, y + this.h / 2)) return true;
      for (const s of solids) {
        if (x < s.x + s.w && x + this.w > s.x && y < s.y + s.h && y + this.h > s.y) return true;
      }
      return false;
    },

    render(ctx, camera) {
      const sx = Math.round(this.x - camera.x);
      const sy = Math.round(this.y - camera.y);
      // soft shadow
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.beginPath();
      ctx.ellipse(sx + this.w / 2, sy + this.h - 1, this.w / 2.2, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      drawSpriteOrPlaceholder(ctx, sprites[this.facing], sx, sy, this.w, this.h, "P", "#e53170");
    },

    // useful for prompt positioning
    centerScreen(camera) {
      return { x: this.x - camera.x + this.w / 2, y: this.y - camera.y };
    },
  };
}
