import React,{useContext} from "react"
import Input from "../Components/Shared/Input"
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
  } from "../util/validators";
  import { AuthContext } from "../context/auth-context";

import { useForm } from "../Hooks/form-hook";
const Auth = () => {
    const auth = useContext(AuthContext);
  const [authState, inputhandler, setformData] = useForm(
    {
      password: {
        value: "",
        isValid: false,
      },
      email: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const userUpdateSubmitHandler = async (e)=>{
      e.preventDefault()
      console.log(authState)
      try {
        const response = await fetch(
        `http://localhost:5000/api/auth/log`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body:  JSON.stringify({
            email: authState.inputs.email.value,
            password: authState.inputs.password.value,
          }),
        }
      );
      const responseData = await response.json();
      auth.login(responseData.userId, responseData.token);
      
      console.log(responseData)
    }catch(err){console.log(err)}
     
  }
  return (
    <React.Fragment>
    
    <div className="List">
      HEO
    </div>
    <form onSubmit={userUpdateSubmitHandler}>
    <Input
     id="email"
     element="input"
     type="text"
     label="Your Email"
     errorText="please enter a valid email"
     validators={[VALIDATOR_EMAIL()]}
     onInput={inputhandler}
    />
    <Input
     id="password"
     element="input"
     type="password"
     label="Password"
     errorText="Your password must be at least 8characteres"
     validators={[VALIDATOR_MINLENGTH(1)]}
     onInput={inputhandler}
    />
        <button type="submit"  disabled={!authState.isValid} >
                {"LOGIN"}
        </button>
    </form>
  </React.Fragment>
  );
};

export default Auth;
