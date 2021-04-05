import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import paths from "../../configs/paths";

const GuardRoute = ({
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
            pathname: paths.LOGIN,
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

const mapStateToProps = (state) => ({
  isValidAuthentication: state.authen.isValidAuthentication,
});

export default connect(mapStateToProps)(GuardRoute);
