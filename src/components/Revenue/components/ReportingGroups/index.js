import React, { useState, useContext } from "react";
import { AppContext } from "AppContext";
import { makeStyles } from "@material-ui/styles";
import RevenuePropertiesTable from "components/Table/Revenue/RevenuePropertiesTable";
import ReportGroupHeader from "components/Shared/ReportGroupHeader";
// actions

const useStyles = makeStyles((theme) => ({
  root: { paddingTop: '65px' },
  propertyTableContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    // paddingLeft: "38px",
    // paddingRight: "38px",
    marginLeft: "-8px",
    marginTop: theme.spacing(2),
    "& div": {
      "&>.MuiPaper-root": {
        "&>:nth-child(3)": {
          maxHeight: "65vh",
          minHeight: "65vh",
          "@media (max-height:1200px)": {
            maxHeight: "68vh",
            minHeight: "68vh",
          },
          "@media (max-height:1300px)": {
            maxHeight: "68vh",
            minHeight: "68vh",
          },
          "@media (max-height:1400px)": {
            maxHeight: "68vh",
            minHeight: "68vh",
          },
          "@media (max-height:1100px)": {
            maxHeight: "65vh",
            minHeight: "65vh",
          },
          "@media (max-height:1000px)": {
            maxHeight: "63vh",
            minHeight: "63vh",
          },
          "@media (max-height:900px)": {
            maxHeight: "61vh",
            minHeight: "61vh",
          },
          "@media (max-height:850px)": {
            maxHeight: "59vh",
            minHeight: "59vh",
          },
          "@media (max-height:800px)": {
            maxHeight: "57vh",
            minHeight: "57vh",
          },
          "@media (max-height:768px)": {
            maxHeight: "54vh",
            minHeight: "54vh",
          },
        },
      },
    },
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
          searchBar={true}
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
          actionColumns={[" ", "Tags", "Comments", "Status"]}
          isReportingGroup
        />
      </div>
    </div>
  );
}
