import React from "react";
import { Icon } from "../Icons";
import { NavLink } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col gap-y-6 items-center justify-center">
        <div className="flex items-center justify-center text-primary py-5">
          <Icon name="logo" size={60} />
        </div>
        <div className="flex items-center justify-center">
          <h1 className="text-5xl tracking-tight font-bold">Sayfa bulunamadı</h1>
        </div>
        <div className="flex items-center justify-center">
          <p className="text-sm text-[#a7a7a7] font-semibold">Aradığın sayfayı bulamıyoruz.</p>
        </div>
        <div className="flex items-center justify-center py-5">
          <NavLink to="/home" className="w-36 h-12 px-8 py-3 bg-white text-black hover:scale-[1.04] rounded-[3rem] font-bold">Ana sayfa</NavLink>
        </div>
      </div>
    </div>
  );
}
