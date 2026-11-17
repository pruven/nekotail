import { test } from 'node:test';
import assert from 'node:assert/strict';
import { device, randomCat } from '../src/lib/cats.ts';

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
