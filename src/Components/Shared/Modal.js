import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import Backdrop from "./Backdrop";
import "./modal.css";

import svgquit from "../../File/svg/croix.svg";

const ModamOverlay = (props) => {
  const content = (
    <React.Fragment>
      <div
        className={`modal ${props.className}`}
        style={{
          height: props.height,
          top: props.top,
          transform: props.transform,
          position: props.position,
          color: props.color,
          maxHeight: props.maxheight,
        }}
      >
        <img
          className="imgquitmodal"
          src={svgquit}
          alt="quit"
          onClick={props.onCancel}
        />
        {props.header && (
          <header className={`modal__header ${props.headerClass}`}>
            <h2>{props.header}</h2>
          </header>
        )}
        {/* <form
        onSubmit={
          props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
        }
      > */}
        <div
          style={{ overflow: props.overflow }}
          className={`modal__content ${props.contentClass}`}
        >
          {props.children}
        </div>
        {props.footer && (
          <footer className={`modal__footer ${props.footerClass}`}>
            {props.footer}
          </footer>
        )}
        {/*   </form> */}
      </div>
    </React.Fragment>
  );
  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
};

const Modal = (props) => {
  return (
    <React.Fragment>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
      >
        <ModamOverlay {...props} />
      </CSSTransition>
    </React.Fragment>
  );
};

export default Modal;
