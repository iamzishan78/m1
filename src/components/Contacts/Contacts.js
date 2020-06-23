import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import M1nTable from "../Shared/M1nTable/M1nTable";

const useStyles = makeStyles((theme) => ({
  root:{
    //backgroundColor:'#efefef',
    height: '100%'
  },
  divTable: {
    padding: "10px 32px 10px 32px",
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
