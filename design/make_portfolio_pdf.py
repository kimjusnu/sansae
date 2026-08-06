# -*- coding: utf-8 -*-
"""지원용 포트폴리오 PDF — 검증된 사실만 사용 (source/ 근거)

사용법:
  python design/make_portfolio_pdf.py            # 범용판 → job-change/포트폴리오-김준수.pdf
  python design/make_portfolio_pdf.py saltlux    # 솔트룩스판 (JD 순서 재배치) → 2-솔트룩스/제출물/
"""
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable, KeepTogether,
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

VARIANT = sys.argv[1] if len(sys.argv) > 1 else "generic"

pdfmetrics.registerFont(TTFont("Malgun", r"C:\Windows\Fonts\malgun.ttf"))
pdfmetrics.registerFont(TTFont("MalgunB", r"C:\Windows\Fonts\malgunbd.ttf"))

INK = HexColor("#1a2233")
ACCENT = HexColor("#2456c8")
MUTED = HexColor("#5a6478")
LINE = HexColor("#d8dde8")

S = {
    "name": ParagraphStyle("name", fontName="MalgunB", fontSize=22, leading=28, textColor=INK),
    "contact": ParagraphStyle("contact", fontName="Malgun", fontSize=9, leading=13.5, textColor=MUTED),
    "intro": ParagraphStyle("intro", fontName="Malgun", fontSize=9.6, leading=15.5, textColor=INK, spaceBefore=6),
    "h1": ParagraphStyle("h1", fontName="MalgunB", fontSize=13, leading=17, textColor=ACCENT, spaceBefore=13, spaceAfter=2),
    "meta": ParagraphStyle("meta", fontName="Malgun", fontSize=8.6, leading=12.5, textColor=MUTED, spaceAfter=4),
    "li": ParagraphStyle("li", fontName="Malgun", fontSize=9.2, leading=14.2, textColor=INK, leftIndent=9, spaceAfter=2),
    "small": ParagraphStyle("small", fontName="Malgun", fontSize=7.8, leading=11, textColor=MUTED),
}

def bullet(t):
    return Paragraph(f"•  {t}", S["li"])

def hr(thick=0.7):
    return HRFlowable(width="100%", thickness=thick, color=LINE, spaceBefore=5, spaceAfter=5)

def project(no, title, meta, bullets, stack):
    parts = [Paragraph(f"{no}. {title}", S["h1"]), Paragraph(meta, S["meta"])]
    parts += [bullet(b) for b in bullets]
    parts.append(Paragraph(f"<font color='#5a6478'>기술:</font> {stack}", S["meta"]))
    return KeepTogether(parts)

# ── 프로젝트 정의 (순서 무관 데이터)
P_MYFEED = (
    "My Feed — 축산 IoT 모니터링·주문 SaaS (에임비랩, 재직 중)  [AI 분류 오류율 10%→3%]",
    "2025.07–현재 · 웹 2인 체제, 본인 커밋 약 38% · 모니터링·admin·웹 알림·성능 정비 주도",
    [
        "기존 이미지 분석 AI(SAM)의 낮은 정확도가 답답해 직접 대안을 조사, <b>SAM2 교체를 제안·적용해 분류 오류율 10%→3%</b> "
        "(오분류는 수동 검수로 넘어가는 구조라, 수동 검수 유입 비율로 측정)",
        "브라우저 업데이트로 웹푸시가 조용히 끊기는 장애 → OS 이벤트 로그로 파이프라인을 <b>홉 단위 추적</b>해 브라우저 내부 소실을 실측 특정, "
        "가설 4개를 실험으로 배제한 뒤 <b>푸시+폴링+복귀 갱신 3중 방어 구조</b>를 설계해 모든 브라우저에서 알림 도달 보장",
        "백엔드 스펙이 서버 구현보다 앞선 상황 → <b>feature-detection 전방호환</b>으로 구현해 백엔드가 언제 배포되든 프론트 재배포 0회",
        "모니터링 상세 API의 로드셀 매칭 N+1 제거 — <b>3개월 조회 기준 DB 왕복 약 2,400회 → 1회</b> (배치 조회+이진탐색)",
        "admin 이미지 목록 멈춤 해결 — 실측 20장 <b>172초 → 수 초</b> · 62개 화면 공통 로드 <b>페이지당 139KB 절감</b> · 목록 HTML 42% 경량화",
        "주문 문의 멱등키(Idempotency-Key)·기준사진 낙관적 잠금(expected_version) 설계 — 파괴적 액션의 자동 재전송 금지 원칙",
        "레거시 구조의 한계를 느껴 <b>Next.js 16 + React 19 + Recharts 기반 v2 마이그레이션 시제품을 자발적으로 구축</b> "
        "(TanStack Query·Zustand·Zod, 병렬 페치+동시성 제한, Vercel 배포 + pre-push 로컬 CI) — 마이그레이션 경로를 코드로 검증",
    ],
    "FastAPI · Jinja2 SSR · Vanilla JS(ES Modules) · Redis·Celery · MySQL · FCM/Service Worker · Chart.js · Nginx · S3/CloudFront",
)
P_COMPONIQUE = (
    "Componique — 오픈소스 UI 컴포넌트 라이브러리  [npm 주간 최대 127,000 다운로드]",
    "2024.07–09 · 웅진씽크빅×Udemy Next.js 부트캠프 실전 프로젝트 2등 · 팀 프로젝트(FE 설계·개발) · github.com/Poten14/Componique",
    [
        "React·TypeScript 기반 <b>30개+ 컴포넌트</b>를 설계해 npm 오픈소스로 배포 — 출시 후 주간 다운로드 최대 127,000회",
        "팀원 간 Tailwind 스타일 값이 제각각이라 UI가 어긋나는 문제 → <b>디자인 토큰 공통 설정 파일</b>로 표준화, 코드리뷰 시간 단축",
        "컴포넌트 전략 논쟁(적은 수·다양한 변형 vs 많은 종류·기본 변형)에서 템플릿 확장성 근거로 후자를 설득해 채택",
        "아토믹 디자인 기준을 팀 스터디로 정립하고 가이드라인 문서화 — 분류 논쟁을 공통 언어로 해소",
    ],
    "React · TypeScript · Next.js · Tailwind · Rollup · GitHub Actions(CI/CD)",
)
P_STARTUPQT = (
    "StartupQT — 창업 교육 퀴즈 저작·검수 SaaS (더이노베이터스 인턴)  [12단계 저작 에디터 + 무중단 배포 단독 구축]",
    "2025.03–06 · 기획 참여 + FE 전반 + 배포 환경 단독 구축 · startupqt.com (운영 중)",
    [
        "<b>Tiptap 커스터마이징</b>으로 12단계 입력 흐름의 퀴즈 저작 에디터 설계·구현 + 검수 체크리스트 모달(전체 확인 gating)",
        "요구사항 분석부터 <b>37개 세부 기능 명세·9페이지 플로우 분할</b>을 인턴 단독으로 수행 후 구현",
        "Zustand Slice 구조로 상태 관리 체계 정비 — 상태·localStorage·API 3자 충돌 구조를 단일 데이터 플로우로 재설계",
        "<b>GitHub Actions + Docker 멀티스테이지 + PM2 + Nginx + HTTPS 자동 갱신</b>의 무중단 배포 파이프라인을 단독 구축",
    ],
    "Next.js · TypeScript · Zustand · Tiptap · MUI · GitHub Actions · Docker · PM2 · Nginx · Jest·RTL",
)
P_HOMEPAGE = (
    "에임비랩 홈페이지 리뉴얼 — 투자자 사이트를 B2B 채널로  [고객 문의 월 1건 → 월 9건]",
    "2026.02–03 · 기획·디자인·개발·운영 전 과정 단독 · aimbelab.com",
    [
        "투자자 중심 레거시 사이트를 <b>Next.js(App Router·RSC)</b> 기반 고객 중심 B2B 마케팅 사이트로 전면 재구축",
        "도입 문의 Flow 연동으로 <b>월 최대 1건이던 문의를 월 평균 유선 4건+온라인 5건</b> 수신 체계로 전환 — 실제 사료회사 계약 성사에 기여",
        "번역 API 100+ 동시 호출로 429가 터지던 구조를 분석 → <b>JSON 기반 자체 i18n</b>으로 재설계해 외부 API 의존 제거",
        "SEO·AEO 최적화(동적 Metadata·sitemap·301 리다이렉트), 네이버 블로그 RSS 자동 연동 파이프라인 구축",
        "GA4·Mixpanel·Clarity 3종을 직접 비교 운영 후 Clarity 채택 — 도구 선정부터 계측·개선까지 데이터 기반으로 수행",
        "<b>LCP 3.97s·INP 392ms를 실측</b>해 성능 개선을 우선 과제로 도출 — 렌더링 경로·애니메이션 병목 분석 진행 중",
    ],
    "Next.js(App Router·RSC) · TypeScript · Tailwind · 자체 i18n · SEO/AEO · GA4·Clarity",
)
P_EATFIT = (
    "Eat Fit — AI 식단 관리 PWA  [SW 캡스톤디자인 우수상]",
    "2025.03–12 · 3인 팀 · 기획·FE(PWA)·발표 담당 · 한국공학대전 출품",
    [
        "음식 사진 기반 AI 분석으로 식단 기록을 간소화 — Vision AI 모델 비교·스터디 후 선정, FastAPI 백엔드 연동",
        "앱 대신 <b>Next.js 기반 PWA + 웹 푸시</b>로 네이티브 수준 경험 확보 — 주간·월간 건강 리포트 시각화",
    ],
    "Next.js · PWA · Web Push · FastAPI · Vision AI",
)
P_WAIRI = (
    "Wairi — 기업 홈페이지 Vue→Next.js 마이그레이션  [부트캠프 우수상 · 팀 리더]",
    "2024.09–11 · 스나이퍼팩토리 부트캠프 · 팀 리더(일정·UI 총괄)",
    [
        "실기업 'Wairi'의 Vue 사이트가 SEO에 취약함을 문제로 정의하고 Next.js 마이그레이션을 주도 — SSR·메타태그·sitemap 적용",
        "하드코딩된 레이아웃을 함수 기반 반응형 구조로 재설계해 디바이스 대응 일관성 확보",
    ],
    "Next.js · TypeScript · Tailwind · SEO",
)

INTRO_GENERIC = (
    "전국 130여 농가·1,200여 사료빈을 모니터링하는 축산 IoT SaaS의 웹 개발을 2인 체제에서 맡고 있습니다(전체 커밋의 약 38%). "
    "기존 AI 모델의 한계를 발견해 SAM2 교체를 직접 제안·적용해 분류 오류율을 10%에서 3%로 낮췄고, "
    "npm 주간 최대 127,000회 다운로드된 오픈소스 UI 라이브러리를 만들었으며, "
    "기획부터 배포·운영까지 혼자 끝까지 가져가 본 경험이 반복적으로 있습니다."
)
INTRO_SALTLUX = (
    "AI 기술을 사용자가 실제로 쓰는 화면과 서비스로 만드는 일을 매일 하고 있습니다. "
    "전국 130여 농가·1,200여 사료빈을 모니터링하는 축산 IoT SaaS에서 SAM2 교체를 직접 제안·적용해 분류 오류율을 10%→3%로 낮췄고(웹 2인 체제, 커밋 약 38%), "
    "npm 주간 최대 127,000회 다운로드된 UI 컴포넌트 라이브러리로 디자인 시스템을 구축했으며, "
    "Tiptap 기반 12단계 저작 에디터를 설계했습니다 — 공고의 세 축(AI 서비스 화면·디자인 시스템·에디터)에 각각 실증이 있습니다."
)

if VARIANT == "saltlux":
    ORDER = [P_MYFEED, P_COMPONIQUE, P_STARTUPQT, P_HOMEPAGE, P_EATFIT, P_WAIRI]
    INTRO = INTRO_SALTLUX
    OUT = r"C:\Users\junsu\sansae\job-change\2-솔트룩스\제출물\포트폴리오-김준수.pdf"
else:
    ORDER = [P_COMPONIQUE, P_MYFEED, P_HOMEPAGE, P_STARTUPQT, P_EATFIT, P_WAIRI]
    INTRO = INTRO_GENERIC
    OUT = r"C:\Users\junsu\sansae\job-change\포트폴리오-김준수.pdf"

doc = SimpleDocTemplate(
    OUT, pagesize=A4, leftMargin=17 * mm, rightMargin=17 * mm, topMargin=15 * mm, bottomMargin=14 * mm,
    title="김준수 포트폴리오 — FE/AI Engineer", author="김준수",
)

story = []
story.append(Paragraph("김준수 — Frontend Engineer", S["name"]))
story.append(Paragraph(
    "junsu4621@naver.com · github.com/kimjusnu · junsudev4.vercel.app (AI 챗봇 탑재 포트폴리오) · 육군 만기전역",
    S["contact"]))
story.append(Spacer(1, 3))
story.append(Paragraph(INTRO, S["intro"]))
story.append(hr(1))

for i, (title, meta, bullets, stack) in enumerate(ORDER, 1):
    story.append(project(i, title, meta, bullets, stack))

story.append(hr(1))
story.append(Paragraph(
    "학력: 한국공학대학교 컴퓨터공학부 소프트웨어전공 (2020.03–2026.02, GPA 3.45/4.5·전공 3.54) · "
    "자격: ADsP(2026.06) · Google Analytics 인증(2025.09) · OPIc IM1 · "
    "수상: 캡스톤 우수상(2025) · 스나이퍼팩토리 3기 우수상(2024) · 웅진씽크빅×Udemy 부트캠프 2등(2024)",
    S["small"]))
story.append(Spacer(1, 2))
story.append(Paragraph(
    "이 문서의 모든 수치는 커밋 기록·측정 로그·본인 검증을 거친 값만 사용했습니다. 상세 서사와 데모는 junsudev4.vercel.app 참고.",
    S["small"]))

doc.build(story)
print(f"OK: portfolio PDF generated ({VARIANT}) -> {OUT}")
