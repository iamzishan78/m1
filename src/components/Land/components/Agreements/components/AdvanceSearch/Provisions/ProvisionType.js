import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { NavigationContext } from "components/Navigation/NavigationContext";
import { useLazyQuery } from "@apollo/client";
import { COUNTIES } from "graphQL/useQueryCountiesBySta";
import { AutoCompleteFilter } from "components/Table/AutoCompleteFilter";

import { GET_ES_SIMPLE_FILTER } from "graphQL/useQueryESSimpleFilter";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
import AutoCompleteESField from "components/Shared/Forms/Fields/AutoCompleteESField";

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 249,
    color: "black",
  },
  loader: {
    marginLeft: "50%",
  },
  autoC: { "& input": { color: "#17AADD" } },
}));

export default function ProvisionType() {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);

  const [countyList, setCountyList] = useState([]);
  const [getCounties, { loading, data }] = useLazyQuery(COUNTIES);

  useEffect(() => {
    if (stateNav.stateName) {
      getCounties({
        variables: {
          state: stateNav.stateName,
        },
      });
    } else {
      setCountyList([]);
    }
  }, [stateNav.stateName]);

  const nullDesc = {
    GrId1: null,
    GrId2: null,
    GrId3: null,
    GrId4: null,
    GrId5: null,
    filterGeography: null,
  };

  useEffect(() => {
    if (data) {
      if (data.counties) {
        setCountyList(data.counties);
      } else {
        setCountyList([]);
        setStateNav((stateNav) => ({
          ...stateNav,
          countyName: null,
          ...nullDesc,
        }));
      }
    }
  }, [data]);

  const onChange = () => {
    console.log("chaange function called.");
  };

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      {loading ? (
        <div style={{ height: "56px" }}>
          <CircularProgress color="secondary" className={classes.loader} size={28} />
        </div>
      ) : (
        // <Autocomplete
        //   className={classes.autoC}
        //   options={countyList}
        //   getOptionLabel={(option) => (option && option.county ? option.county : option ? option : "")}
        //   disabled={!stateNav.stateName || countyList.length === 0}
        //   autoComplete
        //   autoSelect
        //   disableListWrap
        //   includeInputInList
        //   value={countyList.length === 0 ? "" : stateNav.countyName}
        //   onChange={(event, newValue) => {
        //     handleCountyNameChange(event, newValue);
        //   }}
        //   onKeyDown={(event) => onEnterKey(event)}
        //   renderInput={(params) => (
        //     <form autoComplete="off">
        //       <TextField {...params} fullWidth label="County" variant="outlined" />
        //     </form>
        //   )}
        //   renderOption={(option) => <Typography>{option && option.county ? option.county : option ? option : ""}</Typography>}
        // />
        <AutoCompleteESField
          label={"Type"}
          value=""
          column={{
            label: "Type",
            filterKey: ["shapeJson.properties.name"],
          }}
          index={"shapes_flat"}
          onChange={onChange}
          query={GET_ES_FILTER_LIST}
          esIndex={"shapes_flat"}
          variant="outlined"
          extendSearchQuery="*"
        />
        // <AutoCompleteFilter
        //   esIndex={"shapes_flat"}
        //   variant="outlined"
        //   setFilters={() => {}}
        //   filterList={["", "", "", ""]}
        //   column={{
        //     label: "Type",
        //     filterKey: "provisions.partyName.keyword",
        //   }}
        //   index={0}
        //   // custom={Array.isArray(filterColumn.filterKey) ? custom : undefined}
        //   onChange={onChange}
        //   query={GET_ES_SIMPLE_FILTER}
        //   searchFields={["*"]}
        //   filters={[]}
        //   extendSearchQuery={""}
        // />
      )}
    </FormControl>
  );
}
