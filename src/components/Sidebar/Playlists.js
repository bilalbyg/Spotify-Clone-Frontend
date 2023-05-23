import React, { useState, useEffect, useRef } from "react";
import PlaylistService from "../../services/playlistService";
import { NavLink } from "react-router-dom";
import { setPlaylist, setPlaylistId } from "../../stores/playlist";
import { useDispatch } from "react-redux";
import { Icon } from "../../Icons";
import PlaylistsContextMenu from "../ContextMenus/PlaylistsContextMenu";

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);

  const [showContextMenu, setShowContextMenu] = useState(false);
  const [clickedPlaylistId, setClickedPlaylistId] = useState(0);

  const dispatch = useDispatch();

  const contextMenuRef = useRef(null);


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
    let playlistService = PlaylistService.getInstance();
    playlistService.getPlaylists().then((result) => {
      setPlaylists(
        result.data.data.filter(
          (playlist) => playlist.playlistUserId === userId
        )
      );
    });
  }, [playlists]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
  }, []);

  const handleClickOutside = (e) => {
    if (!contextMenuRef.current.contains(e.target)) {
      setShowContextMenu(false)
    }
  };

  const handleContextMenu = (e, playlistId) => {
    e.preventDefault();
    setShowContextMenu(true);
    setClickedPlaylistId(playlistId);
  };

  return (
    <nav className="mx-6 mt-2 py-2 flex-auto border-t border-white border-opacity-20 overflow-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-black scrollbar-thumb-rounded-lg">
      <ul className="overflow-hidden">
        {playlists.map((playlist) => (
          <li className="relative" key={playlist.playlistId}>
            <NavLink
              onContextMenu={(e) => {
                handleContextMenu(e, playlist.playlistId);
              }}

              to={`/playlist/${playlist.playlistId}`}
              className="text-[0.813rem] text-link hover:text-white flex h-8 items-center"
            >
              {playlist.playlistName}
            </NavLink>
            <div
              ref={contextMenuRef}
              className={`absolute -top-4 left-7 z-50 ${
                showContextMenu && clickedPlaylistId === playlist.playlistId
                  ? "flex"
                  : "hidden disabled"
              } w-36 items-center justify-center p-1 rounded-sm bg-active text-sm font-semibold text-contextMenu tracking-tight`}
            >
              <PlaylistsContextMenu
                playlistId={clickedPlaylistId}
                closeContextMenu={() => setShowContextMenu(false)}
              />
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}
