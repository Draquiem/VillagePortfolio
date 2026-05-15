// Renders structured content blocks inside the dialogue modal.
// Content schema:
//   { title: string, blocks: [
//      { type: "text", text: string },
//      { type: "list", items: string[] },
//      { type: "link", href: string, text: string },
//      { type: "kv", pairs: [[key, value], ...] }
//   ] }

const root = document.getElementById("dialogue");
const titleEl = document.getElementById("dialogue-title");
const bodyEl = document.getElementById("dialogue-body");
const closeBtn = document.getElementById("dialogue-close");

let openState = false;
let closeHandlers = [];

closeBtn.addEventListener("click", close);
root.addEventListener("click", (e) => {
  if (e.target === root) close();
});

function renderBlocks(blocks) {
  bodyEl.innerHTML = "";
  for (const b of blocks) {
    if (b.type === "text") {
      const p = document.createElement("p");
      p.innerHTML = b.text;
      bodyEl.appendChild(p);
    } else if (b.type === "list") {
      const ul = document.createElement("ul");
      for (const item of b.items) {
        const li = document.createElement("li");
        li.innerHTML = item;
        ul.appendChild(li);
      }
      bodyEl.appendChild(ul);
    } else if (b.type === "link") {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = b.href;
      a.textContent = b.text;
      a.target = "_blank";
      a.rel = "noopener";
      p.appendChild(a);
      bodyEl.appendChild(p);
    } else if (b.type === "kv") {
      const dl = document.createElement("dl");
      for (const [k, v] of b.pairs) {
        const dt = document.createElement("dt");
        dt.textContent = k;
        const dd = document.createElement("dd");
        dd.innerHTML = v;
        dl.appendChild(dt);
        dl.appendChild(dd);
      }
      bodyEl.appendChild(dl);
    }
  }
}

export function open(content) {
  titleEl.textContent = content.title;
  renderBlocks(content.blocks || []);
  root.hidden = false;
  openState = true;
  closeBtn.focus();
}

export function close() {
  root.hidden = true;
  openState = false;
  for (const fn of closeHandlers) fn();
}

export function isOpen() { return openState; }

export function onClose(fn) { closeHandlers.push(fn); }
