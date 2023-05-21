import React, { useEffect, useState } from "react";
import { Icon } from "../Icons";
import { NavLink } from "react-router-dom";
import UserEpisodeService from "../services/userEpisodeService";
import EpisodeService from "../services/episodeService";
import moment from "moment";
import "moment/locale/tr";
import { Popup } from "semantic-ui-react";

export default function Episodes() {
  const userId = parseInt(localStorage.getItem("currentUser"));

  const [userEpisodes, setUserEpisodes] = useState([]);
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    let userEpisodeService = new UserEpisodeService();
    userEpisodeService.getByUserId(userId).then((res) => {
      setUserEpisodes(res.data.data);
    });

    let episodeIds = [];

    userEpisodes.map((userEpisode) => {
      episodeIds.push(userEpisode.episodeId);
    });

    let queryString = JSON.stringify(episodeIds);
    let toSendQueryString = queryString.substring(1, queryString.length - 1);

    let episodeService = new EpisodeService();
    episodeService
      .getEpisodesById(toSendQueryString)
      .then((result) => setEpisodes(result.data.data));
  }, [episodes]);

  return (
    <main>
      {/* TOP */}
      <div className="flex flex-row justify-end relative pb-6 px-8 bg-gradient-to-t from-[#272727] to-[#056952] min-h-[21.25rem] max-h-[31.25rem]">
        <div className="absolute left-6 bottom-6 w-56 h-56 bg-[#056952] flex items-center justify-center text-[#1ed760]">
          <Icon name="podcast" size={50} />
        </div>
        <div className="flex flex-col h-80 w-[60rem] absolute pt-36 pl-7">
          <span className="font-semibold text-sm tracking-wide z-50 pl-1">
            Çalma Listesi
          </span>
          <span className="font-bold">
            <h1 className="text-8xl font-bold tracking-tight">Bölümlerin</h1>
          </span>
          <div className="flex flex-row items-center gap-x-2 pt-4">
            <div className="flex flex-row gap-x-2 items-center">
              <div className="h-6 w-6 rounded-full">
                <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" />
              </div>
              <span className="tracking-tight font-semibold">
                {localStorage.getItem("userMail")}
              </span>
            </div>
            <span className="h-1 w-1 bg-white rounded-full inline-block" />
            <span className="text-sm font-semibold">
              {episodes.length} bölüm
            </span>
          </div>
        </div>
      </div>
      {/* MIDDLE */}
      <div className="bg-[#272727] flex flex-row items-center h-24 px-8 py-4">
        <button
          //onClick={controls[state?.playing ? "pause" : "play"]}
          className="h-16 w-16 flex items-center justify-center bg-primary text-black rounded-full hover:scale-[1.06]"
        >
          {/* name={`${state?.playing ? "pause" : "play"}`} */}
          <Icon size={30} name="play" />
        </button>
      </div>
      {/* BOTTOM */}
      <div className="bg-[#272727]">
        <div className="px-8 py-2 w-[56.25rem] h-auto">
          {episodes.map((episode) => (
            <div>
              <hr className="h-px bg-podcastHover border-0" />
              <div className="flex flex-row gap-x-4 bg-transparent hover:bg-podcastHover w-auto h-52 p-5 rounded-md group">
                <div className="w-28 h-28 min-w-[7rem]">
                  <img src={episode.podcast.podcastCoverImageUrl} />
                </div>
                <div>
                  <div className="text-white font-semibold hover:underline hover:cursor-pointer">
                    <NavLink to={`/episode-detail/${episode.episodeId}`}>
                      {episode.episodeName}
                    </NavLink>
                  </div>
                  <div className="text-sm text-white font-semibold hover:underline hover:cursor-pointer">
                    <NavLink
                      to={`/podcast-detail/${episode.podcast.podcastId}`}
                    >
                      {episode.podcast.podcastName}
                    </NavLink>
                  </div>
                  <div className="py-3 text-sm text-[#b3b3b3] font-semibold tracking-tight">
                    <p className="line-clamp-2">{episode.episodeDescription}</p>
                  </div>
                  <div className="flex flex-row items-center justify-between py-4">
                    <div className="flex flex-row items-center gap-x-4">
                      <button className="rounded-full w-8 h-8 bg-primary flex items-center justify-center">
                        <Icon name="play" />
                      </button>
                      <div className="flex flex-row gap-x-1 items-center justify-center text-sm text-[#b3b3b3] font-semibold tracking-tight">
                        <span>
                          {moment(episode.episodeReleaseDate)
                            .locale("tr")
                            .format("DD MMM")}
                        </span>
                        <span className="h-1 w-1 bg-link rounded-full inline-block" />
                        <span>
                          {episode.episodeDuration.toString().split(".")[0]} dk.{" "}
                          {episode.episodeDuration.toString().split(".")[1]} sn
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-row gap-x-4">
                      <span className="text-primary">
                        <Icon name="tick" />
                      </span>
                      <Popup
                        className="text-sm bg-black px-2 py-1 font-semibold "
                        trigger={
                          <span className="invisible group-hover:visible">
                            <Icon name="dots" />
                          </span>
                        }
                        content="Diğer seçenekler"
                        basic
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
