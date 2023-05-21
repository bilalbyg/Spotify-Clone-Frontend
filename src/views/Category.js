import React, { useState, useEffect } from "react";
import SongService from "../services/songService";
import CategoryService from "../services/categoryService";
import { Icon } from "../Icons";
import { NavLink, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setCurrent } from "../stores/player";


export default function Category() {
  const [songs, setSongs] = useState([]);
  const [category, setCategory] = useState([]);
  const { categoryId } = useParams();

  const dispatch = useDispatch();

  const { current, playing, controls } = useSelector((state) => state.player);

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

  useEffect(() => {
    let songService = SongService.getInstance();
    songService.getSongsByCategoryId(categoryId).then((res) => {
      setSongs(res.data.data);
    });

    let categoryService = CategoryService.getInstance();
    categoryService.getByCategoryId(categoryId).then((res) => {
      setCategory(res.data.data);
    });
  }, []);

  return (
    <div className="w-full flex flex-col items-start justify-start gap-y-4">
      <div className="flex items-center justify-start">
        <h1 className="text-8xl font-bold">{category.categoryName}</h1>
      </div>
      <div className="flex flex-col items-start gap-y-6 justify-start mt-10">
        <span className="font-bold text-2xl">Yeni Çıkanlar</span>
        <div className="grid grid-cols-6 gap-x-6 gap-y-6">
          {songs.slice(0, 6).map((song) => (
            <div className="">
              <div className="w-[11.563rem] bg-footer p-4 rounded hover:bg-active group">
                <div className="pt-[100%] relative mb-3">
                  <img
                    src={song.album.albumCoverImageUrl}
                    className="w-full absolute object-cover inset-0 h-full"
                  />
                  <button
                    onClick={() => updateCurrent(song)}
                    className={`text-white w-10 h-10 rounded-full bg-primary absolute bottom-2 right-2 items-center justify-center ${
                      !isCurrentItem ? "hidden" : "flex"
                    } group-hover:flex group-focus:flex`}
                  >
                    <Icon name={isCurrentItem(song.songId) ? "pause" : "play"} size={22} />
                  </button>
                </div>
                <span className="text-white overflow-hidden overflow-ellipsis line-clamp-1 font-semibold">
                  {song.songName}
                </span>
                <NavLink
                  to={`/artist-detail/${song?.album?.artist?.artistId}`}
                  className="hover:underline line-clamp-2 text-[rgb(167,167,167)] text-sm mt-1 font-semibold"
                >
                  {song.album?.artist?.artistName}
                </NavLink>
              </div>
            </div>
          ))}
        </div>
        <span className="font-bold text-2xl">Popüler</span>
        <div className="grid grid-cols-6 gap-x-6 gap-y-6">
          {songs.slice(6, 12).map((song) => (
            <div className="">
              <div className="w-[11.563rem] bg-footer p-4 rounded hover:bg-active group">
                <div className="pt-[100%] relative mb-3">
                  <img
                    src={song.album.albumCoverImageUrl}
                    className="w-full absolute object-cover inset-0 h-full"
                  />
                  <button
                    onClick={() => updateCurrent(song)}
                    className={`text-white w-10 h-10 rounded-full bg-primary absolute bottom-2 right-2 items-center justify-center ${
                      !isCurrentItem ? "hidden" : "flex"
                    } group-hover:flex group-focus:flex`}
                  >
                    <Icon name={isCurrentItem(song.songId) ? "pause" : "play"} size={22} />
                  </button>
                </div>
                <span className="text-white overflow-hidden overflow-ellipsis line-clamp-1 font-semibold">
                  {song.songName}
                </span>
                <NavLink
                  to={`/artist-detail/${song?.album?.artist?.artistId}`}
                  className="hover:underline line-clamp-2 text-[rgb(167,167,167)] text-sm mt-1 font-semibold"
                >
                  {song.album?.artist?.artistName}
                </NavLink>
              </div>
            </div>
          ))}
        </div>
        <span className="font-bold text-2xl">En Çok Dinlenenler</span>
        <div className="grid grid-cols-6 gap-x-6 gap-y-6">
          {songs.slice(11, 17).map((song) => (
            <div className="">
              <div className="w-[11.563rem] bg-footer p-4 rounded hover:bg-active group">
                <div className="pt-[100%] relative mb-3">
                  <img
                    src={song.album.albumCoverImageUrl}
                    className="w-full absolute object-cover inset-0 h-full"
                  />
                  <button
                    onClick={() => updateCurrent(song)}
                    className={`text-white w-10 h-10 rounded-full bg-primary absolute bottom-2 right-2 items-center justify-center ${
                      !isCurrentItem ? "hidden" : "flex"
                    } group-hover:flex group-focus:flex`}
                  >
                    <Icon name={isCurrentItem(song.songId) ? "pause" : "play"} size={22} />
                  </button>
                </div>
                <span className="text-white overflow-hidden overflow-ellipsis line-clamp-1 font-semibold">
                  {song.songName}
                </span>
                <NavLink
                  to={`/artist-detail/${song?.album?.artist?.artistId}`}
                  className="hover:underline line-clamp-2 text-[rgb(167,167,167)] text-sm mt-1 font-semibold"
                >
                  {song.album?.artist?.artistName}
                </NavLink>
              </div>
            </div>
          ))}
        </div>
        <span className="font-bold text-2xl">Klasikler</span>
        <div className="grid grid-cols-6 gap-x-6 gap-y-6">
          {songs.slice(5, 11).map((song) => (
            <div className="">
              <div className="w-[11.563rem] bg-footer p-4 rounded hover:bg-active group">
                <div className="pt-[100%] relative mb-3">
                  <img
                    src={song.album.albumCoverImageUrl}
                    className="w-full absolute object-cover inset-0 h-full"
                  />
                  <button
                    onClick={() => updateCurrent(song)}
                    className={`text-white w-10 h-10 rounded-full bg-primary absolute bottom-2 right-2 items-center justify-center ${
                      !isCurrentItem ? "hidden" : "flex"
                    } group-hover:flex group-focus:flex`}
                  >
                    <Icon name={isCurrentItem(song.songId) ? "pause" : "play"} size={22} />
                  </button>
                </div>
                <span className="text-white overflow-hidden overflow-ellipsis line-clamp-1 font-semibold">
                  {song.songName}
                </span>
                <NavLink
                  to={`/artist-detail/${song?.album?.artist?.artistId}`}
                  className="hover:underline line-clamp-2 text-[rgb(167,167,167)] text-sm mt-1 font-semibold"
                >
                  {song.album?.artist?.artistName}
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
