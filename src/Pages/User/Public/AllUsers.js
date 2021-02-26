import React, { useEffect, useState, useContext } from "react";

import { useHttpClient } from "../../../Hooks/http-hook";
import { AuthContext } from "../../../Context/auth-context";
import Avatar from "../../../Components/Shared/Avatar";

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [allusers, setallusers] = useState();
  const auth = useContext(AuthContext);
  useEffect(() => {
    const sendReq = async () => {
      try {
        const convsresponse = await sendRequest(
          `http://localhost:5000/api/user/alluser`
        );
        if (convsresponse) {
          setallusers(convsresponse);
        }
      } catch (err) {}
    };
    sendReq();
  }, [sendRequest]);
  const handlecreateconv = async (e) => {
    const formData = new FormData();
    formData.append("part1", auth.userId);
    formData.append("part2", e);

    try {
      await sendRequest(
        `http://localhost:5000/api/conv`,
        "POST",
        JSON.stringify({
          part1: auth.userId,
          part2: e,
        }),
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
    } catch (err) {}
  };
  return (
    <React.Fragment>
      {allusers &&
        allusers.map((usr) => {
          return (
            <div key={usr.id} onClick={() => handlecreateconv(usr.id)}>
              <div className="name">{usr.id}</div>
              <Avatar image={usr.img} alt={usr.id} width="100px"></Avatar>
            </div>
          );
        })}
      <div>Pas de ll</div>
    </React.Fragment>
  );
};

export default Users;
