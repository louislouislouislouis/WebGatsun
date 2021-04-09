import React, { useEffect, useState, useContext } from "react";
import { useHistory, NavLink, useParams } from "react-router-dom";

import { useHttpClient } from "../../../Hooks/http-hook";
import { AuthContext } from "../../../Context/auth-context";

import "./Conv.css";
import Waitings from "../../../Components/Shared/Waitings";
import ErrorModal from "../../../Components/Shared/ErrorModal";
import Button from "../../../Components/Shared/Button";
import Avatar from "../../../Components/Shared/Avatar";

const Conv = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const auth = useContext(AuthContext);
  const userId = useParams().userId;
  const [myconv, setmyconv] = useState({});
  const [convtotal, setmyconvcontal] = useState({});
  const history = useHistory();

  //GET CONV OF ONE USER AT PAGE LOAD

  useEffect(() => {
    const sendReq = async () => {
      try {
        const convsresponse = await sendRequest(
          `http://localhost:5000/api/conv/fbuser/${userId}`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token }
        );
        if (convsresponse) {
          convsresponse.convs.forEach((conv) => {
            console.log("aaaaa");
            const imageparts = conv.participants.filter(
              (part) => part !== auth.userId
            );
            setmyconv((prev) => ({
              ...prev,
              [conv.id]: { paticipant: imageparts },
            }));
          });
        }
      } catch (err) {}
    };
    sendReq();
  }, [userId, auth, sendRequest]);
  console.log(myconv);
  useEffect(() => {
    const sendReq = async () => {
      if (myconv) {
        setmyconvcontal(myconv);
        for (const [key, value] of Object.entries(myconv)) {
          try {
            const response = await sendRequest(
              `http://localhost:5000/api/user/${value.paticipant}`,
              "GET",
              null,
              { Authorization: "Bearer " + auth.token }
            );

            console.log(response);
            setmyconvcontal((prev) => ({
              ...prev,
              [key]: {
                paticipant: {
                  image: response.image,
                  nom: response.name,
                  prenom: response.firstname,
                },
              },
            }));
          } catch (err) {}
        }
      }
    };
    sendReq();
  }, [userId, sendRequest, auth, myconv]);
  //IN CASE OF ERROR RETURN HOME HANDLER
  const LinktoHome = () => {
    history.push("/");
  };
  if (convtotal) {
    console.log(Object.entries(convtotal));
  }

  return (
    <React.Fragment>
      <ErrorModal
        error={error}
        onClear={clearError}
        onClearAction={LinktoHome}
        action="Go Home"
      />
      {isLoading && <Waitings />}
      {convtotal && Object.entries(convtotal).length !== 0 && (
        <div className="List">
          {Object.entries(convtotal).map((conv, index) => {
            console.log(conv);
            return (
              <NavLink to={`/conv/${conv[0]}`} key={conv + index}>
                <Button height="112px" orange width="312px" borderradius="38px">
                  <div className="contentConve">
                    <Avatar
                      image={conv[1].paticipant.image}
                      alt=""
                      width={"75px"}
                      widthpopa={"90px"}
                    />
                    <h1>{`${conv[1].paticipant.prenom} ${conv[1].paticipant.nom}`}</h1>
                  </div>
                </Button>
              </NavLink>
            );
          })}
          <NavLink to={`/user/allusers`}>"Start a new conversation"</NavLink>
        </div>
      )}
      {myconv && myconv.length === 0 && (
        <NavLink to={`/user/allusers`}>
          You don't have any conversation yet. Start one?
        </NavLink>
      )}
    </React.Fragment>
  );
};

export default Conv;
