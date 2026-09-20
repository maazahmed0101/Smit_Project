import { useState } from "react";
import Modal from "../Modal/Modal.jsx";
import Button from "../Button/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

// Edit the logged-in user's channel name, handle and about text.
export default function EditProfileModal({ onClose }) {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [handle, setHandle] = useState(user?.handle || "");
  const [description, setDescription] = useState(user?.description || "");
  const [error, setError] = useState("");

  const save = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Channel name can't be empty.");
      return;
    }
    const cleanHandle = `@${handle.replace(/^@+/, "").replace(/[^a-zA-Z0-9_.-]/g, "") || name.replace(/[^a-zA-Z0-9]/g, "")}`;
    updateProfile({ name: name.trim(), handle: cleanHandle, description: description.trim() });
    onClose();
  };

  return (
    <Modal title="Edit channel" onClose={onClose}>
      <form onSubmit={save} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="field">
          <label htmlFor="edit-name">Channel name</label>
          <input id="edit-name" className="input" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} data-autofocus />
        </div>
        <div className="field">
          <label htmlFor="edit-handle">Handle</label>
          <input id="edit-handle" className="input" value={handle} maxLength={30} onChange={(e) => setHandle(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="edit-about">About</label>
          <textarea id="edit-about" className="input" rows={3} maxLength={200} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        {error && (
          <p role="alert" style={{ color: "var(--danger)", fontSize: 14 }}>
            {error}
          </p>
        )}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" shadow style={{ marginRight: 5 }}>
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
