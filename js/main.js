import { start } from "./engine/loop.js";
import { input } from "./engine/input.js";
import { createCamera } from "./engine/camera.js";
import { createPlayer } from "./entities/player.js";
import { createWorld } from "./world/scene.js";
import { SCENES } from "./content/scenes.js";
import * as Dialogue from "./ui/dialogue.js";
import * as Prompt from "./ui/prompt.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const startBtn = document.getElementById("start-btn");
const boot = document.getElementById("boot");
const game = document.getElementById("game");

const camera = createCamera(canvas.width, canvas.height);
const player = createPlayer(0, 0); // real position comes from the starting scene's spawn
const world = createWorld(SCENES, "village", "default", player, camera);

let started = false;

function update(dt) {
  // Freeze input while a scene fade is playing.
  if (world.transitioning) {
    world.update(dt);
    Prompt.hide();
    return;
  }

  if (Dialogue.isOpen()) {
    if (input.consumePressed("cancel") || input.consumePressed("interact")) Dialogue.close();
    return;
  }

  const scene = world.scene;
  player.update(dt, input, scene);

  // Interior exit mats (and any step-triggered portal) fire on arrival.
  if (!player.moving) {
    const sp = scene.stepPortalAt(player.tileX, player.tileY);
    if (sp) {
      Prompt.hide();
      world.trigger(sp);
      return;
    }
  }

  camera.follow(player, scene.bounds);

  // Interaction prompt + activation.
  const nearby = scene.interactableInFront(player);
  if (nearby) {
    const pc = player.centerScreen(camera);
    Prompt.show(`Press E — ${nearby.label}`, pc.x, pc.y);
    if (input.consumePressed("interact")) {
      Prompt.hide();
      nearby.activate({ world, dialogue: Dialogue, player });
    }
  } else {
    Prompt.hide();
  }
}

function render() {
  world.scene.render(ctx, camera, canvas, player);
  world.renderOverlay(ctx, canvas);
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
