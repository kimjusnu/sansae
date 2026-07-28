# 포트폴리오 안내 도우미 — Cloudflare Worker

정적 사이트(GitHub Pages)와 Cloudflare Workers AI 사이의 중계소입니다.
**이 폴더는 배포되는 사이트에 포함되지 않습니다.** `wrangler`로 따로 올립니다.

## 왜 워커가 필요한가

브라우저 JS에 API 키를 넣으면 소스 보기로 누구나 꺼내 갑니다. 키를 서버 쪽에 두려면
서버가 필요한데, GitHub Pages에는 서버가 없습니다. 워커가 그 자리를 대신합니다.

Workers AI는 **바인딩(`env.AI`)으로 호출**하므로 이 저장소에 키가 아예 존재하지 않습니다.

## 배포

### 0. workers.dev 서브도메인 등록 (계정당 한 번, 대시보드에서만 가능)

이걸 안 하면 `wrangler deploy`도 `wrangler dev`도 막힙니다. Workers AI는 항상 원격에서
돌기 때문에 로컬 개발조차 서브도메인이 필요합니다.

https://dash.cloudflare.com/95c3263fd1c744f64506af0bfcaa5459/workers/onboarding

원하는 서브도메인 이름을 고르면 됩니다. 워커 주소가
`https://junsu-portfolio-assistant.<고른이름>.workers.dev` 형태가 됩니다.

### 1. 배포

```bash
cd worker
npm install -D wrangler
npx wrangler login
npx wrangler deploy
```

배포가 끝나면 `https://junsu-portfolio-assistant.<계정>.workers.dev` 주소가 출력됩니다.
그 주소를 `portfolio/assets/js/chat.js` 상단의 `WORKER_URL`에 넣으면 사이트에 챗 버튼이
나타납니다. 비워두면 버튼 자체가 뜨지 않습니다.

## 레이트 리밋 설정 (공유 전에 꼭)

공개 엔드포인트는 방치하면 남의 무료 LLM이 됩니다.

```bash
npx wrangler kv namespace create RATE_LIMIT_KV
```

출력된 `id`를 `wrangler.toml`의 `[[kv_namespaces]]` 블록에 넣고 주석을 해제한 뒤 다시
배포하세요. 현재 설정은 **IP당 5분에 20회**입니다 (`src/index.js`의 `RATE_LIMIT`).

> KV 바인딩이 없으면 리밋은 **열린 채로** 동작합니다. 설정 실수로 도우미가 죽는 것보다
> 낫다고 판단한 선택이지만, 그만큼 설정을 빠뜨리면 무방비입니다.

## 모델 교체

`src/index.js`의 `MODEL` 한 줄입니다.

```js
const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
```

카탈로그는 수시로 바뀌므로 **추측하지 말고 조회하세요.**

```bash
npx wrangler ai models
```

실제로 조회해 보니 `@cf/meta/llama-3.1-8b-instruct`는 **존재하지 않습니다** (`-fp8`
변형만 있음). 답변이 한국어라 70B를 골랐습니다 — 작은 모델은 한국어 문장이 어색합니다.
한국어가 마음에 안 들면 `@cf/qwen/qwen3-30b-a3b-fp8`(CJK 강함, 더 저렴)을 먼저 시도해
보세요. 바꿔도 나머지 코드는 그대로입니다.

## 이력 수정

`src/persona.js`의 `PROFILE` 객체를 고치고 다시 배포합니다.

프로필이 2 KB 정도라 시스템 프롬프트에 통째로 넣습니다. 임베딩도 벡터 DB도 쓰지 않습니다 —
이 크기에서는 과설계입니다.

`portfolio/data/profile.json`과 내용이 어긋나지 않게 같이 고쳐주세요.

## 비용

Workers AI에는 무료 할당량이 있지만 **무제한은 아닙니다.** 할당량을 넘으면 과금되고,
`wrangler dev`로 로컬 테스트할 때도 추론은 원격에서 돌기 때문에 사용량에 잡힙니다.

대시보드의 Workers AI 사용량을 한 번 확인해 두세요. 아래 레이트 리밋이 비용 방어선입니다.

## 안전장치

| 항목 | 값 | 위치 |
|---|---|---|
| 허용 Origin | Pages 도메인 + localhost | `ALLOWED_ORIGINS` |
| IP당 요청 | 5분에 20회 | `RATE_LIMIT` |
| 질문 길이 | 500자 | `MAX_QUESTION_CHARS` |
| 대화 히스토리 | 최근 6개 메시지 | `MAX_HISTORY_TURNS` |
| 응답 토큰 | 320 | `MAX_OUTPUT_TOKENS` |
| temperature | 0.2 | `env.AI.run` |

응답을 짧게 묶어둔 것은 비용 때문만이 아닙니다. **길어질수록 지어냅니다.**

## 로컬 실행

```bash
npx wrangler dev
```

`http://localhost:8787`이 뜹니다. `chat.js`의 `WORKER_URL`을 이 주소로 바꾸면
로컬에서 붙여볼 수 있습니다. `ALLOWED_ORIGINS`에 `http://127.0.0.1:3000`이 이미 있습니다.
