import { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../components/Avatar/Avatar.jsx";
import Button from "../components/Button/Button.jsx";
import EmptyState from "../components/EmptyState/EmptyState.jsx";
import Icon from "../components/Icon/Icon.jsx";
import useCatalog from "../hooks/useCatalog.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { useLibrary } from "../context/LibraryContext.jsx";
import { formatCount } from "../utils/format.js";

// Channels the viewer follows, with a filter box.
export default function Subscribers() {
  useDocumentTitle("Subscribers");
  const { subs, toggleSubscription } = useLibrary();
  const { getChannel } = useCatalog();
  const [filter, setFilter] = useState("");
  const list = subs
    .map((id) => getChannel(id))
    .filter(Boolean)
    .filter((c) => `${c.name} ${c.handle}`.toLowerCase().includes(filter.trim().toLowerCase()));

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1 className="page__title">Subscribers</h1>
          <p className="page__sub">Channels you follow.</p>
        </div>
      </div>
      {subs.length === 0 ? (
        <EmptyState icon="users" title="No people subscribed" action={{ label: "Browse videos", to: "/" }}>
          You haven&rsquo;t <b>subscribed</b> to anyone yet.
        </EmptyState>
      ) : (
        <div style={{ padding: "0 16px" }}>
          <label htmlFor="sub-filter" className="sr-only">
            Filter channels
          </label>
          <div style={{ position: "relative", marginBottom: 24 }}>
            <Icon name="search" size={20} style={{ position: "absolute", left: 14, top: 12 }} />
            <input id="sub-filter" className="input" style={{ paddingLeft: 42 }} placeholder="Search" value={filter} onChange={(e) => setFilter(e.target.value)} />
          </div>
          {list.length === 0 ? (
            <p className="page__sub">No channels match &ldquo;{filter}&rdquo;.</p>
          ) : (
            <ul style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {list.map((c) => (
                <li key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                  <Link to={`/channel/${c.id}`} style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
                    <Avatar src={c.avatar} name={c.name} size={40} />
                    <span>
                      <span style={{ display: "block", fontWeight: 600, fontSize: 14 }}>{c.name}</span>
                      <span style={{ display: "block", fontSize: 12, color: "var(--text-muted)" }}>
                        {c.handle} • {formatCount(c.subscribers)} subscribers
                      </span>
                    </span>
                  </Link>
                  <Button size="sm" variant="secondary" onClick={() => toggleSubscription(c.id)}>
                    Following
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
