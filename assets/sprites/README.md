# Sprites

Drop PNGs in this folder with the exact filenames below. Anything missing is silently replaced by a labeled colored rectangle, so the game stays playable while you draw.

The world runs on a **64×64 px base tile**. Draw at the exact target size with a transparent background — don't draw big and downscale (it muddies the pixels).

## Player

The renderer draws the player **48 px wide × 64 px tall**, feet-anchored at the bottom of its tile (a taller sprite would overhang the tile above — fine if you want a bigger head).

You can supply the player art in **either** of two ways:

### Option A — walk-cycle sheet (preferred, animated)

One file `player.png` laid out as a **3 columns × 4 rows** grid:

```
            col 0      col 1      col 2
            (stand)   (step A)   (step B)
row 0  down  [   ]      [   ]      [   ]
row 1  left  [   ]      [   ]      [   ]
row 2  right [   ]      [   ]      [   ]
row 3  up    [   ]      [   ]      [   ]
```

- Each cell should be **48×64** (so the sheet is 144×256), but any size works — the engine reads frame size as `width/3 × height/4` and scales to 48×64.
- Walking alternates step A / step B with a stand frame between; standing shows col 0.
- `left` and `right` are mirror images, so it's really only ~2 new poses per frame column.

### Option B — four static facings (no animation)

If `player.png` is absent, the engine falls back to one static image per direction:

- `player_down.png`
- `player_up.png`
- `player_left.png`
- `player_right.png`

Each **48×64 px**, transparent background. (If these are missing too, you get the placeholder rectangle.)

## Buildings (3 tiles wide × 2 tall = 192×128 px, transparent background)

- `building_home.png` — cottage / pink theme
- `building_workshop.png` — workshop / orange theme
- `building_library.png` — library / purple theme
- `building_post.png` — post office / green theme
- `building_garden.png` — garden / **4 tiles wide × 2 tall (256×128)**

The door is on the **bottom** side of each building — the player walks up to the tile directly below the door's center and faces up to interact, so put the door at the bottom-center of the art.

## Recommended workflow

- **Aseprite** ($20, best for pixel art) or **Piskel** (free, web-based) for drawing.
- Use a 64×64 base tile grid.
- Keep palettes consistent — the placeholders use these accents you can match:
  - Home: `#e53170` (pink)
  - Workshop: `#ff8906` (orange)
  - Library: `#7f5af0` (purple)
  - Post Office: `#2cb67d` (green)
  - Garden: `#f25f4c` (red-orange)
- Export as PNG with transparent background.
