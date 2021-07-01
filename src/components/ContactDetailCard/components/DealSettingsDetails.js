import React, { Fragment, useContext, useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import { get } from "lodash";
import { AppContext } from "AppContext";
import {
  Menu,
  MenuItem,
  Button,
  CardActions,
  CardContent,
  Grid,
  Typography,
  TextField,
  IconButton,
  Avatar,
  InputAdornment,
} from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import ArrowDown from "@material-ui/icons/ArrowDropDown";
import ProgressBar from "../../Shared/ui/ProgressBar";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { UPDATE_STAGE_DEAL_DESCRIPTOR } from "graphQL/useMutationUpdateStageDealDescriptor";
import { ADD_DEAL_SUBTASK } from "graphQL/useMutationAddDealSubtask";

const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: "#fff",
  },
  newLaneProgress: {
    margin: "10px 0px 10px 0px",
  },
  newFlowLane: {
    cursor: "pointer",
  },
  laneName: {
    fontWeight: "bold",
    margin: "10px 0px 10px 0px",
    fontSize: "large",
  },
  laneDetail: {},
  laneDetailRow: {
    margin: "5px 0px 5px 0px",
    display: "flex",
    alignItems: "center",
    "& .MuiTypography-body2": {
      minWidth: "80px !important",
    },
  },
  formControl: {
    "& .MuiFormControl-root": {
      height: "120px !important",
    },
  },
  textField: {
    backgroundColor: "#FFFCDC",
    display: "block",
    width: "100%",
    "& .MuiOutlinedInput-root": {
      width: "100%",
      "& fieldset": {
        borderColor: "white",
        height: "127px",
      },
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
      // Default left padding is 6px
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
  dealOwnerAvatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    color: "#fff",
    fontSize: "0.6rem",
    backgroundColor: "#4880F6",
    padding: "0.5em",
  },
  dealOwnerLabel: {
    marginLeft: 4,
  },
  subTaskRoot: {
    width: "100%",
    height: "40px",
  },
  subTaskRightGrid: {
    "& .MuiIconButton-root": {
      height: "35px",
      width: "35px",
    },
  },
  addSubTaskButton: {
    marginBottom: "10px",
  },
}));

function FlowLaneDetails({ users, ownerId, activeDeal, dealSettings }) {
  const classes = useStyles();
  const [isCalendarOpen, setCalendar] = useState(false);
  const [isChecked, setCheck] = useState(false);
  const [isNewSubtask, setNewSubtask] = useState({ index: -1, value: false });
  const [stateApp] = useContext(AppContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [updateStageDealDescriptor] = useMutation(UPDATE_STAGE_DEAL_DESCRIPTOR);
  const [addDealSubtask] = useMutation(ADD_DEAL_SUBTASK);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (setting, params) => {
    const descriptor = {
      descriptorObject: activeDeal._id,
      relatedObject: setting._id,
      descriptorType: "Deal",
      relatedObjectType: "Stage",
      position: get(setting, "stageDealDescriptor.position", 0),
      pipeline: get(activeDeal, "pipeline", null),
      pipelineType: "Pipeline",
      isDeleted: false,
      user: stateApp.user.mongoId,
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

  const SubtaskRow = ({ task }) => (
    <Grid container direction="row" justify="space-between" alignItems="center" className={classes.subTaskRoot}>
      <Grid item>
        <FormControlLabel
          control={<Checkbox name="testingCheckbox" value={task.name} onChange={() => setCheck(!isChecked)} checked={task.isCompleted} />}
          label={task.name}
        />
      </Grid>
      <Grid item style={{ alignItems: "right" }} className={classes.subTaskRightGrid}>
        <KeyboardDatePicker
          className={classes.maxWidth}
          disableToolbar
          variant="inline"
          format="MM/DD/YYYY"
          margin="normal"
          // value={newDocument?.dateTime}
          open={isCalendarOpen}
          onChange={(date) => {
            //   setNewDocument({
            //     ...newDocument,
            //     dateTime: String(date["_d"]),
            //   });
            console.log(String(date["_d"]));
          }}
          TextFieldComponent={() => null}
        />
        <IconButton onClick={() => setCalendar(!isCalendarOpen)}>
          <CalendarTodayIcon fontSize="small" />
        </IconButton>
        <IconButton>
          <Avatar className={classes.dealOwnerAvatar}>
            {users.find((user) => user?.value === ownerId)
              ? users
                  .find((user) => user?.value === ownerId)
                  .text.toString()
                  .toUpperCase()
                  .split(" ").length > 1
                ? users
                    .find((user) => user?.value === ownerId)
                    .text.toString()
                    .toUpperCase()
                    .split(" ")[0][0] +
                  "" +
                  users
                    .find((user) => user?.value === ownerId)
                    .text.toString()
                    .toUpperCase()
                    .split(" ")[1][0]
                : "AO"
              : "AO"}
          </Avatar>
        </IconButton>
      </Grid>
    </Grid>
  );

  const LaneSettings = ({ settings, index }) => (
    <div style={{ borderTop: "1px solid lightgrey" }}>
      <Typography className={classes.laneName}>{settings.stageName}</Typography>
      <Grid container className={classes.laneDetail}>
        <Grid item xl={8} md={8} sm={8} className={classes.laneDetailRow}>
          <Typography variant="body2" color="textSecondary">
            Progress
          </Typography>
          <div style={{ minWidth: "200px" }}>
            <ProgressBar value={settings.progress} isNumeric />
          </div>
        </Grid>
        <Grid item xl={8} md={8} sm={8} className={classes.laneDetailRow}>
          <Typography variant="body2" color="textSecondary">
            Efficiency
          </Typography>
          <div style={{ minWidth: "200px" }}>
            <ProgressBar value={50} isNumeric />
          </div>
        </Grid>
        <Grid item xl={8} md={8} sm={8} className={classes.laneDetailRow}>
          <Typography variant="body2" color="textSecondary">
            Approver
          </Typography>
          <Autocomplete
            options={users}
            onChange={(e, user) => {
              handleChange(settings, { approver: user?.value });
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
                        <Avatar className={classes.dealOwnerAvatar}>
                          {users.find((user) => user?.value === settings.stageDealDescriptor.approver)
                            ? users
                                .find((user) => user?.value === settings.stageDealDescriptor.approver)
                                .text.toString()
                                .toUpperCase()
                                .split(" ").length > 1
                              ? users
                                  .find((user) => user?.value === settings.stageDealDescriptor.approver)
                                  .text.toString()
                                  .toUpperCase()
                                  .split(" ")[0][0] +
                                "" +
                                users
                                  .find((user) => user?.value === settings.stageDealDescriptor.approver)
                                  .text.toString()
                                  .toUpperCase()
                                  .split(" ")[1][0]
                              : "AO"
                            : "AO"}
                        </Avatar>
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid item xl={12} sm={12} className={classes.formControl}>
          <TextField
            margin="dense"
            variant="outlined"
            // multiline
            rows={8}
            label="Comment"
            defaultValue={get(settings, "stageDealDescriptor.comment", "")}
            className={classes.textField}
            fullWidth
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleChange(settings, { comment: e.target.value });
              }
            }}
          />
        </Grid>
        <Grid item xl={12} sm={12} style={{ margin: "10px 0px 10px 0px" }}>
          {settings.tasks.map((task) => (
            <SubtaskRow task={task} />
          ))}
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
    </div>
  );

  return (
    <div className={classes.root}>
      <h1>{stateApp.activeDeal.name}</h1>
      <CardActions style={{ padding: 0 }}>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Grid item xs={6}>
            <h4 style={{ height: "8px" }}>Lane Progress</h4>
            <ProgressBar value={50} isNumeric />
          </Grid>
          <Grid item xs={6} style={{ textAlign: "right" }}>
            <div className={classes.popOver}>
              <Button aria-controls="laneProgressMenu" aria-haspopup="true" onClick={handleClick}>
                All
                <ArrowDown />
              </Button>
              <Menu id="laneProgressMenu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={handleClose}>Option 1</MenuItem>
                <MenuItem onClick={handleClose}>Option 2</MenuItem>
                <MenuItem onClick={handleClose}>Option 3</MenuItem>
              </Menu>
            </div>
          </Grid>
          <Grid item xs={12} className={classes.newLaneProgress}>
            <div className={classes.newFlowLane}>+ Add New Lane</div>
          </Grid>
        </Grid>
      </CardActions>
      <CardContent style={{ padding: 0 }}>
        {dealSettings?.map((settings, index) => (
          <Fragment key={index}>
            <LaneSettings settings={settings} index={index} />
          </Fragment>
        ))}
      </CardContent>
    </div>
  );
}

export default FlowLaneDetails;
