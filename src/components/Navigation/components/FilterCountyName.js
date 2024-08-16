import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { NavigationContext } from "../NavigationContext";
import { useLazyQuery } from "@apollo/client";
import { COUNTIES } from "../../../graphQL/useQueryCountiesBySta";
import { navController } from "hookstate/navStateController";

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

export default function FilterCountyName() {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);

  const [countyList, setCountyList] = useState([]);
  const [getCounties, { loading, data }] = useLazyQuery(COUNTIES, { fetchPolicy: "no-cache" });

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

  const nullDesc = [
    { field: 'GrId1', value: null },
    { field: 'GrId2', value: null },
    { field: 'GrId3', value: null },
    { field: 'GrId4', value: null },
    { field: 'GrId5', value: null },
    { field: 'countyName', value: null },
    { field: 'county', value: null },
    { field: 'filterGeography', value: null },
  ]
  const nullDesc_Obj = {}
  nullDesc.forEach((filter) => {
    nullDesc_Obj[filter.field] = filter.value
  })

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

  const handleCountyNameChange = (event, newValue) => {
    if (newValue == null) {
      setStateNav((stateNav) => ({
        ...stateNav,
        ...nullDesc_Obj,
      }));
      navController.handleGeographyFilters(nullDesc)
    } else {
      if (newValue && newValue.county) {
        setStateNav((stateNav) => ({
          ...stateNav,
          ...nullDesc_Obj,
          countyName: newValue.county,
        }));
        navController.handleGeographyFilters([...nullDesc, { field: 'county', value: newValue.county }])
      }
    }
  };

  const onEnterKey = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  };

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      {loading ? (
        <div style={{ height: "56px" }}>
          <CircularProgress color="secondary" className={classes.loader} size={28} />
        </div>
      ) : (
        <Autocomplete
          className={classes.autoC}
          options={countyList}
          getOptionLabel={(option) => (option && option.county ? option.county : option ? option : "")}
          disabled={!stateNav.stateName || countyList.length === 0}
          autoComplete
          autoSelect
          disableListWrap
          includeInputInList
          value={countyList.length === 0 ? "" : stateNav.countyName}
          onChange={(event, newValue) => {
            handleCountyNameChange(event, newValue);
          }}
          onKeyDown={(event) => onEnterKey(event)}
          renderInput={(params) => (
            <form autoComplete="off">
              <TextField {...params} fullWidth label="County" variant="outlined" />
            </form>
          )}
          renderOption={(option) => <Typography>{option && option.county ? option.county : option ? option : ""}</Typography>}
        />
      )}
    </FormControl>
  );
}
