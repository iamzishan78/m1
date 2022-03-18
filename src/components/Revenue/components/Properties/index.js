import React, { useState, useContext } from "react";
import { AppContext } from "AppContext";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import AnalyticsCards from "components/Revenue/components/Common/AnalyticsCards";
import RevenuePropertiesTable from "components/Table/Revenue/RevenuePropertiesTable";
import { setStateIfDeepEqual } from "components/Shared/functions";
// actions
import LastCheckDateFilter from "../Common/LastCheckDateFilter";

const useStyles = makeStyles((theme) => ({
  propertyTableContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: "38px",
    paddingRight: "38px",
    marginTop: theme.spacing(2),
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
}));

export default function Properties() {
  const classes = useStyles();
  const [stateApp] = useContext(AppContext);
  // redux
  const dispatch = useDispatch();
  const [filterToggle, setFilterToggle] = React.useState(false);


  // props to pass in table
  const esIndex = "properties_flat";
  const startPaginationAt = 25;

  const [propertiesCount, setPropertiesCount] = useState(0);
  const [esFilters, ESFilters] = useState([]);

  const setESFilters = (newState) => {
    setStateIfDeepEqual(ESFilters, newState);
  };

  const onPropertiesCount = (count) => {
    setPropertiesCount(count);
  };


  // cards default
  const cardsDefault = [
    {
      heading: "Total Properties",
      points: 0,
    },
    {
      heading: "Active",
      points: 0,
    },
    {
      heading: "Inactive",
      points: 0,
    },
    {
      heading: "Unmapped",
      points: 0,
      type: "warning",
    },
  ]

  return (
    <>
      <LastCheckDateFilter field={"lastCheck.checkDate"} esIndex={esIndex} setESFilters={setESFilters} setFilterToggle={setFilterToggle} filterToggle={filterToggle} />

      <AnalyticsCards
        parent={"Properties"}
        esIndex={esIndex}
        esFilters={esFilters}
        cardsDefault={cardsDefault}
        totalCount={propertiesCount}
        landSearchQuery={stateApp.revenueSearchQuery}
      />

      <div className={classes.propertyTableContainer}>
        <RevenuePropertiesTable
          searchBar={false}
          esIndex={esIndex}
          header="Properties"
          esFilters={esFilters}
          targetLabel="Revenue Properties"
          parent="RevenuePropertiesTable"
          loading={false}
          dense={true}
          filterToggle={filterToggle}
          setESFilters={setESFilters}
          onPropertiesCount={onPropertiesCount}
          startPaginationAt={startPaginationAt}
          revenueSearchQuery={stateApp.revenueSearchQuery}
        />
      </div>
    </>
  );
}
