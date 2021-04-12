import React from "react";

import "./Waitings.css";
import Lottie from "react-lottie";
import Backdrop from "./Backdrop";

const Waitings = (props) => {
  let defaultOptions;
  if (!props.little) {
    defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: require("./../../File/AnimayionData/46472-lurking-cat.json"),
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };
  } else {
    defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: require("./../../File/AnimayionData/8920-loading.json"),
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };
  }
  const content = (
    <React.Fragment>
      {props.backdrop && <Backdrop onClick={props.onClick} />}
      <div
        className="Attente"
        style={{
          position: props.pos,
          left: props.left,
          transform: props.transform,
          bottom: props.bottom,
        }}
      >
        <Lottie
          options={defaultOptions}
          height={props.height}
          width={props.width}
        />
      </div>
    </React.Fragment>
  );
  return content;
};

export default Waitings;
