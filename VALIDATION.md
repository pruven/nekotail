# Validation

Built and deployed on 17 November 2026 using Node.js 26.

- `npm run check`: zero errors, warnings, or hints.
- `npm test`: three passing tests for cookie persistence, trusted proxy identity, and random selection without immediate repeats.
- `npm run build`: production Astro Node build passes.
- Production smoke checks: HTML, identity persistence, six bundled images, real Ogg audio, all ten HTTP status codes, and invalid-code handling pass.
- Tailnet HTTPS returns 200 with a valid certificate and correctly identifies the host's Tailscale address. Tested from the hosting machine; another physical device was not available for end-to-end verification. An initial request timed out while Serve was obtaining its certificate; subsequent HTTPS requests succeeded.
- `nekotail.service` is enabled and running. User lingering is enabled so the service continues after logout and starts at boot. Tailscale Serve runs in background mode.
- Headless screenshot inspection: desktop 1440 and phone 390 have working image rendering and no horizontal overflow. Tablet screenshots are retained in the ignored `shots/` directory.
- Frontend skill performance check at 1440 and 390: zero failures; warnings concern the shared full-size cat photo reused for a tiny avatar, and the avatar below the fold. Reusing the same URL avoids another image transfer. Observed LCP about 1.15 seconds desktop / 0.64 seconds phone, layout shift 0.001 / 0.000. These are one-run local measurements, not field metrics.

This is an interactive software playground with a sidebar, not a marketing landing page. The design uses warm neutral surfaces, terracotta actions, DM Sans and Space Grotesk, bundled cat photography, and quiet button interactions. Marketing section dealers, full-screen hero rhythm, shader effects, and marketing layout checkers were not used. No prices, testimonials, customer figures, or contact details were invented. Asset credits are in the app and README.

Remaining limits: six shared source photos mean different device identities can use the same photo; the stable assignment is a hash of each device address. Local browsing falls back to a cookie. Favorites are browser-local. Browser screenshots and API smoke checks do not substitute for automated click-through or audio listening tests.

## Visual redesign

The current interface replaces the sidebar dashboard with a full-width editorial playground: forest green background, pale lime actions, Instrument Serif headline, DM Sans controls, and a large cat photograph. API tools and the current session history now live in a collapsed “Under the hood” panel. Existing endpoint contracts, local favorites, download behavior, device assignments, and keyboard controls are retained. Tab changes also update the tabpanel's accessible label.

Production build and Astro checks pass without diagnostics. Verified all client control IDs against rendered HTML, the cat endpoint, the actual HTTP 418 response, the production stylesheet, and the updated tailnet HTTPS page. Inspected headless screenshots at 1440, 768, and 390 pixels with no horizontal overflow. Performance script: zero failures; mobile warnings concern the shared source image and lower-page avatar, and CPU activity limits timing reliability. These are local checks, not cross-device or audio listening tests.
