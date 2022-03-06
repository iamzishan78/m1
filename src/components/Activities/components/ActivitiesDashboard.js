import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useLazyQuery } from "@apollo/client";

import ActivityAnalytics from "./ActivityAnalytics";
import ActivitiesDashboardFilter from "./ActivitiesDashboardFilter";
import ActivitiesTable from "components/Table/Activities/ActivitiesTable";
import { GET_ES_MIN_VALUE } from "graphQL/useQueryESMinValue";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "0px 30px",
    "& div": {
      "&>.MuiPaper-root": {
        "&>:nth-child(3)": {
          maxHeight: "78vh",
          minHeight: "78vh",
          "@media (max-height:900px)": {
            maxHeight: "72vh",
            minHeight: "72vh",
          },
          "@media (max-height:800px)": {
            maxHeight: "70vh",
            minHeight: "70vh",
          },
          "@media (max-height:768px)": {
            maxHeight: "70vh",
            minHeight: "70vh",
          },
        },
      },
    },
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
    <>
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
      <div className={classes.root}>
        <ActivitiesTable
          esIndex={esIndex}
          searchFields={searchFields}
          filtersChange={filtersChange}
          appliedFilters={appliedFilters}
          filterToggle={filterToggle}
          targetLabel={'activitiesDashboard'}
          header="Activities"
        />
      </div>
    </>
  );
};

export default ActivitiesDashboard;
