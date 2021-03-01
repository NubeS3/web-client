import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import PageFrame from "../../components/PageFrame";
import PersistentDrawer from "../../components/PersistentDrawer"
import paths from "../../../configs/paths";
import Header from "../../components/Header";

const Dashboard = (props) => {
  if (!props.isValidAuthentication) {
    return <Redirect to={paths.LOGIN} />;
  }

  return (
    <PageFrame className={"landing-container"}>
        <PersistentDrawer></PersistentDrawer>
    </PageFrame>
  );
};

const mapStateToProps = (state) => ({
  isValidAuthentication: state.authenticateReducer.isValidAuthentication,
});

export default connect(mapStateToProps)(Dashboard);
