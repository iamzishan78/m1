import React, { useEffect, useState, useContext } from "react";
import { Grid, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useLazyQuery } from "@apollo/client";
import Autocomplete from "@material-ui/lab/Autocomplete";
import moment from "moment";
import get from "lodash/get";

import { GET_ES_SIMPLE_FILTER } from "graphQL/useQueryESSimpleFilter";
import { getFilters } from "components/Table/Activities/ActivitiesTable";
import { AppContext } from "AppContext";
import { CUSTOM_DATES } from 'utils/data'
import { handleCustomDateTypeChange } from 'utils/helper';

const useStyles = makeStyles((theme) => ({
  actionBar: {
    backgroundColor: "#f7f7f7",
    width: "100%",
    minHeight: "65px",
    marginTop: "100px",
  },
  actionsGrid: {
    marginTop: "6px",
    "& .MuiButtonBase-root": {
      width: "149px",
      height: "35px",
      fontWeight: "bold",
    },
  },
  dateRoot: {
    border: "1px solid #EBEBEB",
    backgroundColor: "#fff",
    "&.Mui-focused fieldset": {
      border: "1px solid black",
      backgroundColor: "transparent",
    },
    "&:hover": {
      backgroundColor: "#EBEBEB",
    },
    "&:active": {
      border: "1px solid black",
      backgroundColor: "#fff",
    },
  },
  inputFieldDate: {
    "& .MuiOutlinedInput-input": {
      // paddingLeft: "0px",
    },
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
}));

export default function CustomDatesActivities({
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  minDate,
  campaignName,
  setCampaignName,
  qualifier,
  setQualifier,
  esIndex,
  searchFields,
  tableFilters,
  appliedFilters,
  setFilterToggle,
  filterToggle,
  setAppliedFilters,
}) {
  const classes = useStyles();

  useEffect(() => {
    if (minDate) handleDateTypeChange(CUSTOM_DATES.ALL_DATES);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minDate]);

  const getFlaggedMoment = (moment) => {
    return moment >= 10 ? moment : `0${moment}`;
  };

  const handleDateTypeChange = (date) => {
    handleCustomDateTypeChange(date, null, CUSTOM_DATES, setFromDate, setToDate, minDate)
  }

  const [selectedFilters, setSelectedFilters] = useState({
    campaign: null,
    qualifier: null
  });

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  return (
    <div style={{ display: "flex" }}>
      <Grid
        container
        direction="row"
        display="flex"
        alignItems="center"
        spacing={3}
        xs={12}
      >
        <Grid
          item
          xs={2}
          sm={2}
          md={2}
          lg={2}
          xl={2}
          style={{ marginTop: "2px" }}
        >
          <Autocomplete
            size="small"
            onChange={(event, newValue) => {
              if (newValue === null) {
                handleDateTypeChange("This Month");
              } else {
                handleDateTypeChange(newValue);
              }
            }}
            options={Object.values(CUSTOM_DATES)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Date Range"
                placeholder=""
                style={{ backgroundColor: "white" }}
              />
            )}
            defaultValue={CUSTOM_DATES.ALL_DATES}
            disableListWrap
            id="custom-date-dropdown"
          />
        </Grid>
        <Grid item xs={2.4} sm={2.4} md={2.4} lg={2.4} xl={2.4}>
          <TextField
            size="small"
            margin="dense"
            type="date"
            variant="outlined"
            placeholder=""
            fullWidth
            value={moment(fromDate).format("yyyy-MM-DD")}
            className={classes.inputFieldDate}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              classes: {
                root: classes.dateRoot,
                focused: classes.focused,
                notchedOutline: classes.notchedOutline,
              },
            }}
            onChange={(event) => {
              if (event.target.value == "") {
                setFromDate(
                  `${Math.round(new Date().getFullYear())}-${getFlaggedMoment(
                    Math.ceil(new Date().getMonth()) + 1
                  )}`
                );
              } else {
                setFromDate(event.target.value);
              }
            }}
          />
        </Grid>
        <Grid>
          <label>to</label>
        </Grid>
        <Grid item xs={2.4} sm={2.4} md={2.4} lg={2.4} xl={2.4}>
          <TextField
            size="small"
            margin="dense"
            type="date"
            variant="outlined"
            placeholder="to"
            fullWidth
            value={moment(toDate).format("yyyy-MM-DD")}
            className={classes.inputFieldDate}
            onChange={(event) => {
              if (event.target.value == "") {
                setToDate(
                  `${Math.round(new Date().getFullYear())}-${getFlaggedMoment(
                    Math.ceil(new Date().getMonth()) + 1
                  )}`
                );
              } else {
                setToDate(event.target.value);
              }
            }}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              classes: {
                root: classes.dateRoot,
                focused: classes.focused,
                notchedOutline: classes.notchedOutline,
              },
            }}
          />
        </Grid>
        <Grid item xs={2} md={2} lg={2} xl={2} style={{ marginTop: "4px" }}>
          <CampaignFilter
            value={campaignName}
            setValue={setCampaignName}
            esIndex={esIndex}
            searchFields={searchFields}
            tableFilters={tableFilters}
            appliedFilters={appliedFilters}
            selectedFilters={selectedFilters}
            onCampaignChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={2} md={2} lg={2} xl={2} style={{ marginTop: "4px" }}>
          <QualifierFilter
            value={qualifier}
            setValue={setQualifier}
            esIndex={esIndex}
            searchFields={searchFields}
            tableFilters={tableFilters}
            appliedFilters={appliedFilters}
            selectedFilters={selectedFilters}
            onQualifierChange={handleFilterChange}
          />
        </Grid>
      </Grid>
      
    </div>
  );
}

const CampaignFilter = ({
  esIndex,
  value,
  setValue,
  tableFilters,
  appliedFilters,
  searchFields,
  selectedFilters,
  onCampaignChange,
}) => {
  const [stateApp] = useContext(AppContext);
  const [search, setSearch] = useState("");

  const [getCampaign, { data: filtersData }] = useLazyQuery(
    GET_ES_SIMPLE_FILTER,
    { fetchPolicy: "no-cache" }
  );

  const getAllFilters = () => {
    let rangeFilters = [];
    if (!tableFilters.find((filter) => filter.type === "range")) {
      rangeFilters = getFilters(appliedFilters);
    }
    const filters = [...rangeFilters, ...tableFilters]
    const index = filters.findIndex(f => f.field === 'contact.campaignName.keyword')
    if (index > -1) {
      filters.splice(index, 1);
    }
    return filters;
  };

  useEffect(() => {
    const filterKey = "contact.campaignName.keyword";
    getCampaign({
      variables: {
        esIndex,
        index: esIndex,
        filters: getAllFilters(),
        filterKey,
        search: { query: stateApp.activitySearchQuery, fields: searchFields },
        size: 50,
        filterAggs: {
          query: search,
          field: filterKey,
          size: 50,
        },
      },
    });
    onCampaignChange('campaign', search);
  }, [search, selectedFilters.qualifier, appliedFilters]); // refresh campaign filter options list 

  return (
    <Autocomplete
      size="small"
      onChange={(e, selectedValue, reason) => {
        if (reason === "clear" || !selectedValue?.key) {
          setSearch("");
          setValue("");
        } else {
          setSearch(selectedValue.key);
          setValue(selectedValue.key);
        }
      }}
      value={value}
      inputValue={search?.toString()}
      options={get(filtersData, "getESSimpleFilter.hits", []).filter(d => d.key)}
      getOptionSelected={(option, value) => option.key === value}
      getOptionLabel={(option) =>
        option?.key?.toString().replace(/^\,|\,$/gm, "")
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Campaign Name"
          placeholder=""
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          style={{ backgroundColor: "white" }}
        />
      )}
      defaultValue={null}
      disableListWrap
      id="custom-date-dropdown"
    />
  );
};

const QualifierFilter = ({
  esIndex,
  value,
  setValue,
  tableFilters,
  appliedFilters,
  searchFields,
  onQualifierChange,
  selectedFilters
}) => {
  const [stateApp] = useContext(AppContext);
  const [search, setSearch] = useState("");

  const [getQualifiers, { data: filtersData }] = useLazyQuery(
    GET_ES_SIMPLE_FILTER,
    { fetchPolicy: "no-cache" }
  );

  const getAllFilters = () => {
    let rangeFilters = [];
    if (!tableFilters.find((filter) => filter.type === "range")) {
      rangeFilters = getFilters(appliedFilters);
    }
    const filters = [...rangeFilters, ...tableFilters]
    const index = filters.findIndex(f => f.field === 'ownerName.keyword')
    if (index > -1) {
      filters.splice(index, 1);
    }
    return filters;
  };

  useEffect(() => {
    const filterKey = "ownerName.keyword";
    getQualifiers({
      variables: {
        esIndex,
        index: esIndex,
        filters: getAllFilters(),
        filterKey,
        search: { query: stateApp.activitySearchQuery, fields: searchFields },
        size: 50,
        filterAggs: {
          query: search,
          field: filterKey,
          size: 50,
        },
      },
    });
    onQualifierChange('qualifier', search)
  }, [search, selectedFilters.campaign, appliedFilters]); // refresh qualifier filter options list

  return (
    <Autocomplete
      size="small"
      onChange={(e, selectedValue, reason) => {
        if (reason === "clear" || !selectedValue?.key) {
          setSearch("");
          setValue("");
        } else {
          setSearch(selectedValue.key);
          setValue(selectedValue.key);
        }
      }}
      value={value}
      inputValue={search?.toString()}
      options={get(filtersData, "getESSimpleFilter.hits", [])}
      getOptionSelected={(option, value) => option.key === value}
      getOptionLabel={(option) =>
        option?.key?.toString().replace(/^\,|\,$/gm, "")
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Activity Owner"
          placeholder=""
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          style={{ backgroundColor: "white" }}
        />
      )}
      defaultValue={null}
      disableListWrap
      id="custom-date-dropdown"
    />
  );
};
