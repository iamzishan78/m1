import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import M1nTable from "../Shared/M1nTable/M1nTable";

const useStyles = makeStyles((theme) => ({
  root: {
    "& div": {
      "&>.MuiPaper-root": {
        "&>:nth-child(3)": { 
          height: "calc(100vh - 206px) !important", 
          overflowY: 'scroll'
       },
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
