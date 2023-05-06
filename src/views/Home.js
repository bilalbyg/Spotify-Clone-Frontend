import React, { useState, useEffect } from "react";
import SongService from "../services/songService";
import Section from "../components/Section";
import { useSelector } from "react-redux";

function Home() {
  const items = [
    {
      songId: 1,
      name: "Gangstas",
      duration: 3.36,
      songUrl: "https://firebasestorage.googleapis.com/v0/b/spotifyclone-de1f8.appspot.com/o/Pop%20Smoke%20-%20Gangstas.mp3?alt=media&token=a0b51619-44cc-4dde-84a7-b68160b6030b",
      album: {
        albumId: 1,
        name: "Shoot For The Stars Aim For The Moon",
        releaseYear: "2020",
        coverImageUrl:
          "https://i.scdn.co/image/ab67616d0000b27346e1307c35579c3483ea7b03",
        artist: {
          artistId: 1,
          name: "Pop Smoke",
          artistImageUrl:
            "https://i.scdn.co/image/ab6761610000e5eb597f9edd2cd1a892d4412b09",
        },
      },
    },
    {
      songId: 2,
      name: "Hotel Lobby",
      duration: 2.31,
      songUrl: "https://cdn.freesound.org/previews/678/678494_6763499-lq.mp3",
      album: {
        albumId: 1,
        name: "Shoot For The Stars Aim For The Moon",
        releaseYear: "2020",
        coverImageUrl:
          "https://i.scdn.co/image/ab67616d0000b27346e1307c35579c3483ea7b03",
        artist: {
          artistId: 1,
          name: "Pop Smoke",
          artistImageUrl:
            "https://i.scdn.co/image/ab6761610000e5eb597f9edd2cd1a892d4412b09",
        },
      },
    },
    {
      songId: 3,
      name: "44 Bulldog",
      duration: 2.3,
      songUrl: "https://cdn.freesound.org/previews/678/678494_6763499-lq.mp3",
      album: {
        albumId: 1,
        name: "Shoot For The Stars Aim For The Moon",
        releaseYear: "2020",
        coverImageUrl:
          "https://i.scdn.co/image/ab67616d0000b27346e1307c35579c3483ea7b03",
        artist: {
          artistId: 1,
          name: "Pop Smoke",
          artistImageUrl:
            "https://i.scdn.co/image/ab6761610000e5eb597f9edd2cd1a892d4412b09",
        },
      },
    },
    {
      songId: 4,
      name: "For the Night",
      duration: 2.3,
      songUrl: "https://cdn.freesound.org/previews/678/678494_6763499-lq.mp3",
      album: {
        albumId: 1,
        name: "Shoot For The Stars Aim For The Moon",
        releaseYear: "2020",
        coverImageUrl:
          "https://i.scdn.co/image/ab67616d0000b27346e1307c35579c3483ea7b03",
        artist: {
          artistId: 1,
          name: "Pop Smoke",
          artistImageUrl:
            "https://i.scdn.co/image/ab6761610000e5eb597f9edd2cd1a892d4412b09",
        },
      },
    },
    {
      songId: 5,
      name: "West Coast Shit",
      duration: 2.3,
      songUrl: "https://cdn.freesound.org/previews/678/678494_6763499-lq.mp3",
      album: {
        albumId: 1,
        name: "Shoot For The Stars Aim For The Moon",
        releaseYear: "2020",
        coverImageUrl:
          "https://i.scdn.co/image/ab67616d0000b27346e1307c35579c3483ea7b03",
        artist: {
          artistId: 1,
          name: "Pop Smoke",
          artistImageUrl:
            "https://i.scdn.co/image/ab6761610000e5eb597f9edd2cd1a892d4412b09",
        },
      },
    },
  ];

  const [songs, setSongs] = useState([]);

  useEffect(() => {
    let songService = new SongService();
    songService.getSongs().then((result) => setSongs(result.data.data));
  }, []);

  const { current, playing, controls } = useSelector((state) => state.player);

  useEffect(() => {

  }, []);

  return (
    <div className="grid gap-y-8">
      

      <Section title="Recently played" more="/nothing" items={songs} />
      <Section title="Recently played" more="/purgatory" items={songs} />
      <Section title="Recently played" more="/tartaros" items={songs} />
    </div>
  );
}

export default Home;
