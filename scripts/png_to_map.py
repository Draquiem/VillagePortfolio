#!/usr/bin/env python3
"""
Convert a hand-drawn map PNG into the RAW string array used by
js/world/map.js.

Workflow:
    1. Draw a 960x640 PNG (30 tiles wide x 20 tiles tall, 32 px per tile)
       using the palette below. Each 32x32 block in the PNG becomes one
       tile in the game.
    2. Run:    python3 scripts/png_to_map.py path/to/your_map.png
    3. Copy the printed RAW array into js/world/map.js (replacing the
       existing RAW = [...] block).

Pass --write to overwrite js/world/map.js automatically.
Pass --tile-size N to use a different pixel-per-tile scale (default 32).

The script samples the center pixel of each tile block and snaps it to
the closest palette color (Euclidean RGB distance), so light editor
anti-aliasing won't break things.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

from PIL import Image


# Tile-id -> (name, RGB) -- mirrors COLORS in js/world/tiles.js
PALETTE: list[tuple[int, str, tuple[int, int, int]]] = [
    (0, "grass",      (0x4f, 0x9d, 0x3a)),
    (1, "grass_dark", (0x3d, 0x7d, 0x2c)),
    (2, "path",       (0xc9, 0xa8, 0x6a)),
    (3, "water",      (0x3a, 0x7c, 0xa5)),
    (4, "flower",     (0xe5, 0x31, 0x70)),
    (5, "sand",       (0xe7, 0xcf, 0x9e)),
    (6, "stone",      (0x9a, 0x95, 0x8c)),
    (7, "bridge",     (0x7a, 0x4a, 0x22)),
]


def nearest_tile(rgb: tuple[int, int, int]) -> int:
    r, g, b = rgb
    best_id = 0
    best_dist = 1 << 30
    for tid, _name, (pr, pg, pb) in PALETTE:
        d = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2
        if d < best_dist:
            best_dist = d
            best_id = tid
    return best_id


def png_to_rows(png_path: Path, tile_size: int) -> list[str]:
    img = Image.open(png_path).convert("RGB")
    w, h = img.size
    if w % tile_size or h % tile_size:
        raise SystemExit(
            f"image size {w}x{h} is not a multiple of tile size {tile_size}"
        )

    map_w = w // tile_size
    map_h = h // tile_size
    px = img.load()

    rows: list[str] = []
    for ty in range(map_h):
        digits = []
        for tx in range(map_w):
            cx = tx * tile_size + tile_size // 2
            cy = ty * tile_size + tile_size // 2
            digits.append(str(nearest_tile(px[cx, cy])))
        rows.append("".join(digits))
    return rows


def format_raw_block(rows: list[str]) -> str:
    width = len(rows[0])
    out = ["// prettier-ignore", "const RAW = ["]
    for i, row in enumerate(rows):
        out.append(f'  "{row}", // {i:>2}')
    out.append("];")
    out.append("")
    out.append(f"// {width} x {len(rows)} tiles")
    return "\n".join(out)


MAP_JS = Path(__file__).resolve().parent.parent / "js" / "world" / "map.js"
RAW_BLOCK_RE = re.compile(
    r"// prettier-ignore\nconst RAW = \[.*?\];",
    re.DOTALL,
)


def overwrite_map_js(rows: list[str]) -> None:
    if not MAP_JS.exists():
        raise SystemExit(f"could not find {MAP_JS}")
    src = MAP_JS.read_text()
    new_block = (
        "// prettier-ignore\nconst RAW = [\n"
        + "\n".join(f'  "{r}", // {i:>2}' for i, r in enumerate(rows))
        + "\n];"
    )
    if not RAW_BLOCK_RE.search(src):
        raise SystemExit("could not locate existing RAW block in map.js")
    MAP_JS.write_text(RAW_BLOCK_RE.sub(new_block, src))
    print(f"wrote new RAW ({len(rows[0])} x {len(rows)}) into {MAP_JS}")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("png", type=Path, help="path to the map PNG")
    ap.add_argument("--tile-size", type=int, default=32, help="pixels per tile (default 32)")
    ap.add_argument("--write", action="store_true", help="overwrite js/world/map.js in place")
    args = ap.parse_args()

    rows = png_to_rows(args.png, args.tile_size)
    if args.write:
        overwrite_map_js(rows)
    else:
        print(format_raw_block(rows))
    return 0


if __name__ == "__main__":
    sys.exit(main())
