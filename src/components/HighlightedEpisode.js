import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "../Icons";
import moment from "moment";
import "moment/locale/tr";
import UserEpisodeService from "../services/userEpisodeService";

export default function HighlightedEpisode({ episode }) {
  let userId = parseInt(localStorage.getItem("currentUser"));

  const [inLibrary, setInLibrary] = useState(false);

  useEffect(() => {
    let userEpisodeService = UserEpisodeService.getInstance();
    userEpisodeService
      .getByUserIdAndEpisodeId(userId, episode?.episodeId)
      .then((res) => {
        console.log(res.data.data);
        if (res.data.data !== null) {
          setInLibrary(true);
        }
      });

    userEpisodeService.getByUserId(userId).then((res) => {
        setUserEpisodes(res.data.data)
    })
  });

  const addToUserEpisodes = () => {
    let userEpisodeService = UserEpisodeService.getInstance();
    let addRequest = {
      userId: userId,
      episodeId: episode?.episodeId,
    };
    userEpisodeService
      .addUserEpisode(addRequest)
      .then((res) => {
        setInLibrary(true);
      })
      .catch((err) => {
        setInLibrary(false);
      });
  };

  const deleteFromUserEpisodes = () => {
    let userEpisodeService = UserEpisodeService.getInstance();
    userEpisodeService
      .getByUserIdAndEpisodeId(userId, episode?.episodeId)
      .then((res) => {
        userEpisodeService
          .delete(res.data.data.userEpisodeId)
          .then((res) => {
            setInLibrary(false);
          })
          .catch((err) => {
            setInLibrary(true);
          });
      });
  };

  return (
    <div className="flex flex-col gap-y-4 bg-podcastHover hover:bg-podcast w-auto h-52 p-5 rounded-md group">
      <span className="text-link text-sm font-semibold">Sıradaki</span>
      <div className="text-white font-semibold hover:underline hover:cursor-pointer">
        <NavLink to={`/episode-detail/${episode?.episodeId}`}>
          {episode?.episodeName}
        </NavLink>
      </div>
      <div>
        <span className="text-sm font-semibold text-link line-clamp-2">
          {episode?.episodeDescription}
        </span>
      </div>
      <div className="flex flex-row items-center justify-between py-2">
        <div className="flex flex-row items-center gap-x-4">
          <button className="rounded-full w-8 h-8 bg-primary flex items-center justify-center">
            <Icon name="play" />
          </button>
          <div className="flex flex-row gap-x-1 items-center justify-center text-sm text-[#b3b3b3] font-semibold tracking-tight">
            <span>
              {moment(episode?.episodeReleaseDate)
                .locale("tr")
                .format("DD MMM")}
            </span>
            <span className="h-1 w-1 bg-white rounded-full inline-block" />
            <span>
              {episode?.episodeDuration?.toString().split(".")[0]}
              dk.
              {episode?.episodeDuration?.toString().split(".")[1]}
              sn
            </span>
          </div>
        </div>
        <div className="flex flex-row gap-x-4">
          {/* {inLibrary ? (
            <div className="flex items-center justify-center rounded-full border-2 border-[#8e8e8e] w-6 h-6">
              <button onClick={() => deleteFromUserEpisodes()}>
                <span className="text-primary">
                  <Icon name="tick" />
                </span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-full border-2 border-[#8e8e8e] w-6 h-6">
              <button onClick={() => addToUserEpisodes()}>
                <span className="text-[#8e8e8e]">
                  <Icon name="plus" size={16} />
                </span>
              </button>
            </div>
          )} */}

          <span className="invisible group-hover:visible">
            <Icon name="dots" />
          </span>
        </div>
      </div>
    </div>
  );
}
