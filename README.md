# VillagePortfolio

An interactive top-down village that doubles as a personal portfolio. Walk a character around with WASD/arrow keys and press <kbd>E</kbd> to enter buildings — each one reveals a different slice of who I am (about, projects, background, contact).

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
- **E** — interact (stand in front of a building's door, face it, and press)
- **Esc** or **E** — close a dialogue
- Click **"résumé view ↗"** in the corner for a plain text version

## Deploying to GitHub Pages

1. Push the repo to GitHub.
2. Settings → Pages → Source: `Deploy from a branch`, Branch: `main` / `(root)`.
3. The site will be at `https://<username>.github.io/VillagePortfolio/`.

## Adding sprites

The game ships with colored-rectangle placeholders so it runs from day one. Drop real PNG sprites into `assets/sprites/` using the filenames listed in [`assets/sprites/README.md`](assets/sprites/README.md) and they'll replace the placeholders automatically.

## Editing content

All portfolio content lives in [`js/content/buildings.js`](js/content/buildings.js). Each building has a `content` block — edit the strings, add/remove buildings, change positions.
