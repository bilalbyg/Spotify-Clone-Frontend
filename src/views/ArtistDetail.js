import React, { useState, useEffect } from "react";
import { Icon } from "../Icons";
import useColorThief from "use-color-thief";
import AlbumService from "../services/albumService";
import ArtistService from "../services/artistService";
import { useParams } from "react-router";
import SongService from "../services/songService";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrent } from "../stores/player";
import playingGif from "../img/playing.gif";
import UserLikedArtistService from "../services/userLikedArtistService";

export default function ArtistDetail() {
  const [artist, setArtist] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [showContextMenu, setShowContextMenu] = useState(true);
  const [clickedSongId, setClickedSongId] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [userLikedArtist, setUserLikedArtist] = useState([]);

  const dispatch = useDispatch();

  let userId = parseInt(localStorage.getItem("currentUser"));

  const { artistId } = useParams();
  const { current, playing, controls } = useSelector((state) => state.player);

  const source = artist.artistBackgroundImageUrl;

  const { color, palette } = useColorThief(source, {
    format: "hex",
    colorCount: 10,
    quality: 10,
  });

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

  const handleContextMenu = (e, songId) => {
    e.preventDefault();
    console.log(songId);
    setShowContextMenu(true);
    setClickedSongId(songId);
  };

  useEffect(() => {
    let handler = () => {
      setShowContextMenu(false);
    };
    document.addEventListener("mousedown", handler);
  });

  useEffect(() => {
    let artistService = ArtistService.getInstance();
    artistService.getById(parseInt(artistId)).then((res) => {
      setArtist(res.data.data);
    });

    let albumService = AlbumService.getInstance();
    albumService.getByArtistId(parseInt(artistId)).then((res) => {
      setAlbums(res.data.data);
    });

    let songService = SongService.getInstance();
    songService.getSongs().then((res) => {
      setSongs(res.data.data);
    });

    let userLikedArtistService = UserLikedArtistService.getInstance();

    userLikedArtistService
      .getByUserIdAndArtistId(userId, artistId)
      .then((res) => {
        if(res.data.data !== null){
          setUserLikedArtist(res.data.data);
          setIsLiked(true);
        }
      })
      .catch((err) => {
        setIsLiked(false);
      });
  }, []);

  useEffect(() => {
    let artistService = ArtistService.getInstance();
    artistService.getById(parseInt(artistId)).then((res) => {
      setArtist(res.data.data);
    });
    
    let userLikedArtistService = UserLikedArtistService.getInstance();

    userLikedArtistService
      .getByUserIdAndArtistId(userId, artistId)
      .then((res) => {
        if(res.data.data !== null){
          setUserLikedArtist(res.data.data);
          setIsLiked(true);
        }
      })
      .catch((err) => {
        setIsLiked(false);
      });
  }, [artistId]);

  const likeArtist = () => {
    let userLikedArtistService = UserLikedArtistService.getInstance();
    var addRequest = {
      userId: userId,
      artistId: artistId,
    };
    userLikedArtistService.addUserLikedArtist(addRequest).then((res) => {
      setIsLiked(true);
      setUserLikedArtist(res.data.data);
    });
  };

  const unlikeArtist = () => {
    let userLikedArtistService = UserLikedArtistService.getInstance()
    userLikedArtistService.delete(userLikedArtist.userLikedArtistId).then((res)=>{
      console.log(res.data);
      setIsLiked(false)
    })
  };

  return (
    <main>
      {/* TOP */}
      <div className="relative flex items-end justify-start w-full h-[21.25rem] px-6 pb-6">
        <img
          className="opacity-50 w-full h-[21.25rem] absolute left-0 top-0 object-cover"
          src={artist.artistBackgroundImageUrl}
        />
        <div className="flex flex-col gap-y-5 z-50">
          <div className="flex flex-row gap-x-2 relative justify-start items-center">
            <div className="absolute left-1 top-1 bg-white z-0 rounded-full w-[1rem] h-[1rem]"></div>
            <span className="text-[#3d91f4] z-10">
              <Icon name="confirmed" />
            </span>

            <span className="text-sm font-semibold tracking-tight">
              Doğrulanmış Sanatçı
            </span>
          </div>
          <h1 className="text-8xl font-black tracking-tight">
            {artist.artistName}
          </h1>
          <span className="font-semibold tracking-tight">
            Aylık {Math.floor(Math.random() * 999)}.
            {Math.floor(Math.random() * 999)}.{Math.floor(Math.random() * 999)}{" "}
            dinleyici
          </span>
        </div>
      </div>
      <div
        className="w-full"
        style={{
          backgroundImage: `linear-gradient(
      180deg,
      ${color},
      #121212
  )`,
        }}
      >
        {/* MIDDLE */}
        <div className="flex flex-row items-center gap-x-4 h-24 px-8 py-4">
          <button
            //onClick={controls[state?.playing ? "pause" : "play"]}
            className="h-16 w-16 flex items-center justify-center bg-primary text-black rounded-full hover:scale-[1.06]"
          >
            {/* name={`${state?.playing ? "pause" : "play"}`} */}
            <Icon size={30} name="play" />
          </button>
          <div>
            {JSON.stringify(isLiked)}
            {isLiked ? (
              <button
                onClick={() => unlikeArtist()}
                className="w-[8.75rem] h-8 px-3 py-1 border border-white rounded-[0.25rem] text-sm font-semibold tracking-tight"
              >
                TAKİP EDİLİYOR
              </button>
            ) : (
              <button
                onClick={() => likeArtist()}
                className="w-20 h-8 px-3 py-1 border border-white rounded-[0.25rem] text-sm font-semibold tracking-tight"
              >
                TAKİP ET
              </button>
            )}
          </div>
        </div>
        {/* BOTTOM */}

        <div className="flex gap-x-4 items-start justify-between w-full h-auto p-4">
          <div className="flex flex-col w-[70%] gap-y-1">
            {albums.map((album) => (
              <div className="py-4">
                <span className="text-2xl font-bold tracking-tight pl-5">
                  {album.albumName}
                </span>
                <div className="flex flex-row w-full h-9 items-center justify-between pt-4">
                  <div className="w-[20%]">
                    <span className="flex items-center justify-start pl-6 text-sm font-semibold text-[#8e8e8e]">
                      #
                    </span>
                  </div>
                  <div className="w-[40%]">
                    <span className="flex justify-start text-sm font-semibold text-[#8e8e8e]">
                      Başlık
                    </span>
                  </div>
                  <div className="w-[40%]">
                    <span className="flex justify-start text-sm font-semibold text-[#8e8e8e]">
                      Dinlenme
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
                  {songs
                    .filter((song) => song.album.albumId === album.albumId)
                    .map((song, index) => (
                      <div
                        className="flex flex-row rounded items-center justify-between h-14 group hover:bg-[#2d2d2d]"
                        onContextMenu={(e) => {
                          handleContextMenu(e, song.songId);
                        }}
                      >
                        <div className="flex items-center w-[20%] relative">
                          <div className="pl-6 text-[#a7a7a7] font-semibold text-sm flex items-center justify-start">
                            {playing && isCurrentItem(song.songId) ? (
                              <img
                                src={playingGif}
                                className="absolute left-4 w-6 h-6 group-hover:hidden"
                              />
                            ) : (
                              <span className="group-hover:hidden">
                                {index + 1}
                              </span>
                            )}
                          </div>
                          <div className="absolute left-4 hidden items-center justify-start group-hover:flex">
                            <button onClick={() => updateCurrent(song)}>
                              <Icon
                                name={
                                  isCurrentItem(song.songId) ? "pause" : "play"
                                }
                                size={22}
                              />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center w-[40%]">
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
                                  showContextMenu &&
                                  clickedSongId === song.songId
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
                        </div>
                        <div className="flex items-center w-[40%]">
                          <span className="text-[#8e8e8e] text-sm font-semibold">
                            {Math.floor(Math.random() * 999)}.
                            {Math.floor(Math.random() * 999)}
                          </span>
                        </div>
                        <div className="flex items-center justify-center w-[30%] pr-4">
                          <div className="flex flex-row items-center justify-between gap-x-4">
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
            ))}
          </div>
          <div className="w-[30%]">
            <div className="flex flex-col gap-y-2">
              <h2 className="text-2xl font-bold">Sanatçının seçtikleri</h2>
              <div className="flex flex-row gap-x-3">
                <div className="w-20 h-20">
                  <img
                    className="w-20 h-20 object-cover"
                    src="https://images.pexels.com/photos/1778810/pexels-photo-1778810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  />
                </div>
                <div className="flex flex-col gap-y-1">
                  <div className="flex flex-row items-center justify-center gap-x-2">
                    {/* ARTIST BG IMAGE */}
                    <img
                      className="w-6 h-6 object-cover rounded-full"
                      src={artist.artistCoverImageUrl}
                    />
                    <span className="font-semibold text-sm text-[#8e8e8e]">
                      {artist.artistName} Tarafından Paylaşıldı
                    </span>
                  </div>
                  {/* <span className="font-bold mt-2">{albums[0].albumName}</span> */}
                  <span className="font-bold mt-2">Starry Night</span>
                  <span className="text-sm font-bold text-[#8e8e8e]">
                    {/* {songs.filter((song) => song.album.albumId === albums[0].albumId).length > 1 ? "Album" : "Single"} */}
                    Single
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
