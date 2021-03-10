import { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";

import Landing from "./views/pages/Landing/Landing";
import Dashboard from "./views/pages/Dashboard/Dashboard";
import Storage from "./views/pages/Storage/Storage";
import SignUp from "./views/pages/Register/Register";
import SignIn from "./views/pages/Login/Login";
import { verifyAuthentication } from "./store/actions/authenticateAction";
import paths from "./configs/paths";
import Otp from "./views/pages/Otp/Otp";

const App = (props) => {
  const mount = async () => {
    await props.validateAuthentication();
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
    <div className="flex-col">
      <Router basename="/">
        <Switch>
          <Route exact path={paths.BASE}>
            <Landing />
          </Route>
          <Route exact path={paths.DASHBOARD}>
            <Dashboard />
          </Route>
          <Route exact path={paths.STORAGE}>
            <Storage />
          </Route>
          <Route exact path={paths.REGISTER}>
            <SignUp />
          </Route>
          <Route exact path={paths.LOGIN}>
            <SignIn />
          </Route>
          <Route exact path={paths.OTP}>
            <Otp/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isValidating: state.authenticateReducer.isValidating,
});

const mapDispatchToProps = (dispatch) => ({
  validateAuthentication: () => dispatch(verifyAuthentication()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
