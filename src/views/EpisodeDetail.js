import React, { useState, useEffect } from "react";
import { Icon } from "../Icons";
import { useParams } from "react-router-dom";
import EpisodeService from "../services/episodeService";
import moment from "moment";
import "moment/locale/tr";
import { NavLink } from "react-router-dom";

export default function EpisodeDetail() {
  const [episode, setEpisode] = useState([]);
  const { episodeId } = useParams();

  useEffect(() => {
    console.log(episodeId);
    let episodeService = EpisodeService.getInstance();
    episodeService.getEpisodeById(episodeId).then((res) => {
      setEpisode(res.data.data);
    });
  }, []);

  return (
    <main className="">
      {/* TOP */}
      <div className="flex flex-row justify-end relative pb-6 px-8 bg-gradient-to-t from-[#272727] to-[#056952] min-h-[21.25rem] max-h-[31.25rem]">
        <div className="absolute left-6 bottom-6 w-56 h-56 bg-[#056952] flex items-center justify-center rounded-lg">
          <img
            className="rounded-xl shadow-2xl"
            src={episode?.podcast?.podcastCoverImageUrl}
          />
        </div>
        <div className="flex flex-col h-80 w-[60rem] absolute pt-48 pl-7">
          <span className="font-semibold text-sm text-[#b3b3b3] tracking-wide z-50 p-1">
            Podcast Bölümü
          </span>
          <span className="pt-2 text-5xl font-black tracking-tight">
            <h1>{episode?.episodeName}</h1>
          </span>
          <div className="flex flex-row items-center pt-3">
            <div className="flex flex-row gap-x-2 items-center">
              <NavLink to={`/podcast-detail/${episode?.podcast?.podcastId}`}>
                <span className="tracking-tight font-bold text-2xl hover:underline cursor-pointer">
                  {episode?.podcast?.podcastName}
                </span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      {/* MIDDLE */}
      <div className="bg-[#272727] flex flex-col items-start justify-center h-[8.875rem] px-8 py-4 gap-y-4">
        <div className="flex flex-row">
          <span className="flex flex-row items-center gap-x-2 justify-center text-link text-sm font-semibold tracking-tight">
            <span>
              {moment(episode?.episodeReleaseDate)
                .locale("tr")
                .format("DD MMM")}
            </span>
            <span className="h-1 w-1 bg-link rounded-full inline-block" />
            <span>
              {episode?.episodeDuration?.toString().split(".")[0]} dk.
              {episode?.episodeDuration?.toString().split(".")[1]} sn
            </span>
          </span>
        </div>
        <div className="flex flex-row items-center gap-x-6">
          <button className="h-16 w-16 flex items-center justify-center bg-primary text-black rounded-full hover:scale-[1.06]">
            <Icon size={30} name="play" />
          </button>
          <button className="h-8 w-8 flex items-center justify-center text-primary rounded-full hover:scale-[1.06]">
            <Icon size={30} name="tick" />
          </button>
          <button className="flex items-center justify-center text-link hover:text-white">
            <Icon size={30} name="dots" />
          </button>
        </div>
      </div>
      {/* BOTTOM */}
      <div className="bg-gradient-to-b from-[#272727] to-[#000]">
        <div className="px-8 py-4 w-[56.25rem] h-auto">
          <h2 className="font-bold text-2xl">Bölüm Açıklaması</h2>
          <div className="mt-8 py-4 w-[42rem]">
            <p className="text-link tracking-tight font-semibold">
              {episode.episodeDescription}
              {episode.episodeDescription}
              {episode.episodeDescription}
              {episode.episodeDescription}
              {episode.episodeDescription}
            </p>
          </div>
          <NavLink to={`/podcast-detail/${episode?.podcast?.podcastId}`}>
            <button className="mt-8 rounded-3xl font-semibold bg-black border border-white px-4 py-2 hover:scale-[1.06] hover:border-2">
              Bölümlerin tümünü gör
            </button>
          </NavLink>
        </div>
      </div>
    </main>
  );
}
