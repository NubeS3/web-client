import React, { useState } from "react";

import { AppBar, Tab, Tabs } from "@material-ui/core";

import Browser from "./Browser/Browser";
import "./style.css";
import PersistentDrawer from "../../components/PersistentDrawer";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`storage-tabpanel-${index}`}
      aria-labelledby={`storage-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
};

const a11yProps = (index) => {
  return {
    id: `storage-tab-${index}`,
    "aria-controls": `storage-tabpanel-${index}`,
  };
};

const Storage = (props) => {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <PersistentDrawer title="Storage">
      <AppBar
        position="static"
        style={{ backgroundColor: "white", color: "black" }}
      >
        <Tabs value={value} onChange={handleChange}>
          <Tab className="focus:outline-none" label="Browser" {...a11yProps(0)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Browser />
      </TabPanel>
    </PersistentDrawer>
  );
};

export default Storage;
