import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext,
} from "react";
import { NavLink, useParams } from "react-router-dom";

import Avatar from "../../../Components/Shared/Avatar";
import Input from "../../../Components/Shared/Input";
import { useForm } from "../../../Hooks/form-hook";
import { VALIDATOR_REQUIRE } from "../../../util/validators";
import { AuthContext } from "../../../Context/auth-context";
import { useHttpClient } from "../../../Hooks/http-hook";

import backimg from "../../../File/Icon/back.png";

import "./userMessages.css";

const UserMessages = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const msgRef = useRef();
  const auth = useContext(AuthContext);
  const userId = useParams().userId;
  const [myconv, setrconv] = useState();
  const convId = useParams().convId;
  const evtSrclive = useRef(null);

  //CREER LA SOURCEEVENT SHARABLE
  const listenEvt = useCallback(() => {
    if (!evtSrclive.current) {
      evtSrclive.current = new EventSource(
        `http://localhost:5000/api/live/${userId}`
      );
    }
  }, [userId]);

  const [MsgState, inputhandler, setformData] = useForm(
    {
      body: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  //FONCTION A UTILISER POUR DEMANDER UN RECHARGEMENT DES DONNES SANS PAGE

  const lasendReq = useCallback(() => {
    const vsendReq = async () => {
      try {
        const response = await sendRequest(
          `http://localhost:5000/api/conv/${convId}`,
          "GET",
          null,
          { Authorization: "bearer " + auth.token }
        );
        setrconv(response);
      } catch (err) {}
    };
    vsendReq();

    msgRef.current.scrollTop = msgRef.current.scrollHeight + 100;
  }, [convId, sendRequest, auth.token]);

  const sendlivreq = useCallback(() => {
    const vsendReq = async () => {
      try {
        const response = await sendRequest(
          `http://localhost:5000/api/live/${convId}/newmsg`
        );
      } catch (err) {}
    };
    vsendReq();
  }, [convId, sendRequest]);

  //SE CONNECTER AU LIVE ET ETRE A L'AFFUT DES MESSAGE
  useEffect(() => {
    listenEvt();
    evtSrclive.current.addEventListener("newmsg", (event) => {
      console.log("Message", event.data);
      if (event.data === convId) {
        lasendReq();
      }
    });
    return () => evtSrclive.current.close();
  }, [convId, lasendReq, listenEvt]);

  //RECUPERER CONV AU CHARGMEENT DE LA PAGE

  useEffect(() => {
    const sendReq = async () => {
      try {
        const response = await sendRequest(
          `http://localhost:5000/api/conv/${convId}`,
          "GET",
          null,
          { Authorization: "bearer " + auth.token }
        );
        setrconv(response);
      } catch (err) {}
    };
    sendReq();
  }, [convId, sendRequest, auth.token]);

  //POUR AVOIR UN ECRAN EN BAS AU RECHARGEMENT ET A L'ARRIVEE SUR LA PAGE

  useEffect(() => {
    if (myconv) {
      msgRef.current.scrollTop = msgRef.current.scrollHeight;
    }
  }, [myconv]);

  const [onclear, setonclear] = useState(false);

  const userUpdateSubmitHandler = async (e) => {
    e.preventDefault();
    console.log(convId);

    await sendRequest(
      `http://localhost:5000/api/conv/${convId}/msg`,
      "POST",
      JSON.stringify({
        value: MsgState.inputs.body.value,
      }),
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + auth.token,
      }
    );
    lasendReq();
    sendlivreq();
    setformData(
      {
        body: {
          value: "",
          isValid: false,
        },
      },
      false
    );
    setonclear(true);
    setTimeout(() => setonclear(false), 500);
  };
  return (
    <div className="User__message__page">
      {myconv && (
        <div className="user_conv">
          <div className="user_conv_info">
            {myconv.img.map((part) => {
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
        <img src={backimg} alt="retour"></img>
      </NavLink>
    </div>
  );
};

export default UserMessages;
