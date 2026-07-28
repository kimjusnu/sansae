"""
Turn the source video into the scroll-scrub frame sets.

Reads design/sequence-source/<SOURCE>, extracts a time window, crops it,
and writes two WebP frame sets plus a poster and a manifest into
portfolio/sequence/.

    python design/build-sequence.py

Swapping in a new video is a two-line change: point SOURCE at it and reset
WINDOW / CROP. Nothing in the site code hardcodes the frame count — the
browser reads it from the generated manifest.
"""

import json
import pathlib
import shutil
import subprocess
import sys
import tempfile

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "design" / "sequence-source"
OUT_DIR = ROOT / "portfolio" / "sequence"

SOURCE = "3.mp4"

# ---------------------------------------------------------------------------
# 3.mp4 is the one that matches the brief: brightness stays at 218-242 and blue
# coverage at 14-22% for the whole clip, with no studio rig in frame. Motion is
# even throughout (per-frame change 1.3-2.7, no static tail), so the whole
# 8 seconds is usable and nothing needs cropping.
# ---------------------------------------------------------------------------
WINDOW = (0.0, 8.0)  # seconds (start, end)
CROP = None          # x, y, w, h in source pixels, or None for the full frame

# A wheel notch moves ~100px, so coarse frames read as stepping no matter how
# the scroll is smoothed. The renderer damps the progress value; this keeps the
# frames fine enough for that damping to have something to interpolate over.
MAX_FRAMES = 192

# Softness in a blurred backdrop goes unnoticed; a choppy scrub does not.
# So the mobile set gives up resolution rather than frames to hit its budget.
SETS = {
    "hd": {"width": 1024, "height": 576, "budget_kb": 2600},
    "sd": {"width": 448, "height": 252, "budget_kb": 700},
}
POSTER_BUDGET_KB = 60
QUALITY_START = 82
QUALITY_FLOOR = 55


def ffmpeg() -> str:
    exe = shutil.which("ffmpeg")
    if not exe:
        sys.exit("ffmpeg not found on PATH")
    return exe


def extract(tmp: pathlib.Path) -> list[pathlib.Path]:
    """Pull the chosen window out of the source at its native frame rate."""
    src = SRC_DIR / SOURCE
    if not src.exists():
        sys.exit(f"source video not found: {src}")

    start, end = WINDOW
    args = [ffmpeg(), "-v", "error", "-ss", str(start), "-t", str(end - start), "-i", str(src)]
    if CROP:
        x, y, w, h = CROP
        args += ["-vf", f"crop={w}:{h}:{x}:{y}"]
    args += ["-fps_mode", "passthrough", str(tmp / "%04d.png")]
    subprocess.run(args, check=True)

    frames = sorted(tmp.glob("*.png"))
    if not frames:
        sys.exit("ffmpeg produced no frames — check WINDOW against the clip length")

    # Even-sample down if the window is long enough to overshoot the cap.
    if len(frames) > MAX_FRAMES:
        step = len(frames) / MAX_FRAMES
        frames = [frames[int(i * step)] for i in range(MAX_FRAMES)]
    return frames


def encode_set(frames: list[pathlib.Path], name: str, spec: dict) -> dict:
    """Write one resolution of the sequence, backing off quality to fit budget."""
    dest = OUT_DIR / name
    if dest.exists():
        shutil.rmtree(dest)
    dest.mkdir(parents=True)

    size = (spec["width"], spec["height"])
    quality = QUALITY_START
    while True:
        total = 0
        for i, f in enumerate(frames):
            out = dest / f"{i:04d}.webp"
            Image.open(f).convert("RGB").resize(size, Image.LANCZOS).save(
                out, "WEBP", quality=quality, method=6
            )
            total += out.stat().st_size
        kb = total / 1024
        if kb <= spec["budget_kb"] or quality <= QUALITY_FLOOR:
            return {"name": name, "quality": quality, "kb": kb, "frames": len(frames)}
        quality -= 6


def write_poster(frame: pathlib.Path) -> float:
    spec = SETS["hd"]
    quality = QUALITY_START
    out = OUT_DIR / "poster.webp"
    while True:
        Image.open(frame).convert("RGB").resize(
            (spec["width"], spec["height"]), Image.LANCZOS
        ).save(out, "WEBP", quality=quality, method=6)
        kb = out.stat().st_size / 1024
        if kb <= POSTER_BUDGET_KB or quality <= QUALITY_FLOOR:
            return kb
        quality -= 6


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        frames = extract(pathlib.Path(tmp))
        results = [encode_set(frames, name, spec) for name, spec in SETS.items()]
        poster_kb = write_poster(frames[0])

        manifest = {
            "count": len(frames),
            "poster": "poster.webp",
            "sets": {
                name: {"dir": name, "width": spec["width"], "height": spec["height"]}
                for name, spec in SETS.items()
            },
            "source": {"file": SOURCE, "window": list(WINDOW), "crop": list(CROP) if CROP else None},
        }
        (OUT_DIR / "manifest.json").write_text(
            json.dumps(manifest, indent=2), encoding="utf-8"
        )

    over = []
    for r in results:
        budget = SETS[r["name"]]["budget_kb"]
        flag = ""
        if r["kb"] > budget:
            flag = f"  OVER BUDGET by {r['kb'] - budget:.0f} KB"
            over.append(r["name"])
        print(f"{r['name']:>3s}  {r['frames']:3d} frames  q{r['quality']}  {r['kb']:7.0f} KB{flag}")
    print(f"poster                q--  {poster_kb:7.0f} KB")
    print(f"\nframe count {len(frames)} written to manifest.json")

    if over:
        # Quality alone could not get there — say so rather than shipping quietly.
        print(
            f"\nWARNING: {', '.join(over)} hit the q{QUALITY_FLOOR} floor and is still over "
            f"budget. Lower the set's width/height or shorten WINDOW."
        )


if __name__ == "__main__":
    main()
