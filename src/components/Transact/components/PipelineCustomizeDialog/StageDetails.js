import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Grid, Typography, TextField, InputAdornment } from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";

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

function StageDetails({ selectedStage = {}, users = [] }) {
  const classes = useStyles();

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
