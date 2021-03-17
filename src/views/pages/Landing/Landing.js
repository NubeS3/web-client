import React from "react";
import PageFrame from "../../components/PageFrame";
import { connect } from "react-redux";

import { Button } from "@material-ui/core";

import paths from "../../../configs/paths";
import "./style.css";

const Landing = (props) => {
  return (
    <PageFrame className="landing-container">
      <h1>NubeS3 Cloud Storage</h1>
      <h2>Access your data anytime, anywhere</h2>
      <Button
        variant="outlined"
        style={{ backgroundColor: "#b7ecea" }}
        onClick={() => {
          if (props.isValidAuthentication) {
            props.history.push(paths.DASHBOARD);
          } else {
            props.history.push(paths.LOGIN);
          }
        }}
      >
        GET STARTED
      </Button>
    </PageFrame>
  );
};

const mapStateToProps = (state) => ({
  isValidAuthentication: state.authen.isValidAuthentication,
});

export default connect(mapStateToProps)(Landing);
