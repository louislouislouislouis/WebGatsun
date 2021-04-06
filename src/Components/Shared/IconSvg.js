import React from "react";
import { NavLink } from "react-router-dom";

const IconSvg = (props) => {
  return (
    <React.Fragment>
      {props.link && (
        <NavLink to={props.link}>
          <div className={props.className || "default"}>
            <img
              src={props.src}
              alt={props.alt}
              className="IconsvgImg"
              style={{
                width: props.width || "90px",
                borderRadius: props.borderRadius || "90px",
              }}
            ></img>
            <p>{props.text}</p>
          </div>
        </NavLink>
      )}
      {!props.link && (
        <div className="Iconsvg" onClick={props.onClick}>
          <img
            style={{
              width: props.width || "90px",
              borderRadius: props.borderRadius || "90px",
            }}
            src={props.src}
            alt={props.alt}
            className="IconsvgImg"
          ></img>
          <p>{props.text}</p>
        </div>
      )}
    </React.Fragment>
  );
};

export default IconSvg;
