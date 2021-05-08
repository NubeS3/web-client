import React from "react";
import { connect } from "react-redux";

import AuthHeader from "./Header/AuthHeader";
import UnauthHeaderAdmin from "./Header/UnauthHeaderAdmin";

const Header = (props) => {
  if (props.isValidAuthentication) {
    return <AuthHeader />;
  } else {
    return <UnauthHeaderAdmin />;
  }
};

const mapStateToProps = (state) => ({
  isValidAuthentication: state.authen.isValidAuthentication,
});

export default connect(mapStateToProps)(Header);
