import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";

import { useForm } from "../../../Hooks/form-hook";

import { VALIDATOR_REQUIRE } from "../../../util/validators";

import Input from "../../../Components/Shared/Input";
import Avatar from "../../../Components/Shared/Avatar";

import "./Myflow.css";

import messageimg from "../../../File/Icon/message.png";
import ticketimg from "../../../File/Icon/ticket.png";
import edit from "../../../File/Icon/edit.png";
import postimg from "../../../File/Icon/post.png";

const Profil = () => {
  const userId = useParams().userId;

  const [user, setrUser] = useState();
  useEffect(() => {
    const sendReq = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/user/${userId}`
        );

        const responseData = await response.json();
        console.log(responseData);
        setrUser(responseData);
      } catch (err) {}
    };
    sendReq();
  }, [userId]);

  const [changeMode, setChangeMode] = useState(false);
  const [changeMode2, setChangeMode2] = useState(false);
  const [authState, inputhandler, setformData] = useForm(
    {
      name: {
        value: user ? user.name : "",
        isValid: false,
      },
    },
    true
  );
  const [authState2, inputhandler2, setformData2] = useForm(
    {
      firstname: {
        value: user ? user.firstname : "",
        isValid: false,
      },
    },
    true
  );
  const ChangeModeHandler1 = () => {
    setformData(
      {
        name: {
          value: authState.inputs.name.value,
          isValid: true,
        },
      },
      true
    );
    setChangeMode((prvMode) => !prvMode);
  };
  const ChangeModeHandler2 = () => {
    setformData2(
      {
        firstname: {
          value: authState2.inputs.firstname.value,
          isValid: true,
        },
      },
      true
    );
    setChangeMode2((prvMode) => !prvMode);
  };
  const userUpdateSubmitHandler = (e) => {
    e.preventDefault();
    //console.log(authState.inputs.name.value);
    user.name = authState.inputs.name.value;
    console.log(user.name);
    console.log(user.firstname);
    setChangeMode((prvMode) => !prvMode);
  };
  const userUpdateSubmitHandler2 = (e) => {
    e.preventDefault();
    //console.log(authState);
    //console.log(authState2);
    user.firstname = authState2.inputs.name.value;
    console.log(user.name);
    console.log(user.firstname);
    setChangeMode2((prvMode) => !prvMode);
  };
  return (
    <React.Fragment>
      {user && (
        <React.Fragment>
          <div className="Page_User">
            <div className="user">
              <div className="user__pic">
                <Avatar image={user.img} alt={user.name} width="200px" />
              </div>
              <div className="user__info">
                <div
                  className="user__name"
                  style={{
                    gridTemplateColumns: `${changeMode ? "70px auto" : ""}`,
                  }}
                >
                  <p>Nom :</p>
                  {!changeMode && (
                    <React.Fragment>
                      <p>{user.name}</p>
                      <img
                        src={edit}
                        className="icon"
                        alt="edit"
                        style={{ opacity: 0.5 }}
                        onClick={ChangeModeHandler1}
                      />
                    </React.Fragment>
                  )}
                  {changeMode && (
                    <React.Fragment>
                      <form
                        className="changeparam"
                        onSubmit={userUpdateSubmitHandler}
                      >
                        <Input
                          id="name"
                          element="input"
                          type="text"
                          validators={[VALIDATOR_REQUIRE()]}
                          onInput={inputhandler}
                          initialvalue={user.name}
                          initialvalid
                        />
                        <button type="submit" disabled={!authState.isValid}>
                          Change
                        </button>
                      </form>
                    </React.Fragment>
                  )}
                </div>
                <div
                  className="user__name"
                  style={{
                    gridTemplateColumns: `${changeMode2 ? "70px auto" : ""}`,
                  }}
                >
                  <p>Prenom :</p>
                  {!changeMode2 && (
                    <React.Fragment>
                      <p>{user.firstname}</p>
                      <img
                        src={edit}
                        className="icon"
                        alt="edit"
                        style={{ opacity: 0.5 }}
                        onClick={ChangeModeHandler2}
                      />
                    </React.Fragment>
                  )}
                  {changeMode2 && (
                    <React.Fragment>
                      <form
                        className="changeparam"
                        onSubmit={userUpdateSubmitHandler2}
                      >
                        <Input
                          id="name"
                          element="input"
                          type="text"
                          validators={[VALIDATOR_REQUIRE()]}
                          onInput={inputhandler2}
                          initialvalue={user.firstname}
                          initialvalid
                        />
                        <button type="submit" disabled={!authState2.isValid}>
                          Change
                        </button>
                      </form>
                    </React.Fragment>
                  )}
                </div>
                <div className="user__email">
                  <p>Email :</p>
                  <p>{user.email}</p>
                </div>
                <div className="user__email">
                  <p>Username :</p>
                  <p>{user.username}</p>
                </div>
                <div className="user__bio">
                  <p>{user.bio}</p>
                </div>
                <div className="user__likes">
                  {user.likes.map((like) => (
                    <div className="likes" key={like}>
                      {like}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="other">
              <div className="myposts">
                <NavLink to={`/${userId}/post`}>
                  <img src={postimg} alt="post" />
                </NavLink>
              </div>
              <div className="mymessage">
                <NavLink to={`/${userId}/conv`}>
                  <img src={messageimg} alt="message" />
                </NavLink>
              </div>
              <div className="mydemand">
                <NavLink to={`/${userId}/demand`}>
                  <img src={ticketimg} alt="postimg" />
                </NavLink>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}

      {!user && <div className="marhceap">Wainting à faire</div>}
    </React.Fragment>
  );
};

export default Profil;
