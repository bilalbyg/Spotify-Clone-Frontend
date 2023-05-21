import React from "react";
import { NavLink } from "react-router-dom";

export default function ArtistSectionItem({ item }) {

  return (
    <NavLink
    //   key={}
      to="/home"
      className={"bg-footer p-4 rounded hover:bg-active group"}
    >
      <div className="pt-[100%] relative mb-3">
        <img
          src={item.artistCoverImageUrl}
          className="w-[9.563rem] h-[9.563rem] absolute object-cover inset-0 rounded-full"
        />
      </div>
      <NavLink to={`/artist-detail/${item.artistId}`} className="text-white overflow-hidden overflow-ellipsis whitespace-nowrap font-semibold hover:underline">
        {item.artistName}
      </NavLink>
      <span className="hover:underline line-clamp-1 text-[rgb(167,167,167)] text-sm mt-1 font-semibold">
        Sanatçı
      </span>
    </NavLink>
  );
}
