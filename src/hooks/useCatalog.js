import { useCallback } from "react";
import { channelMap } from "../data/channels.js";
import { videoMap, videos } from "../data/videos.js";
import { seedPlaylists } from "../data/playlists.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLibrary } from "../context/LibraryContext.jsx";

// Read access to the (static) catalogue with the current user's own channel
// merged in. Nothing here mutates state.
export default function useCatalog() {
  const { user } = useAuth();
  const { playlists } = useLibrary();

  const getChannel = useCallback(
    (id) => {
      const base = channelMap[id];
      if (user && user.channelId === id) {
        return {
          id,
          subscribers: 0,
          following: [],
          ...base,
          name: user.name,
          handle: user.handle,
          avatar: user.avatar,
          description: user.description ?? base?.description ?? "",
          isOwn: true,
        };
      }
      return base ? { ...base, isOwn: false } : null;
    },
    [user],
  );

  const getVideo = useCallback((id) => videoMap[id] || null, []);

  const getVideos = useCallback((ids) => ids.map((id) => videoMap[id]).filter(Boolean), []);

  const getChannelVideos = useCallback((channelId) => videos.filter((v) => v.channelId === channelId), []);

  const getPlaylist = useCallback(
    (id) => {
      const seed = seedPlaylists.find((p) => p.id === id);
      if (seed) return { ...seed, isSeed: true };
      const mine = playlists.find((p) => p.id === id);
      if (mine) return { ...mine, channelId: user?.channelId || null, cover: null, isSeed: false };
      return null;
    },
    [playlists, user],
  );

  const getChannelPlaylists = useCallback((channelId) => seedPlaylists.filter((p) => p.channelId === channelId), []);

  return { user, getChannel, getVideo, getVideos, getChannelVideos, getPlaylist, getChannelPlaylists };
}
