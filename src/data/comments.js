import { asset } from "../utils/asset.js";
// Seed comments shown under every video (user comments are stored separately in localStorage).
export const seedComments = [
  {
    id: "seed-1",
    authorName: "Phoenix Baker",
    handle: "@phoenix",
    avatar: asset("avatars/avatar-05.svg"),
    text: "Looks good!",
    minutesAgo: 0,
    online: false,
  },
  {
    id: "seed-2",
    authorName: "Lana Steiner",
    handle: "@lana",
    avatar: asset("avatars/avatar-06.svg"),
    text: "Great explanation, waiting for the next part.",
    minutesAgo: 2,
    online: true,
  },
  {
    id: "seed-3",
    authorName: "Demi Wilkinson",
    handle: "@demi",
    avatar: asset("avatars/avatar-07.svg"),
    text: "This helped me a lot, thank you!",
    minutesAgo: 35,
    online: false,
  },
  {
    id: "seed-4",
    authorName: "Candice Wu",
    handle: "@candice",
    avatar: asset("avatars/avatar-08.svg"),
    text: "Can you also make a video about state management?",
    minutesAgo: 180,
    online: false,
  },
];
