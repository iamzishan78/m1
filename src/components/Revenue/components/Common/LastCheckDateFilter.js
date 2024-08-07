import React, { useState, useEffect } from "react";
import { FormControl, Grid, InputLabel, Select, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/styles";
import CustomDates from "components/Revenue/components/Common/CustomDates";
import { GET_ES_MIN_VALUE } from "graphQL/useQueryESMinValue";
import { useLazyQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import ReportGroupHeader from "components/Shared/ReportGroupHeader";
import { MenuItem } from "material-ui";
import { MuiThemeProvider } from "material-ui/styles";
import { dateFilterToDate } from "utils/helper";
import { copy } from "components/Shared/functions";

const useStyles = makeStyles((theme) => ({
  actionBar: {
    backgroundColor: "#f7f7f7",
    width: "100%",
    minHeight: "65px",
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
    width: "100%",
  },
}));

const LastCheckDateFilter = ({
  field,
  esIndex,
  esFilters,
  setESFilters,
  filterToggle,
  propertyNumbers,
  checkNumbers,
  setFilterToggle,
  extraFitlers = [],
  stateESKey = "",
  isComparisonReport = false
}) => {
  const classes = useStyles();

  const [selectedFilter, setSelectedFilter] = useState("");
  const [fromDate, setFromDate] = React.useState(null);
  const [toDate, setToDate] = React.useState(null);
  const [lastCheckMinDate, setLastCheckMinDate] = useState("");
  const [status, setStatus] = useState("ALL");
  const [propertyFilter, setPropertyFilter] = useState([]);
  const [checkNumberFilter, setCheckNumberFilter] = useState();
  const [propertyNumberFilter, setPropertyNumberFilter] = useState();

  const propertiesReportGroup = useSelector(({ Revenue }) => Revenue.propertiesReportGroup);

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
        value_as_string: true,
      },
    });
  }, [getESMinValue]);

  useEffect(() => {
    updateFilters();
  }, [toDate, fromDate, status, propertyFilter, checkNumberFilter, propertyNumberFilter]);

  const updateFilters = () => {
    let filters = copy(esFilters) ?? [];
    filters = filters.filter(
      (filter) =>
        filter.type !== "range" &&
        filter.field !== `${stateESKey}state.keyword` &&
        filter.field !== "check.checkNumber.keyword" &&
        filter.field !== "property.number.keyword"
    );
    if (checkNumberFilter) {
      filters.push({ field: "check.checkNumber.keyword", value: checkNumberFilter });
    }

    if (propertyNumberFilter) {
      filters.push({ field: "property.number.keyword", value: propertyNumberFilter });
    }
    if (fromDate && toDate)
      filters.unshift({
        field,
        value: {
          gte: fromDate ? `${fromDate}T00:00:00.000Z` : null,
          lte: toDate ? `${dateFilterToDate(toDate)}T00:00:00.000Z` : null,
        },
        type: "range",
      });

    if (propertyFilter[0]) filters.push({ ...propertyFilter[0], field: stateESKey + propertyFilter[0].field });

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
      <Grid container alignItems="center" spacing={2} style={{ padding: "0px 36px 0px 45px", width: "100%" }}>
        <CustomDates
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          isProperties
          lastCheckMinDate={lastCheckMinDate}
          onChange={setSelectedFilter}
          datesInputWidth={2}
        />
        {extraFitlers.includes("propertyGroup") && (
          <Grid item xs md={2}>
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
          </Grid>
        )}
        {/* commenting out as it is not working currently  --KC 2024-08-06 */}
        {/* {extraFitlers.includes("status") && (
          <Grid item xs md={2}>
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
          </Grid>
        )} */}
        {isComparisonReport && (
          <>
            {extraFitlers.includes("checkNumber") && (
              <Grid item xs style={{ minwidth: "15%" }}>
                <Autocomplete
                  size="small"
                  onChange={(event, newValue) => {
                    setCheckNumberFilter(newValue)
                  }}
                  options={checkNumbers}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Check Number"
                      variant="outlined"
                      placeholder=""
                      style={{ backgroundColor: "white" }}
                    />
                  )}
                  disableListWrap
                  id="custom-date-dropdown"
                />
              </Grid>
            )}
            {extraFitlers.includes("propertyNumber") && (
              <Grid item xs style={{ minWidth: "15%" }}>
                <Autocomplete
                  size="small"
                  onChange={(event, newValue) => {
                    setPropertyNumberFilter(newValue)
                  }}
                  options={propertyNumbers}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Property Number"
                      variant="outlined"
                      placeholder=""
                      style={{ backgroundColor: "white" }}
                    />
                  )}
                  disableListWrap
                  id="custom-date-dropdown"
                />
              </Grid>
            )}
          </>
        )}
      </Grid>
    </div>
  );
};

export default LastCheckDateFilter;
