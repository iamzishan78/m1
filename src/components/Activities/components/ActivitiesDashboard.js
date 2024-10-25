import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useLazyQuery } from "@apollo/client";

import ActivityAnalytics from "./ActivityAnalytics";
import ActivitiesDashboardFilter from "./ActivitiesDashboardFilter";
import ActivitiesTable from "components/Table/Activities/ActivitiesTable";
import { GET_ES_MIN_VALUE } from "graphQL/useQueryESMinValue";
import MRTTable from 'components/MRTTable';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "90px",
  },
}));

const ActivitiesDashboard = () => {
  const classes = useStyles();
  const esIndex = "activities_flat";
  const searchFields = ["name", "_all"];
  const [filterToggle, setFilterToggle] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    toDate: null,
    fromDate: null,
  });
  const [tableFilters, setTableFilters] = useState([]);
  const [minDate, setMinDate] = useState("");

  const [getESMinValue] = useLazyQuery(GET_ES_MIN_VALUE, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      if (data?.getESMinValue) {
        setFilterToggle(!filterToggle);
        setMinDate(data?.getESMinValue);
      }
    },
  });

  useEffect(() => {
    getESMinValue({
      variables: {
        esIndex,
        field: "dateTime",
        value_as_string: true,
      },
    });
  }, [getESMinValue]);

  const filtersChange = (filters) => {
    setTableFilters(filters);
  };

  return (
    <div className={classes.root}>
      <ActivitiesDashboardFilter
        esIndex={esIndex}
        searchFields={searchFields}
        setFilterToggle={setFilterToggle}
        filterToggle={filterToggle}
        tableFilters={tableFilters}
        appliedFilters={appliedFilters}
        minDate={minDate}
        setAppliedFilters={setAppliedFilters}
      />
      <ActivityAnalytics
        filterToggle={filterToggle}
        tableFilters={tableFilters}
        appliedFilters={appliedFilters}
        setAppliedFilters={setAppliedFilters}
      />
      <MRTTable name="ActivityTable" />
    </div>
  );
};

export default ActivitiesDashboard;
