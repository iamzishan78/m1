import React /*, { useState, useEffect, useContext }*/ from "react";
import { Grid } from "@material-ui/core";
// import { AppContext } from "AppContext";
// import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/styles";
import { AutoCompleteFilter } from "components/Table/AutoCompleteFilter";
import { GET_ES_SIMPLE_FILTER } from "graphQL/useQueryESSimpleFilter";
import { wellsFilterColumnsHeader } from "utils/data";
// import { useLazyQuery } from "@apollo/client";
// import Autocomplete from "@material-ui/lab/Autocomplete";
// import { GET_GRID_VIEWS } from "graphQL/useQueryGetGridViews";

const useStyles = makeStyles((theme) => ({
  actionBar: {
    padding: "10px 40px",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    width: "100%",
    minHeight: "65px",

    "& .MuiSelect-select:focus, & .MuiOutlinedInput-root": {
      backgroundColor: "#ffff",
    },
    "& .MuiButtonGroup-groupedContainedSecondary:not(:last-child)": {
      borderColor: "#ffff",
    },
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

const WellsFilters = ({ filters, setFilters }) => {
  const classes = useStyles();
  // const [reporting, setReporting] = useState({ key: "" });
  // const [stateApp] = useContext(AppContext);
  // const [getGridViews, { data: gridViews }] = useLazyQuery(GET_GRID_VIEWS);

  const onChange = (filter, index, column, esKey) => {
    let allFilters = JSON.parse(JSON.stringify(filters));
    if (allFilters.length > 0) {
      const index = allFilters.findIndex((f) => f.field === column.filterKey);
      if (index > -1) {
        allFilters[index].value = column.filterList[0];
      } else {
        allFilters.push({ field: column.filterKey, value: column.filterList[0] });
      }
    } else {
      allFilters.push({ field: column.filterKey, value: column.filterList[0] });
    }
    allFilters = allFilters.filter((filter) => filter.value);
    setFilters(allFilters);
  };

  // useEffect(() => {
  //   getGridViews({
  //     variables: {
  //       module: "Properties",
  //       userId: stateApp.user.mongoId,
  //     },
  //   });
  // }, []);

  return (
    <Grid container direction="row" display="flex" className={classes.actionBar} spacing={2}>
      {/** TEMP commenting 26/10/22 - Ali Tahir */}
      {/* <Grid item xs md style={{ minWidth: "150px", maxWidth: "250px" }}>
        <Autocomplete
          multiple={false}
          getOptionSelected={(option, value) => option.key === value.key}
          getOptionLabel={(option) => option?.key?.toString().replace(/^\,|\,$/gm, "")}
          onChange={(e, value2, reason) => {
            const allFilters = JSON.parse(JSON.stringify(filters));
            const data = value2?.key ? JSON.parse(JSON.stringify(gridViews?.getGridViews?.gridViews.find((f) => value2.key === f.name))) : null;
            if (allFilters.length > 0 && reporting.key) {
              const previousReporting = JSON.parse(
                JSON.stringify(gridViews?.getGridViews?.gridViews.find((f) => reporting.key === f.name))
              );
              const previousReportingFilters = previousReporting.filters.map((f) => ({ ...f, field: `properties.${f.field}` }));
              for (let i = 0; i < previousReportingFilters.length; i++) {
                const index = allFilters.findIndex(
                  (f) => f.field === previousReportingFilters[i].field && f.value === previousReportingFilters[i].value
                );
                allFilters.splice(index, 1);
              }
            }
            let reportingFilters = [];
            if (data) {
              reportingFilters = data.filters.map((f) => ({ ...f, field: `properties.${f.field}` }));
            }
            setFilters([...allFilters, ...reportingFilters]);
            setReporting(value2 ?? { key: "" });
          }}
          options={gridViews?.getGridViews?.gridViews.map((view) => ({ key: view.name }))}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              style={{ background: "white" }}
              label="Reporting Group"
              InputProps={{
                ...params.InputProps,
                endAdornment: <React.Fragment>{params.InputProps.endAdornment}</React.Fragment>,
              }}
            />
          )}
        />
      </Grid> */}
      {wellsFilterColumnsHeader.map((filterColumn, index) => {
        const custom = {
          multi_filter_keys: true,
        };
        const appliedFilters = [];
        let filterList = [[""], [""], [""], [""]];

        return (
          <Grid item xs md style={{ minWidth: "150px", maxWidth: "250px" }}>
            <AutoCompleteFilter
              esIndex={"mywells_flat"}
              variant="outlined"
              setFilters={setFilters}
              filterList={filterList}
              column={filterColumn}
              disabled={filterColumn?.disabled}
              index={index}
              custom={Array.isArray(filterColumn.filterKey) ? custom : undefined}
              onChange={onChange}
              query={GET_ES_SIMPLE_FILTER}
              searchFields={["*"]}
              filters={appliedFilters}
              extendSearchQuery={""}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default WellsFilters;
