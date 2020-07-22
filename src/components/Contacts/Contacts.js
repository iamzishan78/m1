import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import M1nTable from "../Shared/M1nTable/M1nTable";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "10px",
    background:'#efefef',
    height: '100%'
  },
}));

export default function Contacts() {
  const classes = useStyles();

  return (
    
    // <div className={classes.root}>
      <M1nTable dense parent="Contacts" />
    // </div>

    
  );
}
