import React, { useContext, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import { Document, Page } from "react-pdf";

import { AppContext } from "AppContext";
import M1nTable from "../Shared/M1nTable/M1nTable";
import Drawer from "./components/Drawer";
import { Container } from "@material-ui/core";
import DocumentsTable from "components/Table/Documents/DocumentsTable";
import DocViewer from "components/Shared/DocViewer";

const useStyles = makeStyles((theme) => ({
  root: {
    "& div": {
      "&>.MuiPaper-root": {
        display: "flex",
        "flex-direction": "column",
        height: "calc(100vh - 65px)",
        top: "65px",
        position: "relative",
        "align-items": "stretch",
        "&>.MuiPaper-root": {
          display: "contents",
        },
        "&>:nth-child(3)": {
          height: "inherit !important",
        },
        "&> table": {
          bottom: 0,
        },
      },
    },
  },
}));

export default function DocumentComponent() {
  const classes = useStyles();
  const [stateApp] = useContext(AppContext);

  return (
    <div className={classes.root}>
      <DocumentsTable parent="Documents" documentSearchQuery={stateApp.documentSearchQuery} />
      <Drawer data={true} />
      <DocViewer width="calc(100vw - 515px)" />
    </div>
  );
}
