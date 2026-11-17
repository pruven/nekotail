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

## Cat collection and Bun migration

The random collection now includes 24 bundled Unsplash photographs (18 additions), visually inspected before inclusion. Each asset has a source and license entry in `public/cats/sources.json`. The interface count and connection dialog use the shared catalog. The original resident-assignment pool stays fixed so existing devices keep their cats as the random collection grows.

Bun 1.4.4 now manages dependencies (`bun.lock` replaces `package-lock.json`), runs Astro development/build/check commands with the Bun runtime, runs the tests, and runs the systemd production service. Updated the installer to resolve the actual Bun executable and restart an existing service after configuration changes. Setup docs use Bun commands. Earlier npm checks in this document describe the original deployment only.

Validation: frozen Bun install passes; Astro check reports zero diagnostics; Bun production build succeeds; five Bun tests pass, including bundled JPEG/source coverage and resident assignment compatibility. Production smoke checks under Bun pass for all 24 images, random selection, cookie identity persistence, all ten actual HTTP status codes, real Ogg audio, and the Tailscale subprocess. Tailnet HTTPS serves the updated 24-photo interface. Confirmed systemd's running executable is Bun 1.4.4.

## Photo-first simplification

The default view now contains a large, uncropped cat photograph and two visible action labels directly beneath it: “Serve another cat” and “Surprise me.” Removed promotional copy, photo metadata, device panels, counters, the request-history interface, and the footer. Secondary modes, favorites, downloads, and the options menu use accessible icon buttons. API documentation, assigned-cat reset, connection details, and asset credits remain available on request. The primary action and space bar always return to a fresh picture; Surprise me retains picture, meow, and HTTP-cat responses.

Bun production build and Astro type checks pass with zero diagnostics. Verified client control IDs, document order, removed copy, the random-photo endpoint, and the updated tailnet HTTPS page. Desktop and mobile screenshot inspection confirms the photo and buttons fit within the viewport. No backend or cat-assignment behavior changed. Click-through and audible playback were not tested in a browser during this layout change.

## Brutalist theme

Applied a paper-white and black palette, monospace type, square controls, heavy borders, and solid offset shadows to the photo-first layout, dialogs, and favicon. The image remains uncropped, with the two primary actions underneath and no additional visible copy. Bun build and Astro checks pass without diagnostics; verified the live stylesheet, photo/action order, random-cat endpoint, and tailnet HTTPS page. Inspected 1440×900 and 390×844 screenshots: images and controls fit with no horizontal overflow.

## Pop-art color update

Replaced the monochrome styling with a saturated yellow dotted backdrop, cobalt photo-frame depth, pink secondary actions, white photo mat, dark outlines, and heavier sans-serif controls. Rounded the hard-edged controls slightly while retaining tactile press states. Kept the photo-first composition and the same two action labels underneath. Updated the favicon to match. Bun build and Astro checks pass without diagnostics; inspected desktop and phone screenshots with no overflow and verified the production palette, random-photo endpoint, and tailnet HTTPS page.

## HTTP cat visibility fix

The HTTP status UI used an opaque panel covering the entire photograph. Replaced it with a compact, non-interactive corner badge containing only the code and title, leaving the underlying cat visible. Verified all ten status endpoints return the intended actual HTTP status and an available JPEG; tailnet HTTPS also returns a real 418 cat response. Bun build and Astro checks pass. Inspected desktop/mobile status-mode render fixtures assembled from production HTML and a real API response; these checks verify layout rather than browser click-through behavior.
