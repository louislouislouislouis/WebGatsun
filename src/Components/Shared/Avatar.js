import React from "react";

import "./Avatar.css";

const Avatar = (props) => {
  return (
    <div
      className={`avatar`}
      style={{
        width: props.widthpopa,
        position: props.position,
        left: props.left,
      }}
    >
      <img
        src={props.image}
        alt={props.alt}
        style={{
          width: props.width,
          height: props.width,
          border: props.border,
        }}
        onClick={props.onClick}
      />
    </div>
  );
};

export default Avatar;
