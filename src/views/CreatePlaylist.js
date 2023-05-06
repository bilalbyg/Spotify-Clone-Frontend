import React, { useEffect, useState } from "react";
import { Icon } from "../Icons";
import PlaylistService from "../services/playlistService";
import CustomModal from "../components/CustomModal";
import "moment/locale/tr";
import { useSelector } from "react-redux";

export default function CreatePlaylist() {
  const userId = parseInt(localStorage.getItem("currentUser"));
  const [openModal, setOpenModal] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  const [thisPlaylist, setThisPlaylist] = useState([]);

  const createdPlaylist = useSelector((state) => state.createdPlaylist)

  useEffect(() => {
    let playlistService = new PlaylistService();
    playlistService.getPlaylists().then((result) => {
      setPlaylists(
        result.data.data.filter(
          (playlist) => playlist.playlistUserId === userId
        )
      );
    });
  }, [userId]);

  useEffect(() => {
    let playlistService = new PlaylistService();
    playlistService.getPlaylists().then((result) => {
      setPlaylists(
        result.data.data.filter(
          (playlist) => playlist.playlistUserId === userId
        )
      );
    });
  }, [playlists, playlists.length]);

  useEffect(() => {
    setThisPlaylist(createdPlaylist.createdPlaylist)
  }, [playlists.length])

  return (
    <main className="relative">
      <CustomModal
        openModal={openModal}
        onClose={() => setOpenModal(false)}
        data={playlists.length}
        playlist={thisPlaylist}
      />
      {/* TOP */}
      <div className="flex flex-row justify-end relative pb-6 px-8 bg-gradient-to-t from-[#272727] to-[#535353] min-h-[21.25rem] max-h-[31.25rem]">
        <div
          onClick={() => setOpenModal(true)}
          className="absolute left-6 bottom-6 w-56 h-56 bg-active rounded flex items-center justify-center text-[#7f7f7f]"
        >
          {thisPlaylist?.playlistCoverImageUrl ? <img src={`http://localhost:8080/api/playlist-cover-images/download/${thisPlaylist.playlistId}`}/> : <Icon name="music" size={70} className="" />}
        </div>
        <div className="flex flex-col h-80 w-[60rem] absolute pt-36 pl-7">
          <span className="font-semibold text-sm tracking-wide z-50 pl-1">
            Çalma Listesi
          </span>
          <span className="font-bold">
            <h1 className="text-8xl font-bold tracking-tight">
              {playlists.length}. Çalma Listem
            </h1>
          </span>
          <div className="flex items-center pt-4 px-3">
            <div className="flex items-center">
              <span className="tracking-tight font-semibold">
                {localStorage.getItem("userMail")}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* BOTTOM */}
      <div className="flex justify-center w-full h-auto p-4 bg-gradient-to-b from-[#272727] to-[#121212]">
        {/* <Table className="w-full">
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
            <Table.Row className="h-14 group hover:bg-[#2d2d2d]">
              <Table.Cell className="w-40">
                <div className="text-[#a7a7a7] font-semibold text-sm flex items-center justify-center">
                  {isPlaying ? (
                    <img
                      src={playingGif}
                      className="w-6 h-6 group-hover:hidden"
                    />
                  ) : (
                    <span className="group-hover:hidden">{index++}</span>
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
                    src="https://images.pexels.com/photos/14621208/pexels-photo-14621208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  />
                  <div className="flex flex-col justify-start font-semibold">
                    <span className="text-white tracking-tight hover:underline">
                      asdasdasd
                    </span>
                    <span className="text-[#a7a7a7] text-sm hover:underline hover:text-white hover:cursor-pointer">
                      asdasdasd
                    </span>
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell className="w-40 text-[#a7a7a7] tracking-tighter font-semibold hover:underline hover:text-white text-sm">
                asdasdasd
              </Table.Cell>
              <Table.Cell className="w-40 text-[#a7a7a7] font-semibold text-sm">
                <span>6 Şub 2022</span>
              </Table.Cell>
              <Table.Cell className="w-40 pr-4">
                <div className="flex flex-row items-center justify-between">
                  <button className="visible text-primary">
                    <Icon name="like" size={16} />
                  </button>
                  <span className="text-[#a7a7a7] font-semibold text-sm flex items-center justify-center">
                    asdasdas
                  </span>
                  <button className="invisible group-hover:visible">
                    <Icon name="dots" size={20} />
                  </button>
                </div>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table> */}
      </div>
      <hr className="h-px my-8 bg-[#2a2a2a] border-0" />
    </main>
  );
}
