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
  const [otheruser, setotheruser] = useState(null);
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
        await sendRequest(
          `${process.env.REACT_APP_BACKENDURL}/api/live/${convId}/newmsg`
        );
      } catch (err) {}
    };
    vsendReq();
  }, [convId, sendRequest]);

  //FUNCTION TO LOAD SOURCEEVENT SHARABLE
  const listenEvt = useCallback(() => {
    if (!evtSrclive.current) {
      evtSrclive.current = new EventSource(
        `${process.env.REACT_APP_BACKENDURL}/api/live/${auth.userId}`
      );
    }
  }, [auth.userId]);

  //FONCTION A UTILISER POUR DEMANDER UN RECHARGEMENT DES DONNES SANS PAGE
  const lasendReq = useCallback(() => {
    const vsendReq = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKENDURL}/api/conv/${convId}`,
          "GET",
          null,
          { Authorization: "bearer " + auth.token }
        );
        setrconv(response);
      } catch (err) {}
    };
    vsendReq();
    if (msgRef.current) {
      msgRef.current.scrollTop = msgRef.current.scrollHeight + 100;
    }
  }, [convId, sendRequest, auth.token]);

  //RECUPERER CONV AU CHARGMEENT DE LA PAGE
  useEffect(() => {
    const sendReq = async () => {
      let larep;
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKENDURL}/api/conv/${convId}`,
          "GET",
          null,
          { Authorization: "bearer " + auth.token }
        );

        larep = response;
        setrconv(response);
      } catch (err) {}
      try {
        const otheruse = larep.participants.filter((part) => {
          return part !== auth.userId;
        });
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKENDURL}/api/user/${otheruse[0]}`,
          "GET",
          null,
          { Authorization: "bearer " + auth.token }
        );

        setotheruser(response);
      } catch (err) {}
    };
    sendReq();
  }, [convId, sendRequest, auth]);

  //SE CONNECTER AU LIVE ET ETRE A L'AFFUT DES MESSAGES
  useEffect(() => {
    listenEvt();
    evtSrclive.current.addEventListener("newmsg", (event) => {
      if (event.data === convId) {
        lasendReq();
      }
    });
    return () => evtSrclive.current.close();
  }, [convId, lasendReq, listenEvt]);

  //POUR AVOIR UN ECRAN EN BAS AU RECHARGEMENT ET A L'ARRIVEE SUR LA PAGE
  useEffect(() => {
    msgRef.current.scrollTop = msgRef.current.scrollHeight;
  }, [myconv]);

  const userUpdateSubmitHandler = async (e) => {
    e.preventDefault();
    await sendRequest(
      `${process.env.REACT_APP_BACKENDURL}/api/conv/${convId}/msg`,
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
    setonclear(true);
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

      <div className="User__message__page">
        {otheruser && (
          <Avatar
            border="solid 5px white"
            width="78px"
            image={otheruser.image}
          ></Avatar>
        )}
        {otheruser && (
          <h1
            style={{ textAlign: "center", margin: "0 0 0 0" }}
          >{`${otheruser.firstname} ${otheruser.name}`}</h1>
        )}
        <div className="user_conv">
          {/*  <div className="user_conv_info">
                {myconv.image.map((part) => {
                  return (
                    <div key={part} className="participants">
                      <Avatar image={part} alt={part} width="50px"></Avatar>
                    </div>
                  );
                })}
              </div> */}
          {isLoading && <Waitings little pos="absolute" />}
          <div
            className="message"
            style={{ height: 0.47 * window.innerHeight }}
            ref={msgRef}
          >
            {myconv &&
              myconv.messages.map((index) => {
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
          <div className="endpage">
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
                Send
              </button>
              <NavLink className="actions" to={`/${auth.userId}/conv`}>
                <img src={backimg} alt="retour"></img>
              </NavLink>
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default UserMessages;
