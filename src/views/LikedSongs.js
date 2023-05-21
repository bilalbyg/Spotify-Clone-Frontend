import React, { useEffect, useState } from "react";
import { Icon } from "../Icons";
import { Table } from "semantic-ui-react";
import playingGif from "../img/playing.gif";
import { Popup } from "semantic-ui-react";
import UserLikedSongService from "../services/userLikedSongService";
import SongService from "../services/songService";

export default function LikedSongs() {
  const userId = parseInt(localStorage.getItem("currentUser"));

  const [isPlaying, setIsPlaying] = useState(true);

  const [userLikedSongs, setUserLikedSongs] = useState([]);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    let userLikedSongService = new UserLikedSongService();
    userLikedSongService.getUserLikedSongs().then((result) => {
      setUserLikedSongs(
        result.data.data.filter(
          (userLikedSong) => userLikedSong.userId === userId
        )
      );
    });

    let songIds = [];

    userLikedSongs.map((userLikedSong) => {
      songIds.push(userLikedSong.songId);
    });

    let queryString = JSON.stringify(songIds);
    let toSendQueryString = queryString.substring(1, queryString.length - 1);

    let songService = new SongService();
    songService
      .getSongsById(toSendQueryString)
      .then((result) => setSongs(result.data.data));
  }, [userLikedSongs]);

  const unlikeSong = (songId) => {
    var songIdForDelete;
    let userId = parseInt(localStorage.getItem("currentUser"));
    let userLikedSongService = new UserLikedSongService();
    userLikedSongService
      .getByUserIdAndSongId(userId, songId)
      .then((res) => {
        songIdForDelete = res.data.data.userLikedSongId;
        userLikedSongService
          .delete(songIdForDelete)
      })
      .catch((err) => console.log(err));
  };

  return (
    <main>
      {/* TOP */}
      <div className="flex flex-row justify-end relative pb-6 px-8 bg-gradient-to-t from-[#2a1e51] to-[#5038a0] min-h-[21.25rem] max-h-[31.25rem]">
        <div className="absolute left-6 bottom-6 w-56 h-56 bg-gradient-to-br rounded from-[#3f12b8] to-[#7b9287] flex items-center justify-center text-white">
          <Icon name="like" size={70} />
        </div>
        <div className="flex flex-col h-80 w-[60rem] absolute pt-36 pl-7">
          <span className="font-semibold text-sm tracking-wide z-50 pl-1">
            Çalma Listesi
          </span>
          <span className="font-bold">
            <h1 className="text-8xl font-bold tracking-tight">
              Beğenilen Şarkılar
            </h1>
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
            <span className="text-sm font-semibold">{songs.length} şarkı</span>
          </div>
        </div>
      </div>
      {/* MIDDLE */}
      <div className="bg-gradient-to-b from-[#2a1e51] to-[#272727] flex flex-row items-center h-24 px-8 py-4">
        <button
          //onClick={controls[state?.playing ? "pause" : "play"]}
          className="h-16 w-16 flex items-center justify-center bg-primary text-black rounded-full hover:scale-[1.06]"
        >
          {/* name={`${state?.playing ? "pause" : "play"}`} */}
          <Icon size={30} name="play" />
        </button>
      </div>
      {/* BOTTOM */}
      <div className="flex justify-center w-full h-auto p-4 bg-gradient-to-b from-[#272727] to-[#121212]">
        <Table className="w-full">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className="w-[5%]">
                <span className="text-sm font-semibold text-[#8e8e8e]">#</span>
              </Table.HeaderCell>
              <Table.HeaderCell className="w-[40%]">
                <span className="flex justify-start text-sm font-semibold text-[#8e8e8e]">
                  Başlık
                </span>
              </Table.HeaderCell>
              <Table.HeaderCell className="w-[20%]">
                <span className="flex justify-start text-sm font-semibold text-[#8e8e8e]">
                  Albüm
                </span>
              </Table.HeaderCell>
              <Table.HeaderCell className="w-[20%]">
                <span className="flex justify-start text-sm font-semibold text-[#8e8e8e]">
                  Eklenme Tarihi
                </span>
              </Table.HeaderCell>
              <Table.HeaderCell className="w-[15%] pr-4">
                <button className="text-[#8e8e8e]">
                  <Icon name="time" size={16} />
                </button>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {songs.map((song, index) => (
              <Table.Row className="h-14 group hover:bg-[#2d2d2d]">
                <Table.Cell className="w-40">
                  <div className="text-[#a7a7a7] font-semibold text-sm flex items-center justify-center">
                    {isPlaying ? (
                      <img
                        src={playingGif}
                        className="w-6 h-6 group-hover:hidden"
                      />
                    ) : (
                      <span className="group-hover:hidden">{index+1}</span>
                    )}
                  </div>
                  <div className="hidden items-center justify-center group-hover:flex">
                    <button>
                      <Icon name="play" size={20} />
                    </button>
                  </div>
                </Table.Cell>
                <Table.Cell className="w-[200px]">
                  <div className="flex flex-row gap-x-3 items-center justify-start">
                    <img
                      className="w-10 h-10"
                      src={song.album.albumCoverImageUrl}
                    />
                    <div className="flex flex-col justify-start font-semibold">
                      <span className="text-white tracking-tight hover:underline">
                        {song.songName}
                      </span>
                      <span className="text-[#a7a7a7] text-sm hover:underline hover:text-white hover:cursor-pointer">
                        {song.album.artist.artistName}
                      </span>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell className="w-40 text-[#a7a7a7] tracking-tighter font-semibold hover:underline hover:text-white text-sm">
                  {song.album.albumName}
                </Table.Cell>
                <Table.Cell className="w-40 text-[#a7a7a7] font-semibold text-sm">
                  <span>6 Şub 2022</span>
                </Table.Cell>
                <Table.Cell className="w-40 pr-4">
                  <div className="flex flex-row items-center justify-between">
                    <Popup
                      content="Kitaplığın'dan kaldır"
                      position="bottom center"
                      className="bg-active px-2 py-1 text-white text-sm font-semibold rounded shadow-2xl"
                      trigger={
                        <button
                          onClick={() => {
                            unlikeSong(song.songId);
                          }}
                          className="visible text-primary"
                        >
                          <Icon name="like" size={16} />
                        </button>
                      }
                    />

                    <span className="text-[#a7a7a7] font-semibold text-sm flex items-center justify-center">
                      {song.duration}
                    </span>
                    <button className="invisible group-hover:visible">
                      <Icon name="dots" size={20} />
                    </button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      <hr className="h-px my-8 bg-[#2a2a2a] border-0" />
    </main>
  );
}
