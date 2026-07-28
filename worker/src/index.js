/**
 * Portfolio assistant — Cloudflare Worker.
 *
 * Sits between the static site and Workers AI. Workers AI is reached through a
 * binding rather than an API key, so there is no secret in this repo and none
 * to leak.
 *
 * The endpoint is public, which means it is also a free LLM for anyone who
 * finds it. Origin checks, a per-IP rate limit and hard caps on input, history
 * and output are what keep that from being true.
 */

import { systemPrompt } from './persona.js';

const ALLOWED_ORIGINS = [
  'https://kimjusnu.github.io',
  'http://127.0.0.1:3000',
  'http://localhost:3000',
];

const MODEL = '@cf/meta/llama-3.1-8b-instruct';

const MAX_QUESTION_CHARS = 500;
const MAX_HISTORY_TURNS = 6;   // user+assistant messages kept from earlier turns
const MAX_OUTPUT_TOKENS = 320; // long answers are where invention creeps in

const RATE_LIMIT = { requests: 20, windowSeconds: 300 };

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders(origin) },
  });
}

/**
 * Per-IP counter in KV. Absent a KV binding the limiter opens rather than
 * closes — a misconfigured namespace should not take the assistant down.
 */
async function rateLimited(env, ip) {
  if (!env.RATE_LIMIT_KV) return false;
  const key = `rl:${ip}`;
  const used = parseInt((await env.RATE_LIMIT_KV.get(key)) || '0', 10);
  if (used >= RATE_LIMIT.requests) return true;
  await env.RATE_LIMIT_KV.put(key, String(used + 1), {
    expirationTtl: RATE_LIMIT.windowSeconds,
  });
  return false;
}

/** Keep only well-formed turns, drop anything but the last few, cap length. */
function sanitize(messages) {
  if (!Array.isArray(messages)) return null;

  const clean = messages
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map(m => ({ role: m.role, content: m.content.slice(0, MAX_QUESTION_CHARS) }))
    .slice(-MAX_HISTORY_TURNS);

  const last = clean[clean.length - 1];
  if (!last || last.role !== 'user' || !last.content.trim()) return null;
  return clean;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = ALLOWED_ORIGINS.includes(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(allowed ? origin : ALLOWED_ORIGINS[0]) });
    }
    if (!allowed) {
      return json({ error: 'origin_not_allowed' }, 403, ALLOWED_ORIGINS[0]);
    }
    if (request.method !== 'POST') {
      return json({ error: 'method_not_allowed' }, 405, origin);
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (await rateLimited(env, ip)) {
      return json({ error: 'rate_limited' }, 429, origin);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: 'bad_json' }, 400, origin);
    }

    const messages = sanitize(payload.messages);
    if (!messages) {
      return json({ error: 'bad_messages' }, 400, origin);
    }

    try {
      const stream = await env.AI.run(MODEL, {
        messages: [{ role: 'system', content: systemPrompt() }, ...messages],
        max_tokens: MAX_OUTPUT_TOKENS,
        temperature: 0.2, // low: this should recite the resume, not riff on it
        stream: true,
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          ...corsHeaders(origin),
        },
      });
    } catch (err) {
      return json({ error: 'upstream_failed', detail: String(err && err.message) }, 502, origin);
    }
  },
};
