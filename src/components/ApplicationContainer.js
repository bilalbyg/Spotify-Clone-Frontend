import React from "react";
import Sidebar from "./Sidebar";
import Bottombar from "./Bottombar";
import Content from "./Content";

export default function ApplicationContainer() {
  return (
    <>
      <div className="wrapper">
        <Sidebar />
        <Content />
      </div>
      <Bottombar />
    </>
  );
}
