import React, { useState, useEffect } from "react";
import { FormControl, Grid, InputLabel, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import CustomDates from "components/Revenue/components/Common/CustomDates";
import { GET_ES_MIN_VALUE } from "graphQL/useQueryESMinValue";
import { useLazyQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import ReportGroupHeader from "components/Shared/ReportGroupHeader";
import { MenuItem } from "material-ui";
import { MuiThemeProvider } from "material-ui/styles";

const useStyles = makeStyles((theme) => ({
  actionBar: {
    backgroundColor: "#f7f7f7",
    width: "100%",
    minHeight: "65px",
    marginTop: "80px",
  },
  actionsGrid: {
    marginTop: "6px",
    "& .MuiButtonBase-root": {
      width: "149px",
      height: "35px",
      fontWeight: "bold",
    },
  },
  viewSwitcher: {
    height: "40px",
    backgroundColor: "white",
  },

  formControl: {
    width: '100%'
  }
}));


const LastCheckDateFilter = ({ field, esIndex, setESFilters, filterToggle, setFilterToggle, extraFitlers = [] }) => {
  const classes = useStyles();

  const [selectedFilter, setSelectedFilter] = useState('');
  const [fromDate, setFromDate] = React.useState(null);
  const [toDate, setToDate] = React.useState(null);
  const [lastCheckMinDate, setLastCheckMinDate] = useState('');
  const [status, setStatus] = useState('ALL');
  const [propertyFilter, setPropertyFilter] = useState([]);

  const propertiesReportGroup = useSelector(
    ({ Revenue }) => Revenue.propertiesReportGroup
  );

  const [getESMinValue] = useLazyQuery(GET_ES_MIN_VALUE, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      if (data?.getESMinValue) {
        setLastCheckMinDate(data?.getESMinValue);
      }
    },
  });

  useEffect(() => {
    getESMinValue({
      variables: {
        esIndex,
        field,
        value_as_string: true
      }
    })
  }, [getESMinValue])


  useEffect(() => {
    updateFilters();
  }, [toDate, fromDate, status, propertyFilter]);

  const updateFilters = () => {
    const filters = [];

    if (fromDate && toDate)
      filters.push({
        field,
        value: {
          range: {
            [field]: {
              gte: fromDate ? `${fromDate}T00:00:00.000Z` : null,
              lte: toDate ? `${toDate}T00:00:00.000Z` : null,
            },
          },
        },
        // includeEmpty: selectedFilter === "All Dates" ? true : undefined,
      });

    if (propertyFilter[0]) {
      filters.push(propertyFilter[0]);
    }

    if (status !== "ALL") {
      filters.push({
        field: "status.keyword",
        value: status,
      });
    }

    setESFilters(filters);
    setFilterToggle(!filterToggle);
  };

  return (
    <div className={classes.actionBar}>
      <Grid
        container
        alignItems="center"
        // justifyContent="space-between"
        spacing={2}
        style={{ padding: "0px 36px 0px 45px", width: "100%" }}
      >
        <CustomDates
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          //label="Last Check"
          isProperties
          lastCheckMinDate={lastCheckMinDate}
          onChange={setSelectedFilter}
          datesInputWidth={2}
        />
        <Grid item xs md={2}>
          {extraFitlers.includes("propertyGroup") && (
            <ReportGroupHeader
              type="Properties"
              esFilters={propertiesReportGroup || []}
              setESFilters={(value) => setPropertyFilter(value)}
              setFilterToggle={() => { }}
              isBackground={false}
              noUpdate={true}
              strechedWidth
              isShrink
              noPadding
            />
          )}
        </Grid>
        <Grid item xs md={2}>
          {extraFitlers.includes("status") && (
            <MuiThemeProvider>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="status-outlined-label">Status</InputLabel>

                <Select
                  fullWidth
                  labelId="status-outlined-label"
                  id="status-filter"
                  value={status ? status : ""}
                  className={classes.viewSwitcher}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="ALL">All</MenuItem>
                  <MenuItem value="InPay">In Pay</MenuItem>
                  <MenuItem value="NotInPay">Not In Pay</MenuItem>
                </Select>
              </FormControl>
            </MuiThemeProvider>
          )}
        </Grid>

      </Grid>
    </div>
  );
}

export default LastCheckDateFilter
