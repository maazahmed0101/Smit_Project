import { useState } from "react";
import Modal from "../Modal/Modal.jsx";
import Button from "../Button/Button.jsx";
import { useLibrary } from "../../context/LibraryContext.jsx";
import "./SaveModal.css";

// "Save" dialog on the watch page: tick playlists to add/remove the video, or create a new one.
export default function SaveModal({ videoId, onClose }) {
  const { playlists, toggleInPlaylist, createPlaylist } = useLibrary();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const create = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Enter a playlist name.");
      return;
    }
    if (playlists.some((p) => p.title.toLowerCase() === name.trim().toLowerCase())) {
      setError("You already have a playlist with that name.");
      return;
    }
    createPlaylist(name, videoId);
    setName("");
    setError("");
  };

  return (
    <Modal title="Save to playlist" onClose={onClose} width={380}>
      <ul className="save__list">
        {playlists.map((pl) => {
          const checked = pl.videoIds.includes(videoId);
          const id = `save-${pl.id}`;
          return (
            <li key={pl.id}>
              <label className="save__row" htmlFor={id}>
                <input id={id} type="checkbox" className="save__check" checked={checked} onChange={() => toggleInPlaylist(pl.id, videoId)} />
                <span className="save__name">{pl.title}</span>
                <span className="save__count">{pl.videoIds.length}</span>
              </label>
            </li>
          );
        })}
      </ul>

      <form className="save__create" onSubmit={create} noValidate>
        <div className="field">
          <label htmlFor="new-playlist">Create new playlist</label>
          <div className="save__create-row">
            <input
              id="new-playlist"
              className="input"
              placeholder="Playlist name"
              value={name}
              maxLength={60}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              aria-invalid={error ? "true" : undefined}
              aria-describedby={error ? "new-playlist-error" : undefined}
            />
            <Button type="submit" icon="plus">
              Create
            </Button>
          </div>
          {error && (
            <p id="new-playlist-error" className="save__error" role="alert">
              {error}
            </p>
          )}
        </div>
      </form>
      <div className="save__done">
        <Button variant="secondary" onClick={onClose}>
          Done
        </Button>
      </div>
    </Modal>
  );
}
