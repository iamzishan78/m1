import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import debounce from "lodash/debounce";

import { AutoCompleteFilter } from "components/Table/AutoCompleteFilter";
import { GET_ES_SIMPLE_FILTER } from "graphQL/useQueryESSimpleFilter";

import { AppContext } from "AppContext";

const useStyles = makeStyles((theme) => ({
  gridItem: {
    display: "flex",
    flexDirection: "column",
  },
  formControl: {
    minWidth: 249,
    color: "black",
    "& .MuiInputBase-root": {
      backgroundColor: "#101d29",
    },
  },
}));

const provisionFilters = [
  {
    label: "Type",
    filterKey: "provisions.type.keyword",
    searchFields: ["provisions.type"],
  },
  {
    label: "Applicable",
    filterKey: "provisions.applicable",
    searchFields: ["provisions.applicable"],
    getOptionLabel: (value) => (value.key === 1 ? "True" : "False"),
    customOnChange: (value) => (value ? (value === 1 ? true : false) : null),
  },
  {
    label: "Provision Value",
    filterKey: "provisions.value.keyword",
    searchFields: ["provisions.value"],
  },
  {
    label: "Party Name",
    filterKey: "provisions.partyName.keyword",
    searchFields: ["provisions.partyName"],
  },
];

const AutoCompleteDropdown = ({ classes, onChange, filter, filterList, index }) => {
  const params = {
    esIndex: "shapes_flat",
    variant: "outlined",
    setFilters: () => { },
    filterList,
    column: {
      label: filter.label,
      filterKey: filter.filterKey,
    },
    index,
    onChange,
    query: GET_ES_SIMPLE_FILTER,
    searchFields: filter.searchFields,
    filters: [{ field: "shapeJson.properties.type.keyword", value: "agreement" }],
    extendSearchQuery: "",
  };
  if (filter.getOptionLabel) params["getOptionLabel"] = filter.getOptionLabel;
  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <AutoCompleteFilter {...params} />
    </FormControl>
  );
};

export default function ProvisionsFilters(props) {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [filterList, setFilterList] = useState([[], [], [], []]);

  const onFilterChange = React.useMemo(
    () =>
      debounce((request, callback, index) => {
        const { filterKey } = callback;
        const landProvisionsFilters = [...stateApp.landSearchFilters.provisions];
        const _index = landProvisionsFilters.findIndex((f) => f.field === filterKey);
        if (_index === -1 && request[0]) landProvisionsFilters.push({ field: filterKey, value: request[0] });
        else if (request.length > 0 && request[0]) landProvisionsFilters[_index].value = request[0];
        else if (_index !== -1) landProvisionsFilters.splice(_index, 1);
        setStateApp((stateApp) => ({
          ...stateApp,
          landSearchFilters: { ...stateApp.landSearchFilters, provisions: landProvisionsFilters },
        }));

        let _filterList = [...filterList];
        _filterList[index] = request;
        setFilterList(_filterList);
      }, 1000),
    [stateApp.landSearchFilters.provisions]
  );

  return (
    <Grid container item spacing={2} style={{ padding: "8px", width: "100%", margin: "0" }}>
      {provisionFilters.map((filter, index) => (
        <Grid item key={index} sm={12} className={classes.gridItem}>
          <AutoCompleteDropdown
            classes={classes}
            onChange={(request, top, callback) => {
              if (filter.customOnChange) request[0] = filter.customOnChange(request[0]);
              onFilterChange(request, callback, index);
            }}
            filter={filter}
            filterList={filterList}
            index={index}
          />
        </Grid>
      ))}
    </Grid>
  );
}
