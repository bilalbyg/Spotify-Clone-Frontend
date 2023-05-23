import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./views/Home";
import Search from "./views/Search";
import Library from "./views/Library";
import Playlist from "./views/Playlist";
import Episodes from "./views/Episodes";
import EpisodeDetail from "./views/EpisodeDetail";
import PodcastDetail from "./views/PodcastDetail";
import Account from "./views/Account";
import LikedSongs from "./views/LikedSongs";
import CreatePlaylist from "./views/CreatePlaylist";
import AlbumDetail from "./views/AlbumDetail";
import ArtistDetail from "./views/ArtistDetail";
import NotFound from "./views/NotFound";
import Category from "./views/Category";
import PrivateRoutes from "./PrivateRoutes";
import Podcasts from "./views/Podcasts";

function App() {

  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route element={<Home />} path="/" exact />
          <Route element={<Home />} path="/home" exact />
          <Route element={<Library />} path="/library" />
          <Route path="/search" exact element={<Search />} />

          <Route path="/playlist/:playlistId" exact element={<Playlist />} />
          <Route path="/episodes" exact element={<Episodes />} />
          <Route
            path="/episode-detail/:episodeId"
            exact
            element={<EpisodeDetail />}
          />
          <Route
            path="/podcast-detail/:podcastId"
            exact
            element={<PodcastDetail />}
          />
          <Route path="/account" exact element={<Account />} />
          <Route path="/liked-songs" exact element={<LikedSongs />} />
          <Route path="/create-playlist" exact element={<CreatePlaylist />} />
          <Route
            path="/album-detail/:albumId"
            exact
            element={<AlbumDetail />}
          />
          <Route
            path="/artist-detail/:artistId"
            exact
            element={<ArtistDetail />}
          />
          <Route path="/category/:categoryId" exact element={<Category />} />
          <Route path="/podcasts" exact element={<Podcasts />} />
        </Route>
        <Route element={<Login />} path="/login" />
        <Route path="/register" exact element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
