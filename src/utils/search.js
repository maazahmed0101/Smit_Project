import { videos } from "../data/videos.js";

// Case-insensitive, partial match on title, channel name, tags and description.
// Every word of the query must match somewhere. Empty query returns everything.
export function searchVideos(query, getChannel) {
  const words = String(query || "").toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return videos;
  return videos.filter((v) => {
    const hay = [v.title, getChannel(v.channelId)?.name || "", v.description || "", ...(v.tags || [])].join(" ").toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}
