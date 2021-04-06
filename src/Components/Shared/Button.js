import React from "react";

const Button = (props) => {
  return (
    <button
      style={{
        height: props.height,
        fontSize: props.fontsize,
        borderRadius: props.borderradius,
        marginTop: props.topmargin,
        background: props.orange
          ? "linear-gradient(180deg, rgba(254,240,225,1) 0%, rgba(251,206,161,1) 100%)"
          : "linear-gradient(180deg, rgba(254,240,225,1) 0%, rgba(251,192,161,1) 100%)",
      }}
      type={props.type}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
};

export default Button;
