# 포트폴리오 안내 도우미 — Cloudflare Worker

정적 사이트(GitHub Pages)와 Cloudflare Workers AI 사이의 중계소입니다.
**이 폴더는 배포되는 사이트에 포함되지 않습니다.** `wrangler`로 따로 올립니다.

## 왜 워커가 필요한가

브라우저 JS에 API 키를 넣으면 소스 보기로 누구나 꺼내 갑니다. 키를 서버 쪽에 두려면
서버가 필요한데, GitHub Pages에는 서버가 없습니다. 워커가 그 자리를 대신합니다.

Workers AI는 **바인딩(`env.AI`)으로 호출**하므로 이 저장소에 키가 아예 존재하지 않습니다.

## 배포

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
const MODEL = '@cf/meta/llama-3.1-8b-instruct';
```

Workers AI의 모델 카탈로그는 수시로 바뀝니다. **배포 전에 대시보드에서 이 모델이 아직
제공되는지 확인하세요.** 다른 모델로 바꿔도 나머지 코드는 그대로입니다.

## 이력 수정

`src/persona.js`의 `PROFILE` 객체를 고치고 다시 배포합니다.

프로필이 2 KB 정도라 시스템 프롬프트에 통째로 넣습니다. 임베딩도 벡터 DB도 쓰지 않습니다 —
이 크기에서는 과설계입니다.

`portfolio/data/profile.json`과 내용이 어긋나지 않게 같이 고쳐주세요.

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
