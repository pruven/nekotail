import { test } from 'bun:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { cats, device, randomCat } from '../src/lib/cats.ts';

function context(headers = {}, cookie) {
  const stored = new Map(cookie ? [['nekotail-device', cookie]] : []);
  return { request: new Request('http://localhost:4321', { headers }), cookies: { get: key => stored.has(key) ? { value: stored.get(key) } : undefined, set: (key, value) => stored.set(key, value) }, stored };
}
test('local assignment persists with its cookie and ignores untrusted forwarding', () => {
  delete process.env.TRUST_TAILSCALE_PROXY;
  const ctx = context({ 'x-forwarded-for': '100.100.100.100' });
  const first = device(ctx);
  const second = device(context({}, ctx.stored.get('nekotail-device')));
  assert.equal(first.id, second.id);
  assert.equal(first.cat.name, second.cat.name);
  assert.equal(first.tailnet, false);
});
test('trusted Serve uses the final peer, independent of cookies and spoofed prefixes', () => {
  process.env.TRUST_TAILSCALE_PROXY = '1';
  const first = device(context({ 'x-forwarded-for': '1.2.3.4, 100.100.100.100' }));
  const second = device(context({ 'x-forwarded-for': '100.100.100.100' }, 'different-browser'));
  assert.equal(first.id, second.id);
  assert.equal(first.address, '100.100.100.100');
  assert.equal(first.tailnet, true);
  assert.notEqual(first.id, device(context({ 'x-forwarded-for': '100.100.100.101' })).id);
  delete process.env.TRUST_TAILSCALE_PROXY;
});
test('random picture does not immediately repeat an excluded cat', () => {
  for (let i = 0; i < 50; i++) assert.notEqual(randomCat('Miso').name, 'Miso');
});
test('expanding the collection preserves existing resident assignments', () => {
  process.env.TRUST_TAILSCALE_PROXY = '1';
  try {
    assert.equal(device(context({ 'x-forwarded-for': '100.118.111.84' })).cat.name, 'Olive');
  } finally {
    delete process.env.TRUST_TAILSCALE_PROXY;
  }
});
test('every catalog photo is a bundled JPEG with a source credit', async () => {
  const sources = JSON.parse(await readFile(new URL('../public/cats/sources.json', import.meta.url), 'utf8'));
  assert.equal(new Set(cats.map(cat => cat.name)).size, cats.length);
  assert.equal(new Set(cats.map(cat => cat.image)).size, cats.length);
  assert.ok(cats.length >= 24);
  for (const cat of cats) {
    const bytes = await readFile(new URL(`../public${cat.image}`, import.meta.url));
    assert.equal(bytes.subarray(0, 3).toString('hex'), 'ffd8ff', cat.image);
    assert.ok(sources.some(source => source.file === cat.image && source.license && source.source), cat.image);
  }
});
