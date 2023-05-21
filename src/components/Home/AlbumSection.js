import React from "react";
import Title from "../Title";
import { useSelector } from "react-redux";
import AlbumSectionItem from "./AlbumSectionItem";

export default function AlbumSection({ title, more = false, items }) {
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
              : filterItem.albumName
                  .toLowerCase()
                  .includes(searchStringState.searchString) ||
                searchStringState.searchString.toString().toLowerCase() === ""
              ? filterItem
              : filterItem.artist.artistName
                  .toLowerCase()
                  .includes(searchStringState.searchString)
          })
          .slice(0,12).map((item) => ( 
            <AlbumSectionItem item={item} key={item.albumId} />
          ))}
      </div>
    </section>
  );
}

