import { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";

import Dashboard from "./views/pages/Dashboard";
import SignUp from "./views/pages/Register/Register";
import SignIn from "./views/pages/Login/Login";
import { verifyAuthentication } from "./store/actions/authenticateAction";
import "./App.css";

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
    <div className="App">
      <h1>NubeS3 Cloud Storage</h1>
      <Router basename="/">
        <Switch>
          <Route exact path="/">
            <Dashboard />
          </Route>
          <Route exact path="/sign-up">
            <SignUp />
          </Route>
          <Route exact path="/sign-in">
            <SignIn />
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
