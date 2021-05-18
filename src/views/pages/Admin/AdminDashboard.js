import React from "react";
import Box from "@material-ui/core/Box";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import AdminDrawer from "../../components/AdminDrawer";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import LogTable from "../../components/LogTable/LogTable";

const AdminDashboard = (props) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const CustomTooltip = ({ payload, active }, ...props) => {
    if (active) {
      console.log(payload);
      return <p>{`${payload[0].value} kB`}</p>;
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
      <XAxis dataKey="day" />
      <YAxis />
      <Tooltip content={<CustomTooltip />} />
    </LineChart>
  );

  return (
    <AdminDrawer title="Dashboard">
      <AppBar
        position="static"
        style={{ backgroundColor: "white", color: "black" }}
      >
        <Tabs value={value} onChange={handleChange}>
          <Tab
            style={{ outline: "none" }}
            className="outline-none"
            label="Monitor Request Log"
            {...a11yProps(0)}
          />
          {/* <Tab style={{ outline: 'none' }} className="focus:outline-none" label="Access Key Log" {...a11yProps(1)} />
          <Tab style={{ outline: 'none' }} className="focus:outline-none" label="Key Pairs Log" {...a11yProps(2)} /> */}
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <LogTable />
      </TabPanel>
    </AdminDrawer>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
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

export default AdminDashboard;
