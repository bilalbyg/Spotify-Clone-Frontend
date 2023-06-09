import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Icon } from "../Icons";
import { setCurrent } from "../stores/player";

export default function SongItem({ item }) {
  const dispatch = useDispatch();

  const { current, playing, controls } = useSelector((state) => state.player);

  const updateCurrent = () => {
    if (current.songId === item.songId) {
      if (playing) {
        controls.pause();
      } else {
        controls.play();
      }
    } else {
      dispatch(setCurrent(item));
    }
  };

  const isCurrentItem = current?.songId === item.songId && playing;

  return (
    <NavLink
      key={item.songId}
      to="/home"
      className={"bg-footer p-4 rounded hover:bg-active group"}
    >
      <div className="pt-[100%] relative mb-3">
        <img
          src={item.album.albumCoverImageUrl}
          className="w-full absolute object-cover inset-0 h-full"
        />
        <button
          onClick={updateCurrent}
          className={`text-white w-10 h-10 rounded-full bg-primary absolute bottom-2 right-2 items-center justify-center ${
            !isCurrentItem ? "hidden" : "flex"
          } group-hover:flex group-focus:flex`}
        >
          <Icon name={isCurrentItem ? "pause" : "play"} size={22} />
        </button>
      </div>
      <NavLink to="/album-detail" className="text-white overflow-hidden overflow-ellipsis whitespace-nowrap font-semibold hover:underline">
        {item.songName}
      </NavLink>
      <NavLink to="/artist-detail" className="hover:underline line-clamp-2 text-[rgb(167,167,167)] text-sm mt-1 font-semibold">
        {item.album.artist.artistName}
      </NavLink>
    </NavLink>
  );
}
