import React from "react";
import Avatar from "../Shared/Avatar";

import "./OneConv.css";

const OneConv = (props) => {
  //console.log(img);
  return (
    <div className="conv">
      <div className="icon1">
        <Avatar image={props.with} width={"50px"} key={props.with}></Avatar>;
      </div>
    </div>
  );
};

export default OneConv;
