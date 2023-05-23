import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import UserLikedAlbumService from "../services/userLikedAlbumService";
import UserLikedArtistService from "../services/userLikedArtistService";
import UserLikedSongService from "../services/userLikedSongService";
import UserLikedPodcastService from "../services/userLikedPodcastService";
import AlbumService from "../services/albumService";
import ArtistService from "../services/artistService";
import EpisodeService from "../services/episodeService";
import PodcastService from "../services/podcastService";
import PlaylistService from "../services/playlistService";
import SongService from "../services/songService";

export default function Library() {
  const [toggleState, setToggleState] = useState(1);
  const [albums, setAlbums] = useState([]);
  const [userLikedAlbums, setUserLikedAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [userLikedArtists, setUserLikedArtists] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [userLikedPodcasts, setUserLikedPodcasts] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [userLikedSongs, setUserLikedSongs] = useState([]);

  let userId = parseInt(localStorage.getItem("currentUser"));

  const updateToggle = (id) => {
    setToggleState(id);
  };

  const getUserLikedAlbums = () => {
    let userLikedAlbumService = UserLikedAlbumService.getInstance();
    userLikedAlbumService.getUserLikedAlbums().then((result) => {
      setUserLikedAlbums(
        result.data.data.filter(
          (userLikedAlbum) => userLikedAlbum.userId === userId
        )
      );
    });

    let albumIds = [];

    userLikedAlbums.map((userLikedAlbum) => {
      albumIds.push(userLikedAlbum.albumId);
    });

    let albumQueryString = JSON.stringify(albumIds);
    let toSendAlbumQueryString = albumQueryString.substring(
      1,
      albumQueryString.length - 1
    );
    let albumService = AlbumService.getInstance();
    albumService.getAlbumsById(toSendAlbumQueryString).then((result) => {
      setAlbums(result.data.data);
    });
  };

  const getUserLikedArtists = () => {
    let userLikedArtistService = UserLikedArtistService.getInstance();
    userLikedArtistService.getUserLikedArtists().then((result) => {
      setUserLikedArtists(
        result.data.data.filter(
          (userLikedArtist) => userLikedArtist.userId === userId
        )
      );
    });

    let artistIds = [];

    userLikedArtists.map((userLikedArtist) => {
      artistIds.push(userLikedArtist.artistId);
    });

    let artistQueryString = JSON.stringify(artistIds);
    let toSendArtistQueryString = artistQueryString.substring(
      1,
      artistQueryString.length - 1
    );
    let artistService = ArtistService.getInstance();
    artistService.getArtistsById(toSendArtistQueryString).then((result) => {
      setArtists(result.data.data);
    });
  };

  const getUserLikedPodcasts = () => {
    let userLikedPodcastService = UserLikedPodcastService.getInstance();
    userLikedPodcastService.getUserLikedPodcasts().then((result) => {
      setUserLikedPodcasts(
        result.data.data.filter(
          (userLikedPodcast) => userLikedPodcast.userId === userId
        )
      );
    });

    let podcastIds = [];

    userLikedPodcasts.map((userLikedPodcast) => {
      podcastIds.push(userLikedPodcast.podcastId);
    });

    let podcastQueryString = JSON.stringify(podcastIds);
    let toSendPodcastQueryString = podcastQueryString.substring(
      1,
      podcastQueryString.length - 1
    );
    let podcastService = PodcastService.getInstance();
    podcastService.getPodcastsById(toSendPodcastQueryString).then((result) => {
      setPodcasts(result.data.data);
    });
  };

  const getUserPlaylists = () => {
    let playlistService = PlaylistService.getInstance();
    playlistService.getByPlaylistUserId(userId).then((res) => {
      setPlaylists(res.data.data);
    });
  };

  const getUserLikedSongs = () => {
    let userLikedSongService = UserLikedSongService.getInstance();
    userLikedSongService.getByUserId(userId).then((result) => {
      setUserLikedSongs(result.data.data);
    });

    let songIds = [];

    userLikedSongs.map((userLikedSong) => {
      songIds.push(userLikedSong.songId);
    });

    let songQueryString = JSON.stringify(songIds);
    let toSendSongQueryString = songQueryString.substring(
      1,
      songQueryString.length - 1
    );
    let songService = SongService.getInstance();
    songService.getSongsById(toSendSongQueryString).then((result) => {
      setSongs(result.data.data);
    });
  };

  useEffect(() => {
    getUserLikedAlbums();
    getUserLikedArtists();
    getUserPlaylists();
    getUserLikedSongs();
    getUserLikedPodcasts();
  });

  return (
    <div className="">
      <div className="">
        <ul className="flex flex-row items-center justify-center gap-x-3">
          <li onClick={() => updateToggle(1)}>
            <a
              className={`text-white px-4 py-2 rounded-md flex items-center justify-center ${
                toggleState === 1 ? "bg-podcast" : "bg-transparent"
              } cursor-pointer text-sm font-semibold`}
            >
              Çalma Listeleri
            </a>
          </li>
          <li onClick={() => updateToggle(2)}>
            <a
              className={`text-white px-4 py-2 rounded-md flex items-center justify-center ${
                toggleState === 2 ? "bg-podcast" : "bg-transparent"
              } cursor-pointer text-sm font-semibold`}
            >
              Podcastler
            </a>
          </li>
          <li onClick={() => updateToggle(3)}>
            <a
              className={`text-white px-4 py-2 rounded-md flex items-center justify-center ${
                toggleState === 3 ? "bg-podcast" : "bg-transparent"
              } cursor-pointer text-sm font-semibold`}
            >
              Sanatçılar
            </a>
          </li>
          <li onClick={() => updateToggle(4)}>
            <a
              className={`text-white px-4 py-2 rounded-md flex items-center justify-center ${
                toggleState === 4 ? "bg-podcast" : "bg-transparent"
              } cursor-pointer text-sm font-semibold`}
            >
              Albümler
            </a>
          </li>
        </ul>
        <div className={toggleState === 1 ? "flex" : "hidden"}>
          <div className="w-full">
            <div className="text-white font-bold text-2xl my-5">
              Çalma Listeleri
            </div>
            <div className="flex flex-row w-full flex-wrap gap-5 items-start justify-start">
              <NavLink to={"/liked-songs"}>
                <div className="flex flex-col gap-y-3 pt-14 items-start justify-center p-4 w-[24.4rem] h-[16rem] rounded-md bg-gradient-to-br from-[#450af5] to-[#8e8ee5]">
                  <p className="text-link text-sm font-semibold line-clamp-3">
                    {songs.map((song) => (
                      <span>
                        {song.songName}
                        <span className="h-1 w-1 mb-1 mx-2 bg-link rounded-full inline-block" />
                        {song.album.artist.artistName} /
                      </span>
                    ))}
                  </p>
                  <div className="text-[2rem] mt-4 text-white font-bold tracking-tight">
                    Beğenilen Şarkılar
                  </div>
                  <div className="text-white tracking-tight font-semibold">
                    {songs.length} Beğenilen Şarkılar
                  </div>
                </div>
              </NavLink>

              {playlists.map((playlist) => (
                <NavLink to={`/playlist/${playlist.playlistId}`}>
                  <div className="flex flex-col w-[11.6rem] h-[16rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                    <img
                      className="flex items-center justify-center p-1 rounded-lg"
                      src={`${
                        playlist.playlistCoverImageUrl
                          ? playlist.playlistCoverImageUrl
                          : "https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      }`}
                    />
                    <NavLink to={`/playlist/${playlist.playlistId}`}>
                      <div className="text-white font-bold tracking-tight mt-3">
                        {playlist.playlistName}
                      </div>
                    </NavLink>
                    <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                      {playlist.playlistSongs.length} şarkı
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>

            <hr className="h-px bg-podcastHover border-0 my-16" />
          </div>
        </div>
        <div className={toggleState === 2 ? "flex" : "hidden"}>
          <div className="w-full">
            <div className="text-white font-bold text-2xl my-5">Podcastler</div>
            <div className="flex flex-row flex-wrap gap-5 items-start justify-start">
              <NavLink to="/episodes">
                <div className="flex flex-col gap-y-3 pt-14 items-start justify-center p-4 w-[24.4rem] h-[16rem] rounded-md bg-[#13745c]">
                  <p className="text-link text-sm font-semibold line-clamp-3">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Maecenas fringilla neque in dignissim euismod. Suspendisse
                    tincidunt purus id sem viverra fringilla. Ut consectetur non
                    magna ut aliquam. Duis commodo mi at nunc laoreet, quis
                    vestibulum velit tristique. Aliquam gravida tortor nec
                    condimentum fermentum.
                  </p>
                  <div className="text-[2rem] mt-4 text-white font-bold tracking-tight">
                    Bölümlerin
                  </div>
                  <div className="text-white tracking-tight font-semibold">
                    2 Bölüm
                    {/* {episodes?.length} Bölüm */}
                  </div>
                </div>
              </NavLink>

              {podcasts.map((podcast) => (
                <NavLink to={`/podcast-detail/${podcast.podcastId}`}>
                  <div className="flex flex-col w-[11.6rem] h-[16rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                    <img
                      className="flex items-center justify-center p-1 rounded-lg"
                      src={podcast.podcastCoverImageUrl}
                    />
                    <NavLink to={`/podcast-detail/${podcast.podcastId}`}>
                      <div className="hover:underline hover:cursor-pointer text-white font-bold tracking-tight mt-3 line-clamp-1">
                        {podcast.podcastName}
                      </div>
                    </NavLink>
                    <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                      {podcast.podcastPublisher}
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>
            <hr className="h-px bg-podcastHover border-0 my-16" />
          </div>
        </div>
        <div className={toggleState === 3 ? "flex" : "hidden"}>
          <div className="w-full">
            <div className="text-white font-bold text-2xl my-5">Sanatçılar</div>
            <div className="flex flex-row w-full flex-wrap gap-5 items-start justify-start">
              {artists.map((artist) => (
                <NavLink to={`/artist-detail/${artist.artistId}`}>
                  <div className="flex flex-col w-[11.6rem] h-[16rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                    <img
                      className="flex items-center w-[9.1rem] h-[9.1rem] justify-center p-1 rounded-full object-cover"
                      src={artist.artistCoverImageUrl}
                    />
                    <NavLink to={`/artist-detail/${artist.artistId}`}>
                      <div className="hover:underline hover:cursor-pointer text-white font-bold tracking-tight mt-3">
                        {artist.artistName}
                      </div>
                    </NavLink>

                    <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                      Sanatçı
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>

            <hr className="h-px bg-podcastHover border-0 my-16" />
          </div>
        </div>
        <div className={toggleState === 4 ? "flex" : "hidden"}>
          <div className="w-full">
            <div className="text-white font-bold text-2xl my-5">Albümler</div>
            <div className="flex flex-row w-full flex-wrap gap-5 items-start justify-start">
              {albums.map((album) => (
                <NavLink to={`/album-detail/${album.albumId}`}>
                  <div className="flex flex-col w-[11.6rem] h-[16rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                    <img
                      className="flex items-center justify-center p-1 rounded-lg"
                      src={album.albumCoverImageUrl}
                    />
                    <NavLink to={`/album-detail/${album.albumId}`}>
                      <div className="hover:underline hover:cursor-pointer text-white font-bold tracking-tight mt-3 line-clamp-1">
                        {album.albumName}
                      </div>
                    </NavLink>

                    <NavLink to={`/artist-detail/${album.artist.artistId}`}>
                      <div className="hover:underline hover:cursor-pointer text-link font-semibold text-sm line-clamp-2 mt-2">
                        {album.artist.artistName}
                      </div>
                    </NavLink>
                  </div>
                </NavLink>
              ))}
            </div>

            <hr className="h-px bg-podcastHover border-0 my-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
