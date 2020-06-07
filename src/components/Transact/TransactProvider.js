import React from "react";
import { TransactContextProvider } from "./TransactContext";
import { makeStyles } from "@material-ui/core/styles";
import Transact from "./Transact";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  transactWrapper: {
    width: "100%",
    height: "100%",
  },
}));

export default function TransactProvider(props) {
  let classes = useStyles();
  return (
    <TransactContextProvider>
      <Transact className={classes.transactWrapper}>{props.children}</Transact>
    </TransactContextProvider>
  );
}
