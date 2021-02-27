import React, { useState, useEffect, useContext } from "react";
import { NavLink, useParams } from "react-router-dom";

import { useForm } from "../../../Hooks/form-hook";
import { useHttpClient } from "../../../Hooks/http-hook";
import { AuthContext } from "../../../Context/auth-context";
import { VALIDATOR_REQUIRE } from "../../../util/validators";

import Input from "../../../Components/Shared/Input";
import Avatar from "../../../Components/Shared/Avatar";
import Waiting from "../../../Components/Shared/Waitings";
import "./Myflow.css";

import messageimg from "../../../File/Icon/message.png";
import ticketimg from "../../../File/Icon/ticket.png";
import edit from "../../../File/Icon/edit.png";
import postimg from "../../../File/Icon/post.png";

const Profil = () => {
  const userId = useParams().userId;
  const [user, setUser] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  //GET INFO USER
  useEffect(() => {
    const sendReq = async () => {
      try {
        const response = await sendRequest(
          `http://localhost:5000/api/user/${userId}`
        );
        setUser(response);
      } catch (err) {}
    };
    sendReq();
  }, [userId, sendRequest]);

  const [changeModeEditName, setchangeModeEditName] = useState(false);
  const [changeModeEditFirstName, setchangeModeEditFistName] = useState(false);

  const [authStateName, inputhandlerName, setformDataName] = useForm(
    {
      name: {
        value: user ? user.name : "",
        isValid: true,
      },
    },
    true
  );
  const [
    authStateFirstName,
    inputhandlerFirstName,
    setformDataFisrtName,
  ] = useForm(
    {
      firstname: {
        value: user ? user.firstname : "",
        isValid: true,
      },
    },
    true
  );

  // SHOW/HIDE MODIF NAME

  const ChangeNameHandler = () => {
    console.log(user.name);
    console.log(authStateName);
    console.log(authStateFirstName);
    setformDataName(
      {
        name: {
          value: user.name,
          isValid: false,
        },
      },
      false
    );
    setchangeModeEditName((prvMode) => !prvMode);
  };

  // SHOW/HIDE MODIF FIRSTNAME

  const ChangeFirstNameHandler = () => {
    setformDataFisrtName(
      {
        firstname: {
          value: authStateFirstName.inputs.firstname.value,
          isValid: false,
        },
      },
      false
    );
    setchangeModeEditFistName((prvMode) => !prvMode);
  };

  // SEND MODIFNAME

  const userUpdateSubmitHandler = (e) => {
    e.preventDefault();
    user.name = authStateName.inputs.name.value;
    //A Faire en ajoutant un API Pour ca
    setchangeModeEditName((prvMode) => !prvMode);
  };

  // SEND MODIFFIRSTNAME

  const userUpdateSubmitHandler2 = (e) => {
    e.preventDefault();
    user.firstname = authStateFirstName.inputs.firstname.value;
    //A Faire en ajoutant un API Pour ca
    setchangeModeEditFistName((prvMode) => !prvMode);
  };

  return (
    <React.Fragment>
      {isLoading && <Waiting />}
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
                    gridTemplateColumns: `${
                      changeModeEditName ? "70px auto" : ""
                    }`,
                  }}
                >
                  <p>Nom :</p>
                  {!changeModeEditName && (
                    <React.Fragment>
                      <p>{user.name}</p>
                      {auth.userId === userId && (
                        <img
                          src={edit}
                          className="icon"
                          alt="edit"
                          style={{ opacity: 0.5 }}
                          onClick={ChangeNameHandler}
                        />
                      )}
                    </React.Fragment>
                  )}
                  {changeModeEditName && (
                    <React.Fragment>
                      <form
                        className="changeparam"
                        onSubmit={userUpdateSubmitHandler}
                        value={"df"}
                      >
                        <Input
                          id="name"
                          element="input"
                          type="text"
                          validators={[VALIDATOR_REQUIRE()]}
                          onInput={inputhandlerName}
                          initialvalue={user.name}
                          initialvalid={true}
                        />
                        <button type="submit" disabled={!authStateName.isValid}>
                          Change
                        </button>
                      </form>
                    </React.Fragment>
                  )}
                </div>
                <div
                  className="user__name"
                  style={{
                    gridTemplateColumns: `${
                      changeModeEditFirstName ? "70px auto" : ""
                    }`,
                  }}
                >
                  <p>Prenom :</p>
                  {!changeModeEditFirstName && (
                    <React.Fragment>
                      <p>{user.firstname}</p>
                      {auth.userId === userId && (
                        <img
                          src={edit}
                          className="icon"
                          alt="edit"
                          style={{ opacity: 0.5 }}
                          onClick={ChangeFirstNameHandler}
                        />
                      )}
                    </React.Fragment>
                  )}
                  {changeModeEditFirstName && (
                    <React.Fragment>
                      <form
                        className="changeparam"
                        onSubmit={userUpdateSubmitHandler2}
                      >
                        <Input
                          id="firstname"
                          element="input"
                          type="text"
                          validators={[VALIDATOR_REQUIRE()]}
                          onInput={inputhandlerFirstName}
                          initialvalue={user.firstname}
                          initialvalid={true}
                        />
                        <button
                          type="submit"
                          disabled={!authStateFirstName.isValid}
                        >
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
