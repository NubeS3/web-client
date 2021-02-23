import React from "react";
import { useHistory } from "react-router-dom";

import { Button } from "@material-ui/core";
import LogoHeader from "./LogoHeader";
import paths from "../../../configs/paths";
import "./style.css";

const UnauthHeader = (props) => {
  const history = useHistory();
  return (
    <div className="unauth-header">
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <LogoHeader />
        <h3 style={{ color: "#ffffff" }}>NubeS3</h3>
      </div>
      <div>
        <Button
          variant="contained"
          style={{
            backgroundColor: "#b7ecea",
            marginRight: "10px",
          }}
          onClick={() => history.push(paths.LOGIN)}
        >
          Sign In
        </Button>
        <Button
          variant="contained"
          style={{
            backgroundColor: "#b7ecea",
            marginRight: "10px",
          }}
          onClick={() => history.push(paths.REGISTER)}
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
};

export default UnauthHeader;
