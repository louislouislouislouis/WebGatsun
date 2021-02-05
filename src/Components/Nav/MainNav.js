import React from "react";
import { NavLink } from "react-router-dom";

import "./MainNav.css";
import home from "../../File/image/home.png";
import user from "../../File/image/user.png";

const MainNav = (props) => {
  return (
    <div className="Header">
      <li>
        <NavLink to="/">
          <div className="Home">
            <img src={home} alt="home" className="Header_img"></img>
          </div>
        </NavLink>
      </li>
      <li>
        <NavLink to="/u1">
          <div className="UserInfo">
            <img src={user} alt="user" className="Header_img"></img>
          </div>
        </NavLink>
      </li>
    </div>
  );
};

export default MainNav;
