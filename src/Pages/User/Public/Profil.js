import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import { useHttpClient } from "../../../Hooks/http-hook";
import { AuthContext } from "../../../Context/auth-context";
import Auth from "../../../Pages/Auth/Auth";

import ErrorModal from "../../../Components/Shared/ErrorModal";
import Avatar from "../../../Components/Shared/Avatar";
import Waitings from "../../../Components/Shared/Waitings";
import "./Myflow.css";

import IconSvg from "../../../Components/Shared/IconSvg";
import postsvg from "../../../File/svg/Post.svg";
import msgsvg from "../../../File/svg/msg.svg";
import demandsvg from "../../../File/svg/demande.svg";

import Button from "../../../Components/Shared/Button";

const Profil = () => {
  const userId = useParams().userId;

  //user Data load with DB
  const [user, setUser] = useState();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const auth = useContext(AuthContext);
  const history = useHistory();

  //GET INFO USER WHEN PAGE LOAD OR WHEN RELAOD ORDER
  const [reload, setreload] = useState(false);
  useEffect(() => {
    const sendReq = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKENDURL}/api/user/${userId}`
        );
        console.log(response);
        setUser(response);
      } catch (err) {}
    };
    sendReq();
  }, [userId, sendRequest, reload]);

  //IN CASE OF ERROR RETURN HOME HANDLER
  const Linkto = (string) => {
    if (!string) {
      history.push("/");
    } else {
      history.push(string);
    }
  };

  //GO CONV
  const ConvHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKENDURL}/api/conv/exist`,
        "POST",
        JSON.stringify({
          userId1: auth.userId,
          userId2: userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      console.log(response);
      history.push(`/conv/${response.idconv}`);
    } catch (err) {}
  };

  //Creating editingMode
  const [editmode, seteditmode] = useState(false);
  const editmodeHandler = () => {
    seteditmode((prev) => !prev);
  };

  //quiting editingMode
  const onCancelreload = () => {
    editmodeHandler();
    setreload((p) => !p);
  };
  return (
    <React.Fragment>
      <ErrorModal
        error={error}
        onClear={clearError}
        onClearAction={() => Linkto()}
        action="Go Home"
      />
      {isLoading && <Waitings />}

      {user && (
        <React.Fragment>
          <Auth
            show={editmode}
            onCancel={editmodeHandler}
            user={user}
            style={window.innerHeight / 2 - 450}
            change
            onCancelreload={onCancelreload}
          />
          <div className="Page_User">
            <Avatar image={user.image} width="206px"></Avatar>
            <div className="name">
              <h1>{`${user.firstname} ${user.name}`}</h1>
              <p>{`${user.bio}`}</p>
            </div>
            <div className="profillike">
              {user.likes.map((like) => {
                return (
                  <Button
                    key={like}
                    text={like}
                    borderradius="22px"
                    nonbutton
                    fontweight="medium"
                    margin="5px"
                    fontsize="20px"
                    marginText="8px"
                  />
                );
              })}
            </div>
            <div className="IconContainerProf">
              <IconSvg
                link="/"
                src={postsvg}
                alt={"connect"}
                width="100px"
                borderRadius="33px"
                className="connectedIndividualIcon"
              />
              <IconSvg
                src={msgsvg}
                alt={"connect"}
                width="100px"
                onClick={
                  userId !== auth.userId
                    ? ConvHandler
                    : () => Linkto(`/${auth.userId}/conv`)
                }
                borderRadius="33px"
                className="connectedIndividualIcon"
              />
              {userId === auth.userId && (
                <IconSvg
                  link="/demand"
                  src={demandsvg}
                  alt={"connect"}
                  width="100px"
                  borderRadius="33px"
                  className="connectedIndividualIcon"
                />
              )}
            </div>
            {userId === auth.userId && (
              <div className="end">
                <Button
                  text={"Edit Profile"}
                  fontsize="30px"
                  borderradius="22px"
                  nonbutton
                  fontweight="medium"
                  margin="5px"
                  marginText="8px"
                  onClick={editmodeHandler}
                />
              </div>
            )}
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Profil;
