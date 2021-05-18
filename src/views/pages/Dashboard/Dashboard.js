import React from "react";
import { connect } from "react-redux";

import PersistentDrawer from "../../components/PersistentDrawer";
import Box from "@material-ui/core/Box";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Label,
} from "recharts";
import store from "../../../store/store";
import {
  getMonthUsageBandwidth,
  getTotalUsageBandwidth,
} from "../../../store/user/bandwidthReport";
import { Grid } from "@material-ui/core";

const Dashboard = (props) => {
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    store.dispatch(getMonthUsageBandwidth({ authToken: props.authToken }));
    store.dispatch(getTotalUsageBandwidth({ authToken: props.authToken }));
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const CustomTooltip = ({ payload, active }, ...props) => {
    if (active && payload && payload.length) {
      console.log(payload);
      return <p>{`${payload[0].value} MB`}</p>;
    }
    return null;
  };

  const renderLineChart = (data, width = 1000, height = 500) => (
    <LineChart
      width={width}
      height={height}
      data={data}
      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
    >
      <Line type="monotone" dataKey="bandwidth" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="day">
        <Label value="Days" offset={0} position="insideBottom" />
      </XAxis>
      <YAxis
        label={{
          value: "Bandwidth usage (MB)",
          angle: -90,
          position: "insideLeft",
        }}
      />
      <Tooltip content={<CustomTooltip />} />
    </LineChart>
  );

  return (
    <PersistentDrawer title="Dashboard">
      <AppBar
        position="static"
        style={{ backgroundColor: "white", color: "black" }}
      >
        <Tabs value={value} onChange={handleChange}>
          <Tab
            className="focus:outline-none"
            label="Dashboard"
            {...a11yProps(0)}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Grid align="center">
          {renderLineChart(props.data)}
          <p className="mt-10 text-lg font-bold">Total bandwidth usage in this month: {props.total} MB</p>
        </Grid>
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
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const mapStateToProps = (state) => {
  const data = state.bandwidthReport.data;
  const total = state.bandwidthReport.total;
  const loading = state.bandwidthReport.loading;
  const err = state.bandwidthReport.err;
  const authToken = state.authen.authToken;
  return { data, total, loading, err, authToken };
};

export default connect(mapStateToProps)(Dashboard);
