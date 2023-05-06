import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import PlaylistService from "../services/playlistService";
import { Icon } from "../Icons";
import axios from "axios";

export default function PlaylistDropzone({ playlistId }) {
  const [hasCoverImage, setHasCoverImage] = useState(false);
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    let playlistService = new PlaylistService();
    playlistService.getPlaylistById(playlistId).then((res) => {
      console.log(res.data.data);
      setPlaylist(res.data.data);

      if (playlist.playlistCoverImageUrl !== null) {
        if (
          playlist.playlistCoverImageUrl !== "" ||
          playlist.playlistCoverImageUrl !== ""
        ) {
          setHasCoverImage(true);
        } else {
          setHasCoverImage(false);
        }
      }
    });
  }, [playlistId]);

  useEffect(() => {
    
  }, [playlist])

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    console.log(file);
    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(
        `http://localhost:8080/api/playlists/uploadImage/${playlistId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data ",
            Authorization: localStorage.getItem("tokenKey"),
          },
        }
      )
      .then((res) => {
        setPlaylist(res.data.data);
      });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="cursor-pointer outline-none">
      <input {...getInputProps()} />
      {hasCoverImage ? (
        <div className="flex items-center justify-center w-56 h-56 group relative">
          <img
            className="w-56 h-56 object-cover flex group-hover:opacity-50 group-hover:blur-sm"
            src={playlist.playlistCoverImageUrl}
          />
          <div className="hidden group-hover:block absolute top-22 left-22">
            <div className="flex flex-col items-center justify-center">
              <Icon name="edit" size={60} />
              <span>Fotoğraf Değiştir</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center group w-56 h-56 text-[#7f7f7f]">
          <div className="flex group-hover:hidden outline-none">
            <Icon name="music" size={70} />
          </div>
          <div className="hidden group-hover:flex flex-col justify-center items-center text-white font-semibold gap-y-2 outline-none">
            <Icon name="edit" size={60} />
            <span>Fotoğraf seç</span>
          </div>
        </div>
      )}
      {/* {
          isDragActive ?
            <p>Drop the files here ... </p> :
            <p>Drag 'n' drop some files here, or click to select files {playlistId}{JSON.stringify(hasCoverImage)}</p>
        } */}
    </div>
  );
}
