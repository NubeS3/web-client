import React, { useState } from "react";

import { AppBar, Icon, Tab, Tabs } from "@material-ui/core";
import { Storage as StorageIcon } from "@material-ui/icons";

import Browser from "./Browser/Browser";
import "./style.css";
import PersistentDrawer from "../../components/PersistentDrawer";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <PersistentDrawer>
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`storage-tabpanel-${index}`}
        aria-labelledby={`storage-tab-${index}`}
        {...other}
        >
        {value === index && children}
      </div>
    </PersistentDrawer>
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
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Icon style={{ width: "auto", height: "100%" }}>
          <StorageIcon style={{ width: "auto", height: "40px" }} />
        </Icon>
        <h2>Storage</h2>
      </div>
      <AppBar
        position="static"
        style={{ backgroundColor: "white", color: "black" }}
      >
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Browser" {...a11yProps(0)} />
          <Tab label="Trash bin" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Browser />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Trashbin
      </TabPanel>
    </div>
  );
};

export default Storage;
