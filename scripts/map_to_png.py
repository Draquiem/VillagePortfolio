#!/usr/bin/env python3
"""
Export the current RAW array in js/world/map.js as a PNG you can edit.

Useful as a starting point: run this once, open the PNG in your editor,
paint on top of it, then convert it back with png_to_map.py.

    python3 scripts/map_to_png.py             # writes assets/maps/village.png
    python3 scripts/map_to_png.py -o foo.png  # custom output path
    python3 scripts/map_to_png.py --tile-size 16   # smaller export
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

from PIL import Image

PALETTE: dict[int, tuple[int, int, int]] = {
    0: (0x4f, 0x9d, 0x3a),  # grass
    1: (0x3d, 0x7d, 0x2c),  # grass_dark
    2: (0xc9, 0xa8, 0x6a),  # path
    3: (0x3a, 0x7c, 0xa5),  # water
    4: (0xe5, 0x31, 0x70),  # flower
    5: (0xe7, 0xcf, 0x9e),  # sand
    6: (0x9a, 0x95, 0x8c),  # stone
    7: (0x7a, 0x4a, 0x22),  # bridge
}

REPO = Path(__file__).resolve().parent.parent
MAP_JS = REPO / "js" / "world" / "map.js"

RAW_RE = re.compile(r'const RAW = \[(.*?)\];', re.DOTALL)
ROW_RE = re.compile(r'"([0-7]+)"')


def load_raw() -> list[str]:
    block = RAW_RE.search(MAP_JS.read_text())
    if not block:
        raise SystemExit(f"could not find RAW block in {MAP_JS}")
    rows = ROW_RE.findall(block.group(1))
    if not rows:
        raise SystemExit("RAW block has no string rows")
    width = len(rows[0])
    for i, r in enumerate(rows):
        if len(r) != width:
            raise SystemExit(f"row {i} has width {len(r)}, expected {width}")
    return rows


def render(rows: list[str], tile_size: int) -> Image.Image:
    w = len(rows[0]) * tile_size
    h = len(rows) * tile_size
    img = Image.new("RGB", (w, h))
    px = img.load()
    for ty, row in enumerate(rows):
        for tx, ch in enumerate(row):
            color = PALETTE[int(ch)]
            for dy in range(tile_size):
                for dx in range(tile_size):
                    px[tx * tile_size + dx, ty * tile_size + dy] = color
    return img


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("-o", "--output", type=Path, default=REPO / "assets" / "maps" / "village.png")
    ap.add_argument("--tile-size", type=int, default=32)
    args = ap.parse_args()

    rows = load_raw()
    img = render(rows, args.tile_size)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    img.save(args.output)
    print(f"wrote {img.size[0]}x{img.size[1]} -> {args.output}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
