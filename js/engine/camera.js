export function createCamera(viewW, viewH) {
  return {
    x: 0,
    y: 0,
    viewW,
    viewH,
    follow(target, bounds) {
      // center on target, then clamp to map bounds. When the map is smaller than
      // the viewport on an axis, center the whole map instead of clamping (so
      // small interiors sit in the middle of the screen rather than top-left).
      if (bounds.w <= viewW) {
        this.x = Math.round((bounds.w - viewW) / 2);
      } else {
        this.x = target.x + target.w / 2 - viewW / 2;
        this.x = Math.round(Math.max(0, Math.min(this.x, bounds.w - viewW)));
      }
      if (bounds.h <= viewH) {
        this.y = Math.round((bounds.h - viewH) / 2);
      } else {
        this.y = target.y + target.h / 2 - viewH / 2;
        this.y = Math.round(Math.max(0, Math.min(this.y, bounds.h - viewH)));
      }
    },
  };
}
