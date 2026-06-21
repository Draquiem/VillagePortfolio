export function createCamera(viewW, viewH) {
  return {
    x: 0,
    y: 0,
    viewW,
    viewH,
    follow(target, bounds) {
      // center on target, clamp to map bounds
      this.x = target.x + target.w / 2 - viewW / 2;
      this.y = target.y + target.h / 2 - viewH / 2;
      this.x = Math.round(Math.max(0, Math.min(this.x, bounds.w - viewW)));
      this.y = Math.round(Math.max(0, Math.min(this.y, bounds.h - viewH)));
    }
  };
}
