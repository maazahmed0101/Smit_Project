// Local mock video data. Every video has its own generated demo clip in public/media/<id>.webm|mp4
// (see scripts/generate-videos.mjs) and a generated SVG thumbnail in public/thumbs.
// Swap `sources` / `thumbnail` for real assets when available.
import { asset } from "../utils/asset.js";

const thumb = (n) => asset(`thumbs/thumb-${String(n).padStart(2, "0")}.svg`);

// One generated clip per video (scripts/generate-videos.mjs): webm first, mp4 as fallback.
const mediaFor = (id) => ({ webm: asset(`media/${id}.webm`), mp4: asset(`media/${id}.mp4`) });

const lorem =
  "Lorem ipsum dolor sit amet consectetur. Sagittis egestas justo adipiscing integer.";

const make = (v) => ({
  sources: mediaFor(v.id),
  hoursAgo: 18,
  views: 100000,
  likes: 1200,
  dislikes: 90,
  commentCount: 240,
  duration: "0:08",
  description: lorem,
  tags: [],
  ...v,
});

export const videos = [
  make({
    id: "how-to-learn-react",
    title: "How to learn react | A React Roadmap",
    channelId: "yash-mittal",
    thumbnail: thumb(1),
    tags: ["react", "javascript", "roadmap", "frontend"],
    description:
      "A step-by-step roadmap for learning React: JavaScript foundations, components, state, effects, routing and real projects.",
  }),
  make({
    id: "70m-views",
    title: "How much I made with 70M views",
    channelId: "arnau-ros",
    thumbnail: thumb(2),
    tags: ["creator", "money", "youtube"],
  }),
  make({
    id: "deno-2m-npm",
    title: "Deno just got 2M npm packages",
    channelId: "yash-mittal",
    thumbnail: thumb(3),
    tags: ["deno", "npm", "javascript", "runtime"],
  }),
  make({
    id: "socket-io",
    title: "Best way to learn Socket IO | comlex chat IO",
    channelId: "yash-mittal",
    thumbnail: thumb(4),
    tags: ["socket.io", "websocket", "node", "chat"],
    description: lorem,
  }),
  make({
    id: "terraform-freeapi",
    title: "Terraform, fig & FreeAPI | Updates in Open Source",
    channelId: "yash-mittal",
    thumbnail: thumb(5),
    tags: ["terraform", "open source", "api"],
  }),
  make({
    id: "learn-react-scratch",
    title: "Let\u2019s learn react from scratch",
    channelId: "yash-mittal",
    thumbnail: thumb(6),
    tags: ["react", "beginner", "course"],
  }),
  make({
    id: "google-idx",
    title: "Google\u2019s IDX Unveiled : Exclusive First Look",
    channelId: "yash-mittal",
    thumbnail: thumb(7),
    tags: ["google", "idx", "cloud ide"],
  }),
  make({
    id: "google-pieces-updates",
    title: "Google and Pieces dropped some interesting updates",
    channelId: "yash-mittal",
    thumbnail: thumb(8),
    tags: ["google", "pieces", "updates"],
  }),
  make({
    id: "flutter-dart-pieces",
    title: "Flutter Dart case Study by @getpieces | Engineering side",
    channelId: "arnau-ros",
    thumbnail: thumb(9),
    tags: ["flutter", "dart", "case study", "engineering"],
  }),
  make({
    id: "how-database-works",
    title: "How database works | Engineering side",
    channelId: "arnau-ros",
    thumbnail: thumb(10),
    tags: ["database", "sql", "engineering"],
  }),
  make({
    id: "multi-million-product",
    title: "Building a multi million dollar developer product | Dhiwise",
    channelId: "arnau-ros",
    thumbnail: thumb(11),
    tags: ["startup", "product", "dhiwise"],
  }),
  make({
    id: "how-browser-works",
    title: "How does a browser work? | Engineering side",
    channelId: "arnau-ros",
    thumbnail: thumb(12),
    tags: ["browser", "rendering", "engineering"],
  }),
  make({
    id: "best-monitor-coders",
    title: "Is this the best monitor for coders? | BenQ GW3290QT | Eye-Care Programming Monitor",
    channelId: "david-lee",
    thumbnail: thumb(13),
    tags: ["monitor", "hardware", "setup"],
  }),
  make({
    id: "dsa-leetcode",
    title: "This will change DSA and Leetcode preparation forever | Pieces for developers",
    channelId: "david-lee",
    thumbnail: thumb(14),
    tags: ["dsa", "leetcode", "interview"],
  }),
  make({
    id: "lex-red-dead",
    title: "Lex Fridman plays Red Dead Redemption 2",
    channelId: "lex-fridman",
    thumbnail: thumb(15),
    views: 109067,
    likes: 2,
    dislikes: 9,
    commentCount: 5034,
    tags: ["gaming", "red dead redemption", "lex fridman"],
    description:
      "Tim Urban is the author of the blog Wait But Why and a new book What\u2019s Our Problem?: A Self-Help Book for Societies. In this video Lex plays Red Dead Redemption 2 and talks about games, stories and the people behind them.",
  }),
  make({
    id: "maluma-browser",
    title: "How does a browser work?",
    channelId: "maluma",
    thumbnail: thumb(16),
    tags: ["browser", "music"],
  }),
  make({
    id: "jonas-multi-million",
    title: "Building a multi million dollar",
    channelId: "jonas-brothers",
    thumbnail: thumb(11),
    tags: ["business", "music"],
  }),
  make({
    id: "billie-google-pieces",
    title: "Google and Pieces dropped",
    channelId: "billie-eilish",
    thumbnail: thumb(2),
    tags: ["google", "pieces"],
  }),
  make({
    id: "lilnas-google-pieces",
    title: "Google and Pieces dropped a new update",
    channelId: "lil-nas-x",
    thumbnail: thumb(6),
    tags: ["google", "pieces"],
  }),
  make({
    id: "anuel-database",
    title: "How database works | Engi",
    channelId: "anuel-aa",
    thumbnail: thumb(3),
    tags: ["database"],
  }),
  make({
    id: "billie-terraform",
    title: "Terraform, fig & FreeAPI | Updates",
    channelId: "billie-eilish",
    thumbnail: thumb(9),
    tags: ["terraform"],
  }),
  make({
    id: "marshmello-70m",
    title: "How much I made with 70M views",
    channelId: "marshmello",
    thumbnail: thumb(5),
    tags: ["creator", "money"],
  }),
  make({
    id: "gaga-deno",
    title: "Deno just got 2M npm packages",
    channelId: "lady-gaga",
    thumbnail: thumb(10),
    tags: ["deno", "npm"],
  }),
];

export const videoMap = Object.fromEntries(videos.map((v) => [v.id, v]));

// Order of the "Up next" list on the watch page for the demo video.
export const HOME_VIDEO_IDS = videos.slice(0, 14).map((v) => v.id);
