import type { APIRoute } from 'astro';
import { randomInt } from 'node:crypto';
import { statuses, randomCat, privateHeaders } from '../../lib/cats';
export const GET: APIRoute = ({ url }) => {
  const requested = url.searchParams.get('code');
  const status = requested ? statuses.find(item => String(item.code) === requested) : statuses[randomInt(statuses.length)];
  if (!status) return Response.json({ error: 'Unsupported cat code', codes: statuses.map(item => item.code) }, { status: 400, headers: privateHeaders });
  return Response.json({ ...status, cat: randomCat() }, { status: status.code, headers: privateHeaders });
};
