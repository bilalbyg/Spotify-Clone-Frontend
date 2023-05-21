import React, { useState, useEffect, useRef } from "react";
import { Icon } from "../Icons";
import useColorThief from "use-color-thief";
import AlbumService from "../services/albumService";
import { useParams } from "react-router";
import SongService from "../services/songService";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrent } from "../stores/player";
import playingGif from "../img/playing.gif";
import UserLikedAlbumService from "../services/userLikedAlbumService";
import PlaylistService from "../services/playlistService";

export default function AlbumDetail() {
  const [album, setAlbum] = useState([]);
  const [songs, setSongs] = useState([]);
  const [showContextMenu, setShowContextMenu] = useState(true);
  const [clickedSongId, setClickedSongId] = useState(0);
  const [userLikedAlbum, setUserLikedAlbum] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const dispatch = useDispatch();

  const { albumId } = useParams();
  const source = album?.albumCoverImageUrl;
  const { current, playing, controls } = useSelector((state) => state.player);
  let index = 1;

  const contextMenuRef = useRef(null);

  let userId = parseInt(localStorage.getItem("currentUser"));

  const isCurrentItem = (songId) => {
    return current?.songId === songId && playing;
  };

  const updateCurrent = (song) => {
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

  const { color, palette } = useColorThief(source, {
    format: "hex",
    colorCount: 10,
    quality: 10,
  });

  const handleContextMenu = (e, songId) => {
    e.preventDefault();
    console.log(songId);
    setShowContextMenu(true);
    setClickedSongId(songId);
  };

  // useEffect(() => {
  //   let handler = () => {
  //     setShowContextMenu(false);
  //   };
  //   document.addEventListener("mousedown", handler);
  // });

  useEffect(() => {
    let albumService = AlbumService.getInstance();
    albumService.getByAlbumId(parseInt(albumId)).then((res) => {
      setAlbum(res.data.data);
    });

    let songService = SongService.getInstance();
    songService.getSongsByAlbumId(albumId).then((res) => {
      setSongs(res.data.data);
    });

    let userLikedAlbumService = UserLikedAlbumService.getInstance();
    userLikedAlbumService
      .getByUserIdAndAlbumId(userId, albumId)
      .then((res) => {
        if (res.data.data !== null) {
          setUserLikedAlbum(res.data.data);
          setIsLiked(true);
        }
      })
      .catch((err) => {
        setIsLiked(false);
      });

    let playlistService = PlaylistService.getInstance();
    playlistService.getByPlaylistUserId(userId).then((res) => {
      setPlaylists(res.data.data);
    });
  }, []);

  useEffect(() => {
    let albumService = AlbumService.getInstance();
    albumService.getByAlbumId(parseInt(albumId)).then((res) => {
      setAlbum(res.data.data);
    });

    let userLikedAlbumService = UserLikedAlbumService.getInstance();
    userLikedAlbumService
      .getByUserIdAndAlbumId(userId, albumId)
      .then((res) => {
        if (res.data.data !== null) {
          setUserLikedAlbum(res.data.data);
          setIsLiked(true);
        }
      })
      .catch((err) => {
        setIsLiked(false);
      });

    let playlistService = PlaylistService.getInstance();
    playlistService.getByPlaylistUserId(userId).then((res) => {
      setPlaylists(res.data.data);
    });
  }, [albumId]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
  }, []);

  const handleClickOutside = (e) => {
    if (!contextMenuRef.current.contains(e.target)) {
      setShowContextMenu(false)
    }
  };

  const likeAlbum = () => {
    let userLikedAlbumService = UserLikedAlbumService.getInstance();
    var addRequest = {
      userId: userId,
      albumId: albumId,
    };
    userLikedAlbumService.addUserLikedAlbum(addRequest).then((res) => {
      setIsLiked(true);
      setUserLikedAlbum(res.data.data);
      console.log(res.data.data);
    });
  };

  const unlikeAlbum = () => {
    let userLikedAlbumService = UserLikedAlbumService.getInstance();
    userLikedAlbumService
      .delete(userLikedAlbum.userLikedAlbumId)
      .then((res) => {
        console.log(res.data);
        setIsLiked(false);
      });
  };

  const addToPlaylist = (playlistId, songId) => {
    let playlistService = PlaylistService.getInstance()
    playlistService.getPlaylistById(playlistId).then((res) => {
      setShowContextMenu(false)
      console.log(res.data.data);
      var tempPlaylist = res.data.data
      var tempPlaylistSongs = tempPlaylist.playlistSongs
      if(!tempPlaylistSongs.includes(songId)){
        tempPlaylistSongs.push(songId)
      }
      console.log(tempPlaylistSongs);
      console.log({...tempPlaylist, playlistSongs : tempPlaylistSongs});
      playlistService.updatePlaylist({...tempPlaylist, playlistSongs : tempPlaylistSongs}).then((res) => {
        console.log(res);
      })
    })
  }

  return (
    <main>
      {/* TOP */}
      <div
        className={`flex flex-row justify-end relative pb-6 px-8 min-h-[21.25rem] max-h-[31.25rem]`}
        style={{
          backgroundImage: `linear-gradient(
      0deg,
      #272727,
      ${color}
  )`,
        }}
      >
        <div className="absolute left-6 bottom-6 w-56 h-56 flex items-center justify-center">
          <img src={album?.albumCoverImageUrl} />
        </div>
        <div className="flex flex-col h-80 w-[60rem] absolute pt-36 pl-7">
          <span className="font-semibold text-sm tracking-wide z-50 pl-1">
            Albüm
          </span>
          <span className="font-bold">
            <h1 className={`text-8xl font-bold tracking-tight`}>
              {album?.albumName}
            </h1>
          </span>
          <div className="flex flex-row items-center gap-x-2 pt-4">
            <div className="flex flex-row gap-x-2 items-center">
              <div className="h-6 w-6">
                <img
                  className="w-6 h-6 rounded-full object-cover"
                  src={album?.artist?.artistCoverImageUrl}
                />
              </div>
              <span className="tracking-tight font-semibold">
                {album?.artist?.artistName}
              </span>
            </div>
            <span className="h-1 w-1 bg-white rounded-full inline-block" />
            <span className="text-sm font-semibold">{songs.length} şarkı</span>
            <span className="text-sm font-semibold">3dk 8sn</span>
          </div>
        </div>
      </div>
      {/* MIDDLE */}
      <div className="bg-[#272727] flex flex-row items-center h-24 px-8 py-4">
        <button
          //onClick={controls[state?.playing ? "pause" : "play"]}
          className="h-16 w-16 flex items-center justify-center bg-primary text-black rounded-full hover:scale-[1.06]"
        >
          {/* name={`${state?.playing ? "pause" : "play"}`} */}
          <Icon size={30} name="play" />
        </button>
        {isLiked ? (
          <button
            onClick={() => unlikeAlbum()}
            className="h-16 w-16 flex items-center justify-center text-primary rounded-full hover:scale-[1.06]"
          >
            {/* name={`${state?.playing ? "pause" : "play"}`} */}
            <Icon size={30} name="like" />
          </button>
        ) : (
          <button
            onClick={() => likeAlbum()}
            className="h-16 w-16 flex items-center justify-center text-[#8e8e8e] rounded-full hover:scale-[1.06]"
          >
            {/* name={`${state?.playing ? "pause" : "play"}`} */}
            <Icon size={30} name="unliked" />
          </button>
        )}
      </div>
      {/* BOTTOM */}
      <div className="bg-gradient-to-b from-[#272727] to-backdrop flex justify-center w-full h-auto p-4">
        <div className="w-full">
          <div className="flex flex-row w-full h-9 items-center justify-between">
            <div className="w-[20%]">
              <span className="flex items-center justify-center text-sm font-semibold text-[#8e8e8e]">
                #
              </span>
            </div>
            <div className="w-[30%]">
              <span className="flex justify-start text-sm font-semibold text-[#8e8e8e]">
                Başlık
              </span>
            </div>
            <div className="w-[20%]">
              <span className="flex items-center justify-start text-sm font-semibold text-[#8e8e8e]">
                Çalma
              </span>
            </div>
            <div className="w-[30%]">
              <div className="flex items-center justify-center pr-5">
                <button className="text-[#8e8e8e]">
                  <Icon name="time" size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full ">
            {songs.map((song) => (
              <div
                className="flex flex-row rounded items-center justify-between h-14 group hover:bg-[#2d2d2d]"
                onContextMenu={(e) => {
                  handleContextMenu(e, song.songId);
                }}
              >
                <div className="flex items-center justify-center w-[20%]">
                  <div className="text-[#a7a7a7] font-semibold text-sm flex items-center justify-center">
                    {playing && isCurrentItem(song.songId) ? (
                      <img
                        src={playingGif}
                        className="w-6 h-6 group-hover:hidden"
                      />
                    ) : (
                      <span className="group-hover:hidden">{index++}</span>
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
                <div className="flex items-center justify-start w-[30%]">
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
                      <span className="text-[#a7a7a7] text-sm hover:underline hover:text-white hover:cursor-pointer">
                        {song.album.artist.artistName}
                      </span>
                      <div
                        className={`absolute left-52 ${
                          showContextMenu && clickedSongId === song.songId
                            ? "flex"
                            : "hidden"
                        } w-52 items-center justify-center p-1 rounded-sm bg-active text-sm font-semibold text-contextMenu tracking-tight`}
                      >
                        <ul ref={contextMenuRef} className="w-full">
                          <li className="flex items-center justify-start h-10 hover:bg-podcast px-2 cursor-pointer">
                            <button>
                              <NavLink to="/#">Sanatçıya git</NavLink>
                            </button>
                          </li>
                          <li className="flex items-center justify-start h-10 hover:bg-podcast px-2 cursor-pointer">
                            <button>
                              <NavLink to="/#">Albüme git</NavLink>
                            </button>
                          </li>
                          <li className="relative flex items-center justify-between h-10 hover:bg-podcast group/playlist px-2 cursor-pointer">
                            <button>Çalma listesine ekle</button>
                            <Icon name="next" size={14} />
                            <div className="absolute left-52 bottom-0 w-52 bg-active p-1 hidden items-center group-hover/playlist:flex justify-center text-sm font-semibold text-contextMenu tracking-tight">
                              <ul className="w-full flex flex-col items-center justify-center">
                                {playlists.map((playlist) => (
                                  <li className="flex items-center justify-start w-full px-2 h-10 hover:bg-podcast">
                                    <button onClick={() => addToPlaylist(playlist.playlistId, song.songId)}>{playlist.playlistName}</button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-start w-[20%] text-sm font-semibold text-[#8e8e8e]">
                  123.123.123
                </div>
                <div className="flex items-center justify-center w-[30%] pr-4">
                  <div className="flex flex-row items-center justify-center gap-x-5">
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
        {/* <table className="w-full">
          <tr>
            <td className="w-[5%]">
              <span className="flex items-center justify-center text-sm font-semibold text-[#8e8e8e]">
                #
              </span>
            </td>
            <td className="w-[30%]">
              <span className="flex justify-start text-sm font-semibold text-[#8e8e8e]">
                Başlık
              </span>
            </td>
            <td className="w-[25%]">
              <span className="flex justify-start text-sm font-semibold text-[#8e8e8e]">
                Albüm
              </span>
            </td>
            <td className="w-[25%]">
              <span className="flex justify-start text-sm font-semibold text-[#8e8e8e]">
                Eklenme Tarihi
              </span>
            </td>
            <td className="w-[15%]">
              <div className="flex items-center justify-center pr-5">
                <button className="text-[#8e8e8e]">
                  <Icon name="time" size={16} />
                </button>
              </div>
            </td>
          </tr>

          <tbody>
            {songs.map((song) => (
              <tr
                className="h-14 group hover:bg-[#2d2d2d]"
                onContextMenu={(e) => {
                  handleContextMenu(e, song.songId);
                }}
              >
                <td className="w-[5%]">
                  <div className="text-[#a7a7a7] font-semibold text-sm flex items-center justify-center">
                    {playing && isCurrentItem(song.songId) ? (
                      <img
                        src={playingGif}
                        className="w-6 h-6 group-hover:hidden"
                      />
                    ) : (
                      <span className="group-hover:hidden">{index++}</span>
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
                </td>
                <td className="w-[30%]">
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
                      <span className="text-[#a7a7a7] text-sm hover:underline hover:text-white hover:cursor-pointer">
                        {song.album.artist.artistName}
                      </span>
                      <div
                        className={`absolute left-52 ${
                          showContextMenu && clickedSongId === song.songId
                            ? "flex"
                            : "hidden"
                        } w-52 items-center justify-center p-1 rounded-sm bg-active text-sm font-semibold text-contextMenu tracking-tight`}
                      >
                        <ul className="w-full">
                          <li className="flex items-center justify-start h-10 hover:bg-podcast px-2 cursor-pointer">
                            <button>
                              <NavLink to="/#">Sanatçıya git</NavLink>
                            </button>
                          </li>
                          <li className="flex items-center justify-start h-10 hover:bg-podcast px-2 cursor-pointer">
                            <button>
                              <NavLink to="/#">Albüme git</NavLink>
                            </button>
                          </li>
                          <li className="relative flex items-center justify-between h-10 hover:bg-podcast group/playlist px-2 cursor-pointer">
                            <button>Çalma listesine ekle</button>
                            <Icon name="next" size={14} />
                            <div className="absolute left-52 top-0 w-52 bg-active p-1 hidden items-center group-hover/playlist:flex justify-center text-sm font-semibold text-contextMenu tracking-tight">
                              <ul className="w-full flex-items-center justify-center">
                                <li className="flex items-center justify-start w-full px-2 h-10 hover:bg-podcast">
                                  <button>Playlist 1</button>
                                </li>
                                <li className="flex items-center justify-start w-full px-2 h-10 hover:bg-podcast">
                                  <button>Playlist 2</button>
                                </li>
                                <li className="flex items-center justify-start w-full px-2 h-10 hover:bg-podcast">
                                  <button>Playlist 3</button>
                                </li>
                              </ul>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="w-[25%] text-[#a7a7a7] tracking-tighter font-semibold hover:underline hover:text-white text-sm">
                  {song.album.albumName}
                </td>
                <td className="w-[25%] text-[#a7a7a7] font-semibold text-sm">
                  <span>6 Şub 2022</span>
                </td>
                <td className="w-[15%] pr-4">
                  <div className="flex flex-row items-center justify-between">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}
      </div>
      <hr className="h-px my-8 bg-[#2a2a2a] border-0" />
    </main>
  );
}
