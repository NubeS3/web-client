import React from "react";

import AdminHeader from "../components/AdminHeader";

const PageFrameAdmin = (props) => {
  return (
    <>
      <AdminHeader />
      <div {...props}>{props.children}</div>
    </>
  );
};

export default PageFrameAdmin;
