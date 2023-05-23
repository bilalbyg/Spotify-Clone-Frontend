import React, { useState, useEffect, useRef } from "react";
import { Icon } from "../Icons";
import { useDispatch, useSelector } from "react-redux";
import SongService from "../services/songService";
import UserLikedSongService from "../services/userLikedSongService";
import playingGif from "../img/playing.gif";
import { setCurrent } from "../stores/player";
import PlaylistDropzone from "../components/PlaylistDropzone";
import { NavLink, useParams } from "react-router-dom";
import PlaylistItemContextMenu from "../components/ContextMenus/PlaylistItemContextMenu";
import PlaylistService from "../services/playlistService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Playlist() {
  const { playlistId } = useParams();

  const [playlist, setPlaylist] = useState([]);

  const [showContextMenu, setShowContextMenu] = useState(true);
  const [clickedSongId, setClickedSongId] = useState(0);

  const [songs, setSongs] = useState([]);
  const contextMenuRef = useRef(null);

  const dispatch = useDispatch();

  const { current, playing, controls } = useSelector((state) => state.player);

  let userId = parseInt(localStorage.getItem("currentUser"));

  const deleteNotify = () =>
    toast.success("Şarkı çalma listesinden kaldırıldı", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const updateCurrent = (song) => {
    console.log(song);
    if (current.songId === song.songId) {
      if (playing) {
        controls.pause();
      } else {
        controls.play();
      }
    } else {
      dispatch(setCurrent(song));
    }
  };

  const isCurrentItem = (songId) => {
    return current?.songId === songId && playing;
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
  }, []);

  const handleClickOutside = (e) => {
    if (!contextMenuRef.current.contains(e.target)) {
      setShowContextMenu(false);
    }
  };

  useEffect(() => {
    let playlistService = PlaylistService.getInstance();
    playlistService.getPlaylistById(parseInt(playlistId)).then((res) => {
      console.log(res.data.data);
      setPlaylist(res.data.data);
    });

    let songService = SongService.getInstance();
    let queryString = JSON.stringify(playlist?.playlistSongs);
    let toSendQueryString = queryString?.substring(1, queryString.length - 1);
    songService.getSongsById(toSendQueryString).then((result) => {
      setSongs(result.data.data);
    });
    playlistDuration();
  }, []);

  useEffect(() => {
    let playlistService = PlaylistService.getInstance();
    playlistService.getPlaylistById(parseInt(playlistId)).then((res) => {
      setPlaylist(res.data.data);
    });

    let songService = SongService.getInstance();
    let queryString = JSON.stringify(playlist?.playlistSongs);
    let toSendQueryString = queryString?.substring(1, queryString.length - 1);
    songService.getSongsById(toSendQueryString).then((result) => {
      setSongs(result.data.data);
    });

    playlistDuration();
  }, [playlist]);

  const handleContextMenu = (e, songId) => {
    e.preventDefault();
    setShowContextMenu(true);
    setClickedSongId(songId);
  };

  const likeSong = (songId) => {
    var request = {
      songId: songId,
      userId: userId,
    };
    let userLikedSongService = UserLikedSongService.getInstance();
    userLikedSongService
      .addUserLikedSong(request)
      .then((res) => {})
      .catch((err) => {});
  };

  const playlistDuration = () => {
    let minute = 0;
    let second = 0;
    songs.map((song) => {
      let duration = song.duration.toString().split(".");
      minute = minute + parseInt(duration[0]);
      second = second + parseInt(duration[1]);
    });
    second = second + minute * 60;

    const date = new Date(null);
    date.setSeconds(second); // specify value for SECONDS here
    const result = date.toISOString().slice(11, 19);
    let duration = result.split(":");
    return duration;
  };

  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {
        <div onClick={() => setShowContextMenu(false)}>
          {/* TOP */}
          <div className="flex flex-row justify-end relative pb-6 px-8 bg-gradient-to-t from-[#272727] to-[#575757] min-h-[21.25rem] max-h-[31.25rem]">
            <div className="absolute left-6 bottom-6 bg-active w-56 h-56">
              <PlaylistDropzone playlistId={playlist.playlistId} />
            </div>
            <div className="flex flex-col h-80 w-[60rem] absolute pt-36 pl-7">
              <span className="font-semibold text-sm tracking-wide z-40 pl-1">
                Çalma Listesi
              </span>
              <span className="text-8xl font-bold tracking-tighter">
                <h1>{playlist?.playlistName}</h1>
              </span>
              <div className="flex flex-row items-center gap-x-2 pt-4">
                <div className="flex flex-row gap-x-2 items-center">
                  <div className="h-6 w-6 rounded-full">
                    <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" />
                  </div>
                  <span className="tracking-tight font-semibold">
                    {localStorage.getItem("userMail")}
                  </span>
                </div>
                <span className="h-1 w-1 bg-white rounded-full inline-block" />
                <span className="text-sm font-semibold">
                  {playlist?.playlistSongs?.length} şarkı,
                </span>
                <span className="text-white opacity-70">
                  yaklaşık{" "}
                  {playlistDuration()[0] > 0 ? (
                    <span>{playlistDuration()[0]} sa.</span>
                  ) : (
                    ""
                  )}
                  {playlistDuration()[1] > 0 ? (
                    <span> {playlistDuration()[1]} dk.</span>
                  ) : (
                    ""
                  )}
                  {playlistDuration()[2] > 0 ? (
                    <span> {playlistDuration()[2]} sn.</span>
                  ) : (
                    ""
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* MIDDLE */}
          <div className="bg-[#222222] flex flex-row items-center gap-x-2 h-24 px-8 py-4">
            <button className="h-16 w-16 flex items-center justify-center bg-primary text-black rounded-full hover:scale-[1.06]">
              <Icon size={30} name="play" />
            </button>
            {playlist.playlistUserId === userId && (
              <button className="h-16 w-16 flex items-center justify-center text-primary hover:text-opacity-100">
                <Icon size={30} name="like" />
              </button>
            )}
            <button className="text-link">
              <Icon name="dots" size={34} />
            </button>
          </div>

          <div className="flex justify-center w-full h-auto p-4">
            <div className="w-full">
              <div className="w-full">
                <div className="flex flex-row w-full pb-3">
                  <div className="w-[5%]">
                    <span className="flex items-center justify-center text-sm font-semibold text-[#8e8e8e]">
                      #
                    </span>
                  </div>
                  <div className="w-[40%]">
                    <span className="flex items-center justify-start text-sm font-semibold text-[#8e8e8e]">
                      Başlık
                    </span>
                  </div>
                  <div className="w-[20%]">
                    <span className="flex items-center justify-start text-sm font-semibold text-[#8e8e8e]">
                      Albüm
                    </span>
                  </div>
                  <div className="w-[20%]">
                    <span className="flex items-center justify-start text-sm font-semibold text-[#8e8e8e]">
                      Eklenme Tarihi
                    </span>
                  </div>
                  <div className="flex items-center justify-start w-[15%] pl-10">
                    <button className="text-[#8e8e8e]">
                      <Icon name="time" size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div>
                {songs.map((song, index) => (
                  <div
                    className="flex flex-row h-14 group hover:bg-[#2d2d2d] rounded"
                    onContextMenu={(e) => {
                      handleContextMenu(e, song.songId);
                    }}
                  >
                    <div className="w-[5%] flex items-center justify-center">
                      <div className="text-[#a7a7a7] font-semibold text-sm flex items-center justify-center">
                        {playing && isCurrentItem(song.songId) ? (
                          <img
                            src={playingGif}
                            className="w-6 h-6 group-hover:hidden"
                          />
                        ) : (
                          <span className="group-hover:hidden">
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <div className="hidden items-center justify-center group-hover:flex">
                        <button onClick={() => updateCurrent(song)}>
                          <Icon
                            name={isCurrentItem(song.songId) ? "pause" : "play"}
                            size={22}
                          />
                        </button>
                      </div>
                    </div>
                    <div className="w-[40%] flex items-center justify-start">
                      <div className="flex flex-row gap-x-3 items-center justify-start">
                        <img
                          className="w-10 h-10"
                          src={song.album.albumCoverImageUrl}
                        />
                        <div className="flex flex-col justify-start font-semibold relative">
                          <span
                            className={`${
                              playing && isCurrentItem(song.songId)
                                ? "text-primary"
                                : "text-white "
                            } tracking-tight hover:underline`}
                          >
                            {song.songName}
                          </span>
                          <NavLink
                            to={`/artist-detail/${song.album.artist.artistId}`}
                          >
                            <span className="text-[#a7a7a7] text-sm hover:underline hover:text-white hover:cursor-pointer">
                              {song.album.artist.artistName}
                            </span>
                          </NavLink>

                          <div
                            ref={contextMenuRef}
                            className={`absolute left-52 ${
                              showContextMenu && clickedSongId === song.songId
                                ? "flex"
                                : "hidden"
                            } w-52 items-center justify-center p-1 rounded-sm bg-active text-sm font-semibold text-contextMenu tracking-tight`}
                          >
                            <PlaylistItemContextMenu
                              playlistId={playlist.playlistId}
                              song={song}
                              deleteNotify={deleteNotify}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-[20%] flex items-center justify-start text-[#a7a7a7] tracking-tighter font-semibold hover:underline hover:text-white text-sm">
                      <NavLink to={`/album-detail/${song.album.albumId}`}>
                        {song.album.albumName}
                      </NavLink>
                    </div>
                    <div className="w-[20%] flex items-center justify-start text-[#a7a7a7] font-semibold text-sm">
                      <span>6 Şub 2022</span>
                    </div>
                    <div className="w-[15%] flex items-center justify-start">
                      <div className="flex flex-row w-full items-center justify-start gap-x-5">
                        <button
                          onClick={() => likeSong(song.songId)}
                          className="invisible group-hover:visible"
                        >
                          <Icon name="like" size={16} />
                        </button>
                        <span className="text-[#a7a7a7] font-semibold text-sm flex items-center justify-center">
                          {song.duration}
                        </span>
                        <button className="invisible group-hover:visible">
                          <Icon name="dots" size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <hr className="h-px my-8 bg-[#2a2a2a] border-0" />
        </div>
      }
    </>
  );
}
