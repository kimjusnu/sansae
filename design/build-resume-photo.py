"""
Turns the studio headshot into the one file the resume actually loads.

The blue-background take is used rather than the grey one: its background sits
in the same range as the site's --primary-200, so the photo reads as part of
the page instead of a sticker pasted onto it.

Run:  python design/build-resume-photo.py
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "design" / "photo-source" / "headshot-blue.jpg"
OUT = ROOT / "portfolio" / "resume" / "photo.webp"

# 3:4 is the Korean 반명함 proportion, and the one the resume layout reserves.
RATIO = 3 / 4
WIDTH = 600
BUDGET_KB = 60


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"원본이 없습니다: {SOURCE}")

    im = Image.open(SOURCE).convert("RGB")
    w, h = im.size

    # Crop to ratio. The source is taller than 3:4, and a headshot has its
    # headroom at the top, so the excess comes off the bottom.
    target_h = round(w / RATIO)
    if target_h <= h:
        im = im.crop((0, 0, w, target_h))
    else:
        target_w = round(h * RATIO)
        left = (w - target_w) // 2
        im = im.crop((left, 0, left + target_w, h))

    im = im.resize((WIDTH, round(WIDTH / RATIO)), Image.LANCZOS)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    for quality in (92, 88, 84, 80, 74):
        im.save(OUT, "WEBP", quality=quality, method=6)
        kb = OUT.stat().st_size / 1024
        if kb <= BUDGET_KB:
            break
    else:
        print(f"경고: 예산 {BUDGET_KB}KB를 넘었습니다 ({kb:.0f}KB)")

    print(f"{OUT.relative_to(ROOT)}  {im.size[0]}x{im.size[1]}  {kb:.0f}KB  q{quality}")


if __name__ == "__main__":
    main()
