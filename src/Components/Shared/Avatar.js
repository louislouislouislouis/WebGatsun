import React from "react";

import "./Avatar.css";

const Avatar = (props) => {
  return (
    <div
      className={`avatar`}
      style={props.style}
      style={{ width: props.widthpopa }}
    >
      <img
        src={props.image}
        alt={props.alt}
        style={{ width: props.width, height: props.width }}
        onClick={props.onClick}
      />
    </div>
  );
};

export default Avatar;
