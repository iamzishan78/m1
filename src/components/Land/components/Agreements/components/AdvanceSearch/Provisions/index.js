import React, { useContext } from "react";
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
      backgroundColor: "#101d29"
    }
  },
}));

const provisionFilters = [
  {
    label: "Type",
    filterKey: "provisions.type.keyword",
    searchFields: ["provisions.type"]
  },
  {
    label: "Applicable",
    filterKey: "provisions.applicable",
    searchFields: ["provisions.applicable"]
  },
  {
    label: "Provision Value",
    filterKey: "provisions.value.keyword",
    searchFields: ["provisions.value"]
  },
  {
    label: "Party Name",
    filterKey: "provisions.partyName.keyword",
    searchFields: ["provisions.partyName"]
  }
]

const AutoCompleteDropdown = ({ classes, onChange, filter }) => (
  <FormControl variant="outlined" className={classes.formControl}>
    <AutoCompleteFilter
      esIndex={"shapes_flat"}
      variant="outlined"
      setFilters={() => { }}
      filterList={[[], [], [], []]}
      column={{
        label: filter.label,
        filterKey: filter.filterKey
      }}
      index={0}
      // custom={Array.isArray(filterColumn.filterKey) ? custom : undefined}
      onChange={onChange}
      query={GET_ES_SIMPLE_FILTER}
      searchFields={filter.searchFields}
      filters={[{ field: "shapeJson.properties.type.keyword", value: "agreement" }]}
      extendSearchQuery=""
    />
  </FormControl>
)

export default function ProvisionsFilters(props) {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);

  const onFilterChange = React.useMemo(
    () =>
      debounce((request, top, callback) => {
        // props.setTableMeta(request);
        const { filterKey } = callback;
        const landSearchFilters = [...stateApp.landSearchFilters];
        const index = landSearchFilters.findIndex(f => f.field === filterKey);
        if (index === -1 && request[0]) landSearchFilters.push({ field: filterKey, value: request[0] });
        else if (request.length > 0) landSearchFilters[index].value = request[0];
        else if (index !== -1) delete landSearchFilters[index];
        setStateApp(stateApp => ({ ...stateApp, landSearchFilters }));
      }, 1000),
    []
  );

  return (
    <Grid container item spacing={2} style={{ padding: "8px", width: "100%", margin: "0" }}>
      {provisionFilters.map((filter, index) => (
        <Grid item key={index} sm={12} className={classes.gridItem}>
          <AutoCompleteDropdown classes={classes} onChange={onFilterChange} filter={filter} />
        </Grid>
      ))}
    </Grid>
  );
}
