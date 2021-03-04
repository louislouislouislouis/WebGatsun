import React, { useEffect, useState, useContext } from "react";
import { useHistory, NavLink, useParams } from "react-router-dom";

import OneConv from "../../../Components/Conv/OneConv";
import { useHttpClient } from "../../../Hooks/http-hook";
import { AuthContext } from "../../../Context/auth-context";

import "./Conv.css";
import Waitings from "../../../Components/Shared/Waitings";
import ErrorModal from "../../../Components/Shared/ErrorModal";

const Conv = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const auth = useContext(AuthContext);
  const userId = useParams().userId;
  const [myconv, setmyconv] = useState();

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
          setmyconv(convsresponse.convs);
        }
      } catch (err) {}
    };
    sendReq();
  }, [userId, auth.token, sendRequest]);

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
      />
      {isLoading && <Waitings />}
      {myconv && myconv.length !== 0 && (
        <div className="List">
          {myconv.map((conv) => {
            return (
              <NavLink to={`/conv/${conv.id}`} key={userId + conv.id}>
                <OneConv with={conv.img} />
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
