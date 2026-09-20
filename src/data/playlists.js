import { asset } from "../utils/asset.js";
// Public (seed) playlists that belong to channels. User-created playlists are
// stored in localStorage and merged in by LibraryContext.
export const seedPlaylists = [
  {
    id: "react-from-zero",
    title: "React from zero to hero",
    description:
      "Everything you need to go from your first component to shipping a real React app. Watch the videos in order.",
    channelId: "yash-mittal",
    videoIds: [
      "learn-react-scratch",
      "how-to-learn-react",
      "socket-io",
      "deno-2m-npm",
      "terraform-freeapi",
      "google-idx",
      "google-pieces-updates",
    ],
    cover: asset("thumbs/thumb-06.svg"),
  },
  {
    id: "engineering-side",
    title: "Engineering side",
    description: "How the tools you use every day actually work under the hood.",
    channelId: "arnau-ros",
    videoIds: ["how-database-works", "how-browser-works", "flutter-dart-pieces", "multi-million-product"],
    cover: asset("thumbs/thumb-10.svg"),
  },
];
