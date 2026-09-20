import Avatar from "../Avatar/Avatar.jsx";
import Button from "../Button/Button.jsx";
import { formatCount } from "../../utils/format.js";
import "./ChannelHeader.css";

// Banner + avatar + name/handle/stats + Follow (or Edit for the owner).
export default function ChannelHeader({ channel, subscribers, subscribed, isOwn, following, onFollow, onEdit }) {
  return (
    <header className="chead">
      <div className="chead__banner" role="img" aria-label="Channel banner" />
      <div className="chead__row">
        <span className="chead__avatar">
          <Avatar src={channel.avatar} name={channel.name} size={168} />
        </span>
        <div className="chead__info">
          <h1 className="chead__name">{channel.name}</h1>
          <p className="chead__handle">{channel.handle}</p>
          <p className="chead__stats">
            {formatCount(subscribers)} Subscribers <span aria-hidden="true">•</span> {subscribed} Subscribed
          </p>
        </div>
        <div className="chead__action">
          {isOwn ? (
            <Button icon="edit" onClick={onEdit}>
              Edit
            </Button>
          ) : (
            <Button
              variant={following ? "secondary" : "primary"}
              icon={following ? "user-check" : "user-plus"}
              aria-pressed={following}
              onClick={onFollow}
            >
              {following ? "Following" : "Follow"}
            </Button>
          )}
        </div>
      </div>
      {channel.description && <p className="chead__about">{channel.description}</p>}
    </header>
  );
}
