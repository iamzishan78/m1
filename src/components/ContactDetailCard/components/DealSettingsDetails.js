import React, { Fragment, useContext, useState, useRef, useEffect } from "react";
import { useMutation } from "@apollo/client";
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
  InputAdornment,
  Popover,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { KeyboardDatePicker } from "@material-ui/pickers";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ArrowDown from "@material-ui/icons/ArrowDropDown";
import ProgressBar from "../../Shared/ui/ProgressBar";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { UPDATE_STAGE_DEAL_DESCRIPTOR } from "graphQL/useMutationUpdateStageDealDescriptor";
import { ADD_DEAL_SUBTASK, UPDATE_DEAL_SUBTASK } from "graphQL/useMutationDealSubtask";

const useStyles = makeStyles((theme) => ({
  root: {},
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
  subTaskLeftGrid: {
    "& .MuiFormControlLabel-root": {
      marginRight: 0,
    },
  },
  subTaskRightGrid: {
    "& .MuiIconButton-root": {
      height: "25px",
      width: "25px",
      margin: "5px",
    },
    "& .MuiTextField-root": {
      marginTop: "2px",
      marginBottom: 0,
      width: "132px",
    },
    "& .MuiInput-underline:before": {
      borderBottom: "none !important",
    },
    "& .MuiInput-underline:after": {
      borderBottom: "none !important",
    },
    "& .MuiFormHelperText-root": {
      display: "none !important",
    },
  },
  addSubTaskButton: {
    marginBottom: "10px",
  },
  customAvatar: {
    borderRadius: "50%",
    backgroundColor: "red",
    padding: "4px",
    color: "#fff",
    width: "25px",
    height: "25px",
    fontSize: "0.7rem",
    textAlign: "center",
  },
  avatarButton: {
    "& .MuiIconButton-label": {
      width: "auto",
    },
  },
}));

function FlowLaneDetails({ users, activeDeal, dealSettings }) {
  const classes = useStyles();
  const [isNewSubtask, setNewSubtask] = useState({ index: -1, value: false });
  const [stateApp] = useContext(AppContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [updateStageDealDescriptor] = useMutation(UPDATE_STAGE_DEAL_DESCRIPTOR);
  const [addDealSubtask] = useMutation(ADD_DEAL_SUBTASK);
  const [updateSubtask] = useMutation(UPDATE_DEAL_SUBTASK);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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

  const handleUpdateSubtask = (task, index) => {
    updateSubtask({
      variables: {
        task,
      },
      refetchQueries: ["dealSettings"],
      awaitRefetchQueries: true,
    });
  };

  function truncate(str, n) {
    return str.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  const defaultColors = ["#d73d32", "#7e3794", "#4285f4", "#67ae3f", "#d61a7f", "#ff4080"];

  function _stringAsciiPRNG(value, m) {
    // Xn+1 = (a * Xn + c) % m
    // 0 < a < m
    // 0 <= c < m
    // 0 <= X0 < m

    const charCodes = [...value].map((letter) => letter.charCodeAt(0));
    const len = charCodes.length;

    const a = (len % (m - 1)) + 1;
    const c = charCodes.reduce((current, next) => current + next) % m;

    let random = charCodes[0] % m;
    for (let i = 0; i < len; i++) random = (a * random + c) % m;

    return random;
  }

  function getRandomColor(value, colors = defaultColors) {
    // if no value is passed, always return transparent color otherwise
    // a rerender would show a new color which would will
    // give strange effects when an interface is loading
    // and gets rerendered a few consequent times
    if (!value) return "transparent";

    // value based random color index
    // the reason we don't just use a random number is to make sure that
    // a certain value will always get the same color assigned given
    // a fixed set of colors
    const colorIndex = _stringAsciiPRNG(value, colors.length);
    return colors[colorIndex];
  }

  const CustomAvatar = ({ text = "", type }) => {
    const getInitials = (name) => {
      if (!name || name.length === 0) return "--";
      const split = name ? name.split(" ") : [""];
      let initials = "";
      split.forEach((s) => {
        if (s[0]) initials += s[0];
        if (initials.length === 2) return;
      });
      return initials.toUpperCase();
    };

    return (
      <span
        className={classes.customAvatar}
        style={{
          backgroundColor: getRandomColor(text),
          paddingTop: type === "subtask" ? "6px" : "4px",
        }}
      >
        {getInitials(text)}
      </span>
    );
  };

  const SubtaskComponent = ({ task }) => (
    <Grid container direction="row" justify="space-between" alignItems="center" className={classes.subTaskRoot}>
      <Grid item xs={6} className={classes.subTaskLeftGrid}>
        <FormControlLabel
          control={
            <Checkbox
              name="subtaskCheckbox"
              value={task.name}
              onChange={(e) =>
                handleUpdateSubtask({
                  ...task,
                  isCompleted: e.target.checked,
                  completionDate: e.target.checked ? new Date().toString() : null,
                })
              }
              checked={task.isCompleted}
            />
          }
          label={truncate(task.name, 15)}
        />
      </Grid>
      <Grid item style={{ alignItems: "right" }} className={classes.subTaskRightGrid}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/DD/YYYY"
          margin="normal"
          allowKeyboardControl={false}
          value={task.dueDate || ""}
          emptyLabel
          onChange={(date) => handleUpdateSubtask({ ...task, dueDate: date ? String(date["_d"]) : "" })}
        />
        <PopupState variant="popover" popupId="demo-popup-popover">
          {(popupState) => (
            <>
              <IconButton className={classes.avatarButton} {...bindTrigger(popupState)}>
                {task.assignee ? (
                  <CustomAvatar text={users.find((user) => user?.value === task.assignee).text.toString()} type="subtask" />
                ) : (
                  <AccountCircle fontSize="default" />
                )}
              </IconButton>
              <Popover
                {...bindPopover(popupState)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <List style={{ maxHeight: 300 }}>
                  {users.map((user) => (
                    <ListItem
                      button
                      onClick={() => handleUpdateSubtask({ ...task, assignee: user.value, assignedDate: new Date().toString() })}
                    >
                      <ListItemText primary={user.text} />
                    </ListItem>
                  ))}
                </List>
              </Popover>
            </>
          )}
        </PopupState>
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
            <ProgressBar value={settings.efficiency} isNumeric />
          </div>
        </Grid>
        <Grid item xl={8} md={8} sm={8} className={classes.laneDetailRow}>
          <Typography variant="body2" color="textSecondary">
            Approver
          </Typography>
          <Autocomplete
            options={users}
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
                          <CustomAvatar
                            text={users.find((user) => user?.value === settings.stageDealDescriptor.approver).text.toString()}
                          />
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
                handleChangeSettings(settings, { comment: e.target.value });
              }
            }}
          />
        </Grid>
        <Grid item xl={12} sm={12} style={{ margin: "10px 0px 10px 0px" }}>
          {settings.tasks.map((task, subtaskIndex) => (
            <SubtaskComponent task={task} index={subtaskIndex} />
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
