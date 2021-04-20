import React from "react";
import {DocumentContextProvider  } from "./DocumentContext";
import { makeStyles } from "@material-ui/core/styles";
import Document from "./Document";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  DocumentWrapper: {
    width: "100%",
    height: "100%",
  },
}));

export default function TransactProvider(props) {
  let classes = useStyles();
  return (
    <DocumentContextProvider>
      <Document className={classes.DocumentWrapper}>{props.children}</Document>
    </DocumentContextProvider>
  );
}
