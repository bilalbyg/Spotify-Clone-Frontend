import React, { useEffect, useState } from "react";
import { Icon } from "../Icons";
import { NavLink } from "react-router-dom";
import PodcastService from "../services/podcastService";
import EpisodeService from "../services/episodeService";
import moment from 'moment';
import 'moment/locale/tr';

export default function PodcastDetail() {
  const [collapse, setCollapse] = useState(false);
  const [episodes, setEpisodes] = useState([]);
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    let episodeService = new EpisodeService();
    episodeService
      .getEpisodes()
      .then((result) => setEpisodes(result.data.data));

    let podcastService = new PodcastService();
    podcastService
      .getPodcasts()
      .then((result) => setPodcasts(result.data.data));

  }, []);

  return (
    <main className="">
      {/* TOP */}
      {podcasts.map((podcast) => (
        <div>
          <div className="flex flex-row justify-end relative pb-6 px-8 bg-gradient-to-t from-[#272727] to-[#056952] min-h-[21.25rem] max-h-[31.25rem]">
            <div className="absolute left-6 bottom-6 w-56 h-56 bg-[#056952] flex items-center justify-center rounded-lg">
              <img
                className="rounded-xl shadow-2xl"
                src={podcast.podcastCoverImageUrl}
              />
            </div>
            <div className="flex flex-col h-80 w-[60rem] absolute pt-36 pl-7">
              <span className="font-semibold text-sm text-[#b3b3b3] tracking-wide z-50 p-1">
                Podcast
              </span>
              <span className="pt-1 text-8xl font-black tracking-tight">
                <h1>{podcast.podcastName}</h1>
              </span>
              <div className="flex flex-row items-center pt-3">
                <div className="flex flex-row gap-x-2 items-center">
                  <span className="tracking-tight font-bold text-2xl">
                    {podcast.podcastPublisher}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* MIDDLE */}
          <div className="bg-[#272727] flex flex-row items-center justify-start h-[8.875rem] px-8 py-4 gap-x-6">
            <button className="px-4 py-2 uppercase rounded-sm text-sm tracking-wider font-bold text-link bg-transparent border border-link hover:border-white hover:cursor-default">
              TAKİP ET
            </button>
            <button className="text-link">
              <Icon name="dots" size={32} />
            </button>
          </div>
          {/* BOTTOM */}
          <div className="bg-gradient-to-b from-[#272727] to-[#000] py-6 px-6">
            <div className="flex flex-row gap-x-8">
              <div className="w-[41.438rem] flex flex-col gap-y-6">
                <div>
                  <div className="flex flex-col gap-y-4 bg-podcastHover hover:bg-podcast w-auto h-52 p-5 rounded-md group">
                    <span className="text-link text-sm font-semibold">
                      Sıradaki
                    </span>
                    <div className="text-white font-semibold hover:underline hover:cursor-pointer">
                      <NavLink to="/episode-detail">Yol açık, yola çık</NavLink>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-link line-clamp-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Mauris consequat sapien vitae enim dapibus, vitae
                        porttitor mi molestie. Quisque feugiat aliquam sapien.
                        Proin felis elit, vehicula quis nisl nec, posuere ornare
                        dui. Morbi mattis ligula in consequat sodales. Sed
                        tristique mattis tortor, dictum rutrum lorem vehicula
                        vitae. Nulla commodo rutrum metus, a mattis odio. Sed
                        est massa, facilisis eu blandit nec, ullamcorper vitae
                        urna.
                      </span>
                    </div>
                    <div className="flex flex-row items-center justify-between py-2">
                      <div className="flex flex-row items-center gap-x-4">
                        <button className="rounded-full w-8 h-8 bg-primary flex items-center justify-center">
                          <Icon name="play" />
                        </button>
                        <div className="flex flex-row gap-x-1 items-center justify-center text-sm text-[#b3b3b3] font-semibold tracking-tight">
                          {/* <span>{podcast.episodes.podcastReleaseDate}</span> */}
                          <span className="h-1 w-1 bg-white rounded-full inline-block" />
                          <span>19 dk. 57sn</span>
                        </div>
                      </div>
                      <div className="flex flex-row gap-x-4">
                        <span className="text-primary">
                          <Icon name="tick" />
                        </span>
                        <span className="invisible group-hover:visible">
                          <Icon name="dots" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white">
                  <h3>Tüm Bölümler</h3>
                </div>

                <div>
                  {episodes.map((episode) => (
                    <div>
                      <hr className="h-px bg-podcastHover border-0" />
                      <div className="flex flex-row gap-x-4 bg-transparent hover:bg-podcastHover w-auto h-52 p-5 rounded-md group">
                        <div className="w-28 h-28 min-w-[7rem]">
                          <img src={episode.podcast.podcastCoverImageUrl}></img>
                        </div>
                        <div>
                          <div className="text-white font-semibold hover:underline hover:cursor-pointer">
                            <NavLink to="/episode-detail">
                              {episode.episodeName}
                            </NavLink>
                          </div>
                          <div className="text-sm text-white font-semibold hover:underline hover:cursor-pointer">
                            <NavLink to="/podcast-detail">
                              {episode.podcast.podcastName}
                            </NavLink>
                          </div>
                          <div className="py-3 text-sm text-[#b3b3b3] font-semibold tracking-tight">
                            <p className="line-clamp-2">
                              {episode.episodeDescription}
                            </p>
                          </div>
                          <div className="flex flex-row items-center justify-between py-4">
                            <div className="flex flex-row items-center gap-x-4">
                              <button className="rounded-full w-8 h-8 bg-primary flex items-center justify-center">
                                <Icon name="play" />
                              </button>
                              <div className="flex flex-row gap-x-1 items-center justify-center text-sm text-[#b3b3b3] font-semibold tracking-tight">
                                <span>{moment(episode.episodeReleaseDate).locale('tr').format('DD MMM')}</span>
                                <span className="h-1 w-1 bg-white rounded-full inline-block" />
                                <span>{episode.episodeDuration.toString().split(".")[0]} dk. {episode.episodeDuration.toString().split(".")[1]} sn</span>
                              </div>
                            </div>
                            <div className="flex flex-row gap-x-4">
                              <span className="text-primary">
                                <Icon name="tick" />
                              </span>
                              <span className="invisible group-hover:visible">
                                <Icon name="dots" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-[30rem] flex flex-col">
                <h3 className="flex items-start justify-start text-2xl font-bold tracking-tight pb-4">
                  Hakkında
                </h3>
                <p className="text-link font-semibold">
                  {podcast.podcastAbout}
                  <span
                    className={`max-h-0 overflow-hidden inline-block ${
                      collapse ? " max-h-full pb-2" : ""
                    }`}
                  >
                    Nullam odio ipsum, auctor quis gravida ut, cursus non nibh.
                    Nullam scelerisque nisl fermentum venenatis porta. Morbi
                    iaculis a dui quis malesuada. Curabitur euismod bibendum
                    ipsum, quis viverra nisi elementum in. Proin tempus gravida
                    elit, vitae varius eros molestie at. Quisque lacinia enim
                    lorem, quis rutrum felis ullamcorper eu. Suspendisse laoreet
                    nunc urna, ac laoreet dolor accumsan ut.
                  </span>
                  <button onClick={() => setCollapse((prev) => !prev)}>
                    {collapse ? (
                      <span>daha az göster</span>
                    ) : (
                      <span>...daha fazla göster</span>
                    )}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}
