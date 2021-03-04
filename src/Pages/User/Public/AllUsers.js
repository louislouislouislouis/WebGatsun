import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import { useHttpClient } from "../../../Hooks/http-hook";
import { AuthContext } from "../../../Context/auth-context";
import Avatar from "../../../Components/Shared/Avatar";
import Modal from "../../../Components/Shared/Modal";

import "./AllUsers.css";
import ErrorModal from "../../../Components/Shared/ErrorModal";
import Waitings from "../../../Components/Shared/Waitings";

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
        const convsresponse = await sendRequest(
          `http://localhost:5000/api/user/alluser`
        );
        if (convsresponse) {
          setallusers(convsresponse.users);
        }
      } catch (err) {}
    };
    sendReq();
  }, [sendRequest]);

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
    e.preventDefault();
    try {
      const response = await sendRequest(
        `http://localhost:5000/api/conv/exist`,
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
      console.log(response);
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
      {isLoading && <Waitings />}
      {!isLoading && (
        <React.Fragment>
          <Modal
            show={showUserProp}
            onCancel={hideuserpropsHandler}
            header={`${UserHighlight ? UserHighlight.firstname : ""}`}
            footer={
              <React.Fragment>
                <button onClick={hideuserpropsHandler}> Quit</button>
                {auth.token &&
                  UserHighlight &&
                  UserHighlight.id !== auth.userId && (
                    <button onClick={ConvHandler}> Conv</button>
                  )}
                <button onClick={goprofileHandler}> See profile</button>
              </React.Fragment>
            }
          >
            {
              <React.Fragment>
                <Avatar
                  image={UserHighlight ? UserHighlight.image : ""}
                  alt={UserHighlight ? UserHighlight.name : ""}
                  width={"200px"}
                ></Avatar>
                <div className="bio">
                  <p>{UserHighlight ? UserHighlight.bio : ""}</p>
                </div>
              </React.Fragment>
            }
          </Modal>
          {allusers &&
            allusers.map((usr) => {
              return (
                <div key={usr.id}>
                  <div className="name">
                    <p>{`${usr.firstname} ${usr.name}`}</p>
                  </div>
                  <Avatar
                    image={usr.image}
                    alt={usr.id}
                    width="100px"
                    onClick={() => showuserpropsHandler(usr)}
                  ></Avatar>
                </div>
              );
            })}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Users;
