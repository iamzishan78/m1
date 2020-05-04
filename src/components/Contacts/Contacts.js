import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import M1nTable from "../Shared/M1nTable/M1nTable";

const useStyles = makeStyles((theme) => ({
  divTable: {
    paddingTop: "10px",
    paddingBottom: "10px",
    paddingLeft: "32px",
    paddingRight: "32px",
  },
}));

export default function Contacts() {
  const classes = useStyles();

  return (
    <div className={classes.divTable}>
      <M1nTable parent="Contacts" />
    </div>
  );
}
