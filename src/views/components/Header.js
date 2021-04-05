import React from "react";
import { connect } from "react-redux";

import AuthHeader from "./Header/AuthHeader";
import UnauthHeader from "./Header/UnauthHeader";

const Header = (props) => {
  if (props.isValidAuthentication) {
    return <AuthHeader />;
  } else {
    return <UnauthHeader />;
  }
};

const mapStateToProps = (state) => ({
  isValidAuthentication: state.authen.isValidAuthentication,
});

export default connect(mapStateToProps)(Header);
