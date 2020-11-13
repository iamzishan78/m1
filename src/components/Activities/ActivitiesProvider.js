import React from "react";
import { ActivitiesContextProvider } from "./ActivitiesContext";
import { makeStyles } from "@material-ui/core/styles";
import Activities from "./Activities";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  activitiesWrapper: {
    width: "100%",
    height: "100%",
  },
}));

export function ActivitiesProvider(props) {
  let classes = useStyles();
  return (
    <ActivitiesContextProvider>
      <Activities className={classes.activitiesWrapper}>
        {props.children}
      </Activities>
    </ActivitiesContextProvider>
  );
}

export default ActivitiesProvider;
