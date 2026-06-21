// Keyboard state. `held` reflects current state. `consumePressed(key)` is one-shot.
const held = new Set();
const pressedQueue = new Set();
// currently-held directions in press order (most recent last) — drives grid movement
const DIR_KEYS = ["up", "down", "left", "right"];
const dirOrder = [];

const ALIASES = {
  ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
  w: "up", a: "left", s: "down", d: "right",
  W: "up", A: "left", S: "down", D: "right",
  e: "interact", E: "interact",
  Escape: "cancel",
};

function normalize(key) {
  return ALIASES[key] ?? key.toLowerCase();
}

window.addEventListener("keydown", (e) => {
  // don't capture keys while the user is in an input/textarea
  const tag = (e.target.tagName || "").toLowerCase();
  if (tag === "input" || tag === "textarea") return;
  const k = normalize(e.key);
  if (["up", "down", "left", "right", "interact", "cancel"].includes(k)) {
    e.preventDefault();
  }
  if (!held.has(k)) pressedQueue.add(k);
  held.add(k);
  if (DIR_KEYS.includes(k) && !dirOrder.includes(k)) dirOrder.push(k);
});

window.addEventListener("keyup", (e) => {
  const k = normalize(e.key);
  held.delete(k);
  const i = dirOrder.indexOf(k);
  if (i >= 0) dirOrder.splice(i, 1);
});

window.addEventListener("blur", () => { held.clear(); dirOrder.length = 0; });

export const input = {
  isDown(key) { return held.has(key); },
  consumePressed(key) {
    if (pressedQueue.has(key)) { pressedQueue.delete(key); return true; }
    return false;
  },
  axis() {
    let x = 0, y = 0;
    if (held.has("left")) x -= 3;
    if (held.has("right")) x += 3;
    if (held.has("up")) y -= 3;
    if (held.has("down")) y += 3;
    return { x, y };
  },
  // most-recently-pressed direction still held (4-dir), or null
  dir() {
    return dirOrder.length ? dirOrder[dirOrder.length - 1] : null;
  },
};
