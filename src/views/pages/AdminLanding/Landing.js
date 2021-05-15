import React from "react";
import PageFrameAdmin from "../../components/PageFrameAdmin";
import { connect } from "react-redux";

import paths from "../../../configs/paths";
import "./style.css";
import { Typography } from "@material-ui/core";

const AdminLanding = (props) => {
  return (
    <PageFrameAdmin className="landing-container">
      <Typography variant="h3" className="">
        NubeS3 Cloud Storage
      </Typography>
      <Typography variant="h3">THIS IS THE NUBES3 ADMIN PAGE</Typography>
      <button
        className="bg-light-blue text-white active:bg-light-blue font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outlined focus:outline-none mr-1 my-3"
        onClick={() => {
          if (props.isValidAuthentication) {
            props.history.push(paths.DASHBOARD_ADMIN);
          } else {
            props.history.push(paths.LOGIN_ADMIN);
          }
          // props.history.push(paths.DASHBOARD);
        }}
      >
        GO TO ADMIN CONSOLE
      </button>
    </PageFrameAdmin>
  );
};

const mapStateToProps = (state) => ({
  isValidAuthentication: state.adminAuthen.isAdminValidAuthentication,
});

export default connect(mapStateToProps)(AdminLanding);
