import { useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState/EmptyState.jsx";
import { ChannelView } from "./Channel.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import useDocumentTitle from "../hooks/useDocumentTitle.js";

// The logged-in user's own channel (with Edit + announcements composer).
export default function MyContent() {
  const { user, openAuth } = useAuth();
  const { tab } = useParams();
  useDocumentTitle("My content");
  if (!user) {
    return (
      <EmptyState asH1 fill icon="video" title="Log in to see your content" action={{ label: "Log in", onClick: () => openAuth("login", "Log in to manage your channel.") }}>
        Your channel, playlists and announcements live here.
      </EmptyState>
    );
  }
  return <ChannelView channelId={user.channelId} tab={tab} basePath="/my-content" />;
}
