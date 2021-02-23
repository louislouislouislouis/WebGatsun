import { useCallback, useReducer } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    case "SET_DATA":
      //console.log(action.inputs);
      return {
        inputs: action.inputs,
        isValid: action.FormisValid,
      };
    default:
      return state;
  }
};

export const useForm = (initialInputs, initialCalidity) => {
  const [formState, dispacth] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialCalidity,
  });
  const inputHandler = useCallback((id, value, isValid) => {
    dispacth({
      type: "INPUT_CHANGE",
      inputId: id,
      value: value,
      isValid: isValid,
    });
  }, []);
  const setFormData = useCallback((inputData, formValidity) => {
    //console.log(inputData);
    //console.log(formValidity);
    dispacth({
      type: "SET_DATA",
      inputs: inputData,
      FormisValid: formValidity,
    });
  }, []);

  return [formState, inputHandler, setFormData];
};
