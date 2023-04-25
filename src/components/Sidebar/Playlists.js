import React, { useState, useEffect } from "react";
import PlaylistService from "../../services/playlistService";
import { NavLink } from "react-router-dom";
import { setPlaylist, setPlaylistId } from "../../stores/playlist";
import { useDispatch } from "react-redux";

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);

  const dispatch = useDispatch();

  let userId = parseInt(localStorage.getItem("currentUser"));

  useEffect(() => {
    let playlistService = new PlaylistService();
    playlistService
      .getPlaylists()
      .then((result) => {
        //console.log(typeof(userId));
        //console.log(result.data.data.filter((playlist) => playlist.playlistUserId === userId));
        setPlaylists(result.data.data.filter((playlist) => playlist.playlistUserId === userId))
      });
  }, [userId]);

  useEffect(() => {
    let duration = 45.25;
    console.log(duration.toString().split(".")); 
  })

  // const getSongsFromPlaylistAndDispatch = (playlist) => {

  //   let songService = new SongService()

  //   let playlistService = new PlaylistService();
  //   playlistService.getPlaylistById(playlist.playlistId).then((result) => {
  //     let songIds = result.data.data.playlistSongs;
  //     let songs = [];
  //     songIds.forEach((songId )=> {
  //       songService.getSongById(songId).then((result) => {
  //         let song = {...result.data.data}
  //         songs.push(song)
  //       })
  //     });
  //     console.log(songs);
  //     dispatch(setPlaylist(playlist))
  //     dispatch(setPlaylistSongs(songs))
  //   })
  // }

  return (
    <nav className="mx-6 mt-2 py-2 flex-auto border-t border-white border-opacity-20 overflow-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-black scrollbar-thumb-rounded-lg">
      <ul>
        {playlists.map((playlist) => (
          <li>
            <NavLink
              onClick={() => {
                let playlistService = new PlaylistService();
                playlistService
                  .getPlaylistById(playlist.playlistId)
                  .then((result) => {
                    dispatch(setPlaylist(playlist));
                  });
              }}
              to="/playlist"
              className="text-[0.813rem] text-link hover:text-white flex h-8 items-center"
            >
              {playlist.playlistName}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
