import React from "react";
import Navbar from "./Navbar";
import { Routes, Route, Outlet } from "react-router-dom";

function Content() {
  return (
    <main
      className="flex-auto overflow-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-black scrollbar-thumb-rounded-lg"
    >
      <Navbar />
      <div className="px-8 py-5">
        <Outlet />
        {/* <Routes>
          <Route path="/home" exact element={<Home />} />
          <Route path="/search" exact element={<Search />} />
          <Route path="/library" exact element={<Library />} />
        </Routes> */}
      </div>
    </main>
  );
}

export default Content;
