import React from "react";
import Title from "../Title";
import { useSelector } from "react-redux";
import SongSectionItem from "./SongSectionItem";

export default function SongSection({ title, more = false, items }) {
  const searchStringState = useSelector((state) => state.searchString);

  return (
    <section>
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
              : filterItem.album.albumName
                  .toLowerCase()
                  .includes(searchStringState.searchString) ||
                  searchStringState.searchString.toString().toLowerCase() === ""
                ? filterItem
                : filterItem.album.artist.artistName
                    .toLowerCase()
                    .includes(searchStringState.searchString)
          })
          .slice(0,12).map((item) => (
            <SongSectionItem item={item} key={item.songId} />
          ))}
      </div>
    </section>
  );
}

