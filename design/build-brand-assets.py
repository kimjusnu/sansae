"""
Build the favicon, app icons and social share image from their sources.

Sources of truth:
  portfolio/favicon.svg      the brand mark
  design/og-template.html    the share-card template

Everything else in portfolio/ is generated. Re-run after editing either source.
Requires a local dev server on the port below, because Chrome renders the
templates through it:

    python -m http.server 3000 --bind 127.0.0.1 --directory portfolio
    python design/build-brand-assets.py
"""

import io
import pathlib
import subprocess
import sys
import tempfile
import urllib.request

from PIL import Image

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
ORIGIN = "http://127.0.0.1:3000"
ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = ROOT / "portfolio"


def shoot(path: str, width: int, height: int, transparent: bool = False) -> Image.Image:
    """Screenshot a page served by the dev server and return it as an image."""
    with tempfile.TemporaryDirectory() as tmp:
        out = pathlib.Path(tmp) / "shot.png"
        args = [
            CHROME, "--headless=new", "--disable-gpu", "--no-sandbox",
            "--hide-scrollbars", "--force-prefers-reduced-motion",
            "--virtual-time-budget=5000",
            f"--window-size={width},{height}",
            f"--screenshot={out}",
        ]
        if transparent:
            args.append("--default-background-color=00000000")
        args.append(f"{ORIGIN}/{path}")
        subprocess.run(args, capture_output=True, check=False)
        if not out.exists():
            raise RuntimeError(f"Chrome produced no screenshot for {path}")
        return Image.open(io.BytesIO(out.read_bytes())).convert("RGBA")


def require_server() -> None:
    try:
        urllib.request.urlopen(f"{ORIGIN}/index.html", timeout=3).read(1)
    except Exception as exc:
        sys.exit(f"dev server not reachable at {ORIGIN} — {exc}\n"
                 f"start it with: python -m http.server 3000 --bind 127.0.0.1 "
                 f"--directory portfolio")


def build_icons() -> list[tuple[str, int]]:
    written = []

    # Rounded mark on transparency — browser tabs and the web manifest.
    mark = shoot("favicon.svg", 512, 512, transparent=True)

    ico = SITE / "favicon.ico"
    mark.resize((48, 48), Image.LANCZOS).save(
        ico, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)]
    )
    written.append((ico.name, ico.stat().st_size))

    for edge in (192, 512):
        p = SITE / f"icon-{edge}.png"
        mark.resize((edge, edge), Image.LANCZOS).save(p, "PNG", optimize=True)
        written.append((p.name, p.stat().st_size))

    # iOS composites transparent icons onto black, so the touch icon is
    # full-bleed: same mark rendered without the corner radius.
    square_svg = SITE / "_apple-icon.svg"
    square_svg.write_text(
        (SITE / "favicon.svg").read_text(encoding="utf-8").replace('rx="8"', 'rx="0"'),
        encoding="utf-8",
    )
    try:
        full = shoot("_apple-icon.svg", 512, 512)
        p = SITE / "apple-touch-icon.png"
        full.convert("RGB").resize((180, 180), Image.LANCZOS).save(p, "PNG", optimize=True)
        written.append((p.name, p.stat().st_size))
    finally:
        square_svg.unlink(missing_ok=True)

    return written


def build_og() -> list[tuple[str, int]]:
    # The template needs the site's own CSS and icons, so it is rendered from
    # inside portfolio/ and removed again — it is not part of the deployed site.
    staged = SITE / "_og.html"
    staged.write_text(
        (ROOT / "design" / "og-template.html").read_text(encoding="utf-8"),
        encoding="utf-8",
    )
    try:
        card = shoot("_og.html", 1200, 630).convert("RGB")
    finally:
        staged.unlink(missing_ok=True)

    p = SITE / "og-image.png"
    card.save(p, "PNG", optimize=True)
    if p.stat().st_size > 300 * 1024:
        # Keep the share image light; chat clients re-download it per preview.
        p.unlink()
        p = SITE / "og-image.jpg"
        card.save(p, "JPEG", quality=88, optimize=True, progressive=True)
    return [(p.name, p.stat().st_size)]


def main() -> None:
    require_server()
    rows = build_icons() + build_og()
    for name, size in rows:
        print(f"{name:24s} {size / 1024:7.1f} KB")


if __name__ == "__main__":
    main()
