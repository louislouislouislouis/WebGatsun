import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

import OneConv from "../../../Components/Conv/OneConv";

import "./Conv.css";
const Conv = () => {
  const userId = useParams().userId;
  const [myconv, setmyconv] = useState();
  const [userimg, setuserimg] = useState([]);

  useEffect(() => {
    const sendReq = async () => {
      try {
        const convsresponse = await fetch(
          `http://localhost:5000/api/conv/w/${userId}`
        );
        const listofconvs = await convsresponse.json();
        console.log(listofconvs);
        if (listofconvs) {
          setmyconv(listofconvs);
        }
        getimage(listofconvs);
      } catch (err) {}
    };
    sendReq();
  }, [userId]);

  const getimage = async (convs) => {
    let arrayimg = [];
    for (const conv of convs) {
      const parts = conv.participants;
      let mesparticipantsimg = [];
      for (const part of parts) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/user/${part}`
          );
          const user = await response.json();
          mesparticipantsimg.push(user.img);
        } catch (err) {}
        //console.log(mesparticipantsimg)
      }
      arrayimg.push({ conv: conv.id, partimg: mesparticipantsimg });
    }
    //console.log(arrayimg)
    setuserimg(arrayimg);
  };

  return (
    <React.Fragment>
      {myconv && myconv.length !== 0 && (
        <div className="List">
          {myconv.map((conv) => {
            let lol = userimg.find((convp) => convp.conv === conv.id);
            if (lol) {
              return (
                <NavLink
                  to={`/${userId}/conv/${conv.id}`}
                  key={userId + conv.id}
                >
                  <OneConv
                    /* with={conv.participants.filter((part) => part !== userId)} */
                    with={lol.partimg}
                  />
                </NavLink>
              );
            } else {
              return <div key={conv.id} />;
            }
          })}
          <NavLink to={`/user/allusers`}>"Start a new conversation"</NavLink>
        </div>
      )}
      {myconv && myconv.length === 0 && (
        <NavLink to={`/user/allusers`}>
          You don't haaave any conversation yet. Start one?
        </NavLink>
      )}
    </React.Fragment>
  );
};

export default Conv;
