import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import M1nTable from "../Shared/M1nTable/M1nTable";
import ContactsTable from "components/Table/Contact/ContactsTable";
import { AppContext } from "AppContext";

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

export default function Contacts() {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);

  return (
    <div className={classes.root}>
      {/* <M1nTable dense parent="Contacts" /> */}
      <ContactsTable parent="Contacts" contactSearchQuery={stateApp.contactSearchQuery} userId={stateApp.user.mongoId} />
    </div>
  );
}
