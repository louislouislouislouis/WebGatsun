import React,{ useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-context"
import "./MainNav.css";
import home from "../../File/image/home.png";
import user from "../../File/image/user.png";

const MainNav = (props) => {
  const auth = useContext(AuthContext);
  console.log(auth)
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
        <NavLink to = {`${auth.userId}`} >
          <div className="UserInfo">
            <img src={user} alt="user" className="Header_img"></img>
          </div>
        </NavLink>
      </li>
    </div>
  );
};

export default MainNav;
