import React, { useContext, useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import moment from "moment";
import Avatar from "react-avatar";
import Badge from "@material-ui/core/Badge";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useLazyQuery } from "@apollo/client";
import { AppContext } from "../../../AppContext";
import Dialog from "@material-ui/core/Dialog";
import ExpandableCardProvider from "../../ExpandableCard/ExpandableCardProvider";
import Toolbar from "@material-ui/core/Toolbar";
import { useDispatch, useSelector } from "react-redux";
import Card from "@material-ui/core/Card";
import InputAdornment from "@material-ui/core/InputAdornment";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import CallIcon from "@material-ui/icons/Call";
import MeetingIcon from "@material-ui/icons/Group";
import TaskIcon from "@material-ui/icons/WatchLater";
import DeadlineIcon from "@material-ui/icons/Flag";
import EmailIcon from "@material-ui/icons/Email";
import DotsIcon from "@material-ui/icons/MoreHoriz";
import DocumentIcon from "@material-ui/icons/DescriptionOutlined";
import PersonIcon from "@material-ui/icons/Person";
import LinkIcon from "@material-ui/icons/Link";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import BusinessIcon from "@material-ui/icons/Business";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const useStyles = makeStyles((theme) => ({
  dialogExpCard: {
    "& .MuiDialog-paperScrollPaper": {
      height: "100%",
    },
    "& *": {
      margin: 0,
    },
  },
  addAct: {
    width: "100%",
    backgroundColor: "#fff",
    minHeight: "100%",
    display: "flex",
  },
  left: {
    width: "55%",
    borderRight: "2px solid #d9d9d9",
    padding: "20px 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "flexstart",
    justifyContent: "flexstart",
  },
  row: {
    display: "flex",
    alignItems: "flexstart",
    justifyContent: "flexstart",
    marginBottom: 16,
  },
  rowIcon: {
    minWidth: 60,
    color: "#B9C5D1",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingTop: 16,
  },
  typeDisplay: {
    border: "1px solid #d9d9d9",
    borderRadius: 3,
    display: "flex",
    alignItems: "center",
  },
  filterDisplay: {
    color: "#48A8ED",
    backgroundColor: "#F1F2F3",
    display: "flex",
    alignItems: "center",
    padding: "2px 4px",
    border: "1px solid #fff",
    borderRadius: 3,
    cursor: "pointer",
    userSelect: "none",

    "& span": {
      marginLeft: 4,
    },
  },
  dateTimeRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  dateTimeField: {
    width: 160,
    marginBottom: 8,
  },
  marginLeft: {
    marginLeft: 8,
  },
  marginBottom: {
    marginBottom: 8,
  },
  line: {
    height: 2,
    width: 16,
    margin: "0 8px",
    backgroundColor: "#B9C5D1",
  },
  notes: {
    backgroundColor: "#FFFCDC",
    display: "block",
    width: "100%",

    "& .MuiOutlinedInput-root": {
      width: "100%",
    },
  },
  fieldWidth: {
    width: 400,
  },
  btnGroup: {
    width: 400,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  active: {
    backgroundColor: "#D0F1FC",
    color: "#48A8ED !important",
  },
  right: {
    width: "45%",
  },
}));

const getCurrentDate = () => {
  const d = new Date().toISOString();
  return d.slice(0, d.indexOf("T"));
};

export default function ContactDetailCard(props) {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [activityType, setActivityType] = useState("");
  const [startDate, setStartDate] = useState(getCurrentDate());
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [notes, setNotes] = useState("");

  const onModalClose = () => {
    setStateApp((stateApp) => ({
      ...stateApp,
      activityDialog: false,
    }));
  };

  console.log("START", new Date().toLocaleDateString());

  return (
    <Dialog
      className={classes.dialogExpCard}
      fullWidth
      maxWidth="xl"
      open={stateApp.activityDialog ? true : false}
      onClose={onModalClose}
    >
      <ExpandableCardProvider
        expanded={true}
        handleCloseExpandableCard={onModalClose}
        title={"Add Activity"}
        subTitle={""}
        parent="calender"
        mouseX={0}
        mouseY={0}
        position="relative"
        cardLeft={"0"}
        cardTop={"0"}
        zIndex={1201}
        cardWidthExpanded="100%"
        cardHeightExpanded="100%"
        targetSourceId=""
        targetLabel={"activity"}
        noTrackAvailable={true}
        component={
          <div className={classes.addAct}>
            <div className={classes.left}>
              <div className={classes.row}>
                <span className={classes.rowIcon}></span>
                <TextField
                  className={classes.fieldWidth}
                  type="text"
                  variant="outlined"
                />
              </div>
              <div className={classes.row}>
                <span className={classes.rowIcon}></span>
                <div className={classes.typeDisplay}>
                  <span
                    className={clsx(
                      classes.filterDisplay,
                      activityType === "call" && classes.active
                    )}
                    onClick={() => setActivityType("call")}
                  >
                    <CallIcon /> <span>Call</span>
                  </span>
                  <span
                    className={clsx(
                      classes.filterDisplay,

                      activityType === "meeting" && classes.active
                    )}
                    onClick={() => setActivityType("meeting")}
                  >
                    <MeetingIcon /> <span>Meeting</span>
                  </span>
                  <span
                    className={clsx(
                      classes.filterDisplay,
                      activityType === "task" && classes.active
                    )}
                    onClick={() => setActivityType("task")}
                  >
                    <TaskIcon /> <span>Task</span>
                  </span>
                  <span
                    className={clsx(
                      classes.filterDisplay,
                      activityType === "deadline" && classes.active
                    )}
                    onClick={() => setActivityType("deadline")}
                  >
                    <DeadlineIcon /> <span>Deadline</span>
                  </span>
                  <span
                    className={clsx(
                      classes.filterDisplay,
                      activityType === "email" && classes.active
                    )}
                    onClick={() => setActivityType("email")}
                  >
                    <EmailIcon /> <span>Email</span>
                  </span>
                </div>
              </div>
              <div className={classes.row}>
                <span className={classes.rowIcon}>
                  <TaskIcon />
                </span>
                <div className={classes.dateTimeRow}>
                  <TextField
                    className={classes.dateTimeField}
                    value={startDate}
                    type="date"
                    variant="outlined"
                    onChange={(e) => {
                      setStartDate(e.target.value);
                    }}
                  />
                  <TextField
                    className={clsx(classes.dateTimeField, classes.marginLeft)}
                    value={startTime}
                    type="time"
                    variant="outlined"
                    onChange={(e) => {
                      setStartTime(e.target.value);
                    }}
                  />
                  <span className={classes.line} />
                  <TextField
                    className={classes.dateTimeField}
                    value={endTime}
                    type="time"
                    variant="outlined"
                    onChange={(e) => {
                      setEndTime(e.target.value);
                    }}
                  />
                  <TextField
                    className={clsx(classes.dateTimeField, classes.marginLeft)}
                    value={endDate}
                    type="date"
                    variant="outlined"
                    onChange={(e) => {
                      setEndDate(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className={classes.row}>
                <span className={classes.rowIcon}></span>
                Add{" "}
                <span style={{ color: "#48A8ED", marginLeft: 8 }}>
                  guests, location, video call, description
                </span>
              </div>
              <div className={classes.row}>
                <span className={classes.rowIcon}>
                  <DotsIcon />
                </span>
                <Select disabled variant="outlined" value="free">
                  <MenuItem value="free">Free</MenuItem>
                </Select>
              </div>
              <div className={classes.row}>
                <span className={classes.rowIcon}>
                  <DocumentIcon />
                </span>
                <div style={{ width: "100%", marginRight: 24 }}>
                  <TextField
                    multiline
                    rows={4}
                    variant="outlined"
                    value={notes}
                    className={classes.notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                    }}
                  />
                  <small>
                    Notes are private and visible only within your Pipedrive
                    account
                  </small>
                </div>
              </div>
              <div className={classes.row}>
                <span className={classes.rowIcon}>
                  <PersonIcon />
                </span>
                <Select
                  className={classes.fieldWidth}
                  disabled
                  variant="outlined"
                  value="Jacob Avery"
                >
                  <MenuItem value="Jacob Avery">Jacob Avery</MenuItem>
                </Select>
              </div>
              <div className={classes.row}>
                <span className={classes.rowIcon}>
                  <LinkIcon />
                </span>
                <div>
                  <TextField
                    type="text"
                    disabled
                    variant="outlined"
                    className={clsx(classes.marginBottom, classes.fieldWidth)}
                    placeholder="Deal or lead"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <br />
                  <TextField
                    type="text"
                    disabled
                    variant="outlined"
                    className={clsx(classes.marginBottom, classes.fieldWidth)}
                    placeholder="Deal or lead"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <br />

                  <TextField
                    type="text"
                    disabled
                    variant="outlined"
                    className={clsx(classes.marginBottom, classes.fieldWidth)}
                    placeholder="Organization"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              </div>
              <div className={classes.row}>
                <span className={classes.rowIcon}></span>
                <div className={classes.btnGroup}>
                  <FormControlLabel
                    disabled
                    control={<Checkbox color="primary" />}
                    label="Mark as done"
                  />
                  <Button
                    className={classes.marginLeft}
                    variant="contained"
                    onClick={onModalClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    className={classes.marginLeft}
                    color="primary"
                    variant="contained"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
            <div className={classes.right}></div>
          </div>
        }
      />
    </Dialog>
  );
}
