import React, { useContext, useEffect } from "react";
import { TitleOpinionContext } from "../TitleOpinionContext";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Grid } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import stateNamesAb from "../../Navigation/components/Utils/USAStates";
import Autocomplete from "@material-ui/lab/Autocomplete";
import useQueryCountiesByState from "../../../graphQL/useQueryCountiesByState";

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1)
    }
  },
  GIWrapper: {
    width: "100%",
    padding: "20px",
    maxWidth: "1200px !important"
  },
  maxWidth: { width: "100%" },
  logo: {
    maxWidth: "94%",
    maxHeight: "56px"
  },
  logoGrid: {
    height: "72px"
  }
}));

export default function GeneralInfoForm() {
  const [stateTitleOpinion, setStateTitleOpinion] = useContext(
    TitleOpinionContext
  );
  const { TOData } = stateTitleOpinion;

  // useEffect(() => {
  //   ////////////////query all projects and clients from the logged user;
  // }, []);

  let shortStateName = "";
  let USAstates = stateNamesAb.map(state => {
    if (state[1] === TOData.state) {
      shortStateName = state[0];
    }
    return state[1];
  });

  const [queryCounties, { data }] = useQueryCountiesByState(shortStateName);
  const counties =
    data && data.counties
      ? data.counties.map(element => {
          return element.county;
        })
      : [];

  ///////fetching counties when the USAstate change
  useEffect(() => {
    if (TOData.state !== "") {
      queryCounties();
    }
  }, [stateTitleOpinion.TOData.state]);

  let classes = useStyles();

  return (
    <form
      className={`${classes.root} ${classes.GIWrapper}`}
      noValidate
      autoComplete="off"
    >
      <Grid container className={classes.maxWidth} spacing={1}>
        <Grid container item xs={12} spacing={2}>
          <Grid item xs={8}>
            <TextField
              className={classes.maxWidth}
              label="Client"
              variant="outlined"
              value={TOData.client}
              onChange={e => {
                setStateTitleOpinion({
                  ...stateTitleOpinion,
                  edited: true,
                  TOData: { ...TOData, client: e.target.value }
                });
              }}
              id="clientInput"
              onClick={e => {
                e.preventDefault();
                document.getElementById("clientInput").focus();
              }}
            />
          </Grid>
          <Grid
            item
            xs={4}
            className={classes.logoGrid}
            style={{ textAlign: "center" }}
          >
            <img
              className={classes.logo}
              alt="onshore logo"
              src="http://nebula.wsimg.com/9b0c125775869dac3257ba77bac0a8f5?AccessKeyId=8231CD0B34125240677C&disposition=0&alloworigin=1"
            />
          </Grid>

          <Grid item xs={8}>
            <TextField
              className={classes.maxWidth}
              label="Project"
              variant="outlined"
              value={TOData.project}
              onChange={e => {
                setStateTitleOpinion({
                  ...stateTitleOpinion,
                  edited: true,
                  TOData: { ...TOData, project: e.target.value }
                });
              }}
              id="projectInput"
              onClick={e => {
                e.preventDefault();
                document.getElementById("projectInput").focus();
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <Autocomplete
              className={classes.maxWidth}
              options={USAstates}
              getOptionLabel={option => option}
              autoComplete
              autoSelect
              disableClearable
              includeInputInList
              value={TOData.state}
              onChange={(e, newValue) => {
                e.preventDefault();

                setStateTitleOpinion({
                  ...stateTitleOpinion,
                  edited: true,
                  TOData: {
                    ...TOData,
                    state: newValue === null ? "" : newValue,
                    county: ""
                  }
                });
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  label="State"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={8}>
            <TextField
              className={classes.maxWidth}
              label="Legal Description"
              multiline
              variant="outlined"
              value={TOData.legalDescription}
              onChange={e => {
                setStateTitleOpinion({
                  ...stateTitleOpinion,
                  edited: true,
                  TOData: { ...TOData, legalDescription: e.target.value }
                });
              }}
              id="legalDesc"
              onClick={e => {
                e.preventDefault();
                document.getElementById("legalDesc").focus();
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <Autocomplete
              className={classes.maxWidth}
              options={counties}
              getOptionLabel={option => option}
              autoComplete
              autoSelect
              disableClearable
              includeInputInList
              value={TOData.county}
              disabled={counties.length === 0}
              onChange={(e, newValue) => {
                setStateTitleOpinion({
                  ...stateTitleOpinion,
                  edited: true,
                  TOData: {
                    ...TOData,
                    county: newValue === null ? "" : newValue
                  }
                });
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  label="County"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={8}>
            <TextField
              className={classes.maxWidth}
              label="Prepared By"
              variant="outlined"
              value={TOData.preparedBy}
              onChange={e => {
                setStateTitleOpinion({
                  ...stateTitleOpinion,
                  edited: true,
                  TOData: { ...TOData, preparedBy: e.target.value }
                });
              }}
              id="preparedBy"
              onClick={e => {
                e.preventDefault();
                document.getElementById("preparedBy").focus();
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <KeyboardDatePicker
              label="Certified Date"
              className={classes.maxWidth}
              inputVariant="outlined"
              autoOk
              variant="inline"
              value={TOData.certifiedDate}
              onChange={date => {
                setStateTitleOpinion({
                  ...stateTitleOpinion,
                  edited: true,
                  TOData: {
                    ...TOData,
                    certifiedDate: date.format("MM-DD-YYYY")
                  }
                });
              }}
              format="MM-DD-YYYY"
            />
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}