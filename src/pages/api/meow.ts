import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { privateHeaders } from '../../lib/cats';
import { randomVoice, voices } from '../../lib/meows';

export const GET: APIRoute = async ({ url }) => {
  const requested = url.searchParams.get('voice');
  const voice = requested !== null
    ? voices.find(item => item.id === requested)
    : randomVoice(url.searchParams.get('exclude'));
  if (!voice) return Response.json({ error: 'Unknown voice', voices: voices.map(item => item.id) }, { status: 400, headers: privateHeaders });

  const data = await readFile(`${process.cwd()}/public${voice.file}`);
  return new Response(new Uint8Array(data), {
    headers: {
      ...privateHeaders,
      'Content-Type': 'audio/ogg',
      'Content-Disposition': `inline; filename="${voice.id}.ogg"`,
      'X-Meow-Voice': voice.id,
    },
  });
};
