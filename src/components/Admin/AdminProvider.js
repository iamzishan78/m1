import React from "react";
import { AdminsContextProvider } from "./AdminContext";
import { makeStyles } from "@material-ui/core/styles";
import Admin from "./Admin";
const useStyles = makeStyles(theme => ({
  AdminWrapper: {
    width: "100%",
    height: "100%"
  }
}));

export default function AdminsProvider(props) {
  let classes = useStyles();
  return (
      <AdminsContextProvider>
        <Admin className={classes.AdminWrapper}>{props.children}</Admin>
      </AdminsContextProvider>
  );
}
