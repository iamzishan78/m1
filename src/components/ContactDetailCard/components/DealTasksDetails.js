import React, { Fragment, useState, memo, useEffect, useRef, useContext } from "react";
import { get } from "lodash";
import { useMutation } from "@apollo/client";
import { TransactContext } from "components/Transact/TransactContext";
import { makeStyles } from "@material-ui/core/styles";
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
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import { ExpandMore, ExpandLess, Edit } from "@material-ui/icons";
import AccountCircle from "@material-ui/icons/AccountCircle";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { KeyboardDatePicker } from "@material-ui/pickers";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ArrowDown from "@material-ui/icons/ArrowDropDown";
import ProgressBar from "../../Shared/ui/ProgressBar";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CustomAvatar from "components/Shared/ui/CustomAvatar";
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
    alignItems: "right",
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
  avatarButton: {
    "& .MuiIconButton-label": {
      width: "auto",
      "& span": {
        paddingTop: "6px",
      },
    },
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
  accordion: {
    minHeight: "35px !important",
    "& .MuiPaper-elevation1": {
      boxShadow: "none !important",
    },
    "& .MuiAccordion-root": {
      position: "inherit !important",
      minHeight: "72px !important",
      maxHeight: "580px !important",
      borderBottomRightRadius: "0px !important",
      borderBottomLeftRadius: "0px !important",
    },
  },
}));

const SubtaskComponent = memo(({ task, handleUpdateSubtask, users }) => {
  const classes = useStyles();
  const [showTaskActions, setShow] = useState(false);

  const truncate = (str, n) => (str.length > n ? str.substr(0, n - 1) + "..." : str);
  const onHoverTask = (state) => setShow(state);
  const approver = users.find(user => user?.value === task.assignee);

  return (
    <div className={classes.subTaskRoot} onMouseLeave={() => onHoverTask(false)} onMouseEnter={() => onHoverTask(true)}>
      <Grid container direction="row" justify="space-between" alignItems="center">
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
          />
          <Tooltip title={task.name} placement="top">
            <span style={{ fontSize: "medium" }}>{truncate(task.name, 18)}</span>
          </Tooltip>
        </Grid>
        <Grid item className={classes.subTaskRightGrid}>
          {(task.dueDate || showTaskActions) && (
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
          )}
          {(task.assignee || showTaskActions) && (
            <PopupState variant="popover" popupId="demo-popup-popover">
              {(popupState) => (
                <>
                  <IconButton className={classes.avatarButton} {...bindTrigger(popupState)}>
                    {task.assignee ? (
                      <CustomAvatar
                        email={approver.email}
                        text={approver.text.toString()}
                      />
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
                    <List style={{ maxHeight: 450 }}>
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
          )}
        </Grid>
      </Grid>
    </div>
  );
});

function DealTasksDetails({ users, activeDeal, dealSettings, user }) {
  const classes = useStyles();
  const [isNewSubtask, setNewSubtask] = useState({ index: -1, value: false });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [extendedTaskIndex, setExtendedTaskIndex] = useState(0);

  // Transact Context
  const [stateTransact, setStateTransact] = useContext(TransactContext);

  const [updateStageDealDescriptor] = useMutation(UPDATE_STAGE_DEAL_DESCRIPTOR);
  const [addDealSubtask] = useMutation(ADD_DEAL_SUBTASK);
  const [updateSubtask] = useMutation(UPDATE_DEAL_SUBTASK);
  const selectedTaskRef = useRef(null);

  useEffect(() => {
    if (stateTransact.selectedTask && selectedTaskRef.current) {
      setTimeout(() => {
        selectedTaskRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start"
        });
        setStateTransact(state => ({ ...state, selectedTask: {} }));
        const index = dealSettings.findIndex(ds => ds._id === stateTransact.selectedTask._id);
        setExtendedTaskIndex(index);
      }, 0);
    }
  }, [stateTransact.selectedTask]);

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

  const handleUpdateSubtask = (task, index) => {
    updateSubtask({
      variables: {
        task,
      },
      refetchQueries: ["dealSettings"],
      awaitRefetchQueries: true,
    });
  };

  const LaneSettings = ({ settings, index }) => {
    const approver = users.find(user => user?.value === settings.stageDealDescriptor.approver);
    return (
      <div style={{ borderTop: "1px solid lightgrey", padding: '0px 5px' }}>
        <Accordion defaultExpanded={index === 0} expanded={index === extendedTaskIndex}>
          <AccordionSummary aria-controls="panel1a-content2" id="panel1a-header2" expandIcon={<ExpandMore />}>
            <Typography className={classes.laneName}>{settings.stageName}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container className={classes.laneDetail}>
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
                  options={users.filter(u => u.text)}
                  onChange={(e, user) => {
                    handleChangeSettings(settings, { approver: user?.value });
                  }}
                  value={users.find((user) => user?.value === settings.stageDealDescriptor.approver) || null}
                  getOptionLabel={(option) => option.text}
                  getOptionSelected={(option) => option.value === settings.stageDealDescriptor.approver}
                  classes={{
                    inputRoot: classes.dealOwnerRoot,
                    focused: classes.dealOwnerRootFocused,
                    popupIndicator: classes.popupIndicator
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
                          root: classes.dealOwnerLabel
                        }
                      }}
                      placeholder="Assign Owner"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              {settings.stageDealDescriptor.approver ? (
                                <CustomAvatar
                                  email={approver.email}
                                  text={approver.text.toString()}
                                />
                              ) : (
                                <AccountCircle fontSize="default" />
                              )}
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        )
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
                  // value={description}
                  label="Comment"
                  fullWidth
                  //   required
                  onBlur={(e) => handleChangeSettings(settings, { comment: e.target.value })}
                  className={classes.notes}
                />
              </Grid>
              <Grid item xl={12} sm={12} style={{ margin: "10px 0px 10px 0px" }}>
                {settings.tasks.map((task, subtaskIndex) => (
                  <Fragment key={subtaskIndex}>
                    <SubtaskComponent task={task} handleUpdateSubtask={handleUpdateSubtask} users={users} />
                  </Fragment>
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
          </AccordionDetails>
        </Accordion>
      </div >
    );
  }

  const evaluateOverallProgress = () => {
    let progress = 0;
    dealSettings.forEach((setting) => {
      progress += setting.progress;
    });
    progress = ((progress / (100 * dealSettings.length)) * 100).toFixed(2);
    return progress;
  };

  return (
    <div className={classes.root}>
      <CardActions style={{ paddingBottom: 15, padding: "0px 30px" }}>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Grid item xs={8} style={{ marginBottom: "15px" }}>
            <h4 style={{ height: "8px" }}>Overall Progress</h4>
            <ProgressBar value={evaluateOverallProgress()} isNumeric />
          </Grid>
          {/* <Grid item xs={6} style={{ textAlign: "right" }}>
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
          </Grid> */}
          {/* <Grid item xs={12} className={classes.newLaneProgress}>
            <div className={classes.newFlowLane}>+ Add New Lane</div>
          </Grid> */}
        </Grid>
      </CardActions>
      <CardContent style={{ padding: 0, overflowY: "auto", maxHeight: "82vh" }}>
        {dealSettings?.map((settings, index) => (
          <div className={classes.accordion} ref={settings._id === stateTransact.selectedTask?._id ? selectedTaskRef : null}>
            <LaneSettings settings={settings} index={index} />
          </div>
        ))}
      </CardContent>
    </div>
  );
}

export default DealTasksDetails;
