import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import { useHttpClient } from "../../../Hooks/http-hook";
import { AuthContext } from "../../../Context/auth-context";
import Avatar from "../../../Components/Shared/Avatar";
import Modal from "../../../Components/Shared/Modal";

import "./AllUsers.css";
import ErrorModal from "../../../Components/Shared/ErrorModal";
import Waitings from "../../../Components/Shared/Waitings";
import Button from "../../../Components/Shared/Button";

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [showUserProp, setshowUserProp] = useState(false);
  const [UserHighlight, setUserHighlightp] = useState();
  const [allusers, setallusers] = useState();

  const auth = useContext(AuthContext);

  const history = useHistory();

  //GETUSERS AT LOADINGPAGE
  useEffect(() => {
    const sendReq = async () => {
      try {
        if (!auth.token) {
          const convsresponse = await sendRequest(
            `${process.env.REACT_APP_BACKENDURL}/api/user/alluser`
          );
          if (convsresponse) {
            setallusers(convsresponse.users);
          }
        } else {
          const convsresponse = await sendRequest(
            `${process.env.REACT_APP_BACKENDURL}/api/user/alluser/right`,
            "GET",
            null,
            { Authorization: "Bearer " + auth.token }
          );
          if (convsresponse) {
            setallusers(convsresponse.users);
          }
        }
      } catch (err) {}
    };
    sendReq();
  }, [sendRequest, auth.token]);

  //HANDLER SHOW USER USER PROPS
  const showuserpropsHandler = (usr) => {
    setshowUserProp(true);
    setUserHighlightp(usr);
  };
  //HANDLER HIDE USER USER PROPS
  const hideuserpropsHandler = (usr) => {
    setshowUserProp(false);
    setUserHighlightp(undefined);
  };
  //CONVHANDLER
  const ConvHandler = async (e) => {
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKENDURL}/api/conv/exist`,
        "POST",
        JSON.stringify({
          userId1: auth.userId,
          userId2: UserHighlight.id,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push(`/conv/${response.idconv}`);
    } catch (err) {}
  };
  //GOPROFIL
  const goprofileHandler = () => {
    history.push(`/${UserHighlight.id}/profil`);
  };

  return (
    <React.Fragment>
      <ErrorModal
        error={error}
        onClear={clearError}
        onClearAction={clearError}
        action="Go back"
      ></ErrorModal>

      <React.Fragment>
        <Modal
          show={showUserProp}
          onCancel={hideuserpropsHandler}
          top={"10px"}
          height={"95vh"}
          overflow="scroll"
          maxheight="680px"
        >
          {
            <React.Fragment>
              <Avatar
                image={UserHighlight ? UserHighlight.image : ""}
                alt={UserHighlight ? UserHighlight.name : ""}
                width={"200px"}
              ></Avatar>
              {UserHighlight && (
                <h1
                  className={"titlename"}
                >{`${UserHighlight.firstname} ${UserHighlight.name}`}</h1>
              )}
              <div className="bio">
                <p>{UserHighlight ? UserHighlight.bio : ""}</p>
              </div>
              <div className="profillike">
                {UserHighlight &&
                  UserHighlight.likes.map((like) => {
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
              <div
                className="actionfocus"
                onClick={goprofileHandler}
                style={{ marginTop: "30px" }}
              >
                <p>See profile</p>
              </div>
              {UserHighlight && UserHighlight.id !== auth.userId && (
                <div className="actionfocus" onClick={ConvHandler}>
                  <p>Start conv</p>
                </div>
              )}
              <div className="actionfocus" onClick={hideuserpropsHandler}>
                <p>Quit</p>
              </div>
            </React.Fragment>
          }
        </Modal>
        <div className="alluserpage">
          <h1>All Users</h1>
          {isLoading && <Waitings />}
          {allusers &&
            allusers.map((usr) => {
              return (
                <Button
                  height="112px"
                  orange
                  width="400px"
                  borderradius="38px"
                  maxWidth="90vw"
                  onClick={() => showuserpropsHandler(usr)}
                >
                  <div className="contentConve">
                    <Avatar
                      image={usr.image}
                      alt={usr.image}
                      width={"75px"}
                      widthpopa={"90px"}
                      left="5px"
                      border="0px"
                    />
                    <h1
                      style={{
                        marginLeft: "10px",
                        textShadow: "0px 3px 6px rgba(0,0,0,0.16)",
                      }}
                    >
                      {usr.firstname ? (
                        `${usr.firstname} ${usr.name}`
                      ) : (
                        <Waitings little />
                      )}
                    </h1>
                  </div>
                </Button>
              );
            })}
        </div>
      </React.Fragment>
    </React.Fragment>
  );
};

export default Users;
