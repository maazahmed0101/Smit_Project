import VideoCard from "../VideoCard/VideoCard.jsx";
import "./VideoGrid.css";

// Responsive grid of VideoCards. `columns` = max columns on wide screens.
export default function VideoGrid({ videos, variant = "grid", columns = 4, action }) {
  return (
    <ul className={`vgrid vgrid--${columns}`}>
      {videos.map((video) => (
        <li key={video.id}>
          <VideoCard video={video} variant={variant} action={action ? action(video) : undefined} />
        </li>
      ))}
    </ul>
  );
}
