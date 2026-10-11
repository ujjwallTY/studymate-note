// Cloudflare Pages "advanced mode" worker. It does two things:
//   1. POST /ai  -> asks Gemini for you, using the secret key stored in Cloudflare (never in the page)
//   2. everything else -> serves the normal site files (index.html)
//
// Setup: Pages project -> Settings -> Variables and Secrets -> add a SECRET named GEMINI_API_KEY,
// then deploy again so it takes effect.

const MAX_PROMPT = 12000;                     // characters, stops people sending huge prompts
const LIMIT = 40, WINDOW = 10 * 60 * 1000;    // 40 requests per 10 minutes per visitor (per Worker instance)
const hits = new Map();
let modelCache = null;

const reply = (obj, status) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } });

async function gemini(path, key, body) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/${path}`, {
    method: body ? "POST" : "GET",
    headers: { "x-goog-api-key": key, ...(body ? { "content-type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined
  });
  let data = {};
  try { data = await res.json(); } catch (e) {}
  if (!res.ok) {
    const err = new Error((data.error && data.error.message) || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

async function pickModels(key) {
  if (modelCache) return modelCache;
  const data = await gemini("models?pageSize=200", key);
  const names = (data.models || [])
    .filter(m => (m.supportedGenerationMethods || []).includes("generateContent") && m.name.startsWith("models/gemini"))
    .map(m => m.name.slice(7));
  const skip = ["image", "tts", "live", "audio", "exp", "preview", "thinking", "8b", "vision"];
  const ok = names.filter(n => !skip.some(s => n.includes(s)));
  const desc = (a, b) => (a < b ? 1 : -1);
  modelCache = [
    ...ok.filter(n => n.includes("flash") && !n.includes("lite")).sort(desc),
    ...ok.filter(n => n.includes("flash") && n.includes("lite")).sort(desc),
    ...ok.filter(n => !n.includes("flash")).sort(desc)
  ];
  return modelCache;
}

async function handleAI(req, env) {
  if (req.method !== "POST") return reply({ error: "Use POST." }, 405);
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin) return reply({ error: "Not allowed from another site." }, 403);
  if (!env.GEMINI_API_KEY) return reply({ error: "The site is missing its GEMINI_API_KEY secret (add it in Settings, then deploy again)." }, 500);

  const who = req.headers.get("cf-connecting-ip") || "unknown", now = Date.now();
  const recent = (hits.get(who) || []).filter(t => now - t < WINDOW);
  if (recent.length >= LIMIT) return reply({ error: "Too many requests. Try again in a few minutes." }, 429);
  hits.set(who, [...recent, now]);
  if (hits.size > 5000) hits.clear();

  let prompt;
  try { prompt = (await req.json()).prompt; } catch (e) {}
  if (typeof prompt !== "string" || !prompt.trim()) return reply({ error: "Send JSON like {\"prompt\": \"...\"}." }, 400);
  if (prompt.length > MAX_PROMPT) return reply({ error: "Prompt too long." }, 413);

  let attempts = 0, last;
  try {
    for (const model of (await pickModels(env.GEMINI_API_KEY)).slice(0, 4)) {
      try {
        attempts++;   // free keys have separate limits per model, so try the next one on quota/busy errors
        const data = await gemini(`models/${model}:generateContent`, env.GEMINI_API_KEY, {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        });
        return reply({ text: data.candidates[0].content.parts[0].text, attempts }, 200);
      } catch (e) {
        last = e;
        if (![429, 404, 503].includes(e.status)) throw e;
      }
    }
    throw last || new Error("No usable Gemini model for this key.");
  } catch (e) {
    return reply({ error: `Gemini returned HTTP ${e.status || "?"}: ${String(e.message).slice(0, 150)}`, attempts },
                 e.status === 429 ? 429 : 502);
  }
}

export default {
  async fetch(req, env) {
    if (new URL(req.url).pathname === "/ai") return handleAI(req, env);
    return env.ASSETS.fetch(req);            // normal site files
  }
};
