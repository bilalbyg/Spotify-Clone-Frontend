import React from "react";
import { NavLink } from "react-router-dom";

export default function Title({title, more}) {
  return (
    <header className="flex items-center justify-between mb-4">
      <h3 className="text-2xl text-white font-semibold tracking-tight hover:underline">
        {title}
      </h3>
      {more && (
        <NavLink
          className={
            "text-xs font-semibold hover:underline uppercase text-link tracking-wider"
          }
          to={more}
        >
          SEE ALL
        </NavLink>
      )}
    </header>
  );
}
