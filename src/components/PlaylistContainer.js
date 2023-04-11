import React from 'react'
import { Icon } from "../Icons";
import { Table } from "semantic-ui-react";
import PlaylistItem from "../components/PlaylistItem";

export default function PlaylistContainer() {
  return (
    <div className="">
    {/* TOP */}
    <div className="flex flex-row justify-end relative pb-6 px-8 bg-gradient-to-t from-[#272727] to-[#575757] min-h-[21.25rem] max-h-[31.25rem]">
      <div className="absolute left-6 bottom-6 w-56 h-56">
        <img src="https://i.scdn.co/image/ab67706c0000da8425ae529c9d18be148d963250" />
      </div>
      <div className="flex flex-col h-80 w-[60rem] absolute pt-36 pl-7">
        <span className="font-semibold text-sm tracking-wide z-50 pl-1">
          Çalma Listesi
        </span>
        <span className="text-8xl font-bold tracking-tighter">
          <h1>Bummood</h1>
        </span>
        <div className="flex flex-row items-center gap-x-2 pt-4">
          <div className="flex flex-row gap-x-2 items-center">
            <div className="h-6 w-6 rounded-full">
              <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" />
            </div>
            <span className="tracking-tight font-semibold">username</span>
          </div>
          <span className="h-1 w-1 bg-white rounded-full inline-block" />
          <span className="text-sm font-semibold">1 beğenme</span>
          <span className="h-1 w-1 bg-white rounded-full inline-block" />
          <span className="text-sm font-semibold">57 şarkı, </span>
          <span className="text-white opacity-70">yaklaşık 3sa. 15dk.</span>
        </div>
      </div>
    </div>

    {/* MIDDLE */}
    <div className="bg-[#222222] flex flex-row items-center gap-x-2 h-24 px-8 py-4">
      <button
        //onClick={controls[state?.playing ? "pause" : "play"]}
        className="h-16 w-16 flex items-center justify-center bg-primary text-black rounded-full hover:scale-[1.06]"
      >
        {/* name={`${state?.playing ? "pause" : "play"}`} */}
        <Icon size={30} name="play" />
      </button>
      <button className="h-16 w-16 flex items-center justify-center text-primary hover:text-opacity-100">
        <Icon size={30} name="like" />
      </button>
      <button className="text-[#ffffff99]">
        <Icon name="dots" size={34} />
      </button>
    </div>

    <PlaylistItem/>
    <hr className="h-px my-8 bg-[#2a2a2a] border-0" />
  </div>
  )
}
