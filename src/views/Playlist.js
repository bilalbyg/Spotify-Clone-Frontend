import React, { useState, useEffect } from "react";
import { Icon } from "../Icons";
import { Table } from "semantic-ui-react";
import { useSelector } from "react-redux";
import SongService from "../services/songService";

export default function Playlist() {

  const playlist = useSelector(state => state.playlist)

  const [songs, setSongs] = useState([])
  
  let index = 1;

  useEffect(() => {
    let songService = new SongService();
    console.log("asdas");
    let queryString = JSON.stringify(playlist?.playlist?.playlistSongs)
    let toSendQueryString = queryString?.substring(1, queryString.length - 1)
    songService.getSongsById(toSendQueryString).then((result) => {
      console.log(result.data.data);
      setSongs(result.data.data)
    })
  }, [])

  useEffect(() => {
    let songService = new SongService();
    let queryString = JSON.stringify(playlist?.playlist?.playlistSongs)
    let toSendQueryString = queryString?.substring(1, queryString.length - 1)
    songService.getSongsById(toSendQueryString).then((result) => {
      setSongs(result.data.data)
    })
  }, [playlist])

  return (

    // remove fragment, add "?" to after playlists

    <>
      { (
        <div>
          {playlist?.playlist?.playlistId}
          {/* TOP */}
          <div className="flex flex-row justify-end relative pb-6 px-8 bg-gradient-to-t from-[#272727] to-[#575757] min-h-[21.25rem] max-h-[31.25rem]">
            <div className="absolute left-6 bottom-6 w-56 h-56">
              <img src={playlist?.playlist?.playlistCoverImageUrl} />
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
                  <span className="tracking-tight font-semibold">{localStorage.getItem("userMail")}</span>
                </div>
                <span className="h-1 w-1 bg-white rounded-full inline-block" />
                <span className="text-sm font-semibold">1 beğenme</span>
                <span className="h-1 w-1 bg-white rounded-full inline-block" />
                <span className="text-sm font-semibold">{playlist?.playlist?.playlistSongs?.length} şarkı, </span>
                <span className="text-white opacity-70">
                  yaklaşık 3sa. 15dk.
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
            <button className="h-16 w-16 flex items-center justify-center text-primary hover:text-opacity-100">
              <Icon size={30} name="like" />
            </button>
            <button className="text-[#ffffff99]">
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
                        <span>{index++}</span>
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
                        <button className="invisible group-hover:visible">
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
      )}
    </>
  );
}
