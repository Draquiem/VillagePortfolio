# Sprites

Drop PNGs in this folder with the exact filenames below. Anything missing is silently replaced by a labeled colored rectangle, so the game stays playable while you draw.

## Player (24×28 px each, transparent background)

- `player_down.png`
- `player_up.png`
- `player_left.png`
- `player_right.png`

Later, when you want walk animations, switch to a horizontal strip sprite sheet — the `assets.js` loader will need a small update at that point.

## Buildings (96×64 px each — 3 tiles wide × 2 tall)

- `building_home.png` — cottage / pink theme
- `building_workshop.png` — workshop / orange theme
- `building_library.png` — library / purple theme
- `building_post.png` — post office / green theme
- `building_garden.png` — garden / 4 tiles wide × 2 tall (128×64)

## Recommended workflow

- **Aseprite** ($20, best for pixel art) or **Piskel** (free, web-based) for drawing.
- Use a 32×32 base tile grid.
- Keep palettes consistent — the placeholders use these accents you can match:
  - Home: `#e53170` (pink)
  - Workshop: `#ff8906` (orange)
  - Library: `#7f5af0` (purple)
  - Post Office: `#2cb67d` (green)
  - Garden: `#f25f4c` (red-orange)
- Export as PNG with transparent background.
