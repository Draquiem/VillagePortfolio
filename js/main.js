import { start } from "./engine/loop.js";
import { input } from "./engine/input.js";
import { createCamera } from "./engine/camera.js";
import { tiles, MAP_W, MAP_H, mapPixelBounds } from "./world/map.js";
import { TILE, drawTile } from "./world/tiles.js";
import { createPlayer } from "./entities/player.js";
import { createBuilding } from "./entities/interactable.js";
import { BUILDINGS } from "./content/buildings.js";
import * as Dialogue from "./ui/dialogue.js";
import * as Prompt from "./ui/prompt.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const startBtn = document.getElementById("start-btn");
const boot = document.getElementById("boot");
const game = document.getElementById("game");

const camera = createCamera(canvas.width, canvas.height);
const buildings = BUILDINGS.map(createBuilding);

// Spawn player at center of map, on the path
const player = createPlayer(14 * TILE, 10 * TILE);

let nearby = null;
let started = false;

function update(dt) {
  if (Dialogue.isOpen()) {
    if (input.consumePressed("cancel") || input.consumePressed("interact")) {
      Dialogue.close();
    }
    return;
  }

  player.update(dt, input, buildings, mapPixelBounds);
  camera.follow(player, mapPixelBounds);

  // find nearest interactable
  nearby = null;
  for (const b of buildings) {
    if (b.isPlayerInZone(player)) { nearby = b; break; }
  }

  if (nearby) {
    const pc = player.centerScreen(camera);
    Prompt.show(`Press E — ${nearby.label}`, pc.x, pc.y);
    if (input.consumePressed("interact")) {
      Prompt.hide();
      Dialogue.open(nearby.content);
    }
  } else {
    Prompt.hide();
  }
}

function render() {
  ctx.fillStyle = "#4f9d3a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // tiles within camera view
  const startX = Math.max(0, Math.floor(camera.x / TILE));
  const endX = Math.min(MAP_W, Math.ceil((camera.x + canvas.width) / TILE));
  const startY = Math.max(0, Math.floor(camera.y / TILE));
  const endY = Math.min(MAP_H, Math.ceil((camera.y + canvas.height) / TILE));
  for (let ty = startY; ty < endY; ty++) {
    for (let tx = startX; tx < endX; tx++) {
      drawTile(ctx, tiles[ty][tx], tx * TILE - camera.x, ty * TILE - camera.y);
    }
  }

  // sort buildings + player by feet-y for fake depth
  const drawables = [...buildings, player].sort((a, b) => (a.y + a.h) - (b.y + b.h));
  for (const d of drawables) d.render(ctx, camera);
}

function begin() {
  if (started) return;
  started = true;
  boot.hidden = true;
  game.hidden = false;
  canvas.focus?.();
  start(update, render);
}

startBtn.addEventListener("click", begin);
// also allow Enter / Space to start
window.addEventListener("keydown", (e) => {
  if (!started && (e.key === "Enter" || e.key === " ")) begin();
});
