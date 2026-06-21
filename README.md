# VillagePortfolio

An interactive top-down village that doubles as a personal portfolio. Walk a character around with WASD/arrow keys and press <kbd>E</kbd> to step inside buildings — each interior holds objects and people you can examine for a different slice of who I am (about, projects, background, contact), plus a few familiar faces hidden around town.

Built with vanilla HTML, CSS, and JavaScript. No build step, no dependencies. Hosted on GitHub Pages.

## Run locally

Any static file server works. From the repo root:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly via `file://` won't work — ES modules require an HTTP origin.

## Controls

- **WASD** or **arrow keys** — move (grid-locked, one tile per step; tap to turn, hold to walk)
- **E** — enter a building (face its door), or examine an object / talk to a villager (face it)
- Walk onto the **EXIT** mat to leave a building
- **Esc** or **E** — close a dialogue
- Click **"résumé view ↗"** in the corner for a plain text version

## Deploying to GitHub Pages

1. Push the repo to GitHub.
2. Settings → Pages → Source: `Deploy from a branch`, Branch: `main` / `(root)`.
3. The site will be at `https://<username>.github.io/VillagePortfolio/`.

## Adding sprites

The game ships with colored-rectangle placeholders so it runs from day one. Drop real PNG sprites into `assets/sprites/` using the filenames listed in [`assets/sprites/README.md`](assets/sprites/README.md) and they'll replace the placeholders automatically.

## Editing content

The entire world — maps, buildings, objects, and NPCs — lives in [`js/content/scenes.js`](js/content/scenes.js). Each object/NPC has a `content` block; edit the strings, add/remove items, or reshape the maps. The five marquee assets (the home photo wall, workshop workstation, library records, post-office mailbox, garden notice board) carry the real bio; the rest are placeholders to fill in.
