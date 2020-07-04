import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

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
      {value === index && (
        <Box style={{ padding: "0", margin: "10px" }} p={3}>
          {children}
        </Box>
      )}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  WellsDetailsCardAppBar: {
    backgroundColor: (props) => (props.white ? "#FFFFFF" : "rgb(1,17,51)"),
    color: (props) => (props.white ? "rgb(1,17,51)" : "#FFFFFF"),
  },
}));

export default function Taps(props) {
  const classes = useStyles(props);
  const [value, setValue] = React.useState(0);
  ////props.tabLabels brings an array of labels////
  ////props.tabPanels brings an array of panels////
  ////props.whichTapIsActive is an optional function to return the active index////
  ////props.white is an optional, a white taps version////
  ////props.backgroundColor is an optional////
  const { tabLabels, tabPanels } = props;

  const handleChange = (event, newValue) => {
    if (props.whichTapIsActive) {
      props.whichTapIsActive(newValue);
    }
    setValue(newValue);
  };

  return (
    <div
      style={{
        backgroundColor: props.backgroundColor
          ? props.backgroundColor
          : "#efefef",
      }}
      className={classes.root}
      id="M1nTaps"
    >
      <AppBar
        className={classes.WellsDetailsCardAppBar}
        position="static"
        color="default"
      >
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          {tabLabels.map((label, i) => {
            return <Tab key={i} label={label} {...a11yProps(i)} />;
          })}
        </Tabs>
      </AppBar>

      {tabPanels.map((panel, i) => (
        <TabPanel
          /*style={{background: "#efefef"}}*/ key={i}
          value={value}
          index={i}
        >
          {panel}
        </TabPanel>
      ))}
    </div>
  );
}
