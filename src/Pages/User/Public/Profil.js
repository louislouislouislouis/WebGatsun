import React, { useState, useEffect, useContext } from "react";
import { NavLink, useParams, useHistory } from "react-router-dom";

import { useForm } from "../../../Hooks/form-hook";
import { useHttpClient } from "../../../Hooks/http-hook";
import { AuthContext } from "../../../Context/auth-context";
import { VALIDATOR_REQUIRE } from "../../../util/validators";

import ErrorModal from "../../../Components/Shared/ErrorModal";
import Input from "../../../Components/Shared/Input";
import Avatar from "../../../Components/Shared/Avatar";
import Waitings from "../../../Components/Shared/Waitings";
import "./Myflow.css";

import messageimg from "../../../File/Icon/message.png";
import ticketimg from "../../../File/Icon/ticket.png";
import edit from "../../../File/Icon/edit.png";
import postimg from "../../../File/Icon/post.png";
import plus from "../../../File/Icon/plus.png";

const Profil = () => {
  const userId = useParams().userId;
  const [user, setUser] = useState();
  const [nboflike, setnboflike] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const auth = useContext(AuthContext);

  const history = useHistory();

  const [changeModeEditName, setchangeModeEditName] = useState(false);
  const [changeModeEditFirstName, setchangeModeEditFistName] = useState(false);
  const [changeModeEditBio, setchangeModeEditBio] = useState(false);
  const [changeModeEditLikes, setchangeModeEditLikes] = useState(false);

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
  const [authStateBio, inputhandlerBio, setformDataBio] = useForm(
    {
      bio: {
        value: user ? user.bio : "",
        isValid: true,
      },
    },
    true
  );
  const [authStateLikes, inputhandlerLikes, setformDataLikes] = useForm(
    {},
    true
  );

  //GET INFO USER WHEN PAGE LOAD

  useEffect(() => {
    setnboflike(0);
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

  // SHOW/HIDE MODIF NAME

  const ChangeNameHandler = () => {
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

  // SHOW/HIDE MODIF BIO

  const ChangeBioHandler = () => {
    setformDataBio(
      {
        bio: {
          value: authStateBio.inputs.bio.value,
          isValid: false,
        },
      },
      false
    );
    setchangeModeEditBio((prvMode) => !prvMode);
  };

  // SHOW/HIDE MODIF LIKES

  const ChangeLikesHandler = () => {
    setformDataLikes({}, false);
    setchangeModeEditLikes((prvMode) => !prvMode);
  };

  //ADDING LIKE

  const addValueLike = () => {
    setformDataLikes(
      {
        ...authStateLikes.inputs,
        ["Newlike " + nboflike]: {
          value: "Newlike",
          isValid: true,
        },
      },
      false
    );
    user.likes.push("Newlike " + nboflike);
    console.log(user.likes);
    setnboflike((prev) => prev + 1);
  };

  // SEND MODIFNAME

  const NameSubHandler = async (e) => {
    e.preventDefault();
    if (user.name !== authStateName.inputs.name.value) {
      try {
        await sendRequest(
          `http://localhost:5000/api/user/${userId}`,
          "PATCH",
          JSON.stringify({ name: authStateName.inputs.name.value }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
      } catch (err) {}
      user.name = authStateName.inputs.name.value;
    }
    setchangeModeEditName((prvMode) => !prvMode);
  };

  // SEND MODIFFIRSTNAME

  const FirstNameSubHandler = async (e) => {
    e.preventDefault();
    if (user.firstname !== authStateFirstName.inputs.firstname.value) {
      try {
        await sendRequest(
          `http://localhost:5000/api/user/${userId}`,
          "PATCH",
          JSON.stringify({
            firstname: authStateFirstName.inputs.firstname.value,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
      } catch (err) {}
      user.firstname = authStateFirstName.inputs.firstname.value;
    }
    setchangeModeEditFistName((prvMode) => !prvMode);
  };

  // SEND MODIFBIO

  const BioSubHandler = async (e) => {
    e.preventDefault();
    if (user.bio !== authStateBio.inputs.bio.value) {
      try {
        await sendRequest(
          `http://localhost:5000/api/user/${userId}`,
          "PATCH",
          JSON.stringify({
            bio: authStateBio.inputs.bio.value,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
      } catch (err) {}
      user.bio = authStateBio.inputs.bio.value;
    }
    setchangeModeEditBio((prvMode) => !prvMode);
  };

  // SEND MODIF LIKES

  const LikesSubHandler = async (e) => {
    e.preventDefault();
    user.likes = [];
    for (var i in authStateLikes.inputs) {
      if (
        !user.likes.includes(authStateLikes.inputs[i].value) &&
        authStateLikes.inputs[i].value !== ""
      ) {
        user.likes.push(authStateLikes.inputs[i].value);
      }
    }
    try {
      await sendRequest(
        `http://localhost:5000/api/user/${userId}`,
        "PATCH",
        JSON.stringify({
          likes: user.likes,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) {}
    setchangeModeEditLikes((prvMode) => !prvMode);
  };

  //IN CASE OF ERROR RETURN HOME HANDLER
  const LinktoHome = () => {
    history.push("/");
  };

  //GO CONV
  const ConvHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await sendRequest(
        `http://localhost:5000/api/conv/exist`,
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

  return (
    <React.Fragment>
      <ErrorModal
        error={error}
        onClear={clearError}
        onClearAction={LinktoHome}
        action="Go Home"
      />
      {isLoading && <Waitings />}
      {user && (
        <React.Fragment>
          <div className="Page_User">
            <div className="user">
              <div
                className="user__pic"
                onClick={() => console.log(authStateLikes)}
              >
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
                      <form className="changeparam" onSubmit={NameSubHandler}>
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
                        onSubmit={FirstNameSubHandler}
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
                  {!changeModeEditBio && (
                    <React.Fragment>
                      <p>{user.bio}</p>
                      {auth.userId === userId && (
                        <img
                          src={edit}
                          className="icon"
                          alt="edit"
                          style={{ opacity: 0.5 }}
                          onClick={ChangeBioHandler}
                        />
                      )}
                    </React.Fragment>
                  )}
                  {changeModeEditBio && (
                    <React.Fragment>
                      <form className="changeparamBio" onSubmit={BioSubHandler}>
                        <Input
                          id="bio"
                          type="text"
                          validators={[VALIDATOR_REQUIRE()]}
                          onInput={inputhandlerBio}
                          initialvalue={user.bio}
                          initialvalid={true}
                        />
                        <button type="submit" disabled={!authStateBio.isValid}>
                          Change
                        </button>
                      </form>
                    </React.Fragment>
                  )}
                </div>
                <div className="user__likes">
                  {!changeModeEditLikes && (
                    <React.Fragment>
                      {user.likes.map((like, index) => (
                        <div className="likes" key={like + index}>
                          {like}
                        </div>
                      ))}
                      {auth.userId === userId && (
                        <div className="likes" onClick={ChangeLikesHandler}>
                          <img
                            src={edit}
                            className="icon"
                            alt="edit"
                            style={{ opacity: 0.5 }}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  )}
                  {changeModeEditLikes && (
                    <React.Fragment>
                      <form
                        className="changeparamBio"
                        onSubmit={LikesSubHandler}
                      >
                        {user.likes.map((like, index) => (
                          <React.Fragment key={like + index}>
                            <Input
                              id={like}
                              element="input"
                              type="input"
                              validators={[VALIDATOR_REQUIRE()]}
                              onInput={inputhandlerLikes}
                              initialvalue={like}
                              initialvalid={true}
                            />
                          </React.Fragment>
                        ))}
                        <button
                          onClick={addValueLike}
                          className="addlike"
                          disabled={!authStateLikes.isValid}
                        >
                          <img src={plus} alt="plus" />
                        </button>
                        <button
                          type="submit"
                          disabled={!authStateLikes.isValid}
                        >
                          Change
                        </button>
                      </form>
                    </React.Fragment>
                  )}
                </div>
              </div>
            </div>
            {auth.userId === userId && (
              <React.Fragment>
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
              </React.Fragment>
            )}
            {auth.token && auth.userId !== userId && (
              <button onClick={ConvHandler}>Start conv</button>
            )}
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Profil;
