import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import PageFrame from "../../components/PageFrame";
import PersistentDrawer from "../../components/PersistentDrawer"
import paths from "../../../configs/paths";
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from  '@material-ui/core/Typography'
import AppBar from '@material-ui/core/AppBar'

const Dashboard = (props) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
      setValue(newValue);
  };

  if (!props.isValidAuthentication) {
    return <Redirect to={paths.LOGIN} />;
  }


  return (
        <PersistentDrawer>
          <AppBar position="static">
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                <Tab label="Dashboard" {...a11yProps(0)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
              Dashboard
          </TabPanel>
        </PersistentDrawer>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
      <div
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
          {...other}
      >
          {value === index && (
              <Box p={3}>
                  <Typography>{children}</Typography>
              </Box>
          )}
      </div>
  );
}

/*TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};*/

function a11yProps(index) {
  return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
  };
}

const mapStateToProps = (state) => ({
  isValidAuthentication: state.authenticateReducer.isValidAuthentication,
});

export default connect(mapStateToProps)(Dashboard);
