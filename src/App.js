import { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";

import store from "./store/store";
import { verifyAuthentication } from "./store/auth/auth";

import GuardRoute from "./views/routes/GuardRoute";
import Header from "./views/components/Header";
import Landing from "./views/pages/Landing/Landing";
import Dashboard from "./views/pages/Dashboard/Dashboard";
import Storage from "./views/pages/Storage/Storage";
import SignUp from "./views/pages/Register/Register";
import SignIn from "./views/pages/Login/Login";
import paths from "./configs/paths";
import Otp from "./views/pages/Otp/Otp";
import localStorageKeys from "./configs/localStorageKeys";

const App = (props) => {
  const mount = async () => {
    await store.dispatch(
      verifyAuthentication({
        authToken: localStorage.getItem(localStorageKeys.TOKEN),
      })
    );
  };

  useEffect(() => {
    mount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (props.isValidating) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <Router basename="/">
      <Switch>
        <Route exact path={paths.BASE} component={Landing} />
        <Route exact path={paths.REGISTER} component={SignUp} />
        <Route exact path={paths.LOGIN} component={SignIn} />
        <Route exact path={paths.OTP} component={Otp} />
        <GuardRoute exact path={paths.DASHBOARD} component={Dashboard} />
        <GuardRoute exact path={paths.STORAGE} component={Storage} />
        {/* <Route exact path={paths.DASHBOARD} component={Dashboard} />
        <Route exact path={paths.STORAGE} component={Storage} /> */}
      </Switch>
    </Router>
  );
};

const mapStateToProps = (state) => ({
  isValidating: state.authen.isValidating,
});

export default connect(mapStateToProps)(App);
