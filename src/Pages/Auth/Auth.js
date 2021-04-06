import React, { useContext, useEffect, useState } from "react";
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
const Auth = (props) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [errorText, setErrorText] = useState(null);
  const auth = useContext(AuthContext);
  const [authState, inputhandler, setformData] = useForm(
    {
      password: {
        value: "",
        isValid: false,
      },
      email: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  console.log(isLoginMode);
  const switchModeHandler = () => {
    if (!isLoginMode) {
      setformData(
        {
          ...authState.inputs,
          name: undefined,
          firstName: undefined,
          Username: undefined,
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
          Username: {
            value: "",
            isValid: false,
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
    console.log(isLoginMode);
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
        console.log(response.status);
        if (response.status === 201) {
          console.log(responseData);
          auth.login(responseData.userId, responseData.token);
          props.onCancel();
        } else {
          console.log(responseData);
          setErrorText(responseData.message);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("hehe");
      try {
        const response = await fetch(`http://localhost:5000/api/user/sgnp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: authState.inputs.email.value,
            password: authState.inputs.password.value,
            Username: authState.inputs.Username.value,
            name: authState.inputs.name.value,
            firstName: authState.inputs.firstName.value,
            image: authState.inputs.image.value,
          }),
        });

        const responseData = await response.json();
        console.log(responseData);
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
  return (
    <React.Fragment>
      <Modal
        top={style}
        //transform={!isLoginMode ? "translateY(-140px)" : ""}
        show={props.show}
        onCancel={cancelHandler}
      >
        <form onSubmit={userUpdateSubmitHandler}>
          {!isLoginMode && (
            <Input
              id="name"
              element="input"
              type="text"
              label="Your name"
              errorText="please enter a valid name"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputhandler}
            />
          )}
          {!isLoginMode && (
            <Input
              id="firstName"
              element="input"
              type="text"
              label="Firstname"
              errorText="please enter a valid FirstName"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputhandler}
            />
          )}
          {!isLoginMode && (
            <Input
              id="Username"
              element="input"
              type="text"
              label="Your username"
              errorText="please enter a valid user-name"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputhandler}
            />
          )}
          {!isLoginMode && (
            <Input
              id="image"
              element="input"
              type="text"
              label="Link to your url image profil"
              errorText="please enter a url"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputhandler}
            ></Input>
          )}
          <Input
            id="email"
            element="input"
            type="text"
            label="Email"
            //errorText="please enter a valid email"
            validators={[VALIDATOR_EMAIL()]}
            onInput={inputhandler}
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            //errorText="Your password must be at least 8characteres"
            validators={[VALIDATOR_MINLENGTH(1)]}
            onInput={inputhandler}
          />
          <Button
            type="submit"
            disabled={!authState.isValid}
            height="56px"
            text={!isLoginMode ? "Signup" : "Login"}
            fontsize="30px"
            borderradius="22px"
            topmargin="50px"
            orange
          />
        </form>
        <Button
          onClick={switchModeHandler}
          height="39px"
          text="Switch to Signup"
          fontsize="15px"
          borderradius="22px"
        />
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
