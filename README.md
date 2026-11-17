# Nekotail — Cat-as-a-Service

A private cat playground for your tailnet. Built with Astro, the standalone server adapter, and the Bun runtime, served through Tailscale Serve. Bundled pictures and sound keep the cat content independent of external APIs.

## Run

Requires Bun 1.4.4+, and Tailscale for tailnet hosting.

```sh
bun install --frozen-lockfile
bun run dev
```

Development: http://127.0.0.1:4321

```sh
bun run check
bun test
bun run build
bun run start
```

## Host on your tailnet

```sh
bun run build
bash scripts/install-service.sh
tailscale serve --bg 4321
```

The installer creates and enables a systemd **user** service, with automatic restart on failure. It starts with your user session after reboot. To keep user services running while logged out, enable lingering separately with `loginctl enable-linger "$USER"` if needed. The machine must remain powered on and connected to Tailscale. Serve might require enabling HTTPS in your Tailscale admin console; follow its CLI instructions.

The server listens only on `127.0.0.1`. `TRUST_TAILSCALE_PROXY=1` is enabled by the user service so the final `X-Forwarded-For` address appended by Serve identifies each device. Never enable this variable behind an untrusted proxy or expose the application port directly. This identity is for cat assignment; access is enforced by Tailscale’s policy. Local browsers use an HTTP-only cookie instead. Different devices have different stable identity IDs; photos come from a shared 150-photo collection and can repeat across devices. The original six resident assignments stay stable when the random collection grows. No device registry or database is required.

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

Intentional 4xx/5xx cat responses are successful playground interactions. Invalid codes return 400. Identity responses disable shared caching. Favorites are stored only in browser localStorage. The main view shows the photograph and two actions beneath it. Icon controls provide pictures, meows, HTTP cats, favorites, and downloads; the menu contains your assigned cat, API reference, connection details, and credits. The space bar always serves another picture. Fonts use the system font stack.

## Assets

150 bundled cat photographs: the original 24 from Unsplash and 126 Wikimedia Commons portraits. Unsplash images use the [Unsplash license](https://unsplash.com/license); Commons images retain their individual Creative Commons or public-domain licenses. Photographer names, source pages, licenses, and thumbnail details are recorded in [public/cats/sources.json](public/cats/sources.json) and displayed at `/photo-credits`, linked from the app’s Credits menu. The images are bundled locally; serving a cat does not contact either source.

“[Meow.ogg](https://commons.wikimedia.org/wiki/File:Meow.ogg)”: Silas meowing, recorded by Dan Crosby (Dcrosby). Unmodified, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). Lucide icons: ISC license.

Implementation references: [Astro Node adapter](https://docs.astro.build/en/guides/integrations-guide/node/), [Tailscale Serve](https://tailscale.com/docs/features/tailscale-serve).

Bun manages dependencies, runs Astro development/build/check commands, runs tests, and serves the production app. `bun.lock` pins the dependency versions. The Astro Node adapter remains as the server build target and runs on Bun’s Node-compatible APIs. Migration reference: [Astro with Bun](https://bun.sh/guides/ecosystem/astro).
