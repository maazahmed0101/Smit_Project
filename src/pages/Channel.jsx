import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import ChannelHeader from "../components/ChannelHeader/ChannelHeader.jsx";
import Tabs from "../components/Tabs/Tabs.jsx";
import VideoGrid from "../components/VideoGrid/VideoGrid.jsx";
import PlaylistCard from "../components/PlaylistCard/PlaylistCard.jsx";
import EmptyState from "../components/EmptyState/EmptyState.jsx";
import EditProfileModal from "../components/EditProfileModal/EditProfileModal.jsx";
import Avatar from "../components/Avatar/Avatar.jsx";
import Button from "../components/Button/Button.jsx";
import Icon from "../components/Icon/Icon.jsx";
import useCatalog from "../hooks/useCatalog.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLibrary } from "../context/LibraryContext.jsx";
import { seedTweets, CHANNELS_WITH_TWEETS } from "../data/tweets.js";
import { formatCount, formatMinutesAgo } from "../utils/format.js";
import "./Channel.css";

const TAB_KEYS = ["videos", "playlist", "tweets", "following"];

// /channel/:channelId/:tab?
export default function ChannelPage() {
  const { channelId, tab } = useParams();
  return <ChannelView channelId={channelId} tab={tab} basePath={`/channel/${channelId}`} />;
}

// Shared by /channel/:id and /my-content (basePath differs).
export function ChannelView({ channelId, tab, basePath }) {
  const { user, requireAuth } = useAuth();
  const lib = useLibrary();
  const { getChannel, getChannelVideos, getChannelPlaylists, getVideos } = useCatalog();
  const [editOpen, setEditOpen] = useState(false);
  const channel = getChannel(channelId);
  useDocumentTitle(channel ? channel.name : "Channel not found");

  if (!channel) {
    return (
      <EmptyState asH1 fill icon="users" title="Channel not found" action={{ label: "Back to home", to: "/" }}>
        This channel doesn&rsquo;t exist. Check the link and try again.
      </EmptyState>
    );
  }
  const active = tab || "videos";
  if (!TAB_KEYS.includes(active)) return <Navigate to={basePath} replace />;

  const isOwn = channel.isOwn;
  const following = lib.isSubscribed(channel.id);
  const subscribers = (channel.subscribers || 0) + (following && !isOwn ? 1 : 0);
  const subscribed = isOwn ? lib.subs.length : channel.subscribedCount ?? channel.following.length;

  const tabs = [
    { to: basePath, label: "Videos", end: true },
    { to: `${basePath}/playlist`, label: "Playlist" },
    { to: `${basePath}/tweets`, label: "Tweets" },
    { to: `${basePath}/following`, label: "Following" },
  ];

  let content = null;
  if (active === "videos") {
    const vids = getChannelVideos(channel.id);
    content = vids.length ? (
      <VideoGrid videos={vids} variant="channel" />
    ) : (
      <EmptyState title="No videos uploaded">{isOwn ? "You haven't uploaded any videos yet." : "This page has yet to upload a video."}</EmptyState>
    );
  } else if (active === "playlist") {
    const seeds = getChannelPlaylists(channel.id);
    const mine = isOwn ? lib.playlists : [];
    const all = [...seeds, ...mine];
    content = all.length ? (
      <ul className="channel__playlists">
        {all.map((pl) => {
          const first = getVideos(pl.videoIds)[0];
          return (
            <li key={pl.id}>
              <PlaylistCard playlist={pl} cover={pl.cover || first?.thumbnail} subtitle={pl.description} />
            </li>
          );
        })}
      </ul>
    ) : (
      <EmptyState title="No playlists">This page has yet to create a playlist.</EmptyState>
    );
  } else if (active === "tweets") {
    content = <Tweets channel={channel} isOwn={isOwn} lib={lib} user={user} requireAuth={requireAuth} />;
  } else {
    const list = (isOwn ? lib.subs : channel.following).map((id) => getChannel(id)).filter(Boolean);
    content = list.length ? (
      <ul className="channel__following">
        {list.map((c) => (
          <li key={c.id} className="follow-row">
            <Link to={`/channel/${c.id}`} className="follow-row__who">
              <Avatar src={c.avatar} name={c.name} size={40} />
              <span>
                <span className="follow-row__name">{c.name}</span>
                <span className="follow-row__handle">{c.handle}</span>
              </span>
            </Link>
            {!(user && user.channelId === c.id) && (
              <Button
                size="sm"
                variant={lib.isSubscribed(c.id) ? "secondary" : "primary"}
                aria-pressed={lib.isSubscribed(c.id)}
                onClick={() => requireAuth(() => lib.toggleSubscription(c.id), "Log in to follow channels.")}
              >
                {lib.isSubscribed(c.id) ? "Following" : "Follow"}
              </Button>
            )}
          </li>
        ))}
      </ul>
    ) : (
      <EmptyState icon="users" title="No people subscribed">
        This page has yet to <b>subscribe</b> a new person.
      </EmptyState>
    );
  }

  return (
    <div className="channel">
      <ChannelHeader
        channel={channel}
        subscribers={subscribers}
        subscribed={subscribed}
        isOwn={isOwn}
        following={following}
        onFollow={() => requireAuth(() => lib.toggleSubscription(channel.id), "Log in to follow channels.")}
        onEdit={() => setEditOpen(true)}
      />
      <div className="channel__body">
        <Tabs tabs={tabs} label="Channel sections" />
        <div className="channel__content">{content}</div>
      </div>
      {editOpen && <EditProfileModal onClose={() => setEditOpen(false)} />}
    </div>
  );
}

function Tweets({ channel, isOwn, lib, user, requireAuth }) {
  const [text, setText] = useState("");
  const mine = lib.tweets[channel.id] || [];
  const seeds = CHANNELS_WITH_TWEETS.includes(channel.id) ? seedTweets : [];
  const all = [...mine, ...seeds];

  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (lib.addTweet(channel.id, text, user)) setText("");
  };

  return (
    <div className="tweets">
      {isOwn && (
        <form className="tweets__composer" onSubmit={send}>
          <label htmlFor="tweet-input" className="sr-only">
            Write an announcement
          </label>
          <textarea
            id="tweet-input"
            className="tweets__input"
            placeholder="Write an announcement"
            rows={2}
            maxLength={500}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button type="submit" size="sm" disabled={!text.trim()}>
            Send
          </Button>
        </form>
      )}
      {all.length === 0 ? (
        <EmptyState title="No tweets">{isOwn ? "Post your first announcement above." : "This page has yet to post an announcement."}</EmptyState>
      ) : (
        <ul className="tweets__list">
          {all.map((t) => {
            const reaction = lib.tweetReactions[t.id];
            const react = (type) => requireAuth(() => lib.toggleTweetReaction(t.id, type), "Log in to react.");
            return (
              <li key={t.id} className="tweet">
                <Avatar src={t.avatar} name={t.authorName} size={40} online={t.online} />
                <div className="tweet__body">
                  <p className="tweet__head">
                    <span className="tweet__name">{t.authorName}</span>
                    <span className="tweet__time">{t.whenLabel || formatMinutesAgo((Date.now() - t.createdAt) / 60000)}</span>
                  </p>
                  <p className="tweet__text">{t.text}</p>
                  <div className="tweet__actions">
                    <button type="button" className={`tweet__btn ${reaction === "like" ? "is-on" : ""}`} aria-pressed={reaction === "like"} aria-label="Like" onClick={() => react("like")}>
                      <Icon name="thumbs-up" size={16} filled={reaction === "like"} />
                      {formatCount(t.likes + (reaction === "like" ? 1 : 0), 2)}
                    </button>
                    <button type="button" className={`tweet__btn ${reaction === "dislike" ? "is-on" : ""}`} aria-pressed={reaction === "dislike"} aria-label="Dislike" onClick={() => react("dislike")}>
                      <Icon name="thumbs-down" size={16} filled={reaction === "dislike"} />
                      {formatCount(t.dislikes + (reaction === "dislike" ? 1 : 0), 2)}
                    </button>
                    {isOwn && (
                      <span className="tweet__views" title="Views">
                        <Icon name="bar-chart" size={16} />
                        {formatCount(t.views, 2)}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
