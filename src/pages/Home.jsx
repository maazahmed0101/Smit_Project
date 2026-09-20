import VideoGrid from "../components/VideoGrid/VideoGrid.jsx";
import EmptyState from "../components/EmptyState/EmptyState.jsx";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { videos } from "../data/videos.js";

export default function Home() {
  useDocumentTitle("Home");
  return (
    <div className="page">
      <h1 className="sr-only">Recommended videos</h1>
      {videos.length ? (
        <VideoGrid videos={videos} />
      ) : (
        <EmptyState fill title="No videos available">
          There are no videos here available. Please try to search some thing else.
        </EmptyState>
      )}
    </div>
  );
}
