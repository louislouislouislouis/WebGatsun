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
  const { error2, sendRequest2 } = useHttpClient("2");
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

  //Charge UserInfos
  useEffect(() => {
    const sendReq = async () => {
      if (myconv) {
        setmyconvcontal(myconv);
        for (const [key, value] of Object.entries(myconv)) {
          try {
            const response = await sendRequest2(
              `http://localhost:5000/api/user/${value.paticipant}`,
              "GET",
              null,
              { Authorization: "Bearer " + auth.token }
            );

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
  }, [userId, sendRequest2, auth, myconv]);

  //IN CASE OF ERROR RETURN HOME HANDLER
  const LinktoHome = () => {
    history.push("/");
  };

  return (
    <React.Fragment>
      <ErrorModal
        error={error || error2}
        onClear={error ? clearError : error2}
        onClearAction={LinktoHome}
        action="Go Home"
      />
      <div className="List">
        <h1>My Convs</h1>
        {isLoading && <Waitings height="100px" width="100px" />}
        {convtotal && Object.entries(convtotal).length !== 0 && (
          <React.Fragment>
            {Object.entries(convtotal).map((conv, index) => {
              return (
                <NavLink to={`/conv/${conv[0]}`} key={conv + index}>
                  <Button
                    height="112px"
                    orange
                    width="400px"
                    borderradius="38px"
                    maxWidth="90vw"
                  >
                    <div className="contentConve">
                      <Avatar
                        image={conv[1].paticipant.image}
                        alt=""
                        width={"75px"}
                        widthpopa={"90px"}
                        position="absolute"
                        left="5px"
                        border="0px"
                      />
                      <h1
                        style={{
                          position: "absolute",
                          left: "100px",
                          textShadow: "0px 3px 6px rgba(0,0,0,0.16)",
                        }}
                      >
                        {conv[1].paticipant.prenom ? (
                          `${conv[1].paticipant.prenom} ${conv[1].paticipant.nom}`
                        ) : (
                          <Waitings little />
                        )}
                      </h1>
                    </div>
                  </Button>
                </NavLink>
              );
            })}
          </React.Fragment>
        )}
        <NavLink to={`/user/allusers`}>
          <h1 style={{ fontSize: "20px" }}>Start a new conversation</h1>
        </NavLink>
      </div>

      {myconv && myconv.length === 0 && (
        <NavLink to={`/user/allusers`}>
          You don't have any conversation yet. Start one?
        </NavLink>
      )}
    </React.Fragment>
  );
};

export default Conv;
