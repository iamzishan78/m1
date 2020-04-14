import React, {
  useEffect,
  useState,
} from "react";

import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import MOR from "./MOR";
import RunSheet from "./RunSheet";

import "./style.css";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  TOAppBar: {
    backgroundColor: "rgb(1,17,51)",
    color: "#FFFFFF"
  }
}));







export default function TitleOpinionsTaps() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };





  return (
    <div className={classes.root} id="TOTaps">
      <AppBar className={classes.TOAppBar} position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="MOR" {...a11yProps(0)} />
          <Tab label="Runsheet" {...a11yProps(1)} />

{/*           <Tab label="Division Order" {...a11yProps(2)} />
          <Tab label="Associated Documents" {...a11yProps(3)} />
          <Tab label="Internal Note" {...a11yProps(4)} /> */}

        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} className="MORDiv">
        <MOR />
      </TabPanel>
      <TabPanel value={value} index={1} className="MORDiv">
        <RunSheet />
      </TabPanel>

      <TabPanel value={value} index={2}>
        - Coming Soon
      </TabPanel>
      <TabPanel value={value} index={3}>
        --Coming Soon
      </TabPanel>
      <TabPanel value={value} index={4}>
        ---Coming Soon
      </TabPanel>
      
    </div>
  );
}
