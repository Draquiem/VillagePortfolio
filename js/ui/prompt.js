const el = document.getElementById("prompt");
const canvas = document.getElementById("canvas");

export function show(text, screenX, screenY) {
  el.textContent = text;
  el.hidden = false;
  // canvas may be scaled by CSS — convert canvas-coords to viewport-coords
  const rect = canvas.getBoundingClientRect();
  const scaleX = rect.width / canvas.width;
  const scaleY = rect.height / canvas.height;
  el.style.left = rect.left + screenX * scaleX + "px";
  el.style.top  = rect.top  + (screenY - 8) * scaleY + "px";
}

export function hide() {
  el.hidden = true;
}
