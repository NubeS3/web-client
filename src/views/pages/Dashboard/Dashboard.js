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
} from "recharts";
import store from "../../../store/store";
import { getTotalBandwidth } from "../../../store/user/bandwidthReport";

const Dashboard = (props) => {
  const [value, setValue] = React.useState(0);
  const [totalBandwidth, setTotalBandwidth] = React.useState([]);

  React.useEffect(() => {
    let data = [];
    let curDate = new Date();
    let firstDate = new Date(curDate.getFullYear(), curDate.getMonth(), 1);
    let gap = curDate.getDate();
    let milestone = firstDate.getTime();
    for (let i = 1; i <= gap; i++) {
      store.dispatch(
        getTotalBandwidth({
          authToken: props.authToken,
          from: milestone + 1000 * 3600 * 24 * (i - 1),
          to: milestone + 1000 * 3600 * 24 * i,
        })
      );
      data.push({
        name: i.toString(),
        uv: props.data / 8 / 1024,
        pv: 2400,
        amt: 2400,
      });
    }
    setTotalBandwidth(data);
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const renderLineChart = (data, width = 600, height = 300) => (
    <LineChart
      width={width}
      height={height}
      data={data}
      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
    >
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
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
        {renderLineChart(totalBandwidth)}
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
  const loading = state.bandwidthReport.loading;
  const err = state.bandwidthReport.err;
  const authToken = state.authen.authToken;
  return { data, loading, err, authToken };
};

export default connect(mapStateToProps)(Dashboard);
