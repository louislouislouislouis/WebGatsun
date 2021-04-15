import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../Context/auth-context";

import "./MainNav.css";

import homesvg from "../../File/svg/Home.svg";
import postsvg from "../../File/svg/Post.svg";
import demandsvg from "../../File/svg/demande.svg";
import msgsvg from "../../File/svg/msg.svg";

const MainNav = (props) => {
  const auth = useContext(AuthContext);
  return (
    <div className="Header">
      <li>
        <NavLink to="/">
          <div className="IconNav">
            <img src={homesvg} alt="home" className="Header_img"></img>
          </div>
        </NavLink>
      </li>
      <li>
        <NavLink to={auth.token ? `/${auth.userId}/profil` : "/"}>
          <div className="IconNav">
            <img src={postsvg} alt="user" className="Header_img"></img>
          </div>
        </NavLink>
      </li>
      <li>
        <NavLink to={auth.token ? `/demand` : "/"}>
          <div className="IconNav">
            <img src={demandsvg} alt="user" className="Header_img"></img>
          </div>
        </NavLink>
      </li>
      <li>
        <NavLink to={auth.token ? `/${auth.userId}/conv` : "/"}>
          <div className="IconNav">
            <img src={msgsvg} alt="user" className="Header_img"></img>
          </div>
        </NavLink>
      </li>
    </div>
  );
};

export default MainNav;
