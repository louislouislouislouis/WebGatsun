import React, { useReducer, useEffect } from "react";

import { validate, VALIDATOR_REQUIRE } from "../../util/validators";

import "./Input.css";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(
          action.val,
          action.validators || [VALIDATOR_REQUIRE()]
        ),
      };
    case "TOUCH":
      return {
        ...state,
        isTouch: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialvalue || "",
    isTouch: false,
    isValid: props.initialvalid || false,
  });
  useEffect(() => {
    if (props.onclear) {
      dispatch({
        type: "CHANGE",
        val: "",
      });
    }
  }, [props.onclear]);
  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, onInput, value, isValid]);

  const ChangeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={ChangeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        style={{ height: props.height, borderRadius: props.borderRadius }}
        rows={props.row || 9}
        onChange={ChangeHandler}
        value={inputState.value}
        onBlur={touchHandler}
      />
    );

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouch && "form-control--invalid"
      } ${props.explication && "form-control--explication"}`}
    >
      <div className={`${props.explication ? "explicationh1" : ""}`}>
        <label htmlFor={props.id}>{props.label}</label>
        {props.explication && (
          <div className="interrogation" onClick={props.onClickexplication}>
            <div className="roundedinter">?</div>
          </div>
        )}
      </div>
      {element}

      {!inputState.isValid && inputState.isTouch && props.errorText && (
        <p>{props.errorText}</p>
      )}
    </div>
  );
};

export default Input;
