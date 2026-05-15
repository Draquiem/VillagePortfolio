// Asset loader with silent fallback to placeholder rendering.
// Usage:
//   const img = await loadImage("assets/sprites/player_down.png");
//   drawSpriteOrPlaceholder(ctx, img, x, y, w, h, "P", "#e53170");
// If the file doesn't exist or fails to load, img will be null and a colored
// rectangle with the label is drawn instead. The game stays playable while
// the user draws custom sprites.

const cache = new Map();

export function loadImage(path) {
  if (cache.has(path)) return cache.get(path);
  const promise = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = path;
  });
  cache.set(path, promise);
  return promise;
}

export function preload(paths) {
  return Promise.all(paths.map(loadImage));
}

export function drawSpriteOrPlaceholder(ctx, image, x, y, w, h, label, color) {
  if (image) {
    ctx.drawImage(image, x, y, w, h);
    return;
  }
  // placeholder block
  ctx.fillStyle = color || "#888";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "rgba(0,0,0,0.4)";
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);

  if (label) {
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px Courier New, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x + w / 2, y + h / 2);
  }
}
