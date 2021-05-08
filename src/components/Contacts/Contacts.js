import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import M1nTable from "../Shared/M1nTable/M1nTable";

const useStyles = makeStyles((theme) => ({
  root: {
    "& div": {
      "&>.MuiPaper-root": {
        display: "flex",
        ["flex-direction"]: "column",
        height: "calc(100vh - 65px)",
        ["align-items"]: "stretch",
        "&>.MuiPaper-root": { 
          display: "contents",
        },
        "&>:nth-child(3)": { 
          height: "inherit !important",
        },
        "&> table": {
          bottom: 0,
        }
      },
    },
  },
}));

export default function Contacts() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <M1nTable dense parent="Contacts" />
    </div>
  );
}
