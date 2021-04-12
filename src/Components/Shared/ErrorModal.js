import React from "react";
import ReactDOM from "react-dom";
import Backdrop from "./Backdrop";
import { CSSTransition } from "react-transition-group";
import svgquit from "../../File/svg/croix.svg";

import "./ErrorModal.css";

const Errormodal = (props) => {
  const content = (
    <React.Fragment>
      {props.error && (
        <Backdrop
          show={props.error}
          classname="Errorbackdrop"
          onClick={props.onClear}
        />
      )}
      <CSSTransition
        in={!!props.error}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
      >
        <div
          className="ErrorModal"
          onCancel={props.onClear}
          header="An Error Occurred!"
          footer={
            <button onClick={props.onClearAction}>
              {props.action || "Ok"}
            </button>
          }
        >
          <img
            className="imgquitmodal"
            src={svgquit}
            alt="quit"
            onClick={props.onClear}
          />
          <h1>An Error Occured</h1>
          <p>{props.error}</p>
        </div>
      </CSSTransition>
    </React.Fragment>
  );
  return ReactDOM.createPortal(content, document.getElementById("eror-hook"));
};

export default Errormodal;
