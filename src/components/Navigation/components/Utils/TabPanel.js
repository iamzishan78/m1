import React  from "react";
import { makeStyles } from "@material-ui/core/styles";

import Box from "@material-ui/core/Box";

import PropTypes from "prop-types";


const useStyles = makeStyles(theme => ({
  tabPanel: {
    display: "flex",
    flexDirection: "column"
  }
}));

export default function  TabPanel ( props ) {
    const classes = useStyles();
    const { children, value, index, ...other } = props;
    // console.log(props)
    return (
      <div
        className={classes.tabPanel}
        role="tabpanel"
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </div>
    );
  };
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};