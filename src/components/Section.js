import React from "react";
import { NavLink } from "react-router-dom";
import SongItem from "./SongItem";
import Title from "./Title";
import { useSelector } from "react-redux";

export default function Section({ title, more = false, items }) {
  const searchStringState = useSelector((state) => state.searchString);

  return (
    <section>
      {JSON.stringify(searchStringState)}
      {searchStringState.searchString.toString()}
      <Title title={title} more={more} />
      <div className="grid grid-cols-6 gap-x-6 gap-y-6">
        {items
          .filter((filterItem) => {
            return searchStringState.searchString.toString().toLowerCase() ===
              ""
              ? filterItem
              : filterItem.songName
                  .toLowerCase()
                  .includes(searchStringState.searchString) ||
                searchStringState.searchString.toString().toLowerCase() === ""
              ? filterItem
              : filterItem.album.artist.artistName
                  .toLowerCase()
                  .includes(searchStringState.searchString) ||
                searchStringState.searchString.toString().toLowerCase() === ""
              ? filterItem
              : filterItem.album.albumName
                  .toLowerCase()
                  .includes(searchStringState.searchString);
          })
          .map((item) => (
            <SongItem item={item} key={item.songId} />
          ))}
      </div>
      {/* <div className="grid grid-cols-6 gap-x-6 gap-y-6">
        {items.map((item) => (
          <SongItem item={item} key={item.songId}/>
        ))}
      </div> */}
    </section>
  );
}
