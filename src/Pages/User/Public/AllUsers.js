import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import { useHttpClient } from "../../../Hooks/http-hook";
import { AuthContext } from "../../../Context/auth-context";
import Avatar from "../../../Components/Shared/Avatar";
import Modal from "../../../Components/Shared/Modal";

import "./AllUsers.css";
import ErrorModal from "../../../Components/Shared/ErrorModal";

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showUserProp, setshowUserProp] = useState(false);
  const [UserHighlight, setUserHighlightp] = useState();
  const [allusers, setallusers] = useState();
  const auth = useContext(AuthContext);
  const history = useHistory();
  useEffect(() => {
    const sendReq = async () => {
      try {
        const convsresponse = await sendRequest(
          `http://localhost:5000/api/user/alluser`
        );
        if (convsresponse) {
          setallusers(convsresponse);
        }
      } catch (err) {}
    };
    sendReq();
  }, [sendRequest]);
  const handlecreateconv = async (e) => {
    const formData = new FormData();
    formData.append("part1", auth.userId);
    formData.append("part2", e);

    try {
      await sendRequest(
        `http://localhost:5000/api/conv`,
        "POST",
        JSON.stringify({
          part1: auth.userId,
          part2: e,
        }),
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
    } catch (err) {}
  };

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
      {UserHighlight && (
        <Modal
          show={error ? false : showUserProp}
          onCancel={hideuserpropsHandler}
          header={`${UserHighlight.firstname} ${UserHighlight.name}`}
          contentClass="place-item__content"
          footerClass="place-item__modal-actions"
          footer={
            <React.Fragment>
              <button onClick={hideuserpropsHandler}> Quit</button>
              {auth.token && UserHighlight.id !== auth.userId && (
                <button onClick={ConvHandler}> Conv</button>
              )}
              <button onClick={goprofileHandler}> See profile</button>
            </React.Fragment>
          }
        >
          <Avatar
            image={UserHighlight.img}
            alt={UserHighlight.name}
            width={"200px"}
          ></Avatar>
          <div className="bio">
            <p>{UserHighlight.bio}</p>
          </div>
        </Modal>
      )}
      {allusers &&
        allusers.map((usr) => {
          return (
            <div key={usr.id}>
              <div className="name">{usr.id}</div>
              <Avatar
                image={usr.img}
                alt={usr.id}
                width="100px"
                onClick={() => showuserpropsHandler(usr)}
              ></Avatar>
            </div>
          );
        })}
      <div>Pas de ll</div>
    </React.Fragment>
  );
};

export default Users;
