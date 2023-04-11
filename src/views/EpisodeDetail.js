import React from "react";
import { Icon } from "../Icons";

export default function EpisodeDetail() {
  return (
    <main className="">
      {/* TOP */}
      <div className="flex flex-row justify-end relative pb-6 px-8 bg-gradient-to-t from-[#272727] to-[#056952] min-h-[21.25rem] max-h-[31.25rem]">
        <div className="absolute left-6 bottom-6 w-56 h-56 bg-[#056952] flex items-center justify-center rounded-lg">
          <img
            className="rounded-xl shadow-2xl"
            src="https://freight.cargo.site/t/original/i/a7e95331ab34c475b9aa4322a2846a59f8976db2f5d25b51cc06f47ff305574e/Podcast_S4_LOUD_3000x3000-copy.jpg"
          />
        </div>
        <div className="flex flex-col h-80 w-[60rem] absolute pt-48 pl-7">
          <span className="font-semibold text-sm text-[#b3b3b3] tracking-wide z-50 p-1">
            Podcast Bölümü
          </span>
          <span className="pt-2 text-5xl font-black tracking-tight">
            <h1>Yol açık, yola çık</h1>
          </span>
          <div className="flex flex-row items-center pt-3">
            <div className="flex flex-row gap-x-2 items-center">
              <span className="tracking-tight font-bold text-2xl hover:underline cursor-pointer">
                Kafa Radyo
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* MIDDLE */}
      <div className="bg-[#272727] flex flex-col items-start justify-center h-[8.875rem] px-8 py-4 gap-y-4">
        <div className="flex flex-row">
          <span className="flex items-center gap-x-2 justify-center text-link text-sm font-semibold tracking-tight">
            5 Nis <span className="h-1 w-1 bg-link rounded-full inline-block" />{" "}
            19 dk. 57sn
          </span>
        </div>
        <div className="flex flex-row items-center gap-x-6">
          <button
            //onClick={controls[state?.playing ? "pause" : "play"]}
            className="h-16 w-16 flex items-center justify-center bg-primary text-black rounded-full hover:scale-[1.06]"
          >
            {/* name={`${state?.playing ? "pause" : "play"}`} */}
            <Icon size={30} name="play" />
          </button>
          <button
            //onClick={controls[state?.playing ? "pause" : "play"]}
            className="h-8 w-8 flex items-center justify-center text-primary rounded-full hover:scale-[1.06]"
          >
            {/* name={`${state?.playing ? "pause" : "play"}`} */}
            <Icon size={30} name="tick" />
          </button>
          <button
            //onClick={controls[state?.playing ? "pause" : "play"]}
            className="flex items-center justify-center text-link hover:text-white"
          >
            {/* name={`${state?.playing ? "pause" : "play"}`} */}
            <Icon size={30} name="dots" />
          </button>
        </div>
      </div>
      {/* BOTTOM */}
      <div className="bg-gradient-to-b from-[#272727] to-[#000]">
        <div className="px-8 py-4 w-[56.25rem] h-auto">
          <h2 className="font-bold text-2xl">Bölüm Açıklaması</h2>
          <div className="mt-8 py-4 w-[42rem]">
            <p className="text-link tracking-tight font-semibold">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse consectetur ipsum vitae ligula tempus, ac bibendum
              mauris eleifend. Cras non euismod elit. Sed cursus tincidunt
              dapibus. Sed nulla mi, tempus eu pulvinar ut, convallis in felis.
              Curabitur dapibus molestie ultrices. Nullam odio ipsum, auctor
              quis gravida ut, cursus non nibh. Nullam scelerisque nisl
              fermentum venenatis porta. Morbi iaculis a dui quis malesuada.
              Curabitur euismod bibendum ipsum, quis viverra nisi elementum in.
              Proin tempus gravida elit, vitae varius eros molestie at. Quisque
              lacinia enim lorem, quis rutrum felis ullamcorper eu. Suspendisse
              laoreet nunc urna, ac laoreet dolor accumsan ut. Pellentesque
              ullamcorper dolor accumsan, tristique quam sed, posuere dolor.
              Cras hendrerit, est quis pulvinar porta, quam elit iaculis mi,
              euismod eleifend nisl ante at elit. Duis fermentum, urna rhoncus
              ultrices laoreet, tortor metus tincidunt quam, ut aliquet sapien
              tortor at magna. Nullam vulputate leo at quam ornare, id pulvinar
              nisi dictum. Maecenas vel posuere nisi. In quis ex risus. Aenean
              auctor justo non ex cursus, non sodales risus luctus. Phasellus
              laoreet tempor sapien, at tincidunt felis convallis sed. Nam eu
              commodo velit, et euismod neque. Proin in lorem a massa maximus
              porta. Aliquam id tincidunt ipsum, at venenatis sapien. Sed
              elementum ante quis dui faucibus venenatis. Suspendisse vestibulum
              odio vitae risus tristique volutpat. Praesent egestas ante quis
              semper lobortis. Donec sodales metus tortor, bibendum volutpat
              ante accumsan et. Proin mollis varius nisi, fermentum pulvinar
              diam fermentum eu. Suspendisse vel diam sem. Etiam augue turpis,
              rhoncus sit amet porttitor non, porta ut neque. Nullam vitae arcu
              id nisi viverra interdum volutpat et quam. Sed odio purus,
              imperdiet sed neque rutrum, lobortis ornare justo. Integer turpis
              felis, blandit ac sem et, laoreet tempus sapien. Nam volutpat,
              sapien non viverra sodales, tellus mauris molestie metus, et
              eleifend justo metus vel sem. In hac habitasse platea dictumst.
            </p>
          </div>
          <button className="mt-8 rounded-3xl font-semibold bg-black border border-white px-4 py-2 hover:scale-[1.06] hover:border-2">Bölümlerin tümünü gör</button>
        </div>
      </div>
    </main>
  );
}
