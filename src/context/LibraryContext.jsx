import { createContext, useCallback, useContext, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage.js";
import { isArrayOf, isPlainObject, isString } from "../utils/storage.js";
import { makeId } from "../utils/format.js";

// Everything the viewer does (likes, follows, history, playlists, comments,
// announcements) lives here and is persisted in localStorage under "play:*".
// Data is per browser, not per account (there is no backend).
const LibraryContext = createContext(null);

export const WATCH_LATER_ID = "watch-later";
const HISTORY_LIMIT = 100;

const defaultPlaylists = () => [
  { id: WATCH_LATER_ID, title: "Watch later", description: "Videos you saved to watch later.", videoIds: [], createdAt: 0, isDefault: true },
];

const strings = isArrayOf(isString);
const isHistory = isArrayOf((h) => isPlainObject(h) && isString(h.videoId) && typeof h.watchedAt === "number");
const isPlaylists = (v) =>
  Array.isArray(v) &&
  v.every((p) => isPlainObject(p) && isString(p.id) && isString(p.title) && strings(p.videoIds)) &&
  v.some((p) => p.id === WATCH_LATER_ID);
const isRecordOfArrays = (v) => isPlainObject(v) && Object.values(v).every(Array.isArray);
const isRecord = isPlainObject;

export function LibraryProvider({ children }) {
  const [liked, setLiked] = useLocalStorage("liked", [], strings);
  const [disliked, setDisliked] = useLocalStorage("disliked", [], strings);
  const [subs, setSubs] = useLocalStorage("subscriptions", [], strings);
  const [history, setHistory] = useLocalStorage("history", [], isHistory);
  const [playlists, setPlaylists] = useLocalStorage("playlists", defaultPlaylists(), isPlaylists);
  const [comments, setComments] = useLocalStorage("comments", {}, isRecordOfArrays);
  const [tweets, setTweets] = useLocalStorage("tweets", {}, isRecordOfArrays);
  const [tweetReactions, setTweetReactions] = useLocalStorage("tweetReactions", {}, isRecord);

  const toggleIn = (list, id) => (list.includes(id) ? list.filter((x) => x !== id) : [id, ...list]);

  const toggleLike = useCallback(
    (videoId) => {
      setLiked((l) => toggleIn(l, videoId));
      setDisliked((d) => d.filter((x) => x !== videoId));
    },
    [setLiked, setDisliked],
  );

  const toggleDislike = useCallback(
    (videoId) => {
      setDisliked((d) => toggleIn(d, videoId));
      setLiked((l) => l.filter((x) => x !== videoId));
    },
    [setLiked, setDisliked],
  );

  const toggleSubscription = useCallback((channelId) => setSubs((s) => toggleIn(s, channelId)), [setSubs]);

  const addToHistory = useCallback(
    (videoId) => {
      setHistory((h) => {
        if (h[0]?.videoId === videoId) return h;
        const next = [{ videoId, watchedAt: Date.now() }, ...h.filter((x) => x.videoId !== videoId)];
        return next.slice(0, HISTORY_LIMIT);
      });
    },
    [setHistory],
  );

  const removeFromHistory = useCallback((videoId) => setHistory((h) => h.filter((x) => x.videoId !== videoId)), [setHistory]);
  const clearHistory = useCallback(() => setHistory([]), [setHistory]);

  const createPlaylist = useCallback(
    (title, videoId) => {
      const clean = String(title || "").trim().slice(0, 60);
      if (!clean) return null;
      const id = makeId("pl");
      setPlaylists((p) => [
        ...p,
        { id, title: clean, description: "", videoIds: videoId ? [videoId] : [], createdAt: Date.now(), isDefault: false },
      ]);
      return id;
    },
    [setPlaylists],
  );

  const deletePlaylist = useCallback(
    (id) => setPlaylists((p) => p.filter((pl) => pl.id !== id || pl.isDefault)),
    [setPlaylists],
  );

  const toggleInPlaylist = useCallback(
    (playlistId, videoId) => {
      setPlaylists((all) =>
        all.map((pl) =>
          pl.id !== playlistId
            ? pl
            : { ...pl, videoIds: pl.videoIds.includes(videoId) ? pl.videoIds.filter((v) => v !== videoId) : [videoId, ...pl.videoIds] },
        ),
      );
    },
    [setPlaylists],
  );

  const removeFromPlaylist = useCallback(
    (playlistId, videoId) =>
      setPlaylists((all) => all.map((pl) => (pl.id === playlistId ? { ...pl, videoIds: pl.videoIds.filter((v) => v !== videoId) } : pl))),
    [setPlaylists],
  );

  const addComment = useCallback(
    (videoId, text, user) => {
      const clean = String(text || "").trim().slice(0, 1000);
      if (!clean || !user) return false;
      const comment = {
        id: makeId("c"),
        authorName: user.name,
        handle: user.handle,
        avatar: user.avatar,
        text: clean,
        createdAt: Date.now(),
        online: true,
        authorId: user.id,
      };
      setComments((all) => ({ ...all, [videoId]: [comment, ...(all[videoId] || [])] }));
      return true;
    },
    [setComments],
  );

  const deleteComment = useCallback(
    (videoId, commentId) =>
      setComments((all) => ({ ...all, [videoId]: (all[videoId] || []).filter((c) => c.id !== commentId) })),
    [setComments],
  );

  const addTweet = useCallback(
    (channelId, text, user) => {
      const clean = String(text || "").trim().slice(0, 500);
      if (!clean || !user) return false;
      const tweet = {
        id: makeId("tw"),
        authorName: user.name,
        avatar: user.avatar,
        text: clean,
        createdAt: Date.now(),
        likes: 0,
        dislikes: 0,
        views: 0,
        online: true,
      };
      setTweets((all) => ({ ...all, [channelId]: [tweet, ...(all[channelId] || [])] }));
      return true;
    },
    [setTweets],
  );

  const toggleTweetReaction = useCallback(
    (tweetId, type) =>
      setTweetReactions((r) => {
        const next = { ...r };
        if (next[tweetId] === type) delete next[tweetId];
        else next[tweetId] = type;
        return next;
      }),
    [setTweetReactions],
  );

  const resetAll = useCallback(() => {
    setLiked([]);
    setDisliked([]);
    setSubs([]);
    setHistory([]);
    setPlaylists(defaultPlaylists());
    setComments({});
    setTweets({});
    setTweetReactions({});
  }, [setLiked, setDisliked, setSubs, setHistory, setPlaylists, setComments, setTweets, setTweetReactions]);

  const value = useMemo(
    () => ({
      liked,
      disliked,
      subs,
      history,
      playlists,
      comments,
      tweets,
      tweetReactions,
      isLiked: (id) => liked.includes(id),
      isDisliked: (id) => disliked.includes(id),
      isSubscribed: (id) => subs.includes(id),
      toggleLike,
      toggleDislike,
      toggleSubscription,
      addToHistory,
      removeFromHistory,
      clearHistory,
      createPlaylist,
      deletePlaylist,
      toggleInPlaylist,
      removeFromPlaylist,
      addComment,
      deleteComment,
      addTweet,
      toggleTweetReaction,
      resetAll,
    }),
    [
      liked, disliked, subs, history, playlists, comments, tweets, tweetReactions,
      toggleLike, toggleDislike, toggleSubscription, addToHistory, removeFromHistory, clearHistory,
      createPlaylist, deletePlaylist, toggleInPlaylist, removeFromPlaylist, addComment, deleteComment,
      addTweet, toggleTweetReaction, resetAll,
    ],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used inside <LibraryProvider>");
  return ctx;
}
