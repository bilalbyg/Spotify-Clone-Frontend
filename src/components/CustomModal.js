import React, { useState } from "react";
import { Icon } from "../Icons";

const Modal = ({ openModal, onClose }) => {
  if (!openModal) return null;

  return (
    <div className="fixed left-0 top-0 z-[100] min-w-full min-h-full bg-black bg-opacity-80 flex items-center justify-center">
      <div className="flex flex-col gap-y-5 rounded-xl px-5 py-7 w-[32.75rem] h-[24.375rem] bg-gradient-to-r from-[#222222] to-[#282828]">
        <div className="flex flex-row items-cemter justify-between">
          <span className="text-2xl font-bold tracking-tight">Ayrıntıları düzenle</span>
          <button className="flex items-center justify-center rounded-full p-2 hover:bg-podcast" onClick={onClose}>
            <Icon name="close" size={18}/>
          </button>
        </div>
        <div className="flex flex-row items-center justify-between">
            <div className="flex items-center justify-center w-44 h-44 bg-active text-link">
                <Icon name="music" size={70}/>
            </div>
            <div className="flex flex-col gap-y-3 w-[17.5rem]  h-44 items-start justify-center">
                <input className="bg-podcastHover text-white w-full placeholder-shown:font-semibold  rounded-md px-4 py-2 outline-none" placeholder="Çalma Listem"/>
                <textarea className="bg-podcastHover w-full h-32 outline-none rounded-md pt-2 pb-4 px-4 resize-none font-semibold placeholder-shown:font-semibold" placeholder="İsteğe bağlı açıklama ekle"></textarea>    
            </div>
        </div>
        <div className="flex items-center justify-center mt-3">
            <button className="bg-white text-black font-bold tracking-tight px-8 py-2 rounded-3xl hover:scale-[1.06] hover:bg-opacity-95">Kaydet</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
