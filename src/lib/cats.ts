import { createHash, randomInt, randomUUID } from 'node:crypto';
import { isIP } from 'node:net';
import type { APIContext } from 'astro';

export const cats = [
  { name: 'Miso', image: '/cats/miso.jpg', mood: 'Watching the world go by', color: 'Tabby' },
  { name: 'Mochi', image: '/cats/mochi.jpg', mood: 'Taking a very important nap', color: 'Ginger' },
  { name: 'Olive', image: '/cats/olive.jpg', mood: 'Quietly judging your code', color: 'Tabby' },
  { name: 'Nori', image: '/cats/nori.jpg', mood: 'Taking a well-earned catnap', color: 'Ginger' },
  { name: 'Tofu', image: '/cats/tofu.jpg', mood: 'Too cool for a health check', color: 'Fluffy' },
  { name: 'Pip', image: '/cats/pip.jpg', mood: 'Ready for a small adventure', color: 'Calico' },
];
export const statuses = [
  { code: 200, title: 'OK', message: 'All systems purring.' },
  { code: 201, title: 'Created', message: 'A new cat has entered the chat.' },
  { code: 400, title: 'Bad Request', message: 'That is not how you ask for treats.' },
  { code: 401, title: 'Unauthorized', message: 'You have not paid the tuna tax.' },
  { code: 403, title: 'Forbidden', message: 'The belly is off limits.' },
  { code: 404, title: 'Not Found', message: 'Probably hiding under the couch.' },
  { code: 418, title: "I’m a teapot", message: 'Small, warm, and making noises.' },
  { code: 429, title: 'Too Many Requests', message: 'One pet at a time, please.' },
  { code: 500, title: 'Internal Server Error', message: 'A cat walked across the keyboard.' },
  { code: 503, title: 'Service Unavailable', message: 'Currently asleep. Try after snacks.' },
];

export function device(context: Pick<APIContext, 'request' | 'cookies'>) {
  // Trust forwarding only in the explicitly configured, loopback-only Serve deployment.
  // Go's ReverseProxy appends the actual peer address as the LAST X-Forwarded-For value.
  const forwarded = process.env.TRUST_TAILSCALE_PROXY === '1'
    ? context.request.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim() : undefined;
  const octets = forwarded?.split('.').map(Number);
  const tailnet = forwarded && isIP(forwarded) && (
    (octets?.length === 4 && octets[0] === 100 && octets[1] >= 64 && octets[1] <= 127)
    || forwarded.toLowerCase().startsWith('fd7a:115c:a1e0:')
  );
  let key = tailnet ? forwarded : context.cookies.get('nekotail-device')?.value;
  if (!key || key.length > 128) {
    key = randomUUID();
    context.cookies.set('nekotail-device', key, { path: '/', httpOnly: true, sameSite: 'lax', secure: new URL(context.request.url).protocol === 'https:', maxAge: 31536000 });
  }
  const id = createHash('sha256').update(key).digest('hex');
  const index = Number.parseInt(id.slice(0, 8), 16) % cats.length;
  return { id: id.slice(0, 8), cat: cats[index], index, address: tailnet ? forwarded : 'Local browser', tailnet: !!tailnet };
}

export function randomCat(exclude?: string | null) {
  const pool = cats.filter(cat => cat.name !== exclude);
  return pool[randomInt(pool.length)];
}
export const privateHeaders = { 'Cache-Control': 'private, no-store', 'Vary': 'Cookie, X-Forwarded-For', 'X-Content-Type-Options': 'nosniff' };
