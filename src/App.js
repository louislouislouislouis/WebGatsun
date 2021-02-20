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
import Conv from "./Pages/Conv";
import Auth from "./Pages/Auth"
import { useAuth } from "./Hooks/auth-hooks";
import { AuthContext } from "./context/auth-context";

function App() {
  const { token, login, logout, UserId } = useAuth();
  const [isLoggedin, setisLoggedin] = useState(false);
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        login: login,
        logout: logout,
        userId: UserId,
      }}
    >
    <Router>
      <MainNav />
      {isLoggedin && <Waitings />}
      <Switch>
        <Route path="/myprofile" exact={true}>
          <User />
        </Route>
        <Route path="/auth" exact={true}>
          <Auth />
        </Route>
        <Route path="/:userId/conv" exact={true}>
          <Conv></Conv>
        </Route>
        <Route path="/:userId/conv/:convId" exact={true}>
          <UserMessages />
        </Route>
        <Route path="/:userId" exact={true}>
          <Myflow />
        </Route>
        <Redirect to="/" />
      </Switch>
    </Router>
    </AuthContext.Provider>
  );
}

export default App;
