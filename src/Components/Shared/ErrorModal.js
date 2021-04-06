import React from "react";

import Modal from "./Modal";

const AuthModal = (props) => {
  return (
    <Modal
      onCancel={props.onClear}
      header="An Error Occurred!"
      show={!!props.error}
      footer={
        <button onClick={props.onClearAction}>{props.action || "Ok"}</button>
      }
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default AuthModal;
