import React, { useEffect, useState, useRef } from "react";
import PlaylistService from "../../services/playlistService";

export default function PlaylistsContextMenu({ playlistId, closeContextMenu }) {

  useEffect(() => {
    console.log(closeContextMenu);
  },[])

  const deletePlaylist = (playlistId) => {
    let playlistService = PlaylistService.getInstance();
    playlistService.delete(playlistId).then((res) => {
    });
  };

  return (
    <>
      <ul className="w-full">
        <li className="flex items-center justify-start h-10 hover:bg-podcast px-2 cursor-pointer">
          <button
            onClick={() => deletePlaylist(playlistId)}
          >
            <span>Çalma listesini sil</span>
          </button>
        </li>
      </ul>
    </>
  );
}
