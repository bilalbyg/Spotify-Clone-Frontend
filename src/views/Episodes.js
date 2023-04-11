import React from "react";
import { Icon } from "../Icons";
import { NavLink } from "react-router-dom";


export default function Episodes() {
  return (
    <main>
      {/* TOP */}
      <div className="flex flex-row justify-end relative pb-6 px-8 bg-gradient-to-t from-[#272727] to-[#056952] min-h-[21.25rem] max-h-[31.25rem]">
        <div className="absolute left-6 bottom-6 w-56 h-56 bg-[#056952] flex items-center justify-center text-[#1ed760]">
          <Icon name="podcast" size={50} />
        </div>
        <div className="flex flex-col h-80 w-[60rem] absolute pt-36 pl-7">
          <span className="font-semibold text-sm tracking-wide z-50 pl-1">
            Çalma Listesi
          </span>
          <span className="text-8xl font-bold tracking-tighter">
            <h1>Bölümlerin</h1>
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
            <span className="text-sm font-semibold">2 bölüm </span>
          </div>
        </div>
      </div>
      {/* MIDDLE */}
      <div className="bg-[#272727] flex flex-row items-center h-24 px-8 py-4">
        <button
          //onClick={controls[state?.playing ? "pause" : "play"]}
          className="h-16 w-16 flex items-center justify-center bg-primary text-black rounded-full hover:scale-[1.06]"
        >
          {/* name={`${state?.playing ? "pause" : "play"}`} */}
          <Icon size={30} name="play" />
        </button>
      </div>
      {/* BOTTOM */}
      <div className="bg-[#272727]">
        <div className="px-8 py-2 w-[56.25rem] h-auto">
          <div>
            <hr className="h-px bg-podcastHover border-0" />
            <div className="flex flex-row gap-x-4 bg-transparent hover:bg-podcastHover w-auto h-52 p-5 rounded-md group">
              <div className="w-28 h-28 min-w-[7rem]">
                <img src="https://freight.cargo.site/t/original/i/a7e95331ab34c475b9aa4322a2846a59f8976db2f5d25b51cc06f47ff305574e/Podcast_S4_LOUD_3000x3000-copy.jpg"></img>
              </div>
              <div>
                <div className="text-white font-semibold hover:underline hover:cursor-pointer">
                  <NavLink to="/episode-detail">Yol açık, yola çık</NavLink> 
                </div>
                <div className="text-sm text-white font-semibold hover:underline hover:cursor-pointer">
                 <NavLink to="/podcast-detail">Kafa Radyo</NavLink> 
                </div>
                <div className="py-3 text-sm text-[#b3b3b3] font-semibold tracking-tight">
                  <p className="line-clamp-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Mauris consequat sapien vitae enim dapibus, vitae porttitor
                    mi molestie. Quisque feugiat aliquam sapien. Proin felis
                    elit, vehicula quis nisl nec, posuere ornare dui. Morbi
                    mattis ligula in consequat sodales. Sed tristique mattis
                    tortor, dictum rutrum lorem vehicula vitae. Nulla commodo
                    rutrum metus, a mattis odio. Sed est massa, facilisis eu
                    blandit nec, ullamcorper vitae urna.
                  </p>
                </div>
                <div className="flex flex-row items-center justify-between py-4">
                  <div className="flex flex-row items-center gap-x-4">
                    <button className="rounded-full w-8 h-8 bg-primary flex items-center justify-center">
                      <Icon name="play" />
                    </button>
                    <div className="flex flex-row gap-x-1 items-center justify-center text-sm text-[#b3b3b3] font-semibold tracking-tight">
                      <span>5 Nis</span>
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
          </div>
        </div>
      </div>
    </main>
  );
}
