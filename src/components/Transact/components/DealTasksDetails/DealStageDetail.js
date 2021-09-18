import React, { useState } from "react";
import _ from "underscore";
import { get } from "lodash";
import { useMutation } from "@apollo/client";

import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid, Typography, TextField, InputAdornment, Accordion, AccordionSummary, AccordionDetails } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ProgressBar from "../../../Shared/ui/ProgressBar";
import CustomAvatar from "components/Shared/ui/CustomAvatar";
import Subtasks from "components/Transact/components/DealTasksDetails/Subtasks";

import { UPDATE_STAGE_DEAL_DESCRIPTOR } from "graphQL/useMutationUpdateStageDealDescriptor";
import { ADD_DEAL_SUBTASK } from "graphQL/useMutationDealSubtask";

const useStyles = makeStyles((theme) => ({
  laneName: {
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
    width: "200px",
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
  addSubTaskButton: {
    marginBottom: "10px",
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

function DealStageDetail({ settings, index, users, stateTransact, extendedTaskIndex, user, activeDeal }) {
  const classes = useStyles();
  const [isNewSubtask, setNewSubtask] = useState({ index: -1, value: false });
  const approver = users.find((user) => user?.value === settings.stageDealDescriptor.approver);

  const [updateStageDealDescriptor] = useMutation(UPDATE_STAGE_DEAL_DESCRIPTOR);
  const [addDealSubtask] = useMutation(ADD_DEAL_SUBTASK);

  const handleChangeSettings = (setting, params) => {
    const descriptor = {
      descriptorObject: activeDeal._id,
      relatedObject: setting._id,
      descriptorType: "Deal",
      relatedObjectType: "Stage",
      position: get(setting, "stageDealDescriptor.position", 0),
      pipeline: get(activeDeal, "pipeline", null),
      pipelineType: "Pipeline",
      isDeleted: false,
      user: user.mongoId,
      ...params,
    };
    updateStageDealDescriptor({
      variables: { descriptor },
      refetchQueries: ["dealSettings"],
      awaitRefetchQueries: true,
    });
  };

  const handleNewSubtask = (setting, params) => {
    addDealSubtask({
      variables: {
        task: params,
        stageId: setting._id,
        dealId: activeDeal._id,
      },
      refetchQueries: ["dealSettings"],
      awaitRefetchQueries: true,
    });
    setNewSubtask({ index: -1, value: !isNewSubtask.value });
  };

  return (
    <div style={{ borderTop: "1px solid lightgrey" }}>
      <Accordion
        defaultExpanded={true}
        className={
          index === extendedTaskIndex && !_.isEmpty(stateTransact.selectedTask) ? classes.accordionColored : classes.accordionColorReset
        }
      >
        <AccordionSummary aria-controls="panel1a-content2" id="panel1a-header2" expandIcon={<ExpandMore />}>
          <Typography className={classes.laneName}>{settings.stageName}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container>
            <Grid item xl={8} md={8} sm={8} className={classes.laneDetailRow}>
              <Typography variant="body2" color="textSecondary">
                Progress
              </Typography>
              <div style={{ minWidth: "200px" }}>
                <ProgressBar value={settings.progress} isNumeric />
              </div>
            </Grid>

            {/* TEMP COMMMENT FOR EFFICIENCY */}
            {/* <Grid item xl={8} md={8} sm={8} className={classes.laneDetailRow}>
          <Typography variant="body2" color="textSecondary">
            Efficiency
          </Typography>
          <div style={{ minWidth: "200px" }}>
            <ProgressBar value={settings.efficiency} isNumeric />
          </div>
        </Grid> */}

            <Grid item xl={8} md={8} sm={8} className={classes.laneDetailRow}>
              <Typography variant="body2" color="textSecondary">
                Approver
              </Typography>
              <Autocomplete
                options={users.filter((u) => u.text)}
                onChange={(e, user) => {
                  handleChangeSettings(settings, { approver: user?.value });
                }}
                value={users.find((user) => user?.value === settings.stageDealDescriptor.approver) || null}
                getOptionLabel={(option) => option.text}
                getOptionSelected={(option) => option.value === settings.stageDealDescriptor.approver}
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
                    placeholder="Assign Owner"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            {settings.stageDealDescriptor.approver ? (
                              <CustomAvatar email={approver.email} text={approver.text.toString()} />
                            ) : (
                              <AccountCircle fontSize="default" />
                            )}
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xl={12} sm={12}>
              <TextField
                margin="dense"
                variant="outlined"
                multiline
                rows={8}
                defaultValue={get(settings, "stageDealDescriptor.comment", "")}
                label="Comment"
                fullWidth
                onBlur={(e) => handleChangeSettings(settings, { comment: e.target.value })}
                className={classes.notes}
              />
            </Grid>
            <Grid item xl={12} sm={12} style={{ margin: "10px 0px 10px 0px" }}>
              <Subtasks tasks={settings.tasks} users={users} />
            </Grid>
            {isNewSubtask.index === index && isNewSubtask.value && (
              <Grid item xs={12} className={classes.addSubTaskButton}>
                <TextField
                  margin="dense"
                  variant="outlined"
                  label="Enter Subtask Name"
                  fullWidth
                  autoFocus
                  onBlur={() => setNewSubtask({ index: -1, value: !isNewSubtask.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleNewSubtask(settings, { name: e.target.value });
                    }
                  }}
                />
              </Grid>
            )}
            <Grid item xs={12} className={classes.addSubTaskButton}>
              <Button size="small" style={{ color: "grey" }} onClick={() => setNewSubtask({ index, value: !isNewSubtask.value })}>
                + Add New Subtask
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default DealStageDetail;
