import React from "react";
import { Icon } from "../../Icons";

export default function Search() {
  return (
    <div className="mr-auto ml-4 h-10 relative">
      <label htmlFor="search-input" className="text-black w-12 h-10 flex items-center justify-center absolute top-0 left-0">
        <Icon name="search" />
      </label>
      <input
        type="text"
        id="search-input"
        className="pl-12 h-10 outline-none text-black bg-white rounded-3xl font-medium placeholder-black/50 text-sm max-w-full w-[22.75rem]"
        placeholder="Sanatçılar, şarkılar veya podcast'ler"
      />
    </div>
  );
}
