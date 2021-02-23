import { Button } from "@material-ui/core";
import React from "react";
import PageFrame from "../../components/PageFrame";
import { useHistory } from "react-router-dom";

import paths from "../../../configs/paths";
import "./style.css";

const Landing = () => {
  const history = useHistory();
  return (
    <PageFrame className="landing-container">
      <h1>NubeS3 Cloud Storage</h1>
      <h2>Access your data anytime, anywhere</h2>
      <Button
        variant="outlined"
        style={{ backgroundColor: "#b7ecea" }}
        onClick={() => {
          history.push(paths.LOGIN);
        }}
      >
        GET STARTED
      </Button>
    </PageFrame>
  );
};

export default Landing;
