import React, { useEffect, useState, useContext } from "react";

import { AuthContext } from "../../../Context/auth-context";
import Avatar from "../../../Components/Shared/Avatar";

const Users = () => {
  const [allusers, setallusers] = useState();
  const auth = useContext(AuthContext);
  console.log(auth);
  useEffect(() => {
    const sendReq = async () => {
      try {
        const convsresponse = await fetch(
          `http://localhost:5000/api/user/alluser`
        );
        const convs = await convsresponse.json();
        if (convs) {
          setallusers(convs);
        }
      } catch (err) {}
    };
    sendReq();
  }, []);
  const handlecreateconv = async (e) => {
    console.log(e);
    try {
      await fetch(`http://localhost:5000/api/conv`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          part1: auth.userId,
          part2: e,
        }),
      });
    } catch (err) {}
  };
  console.log(allusers);
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
