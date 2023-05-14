import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import debounce from "lodash/debounce";
import { copy } from "components/Shared/functions";

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
    type: "nested"
  },
  {
    label: "Applicable",
    filterKey: "provisions.applicable",
    searchFields: ["provisions.applicable"],
    type: "nested",
    customOnChange: (value) => (value ? (value === "Yes" ? true : false) : null),
    custom: {
      key_as_string: true,
      formatedFilterOptions: [
        {
          label: "Yes",
          value: "true",
        },
        {
          label: "No",
          value: "false",
        },
      ],
    },
  },
  {
    label: "Provision Value",
    filterKey: "provisions.value.keyword",
    searchFields: ["provisions.value"],
    type: "nested"
  },
  {
    label: "Party Name",
    filterKey: "provisions.partyName.keyword",
    searchFields: ["provisions.partyName"],
    type: "nested"
  },
];

const AutoCompleteDropdown = ({ classes, onChange, filter, filterList, index, appliedFilters }) => {
  const params = {
    esIndex: "shapes_flat",
    variant: "outlined",
    setFilters: () => { },
    filterList,
    column: {
      label: filter.label,
      filterKey: filter.filterKey,
      type: filter.type
    },
    index,
    onChange,
    query: GET_ES_SIMPLE_FILTER,
    searchFields: filter.searchFields,
    filters: [{ field: "shapeJson.properties.type.keyword", value: "agreement" }, ...appliedFilters],
    extendSearchQuery: "",
    custom: filter.custom,
    aggsType: "nested"
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

  useEffect(() => {
    if (stateApp.landSearchFilters.provisions?.length === 0 && filterList.find((fl) => fl.length !== 0)) {
      setFilterList([[], [], [], []]);
    }
  }, [stateApp.landSearchFilters.provisions]);

  const changeLandProvisions = React.useMemo(
    () =>
      debounce((request, callback, index) => {
        const { filterKey, type } = callback;
        const landProvisionsFilters = [...stateApp.landSearchFilters.provisions];
        const _index = landProvisionsFilters.findIndex((f) => f.field === filterKey);
        if (_index === -1 && request[0] !== null) landProvisionsFilters.push({ field: filterKey, value: request[0], type });
        else if (request.length > 0 && request[0] !== null) landProvisionsFilters[_index].value = request[0];
        else if (_index !== -1) landProvisionsFilters.splice(_index, 1);

        setStateApp((stateApp) => ({
          ...stateApp,
          landSearchFilters: { ...stateApp.landSearchFilters, provisions: landProvisionsFilters },
        }));
      }, 1000),
    [setStateApp, stateApp.landSearchFilters.provisions]
  );

  const onFilterChange = (request, callback, filter, index) => {
    let _filterList = [...filterList];
    _filterList[index] = request;
    setFilterList(_filterList);

    const _request = copy(request);
    if (filter.customOnChange) _request[0] = filter.customOnChange(_request[0]);
    changeLandProvisions(_request, callback, index);
  };

  return (
    <Grid container item spacing={2} style={{ padding: "8px", width: "100%", margin: "0" }}>
      {provisionFilters.map((filter, index) => (
        <Grid item key={index} sm={12} className={classes.gridItem}>
          <AutoCompleteDropdown
            classes={classes}
            onChange={(request, top, callback) => onFilterChange(request, callback, filter, index)}
            filter={filter}
            filterList={filterList}
            index={index}
            appliedFilters={stateApp.landSearchFilters.provisions}
          />
        </Grid>
      ))}
    </Grid>
  );
}
