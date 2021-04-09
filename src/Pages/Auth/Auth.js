import React, { useContext, useEffect, useState } from "react";
import { useHttpClient } from "../../Hooks/http-hook";

import Input from "../../Components/Shared/Input";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../util/validators";
import { AuthContext } from "../../Context/auth-context";

import { useForm } from "../../Hooks/form-hook";
import Modal from "../../Components/Shared/Modal";
import Button from "../../Components/Shared/Button";

import svgquit from "../../File/svg/croix.svg";

const Auth = (props) => {
  const [isLoginMode, setIsLoginMode] = useState(props.change ? false : true);
  const [errorText, setErrorText] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const auth = useContext(AuthContext);
  const initial = !props.change
    ? {
        password: {
          value: "",
          isValid: false,
        },
        email: {
          value: "",
          isValid: false,
        },
      }
    : {
        name: {
          value: "",
          isValid: true,
        },
        firstName: {
          value: "",
          isValid: true,
        },
        Bio: {
          value: "",
          isValid: true,
        },
        image: {
          value: "",
          isValid: true,
        },
      };
  const [authState, inputhandler, setformData] = useForm(
    initial,
    props.change ? true : false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setformData(
        {
          ...authState.inputs,
          name: undefined,
          firstName: undefined,
          Bio: undefined,
          image: undefined,
        },
        authState.inputs.email.isValid && authState.inputs.password.isValid
      );
    } else {
      setformData(
        {
          ...authState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          firstName: {
            value: "",
            isValid: false,
          },
          Bio: {
            value: "",
            isValid: true,
          },
          image: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };
  const userUpdateSubmitHandler = async (e) => {
    e.preventDefault();
    if (isLoginMode) {
      try {
        const response = await fetch(`http://localhost:5000/api/user/log`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: authState.inputs.email.value,
            password: authState.inputs.password.value,
          }),
        });
        const responseData = await response.json();
        if (response.status === 201) {
          auth.login(
            responseData.userId,
            responseData.token,
            responseData.UserImg
          );
          props.onCancel();
        } else {
          setErrorText(responseData.message);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const response = await fetch(`http://localhost:5000/api/user/sgnp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: authState.inputs.email.value,
            password: authState.inputs.password.value,
            bio: authState.inputs.Bio.value,
            name: authState.inputs.name.value,
            firstName: authState.inputs.firstName.value,
            image: authState.inputs.image.value,
            status: status,
            likes: likes,
          }),
        });

        const responseData = await response.json();
        auth.login(responseData.userId, responseData.token);
      } catch (err) {
        console.log(err);
      }
    }
  };
  const cancelHandler = () => {
    props.onCancel();
    setErrorText(null);
  };

  const [style, setstyle] = useState("calc((100vh - 529px) / 2)");

  useEffect(() => {
    const top2 =
      (window.innerHeight - 880) / 2 > 0 ? (window.innerHeight - 880) / 2 : 0;
    const top1 =
      (window.innerHeight - 529) / 2 > 0 ? (window.innerHeight - 529) / 2 : 0;
    setstyle(() => (isLoginMode ? `${top1}px` : `${top2}px`));
  }, [isLoginMode]);

  const explicationHandler = (text) => {
    setErrorText(text);
  };

  //managing like
  const [likes, setlikes] = useState(props.change ? props.user.likes : []);

  //transitionninglike
  const [transition, settransition] = useState(null);

  //removelikehanle
  const removelikehandle = (like) => {
    settransition(like);
    setTimeout(() => {
      setlikes((prevlikes) => prevlikes.filter((prvlike) => prvlike !== like));
      settransition(null);
    }, 500);
  };

  //state of adding
  const [adding, setadd] = useState(null);

  //value adding
  const [myval, setmyval] = useState("");

  const addhandler = () => {
    setadd(true);
    setmyval("");
  };
  const validateHandle = () => {
    if (myval !== "" && !likes.includes(myval) && myval.length < 21) {
      setlikes((prevlikes) => prevlikes.concat([myval]));
      setErrorText(null);
    }
    if (likes.includes(myval)) {
      setErrorText("You cannot have 2 identiques like");
    }
    if (myval.length > 20) {
      setErrorText("One like should be below 20 charactre");
    }

    setadd(false);
  };
  const changevalhandler = (e) => {
    setmyval(e.target.value);
  };
  const [status, setstatus] = useState(
    props.change ? props.user.status : "public"
  );
  const changeStatusHandler = (status) => {
    setstatus(status);
  };

  const changehandlersend = async (e) => {
    e.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/user/${auth.userId}`,
        "PATCH",
        JSON.stringify({
          bio: authState.inputs.Bio.value,
          name: authState.inputs.name.value,
          firstName: authState.inputs.firstName.value,
          image: authState.inputs.image.value,
          status: status,
          likes: likes,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onCancelreload();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <React.Fragment>
      <Modal
        top={style}
        //transform={!isLoginMode ? "translateY(-140px)" : ""}
        show={props.show}
        onCancel={cancelHandler}
      >
        <form
          onSubmit={!props.change ? userUpdateSubmitHandler : changehandlersend}
        >
          {!props.change && (
            <Input
              prop
              id="email"
              element="input"
              type="text"
              label="Email"
              //errorText="please enter a valid email"
              validators={[VALIDATOR_EMAIL()]}
              onInput={inputhandler}
            />
          )}
          {!props.change && (
            <Input
              id="password"
              element="input"
              type="password"
              label="Password"
              //errorText="Your password must be at least 8characteres"
              validators={[VALIDATOR_MINLENGTH(8)]}
              onInput={inputhandler}
            />
          )}
          {!isLoginMode && (
            <Input
              id="name"
              element="input"
              type="text"
              label="Nom"
              initialvalid
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputhandler}
              initialvalue={`${props.change ? props.user.name : ""}`}
            />
          )}
          {!isLoginMode && (
            <Input
              id="firstName"
              element="input"
              type="text"
              initialvalid
              label="Prenom"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputhandler}
              initialvalue={`${props.change ? props.user.firstname : ""}`}
            />
          )}

          {!isLoginMode && (
            <Input
              id="image"
              element="input"
              type="text"
              label="Image Url"
              onInput={inputhandler}
              initialvalid
              explication
              initialvalue={`${props.change ? props.user.image : ""}`}
              onClickexplication={() =>
                explicationHandler(
                  "GatsunWeb doesn't accept directy file for the moment. Please give a link"
                )
              }
            ></Input>
          )}
          {!isLoginMode && (
            <Input
              id="Bio"
              type="text"
              label="Bio"
              height="90px"
              initialvalid
              borderRadius="16px"
              onInput={inputhandler}
              explication
              initialvalue={`${props.change ? props.user.bio : ""}`}
              onClickexplication={() =>
                explicationHandler("Your bio describe yourself in a few word")
              }
            />
          )}
          {!isLoginMode && (
            <div className="form-control">
              <label>Likes</label>

              <div className="Answerlike">
                {likes.map((like, index) => {
                  return (
                    <React.Fragment key={like + index}>
                      <div
                        className="like mylike"
                        rect={transition === like ? "yes " : "no"}
                        style={{
                          transform: ` ${
                            transition === like ? "translateY(-30px) " : ""
                          }`,
                          opacity: ` ${transition === like ? "0" : "1"}`,
                        }}
                      >
                        <img
                          className="imgquitlike"
                          src={svgquit}
                          alt="quit"
                          onClick={() => {
                            removelikehandle(like);
                          }}
                        />
                        <p>{like}</p>
                        {index === likes.length - 1 &&
                          likes.length < 3 &&
                          !adding && (
                            <div className="crox" onClick={addhandler}>
                              <div className="croxsp" />
                              <div className="croxsp" />
                            </div>
                          )}
                      </div>
                    </React.Fragment>
                  );
                })}
                {adding && (
                  <React.Fragment>
                    <div className={"adding"}>
                      <input
                        style={{ width: "150px" }}
                        value={myval}
                        onChange={changevalhandler}
                        initialvalid
                      />
                      <div className="validate" onClick={validateHandle}>
                        <div className="croxsp" />
                        <div className="croxsp" />
                      </div>
                    </div>
                  </React.Fragment>
                )}
                {likes.length === 0 && !adding && (
                  <div className="validate" onClick={addhandler}>
                    <div className="croxsp" />
                    <div className="croxsp" />
                  </div>
                )}
              </div>
            </div>
          )}
          {!isLoginMode && (
            <div className="form-control">
              <label>Status</label>
              <div className="Answerstatu">
                <div
                  className={`choice${
                    status === "public" ? "focus" : "unfocus"
                  }`}
                  onClick={() => changeStatusHandler("public")}
                >
                  <p>Public</p>
                </div>
                <div
                  className={`choice${
                    status === "private" ? "focus" : "unfocus"
                  }`}
                  onClick={() => changeStatusHandler("private")}
                >
                  <p>Private</p>
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            //disabled={!authState.isValid}
            height="56px"
            text={
              !isLoginMode
                ? !props.change
                  ? "Signup"
                  : "Apply Change"
                : "Login"
            }
            fontsize="30px"
            borderradius="22px"
            width="100%"
            topmargin={`${isLoginMode ? "50px" : ""}`}
            orange
          />
        </form>
        {!props.change && (
          <Button
            onClick={switchModeHandler}
            height="39px"
            text={`Switch to ${isLoginMode ? "Signup" : "Login"}`}
            fontsize="15px"
            borderradius="22px"
          />
        )}
        {errorText && (
          <div className="errorText">
            <p>{errorText}</p>
          </div>
        )}
      </Modal>
    </React.Fragment>
  );
};

export default Auth;
