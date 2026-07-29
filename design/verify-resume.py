"""
Checks the generated resume PDFs against the things that actually break.

Run after design/build-resume-pdf.mjs:  python design/verify-resume.py

Each check exists because it caught something:
  - page count      the responsive breakpoint at 820px also matched the printed
                    page box (A4 is 794px at 96dpi), collapsing every grid and
                    running the sheet to 351mm
  - broken glyphs   font-variant-numeric: tabular-nums substituted glyphs that
                    Chrome exported with no ToUnicode mapping, so every date
                    extracted as private-use characters
  - key phrases     an ATS reads the extracted text, not the picture
  - the photo       Korean resumes carry one, English-language ones should not
"""

import re
import sys
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
PDF_DIR = ROOT / "portfolio" / "resume"

COMMON = ["AimBe Lab", "Componique", "StartupQT", "Eat Fit", "Wairi", "My Feed",
          "junsu4621@naver.com", "3.45", "RBAC", "FastAPI", "ADsP", "GA4",
          "2025.07", "2020.03", "2026.02"]
EXPECT = {
    "ko": COMMON + ["김준수", "캡스톤", "현재", "한국공학대학교"],
    "en": COMMON + ["Junsu Kim", "Capstone", "Present", "Tech University of Korea"],
}
PHOTOS = {"ko": 1, "en": 0}

# Anything in the Unicode private use area means a glyph lost its mapping.
PUA = re.compile(r"[-]")

A4_PT = (595.28, 841.89)


def main() -> int:
    failures = 0
    for lang, expected in EXPECT.items():
        path = PDF_DIR / f"resume-{lang}.pdf"
        if not path.exists():
            print(f"FAIL  [{lang}] 파일이 없습니다 — build-resume-pdf.mjs를 먼저 실행하세요")
            failures += 1
            continue

        reader = PdfReader(path)
        text = "\n".join(p.extract_text() or "" for p in reader.pages)
        box = reader.pages[0].mediabox
        images = sum(len(p.images) for p in reader.pages)

        problems = []
        if len(reader.pages) != 1:
            problems.append(f"{len(reader.pages)}페이지 (1페이지여야 함)")
        if abs(box.width - A4_PT[0]) > 2 or abs(box.height - A4_PT[1]) > 2:
            problems.append(f"{box.width:.0f}x{box.height:.0f}pt (A4가 아님)")
        missing = [w for w in expected if w not in text]
        if missing:
            problems.append(f"추출 안 된 항목 {missing}")
        broken = PUA.findall(text)
        if broken:
            problems.append(f"깨진 글리프 {len(broken)}자")
        if len(text) < 800:
            problems.append(f"텍스트 {len(text)}자 — 이미지로 렌더된 듯")
        if images != PHOTOS[lang]:
            problems.append(f"이미지 {images}개 (기대 {PHOTOS[lang]}개)")

        if problems:
            failures += 1
            print(f"FAIL  [{lang}] " + " · ".join(problems))
        else:
            print(f"PASS  [{lang}] 1페이지 · A4 · 텍스트 {len(text)}자 · 이미지 {images}개")

    print("\nALL CHECKS PASSED" if not failures else f"\n{failures}건 실패")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
