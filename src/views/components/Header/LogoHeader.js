import React from "react";
import { withRouter, useHistory } from "react-router-dom";

import logo from "../../../assets/logo-placeholder-png.png";
import paths from "../../../configs/paths";

import "./style.css";

const LogoHeader = (props) => {
  const history = useHistory();
  return (
    <div className="logo-header" onClick={() => history.push(paths.BASE)}>
      <img alt="nubes3-cs" src={logo} />
    </div>
  );
};

export default withRouter(LogoHeader);
