import type { APIRoute } from 'astro';
import { device, randomCat, privateHeaders } from '../../lib/cats';
export const GET: APIRoute = context => {
  const identity = device(context);
  const cat = context.url.searchParams.get('random') === '1' ? randomCat(context.url.searchParams.get('exclude')) : identity.cat;
  return Response.json({ ...cat, device: { id: identity.id, address: identity.address, tailnet: identity.tailnet }, assigned: context.url.searchParams.get('random') !== '1' }, { headers: privateHeaders });
};
