# -*- coding: utf-8 -*-
"""잡코리아 'AI 이력서 생성' 업로드용 이력서 PDF — 폼 항목 순서에 맞춰 구성.
연락처 포함 → 공개 레포 커밋 금지 (.gitignore 처리)"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

pdfmetrics.registerFont(TTFont("Malgun", r"C:\Windows\Fonts\malgun.ttf"))
pdfmetrics.registerFont(TTFont("MalgunB", r"C:\Windows\Fonts\malgunbd.ttf"))

INK = HexColor("#1a2233"); ACCENT = HexColor("#2456c8"); MUTED = HexColor("#5a6478"); LINE = HexColor("#d8dde8")

S = {
    "name": ParagraphStyle("name", fontName="MalgunB", fontSize=20, leading=26, textColor=INK),
    "contact": ParagraphStyle("contact", fontName="Malgun", fontSize=9, leading=13.5, textColor=MUTED),
    "h1": ParagraphStyle("h1", fontName="MalgunB", fontSize=12, leading=16, textColor=ACCENT, spaceBefore=11, spaceAfter=3),
    "h2": ParagraphStyle("h2", fontName="MalgunB", fontSize=10, leading=14, textColor=INK, spaceBefore=5, spaceAfter=2),
    "body": ParagraphStyle("body", fontName="Malgun", fontSize=9.2, leading=14.2, textColor=INK, spaceAfter=2),
    "li": ParagraphStyle("li", fontName="Malgun", fontSize=9.2, leading=14.2, textColor=INK, leftIndent=9, spaceAfter=2),
    "meta": ParagraphStyle("meta", fontName="Malgun", fontSize=8.6, leading=12.5, textColor=MUTED, spaceAfter=3),
}

def H(t): return Paragraph(t, S["h1"])
def H2(t): return Paragraph(t, S["h2"])
def B(t): return Paragraph(t, S["body"])
def LI(t): return Paragraph(f"- {t}", S["li"])
def hr(): return HRFlowable(width="100%", thickness=0.7, color=LINE, spaceBefore=4, spaceAfter=4)

doc = SimpleDocTemplate(
    r"C:\Users\junsu\sansae\job-change\2-솔트룩스\제출물\이력서-김준수-업로드용.pdf",
    pagesize=A4, leftMargin=17 * mm, rightMargin=17 * mm, topMargin=14 * mm, bottomMargin=13 * mm,
    title="김준수 이력서", author="김준수",
)

s = []
# 인적사항
s.append(Paragraph("김준수 (KIM JUNSU)", S["name"]))
s.append(Paragraph("junsu4621@naver.com · 010-4046-4621 · 인천 계양구 · https://junsudev4.vercel.app · github.com/kimjusnu", S["contact"]))
s.append(hr())

# 희망직무·스킬
s.append(H("희망직무"))
s.append(B("프론트엔드개발자 · 웹개발자 · AI서비스개발자"))
s.append(H("스킬"))
s.append(B("React · Next.js · TypeScript · JavaScript · Tailwind CSS · Zustand · TanStack Query · Tiptap · FastAPI · Redis · MySQL · Git · GitHub · GitHub Actions · Docker · Nginx · AWS · Figma · Google Analytics(GA4) · Microsoft Clarity · Jira · Slack"))

# 학력
s.append(H("학력"))
s.append(H2("한국공학대학교 — 컴퓨터공학부(소프트웨어전공) · 2020.03 ~ 2026.02 졸업 · 학점 3.45/4.5 (전공 3.54)"))
s.append(LI("졸업작품: 사용자 식습관 데이터를 활용한 맞춤형 영양관리 서비스 'Eat Fit' — Next.js 기반 PWA 아키텍처 기획 및 프론트엔드 개발, SW캡스톤디자인 우수상"))

# 경력
s.append(H("경력"))
s.append(H2("에임비랩 (AimBe Lab) — SW개발팀 주임연구원 · 2025.07 ~ 재직 중 · 정규직 · 프론트엔드개발자"))
s.append(B("[서비스 소개] 마이피드(My Feed): IoT 센서 데이터 기반으로 사료 잔량·온습도·소진 예측·주문 기능을 제공하는 스마트축산 B2B SaaS — 전국 130여 농가·1,200여 사료빈 모니터링"))
s.append(B("[담당업무] 마이피드 웹 서비스·신규 주문 시스템 기획·개발(웹 2인 체제, 전체 커밋 약 38%) · 회사 홈페이지 리뉴얼 단독 · AI 모델 연동 환경 구축"))
s.append(Spacer(1, 2))
s.append(H2("경력기술서"))
s.append(B("<b>1. 프론트엔드 기획·개발 및 고객 중심 UX 개선</b>"))
s.append(LI("수기 장부 위주의 아날로그식 주문 방식을 대체하는 신규 사료 주문 시스템 대시보드 기획·개발"))
s.append(LI("개발 전 현장 농가를 직접 방문해 고객의 실제 사용 패턴을 분석하고 피드백을 요구사항으로 구체화"))
s.append(LI("GA4·Clarity로 사용자 행동을 계측해 UX 개선 우선순위를 도출·반영"))
s.append(LI("본사/대리점/농장 3단계 다중 권한(RBAC) 관리형 프론트엔드 설계 및 화면 전환 최적화"))
s.append(B("<b>2. AI 모델 연동 및 분류 정확도 개선</b>"))
s.append(LI("AI 개발자 2인과 협업하며 모델 연동 환경 구축을 주도"))
s.append(LI("기존 사료 잔량 분석 AI가 통 내부 지지대를 사료로 오인식하는 한계를 파악, 정밀 분석 모델(SAM2) 도입을 직접 제안·연동해 사물 분류 오류율 10% → 3% (오분류의 수동 검수 유입 비율로 측정)"))
s.append(B("<b>3. 웹 알림 시스템 및 성능 개선</b>"))
s.append(LI("브라우저 업데이트로 웹푸시가 끊기는 장애를 OS 이벤트 로그 기반 홉 단위 추적으로 원인 특정, 가설 4개를 실험으로 배제 후 푸시+폴링+복귀 갱신 3중 방어 구조 설계 — 모든 브라우저에서 알림 도달 보장"))
s.append(LI("모니터링 상세 API N+1 제거 — 3개월 조회 기준 DB 왕복 약 2,400회 → 1회 (배치 조회+이진탐색)"))
s.append(LI("관리자 이미지 목록 로딩 실측 172초 → 수 초 · 62개 화면 공통 로드 페이지당 139KB 절감 · 목록 HTML 42% 경량화"))
s.append(LI("주문 문의 멱등키(Idempotency-Key)·기준사진 낙관적 잠금(expected_version) 설계 — 파괴적 액션 자동 재전송 금지"))
s.append(LI("레거시(Jinja SSR) 한계를 느껴 Next.js 16+React 19 기반 v2 마이그레이션 시제품을 자발적으로 구축 — Recharts·TanStack Query·Zustand, Vercel 배포+pre-push 로컬 CI"))
s.append(B("<b>4. 기업 홈페이지 리뉴얼 및 그로스</b>"))
s.append(LI("투자자 중심 레거시 사이트를 Next.js App Router·RSC 기반 세일즈 친화 B2B 사이트로 전면 재구축"))
s.append(LI("도입 문의 Flow 연동으로 전무하던 고객 문의(월 최대 1건)를 월 평균 유선 4건+온라인 5건 수신 체계로 전환 — 실제 사료회사 계약 성사에 기여"))
s.append(LI("번역 API 100+ 동시 호출로 429가 발생하던 구조를 JSON 기반 자체 i18n으로 재설계해 외부 API 의존 제거"))
s.append(LI("SEO/AEO 최적화(동적 Metadata·sitemap·301 리다이렉트) 및 네이버 블로그 RSS 자동 연동 파이프라인 구축"))
s.append(LI("LCP 3.97s·INP 392ms를 실측해 성능 개선을 우선 과제로 도출 — 렌더링 경로·애니메이션 병목 분석 진행 중"))

# 인턴·대외활동
s.append(H("인턴·대외활동"))
s.append(H2("더이노베이터스 (The Innovators) — 인턴 · 2025.03 ~ 2025.06"))
s.append(B("[서비스 소개] StartupQT: 강사(출제)·검수자·학생을 연결하는 창업 교육용 퀴즈 저작·관리 SaaS"))
s.append(LI("기획 단계부터 참여해 Figma로 핵심 페이지 와이어프레임 설계 — 37개 세부 기능 명세·9페이지 플로우 분할 단독 수행"))
s.append(LI("Tiptap 커스터마이징으로 12단계 입력 흐름의 퀴즈 저작 에디터 및 검수 워크플로 대시보드 구현 (검수 체크리스트 모달·전체 확인 gating)"))
s.append(LI("상태·localStorage·API 3자 충돌 구조를 Zustand Slice 단일 데이터 플로우로 재설계"))
s.append(LI("GitHub Actions+Docker 멀티스테이지+PM2+Nginx+HTTPS 자동 갱신의 무중단 배포 파이프라인 단독 구축 — 실사용자 대상 론칭, startupqt.com 현재 운영 중"))

# 교육
s.append(H("교육"))
s.append(LI("AI 기반 데이터 분석 및 시각화 교육 — 한국산학연협회 · 2025.12 · 데이터 기반 문제 해결·UX 개선 역량"))
s.append(LI("스나이퍼팩토리 프론트엔드 3기 — 2024.10~12 · 팀 리더로 실기업(와이리) Vue→Next.js SEO 마이그레이션 총괄, 우수상"))
s.append(LI("웅진씽크빅×Udemy Next.js 부트캠프 3기 — 2024.04~09 · 30개+ UI 컴포넌트를 npm 오픈소스(Componique)로 배포, 주간 최대 127,000 다운로드 · 2등 우수상"))

# 자격증
s.append(H("자격증"))
s.append(LI("데이터분석 준전문가(ADsP) — 한국데이터산업진흥원 · 2026.06"))
s.append(LI("GAC (Google Analytics Certification) — Google · 2025.09"))
s.append(LI("자동차운전면허 1종 보통 — 경찰청 · 2020.01"))

# 수상
s.append(H("수상"))
s.append(LI("SW 캡스톤디자인 우수상 — 한국공학대학교 · 2025 · AI 기반 맞춤형 영양관리 서비스 'Eat Fit'의 기획·프론트엔드(PWA)를 담당, Vision AI 연동 및 웹 푸시 기반 네이티브 수준 UX 구현"))
s.append(LI("스나이퍼팩토리 프론트엔드 3기 우수상 (팀 리더) — 2024.12"))
s.append(LI("웅진씽크빅×Udemy Next.js 부트캠프 3기 2등·우수 수강생 — 2024.09"))

# 어학·병역
s.append(H("어학"))
s.append(LI("영어 — OPIc IM1 (2025.02)"))
s.append(H("취업우대·병역"))
s.append(LI("병역: 군필 — 육군 병장 만기전역 (2021.06 ~ 2022.12)"))

# 포트폴리오
s.append(H("포트폴리오"))
s.append(LI("https://junsudev4.vercel.app (AI 챗봇 탑재) · github.com/kimjusnu · npm: Componique"))

# 자기소개서
s.append(H("자기소개서"))
s.append(B("<b>[AI를 화면으로 만드는 일을 이미 하고 있습니다]</b>"))
s.append(B("전국 130여 농가·1,200여 사료빈을 모니터링하는 축산 IoT SaaS의 웹 개발을 2인 체제에서 맡고 있습니다(전체 커밋의 약 38%). 기존 이미지 분석 AI(SAM)의 한계를 발견해 SAM2 교체를 직접 제안·적용해 분류 오류율을 10%에서 3%로 낮췄고, npm 주간 최대 127,000회 다운로드된 오픈소스 UI 컴포넌트 라이브러리를 설계했습니다."))
s.append(B("공고를 보니 Agent Studio·Document Studio처럼 AI 기술을 노드 기반 워크플로우 UI와 완성도 높은 제품으로 만드는 것이 Product Center의 핵심 업무인데, 제가 지금 하는 일이 정확히 그 앞 단계입니다."))
s.append(B("첫째, AI 서비스와 연동되는 화면을 실무로 만들어 왔습니다. LLM과 이미지 분석 AI를 실사용 SaaS에 통합했고, AI 판단 결과를 사용자가 이해하고 신뢰할 수 있는 UI로 옮기는 과정에서 오탐 처리·확률 표현 같은 AI 특유의 UX 문제를 다뤄봤습니다."))
s.append(B("둘째, 공통 UI 컴포넌트와 디자인 시스템을 구축·운영해 봤습니다. Componique에서 30개 이상의 컴포넌트를 설계하며 디자인 토큰으로 팀의 스타일 불일치를 표준화했고, 그 결과는 npm 주간 127,000 다운로드로 검증받았습니다."))
s.append(B("셋째, 에디터를 만들어 봤습니다. StartupQT에서 Tiptap을 커스터마이징해 12단계 입력 흐름의 저작 에디터와 검수 워크플로우를 설계·구현했습니다. React Flow 기반 노드 에디터는 아직 실무 경험이 없지만, 에디터의 상태 관리와 사용자 흐름 설계라는 본질은 같다고 생각하며 빠르게 흡수할 자신이 있습니다."))
s.append(B("이 세 경험이 공고의 'AI 서비스 연동 화면', '공통 UI 컴포넌트·디자인 시스템 구축·운영', '노드 기반 에디터 개발'에 각각 대응한다고 판단해 지원합니다. 입사 후에는 Product Center의 AI 제품이 사용자에게 신뢰받는 화면이 되도록, 검증된 실무 경험으로 기여하겠습니다."))

# 희망근무조건
s.append(H("희망근무조건"))
s.append(B("고용형태 정규직 · 희망연봉 면접 후 결정 · 희망근무지 서울·인천·경기"))

doc.build(s)
print("OK: upload resume PDF generated")
