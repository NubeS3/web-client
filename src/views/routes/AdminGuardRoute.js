import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import paths from "../../configs/paths";

const AdminGuardRoute = ({
  component: Component,
  isValidAuthentication,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      isValidAuthentication === true ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: paths.LOGIN_ADMIN,
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

const mapStateToProps = (state) => {
  console.log(state.adminAuthen.isAdminValidAuthentication);
  return {
    isValidAuthentication: state.adminAuthen.isAdminValidAuthentication,
  };
};

export default connect(mapStateToProps)(AdminGuardRoute);
