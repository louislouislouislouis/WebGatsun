import React, { useState, useContext, useEffect } from "react";

import { AuthContext } from "../../Context/auth-context";
import { useHttpClient } from "../../Hooks/http-hook";

import "./Home.css";

import connectsvg from "../../File/svg/Connect.svg";
import AllUser from "../../File/svg/AllUser.svg";
import postsvg from "../../File/svg/Post.svg";
import Auth from "../Auth/Auth";
import Avatar from "../../Components/Shared/Avatar";
import IconSvg from "../../Components/Shared/IconSvg";
import demandsvg from "../../File/svg/demande.svg";
import msgsvg from "../../File/svg/msg.svg";
import disconnectsvg from "../../File/svg/disconnect.svg";
import profilsvg from "../../File/svg/profile.svg";

const Home = () => {
  const [showauth, setshowauth] = useState(false);
  const [user, setUser] = useState(null);

  const HancleclickAuth = () => {
    setshowauth((prevstate) => !prevstate);
  };
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const auth = useContext(AuthContext);

  useEffect(() => {
    if (auth.userId) {
      const sendReq = async () => {
        try {
          const response = await sendRequest(
            `http://localhost:5000/api/user/${auth.userId}`
          );
          setUser(response);
        } catch (err) {}
      };
      sendReq();
    }
  }, [auth, sendRequest]);

  return (
    <div className="homepage">
      {!auth.token && (
        <React.Fragment>
          <Auth show={showauth} onCancel={HancleclickAuth} />
          <IconSvg
            src={connectsvg}
            alt={"connect"}
            width="195px"
            text="Connect"
            onClick={HancleclickAuth}
            borderRadius="65px"
          ></IconSvg>
          <div className="IconContainer">
            <IconSvg
              link="/user/allusers"
              src={AllUser}
              alt={"connect"}
              width="100px"
              text="All Users"
              borderRadius="33px"
              className="UnconnectedIndividualIcon"
            ></IconSvg>
            <IconSvg
              link="/user/allusers"
              src={postsvg}
              alt={"connect"}
              width="100px"
              text="Posts"
              borderRadius="33px"
              className="UnconnectedIndividualIcon"
            ></IconSvg>
          </div>
        </React.Fragment>
      )}
      {auth.userId && user && (
        <React.Fragment>
          <Avatar image={user.image} width="206px"></Avatar>
          <div className="IconContainerConnect">
            <IconSvg
              link="/demand"
              src={demandsvg}
              alt={"connect"}
              width="100px"
              text="My demands"
              borderRadius="33px"
              className="connectedIndividualIcon"
            />
            <IconSvg
              link="/user/allusers"
              src={AllUser}
              alt={"connect"}
              width="100px"
              text="All Users"
              borderRadius="33px"
              className="connectedIndividualIcon"
            />
            <IconSvg
              link={`/${auth.userId}/conv`}
              src={msgsvg}
              alt={"connect"}
              width="100px"
              text="My msg"
              borderRadius="33px"
              className="connectedIndividualIcon"
            />
            <IconSvg
              link="/user/allusers"
              src={postsvg}
              alt={"connect"}
              width="100px"
              text="My post"
              borderRadius="33px"
              className="connectedIndividualIcon"
            />
            <IconSvg
              link={`/${auth.userId}/profil`}
              src={profilsvg}
              alt={"connect"}
              width="100px"
              text="My profile"
              borderRadius="33px"
              className="connectedIndividualIcon"
            />
            <IconSvg
              src={disconnectsvg}
              alt={"connect"}
              width="100px"
              text="Disconnect"
              borderRadius="33px"
              className="connectedIndividualIcon"
              onClick={auth.logout}
            />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default Home;
