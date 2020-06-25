import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { NavigationContext } from "../NavigationContext";
import { useLazyQuery } from "@apollo/react-hooks";
import { COUNTIES } from "../../../graphQL/useQueryCountiesBySta";

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

        const countyBelongState = () => {
          for (let i = 0; i < data.counties.length; i++) {
            if (data.counties[i].county === stateNav.countyName) return true;
          }

          return false;
        };

        if (stateNav.countyName === false && !countyBelongState()) {
          setStateNav((stateNav) => ({
            ...stateNav,
            countyName: data.counties[0].county,
          }));
        }
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
        countyName: null,
        ...nullDesc,
      }));
    } else {
      if (newValue && newValue.county) {
        setStateNav((stateNav) => ({
          ...stateNav,
          countyName: newValue.county,
          ...nullDesc,
        }));
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
          <CircularProgress
            color="secondary"
            className={classes.loader}
            size={28}
          />
        </div>
      ) : (
        <Autocomplete
          className={classes.autoC}
          options={countyList}
          getOptionLabel={(option) =>
            option && option.county ? option.county : option ? option : ""
          }
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
              <TextField
                {...params}
                fullWidth
                label="County"
                variant="outlined"
              />
            </form>
          )}
          renderOption={(option) => (
            <Typography>
              {option && option.county ? option.county : option ? option : ""}
            </Typography>
          )}
        />
      )}
    </FormControl>
  );
}
