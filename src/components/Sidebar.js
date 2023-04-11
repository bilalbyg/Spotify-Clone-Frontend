import React from "react";
import logo from "../img/logo.svg";
import Menu from "./Sidebar/Menu";
import { Icon } from "../Icons";
import Playlists from "./Sidebar/Playlists";
import DownloadApp from "./Sidebar/DownloadApp";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-60 pt-6 flex flex-shrink-0 flex-col bg-black">
      <a href="#" className="mb-7 px-6">
        <img src={logo} className="h-10" />
      </a>

      <Menu />
      <nav className="mt-6">
        <ul>
          <li>
            <a href="#" className="py-2 px-6 flex items-center group text-sm text-link font-semibold hover:text-white">
              <span className="w-6 h-6 flex items-center justify-center group-hover:bg-opacity-100 mr-4 bg-white rounded-sm text-black bg-opacity-80">
                <Icon name="plus" size={12} />
              </span>
              Çalma Listelerim
            </a>
          </li>
          <li>
            <a href="#" className="py-2 px-6 flex items-center group text-sm text-link font-semibold hover:text-white">
              <span className="w-6 h-6 flex items-center justify-center mr-4 bg-gradient-to-br text-white rounded-sm from-purple-800 to-blue-300 opacity-60 group-hover:opacity-100">
                <Icon name="like" size={12} />
              </span>
              Beğenilen Şarkılar
            </a>
          </li>
          <li>
            <NavLink to="/episodes" className="py-2 px-6 flex items-center group text-sm text-link font-semibold hover:text-white">
              <span className="w-6 h-6 flex items-center justify-center mr-4 bg-[#056952] text-[#1ed760] rounded-sm opacity-60 group-hover:opacity-100">
                <Icon name="podcast" size={15} />
              </span>
              Bölümlerin
            </NavLink>
          </li>
        </ul>
      </nav>

      <Playlists/>
      <DownloadApp/>
    </aside>
  );
}

export default Sidebar;
