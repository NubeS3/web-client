import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import PageFrame from "../../components/PageFrame";
import paths from "../../../configs/paths";

const Dashboard = (props) => {
  if (!props.isValidAuthentication) {
    return <Redirect to={paths.LOGIN} />;
  }

  return (
    <PageFrame>
      <h2>Dashboard</h2>
    </PageFrame>
  );
};

const mapStateToProps = (state) => ({
  isValidAuthentication: state.authenticateReducer.isValidAuthentication,
});

export default connect(mapStateToProps)(Dashboard);
