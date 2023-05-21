import React, { useState, useEffect } from "react";
import SongService from "../services/songService";
import ArtistService from "../services/artistService";
import AlbumService from "../services/albumService";
import PodcastService from "../services/podcastService"
import ArtistSection from "../components/Home/ArtistSection";
import AlbumSection from "../components/Home/AlbumSection";
import PodcastSection from "../components/Home/PodcastSection";
import SongSection from "../components/Home/SongSection";

function Home() {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [podcasts, setPodcasts] = useState([])

  useEffect(() => {
    let songService = SongService.getInstance();
    songService.getSongs().then((res) => {
      setSongs(res.data.data);
    });

    let artistService = ArtistService.getInstance();
    artistService.getArtists().then((res) => {
      setArtists(res.data.data);
    });

    let albumService = AlbumService.getInstance();
    albumService.getAlbums().then((res) => {
      setAlbums(res.data.data)
    })

    let podcastService = PodcastService.getInstance();
    podcastService.getPodcasts().then((res) => {
      setPodcasts(res.data.data)
    })
  }, []);

  return (
    <div className="grid gap-y-8">
      <SongSection title="Sizin için önerilen şarkılar" items={songs} />
      <ArtistSection title="Sizin için önerilen sanatçılar" items={artists} />
      <AlbumSection title="Sizin için önerilen albümler" items={albums} />
      <PodcastSection title="Sizin için önerilen podcastler" items={podcasts} />
    </div>
  );
}

export default Home;

