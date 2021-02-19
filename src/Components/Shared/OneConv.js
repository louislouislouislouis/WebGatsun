import React from "react";
import Avatar from "./Avatar";

import "../Shared/OneConv.css";

const OneConv = (props) => {
  
  
  //console.log(img);
  return (
    <div className="conv">
      <div className="icon1">
        {props.with.map((image) => {
          return <Avatar image={image} width={"50px"}></Avatar>;
        })}
      </div>
      {/*   <div className="to">
        <h1>{props.to}</h1>
      </div> */}
    </div>
  );
};

export default OneConv;
