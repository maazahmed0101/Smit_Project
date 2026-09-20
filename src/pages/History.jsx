import VideoCard from "../components/VideoCard/VideoCard.jsx";
import EmptyState from "../components/EmptyState/EmptyState.jsx";
import Button from "../components/Button/Button.jsx";
import useCatalog from "../hooks/useCatalog.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { useLibrary } from "../context/LibraryContext.jsx";

export default function History() {
  useDocumentTitle("History");
  const { history, removeFromHistory, clearHistory } = useLibrary();
  const { getVideo } = useCatalog();
  const items = history.map((h) => getVideo(h.videoId)).filter(Boolean);
  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1 className="page__title">History</h1>
          <p className="page__sub">Videos you watched, latest first.</p>
        </div>
        {items.length > 0 && (
          <Button variant="secondary" icon="trash" onClick={clearHistory}>
            Clear history
          </Button>
        )}
      </div>
      {items.length ? (
        <ul style={{ display: "flex", flexDirection: "column", gap: 16, padding: "0 16px" }}>
          {items.map((v) => (
            <li key={v.id}>
              <VideoCard video={v} variant="row" description={false} action={{ label: "Remove from history", icon: "x", onClick: () => removeFromHistory(v.id) }} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState icon="history" title="No watch history" action={{ label: "Browse videos", to: "/" }}>
          Videos you watch will show up here.
        </EmptyState>
      )}
    </div>
  );
}
