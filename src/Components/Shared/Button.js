import React from "react";

const Button = (props) => {
  return (
    <React.Fragment>
      {!props.nonbutton && (
        <button
          style={{
            height: props.height,
            fontSize: props.fontsize,
            borderRadius: props.borderradius,
            marginTop: props.topmargin,
            width: props.width,
            background: props.orange
              ? "linear-gradient(180deg, rgba(254,240,225,1) 0%, rgba(251,206,161,1) 100%)"
              : "linear-gradient(180deg, rgba(254,240,225,1) 0%, rgba(251,192,161,1) 100%)",
          }}
          type={props.type}
          disabled={props.disabled}
          onClick={props.onClick}
        >
          {props.children}
          {props.text}
        </button>
      )}
      {props.nonbutton && (
        <div
          className={props.className}
          onClick={props.onClick}
          style={{
            height: props.height,
            fontSize: props.fontsize,
            fontWeight: props.fontweight,
            borderRadius: props.borderradius,
            marginTop: props.topmargin,
            margin: props.margin,
            background: props.orange
              ? "linear-gradient(180deg, rgba(254,240,225,1) 0%, rgba(251,206,161,1) 100%)"
              : "linear-gradient(180deg, rgba(254,240,225,1) 0%, rgba(251,192,161,1) 100%)",
          }}
        >
          {props.children}
          <p style={{ margin: props.marginText }}>{props.text}</p>
        </div>
      )}
    </React.Fragment>
  );
};

export default Button;
