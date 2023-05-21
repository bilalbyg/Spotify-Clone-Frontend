import React from "react";
import { NavLink } from "react-router-dom";

export default function AlbumSectionItem({ item }) {

  return (
    <NavLink
      to="/home"
      className={"bg-footer p-4 rounded hover:bg-active group"}
    >
      <div className="pt-[100%] relative mb-3">
        <img
          src={item.albumCoverImageUrl}
          className="w-full absolute object-cover inset-0 h-full"
        />
      </div>
      <NavLink to={`/album-detail/${item.albumId}`} className="text-white overflow-hidden overflow-ellipsis line-clamp-1 font-semibold hover:underline">
        {item.albumName}
      </NavLink>
      <NavLink to={`/artist-detail/${item?.artist?.artistId}`} className="hover:underline line-clamp-2 text-[rgb(167,167,167)] text-sm mt-1 font-semibold">
        {item.artist?.artistName}
      </NavLink>
    </NavLink>
  );
}
