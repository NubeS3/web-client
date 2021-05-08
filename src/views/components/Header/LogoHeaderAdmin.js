import React from "react";
import { withRouter, useHistory } from "react-router-dom";

import { Typography } from "@material-ui/core";
import logo from "../../../assets/logo-placeholder-png.png";
import paths from "../../../configs/paths";

import "./style.css";

const LogoHeaderAdmin = (props) => {
  const history = useHistory();
  return (
    <div className="logo-header" onClick={() => history.push(paths.BASE_ADMIN)}>
      <img alt="nubes3-cs" src={logo} />
      <Typography style={{ flexGrow: "1", fontSize: "30px"}}>NubeS3</Typography>
    </div>
  );
};

export default withRouter(LogoHeaderAdmin);
