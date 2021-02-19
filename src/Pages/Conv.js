import React,{useEffect, useState} from "react";
import { NavLink, useParams } from "react-router-dom";
import OneConv from "../Components/Shared/OneConv";
import "./Conv.css";
const Conv = () => {
  const userId = useParams().userId;
  const [myconv,setmyconv]=useState();
  const [userimg,setuserimg]=useState([]);
  useEffect(() => {
    const sendReq = async () => {
      try {
        const convsresponse = await fetch(
          `http://localhost:5000/api/conv/w/${userId}`
        );
        const convs = await convsresponse.json();
        if (convs)
        {
          setmyconv(convs)
        }
        getimage(convs)
      } catch (err) {}
      
    };
    sendReq();
    
  }, []);
  const test = ()=>{
    console.log(userimg)
    console.log(myconv)
}
  const getimage= async (convs)=>{
    let arrayimg=[]
    for (const conv of convs) {
      const parts=conv.participants
      let mesparticipantsimg=[]
      for (const part of parts) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/user/${part}`
          );
          const user = await response.json();
          mesparticipantsimg.push(user.img)

        } catch (err) {}
      //console.log(mesparticipantsimg)
      
      }
      arrayimg.push({conv:conv.id,partimg:mesparticipantsimg})
    }
    //console.log(arrayimg)
    setuserimg(arrayimg)
    
    
  }


  
  return (
    <React.Fragment>
    {myconv && userimg &&
    <div className="List">
      {myconv && <div onClick={test}>"ICI</div>}
      {myconv.map((conv) => {
        let lol=(userimg.find(convp=>convp.conv===conv.id))
        if (lol){
        //console.log(conv.participants)
        return(
          <NavLink to={`/${userId}/conv/${conv.id}`}>
            <OneConv
              /* with={conv.participants.filter((part) => part !== userId)} */
              with={lol.partimg}
            />
          </NavLink>
        );
        }
      }
      )}
    </div>
  }
  </React.Fragment>
  );
};

export default Conv;
