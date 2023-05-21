import React, { useEffect, useState } from "react";
import { Icon } from "../Icons";
import { NavLink, useParams } from "react-router-dom";
import PodcastService from "../services/podcastService";
import EpisodeService from "../services/episodeService";
import UserLikedPodcastService from "../services/userLikedPodcastService";
import UserEpisodeService from "../services/userEpisodeService";
import moment from "moment";
import "moment/locale/tr";
import Episode from "../components/Episode";
import HighlightedEpisode from "../components/HighlightedEpisode";

export default function PodcastDetail() {
  const [collapse, setCollapse] = useState(false);
  const [episodes, setEpisodes] = useState([]);
  const [podcast, setPodcast] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [userLikedPodcast, setUserLikedPodcast] = useState([]);
  const [userEpisodes, setUserEpisodes] = useState([]);

  const { podcastId } = useParams();

  let userId = parseInt(localStorage.getItem("currentUser"));

  useEffect(() => {});

  useEffect(() => {
    let podcastService = PodcastService.getInstance();
    podcastService.getByPodcastId(podcastId).then((res) => {
      setPodcast(res.data.data);
    });

    let episodeService = EpisodeService.getInstance();
    episodeService
      .getByPodcastId(podcastId)
      .then((result) => setEpisodes(result.data.data));

    let userLikedPodcastService = UserLikedPodcastService.getInstance();

    userLikedPodcastService
      .getByUserIdAndPodcastId(userId, podcastId)
      .then((res) => {
        if (res.data.data !== null) {
          setUserLikedPodcast(res.data.data);
          setIsLiked(true);
        }
      })
      .catch((err) => {
        setIsLiked(false);
      });
  }, []);

  useEffect(() => {
    let podcastService = PodcastService.getInstance();
    podcastService.getByPodcastId(podcastId).then((res) => {
      setPodcast(res.data.data);
    });

    let episodeService = EpisodeService.getInstance();
    episodeService
      .getByPodcastId(podcastId)
      .then((result) => setEpisodes(result.data.data));

    let userLikedPodcastService = UserLikedPodcastService.getInstance();

    userLikedPodcastService
      .getByUserIdAndPodcastId(userId, podcastId)
      .then((res) => {
        if (res.data.data !== null) {
          setUserLikedPodcast(res.data.data);
          setIsLiked(true);
        }
      })
      .catch((err) => {
        setIsLiked(false);
      });
  }, [podcastId]);

  const likePodcast = () => {
    let userLikedPodcastService = UserLikedPodcastService.getInstance();
    var addRequest = {
      userId: userId,
      podcastId: podcastId,
    };
    userLikedPodcastService.addUserLikedPodcast(addRequest).then((res) => {
      setIsLiked(true);
      setUserLikedPodcast(res.data.data);
      console.log(userLikedPodcast);
      console.log(isLiked);
    });
  };

  const unlikePodcast = () => {
    let userLikedPodcastService = UserLikedPodcastService.getInstance();
    userLikedPodcastService
      .delete(userLikedPodcast.userLikedPodcastId)
      .then((res) => {
        setIsLiked(false);
      });
  };

  return (
    <main className="">
      {/* TOP */}
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
          {isLiked ? (
            <button
              onClick={() => unlikePodcast()}
              className="px-4 py-2 uppercase rounded-sm text-sm tracking-wider font-bold text-link bg-transparent border border-link hover:border-white hover:cursor-pointer"
            >
              TAKİP EDİLİYOR
            </button>
          ) : (
            <button
              onClick={() => likePodcast()}
              className="px-4 py-2 uppercase rounded-sm text-sm tracking-wider font-bold text-link bg-transparent border border-link hover:border-white hover:cursor-pointer"
            >
              TAKİP ET
            </button>
          )}

          <button className="text-link">
            <Icon name="dots" size={32} />
          </button>
        </div>
        {/* BOTTOM */}
        <div className="bg-gradient-to-b from-[#272727] to-[#000] py-6 px-6">
          <div className="flex flex-row gap-x-8">
            <div className="w-[41.438rem] flex flex-col gap-y-6">
              <div>
                {/* <div className="flex flex-col gap-y-4 bg-podcastHover hover:bg-podcast w-auto h-52 p-5 rounded-md group">
                  <span className="text-link text-sm font-semibold">
                    Sıradaki
                  </span>
                  <div className="text-white font-semibold hover:underline hover:cursor-pointer">
                    <NavLink to={`/episode-detail/${episodes[0]?.episodeId}`}>
                      {episodes[0]?.episodeName}
                    </NavLink>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-link line-clamp-2">
                      {episodes[0]?.episodeDescription}
                    </span>
                  </div>
                  <div className="flex flex-row items-center justify-between py-2">
                    <div className="flex flex-row items-center gap-x-4">
                      <button className="rounded-full w-8 h-8 bg-primary flex items-center justify-center">
                        <Icon name="play" />
                      </button>
                      <div className="flex flex-row gap-x-1 items-center justify-center text-sm text-[#b3b3b3] font-semibold tracking-tight">
                        <span>
                          {moment(episodes[0]?.episodeReleaseDate)
                            .locale("tr")
                            .format("DD MMM")}
                        </span>
                        <span className="h-1 w-1 bg-white rounded-full inline-block" />
                        <span>
                          {
                            episodes[0]?.episodeDuration
                              ?.toString()
                              .split(".")[0]
                          }
                          dk.
                          {
                            episodes[0]?.episodeDuration
                              ?.toString()
                              .split(".")[1]
                          }
                          sn
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-row gap-x-4">
                      {UserEpisodeService.getInstance()
                        .getByUserId(userId)
                        .then((res) => {
                          res.data.data.filter(
                            (userEpisode) =>
                              userEpisode.episodeId === episodes[0].episodeId
                          );
                        }) ? (
                        <div className="flex items-center justify-center rounded-full border-2 border-[#8e8e8e] w-6 h-6">
                          <span className="text-[#8e8e8e]">
                            <Icon name="plus" size={16} />
                          </span>
                        </div>
                      ) : (
                        <span className="text-primary">
                          <Icon name="tick" />
                        </span>
                      )}

                      <span className="invisible group-hover:visible">
                        <Icon name="dots" />
                      </span>
                    </div>
                  </div>
                </div> */}
                <HighlightedEpisode  episode={episodes[0]}/>
              </div>
              <div className="text-2xl font-bold text-white">
                <h3>Tüm Bölümler</h3>
              </div>

              <div>
                {episodes.map((episode) => (
                  <Episode episode={episode} />
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
    </main>
  );
}
