import { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";

import store from "./store/store";
import { verifyAuthentication } from "./store/auth/auth";
import { verifyAdminAuthentication } from "./store/auth/admin_auth";

import GuardRoute from "./views/routes/GuardRoute";
import Landing from "./views/pages/Landing/Landing";
import Dashboard from "./views/pages/Dashboard/Dashboard";
import Storage from "./views/pages/Storage/Storage";
import SignUp from "./views/pages/Register/Register";
import SignIn from "./views/pages/Login/Login";
import paths from "./configs/paths";
import ConfirmedOTP from "./views/pages/Otp/Otp";
import localStorageKeys from "./configs/localStorageKeys";
import AdminLogin from "./views/pages/Admin/AdminLogin";
import AdminDashboard from "./views/pages/Admin/AdminDashboard";
import UserManageBoard from "./views/pages/Admin/UserManage";
import AdminManageBoard from "./views/pages/Admin/AdminManage";
import AdminLanding from "./views/pages/AdminLanding/Landing";
import AdminGuardRoute from "./views/routes/AdminGuardRoute";
const App = (props) => {
  const mount = async () => {
    await store.dispatch(
      verifyAuthentication({
        authToken: localStorage.getItem(localStorageKeys.TOKEN),
      })
    );
    await store.dispatch(
      verifyAdminAuthentication({
        adminToken: localStorage.getItem(localStorageKeys.TOKEN_ADMIN),
      })
    );
  };

  useEffect(() => {
    mount();
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
        <Route exact path={paths.BASE_ADMIN} component={AdminLanding} />
        <Route exact path={paths.REGISTER} component={SignUp} />
        <Route exact path={paths.LOGIN} component={SignIn} />
        <Route exact path={paths.OTP} component={ConfirmedOTP} />
        <Route exact path={paths.LOGIN_ADMIN} component={AdminLogin} />
        <GuardRoute exact path={paths.DASHBOARD} component={Dashboard} />
        <GuardRoute exact path={paths.STORAGE} component={Storage} />
        <AdminGuardRoute
          exact
          path={paths.DASHBOARD_ADMIN}
          component={AdminDashboard}
        />
        <AdminGuardRoute
          exact
          path={paths.USER_MANAGE}
          component={UserManageBoard}
        />
        <AdminGuardRoute
          exact
          path={paths.ADMIN_MANAGE}
          component={AdminManageBoard}
        />
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
