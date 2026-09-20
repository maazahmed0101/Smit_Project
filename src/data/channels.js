// Local mock channel data (no backend). Avatars live in public/avatars.
// `following` lists the channels a channel itself follows (Following tab).
import { asset } from "../utils/asset.js";

const avatar = (n) => asset(`avatars/avatar-${String(n).padStart(2, "0")}.svg`);

export const DEMO_CHANNEL_ID = "yash-mittal";

export const channels = [
  {
    id: "yash-mittal",
    name: "Yash Mittal",
    handle: "@YashMittal",
    avatar: avatar(1),
    subscribers: 600000,
    subscribedCount: 220,
    description: "Developer, teacher and open-source fan. React, JavaScript and engineering deep-dives.",
    following: [],
  },
  {
    id: "arnau-ros",
    name: "Arnau Ros",
    handle: "@ArnauRos",
    avatar: avatar(2),
    subscribers: 412000,
    description: "Building products for developers and sharing what I learn along the way.",
    following: ["yash-mittal", "david-lee", "lex-fridman"],
  },
  {
    id: "david-lee",
    name: "David Lee",
    handle: "@DavidLee",
    avatar: avatar(3),
    subscribers: 188000,
    description: "Hardware, developer tools and interview preparation.",
    following: ["yash-mittal", "arnau-ros"],
  },
  {
    id: "lex-fridman",
    name: "Lex Fridman",
    handle: "@LexFridman",
    avatar: avatar(4),
    subscribers: 705000,
    description: "Conversations about science, technology, history, philosophy and games.",
    following: ["david-lee"],
  },
  {
    id: "maluma",
    name: "Maluma",
    handle: "@Maluma",
    avatar: avatar(5),
    subscribers: 921000,
    description: "Music, behind the scenes and live sessions.",
    following: [],
  },
  {
    id: "jonas-brothers",
    name: "Jonas Brothers",
    handle: "@JonasBrothers",
    avatar: avatar(6),
    subscribers: 1200000,
    description: "Official channel of the Jonas Brothers.",
    following: ["maluma"],
  },
  {
    id: "billie-eilish",
    name: "Billie Eilish",
    handle: "@BillieEilish",
    avatar: avatar(7),
    subscribers: 2300000,
    description: "Music videos, live shows and studio diaries.",
    following: [],
  },
  {
    id: "lil-nas-x",
    name: "Lil Nas X",
    handle: "@LilNasX",
    avatar: avatar(8),
    subscribers: 1750000,
    description: "New releases and the stories behind them.",
    following: ["billie-eilish"],
  },
  {
    id: "anuel-aa",
    name: "Anuel AA",
    handle: "@AnuelAA",
    avatar: avatar(9),
    subscribers: 640000,
    description: "Latin trap, collaborations and tour clips.",
    following: [],
  },
  {
    id: "marshmello",
    name: "Marshmello",
    handle: "@Marshmello",
    avatar: avatar(10),
    subscribers: 3100000,
    description: "Electronic music, live sets and cooking with Marshmello.",
    following: ["jonas-brothers"],
  },
  {
    id: "lady-gaga",
    name: "Lady Gaga",
    handle: "@LadyGaga",
    avatar: avatar(11),
    subscribers: 2800000,
    description: "Music, fashion and performances.",
    following: [],
  },
];

export const channelMap = Object.fromEntries(channels.map((c) => [c.id, c]));
export const USER_AVATARS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(avatar);
