import React from "react";
import { connect } from "react-redux";

import AuthHeaderAdmin from "./Header/AuthHeaderAdmin";
import UnauthHeaderAdmin from "./Header/UnauthHeaderAdmin";

const Header = (props) => {
  if (props.isValidAuthentication) {
    return <AuthHeaderAdmin />;
  } else {
    return <UnauthHeaderAdmin />;
  }
};

const mapStateToProps = (state) => ({
  isValidAuthentication: state.adminAuthen.isAdminValidAuthentication,
});

export default connect(mapStateToProps)(Header);
