import { Link } from "react-router-dom";
import Icon from "../Icon/Icon.jsx";
import "./PlaylistCard.css";

// Card for a playlist: cover (first video's thumbnail if no cover), title, video count.
export default function PlaylistCard({ playlist, cover, subtitle, onDelete }) {
  return (
    <article className="plcard">
      <Link to={`/playlist/${playlist.id}`} className="plcard__cover" aria-label={`Open playlist ${playlist.title}`} tabIndex={-1}>
        {cover ? <img src={cover} alt="" loading="lazy" /> : <span className="plcard__blank" aria-hidden="true"><Icon name="folder" size={40} /></span>}
        <span className="plcard__count">{playlist.videoIds.length} videos</span>
      </Link>
      <div className="plcard__row">
        <div className="plcard__text">
          <h3 className="plcard__title line-clamp-2">
            <Link to={`/playlist/${playlist.id}`}>{playlist.title}</Link>
          </h3>
          {subtitle && <p className="plcard__sub">{subtitle}</p>}
        </div>
        {onDelete && (
          <button type="button" className="plcard__delete" aria-label={`Delete playlist ${playlist.title}`} title="Delete playlist" onClick={onDelete}>
            <Icon name="trash" size={18} />
          </button>
        )}
      </div>
    </article>
  );
}
