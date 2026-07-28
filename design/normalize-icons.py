"""
Normalise the raw 3D icon renders into a consistent, web-sized set.

The generated renders vary in canvas aspect (1:1 and 3:2) and in how much of
the frame the object fills (34%-73%), which makes them read as different
collections once they sit next to each other on the page. This script:

  1. finds the solid object (alpha > 200), ignoring the baked-in glow
  2. re-crops each icon to a square centred on that object
  3. scales every object to the same fraction of the canvas
  4. resizes to the size actually needed on the page (2x the CSS size)
  5. encodes to WebP, which handles these soft gradients far better than PNG
     (the hero drops 493 KB -> 128 KB with no visible difference; palette-
     quantised PNG was rejected because it bands across the glow)

Source of truth is design/icons-source/ (PNG). Output is portfolio/icons/
(WebP). Re-run after dropping new renders into the source folder.
"""

import pathlib
from PIL import Image

SRC = pathlib.Path(__file__).resolve().parent / "icons-source"
DEST = pathlib.Path(__file__).resolve().parent.parent / "portfolio" / "icons"

# Fraction of the square canvas the object should occupy on its longest side.
# 0.68 leaves a 16% safe margin per side, matching the art direction.
OBJECT_FRACTION = 0.68

# Output edge length per icon, at roughly 2x its largest CSS display size.
OUTPUT_SIZE = {
    "icon-hero-product-build": 880,   # displayed up to 440px
    "icon-cta-contact": 440,          # displayed up to 200px
}
DEFAULT_SIZE = 264                    # features 104px, process 80px

WEBP_QUALITY = 90


def solid_bbox(image: Image.Image) -> tuple[int, int, int, int]:
    """Bounding box of the object itself, excluding the soft glow."""
    mask = image.getchannel("A").point(lambda v: 255 if v > 200 else 0)
    box = mask.getbbox()
    if box is None:
        raise ValueError("image has no opaque pixels")
    return box


def normalise(path: pathlib.Path) -> dict:
    src = Image.open(path).convert("RGBA")
    left, top, right, bottom = solid_bbox(src)
    obj_w, obj_h = right - left, bottom - top

    # Square crop centred on the object, sized so the object fills the target
    # fraction. Areas outside the source are filled with transparency.
    crop_edge = round(max(obj_w, obj_h) / OBJECT_FRACTION)
    cx, cy = (left + right) / 2, (top + bottom) / 2
    box = (
        round(cx - crop_edge / 2),
        round(cy - crop_edge / 2),
        round(cx + crop_edge / 2),
        round(cy + crop_edge / 2),
    )
    square = src.crop(box)  # PIL pads out-of-bounds with transparent pixels

    edge = OUTPUT_SIZE.get(path.stem, DEFAULT_SIZE)
    out = square.resize((edge, edge), Image.LANCZOS)

    dest = DEST / f"{path.stem}.webp"
    out.save(dest, "WEBP", quality=WEBP_QUALITY, method=6)
    return {
        "name": dest.name,
        "from": f"{src.width}x{src.height}",
        "to": f"{edge}x{edge}",
        "kb_before": path.stat().st_size / 1024,
        "kb_after": dest.stat().st_size / 1024,
    }


def main() -> None:
    DEST.mkdir(parents=True, exist_ok=True)
    for stale in DEST.glob("*.png"):
        stale.unlink()
    rows = [normalise(p) for p in sorted(SRC.glob("*.png"))]
    before = sum(r["kb_before"] for r in rows)
    after = sum(r["kb_after"] for r in rows)
    for r in rows:
        print(
            f"{r['name']:32s} {r['from']:>9s} -> {r['to']:>8s}  "
            f"{r['kb_before']:8.0f} KB -> {r['kb_after']:7.0f} KB"
        )
    print(f"\ntotal {before / 1024:.1f} MB -> {after / 1024:.2f} MB "
          f"({after / before * 100:.1f}% of original)")


if __name__ == "__main__":
    main()
