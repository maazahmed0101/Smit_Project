import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import Watch from "./pages/Watch.jsx";
import ChannelPage from "./pages/Channel.jsx";
import MyContent from "./pages/MyContent.jsx";
import Liked from "./pages/Liked.jsx";
import History from "./pages/History.jsx";
import Collection from "./pages/Collection.jsx";
import Playlist from "./pages/Playlist.jsx";
import Subscribers from "./pages/Subscribers.jsx";
import Support from "./pages/Support.jsx";
import Settings from "./pages/Settings.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="watch/:videoId" element={<Watch />} />
        <Route path="channel/:channelId/:tab?" element={<ChannelPage />} />
        <Route path="my-content/:tab?" element={<MyContent />} />
        <Route path="liked" element={<Liked />} />
        <Route path="history" element={<History />} />
        <Route path="collection" element={<Collection />} />
        <Route path="playlist/:playlistId" element={<Playlist />} />
        <Route path="subscribers" element={<Subscribers />} />
        <Route path="support" element={<Support />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
