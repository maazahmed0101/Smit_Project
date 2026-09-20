import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import VideoCard from "../components/VideoCard/VideoCard.jsx";
import EmptyState from "../components/EmptyState/EmptyState.jsx";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import useCatalog from "../hooks/useCatalog.js";
import { searchVideos } from "../utils/search.js";
import "./Search.css";

export default function Search() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const { getChannel } = useCatalog();
  useDocumentTitle(q ? `Search: ${q}` : "Search");

  const results = useMemo(() => searchVideos(q, getChannel), [q, getChannel]);

  return (
    <div className="page search">
      <h1 className="sr-only">{q ? `Search results for ${q}` : "All videos"}</h1>
      {results.length === 0 ? (
        <EmptyState fill title="No videos available">
          There are no videos here available. Please try to search some thing else.
        </EmptyState>
      ) : (
        <>
          <p className="search__count" aria-live="polite">
            {results.length} {results.length === 1 ? "result" : "results"}
            {q && (
              <>
                {" "}for <b>&ldquo;{q}&rdquo;</b>
              </>
            )}
          </p>
          <ul className="search__list">
            {results.map((video) => (
              <li key={video.id}>
                <VideoCard video={video} variant="row" />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
