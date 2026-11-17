import { test } from 'bun:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { voices, randomVoice } from '../src/lib/meows.ts';
import { GET } from '../src/pages/api/meow.ts';

test('voice collection contains distinct, credited local recordings', async () => {
  const sources = JSON.parse(await readFile(new URL('../public/meows/sources.json', import.meta.url), 'utf8'));
  assert.ok(voices.length >= 7);
  assert.equal(new Set(voices.map(voice => voice.id)).size, voices.length);
  const hashes = new Set();
  for (const source of sources) {
    const data = await readFile(new URL(`../public${source.file}`, import.meta.url));
    assert.equal(data.subarray(0, 4).toString(), 'OggS');
    const hash = createHash('sha256').update(data).digest('hex');
    assert.ok(!hashes.has(hash), source.id);
    hashes.add(hash);
    assert.ok(source.artist && source.source && source.license && source.changes);
    assert.ok(source.duration > 0 && source.duration <= 8.1);
  }
});

test('random voices do not immediately repeat the excluded recording', () => {
  let previous = voices[0].id;
  for (let i = 0; i < 100; i++) {
    const voice = randomVoice(previous);
    assert.notEqual(voice.id, previous);
    previous = voice.id;
  }
});

test('audio endpoint selects each voice and keeps random responses uncached', async () => {
  const hashes = new Set();
  for (const voice of voices) {
    const response = await GET({ url: new URL(`http://localhost/api/meow?voice=${voice.id}`) });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('X-Meow-Voice'), voice.id);
    assert.equal(response.headers.get('Content-Type'), 'audio/ogg');
    assert.match(response.headers.get('Cache-Control'), /no-store/);
    const hash = createHash('sha256').update(new Uint8Array(await response.arrayBuffer())).digest('hex');
    assert.ok(!hashes.has(hash));
    hashes.add(hash);
  }
  const excluded = voices[0].id;
  const random = await GET({ url: new URL(`http://localhost/api/meow?exclude=${excluded}`) });
  assert.equal(random.status, 200);
  assert.notEqual(random.headers.get('X-Meow-Voice'), excluded);
  const invalid = await GET({ url: new URL('http://localhost/api/meow?voice=../../etc/passwd') });
  assert.equal(invalid.status, 400);
});
