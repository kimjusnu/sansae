var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/persona.js
var PROFILE = {
  name: "\uAE40\uC900\uC218 (Junsu Kim)",
  title: "\uD504\uB860\uD2B8\uC5D4\uB4DC \xB7 AI \uC5D4\uC9C0\uB2C8\uC5B4",
  location: "\uC778\uCC9C \xB7 \uC11C\uC6B8",
  email: "junsu4621@naver.com",
  links: {
    github: "https://github.com/kimjusnu",
    blog: "https://dietisdie.tistory.com/"
  },
  strengths: [
    "\uAE30\uD68D \u2192 \uB514\uC790\uC778 \u2192 \uAD6C\uD604 \u2192 \uBC30\uD3EC \u2192 \uC6B4\uC601\uAE4C\uC9C0 \uC81C\uD488 \uC804 \uACFC\uC815 \uC624\uB108\uC2ED",
    "\uD504\uB860\uD2B8\uC5D4\uB4DC\uBD80\uD130 FastAPI \uBC31\uC5D4\uB4DC, Docker\xB7CI/CD \uC778\uD504\uB77C\uAE4C\uC9C0 \uC544\uC6B0\uB974\uB294 \uC2E4\uD589\uB825",
    "\uD604\uC7A5 \uB9AC\uC11C\uCE58 \uAE30\uBC18 \uBB38\uC81C \uC815\uC758 (\uC608: \uB18D\uAC00 \uC9C1\uC811 \uBC29\uBB38)",
    "GA4\xB7Clarity\uB85C \uD589\uB3D9 \uB370\uC774\uD130\uB97C \uC77D\uACE0 \uAC1C\uC120 \uACB0\uACFC\uB97C \uD655\uC778"
  ],
  skills: {
    frontend: ["React", "Next.js (App Router, RSC)", "TypeScript", "Tailwind CSS", "Zustand", "Storybook"],
    ai: ["LLM \uD1B5\uD569", "SAM2", "FastAPI"],
    devops: ["GitHub Actions", "Docker", "PM2", "CI/CD"],
    data: ["GA4 (\uC778\uC99D)", "Microsoft Clarity"],
    etc: ["RBAC", "i18n", "Tiptap", "MUI"]
  },
  experience: [
    {
      company: "AimBe Lab",
      role: "Associate (\uC815\uADDC\uC9C1)",
      period: "2025.07 \u2013 2026.06",
      highlights: [
        "My Feed: \uB18D\uAC00 \uC8FC\uBB38 \uC2DC\uC2A4\uD15C \uB514\uC9C0\uD138\uD654, AI \uBD84\uB958 \uC624\uB958\uC728 10% \u2192 3%",
        "GA4 \uAE30\uBC18 \uAC1C\uC120\uC73C\uB85C \uC8FC\uAC04 \uBC29\uBB38 \uBE48\uB3C4 2~3\uD68C \u2192 4\uD68C",
        "\uD22C\uC790\uC790 \uC18C\uAC1C \uC0AC\uC774\uD2B8\uB97C B2B \uD50C\uB7AB\uD3FC\uC73C\uB85C \uC7AC\uAD6C\uCD95 (Next.js RSC \uAE30\uBC18 SEO, \uC790\uCCB4 i18n)",
        "3\uB2E8\uACC4 RBAC \uB300\uC2DC\uBCF4\uB4DC \uC124\uACC4, GitHub Actions CI/CD \uAD6C\uCD95"
      ]
    },
    {
      company: "The Innovators",
      role: "Intern",
      period: "2025.03 \u2013 2025.06",
      highlights: [
        "StartupQT \uD034\uC988 \uC800\uC791 SaaS\uC758 \uBAA8\uB4C8\uD615 \uC5D0\uB514\uD130\uC640 \uAC80\uC218 \uC6CC\uD06C\uD50C\uB85C\uC6B0 \uAD6C\uD604",
        "Docker \uCEE8\uD14C\uC774\uB108\uD654, \uBB34\uC911\uB2E8 CI/CD \uD30C\uC774\uD504\uB77C\uC778 \uAD6C\uCD95"
      ]
    }
  ],
  education: {
    school: "\uD55C\uAD6D\uACF5\uD559\uB300\uD559\uAD50",
    major: "\uCEF4\uD4E8\uD130\uACF5\uD559\uBD80 \uC18C\uD504\uD2B8\uC6E8\uC5B4\uC804\uACF5",
    period: "2020.03 \u2013 2026.02",
    gpa: "3.45 / 4.5 (\uC804\uACF5 3.54)"
  },
  projects: [
    { name: "Componique", desc: "30\uAC1C \uC774\uC0C1 \uCEF4\uD3EC\uB10C\uD2B8\uC758 \uC624\uD508\uC18C\uC2A4 \uB514\uC790\uC778 \uC2DC\uC2A4\uD15C UI \uB77C\uC774\uBE0C\uB7EC\uB9AC", stack: ["React", "TypeScript", "Tailwind", "Storybook", "Rollup"], link: "https://componique.vercel.app/" },
    { name: "StartupQT", desc: "\uD034\uC988 \uC800\uC791 \xB7 \uAC80\uC218 \xB7 \uAD00\uB9AC SaaS", stack: ["Next.js", "TypeScript", "Zustand", "Tiptap", "MUI", "Docker"], link: "https://startupqt.com/start" },
    { name: "Eat Fit", desc: "\uC74C\uC2DD \uC0AC\uC9C4 \uBD84\uC11D \uAE30\uBC18 \uC2DD\uB2E8\uAD00\uB9AC PWA (SW \uCEA1\uC2A4\uD1A4 \uB514\uC790\uC778 \uC6B0\uC218\uC0C1)", stack: ["Next.js", "FastAPI", "AWS", "PWA"], link: "https://expo.tukorea.ac.kr/2025/work/87" },
    { name: "Wairi", desc: "SEO \uAC1C\uC120\uC744 \uC704\uD55C Vue \u2192 Next.js \uB9C8\uC774\uADF8\uB808\uC774\uC158", stack: ["Next.js", "TypeScript", "Tailwind", "SEO"], link: "https://www.wairi.co.kr/webapp" }
  ],
  awards: [
    "SW \uCEA1\uC2A4\uD1A4 \uB514\uC790\uC778 \uC6B0\uC218\uC0C1 (Eat Fit, 2025)",
    "Sniper Factory \uD504\uB860\uD2B8\uC5D4\uB4DC \uBD80\uD2B8\uCEA0\uD504 \uC6B0\uC218\uC0C1 \xB7 \uD300 \uB9AC\uB354 (2024)",
    "\uC6C5\uC9C4\uC53D\uD06C\uBE45 \xD7 Udemy Next.js \uBD80\uD2B8\uCEA0\uD504 2\uC704 (2024)"
  ],
  certifications: ["ADsP (2026.06)", "GA4 \uC778\uC99D (2025.09)", "OPIc IM1 (2025.02)"],
  openToWork: true
};
function systemPrompt() {
  return [
    "\uB108\uB294 \uAE40\uC900\uC218\uC758 \uD3EC\uD2B8\uD3F4\uB9AC\uC624 \uC0AC\uC774\uD2B8\uC5D0 \uC788\uB294 \uC548\uB0B4 \uB3C4\uC6B0\uBBF8\uB2E4.",
    "\uBC29\uBB38\uC790\uB294 \uB300\uBD80\uBD84 \uCC44\uC6A9 \uB2F4\uB2F9\uC790\uB2E4. \uC9E7\uACE0 \uB2F4\uBC31\uD558\uAC8C, \uD55C\uAD6D\uC5B4 \uC874\uB313\uB9D0\uB85C \uB2F5\uD55C\uB2E4.",
    "",
    "## \uB2F5\uBCC0 \uADDC\uCE59",
    "1. \uC544\uB798 <\uD504\uB85C\uD544> \uB370\uC774\uD130\uC5D0 \uC788\uB294 \uC0AC\uC2E4\uB9CC \uB9D0\uD55C\uB2E4.",
    '2. \uB370\uC774\uD130\uC5D0 \uC5C6\uB294 \uB0B4\uC6A9\uC740 \uC9C0\uC5B4\uB0B4\uC9C0 \uB9D0\uACE0 "\uC774\uB825\uC11C\uC5D0 \uC5C6\uB294 \uB0B4\uC6A9\uC774\uB77C \uD655\uC778\uC774 \uC5B4\uB835\uC2B5\uB2C8\uB2E4. ' + PROFILE.email + '\uB85C \uBB38\uC758\uD574 \uC8FC\uC138\uC694."\uB77C\uACE0 \uB2F5\uD55C\uB2E4.',
    "3. \uCD1D \uACBD\uB825 \uC5F0\uCC28, \uD76C\uB9DD \uC5F0\uBD09, \uC131\uACA9 \uD3C9\uAC00, \uD569\uACA9 \uAC00\uB2A5\uC131\uCC98\uB7FC \uB370\uC774\uD130\uC5D0\uC11C \uD30C\uC0DD \uCD94\uB860\uD574\uC57C \uD558\uB294 \uAC83\uC740 \uB2F5\uD558\uC9C0 \uC54A\uB294\uB2E4.",
    "4. \uC218\uCE58\uB294 \uB370\uC774\uD130\uC5D0 \uC801\uD78C \uADF8\uB300\uB85C\uB9CC \uC4F4\uB2E4. \uBC18\uC62C\uB9BC\uD558\uAC70\uB098 \uBD80\uD480\uB9AC\uC9C0 \uC54A\uB294\uB2E4.",
    "5. \uAE40\uC900\uC218\uC758 \uC774\uB825 \xB7 \uD504\uB85C\uC81D\uD2B8 \xB7 \uAE30\uC220 \uC2A4\uD0DD \xB7 \uC5F0\uB77D \uBC29\uBC95 \uC678\uC758 \uC8FC\uC81C\uB294 \uC815\uC911\uD788 \uAC70\uC808\uD558\uACE0 \uBCF8\uB798 \uBAA9\uC801\uC744 \uC548\uB0B4\uD55C\uB2E4.",
    "   (\uBC88\uC5ED, \uCF54\uB4DC \uC791\uC131, \uC77C\uBC18 \uC0C1\uC2DD, \uB2E4\uB978 \uC778\uBB3C\uC5D0 \uB300\uD55C \uC9C8\uBB38 \uB4F1\uC740 \uBAA8\uB450 \uAC70\uC808 \uB300\uC0C1\uC774\uB2E4.)",
    "6. 3~4\uBB38\uC7A5 \uC548\uC5D0\uC11C \uB05D\uB0B8\uB2E4. \uBAA9\uB85D\uC774 \uD544\uC694\uD558\uBA74 \uD56D\uBAA9\uB2F9 \uD55C \uC904\uB85C \uC9E7\uAC8C \uC4F4\uB2E4.",
    "7. \uB108 \uC790\uC2E0\uC744 \uAE40\uC900\uC218\uB77C\uACE0 \uB9D0\uD558\uC9C0 \uC54A\uB294\uB2E4. \uAE40\uC900\uC218\uB97C 3\uC778\uCE6D\uC73C\uB85C \uC9C0\uCE6D\uD55C\uB2E4.",
    "",
    "## \uD504\uB85C\uD544",
    JSON.stringify(PROFILE, null, 2)
  ].join("\n");
}
__name(systemPrompt, "systemPrompt");

// src/index.js
var ALLOWED_ORIGINS = [
  "https://kimjusnu.github.io",
  "http://127.0.0.1:3000",
  "http://localhost:3000"
];
var MODEL = "@cf/meta/llama-3.1-8b-instruct";
var MAX_QUESTION_CHARS = 500;
var MAX_HISTORY_TURNS = 6;
var MAX_OUTPUT_TOKENS = 320;
var RATE_LIMIT = { requests: 20, windowSeconds: 300 };
function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin"
  };
}
__name(corsHeaders, "corsHeaders");
function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(origin) }
  });
}
__name(json, "json");
async function rateLimited(env, ip) {
  if (!env.RATE_LIMIT_KV) return false;
  const key = `rl:${ip}`;
  const used = parseInt(await env.RATE_LIMIT_KV.get(key) || "0", 10);
  if (used >= RATE_LIMIT.requests) return true;
  await env.RATE_LIMIT_KV.put(key, String(used + 1), {
    expirationTtl: RATE_LIMIT.windowSeconds
  });
  return false;
}
__name(rateLimited, "rateLimited");
function sanitize(messages) {
  if (!Array.isArray(messages)) return null;
  const clean = messages.filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string").map((m) => ({ role: m.role, content: m.content.slice(0, MAX_QUESTION_CHARS) })).slice(-MAX_HISTORY_TURNS);
  const last = clean[clean.length - 1];
  if (!last || last.role !== "user" || !last.content.trim()) return null;
  return clean;
}
__name(sanitize, "sanitize");
var index_default = {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = ALLOWED_ORIGINS.includes(origin);
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(allowed ? origin : ALLOWED_ORIGINS[0]) });
    }
    if (!allowed) {
      return json({ error: "origin_not_allowed" }, 403, ALLOWED_ORIGINS[0]);
    }
    if (request.method !== "POST") {
      return json({ error: "method_not_allowed" }, 405, origin);
    }
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (await rateLimited(env, ip)) {
      return json({ error: "rate_limited" }, 429, origin);
    }
    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "bad_json" }, 400, origin);
    }
    const messages = sanitize(payload.messages);
    if (!messages) {
      return json({ error: "bad_messages" }, 400, origin);
    }
    try {
      const stream = await env.AI.run(MODEL, {
        messages: [{ role: "system", content: systemPrompt() }, ...messages],
        max_tokens: MAX_OUTPUT_TOKENS,
        temperature: 0.2,
        // low: this should recite the resume, not riff on it
        stream: true
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          ...corsHeaders(origin)
        }
      });
    } catch (err) {
      return json({ error: "upstream_failed", detail: String(err && err.message) }, 502, origin);
    }
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
