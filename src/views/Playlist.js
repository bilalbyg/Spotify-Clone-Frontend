import React, { useState, useEffect } from "react";
import { Icon } from "../Icons";
import { Table } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import SongService from "../services/songService";
import UserLikedSongService from "../services/userLikedSongService";
import playingGif from "../img/playing.gif";
import { setCurrent } from "../stores/player";
import moment from "moment";
import { secondsToTime } from "../utils";
import CustomDropzone from "../components/CustomDropzone";
import PlaylistDropzone from "../components/PlaylistDropzone";

export default function Playlist() {
  const playlist = useSelector((state) => state.playlist);

  const [songs, setSongs] = useState([]);

  const dispatch = useDispatch();

  const { current, playing, controls } = useSelector((state) => state.player);

  let userId = parseInt(localStorage.getItem("currentUser"));

  const updateCurrent = (song) => {
    if (current.songId === song.songId) {
      if (playing) {
        controls.pause();
      } else {
        controls.play();
      }
    } else {
      dispatch(setCurrent(song));
    }
  };

  useEffect(() => {
    console.log(playing);
  }, [playing]);

  const isCurrentItem = (songId) => {
    return current?.songId === songId && playing;
  };

  let index = 1;

  useEffect(() => {
    let songService = new SongService();
    let queryString = JSON.stringify(playlist?.playlist?.playlistSongs);
    let toSendQueryString = queryString?.substring(1, queryString.length - 1);
    songService.getSongsById(toSendQueryString).then((result) => {
      console.log(result.data.data);
      setSongs(result.data.data);
    });
  }, []);

  useEffect(() => {
    let songService = new SongService();
    let queryString = JSON.stringify(playlist?.playlist?.playlistSongs);
    let toSendQueryString = queryString?.substring(1, queryString.length - 1);
    songService.getSongsById(toSendQueryString).then((result) => {
      setSongs(result.data.data);
    });
  }, [playlist]);

  const likeSong = (songId) => {
    var request = {
      songId: songId,
      userId: userId,
    };
    let userLikedSongService = new UserLikedSongService();
    userLikedSongService
      .addUserLikedSong(request)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const playlistDuration = () => {
    let minute = 0;
    let second = 0;
    songs.map((song) => {
      console.log(song.songName);
      let duration = song.duration.toString().split(".");
      console.log(duration);
      minute = minute + parseInt(duration[0]);
      second = second + parseInt(duration[1]);
    });
    second = second + minute * 60;

    let duration = secondsToTime(second).split(":");
    console.log(duration);
    return duration;
  };

  useEffect(() => {
    playlistDuration();
  }, []);

  return (
    // remove fragment, add "?" to after playlists

    <>
      {
        <div>
          {/* TOP */}
          <div className="flex flex-row justify-end relative pb-6 px-8 bg-gradient-to-t from-[#272727] to-[#575757] min-h-[21.25rem] max-h-[31.25rem]">
            {/* {playlist.playlist.playlistCoverImageUrl !== "" ? (
              <div className="absolute left-6 bottom-6 w-56 h-56">
                <img src={playlist?.playlist?.playlistCoverImageUrl} />
              </div>
            ) : (
              <div className="group absolute left-6 bottom-6 w-56 h-56 bg-active rounded flex items-center justify-center text-[#7f7f7f]">
                <div className="block group-hover:hidden">
                  <Icon name="music" size={70} />
                </div>
                <div className="hidden group-hover:flex group-hover:cursor-pointer flex-col justify-center items-center text-white gap-y-2">
                  <Icon name="edit" size={50} />
                  <span className="font-semibold">Fotoğraf Seç</span>
                </div>
              </div>
            )} */}
            <div className="absolute left-6 bottom-6 bg-active w-56 h-56">
              <PlaylistDropzone playlistId={playlist.playlist.playlistId}/>
            </div>

            <div className="flex flex-col h-80 w-[60rem] absolute pt-36 pl-7">
              <span className="font-semibold text-sm tracking-wide z-50 pl-1">
                Çalma Listesi
              </span>
              <span className="text-8xl font-bold tracking-tighter">
                <h1>{playlist?.playlist?.playlistName}</h1>
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
                  {playlist?.playlist?.playlistSongs?.length} şarkı,
                </span>
                <span className="text-white opacity-70">
                  yaklaşık
                  {playlistDuration()[0] > 0 ? (
                    <span>{playlistDuration()[0]} sa.</span>
                  ) : (
                    ""
                  )}
                  {playlistDuration()[1] > 0 ? (
                    <span> {playlistDuration()[1]} dk.</span>
                  ) : (
                    ""
                  )}
                  {playlistDuration()[2] > 0 ? (
                    <span> {playlistDuration()[2]} sn.</span>
                  ) : (
                    ""
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* MIDDLE */}
          <div className="bg-[#222222] flex flex-row items-center gap-x-2 h-24 px-8 py-4">
            <button
              //onClick={controls[state?.playing ? "pause" : "play"]}
              className="h-16 w-16 flex items-center justify-center bg-primary text-black rounded-full hover:scale-[1.06]"
            >
              {/* name={`${state?.playing ? "pause" : "play"}`} */}
              <Icon size={30} name="play" />
            </button>
            {playlist.playlistUserId === userId && (
              <button className="h-16 w-16 flex items-center justify-center text-primary hover:text-opacity-100">
                <Icon size={30} name="like" />
              </button>
            )}
            <button className="text-link">
              <Icon name="dots" size={34} />
            </button>
          </div>

          <div className="flex justify-center w-full h-auto p-4">
            <Table className="w-full">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className="w-[5%]">
                    <span className="text-sm font-semibold text-[#8e8e8e]">
                      #
                    </span>
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
                {songs.map((song) => (
                  <Table.Row className="h-14 group hover:bg-[#2d2d2d]">
                    <Table.Cell className="w-40">
                      <div className="text-[#a7a7a7] font-semibold text-sm flex items-center justify-center">
                        {playing && isCurrentItem(song.songId) ? (
                          <img
                            src={playingGif}
                            className="w-6 h-6 group-hover:hidden"
                          />
                        ) : (
                          <span className="group-hover:hidden">{index++}</span>
                        )}
                      </div>
                      <div className="hidden items-center justify-center group-hover:flex">
                        <button onClick={() => updateCurrent(song)}>
                          <Icon
                            name={isCurrentItem(song.songId) ? "pause" : "play"}
                            size={22}
                          />
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
                          <span
                            className={`${
                              playing && isCurrentItem(song.songId)
                                ? "text-primary"
                                : "text-white "
                            } tracking-tight hover:underline`}
                          >
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
                        <button
                          onClick={() => likeSong(song.songId)}
                          className="invisible group-hover:visible"
                        >
                          <Icon name="like" size={16} />
                        </button>
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
        </div>
      }
    </>
  );
}
