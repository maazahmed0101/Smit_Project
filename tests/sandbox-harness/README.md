# Sandbox smoke tests (optional)
Used when `npm install` was impossible: esbuild bundle + a test-only react-router-dom shim + Playwright.
Paths inside the scripts are sandbox-specific (/tmp/harness, /home/claude/...). Adjust them, or - on a normal machine -
run the real app with `npm run dev` and point the scripts at http://localhost:5173.
- `functional.cjs`  user flows (login, like, follow, save, comment, search, channel tabs, 404, corrupt storage)
- `a11y-sanity.cjs` unnamed buttons/links, unlabeled inputs, h1 count
- `video-and-overflow.cjs` playback/seek/mute + horizontal overflow at 1440/1366/1024/768/390/360
