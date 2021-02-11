import React, { useEffect, useState, useRef, useCallback } from "react";
import { NavLink, useParams } from "react-router-dom";

import Avatar from "../Components/Shared/Avatar";
import Input from "../Components/Shared/Input";
import { useForm } from "../Hooks/form-hook";
import { VALIDATOR_REQUIRE } from "../util/validators";

import backimg from "../File/Icon/back.png";

import "./userMessages.css";
let interval;
const UserMessages = () => {
  const msgRef = useRef();

  const userId = useParams().userId;

  const [participipants, setrUser] = useState([]);

  const [myconv, setrconv] = useState();
  const [getmsg, setgetmsg] = useState(false);
  const convId = useParams().convId;

  const [MsgState, inputhandler, setformData] = useForm(
    {
      body: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const lasendReq = useCallback(() => {
    const vsendReq = async () => {
      try {
        console.log("in");
        const response = await fetch(
          `http://localhost:5000/api/conv/${convId}`
        );

        const responseData = await response.json();
        //console.log(responseData.participants);
        if (responseData !== myconv) {
          setrconv(responseData);
          setTimeout(
            () =>
              (msgRef.current.scrollTop = msgRef.current.scrollHeight + 200),
            50
          );
        }
      } catch (err) {}
    };
    vsendReq();
  }, []);
  useEffect(() => {
    const sendReq = async () => {
      console.log("err");
      try {
        const response = await fetch(
          `http://localhost:5000/api/conv/${convId}`
        );

        const responseData = await response.json();
        console.log(responseData.participants);
        setrconv(responseData);

        //finPart(responseData.participants);
        //console.log(responseData.participants[0]);
        const response2 = await fetch(
          `http://localhost:5000/api/user/${responseData.participants[0]}`
        );
        const responseData2 = await response2.json();
        const img = responseData2.img;
        setrUser((old) => [...old, img]);
        console.log(img);

        const response3 = await fetch(
          `http://localhost:5000/api/user/${responseData.participants[1]}`
        );
        const responseData3 = await response3.json();
        const img2 = responseData3.img;
        setrUser((old) => [...old, img2]);
        console.log(img);
        if (getmsg === false) {
          setgetmsg(true);
        }
      } catch (err) {}
    };
    sendReq();
  }, []);

  useEffect(() => {
    console.log("acha,ge");
    if (myconv) {
      msgRef.current.scrollTop = msgRef.current.scrollHeight;
    }
  }, [getmsg]);
  useEffect(() => {
    console.log("ineee");
    interval = setInterval(() => {
      lasendReq();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  //let myconv = DUMMY_CONV.find((conv) => conv.id === convId);

  //console.log(DUMMY_CONV.messages);

  const [onclear, setonclear] = useState(false);
  //console.log(participipants);
  const userUpdateSubmitHandler = async (e) => {
    console.log(interval);
    clearInterval(interval);
    e.preventDefault();
    //console.log(authState.inputs.name.value);
    console.log(myconv);

    const response = await fetch(
      `http://localhost:5000/api/conv/${convId}/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: MsgState.inputs.body.value,
        }),
      }
    );
    lasendReq();
    interval = setInterval(() => {
      lasendReq();
    }, 1000);
    console.log(MsgState);
    setformData(
      {
        body: {
          value: "",
          isValid: false,
        },
      },
      false
    );
    console.log(MsgState);
    setonclear(true);
    setTimeout(() => setonclear(false), 500);
    setTimeout(
      () => (msgRef.current.scrollTop = msgRef.current.scrollHeight + 200),
      50
    );

    //setConv((myconv) => myconv);
  };

  return (
    <div className="User__message__page">
      {myconv && (
        <div className="user_conv">
          {MsgState.inputs.body.value}
          <div className="user_conv_info">
            {participipants.map((part) => {
              return (
                <div key={part} className="participants">
                  <Avatar image={part} alt={part} width="50px"></Avatar>
                </div>
              );
            })}
          </div>
          <div className="message" ref={msgRef}>
            {myconv.messages.map((index) => {
              return (
                <div
                  className={`${userId === index.from ? "my" : "other"}msg`}
                  key={index.date + index.from}
                >
                  <div
                    className={`${
                      userId === index.from ? "my" : "other"
                    }msg__content`}
                  >
                    <p>{index.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <form className="send" onSubmit={userUpdateSubmitHandler}>
            {MsgState.inputs.body && (
              <Input
                id="body"
                element="input"
                type="text"
                validators={[VALIDATOR_REQUIRE()]}
                onInput={inputhandler}
                initialvalue=""
                onclear={onclear}
              />
            )}
            <button type="submit" disabled={!MsgState.isValid}>
              Envoyer
            </button>
          </form>
        </div>
      )}
      <NavLink to={`/${userId}/conv`}>
        <img src={backimg}></img>
      </NavLink>
    </div>
  );
};

export default UserMessages;
