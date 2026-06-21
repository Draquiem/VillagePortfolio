// A brief location-name banner shown whenever the player enters a scene,
// in the spirit of Pokémon town signs. Pure CSS fade; auto-hides.
const el = document.getElementById("banner");
let timer = 0;

export function show(name) {
  if (!el) return;
  el.textContent = name;
  el.hidden = false;
  // restart the fade animation even if it's already showing
  el.classList.remove("banner--show");
  void el.offsetWidth; // force reflow
  el.classList.add("banner--show");
  clearTimeout(timer);
  timer = setTimeout(() => el.classList.remove("banner--show"), 2200);
}
