import React from "react";
import { Icon } from "../../Icons";
import { NavLink } from "react-router-dom";

export default function Menu() {
  let activeClassName =
    "bg-active text-white h-10 flex items-center text-sm font-semibold text-link hover:text-white px-4 rounded gap-x-4";
  let notActiveClassName =
    "h-10 flex items-center text-sm font-semibold text-link hover:text-white px-4 rounded gap-x-4";

  return (
    <nav className="px-2">
      <ul className="flex flex-col">
        <li>
          <NavLink
            to={"/home"}
            className={({ isActive }) =>
              isActive ? activeClassName : notActiveClassName
            }
          >
            <span>
              <Icon name="home" />
            </span>
            Anasayfa
          </NavLink>
        </li>
        <li>
          <NavLink
            to={"/search"}
            className={({ isActive }) =>
              isActive ? activeClassName : notActiveClassName
            }
          >
            <span>
              <Icon name="search" />
            </span>
            Ara
          </NavLink>
        </li>
        <li>
          <NavLink
            to={"/library"}
            className={({ isActive }) =>
              isActive ? activeClassName : notActiveClassName
            }
          >
            <span>
              <Icon name="library" />
            </span>
            Kitaplığın
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
