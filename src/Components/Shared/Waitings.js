import React from "react";

import "./Waitings.css";
import Lottie from "react-lottie";

const Waitings = (props) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require("./../../File/AnimayionData/46472-lurking-cat.json"),
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="Attente">
      <Lottie options={defaultOptions} height={200} width={200} />
    </div>
  );
};

export default Waitings;
