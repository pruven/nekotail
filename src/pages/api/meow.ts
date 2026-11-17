import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { privateHeaders } from '../../lib/cats';
export const GET: APIRoute = async () => {
  const data = await readFile(`${process.cwd()}/public/meow.ogg`);
  return new Response(new Uint8Array(data), { headers: { ...privateHeaders, 'Content-Type': 'audio/ogg', 'Content-Disposition': 'inline; filename="meow.ogg"' } });
};
