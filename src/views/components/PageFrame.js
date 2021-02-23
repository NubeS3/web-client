import React from "react";

import Header from "../components/Header";

const PageFrame = (props) => {
  return (
    <>
      <Header />
      {props.children}
    </>
  )
};

export default PageFrame;
