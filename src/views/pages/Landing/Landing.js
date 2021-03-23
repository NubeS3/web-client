import React from "react";
import PageFrame from "../../components/PageFrame";
import { connect } from "react-redux";

import paths from "../../../configs/paths";
import "./style.css";

const Landing = (props) => {
  return (
    <PageFrame className="landing-container">
      <h1>NubeS3 Cloud Storage</h1>
      <h2>Access your data anytime, anywhere</h2>
      <button
        className="bg-light-blue text-white active:bg-light-blue font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outlined focus:outline-none mr-1 mb-1"
        onClick={() => {
          if (props.isValidAuthentication) {
            props.history.push(paths.DASHBOARD);
          } else {
            props.history.push(paths.LOGIN);
          }
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
