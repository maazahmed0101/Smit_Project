import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer.jsx";
import VideoCard from "../components/VideoCard/VideoCard.jsx";
import CommentSection from "../components/CommentSection/CommentSection.jsx";
import SaveModal from "../components/SaveModal/SaveModal.jsx";
import Avatar from "../components/Avatar/Avatar.jsx";
import Button from "../components/Button/Button.jsx";
import Icon from "../components/Icon/Icon.jsx";
import Menu from "../components/Menu/Menu.jsx";
import EmptyState from "../components/EmptyState/EmptyState.jsx";
import { Link } from "react-router-dom";
import useCatalog from "../hooks/useCatalog.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLibrary, WATCH_LATER_ID } from "../context/LibraryContext.jsx";
import { videos } from "../data/videos.js";
import { formatCount, formatFullNumber, formatHoursAgo } from "../utils/format.js";
import "./Watch.css";

export default function Watch() {
  const { videoId } = useParams();
  const { getVideo, getChannel } = useCatalog();
  const video = getVideo(videoId);
  useDocumentTitle(video ? video.title : "Video not found");

  if (!video) {
    return (
      <EmptyState asH1 fill icon="video" title="Video not found" action={{ label: "Back to home", to: "/" }}>
        This video doesn&rsquo;t exist or was removed. Check the link and try again.
      </EmptyState>
    );
  }
  return <WatchContent key={video.id} video={video} channel={getChannel(video.channelId)} />;
}

function WatchContent({ video, channel }) {
  const { user, requireAuth } = useAuth();
  const lib = useLibrary();
  const { addToHistory } = lib;
  const [expanded, setExpanded] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [notice, setNotice] = useState("");

  // opening a video puts it at the top of the history
  useEffect(() => {
    addToHistory(video.id);
  }, [video.id, addToHistory]);

  useEffect(() => {
    if (!notice) return undefined;
    const t = setTimeout(() => setNotice(""), 2500);
    return () => clearTimeout(t);
  }, [notice]);

  const liked = lib.isLiked(video.id);
  const disliked = lib.isDisliked(video.id);
  const following = channel ? lib.isSubscribed(channel.id) : false;
  const isOwnChannel = !!(user && channel && user.channelId === channel.id);
  const inWatchLater = lib.playlists.find((p) => p.id === WATCH_LATER_ID)?.videoIds.includes(video.id);
  const upNext = videos.filter((v) => v.id !== video.id).slice(0, 12);
  const followers = (channel?.subscribers || 0) + (following ? 1 : 0);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setNotice("Link copied to clipboard");
    } catch {
      setNotice("Couldn't copy the link");
    }
  };

  const menuItems = [
    {
      key: "watch-later",
      label: inWatchLater ? "Remove from Watch later" : "Add to Watch later",
      icon: "history",
      onClick: () =>
        requireAuth(() => {
          lib.toggleInPlaylist(WATCH_LATER_ID, video.id);
          setNotice(inWatchLater ? "Removed from Watch later" : "Added to Watch later");
        }, "Log in to use Watch later."),
    },
    { key: "copy", label: "Copy link", icon: "folder", onClick: copyLink },
  ];

  return (
    <div className="watch">
      <div className="watch__main">
        <VideoPlayer video={video} />

        <section className="watch__info" aria-label="Video details">
          <div className="watch__top">
            <div className="watch__titlebox">
              <h1 className="watch__title">{video.title}</h1>
              <p className="watch__meta">
                {formatFullNumber(video.views)} Views <span aria-hidden="true">•</span> {formatHoursAgo(video.hoursAgo)}
              </p>
            </div>

            <div className="watch__actions">
              <div className="watch__votes" role="group" aria-label="Rate this video">
                <button
                  type="button"
                  className={`watch__vote ${liked ? "is-on" : ""}`}
                  aria-pressed={liked}
                  aria-label={`Like (${video.likes + (liked ? 1 : 0)})`}
                  onClick={() => requireAuth(() => lib.toggleLike(video.id), "Log in to like videos.")}
                >
                  <Icon name="thumbs-up" size={20} filled={liked} />
                  <span>{formatCount(video.likes + (liked ? 1 : 0))}</span>
                </button>
                <button
                  type="button"
                  className={`watch__vote watch__vote--down ${disliked ? "is-on" : ""}`}
                  aria-pressed={disliked}
                  aria-label={`Dislike (${video.dislikes + (disliked ? 1 : 0)})`}
                  onClick={() => requireAuth(() => lib.toggleDislike(video.id), "Log in to rate videos.")}
                >
                  <Icon name="thumbs-down" size={20} filled={disliked} />
                  <span>{formatCount(video.dislikes + (disliked ? 1 : 0))}</span>
                </button>
              </div>
              <Button
                variant="light"
                icon="folder-plus"
                onClick={() => requireAuth(() => setSaveOpen(true), "Log in to save videos to playlists.")}
              >
                Save
              </Button>
              <Menu label="More actions" items={menuItems} />
            </div>
          </div>

          <p className="watch__notice" role="status" aria-live="polite">
            {notice}
          </p>

          {channel && (
            <div className="watch__channel">
              <Link to={`/channel/${channel.id}`} className="watch__channel-link">
                <Avatar src={channel.avatar} name={channel.name} size={32} />
                <span className="watch__channel-text">
                  <span className="watch__channel-name">{channel.name}</span>
                  <span className="watch__channel-subs">{formatCount(followers)} Followers</span>
                </span>
              </Link>
              {!isOwnChannel && (
                <Button
                  variant={following ? "secondary" : "primary"}
                  icon={following ? "user-check" : "user-plus"}
                  aria-pressed={following}
                  onClick={() => requireAuth(() => lib.toggleSubscription(channel.id), "Log in to follow channels.")}
                >
                  {following ? "Following" : "Follow"}
                </Button>
              )}
            </div>
          )}

          <hr className="watch__rule" />

          <div className="watch__desc">
            <p className={`watch__desc-text ${expanded ? "is-open" : ""}`}>{video.description}</p>
            <button
              type="button"
              className="watch__expand"
              aria-expanded={expanded}
              aria-label={expanded ? "Show less" : "Show full description"}
              onClick={() => setExpanded((e) => !e)}
            >
              <Icon name={expanded ? "chevron-up" : "chevron-down"} size={20} />
            </button>
          </div>
        </section>

        <CommentSection videoId={video.id} baseCount={video.commentCount} />
      </div>

      <aside className="watch__side" aria-label="Up next">
        <h2 className="sr-only">Up next</h2>
        <ul className="watch__list">
          {upNext.map((v) => (
            <li key={v.id}>
              <VideoCard video={v} variant="compact" />
            </li>
          ))}
        </ul>
      </aside>

      {saveOpen && <SaveModal videoId={video.id} onClose={() => setSaveOpen(false)} />}
    </div>
  );
}
