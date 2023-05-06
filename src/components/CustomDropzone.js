import React, { useCallback, useState, useEffect } from "react";
import { Icon } from "../Icons";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import PlaylistService from "../services/playlistService";
import PlaylistCoverImageService from "../services/playlistCoverImageService";

export default function CustomDropzone({ playlistId }) {
  const [hasCoverImage, setHasCoverImage] = useState(false);

  useEffect(() => {
    console.log(playlistId);
    let playlistService = new PlaylistService();
    playlistService.getPlaylistById(playlistId).then((res) => {
      let playlist = res.data.data;
      if (
        playlist.playlistCoverImageUrl !== "" ||
        playlist.playlistCoverImageUrl !== null
      ) {
        setHasCoverImage(false);
      } else {
        setHasCoverImage(true);
      }
    });
  }, [playlistId]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    console.log(file);
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(
        `http://localhost:8080/api/playlist-cover-images/upload/${parseInt(playlistId)}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data ",
          },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div {...getRootProps()} className="w-44 h-44">
      <input {...getInputProps()} />
      {/* {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )} */}
      <div className="group outline-none cursor-pointer">
        {hasCoverImage ? (
          <div className="w-44 h-44">
            <img
              className="min-w-full min-h-full object-cover w-44 h-44"
              src={`http://localhost:8080/api/playlist-cover-images/download/431`}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-44 h-44">
            <div className="flex group-hover:hidden outline-none">
              <Icon name="music" size={70} />
            </div>
            <div className="hidden group-hover:flex flex-col justify-center items-center text-white font-semibold gap-y-2 outline-none">
              <Icon name="edit" size={60} />
              <span>Fotoğraf seç</span>
            </div>
          </div>
        )}
        {/* <div className="w-44 h-44">
              <img className="min-w-full min-h-full object-cover w-44 h-44"
                src={`http://localhost:8080/api/playlist-cover-images/download/${playlistId}`}
              />
            </div> */}

        {/* <div>
              <div className="flex group-hover:hidden outline-none">
                <Icon name="music" size={70} />
              </div>
              <div className="hidden group-hover:flex flex-col justify-center items-center text-white font-semibold gap-y-2 outline-none">
                <Icon name="edit" size={60} />
                <span>Fotoğraf seç</span>
              </div>
            </div> */}
      </div>
    </div>
  );
}
