# TRANSFER.md - PLAY (YouTube-style video platform, React + Vite)

## Project
Frontend built from Figma file `ljlYiC5w3WMq4noBT9Tj9n` ("PLAY"). Dark theme, purple accent #AE7AFF, Inter font.
All data is local/mock (no backend). Stack: React 19, Vite, React Router (react-router-dom), JS/JSX, plain CSS. No other dependencies.

## Current Status
All planned routes/pages/components are written. Verified in the build sandbox with a workaround (see "Verification"), NOT yet with the real toolchain.
FIRST THING TO DO on a machine with internet: `npm install && npm run dev && npm run build` and fix anything that shows up.

## Commands
```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run assets   # regenerates placeholder thumbnails/avatars (scripts/generate-assets.mjs)
```

## Routes
| Route | Page |
|---|---|
| `/` | Home feed (4-col grid, responsive) |
| `/search?q=` | Search results (URL-aware; empty state "No videos available") |
| `/watch/:videoId` | Player, like/dislike, Save (playlists modal), Follow, description, comments, up-next |
| `/channel/:channelId/:tab?` | Channel: tabs videos / playlist / tweets / following |
| `/my-content/:tab?` | Logged-in user's own channel (Edit, announcement composer) |
| `/liked`, `/history`, `/collection`, `/subscribers` | Library pages |
| `/playlist/:playlistId` | Playlist detail (seed or user playlist) |
| `/support`, `/settings` | Simple pages (inferred, not seen in Figma) |
| `*` | 404 |

## Structure
- `src/components/*` (Icon, Logo, Avatar, Button, Menu, Navbar, Sidebar, MobileNav, Layout, Modal, AuthModal, SaveModal, EditProfileModal, EmptyState, ErrorBoundary, VideoCard [grid/channel/row/compact], VideoGrid, VideoPlayer, CommentSection, Tabs, PlaylistCard, ChannelHeader)
- `src/pages/*`, `src/context/{AuthContext,LibraryContext}.jsx`, `src/hooks/*`, `src/data/*`, `src/utils/*`
- `public/thumbs`, `public/avatars` (generated SVG placeholders), `public/media/<videoId>.{webm,mp4}` (one generated 8 s clip per video with its title + running timer; regenerate with `node scripts/generate-videos.mjs`, needs ffmpeg)

## State architecture
- `AuthContext`: mock account. `requireAuth(action, reason)` runs `action(user)` if logged in, else opens the login modal and runs it after login. "Continue as demo user" logs in as Yash Mittal (owns seeded channel).
- `LibraryContext`: liked, disliked, subscriptions, history, playlists (default `watch-later`), comments, tweets, tweetReactions. Actions are exposed via `useLibrary()`.
- Guests can browse; like/dislike/follow/save/comment/react need login (modal). Data is per browser, not per account.

## LocalStorage (prefix `play:`)
`user`, `liked`, `disliked`, `subscriptions`, `history` (max 100, newest first, deduped), `playlists`, `comments` ({videoId: []}), `tweets` ({channelId: []}), `tweetReactions`. All reads are validated; corrupt/missing data falls back to safe defaults (tested).

## Verification (what was actually done)
- `npm install` is impossible in the build sandbox (registry 403), so Vite/React Router were never installed and `npm run dev/build` were NEVER run.
- Workaround: bundled `src/` with esbuild (React 19 from the sandbox) using a small TEST-ONLY react-router-dom shim (not in the project) and drove it with Playwright/Chromium.
- Passed: home grid, home->watch, guest like -> login modal -> pending like applied, history, liked page after reload, follow/unfollow, save modal + create playlist + watch later, Esc closes modal, add comment (+count), collection, subscribers, search (URL, results, empty state, back button), channel tabs incl. tweets/following empty, bad tab redirect, owner announcement + edit profile, playlist page, invalid video/channel/playlist ids, 404, corrupt localStorage. Video plays, pauses, seeks, mutes (webm, Chromium).
- No console errors in those runs (only ERR_ABORTED requests caused by navigating away mid-load). Accessibility sanity (names/labels/h1/main) passes on 13 routes; keyboard: skip link is first focus. Tablet (768/1024) and mobile (390) screenshots reviewed; mobile channel header fixed. No horizontal overflow at 1440/1366/1024/768/390 (360 had one on /collection; fixed and re-checked).
- Sandbox tests are saved in `tests/sandbox-harness/` (see its README).
- NOT verified: real React Router behaviour, Vite dev/build, Safari/Firefox, mp4 fallback, keyboard/screen-reader pass, Google Fonts (Inter falls back to system font offline).

## Known limitations
- Figma inspection was cut short (Figma MCP call limit). Seen via screenshots: Home, Search results, empty/error states, Watch, Channel (Videos/Tweets/Following, guest + owner). NOT seen: mobile frames, Sign up/Log in, modals, edit frames, playlist tab, profile-library, dashboard (metrics/table, "Nav Bar v5"). Those parts are inferred; compare against Figma and adjust.
- Real Figma thumbnails/avatars/banner image could not be downloaded (no network). Replace files in `public/thumbs` and `public/avatars` (same names) or edit `src/data/*`. Banner is a CSS gradient.
- Videos are generated demo clips (title + timer on a moving gradient), not real content; replace `sources` in `src/data/videos.js` with real files/URLs. The mp4 fallback could not be decoded/tested in the sandbox Chromium (no H.264); webm plays in Chrome/Edge/Firefox.
- If a video does not play locally: open the app via `npm run dev` / `npm run preview` (not by double-clicking index.html - absolute /media paths need a server); the player now shows a message + Try again button when files fail to load.
- Video upload / edit-content, dashboard analytics are not implemented.
- Logo is an SVG approximation of the Figma logo.
- Figma typo "No videos avaliable" corrected to "available".

## Next steps
1. Run install/dev/build locally, fix issues (check package versions in package.json).
2. Compare each screen with Figma (spacing, mobile frames, modals) and refine CSS.
3. Swap in real assets.
4. Figma MCP tools were no longer available in the last session - re-open Figma to inspect mobile frames, Sign up/Log in, modals, edit and dashboard frames.
4. Optional: upload flow, dashboard (frames 1:39081), real auth/backend.

## Do not rebuild
Contexts, VideoPlayer, VideoCard, Modal, routing structure, search util - they passed the smoke tests above.
