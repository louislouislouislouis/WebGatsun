import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import { useAuth } from "./Hooks/auth-hooks";
import { AuthContext } from "./Context/auth-context";

import MainNav from "./Components/Nav/MainNav";
import Home from "./Pages/Home/Home";
import Allusers from "./Pages/User/Public/AllUsers";
import Profil from "./Pages/User/Public/Profil";
import UserMessages from "./Pages/User/Private/userMessages";
import Conv from "./Pages/User/Private/Conv";
import Auth from "./Pages/Auth/Auth";
import NoRight from "./Pages/User/Public/NoRight";

//import Waitings from "./Components/Shared/Waitings";

function App() {
  const { token, login, logout, UserId } = useAuth();
  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact={true}>
          <Home />
        </Route>
        <Route path="/user/allusers" exact={true}>
          <Allusers />
        </Route>
        <Route path="/conv/:convId" exact={true}>
          <UserMessages />
        </Route>
        <Route path="/:userId/conv" exact={true}>
          <Conv />
        </Route>
        <Route path="/:userId/profil" exact={true}>
          <Profil />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact={true}>
          <Home />
        </Route>
        <Route path="/auth" exact={true}>
          <Auth />
        </Route>
        <Route path="/conv/:convId" exact={true}>
          <NoRight />
        </Route>
        <Route path="/:userId/conv" exact={true}>
          <NoRight />
        </Route>
        <Route path="/user/allusers" exact={true}>
          <Allusers />
        </Route>
        <Route path="/:userId/profil" exact={true}>
          <Profil />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }

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
        {routes}
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
