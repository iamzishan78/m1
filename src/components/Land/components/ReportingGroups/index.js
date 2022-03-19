import React, { useState, useContext } from "react";
import { AppContext } from "AppContext";
import { makeStyles } from "@material-ui/styles";
import AgreementsTable from "components/Table/Agreement/AgreementsTable";
// actions
import ReportGroupHeader from "components/Shared/ReportGroupHeader";


const useStyles = makeStyles((theme) => ({
  root: { paddingTop: '100px' },
  propertyTableContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: "38px",
    paddingRight: "38px",
    marginTop: theme.spacing(2),
  },
}));


export default function ReportingGroups() {
  const classes = useStyles();
  const [stateApp] = useContext(AppContext);
  // redux

  const [filterToggle, setFilterToggle] = React.useState(false);
  // props to pass in table
  const esIndex = "shapes_flat";
  const [esFilters, setESFilters] = useState([]);

  return (
    <div className={classes.root}>
      <ReportGroupHeader type={'Agreements'} esFilters={esFilters} setESFilters={setESFilters} setFilterToggle={setFilterToggle} />

      <div className={classes.propertyTableContainer}>
        <AgreementsTable
          esIndex={esIndex}
          header="Agreements"
          esFilters={esFilters}
          filterToggle={filterToggle}
          targetLabel="agreement"
          parent="AgreementsTable"
          setESFilters={setESFilters}
          landSearchQuery={stateApp.landSearchQuery}
        />
      </div>
    </div>
  );
}
