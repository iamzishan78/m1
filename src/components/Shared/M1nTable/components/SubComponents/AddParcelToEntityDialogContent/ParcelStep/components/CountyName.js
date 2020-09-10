import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useLazyQuery } from "@apollo/client";
import { COUNTIES } from "../../../../../../../../graphQL/useQueryCountiesBySta";
import { useDispatch, useSelector } from "react-redux";
import { setAddParcelInterestState } from "../../../../../../../../actions";

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: "100%",
    color: "black",
  },
  loader: { height: "50%", textAlign: "center", marginTop: "5%" },
}));

export default function CountyName() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [countyList, setCountyList] = useState([]);
  const [getCounties, { loading, data }] = useLazyQuery(COUNTIES);
  const { county } = useSelector(({ AddParcelInterest }) => AddParcelInterest);

  useEffect(() => {
    getCounties({
      variables: {
        state: "TX",
      },
    });
  }, []);

  const nullDesc = {
    GrId1: null,
    GrId2: null,
    GrId3: null,
    GrId4: null,
    GrId5: null,
  };

  useEffect(() => {
    if (data) {
      if (data.counties) {
        setCountyList(data.counties);

        const countyBelongState = () => {
          for (let i = 0; i < data.counties.length; i++) {
            if (data.counties[i].county === county) return true;
          }
          return false;
        };

        if (!county && !countyBelongState())
          dispatch(
            setAddParcelInterestState({
              county: data.counties[0].county,
            })
          );
      } else {
        setCountyList([]);
        dispatch(
          setAddParcelInterestState({
            county: null,
            ...nullDesc,
          })
        );
      }
    }
  }, [data]);

  const handleCountyNameChange = (event, newValue) => {
    if (newValue == null) {
      dispatch(
        setAddParcelInterestState({
          county: null,
          ...nullDesc,
        })
      );
    } else {
      if (newValue && newValue.county) {
        dispatch(
          setAddParcelInterestState({
            county: newValue.county,
            ...nullDesc,
          })
        );
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
        <div className={classes.loader}>
          <CircularProgress color="secondary" size={28} />
        </div>
      ) : (
        <Autocomplete
          className={classes.autoC}
          options={countyList}
          getOptionLabel={(option) =>
            option && option.county ? option.county : option ? option : ""
          }
          disabled={countyList.length === 0}
          autoComplete
          autoSelect
          disableListWrap
          includeInputInList
          value={countyList.length === 0 ? "" : county}
          onChange={(event, newValue) => {
            handleCountyNameChange(event, newValue);
          }}
          onKeyDown={(event) => onEnterKey(event)}
          renderInput={(params) => (
            <form autoComplete="off">
              <TextField {...params} fullWidth variant="outlined" />
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
