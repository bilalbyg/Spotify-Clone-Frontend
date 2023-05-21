import React from "react";
import { NavLink } from "react-router-dom";

export default function PodcastSectionItem({ item }) {

  return (
    <NavLink
      to="/home"
      className={"bg-footer p-4 rounded hover:bg-active group"}
    >
      <div className="pt-[100%] relative mb-3">
        <img
          src={item.podcastCoverImageUrl}
          className="w-full absolute object-cover inset-0 h-full"
        />
      </div>
      <NavLink to={`/podcast-detail/${item.podcastId}`} className="text-white overflow-hidden overflow-ellipsis whitespace-nowrap font-semibold hover:underline">
        {item.podcastName}
      </NavLink>
      <span className="hover:underline line-clamp-1 text-[rgb(167,167,167)] text-sm mt-1 font-semibold">
        {item.podcastPublisher}
      </span>
    </NavLink>
  );
}
