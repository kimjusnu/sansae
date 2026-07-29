/**
 * Renders portfolio/resume/ to resume-ko.pdf and resume-en.pdf.
 *
 * The HTML is the original; these files are the artefact. Regenerate them
 * whenever the resume changes, otherwise the download and the page drift apart
 * — which is the whole failure mode keeping a separate PDF was meant to avoid.
 *
 * Chrome prints the page it is given, so the sheet is laid out in millimetres
 * and @page is A4 with no margin: the padding on .sheet is the margin.
 *
 * Run:  node design/build-resume-pdf.mjs
 */
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { extname, join, resolve, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(HERE, '..', 'portfolio');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const CDP_PORT = 9377;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
};

/* ----------------------------------------------------------
   A static server of its own, so this does not depend on one
   already running on some particular port.
   ---------------------------------------------------------- */
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(req.url.split('?')[0]);
  // normalize() collapses any ../ before the join, so a crafted URL cannot
  // reach outside portfolio/.
  const file = join(ROOT, normalize(path).replace(/^(\.\.[/\\])+/, ''));
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
});
const port = await new Promise(r => server.listen(0, '127.0.0.1', () => r(server.address().port)));

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run',
  '--user-data-dir=' + join(HERE, '.chrome-pdf'),
  '--remote-debugging-port=' + CDP_PORT, 'about:blank',
], { stdio: 'ignore' });

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function target() {
  for (let i = 0; i < 40; i++) {
    try {
      const list = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`).then(r => r.json());
      const page = list.find(t => t.type === 'page');
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error('Chrome이 응답하지 않습니다');
}

const ws = new WebSocket(await target());
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
let id = 0;
const pending = new Map();
ws.onmessage = e => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    const { res, rej } = pending.get(m.id);
    pending.delete(m.id);
    m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result);
  }
};
const send = (method, params = {}) =>
  new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async expr =>
  (await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result?.value;

await send('Page.enable');
await send('Runtime.enable');

for (const lang of ['ko', 'en']) {
  await send('Page.navigate', { url: `http://127.0.0.1:${port}/resume/index.html?lang=${lang}` });
  await sleep(1200);
  // Fonts settle after layout; printing early can reflow the last line onto a
  // second page.
  await evaluate('document.fonts ? document.fonts.ready.then(() => true) : true');
  await sleep(400);

  const applied = await evaluate('document.documentElement.lang');
  if (applied !== lang) throw new Error(`${lang} 요청했는데 ${applied}로 렌더됐습니다`);

  const { data } = await send('Page.printToPDF', {
    printBackground: true,
    preferCSSPageSize: true,
    marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0,
  });

  const out = join(ROOT, 'resume', `resume-${lang}.pdf`);
  await writeFile(out, Buffer.from(data, 'base64'));
  const kb = Buffer.from(data, 'base64').length / 1024;
  console.log(`resume-${lang}.pdf  ${kb.toFixed(0)}KB`);
}

ws.close();
chrome.kill();
server.close();
