import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Grid, Typography, TextField, InputAdornment } from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import { ADD_TASK, UPDATE_TASK } from "graphQL/useMutationStageTask";
import { STAGE_TASK_TEMPLATE } from "graphQL/useQueryTask";
import NewSubtask from "components/Transact/components/Common/NewSubtask";

const useStyles = makeStyles(() => ({
  root: {
    width: "auto",
    margin: "27px !important",
  },
  aneName: {
    fontWeight: "bold",
    margin: "10px 0px 10px 0px",
    fontSize: "large",
  },
  laneDetailRow: {
    margin: "5px 0px 5px 0px",
    display: "flex",
    alignItems: "center",
    "& .MuiTypography-body2": {
      minWidth: "80px !important",
    },
  },
  inputFieldOwner: {
    marginBottom: "7px",
    width: "275px",
    backgroundColor: "#efefef",
  },
  dealOwnerRoot: {
    border: "1px solid #EBEBEB",
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
      paddingLeft: 26,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
    "&:hover.MuiOutlinedInput-root": {
      backgroundColor: "#EBEBEB",
    },
    "&:hover .MuiAutocomplete-popupIndicator": {
      visibility: "visible",
      padding: "2px",
      marginRight: "-2px",
    },
  },
  dealOwnerRootFocused: {
    "& .MuiOutlinedInput-notchedOutline": {
      border: "1px solid black",
    },
  },
  dealOwnerLabel: {
    marginLeft: 4,
  },
  notes: {
    backgroundColor: "#FFFCDC",
    display: "block",
    width: "100%",
    marginTop: 25,

    "& .MuiOutlinedInput-root": {
      width: "100%",
      "& fieldset": {
        borderColor: "white",
      },
    },
  },
  accordionColored: {
    backgroundColor: "aliceblue",
  },
  accordionColorReset: {
    backgroundColor: "transparent",
    webkitTransition: "background-color 1000ms linear",
    msTransition: "background-color 1000ms linear",
    transition: "background-color 1000ms linear",
  },
}));

function StageDetails({ selectedStageForDetail = {}, users = [] }) {
  const classes = useStyles();
  const [createTask] = useMutation(ADD_TASK);
  const [updateTask] = useMutation(UPDATE_TASK);
  const [getTaskTemplate, { data: stageTaskTemplate }] = useLazyQuery(STAGE_TASK_TEMPLATE);

  useEffect(() => {
    if (selectedStageForDetail) {
      getTaskTemplate({
        variables: {
          stageId: selectedStageForDetail._id,
          pipelineId: "3g458j9994394",
        },
      });
    }
  }, [selectedStageForDetail]);

  useEffect(() => {
    console.log("stageTaskTemplate", stageTaskTemplate);
  }, [stageTaskTemplate]);

  // useEffect(() => {
  //   getTaskTemplate();
  //   return () => {
  //     setTimeout(() => {
  //       console.log("consoling...");
  //     }, 5000);
  //   };
  // }, []);

  return (
    <Grid container justify="space-between" direction="row" display="flex" className={classes.root}>
      <Grid xs={12} item>
        <Typography variant="body1">Task Template</Typography>
      </Grid>
      <Grid item xl={8} md={8} sm={8} className={classes.laneDetailRow}>
        <Typography variant="body2" color="textSecondary">
          Approver
        </Typography>
        <Autocomplete
          options={users.filter((u) => u.text)}
          // onChange={(e, user) => {
          //   handleChangeSettings(settings, { approver: get(user, "value", null) });
          // }}
          // value={users.find((user) => user?.value === settings.stageDealDescriptor.approver) || null}
          getOptionLabel={(option) => option.text}
          // getOptionSelected={(option) => option.value === settings.stageDealDescriptor.approver}
          classes={{
            inputRoot: classes.dealOwnerRoot,
            focused: classes.dealOwnerRootFocused,
            popupIndicator: classes.popupIndicator,
          }}
          renderInput={(params) => (
            <TextField
              margin="dense"
              {...params}
              variant="outlined"
              className={classes.inputFieldOwner}
              InputLabelProps={{
                ...params.InputLabelProps,
                shrink: true,
                classes: {
                  root: classes.dealOwnerLabel,
                },
              }}
              placeholder="Assign approver"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <InputAdornment position="start">
                      {/* {settings.stageDealDescriptor.approver ? (
                              <CustomAvatar email={approver.email} text={approver.text.toString()} />
                            ) : ( */}
                      <AccountCircle fontSize="default" />
                      {/* )} */}
                    </InputAdornment>
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Grid>
      <Grid xs={12} item>
        {/* <NewSubtask setStateTransact={setStateTransact} settings={settings} isTemplate /> */}
      </Grid>
    </Grid>
  );
}

export default StageDetails;
