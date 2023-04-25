import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ApplicationContainer from "./components/ApplicationContainer";
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

function App() {
  return (
    <Router>
      <Routes>
        {/* move to ApplicationContainer  */}
        <Route
          path="/"
          exact
          element={
            localStorage.getItem("currentUser") ? (
              <ApplicationContainer />
            ) : (
              <Login />
            )
          }
        >
          <Route
            path="/home"
            exact
            element={localStorage.getItem("currentUser") ? <Home /> : <Login />}
          />
          <Route
            path="/search"
            exact
            element={
              localStorage.getItem("currentUser") ? <Search /> : <Login />
            }
          />
          <Route
            path="/library"
            exact
            element={
              localStorage.getItem("currentUser") ? <Library /> : <Login />
            }
          />
          <Route
            path="/playlist"
            exact
            element={
              localStorage.getItem("currentUser") ? <Playlist /> : <Login />
            }
          />
          <Route
            path="/episodes"
            exact
            element={
              localStorage.getItem("currentUser") ? <Episodes /> : <Login />
            }
          />
          <Route
            path="/episode-detail"
            exact
            element={
              localStorage.getItem("currentUser") ? (
                <EpisodeDetail />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/podcast-detail"
            exact
            element={
              localStorage.getItem("currentUser") ? (
                <PodcastDetail />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/account"
            exact
            element={
              localStorage.getItem("currentUser") ? <Account /> : <Login />
            }
          />
          <Route
            path="/liked-songs"
            exact
            element={
              localStorage.getItem("currentUser") ? <LikedSongs /> : <Login />
            }
          />
          <Route
            path="/create-playlist"
            exact
            element={
              localStorage.getItem("currentUser") ? (
                <CreatePlaylist />
              ) : (
                <Login />
              )
            }
          />
        </Route>
        <Route path="/login" exact element={<Login />} />
        <Route path="/register" exact element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
