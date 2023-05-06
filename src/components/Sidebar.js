import React, { useState, useEffect } from "react";
import logo from "../img/logo.svg";
import Menu from "./Sidebar/Menu";
import { Icon } from "../Icons";
import Playlists from "./Sidebar/Playlists";
import DownloadApp from "./Sidebar/DownloadApp";
import { NavLink } from "react-router-dom";
import PlaylistService from "../services/playlistService";
import PlaylistCoverImageService from "../services/playlistCoverImageService";
import { useDispatch, useSelector } from "react-redux";
import { setCreatedPlaylist } from "../stores/createdPlaylist";

function Sidebar() {
  const [playlists, setPlaylists] = useState([]);

  const dispatch = useDispatch()  
  const createdPlaylist = useSelector((state) => state.createdPlaylist)

  let userId = parseInt(localStorage.getItem("currentUser"));

  useEffect(() => {
    let playlistService = new PlaylistService();
    playlistService.getPlaylists().then((result) => {
      setPlaylists(
        result.data.data.filter(
          (playlist) => playlist.playlistUserId === userId
        )
      );
    });
  }, [userId]);

  useEffect(() => {
    let playlistService = new PlaylistService();
    playlistService.getPlaylists().then((result) => {
      setPlaylists(
        result.data.data.filter(
          (playlist) => playlist.playlistUserId === userId
        )
      );
    });
  }, [playlists, playlists.length]);

  const createPlaylist = () => {
    let playlistService = new PlaylistService();
    playlistService.getPlaylists().then((result) => {
      setPlaylists(
        result.data.data.filter(
          (playlist) => playlist.playlistUserId === userId
        )
      );
    });

    var createPlaylistRequest = {
      playlistCoverImageUrl: "",
      playlistName: (playlists.length + 1).toString() + ". Çalma Listem",
      playlistSongs: [],
      playlistUserId: userId,
    };
    playlistService
      .addPlaylist(createPlaylistRequest)
      .then((res) => {
        console.log(res.data.data);
        dispatch(setCreatedPlaylist(res.data.data))
      })
      .catch((err) => console.log(err.message));

  };

  return (
    <aside className="w-60 pt-6 flex flex-shrink-0 flex-col bg-black">
      <a href="#" className="mb-7 px-6">
        <img src={logo} className="h-10" />
      </a>

      <Menu />
      <nav className="mt-6">
        <ul>
          <li>
            <div onClick={() => createPlaylist()}>
              <NavLink
                to="/create-playlist"
                className="py-2 px-6 flex items-center group text-sm text-link font-semibold hover:text-white"
              >
                <span className="w-6 h-6 flex items-center justify-center group-hover:bg-opacity-100 mr-4 bg-white rounded-sm text-black bg-opacity-80">
                  <Icon name="plus" size={12} />
                </span>
                Çalma Listesi Oluştur
              </NavLink>
            </div>
          </li>
          <li>
            <NavLink
              to="/liked-songs"
              className="py-2 px-6 flex items-center group text-sm text-link font-semibold hover:text-white"
            >
              <span className="w-6 h-6 flex items-center justify-center mr-4 bg-gradient-to-br text-white rounded-sm from-purple-800 to-blue-300 opacity-60 group-hover:opacity-100">
                <Icon name="like" size={12} />
              </span>
              Beğenilen Şarkılar
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/episodes"
              className="py-2 px-6 flex items-center group text-sm text-link font-semibold hover:text-white"
            >
              <span className="w-6 h-6 flex items-center justify-center mr-4 bg-[#056952] text-[#1ed760] rounded-sm opacity-60 group-hover:opacity-100">
                <Icon name="podcast" size={15} />
              </span>
              Bölümlerin
            </NavLink>
          </li>
        </ul>
      </nav>

      <Playlists />
      <DownloadApp />
    </aside>
  );
}

export default Sidebar;
