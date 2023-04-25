import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "../Icons";

export default function Library() {
  const [toggleState, setToggleState] = useState(1);

  const updateToggle = (id) => {
    setToggleState(id);
  };

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
          <div className="">
            <div className="text-white font-bold text-2xl my-5">
              Çalma Listeleri
            </div>
            <div className="flex flex-row flex-wrap gap-5 items-start justify-start">
              <div className="flex flex-col gap-y-3 pt-14 items-start justify-center p-4 w-[24.4rem] h-[18rem] rounded-md bg-gradient-to-br from-[#450af5] to-[#8e8ee5]">
                <p className="text-link text-sm font-semibold line-clamp-3">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Maecenas fringilla neque in dignissim euismod. Suspendisse
                  tincidunt purus id sem viverra fringilla. Ut consectetur non
                  magna ut aliquam. Duis commodo mi at nunc laoreet, quis
                  vestibulum velit tristique. Aliquam gravida tortor nec
                  condimentum fermentum.
                </p>
                <div className="text-[2rem] mt-4 text-white font-bold tracking-tight">
                  Beğenilen Şarkılar
                </div>
                <div className="text-white tracking-tight font-semibold">
                  3 Beğenilen Şarkılar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-y-5 gap-x-5 mt-5">
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
            </div>
            <hr className="h-px bg-podcastHover border-0 my-16" />
          </div>
        </div>
        <div className={toggleState === 2 ? "flex" : "hidden"}>
          <div className="">
            <div className="text-white font-bold text-2xl my-5">Podcastler</div>
            <div className="flex flex-row flex-wrap gap-5 items-start justify-start">
              <div className="flex flex-col gap-y-3 pt-14 items-start justify-center p-4 w-[24.4rem] h-[18rem] rounded-md bg-[#13745c]">
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
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-y-5 gap-x-5 mt-5">
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
            </div>
            <hr className="h-px bg-podcastHover border-0 my-16" />
          </div>
        </div>
        <div className={toggleState === 3 ? "flex" : "hidden"}>
          <div className="">
            <div className="text-white font-bold text-2xl my-5">Sanatçılar</div>
            <div className="flex flex-row flex-wrap gap-5 items-start justify-start">
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
            </div>

            <hr className="h-px bg-podcastHover border-0 my-16" />
          </div>
        </div>
        <div className={toggleState === 4 ? "flex" : "hidden"}>
          <div className="">
            <div className="text-white font-bold text-2xl my-5">Albümler</div>
            <div className="flex flex-row flex-wrap gap-5 items-start justify-start">
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
              <div className="flex flex-col w-[11.6rem] h-[18rem] bg-[#181818] hover:bg-podcastHover cursor-pointer rounded-lg p-4">
                <img
                  className="flex items-center justify-center p-1 rounded-lg"
                  src="https://images.pexels.com/photos/2733337/pexels-photo-2733337.jpeg?auto=compress&cs=tinysrgb&w=600"
                />
                <div className="text-white font-bold tracking-tight mt-3">
                  Üçüncü Yeniler
                </div>
                <div className="text-link font-semibold text-sm line-clamp-2 mt-2">
                  Türk müziğinde yeni akımlar Türk müziğinde yeni akımlar
                </div>
              </div>
            </div>

            <hr className="h-px bg-podcastHover border-0 my-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
