import React, { useState, useEffect } from "react";
import PodcastService from "../services/podcastService";
import { NavLink } from "react-router-dom";


export default function Podcasts() {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    let podcastService = PodcastService.getInstance();
    podcastService.getPodcasts().then((res) => {
      setPodcasts(res.data.data);
    });
  }, []);

  return (
    <div className="w-full flex flex-col items-start justify-start gap-y-4">
      <div className="flex items-center justify-start">
        <h1 className="text-8xl font-bold">Podcastler</h1>
      </div>
      <div className="flex flex-col items-start gap-y-6 justify-start mt-10">
        <span className="font-bold text-2xl">Yeni Çıkanlar</span>
        <div className="grid grid-cols-6 gap-x-6 gap-y-6">
          {podcasts.slice(0, 6).map((podcast) => (
            <div className="">
              <div className="w-[11.563rem] bg-footer p-4 rounded hover:bg-active group">
                <div className="pt-[100%] relative mb-3">
                  <img
                    src={podcast.podcastCoverImageUrl}
                    className="w-full absolute object-cover inset-0 h-full"
                  />
                </div>
                <NavLink to={`/podcast-detail/${podcast.podcastId}`}>
                  <span className="hover:underline text-white overflow-hidden overflow-ellipsis line-clamp-1 font-semibold">
                    {podcast.podcastName}
                  </span>
                </NavLink>
                <span className="line-clamp-1 text-[rgb(167,167,167)] text-sm mt-1 font-semibold">
                  {podcast.podcastPublisher}
                </span>
              </div>
            </div>
          ))}
        </div>
        <span className="font-bold text-2xl">Popüler</span>
        <div className="grid grid-cols-6 gap-x-6 gap-y-6">
          {podcasts.slice(6, 12).map((podcast) => (
            <div className="">
              <div className="w-[11.563rem] bg-footer p-4 rounded hover:bg-active group">
                <div className="pt-[100%] relative mb-3">
                  <img
                    src={podcast.podcastCoverImageUrl}
                    className="w-full absolute object-cover inset-0 h-full"
                  />
                </div>
                <NavLink to={`/podcast-detail/${podcast.podcastId}`}>
                  <span className="hover:underline text-white overflow-hidden overflow-ellipsis line-clamp-1 font-semibold">
                    {podcast.podcastName}
                  </span>
                </NavLink>
                <span className="line-clamp-1 text-[rgb(167,167,167)] text-sm mt-1 font-semibold">
                  {podcast.podcastPublisher}
                </span>
              </div>
            </div>
          ))}
        </div>
        <span className="font-bold text-2xl">En Çok Dinlenenler</span>
        <div className="grid grid-cols-6 gap-x-6 gap-y-6">
          {podcasts.slice(4, 10).map((podcast) => (
            <div className="">
              <div className="w-[11.563rem] bg-footer p-4 rounded hover:bg-active group">
                <div className="pt-[100%] relative mb-3">
                  <img
                    src={podcast.podcastCoverImageUrl}
                    className="w-full absolute object-cover inset-0 h-full"
                  />
                </div>
                <NavLink to={`/podcast-detail/${podcast.podcastId}`}>
                  <span className="hover:underline text-white overflow-hidden overflow-ellipsis line-clamp-1 font-semibold">
                    {podcast.podcastName}
                  </span>
                </NavLink>
                <span className="line-clamp-1 text-[rgb(167,167,167)] text-sm mt-1 font-semibold">
                  {podcast.podcastPublisher}
                </span>
              </div>
            </div>
          ))}
        </div>
        <span className="font-bold text-2xl">Klasikler</span>
        <div className="grid grid-cols-6 gap-x-6 gap-y-6">
          {podcasts.slice(5, 11).map((podcast) => (
            <div className="">
              <div className="w-[11.563rem] bg-footer p-4 rounded hover:bg-active group">
                <div className="pt-[100%] relative mb-3">
                  <img
                    src={podcast.podcastCoverImageUrl}
                    className="w-full absolute object-cover inset-0 h-full"
                  />
                </div>
                <NavLink to={`/podcast-detail/${podcast.podcastId}`}>
                  <span className="hover:underline text-white overflow-hidden overflow-ellipsis line-clamp-1 font-semibold">
                    {podcast.podcastName}
                  </span>
                </NavLink>

                <span className="line-clamp-1 text-[rgb(167,167,167)] text-sm mt-1 font-semibold">
                  {podcast.podcastPublisher}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
