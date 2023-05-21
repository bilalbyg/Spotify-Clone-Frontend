import React from "react";
import Title from "../Title";
import { useSelector } from "react-redux";
import ArtistSectionItem from "./ArtistSectionItem";

export default function ArtistSection({ title, more = false, items }) {
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
              : filterItem.artistName
                  .toLowerCase()
                  .includes(searchStringState.searchString)
          })
          .slice(0,12).map((item) => (
            <ArtistSectionItem item={item} key={item.artistId} />
          ))}
      </div>
    </section>
  );
}

