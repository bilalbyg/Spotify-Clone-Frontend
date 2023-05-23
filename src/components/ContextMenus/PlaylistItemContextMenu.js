import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import PlaylistService from "../../services/playlistService";


const PlaylistItemContextMenu = ({ playlistId, song, deleteNotify }) => {
  const [playlist, setPlaylist] = useState([]);


  useEffect(() => {
    let playlistService = PlaylistService.getInstance();
    playlistService.getPlaylistById(playlistId).then((res) => {
      setPlaylist(res.data.data);
    });
  }, [song]);

  useEffect(() => {
    let playlistService = PlaylistService.getInstance();
    playlistService.getPlaylistById(playlistId).then((res) => {
      setPlaylist(res.data.data);
    });
  }, [playlist]);

  const deleteFromPlaylist = (songId) => {
    const filteredPlaylistSongs = playlist.playlistSongs.filter(
      (playlistSong) => playlistSong !== songId
    );
    const updatePlaylistRequest = {
      ...playlist,
      playlistSongs: filteredPlaylistSongs,
    };
    let playlistService = PlaylistService.getInstance();
    playlistService.updatePlaylist(updatePlaylistRequest).then((res) => {
      deleteNotify()
      setPlaylist(res.data.data);
    });
  };

  return (
    <>
      <ul className="w-full">
        <li className="flex items-center justify-start h-10 hover:bg-podcast px-2 cursor-pointer">
          <button onClick={() => console.log("Sanatçıya git")}>
            <NavLink to={`/artist-detail/${song.album.artist.artistId}`}>
              Sanatçıya git
            </NavLink>
          </button>
        </li>
        <li className="flex items-center justify-start h-10 hover:bg-podcast px-2 cursor-pointer">
          <button onClick={() => console.log("Albüme git")}>
            <NavLink to={`/album-detail/${song.album.albumId}`}>
              Albüme git
            </NavLink>
          </button>
        </li>
        <li className="relative flex items-center justify-between h-10 hover:bg-podcast group/playlist px-2 cursor-pointer">
          <button onClick={() => deleteFromPlaylist(song.songId)}>
            Çalma listesinden çıkar
          </button>
        </li>
      </ul>
    </>
  );
};

export default PlaylistItemContextMenu;
