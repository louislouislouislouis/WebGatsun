import React, { useState } from "react";

import MainNav from "./Components/Nav/MainNav";
import Waitings from "./Components/Shared/Waitings";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import User from "./Pages/User";
import Myflow from "./Pages/Myflow";
import UserMessages from "./Pages/userMessages";

function App() {
  const [isLoggedin, setisLoggedin] = useState(false);
  return (
    <Router>
      <MainNav />
      {isLoggedin && <Waitings />}
      <Switch>
        <Route path="/myprofile" exact={true}>
          <User />
        </Route>
        <Route path="/:userId/message" exact={true}>
          <UserMessages />
        </Route>
        <Route path="/:userId" exact={true}>
          <Myflow />
        </Route>

        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;
