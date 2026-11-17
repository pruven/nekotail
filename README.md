# Nekotail — Cat-as-a-Service

A private cat playground for your tailnet. Built with Astro and the standalone Node.js adapter, served through Tailscale Serve. Bundled pictures and sound keep the cat content independent of external APIs.

## Run

Requires Node.js 24+, npm, and Tailscale for tailnet hosting.

```sh
npm ci
npm run dev
```

Development: http://127.0.0.1:4321

```sh
npm run check
npm test
npm run build
npm start
```

## Host on your tailnet

```sh
npm run build
bash scripts/install-service.sh
tailscale serve --bg 4321
```

The installer creates and enables a systemd **user** service, with automatic restart on failure. It starts with your user session after reboot. To keep user services running while logged out, enable lingering separately with `loginctl enable-linger "$USER"` if needed. The machine must remain powered on and connected to Tailscale. Serve might require enabling HTTPS in your Tailscale admin console; follow its CLI instructions.

The server listens only on `127.0.0.1`. `TRUST_TAILSCALE_PROXY=1` is enabled by the user service so the final `X-Forwarded-For` address appended by Serve identifies each device. Never enable this variable behind an untrusted proxy or expose the Node port directly. This identity is for cat assignment; access is enforced by Tailscale’s policy. Local browsers use an HTTP-only cookie instead. Different devices have different stable identity IDs; photos come from a shared six-cat pool and can repeat across devices. No device registry or database is required.

```sh
systemctl --user status nekotail
systemctl --user restart nekotail
journalctl --user -u nekotail
```

After code changes, rebuild and restart. To stop: `systemctl --user disable --now nekotail` and `tailscale serve --https=443 off` (the latter removes the machine's port 443 Serve route).

## Endpoints

| Endpoint | Response |
| --- | --- |
| `GET /api/cat` | Device’s assigned cat, mood, picture URL, and anonymous device ID |
| `GET /api/cat?random=1` | Random cat; optional `exclude=Miso` avoids an immediate repeat |
| `GET /api/meow` | Bundled real meow, `audio/ogg` |
| `GET /api/status` | Random cat status JSON with the actual HTTP status |
| `GET /api/status?code=418` | A chosen status; 200, 201, 400, 401, 403, 404, 418, 429, 500, 503 supported |
| `GET /api/network` | Host connection status and online peer count; cached for 15 seconds |

Intentional 4xx/5xx cat responses are successful playground interactions. Invalid codes return 400. Identity responses disable shared caching. Favorites are stored only in browser localStorage; the request log lasts for the current page session. Interface fonts use Google Fonts with local system fallbacks.

## Assets

Cat photographs from Unsplash, under the [Unsplash license](https://unsplash.com/license): photo IDs `1514888286974-6c03e2ca1dba`, `1573865526739-10659fec78a5`, `1495360010541-f48722b34f7d`, `1511044568932-338cba0ad803`, `1533738363-b7f9aef128ce`, `1526336024174-e58f5cdd8e13`.

“[Meow.ogg](https://commons.wikimedia.org/wiki/File:Meow.ogg)”: Silas meowing, recorded by Dan Crosby (Dcrosby). Unmodified, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). Lucide icons: ISC license.

Implementation references: [Astro Node adapter](https://docs.astro.build/en/guides/integrations-guide/node/), [Tailscale Serve](https://tailscale.com/docs/features/tailscale-serve).
