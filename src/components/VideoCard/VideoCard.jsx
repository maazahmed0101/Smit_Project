import { Link } from "react-router-dom";
import Avatar from "../Avatar/Avatar.jsx";
import Icon from "../Icon/Icon.jsx";
import useCatalog from "../../hooks/useCatalog.js";
import { formatHoursAgo, formatViews } from "../../utils/format.js";
import "./VideoCard.css";

// One reusable card, four layouts:
//   "grid"    - home feed: thumbnail, avatar + title, meta          (vertical)
//   "channel" - channel Videos tab: thumbnail, title, dim meta      (vertical, no avatar)
//   "row"     - search / history / playlists: thumbnail left, text right
//   "compact" - watch page "up next": bordered, small thumbnail left
// `action` adds a small icon button on the card, e.g. remove from history.
export default function VideoCard({ video, variant = "grid", description = true, action }) {
  const { getChannel } = useCatalog();
  const channel = getChannel(video.channelId);
  const channelName = channel?.name || "Unknown channel";
  const watchTo = `/watch/${video.id}`;
  const channelTo = channel ? `/channel/${channel.id}` : null;
  const meta = (
    <p className="vcard__meta">
      <span>{formatViews(video.views)}</span>
      <span aria-hidden="true" className="vcard__dot">
        •
      </span>
      <span>{formatHoursAgo(video.hoursAgo)}</span>
    </p>
  );

  const thumb = (
    <Link to={watchTo} className="vcard__thumb" aria-label={`Watch ${video.title}`} tabIndex={-1}>
      <img src={video.thumbnail} alt="" loading="lazy" onError={(e) => (e.currentTarget.style.opacity = 0)} />
      <span className="vcard__duration">{video.duration}</span>
    </Link>
  );

  const actionBtn = action && (
    <button type="button" className="vcard__action" aria-label={action.label} title={action.label} onClick={action.onClick}>
      <Icon name={action.icon || "x"} size={18} />
    </button>
  );

  if (variant === "grid") {
    return (
      <article className="vcard vcard--grid">
        {thumb}
        <div className="vcard__head">
          {channelTo ? (
            <Link to={channelTo} aria-label={`${channelName} channel`}>
              <Avatar src={channel.avatar} name={channelName} size={40} />
            </Link>
          ) : (
            <Avatar src="" name={channelName} size={40} />
          )}
          <h3 className="vcard__title line-clamp-2">
            <Link to={watchTo}>{video.title}</Link>
          </h3>
          {actionBtn}
        </div>
        <div className="vcard__details">
          {meta}
          {channelTo ? <Link to={channelTo} className="vcard__channel">{channelName}</Link> : <span className="vcard__channel">{channelName}</span>}
        </div>
      </article>
    );
  }

  if (variant === "channel") {
    return (
      <article className="vcard vcard--channel">
        {thumb}
        <h3 className="vcard__title vcard__title--small line-clamp-2">
          <Link to={watchTo}>{video.title}</Link>
        </h3>
        {meta}
        {actionBtn}
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="vcard vcard--compact">
        {thumb}
        <div className="vcard__body">
          <h3 className="vcard__title line-clamp-2">
            <Link to={watchTo}>{video.title}</Link>
          </h3>
          <div className="vcard__bottom">
            {channelTo ? <Link to={channelTo} className="vcard__channel">{channelName}</Link> : <span className="vcard__channel">{channelName}</span>}
            {meta}
          </div>
        </div>
      </article>
    );
  }

  // row
  return (
    <article className="vcard vcard--row">
      {thumb}
      <div className="vcard__body">
        <h3 className="vcard__title vcard__title--large line-clamp-2">
          <Link to={watchTo}>{video.title}</Link>
        </h3>
        {meta}
        <div className="vcard__by">
          {channelTo ? (
            <Link to={channelTo} className="vcard__by-link">
              <Avatar src={channel.avatar} name={channelName} size={24} />
              <span>{channelName}</span>
            </Link>
          ) : (
            <span className="vcard__by-link">{channelName}</span>
          )}
        </div>
        {description && video.description && <p className="vcard__desc line-clamp-2">{video.description}</p>}
      </div>
      {actionBtn}
    </article>
  );
}
