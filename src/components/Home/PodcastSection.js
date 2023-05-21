import React from "react";
import Title from "../Title";
import { useSelector } from "react-redux";
import PodcastSectionItem from "./PodcastSectionItem";

export default function PodcastSection({ title, more = false, items }) {
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
              : filterItem.podcastName
                  .toLowerCase()
                  .includes(searchStringState.searchString) ||
                searchStringState.searchString.toString().toLowerCase() === ""
              ? filterItem
              : filterItem.podcastPublisher
                  .toLowerCase()
                  .includes(searchStringState.searchString)
          })
          .map((item) => ( 
            <PodcastSectionItem item={item} key={item.podcastId} />
          ))}
      </div>
    </section>
  );
}

