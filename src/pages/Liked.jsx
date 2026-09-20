import VideoGrid from "../components/VideoGrid/VideoGrid.jsx";
import EmptyState from "../components/EmptyState/EmptyState.jsx";
import useCatalog from "../hooks/useCatalog.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { useLibrary } from "../context/LibraryContext.jsx";

export default function Liked() {
  useDocumentTitle("Liked videos");
  const { liked, toggleLike } = useLibrary();
  const { getVideos } = useCatalog();
  const vids = getVideos(liked);
  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1 className="page__title">Liked Videos</h1>
          <p className="page__sub">{vids.length} {vids.length === 1 ? "video" : "videos"}</p>
        </div>
      </div>
      {vids.length ? (
        <VideoGrid videos={vids} action={(v) => ({ label: "Remove like", icon: "thumbs-down", onClick: () => toggleLike(v.id) })} />
      ) : (
        <EmptyState icon="thumbs-up" title="No liked videos" action={{ label: "Browse videos", to: "/" }}>
          Videos you like will show up here.
        </EmptyState>
      )}
    </div>
  );
}
