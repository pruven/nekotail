import type { APIRoute } from 'astro';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { privateHeaders } from '../../lib/cats';
const exec = promisify(execFile);
let cached: { at: number; value: object } | undefined;
export const GET: APIRoute = async () => {
  if (cached && Date.now() - cached.at < 15000) return Response.json(cached.value, { headers: privateHeaders });
  try {
    const { stdout } = await exec('tailscale', ['status', '--json'], { timeout: 3000, maxBuffer: 1024 * 1024 });
    const state = JSON.parse(stdout);
    const value = { online: state.BackendState === 'Running', hostname: state.Self?.HostName ?? 'This host', dns: state.Self?.DNSName?.replace(/\.$/, ''), peers: Object.values(state.Peer ?? {}).filter((peer: any) => peer.Online).length, serving: process.env.TRUST_TAILSCALE_PROXY === '1' };
    cached = { at: Date.now(), value };
    return Response.json(value, { headers: privateHeaders });
  } catch {
    return Response.json({ online: false, hostname: 'Local host', peers: 0, serving: false }, { headers: privateHeaders });
  }
};
