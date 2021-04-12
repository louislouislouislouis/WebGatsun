import React from "react";
import ReactDOM from "react-dom";
import Backdrop from "./Backdrop";
import svgquit from "../../File/svg/croix.svg";
import { CSSTransition } from "react-transition-group";

import "./Confimationmodal.css";
import Button from "./Button";
const Confimationmodal = (props) => {
  const content = (
    <React.Fragment>
      {props.show && <Backdrop classname="cfback" onClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
      >
        <div className="confimationmodal">
          {" "}
          <img
            className="imgquitmodal"
            src={svgquit}
            alt="quit"
            onClick={props.onCancel}
          />
          {props.type === "Success" && <h1>Succès</h1>}
          {props.type === "Avert" && <h1>Attention</h1>}
          <p>{props.text}</p>
          <Button
            height="56px"
            text={props.type === "Success" ? "Ok!" : "Je confirme la demande"}
            fontsize="20px"
            borderradius="22px"
            width="100%"
            orange
            onClick={props.onClick}
          />
        </div>
      </CSSTransition>
    </React.Fragment>
  );
  return ReactDOM.createPortal(
    content,
    document.getElementById("confirmation-hook")
  );
};

export default Confimationmodal;
