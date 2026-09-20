import { asset } from "../utils/asset.js";
// Seed announcements ("Tweets" tab). Counts are numbers; formatted in the UI.
const t = (id, authorName, avatar, text, whenLabel, likes, dislikes, views, online = false) => ({
  id,
  authorName,
  avatar,
  text,
  whenLabel,
  likes,
  dislikes,
  views,
  online,
});

export const seedTweets = [
  t("tw-1", "Jacob Smith", asset("avatars/avatar-03.svg"), "Great video, waiting for more awesome videos like these.", "Just now", 18230, 82480, 79190),
  t("tw-2", "Jacob Smith", asset("avatars/avatar-03.svg"), "This course will help lot of people like me to understand react from its core", "Today 07:18", 53530, 12410, 14020),
  t("tw-3", "Jacob Smith", asset("avatars/avatar-03.svg"), "Greatly appreciated your detailed explanation sir", "Yesterday", 36670, 17780, 82120, true),
  t("tw-4", "Jacob Smith", asset("avatars/avatar-03.svg"), "Sir this series will be till advanced with projects right??", "Yesterday", 20310, 26580, 12330),
  t("tw-5", "Jacob Smith", asset("avatars/avatar-03.svg"), "can you also say about the difference between npx and npm", "04 Nov 2020", 9120, 1210, 4020),
];

// Which channels show the seed tweets. Others start empty (owner can post).
export const CHANNELS_WITH_TWEETS = ["yash-mittal", "arnau-ros", "david-lee", "lex-fridman"];
