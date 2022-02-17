import React, { useState, useContext } from "react";
import { AppContext } from "AppContext";
import { makeStyles } from "@material-ui/styles";
import RevenuePropertiesTable from "components/Table/Revenue/RevenuePropertiesTable";
import ReportGroupHeader from "components/Shared/ReportGroupHeader";
// actions

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
  const esIndex = "properties_flat";
  const startPaginationAt = 25;
  const [esFilters, setESFilters] = useState([]);

  return (
    <div className={classes.root}>
      <ReportGroupHeader type='Properties' esFilters={esFilters} setESFilters={setESFilters} setFilterToggle={setFilterToggle} />

      <div className={classes.propertyTableContainer}>
        <RevenuePropertiesTable
          esIndex={esIndex}
          header="Properties"
          esFilters={esFilters}
          targetLabel="Revenue Properties"
          parent="RevenuePropertiesTable"
          loading={false}
          dense={true}
          filterToggle={filterToggle}
          setESFilters={setESFilters}
          startPaginationAt={startPaginationAt}
          revenueSearchQuery={stateApp.revenueSearchQuery}
        />
      </div>
    </div>
  );
}
