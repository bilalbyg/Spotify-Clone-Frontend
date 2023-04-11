import React from "react";
import { Menu } from "@headlessui/react";
import { Icon } from "../../Icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Auth() {
  const user = {
    name: localStorage.getItem("userMail"),
    avatar: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
  };

  const { current } = useSelector((state) => state.player);

  const navigate = useNavigate() 

  const handleLogout = () => {
    localStorage.removeItem("tokenKey")
    localStorage.removeItem("currentUser")
    localStorage.removeItem("userMail")
    navigate("/login")
  }

  return (
    <Menu as={"nav"} className={"relative z-50"}>
      {({ open: boolean }) => (
        <>
          <Menu.Button
            className={`flex items-center h-8 rounded-3xl ${
              open ? "bg-active" : "bg-black"
            } pr-2 hover:bg-active`}
          >
            <img
              src={user.avatar}
              className={"h-8 w-8 rounded-full p-px mr-2"}
            />
            <span className="text-sm font-semibold mr-2">{user.name}</span>
            <span className={open && "rotate-180"}></span>
            <Icon name="downdir" size={16} />
          </Menu.Button>
          <Menu.Items
            className={
              "absolute p-1 top-full right-0 w-48 bg-active rounded translate-y-2"
            }
          >
            <Menu.Item>
              {({ active }) => (
                <a
                  className={`h-10 flex items-center px-2 text-sm rounded ${
                    active && "bg-white bg-opacity-20"
                  }`}
                  href="#"
                >
                  Account settings
                </a>
              )}
            </Menu.Item>{" "}
            <Menu.Item>
              {({ active }) => (
                <a
                  className={`h-10 flex items-center px-2 text-sm rounded ${
                    active && "bg-white bg-opacity-20"
                  }`}
                  href="#"
                >
                  Profile
                </a>
              )}
            </Menu.Item>{" "}
            <Menu.Item onClick={handleLogout}>
              {({ active }) => (
                <a
                  className={`h-10 flex items-center px-2 text-sm rounded ${
                    active && "bg-white bg-opacity-20"
                  }`}
                  href="#"
                >
                  Logout
                </a>
              )}
            </Menu.Item>
          </Menu.Items>
        </>
      )}
    </Menu>
  );
}
