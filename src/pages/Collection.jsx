import { useState } from "react";
import PlaylistCard from "../components/PlaylistCard/PlaylistCard.jsx";
import EmptyState from "../components/EmptyState/EmptyState.jsx";
import Button from "../components/Button/Button.jsx";
import useCatalog from "../hooks/useCatalog.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { useLibrary } from "../context/LibraryContext.jsx";

export default function Collection() {
  useDocumentTitle("Collection");
  const { playlists, createPlaylist, deletePlaylist } = useLibrary();
  const { getVideos } = useCatalog();
  const [name, setName] = useState("");

  const create = (e) => {
    e.preventDefault();
    if (createPlaylist(name)) setName("");
  };

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1 className="page__title">Collection</h1>
          <p className="page__sub">Your playlists and Watch later.</p>
        </div>
        <form onSubmit={create} style={{ display: "flex", gap: 8, flexWrap: "wrap", maxWidth: "100%" }}>
          <label htmlFor="new-pl" className="sr-only">
            New playlist name
          </label>
          <input id="new-pl" className="input" style={{ width: 220, maxWidth: "100%" }} placeholder="New playlist name" value={name} maxLength={60} onChange={(e) => setName(e.target.value)} />
          <Button type="submit" icon="plus" disabled={!name.trim()}>
            Create
          </Button>
        </form>
      </div>
      {playlists.length ? (
        <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px 16px", padding: "0 16px" }}>
          {playlists.map((pl) => {
            const first = getVideos(pl.videoIds)[0];
            return (
              <li key={pl.id}>
                <PlaylistCard playlist={pl} cover={first?.thumbnail} subtitle={pl.isDefault ? "Default playlist" : undefined} onDelete={pl.isDefault ? undefined : () => deletePlaylist(pl.id)} />
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState icon="folder" title="No playlists">Create a playlist to get started.</EmptyState>
      )}
    </div>
  );
}
