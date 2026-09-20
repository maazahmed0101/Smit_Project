import { useState } from "react";
import Button from "../components/Button/Button.jsx";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLibrary } from "../context/LibraryContext.jsx";

export default function Settings() {
  useDocumentTitle("Settings");
  const { user, logout } = useAuth();
  const { clearHistory, resetAll, history } = useLibrary();
  const [msg, setMsg] = useState("");

  const row = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "16px 0", borderBottom: "1px solid var(--border)", flexWrap: "wrap" };
  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <div className="page__head">
        <h1 className="page__title">Settings</h1>
      </div>
      <div style={{ padding: "0 16px" }}>
        <div style={row}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Account</h2>
            <p className="page__sub">{user ? `Logged in as ${user.name} (${user.handle})` : "You are not logged in."}</p>
          </div>
          {user && (
            <Button variant="secondary" icon="log-out" onClick={() => { logout(); setMsg("Logged out."); }}>
              Log out
            </Button>
          )}
        </div>
        <div style={row}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Watch history</h2>
            <p className="page__sub">{history.length} videos in history.</p>
          </div>
          <Button variant="secondary" icon="trash" onClick={() => { clearHistory(); setMsg("History cleared."); }} disabled={history.length === 0}>
            Clear history
          </Button>
        </div>
        <div style={row}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Reset all local data</h2>
            <p className="page__sub">Removes likes, follows, playlists, comments and announcements from this browser.</p>
          </div>
          <Button variant="secondary" icon="trash" onClick={() => { resetAll(); setMsg("All local data was reset."); }}>
            Reset
          </Button>
        </div>
        <p role="status" style={{ marginTop: 16, color: "var(--primary)", fontSize: 14 }}>{msg}</p>
      </div>
    </div>
  );
}
