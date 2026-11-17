# Nekotail — Remotion promo

24 seconds · 1920 × 1080 · 30 fps · H.264 MP4 with AAC audio.

A photo-led promo using the app's yellow, cobalt, and pink design. The app demo is recreated as frame-driven React components using its existing controls and photographs. Spring transitions, cursor clicks, a photo collage, real meows, and original procedural percussion are deterministic at every frame.

## Render with Bun

From this directory:

```sh
bun install --frozen-lockfile
bun run check
bun run render
```

Outputs:

- `out/nekotail-promo.mp4` — finished video.
- `out/poster.png` — poster image.
- `out/frame-*.png` — six scene checks.

`bun run stills` renders the storyboard without encoding the video. `bun run render --video-only` skips the storyboard. `bun run studio` opens the editable Remotion composition. The renderer uses `CHROME_PATH` if set, the locally available Chromium installation when present, or Remotion's normal browser discovery otherwise. FFmpeg and ffprobe must be on PATH for asset preparation.

`prepare.ts` copies only the selected assets from the parent app into the ignored local `public/` directory and generates the original soundtrack. Dependencies, public assets, bundles, and rendered files are isolated from the Astro app. The root TypeScript config excludes this separate project.

## Timeline

| Time | Scene |
| --- | --- |
| 0–3s | Brand and cat-photo intro |
| 3–9s | Picture-serving controls and changing cats |
| 9–12s | Photo collage and 150-cat collection |
| 12–17s | Seven-voice feature and three real meows |
| 17–21s | HTTP cats with visible photos and status badges |
| 21–24s | Brand, feature summary, and app stack |

Edit `src/Video.tsx` for scenes and motion, `src/Root.tsx` for composition settings, and `prepare.ts` for sound design. See `CREDITS.md` for the selected media sources.

## Validation

Rendered with Remotion 4.0.544 and Bun 1.4.4. Both the isolated video TypeScript check and the parent Astro check pass. The exported file is 24.000 seconds, 1920×1080 at 30 fps, H.264 with stereo AAC audio, approximately 10.5 MB. FFmpeg decoded the video and audio without errors; measured audio peak is −7.4 dBFS. Six frames from the encoded MP4 were inspected for text, photo rendering, layout, and cropping. Playback timing and mixing were checked through the rendered media and stream analysis; audible listening was not verified.
