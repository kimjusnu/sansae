# Junsu Kim — Portfolio

프론트엔드 · AI 엔지니어 **김준수**의 포트폴리오.

- **콘셉트**: `Blue Glass Intelligence` — 밝은 화이트 인터페이스 위에 반투명 블루 3D 아이콘
- **기술**: 순수 HTML / CSS / JavaScript (빌드 · 라이브러리 없음)
- **특징**: 디자인 토큰 기반 스타일, 접근 가능한 모바일 메뉴, 3D 아이콘 fallback, 라이트모션 대응

## 구조

```
portfolio/                 ← 이 폴더만 배포됩니다
  index.html               마크업
  assets/css/base.css      디자인 토큰 · 리셋 · 버튼 · 공통 프리미티브
  assets/css/layout.css    헤더 · 내비게이션 · 히어로 · 푸터
  assets/css/sections.css  3D 아이콘 · 강점 · 프로젝트 · 프로세스 · 경력 · CTA
  assets/css/sequence.css  히어로 고정 구간 · 캔버스 · 배경 위 텍스트 대비
  assets/css/intro.css     인트로 게이트
  assets/css/cursor.css    커스텀 커서
  assets/js/main.js        헤더 · 모바일 메뉴 · 스크롤 리빌 · 아이콘 fallback
  assets/js/sequence.js    프레임 로더 · 스크롤 매핑 · 캔버스 렌더
  assets/js/intro.js       게이트 정책 · FLIP 전환
  assets/js/cursor.js      커스텀 커서
  sequence/                스크럽 프레임 (hd/ sd/ poster manifest.json)
  icons/                   3D 아이콘 WebP (정규화된 배포용, 총 311 KB)
  favicon.svg              브랜드 마크 (원본)
  favicon.ico / icon-192.png / icon-512.png / apple-touch-icon.png / og-image.jpg
                           favicon.svg · og-template.html에서 생성됨
  site.webmanifest         PWA 매니페스트
  data/profile.json        콘텐츠 원본 데이터

design/                    ← 배포되지 않는 원본과 빌드 스크립트
  icons-source/            3D 아이콘 원본 렌더 (1024~1536px, 17MB)
  sequence-source/         스크럽 원본 영상
  normalize-icons.py       원본 → portfolio/icons/ 정규화
  build-sequence.py        영상 → portfolio/sequence/ 프레임 추출
  og-template.html         공유 카드 템플릿
  build-brand-assets.py    favicon · 앱 아이콘 · OG 이미지 생성
```

CSS는 `base → layout → sections → sequence → intro → cursor` 순서로 로드해야 합니다.

`main.js` · `sequence.js` · `intro.js`는 서로를 직접 호출하지 않습니다. 인트로는 끝날 때
`intro:done` 커스텀 이벤트만 던지고, 어느 하나를 빼도 나머지가 그대로 동작합니다.

## 로컬 실행

`portfolio/index.html`을 브라우저로 열면 됩니다. (빌드 불필요)

## 에셋 다시 만들기

### 3D 아이콘

새 렌더를 `design/icons-source/`에 `ICON_REQUESTS.md`의 파일명 그대로 넣고:

```bash
python design/normalize-icons.py
```

원본 렌더는 캔버스 비율(1:1 / 3:2)과 오브젝트 크기가 제각각이라 그대로 쓰면 같은 컬렉션으로 보이지
않습니다. 이 스크립트가 정사각형으로 재크롭하고 오브젝트 점유율을 68%로 통일한 뒤 표시 크기의 2배로
줄이고 WebP로 인코딩합니다 (16.7 MB → 0.30 MB).

> WebP를 쓰는 이유: 유리 재질의 부드러운 그라디언트를 PNG로 담으면 히어로 하나가 493 KB입니다.
> 팔레트 PNG는 글로우에 밴딩이 생겨 탈락했고, WebP q90은 표시 크기에서 육안 차이 없이 128 KB입니다.
> WebP를 못 읽는 브라우저에서는 `<img>` 에러가 발생해 CSS fallback으로 자연스럽게 대체됩니다.

### 스크럽 배경 영상

새 영상을 `design/sequence-source/`에 넣고 `design/build-sequence.py` 상단의 `SOURCE`를 그 파일명으로
바꾼 뒤:

```bash
python design/build-sequence.py
```

프레임 수는 `portfolio/sequence/manifest.json`을 통해 브라우저에 전달되므로 **사이트 코드는 손댈 필요가
없습니다.** 부드러움은 프레임 수만으로 결정되지 않습니다 — `sequence.js`가 진행률에 감쇠를 걸어
휠 한 노치의 점프를 활강으로 바꾸고, 프레임을 도착 즉시 디코딩해 페인트가 멈추지 않게 합니다.
프레임 수는 `MAX_FRAMES`, 감쇠 강도는 `DAMPING`으로 조절합니다.

영상 촬영 조건은 `docs/superpowers/specs/`의 설계 문서 §3에 있습니다. 핵심은 세 가지입니다 —
카메라 완전 고정, 화면 70퍼센트 이상 흰색, 처음부터 끝까지 일정한 속도. 어둡거나 중간에 멈추는
영상은 각각 본문 가독성과 스크롤 체감을 망칩니다.

### 파비콘 · OG 이미지

`portfolio/favicon.svg` 또는 `design/og-template.html`을 수정한 뒤:

```bash
python -m http.server 3000 --bind 127.0.0.1 --directory portfolio   # 별도 터미널
python design/build-brand-assets.py
```

`favicon.ico`, `icon-192/512.png`, `apple-touch-icon.png`, `og-image.jpg`가 다시 생성됩니다.

> `index.html`의 `og:image`는 절대 URL입니다. 배포 도메인이 바뀌면 `og:`/`twitter:`/`canonical`
> 태그의 URL도 함께 바꿔야 카카오톡·슬랙 미리보기가 깨지지 않습니다.

## 배포 (GitHub Pages)

`main` 브랜치에 push하면 `.github/workflows/pages.yml`이 `portfolio/`를 자동 배포합니다.
GitHub 저장소 → **Settings → Pages → Source: GitHub Actions** 설정 필요.

---
🤖 Built with Claude Code
