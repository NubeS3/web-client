import React from "react";

import Header from "../components/Header";

const PageFrame = (props) => {
  return (
    <>
      <Header />
      <div {...props}>{props.children}</div>
    </>
  );
};

export default PageFrame;
