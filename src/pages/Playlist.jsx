import { Link, useParams } from "react-router-dom";
import VideoCard from "../components/VideoCard/VideoCard.jsx";
import EmptyState from "../components/EmptyState/EmptyState.jsx";
import Avatar from "../components/Avatar/Avatar.jsx";
import useCatalog from "../hooks/useCatalog.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { useLibrary } from "../context/LibraryContext.jsx";
import "./Playlist.css";

export default function Playlist() {
  const { playlistId } = useParams();
  const { getPlaylist, getVideos, getChannel } = useCatalog();
  const { removeFromPlaylist } = useLibrary();
  const playlist = getPlaylist(playlistId);
  useDocumentTitle(playlist ? playlist.title : "Playlist not found");

  if (!playlist) {
    return (
      <EmptyState asH1 fill icon="folder" title="Playlist not found" action={{ label: "Go to Collection", to: "/collection" }}>
        This playlist doesn&rsquo;t exist or was deleted.
      </EmptyState>
    );
  }
  const vids = getVideos(playlist.videoIds);
  const channel = playlist.channelId ? getChannel(playlist.channelId) : null;
  const cover = playlist.cover || vids[0]?.thumbnail;

  return (
    <div className="plpage">
      <aside className="plpage__card">
        <div className="plpage__cover">{cover && <img src={cover} alt="" />}</div>
        <h1 className="plpage__title">{playlist.title}</h1>
        {playlist.description && <p className="plpage__desc">{playlist.description}</p>}
        <p className="plpage__count">{vids.length} {vids.length === 1 ? "video" : "videos"}</p>
        {channel && (
          <Link to={`/channel/${channel.id}`} className="plpage__by">
            <Avatar src={channel.avatar} name={channel.name} size={40} />
            <span>{channel.name}</span>
          </Link>
        )}
      </aside>
      <div className="plpage__rows">
        {vids.length ? (
          <ul>
            {vids.map((v) => (
              <li key={v.id}>
                <VideoCard
                  video={v}
                  variant="row"
                  description={false}
                  action={playlist.isSeed ? undefined : { label: "Remove from playlist", icon: "x", onClick: () => removeFromPlaylist(playlist.id, v.id) }}
                />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No videos in this playlist">Use the Save button on a video to add it here.</EmptyState>
        )}
      </div>
    </div>
  );
}
