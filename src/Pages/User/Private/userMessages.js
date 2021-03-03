import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext,
} from "react";
import { NavLink, useParams, useHistory } from "react-router-dom";

import Avatar from "../../../Components/Shared/Avatar";
import Input from "../../../Components/Shared/Input";
import Waitings from "../../../Components/Shared/Waitings";
import ErrorModal from "../../../Components/Shared/ErrorModal";

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

  const [onclear, setonclear] = useState(false);
  const [myconv, setrconv] = useState();

  const convId = useParams().convId;

  //SOURCELIVE EXIST OVER RENDER
  const evtSrclive = useRef(null);

  const history = useHistory();

  const [MsgState, inputhandler] = useForm(
    {
      body: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  //FUNCTION TO SEND MSG
  const sendlivreq = useCallback(() => {
    const vsendReq = async () => {
      try {
        await sendRequest(`http://localhost:5000/api/live/${convId}/newmsg`);
      } catch (err) {}
    };
    vsendReq();
  }, [convId, sendRequest]);

  //FUNCTION TO LOAD SOURCEEVENT SHARABLE
  const listenEvt = useCallback(() => {
    if (!evtSrclive.current) {
      evtSrclive.current = new EventSource(
        `http://localhost:5000/api/live/${auth.userId}`
      );
    }
  }, [auth.userId]);

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

  //SE CONNECTER AU LIVE ET ETRE A L'AFFUT DES MESSAGES
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

  //POUR AVOIR UN ECRAN EN BAS AU RECHARGEMENT ET A L'ARRIVEE SUR LA PAGE
  useEffect(() => {
    if (myconv) {
      msgRef.current.scrollTop = msgRef.current.scrollHeight;
    }
  }, [myconv]);

  const userUpdateSubmitHandler = async (e) => {
    e.preventDefault();
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
    //GET THE MESSAGE YOU JUST SENT
    lasendReq();
    //TELL THE SERVER TO AVERT YOUR PARTNER
    sendlivreq();
    //CLEAR THE FORM
    setonclear(true);
    //RESET THE CLEARMODE AFTER
    setTimeout(() => setonclear(false), 200);
  };

  //IN CASE OF ERROR RETURN HOME HANDLER
  const LinktoHome = () => {
    history.push("/");
  };
  return (
    <React.Fragment>
      <ErrorModal
        error={error}
        onClear={clearError}
        onClearAction={LinktoHome}
        action="Go Home"
      ></ErrorModal>
      {isLoading && <Waitings></Waitings>}
      {!isLoading && (
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
                      className={`${
                        auth.userId === index.from ? "my" : "other"
                      }msg`}
                      key={index.date + index.from}
                    >
                      <div
                        className={`${
                          auth.userId === index.from ? "my" : "other"
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
          <NavLink className="actions" to={`/${auth.userId}/conv`}>
            <img src={backimg} alt="retour"></img>
          </NavLink>
        </div>
      )}
    </React.Fragment>
  );
};

export default UserMessages;
