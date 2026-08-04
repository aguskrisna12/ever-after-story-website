import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Ever After Story landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>Bali Wedding Content Creator \| Ever After Story<\/title>/i);
  assert.match(html, /Your Love, Beautifully Remembered/);
  assert.match(html, /Let’s Tell Your Love Story/);
  assert.match(html, /Send Inquiry via WhatsApp/);
  assert.match(html, /id="(?:home|about|portfolio|services|process|contact)"/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|lorem ipsum/i);
});

test("keeps sample testimonials explicitly marked as placeholders", async () => {
  const source = await readFile(new URL("../content/testimonials.ts", import.meta.url), "utf8");
  assert.match(source, /PLACEHOLDER TESTIMONIALS/);
});
