import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { NavigationContext } from "../NavigationContext";
import { useLazyQuery } from "@apollo/react-hooks";
import { WELLGRID } from "../../../graphQL/useQueryWellGrId12345";

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

///////props: -gridNumber//////////
///////       -label     //////////
export default function FilterGrid12345({ gridNumber, label }) {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);

  const [gridList, setGridList] = useState([]);
  const [getWellGrId12345, { loading, data }] = useLazyQuery(WELLGRID);

  let useEffectDependenciesArray = [stateNav.stateName, stateNav.countyName];

  for (let i = 1; i < gridNumber; i++) {
    useEffectDependenciesArray.push(stateNav[`GrId${i}`]);
  }

  useEffect(() => {
    if (!stateNav.stateName || !stateNav.countyName) {
      setGridList([]);
      setStateNav((stateNav) => ({
        ...stateNav,
        [`GrId${gridNumber}`]: null,
      }));
    } else {
      let whereFields = {
        State: stateNav.stateName,
        County: stateNav.countyName,
      };

      for (let i = 1; i < gridNumber; i++) {
        if (stateNav[`GrId${i}`]) {
          whereFields[`GrId${i}`] = stateNav[`GrId${i}`];
        }
      }

      getWellGrId12345({
        variables: {
          gridNumber,
          whereFields,
        },
      });
    }
  }, useEffectDependenciesArray);

  useEffect(() => {
    if (data) {
      if (data.WellGrId12345) {
        setGridList(data.WellGrId12345);
      } else {
        setGridList([]);
        setStateNav((stateNav) => ({
          ...stateNav,
          [`GrId${gridNumber}`]: null,
        }));
      }
    }
  }, [data]);

  const nullDesc = () => {
    let stateNavObj = { ...stateNav, filterGeography: null };

    for (let i = gridNumber + 1; i <= 5; i++) {
      stateNavObj[`GrId${i}`] = null;
    }
    return stateNavObj;
  };

  const handleChange = (event, newValue) => {
    if (newValue == null) {
      setStateNav({
        ...nullDesc(),
        [`GrId${gridNumber}`]: null,
      });
    } else {
      if (newValue && newValue[`GrId${gridNumber}`]) {
        setStateNav({
          ...nullDesc(),
          [`GrId${gridNumber}`]: newValue[`GrId${gridNumber}`],
        });
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
          options={gridList}
          getOptionLabel={(option) =>
            option && option[`GrId${gridNumber}`]
              ? option[`GrId${gridNumber}`]
              : option
              ? option
              : ""
          }
          disabled={!stateNav.countyName || gridList.length === 0}
          autoComplete
          autoSelect
          disableListWrap
          includeInputInList
          value={gridList.length === 0 ? "" : stateNav[`GrId${gridNumber}`]}
          onChange={(event, newValue) => {
            handleChange(event, newValue);
          }}
          onKeyDown={(event) => onEnterKey(event)}
          renderInput={(params) => (
            <form autoComplete="off">
              <TextField
                {...params}
                fullWidth
                label={label}
                variant="outlined"
              />
            </form>
          )}
          renderOption={(option) => (
            <Typography>
              {option && option[`GrId${gridNumber}`]
                ? option[`GrId${gridNumber}`]
                : option
                ? option
                : ""}
            </Typography>
          )}
        />
      )}
    </FormControl>
  );
}
