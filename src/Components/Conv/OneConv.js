import React from "react";
import Avatar from "../Shared/Avatar";

import "./OneConv.css";

const OneConv = (props) => {
  //console.log(img);
  return (
    <div className="conv">
      <div className="icon1">
        {props.with.map((image) => {
          return <Avatar image={image} width={"50px"} key={image}></Avatar>;
        })}
      </div>
    </div>
  );
};

export default OneConv;
