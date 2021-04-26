import React from "react";
import PageFrame from "../../components/PageFrame";
import { connect } from "react-redux";

import paths from "../../../configs/paths";
import "./style.css";
import { Typography } from "@material-ui/core";

const Landing = (props) => {
  return (
    <PageFrame className="landing-container">
      <Typography variant="h3" className="">NubeS3 Cloud Storage</Typography>
      <Typography variant="h3" >Access your data anytime, anywhere</Typography>
      <button
        className="bg-light-blue text-white active:bg-light-blue font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outlined focus:outline-none mr-1 my-3"
        onClick={() => {
          if (props.isValidAuthentication) {
            props.history.push(paths.DASHBOARD);
          } else {
            props.history.push(paths.LOGIN);
          }
          // props.history.push(paths.DASHBOARD);
        }}
      >
        GET STARTED
      </button>
    </PageFrame>
  );
};

const mapStateToProps = (state) => ({
  isValidAuthentication: state.authen.isValidAuthentication,
});

export default connect(mapStateToProps)(Landing);
