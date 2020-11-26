import React, { useState, useEffect, useContext } from "react";
import { useMutation } from "@apollo/client";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { AppContext } from "../../../AppContext";
import { UPDATECONTACT } from "../../../graphQL/useMutationUpdateContact";
import { DateTimePicker } from "@material-ui/pickers";
import {
  ADDACTIVITY,
  UPDATEACTIVITY,
} from "../../../graphQL/useMutationActivity";

const useStyles = makeStyles((theme) => ({
  root: {
    "&  .MuiPaper-root": {
      maxWidth: "400px",
      padding: "25px",
    },
  },
  dialogTitle: {
    textAlign: "center",
  },
  dialogContentText: {
    textAlign: "center",
  },
  inputField: {
    marginBottom: "30px",
  },
  inputFieldDateRoot: {
    "& .MuiDialog-root": {
      zIndex: 99999,
    },
  },
  inputFieldDate: {
    marginBottom: "30px",
    "& .MuiInputBase-input": {
      paddingTop: "10.5px",
      paddingBottom: "10.5px",
    },
  },
  progress: {
    marginLeft: "30px",
    verticalAlign: "middle",
  },
  dialogFooter: { display: "flex", justifyContent: "flex-start" },

  label: {
    backgroundColor: "white",
  },

  closeIcon: {
    color: theme.palette.secondary.main,
  },
  shrinkLabel: {
    backgroundColor: "#fff !important",
    padding: "0 6px",
  },
}));

const initialErrors = {
  notes: false,
  activityType: false,
  activityName: false,
  dateTime: false,
  endDateTime: false,
};

const getCurrentDateTime = () => {
  let dt = new Date().toISOString();
  return dt.slice(0, dt.indexOf("T") + 6);
  // return dt;
};

const get1hrLaterDateTime = () => {
  let dt = new Date();
  let newDt = new Date(dt.getTime() + 1 * 60 * 60 * 1000).toISOString();
  console.log("set activity 2", newDt);
  return newDt.slice(0, newDt.indexOf("T") + 6);
};

function AddActivityDialog(props) {
  const classes = useStyles();
  const { selectedActivity, onClose } = props;
  const [stateApp] = useContext(AppContext);
  const [addNew, setAddNew] = useState(true);

  const [updateContact, { called, loading, data }] = useMutation(UPDATECONTACT);
  const [activityType, setActivityType] = useState("call");
  const [activityName, setActivityName] = useState("");

  const [notes, setNotes] = useState("");
  const [closed, setClosed] = useState(false);

  const [dateTime, setDateTime] = useState(getCurrentDateTime());
  const [endDateTime, setEndDateTime] = useState(get1hrLaterDateTime());
  const [errors, setErrors] = useState({ ...initialErrors });

  const [addActivityMutation, { loading: addLoading }] = useMutation(
    ADDACTIVITY,
    {
      refetchQueries: ["getContact", "getAllActivities"],
      awaitRefetchQueries: true,
    }
  );

  const [updateActivityMutation, { loading: updateLoading }] = useMutation(
    UPDATEACTIVITY,
    {
      refetchQueries: ["getContact", "getAllActivities"],
      awaitRefetchQueries: true,
    }
  );

  useEffect(() => {
    if (selectedActivity !== null) {
      console.log("SELECTED ACTIVITY", selectedActivity);
      setAddNew(false);
      setActivityType(selectedActivity.type);
      setActivityName(selectedActivity.name);

      setNotes(selectedActivity.notes);
      setClosed(selectedActivity.isClosed);
      setDateTime(selectedActivity.dateTime);
      setEndDateTime(selectedActivity.endDateTime);
    } else {
      setAddNew(true);
      setClosed(false);
      setActivityType("call");
      setActivityName("");
      setNotes("");
      setDateTime(getCurrentDateTime());
      setEndDateTime(get1hrLaterDateTime());
    }
  }, [selectedActivity]);

  const addActivityStatus = data ? data.updateContact : null;

  const clearFields = () => {
    setNotes("");
    setActivityType("call");
    setActivityName("");
    setAddNew(true);
    setClosed(false);
    setDateTime(getCurrentDateTime());
    setEndDateTime(get1hrLaterDateTime());
  };

  const updateErrors = () => {
    let activityTypeErr = false;
    let activityNameErr = false;

    let notesErr = false;
    let dateTimeErr = false;
    let endDateTimeErr = false;
    if (!activityName || activityName.length === 0) activityNameErr = true;
    if (!activityType || activityType.length === 0) activityTypeErr = true;
    if (!notes || notes.length === 0) notesErr = true;
    if (!dateTime) dateTimeErr = true;
    if (!endDateTime) endDateTimeErr = true;
    if (moment(endDateTime).isBefore(dateTime)) {
      dateTimeErr = true;
      endDateTimeErr = true;
    }

    setErrors({
      activityType: activityTypeErr,
      notes: notesErr,
      dateTime: dateTimeErr,
      endDateTime: endDateTimeErr,
      activityName: activityNameErr,
    });

    return (
      activityNameErr ||
      activityTypeErr ||
      notesErr ||
      dateTimeErr ||
      endDateTimeErr
    );
  };

  const addActivity = async () => {
    console.log("ADD ACTIVITY", updateErrors());
    if (updateErrors()) return;

    await addActivityMutation({
      variables: {
        activity: {
          type: activityType,
          name: activityName,
          notes,
          ownerId: stateApp.user._id,
          ownerName: stateApp.user.name || stateApp.user.email,
          contactId: props.contactData._id,
          contactName: props.contactData.name,
          dateTime,
          endDateTime,
          isClosed: closed,
        },
      },
    });
  };

  const updateActivity = async () => {
    if (updateErrors()) return;

    await updateActivityMutation({
      variables: {
        activity: {
          _id: selectedActivity._id,
          type: activityType,
          name: activityName,
          notes,
          ownerId: stateApp.user._id,
          ownerName: stateApp.user.name || stateApp.user.email,
          contactId: props.contactData._id,
          contactName: props.contactData.name,
          dateTime,
          endDateTime,
          isClosed: closed,
        },
      },
    });
  };

  useEffect(() => {
    if (
      called &&
      !loading &&
      addActivityStatus &&
      addActivityStatus.success === true &&
      addNew
    ) {
      clearFields();
    }
  }, [called, loading, addActivityStatus, addNew]);

  return (
    <div style={{ padding: "30px" }}>
      {/* <h4 style={{ margin: "0 0 30px 0", fontSize: "16px" }}>
        Recent Activities
      </h4> */}
      <Grid item xs={12} style={{ minHeight: "35px" }}>
        <h4 style={{ margin: "0 0 30px 0", float: "left", fontSize: "1.1rem" }}>
          Recent Activities
        </h4>

        <IconButton
          onClick={onClose}
          size="small"
          style={{ float: "right", top: "-5px", right: "-5px" }}
        >
          <CloseIcon className={classes.closeIcon} fontSize="small" />
        </IconButton>
      </Grid>
      <div className={classes.inputFieldDateRoot}>
        {/* <DateTimePicker
          value={dateTime}
          //disablePast
          fullWidth
          className={classes.inputFieldDate}
          onChange={setDateTime}
          label="Activity Date"
          showTodayButton
          disabled={loading}
          inputVariant="outlined"
        /> */}

        {/* <TextField
          variant="outlined"
          fullWidth
          size="small"
          id="datetime-local"
          labelId="datetime-local-label"
          // label="Activity Date"
          type="datetime-local"
          value={dateTime}
          onChange={(e) => {
            console.log("PREV: ", dateTime);
            console.log("setting: ", e.target.value);
            setDateTime(e.target.value);
          }}
          disabled={loading}
          className={classes.inputField}
          label="Activity Date"
          error={errors.dateTime}
        /> */}
        <DateTimePicker
          disabled={loading}
          size="small"
          id="datetime-local"
          className={classes.inputField}
          DialogProps={{
            style: {
              zIndex: "10000",
              left: "left: calc( 100vw/1.5  ) !important",
              top: "-140px",
            },
          }}
          inputVariant="outlined"
          value={dateTime}
          // disablePast
          onChange={(e) => {
            // console.log("PREV: ", dateTime);
            // console.log("setting: ", e._d.toISOString());
            setDateTime(e._d.toISOString());
          }}
          label="Activity Date"
          showTodayButton
          fullWidth
        />
        <FormControl
          variant="outlined"
          fullWidth
          className={classes.inputField}
          size="small"
        >
          <InputLabel shrink className={classes.shrinkLabel}>
            Activity End Date
          </InputLabel>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            id="enddatetime-local"
            labelId="enddatetime-local-label"
            type="datetime-local"
            value={endDateTime}
            onChange={(e) => {
              console.log("PREV: ", endDateTime);
              console.log("setting: ", e.target.value);
              setEndDateTime(e.target.value);
            }}
            disabled={loading}
            error={errors.endDateTime}
          />
        </FormControl>
        <FormControl
          variant="outlined"
          fullWidth
          className={classes.inputField}
          size="small"
        >
          <InputLabel shrink className={classes.shrinkLabel}>
            Activity Name
          </InputLabel>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            type="text"
            value={activityName}
            onChange={(e) => {
              setActivityName(e.target.value);
            }}
            disabled={loading}
            error={errors.activityName}
          />
        </FormControl>
        <FormControl
          variant="outlined"
          fullWidth
          className={classes.inputField}
          size="small"
        >
          <InputLabel
            id="demo-simple-select-outlined-label"
            className={classes.label}
          >
            Activity Type
          </InputLabel>
          <Select
            native
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={activityType}
            onChange={(e) => {
              setActivityType(e.target.value);
            }}
            fullWidth
            label="Activity Type"
            disabled={loading}
            error={errors.activityType}
          >
            <option value={"call"}>Call</option>
            <option value={"meeting"}>Meeting</option>
            <option value={"email"}>Email</option>
            <option value={"task"}>Task</option>
            <option value={"deadline"}>Deadline</option>
          </Select>
        </FormControl>

        <TextField
          variant="outlined"
          multiline
          rows={8}
          id="notes"
          label="Notes"
          type="text"
          size="small"
          fullWidth
          className={classes.inputField}
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
          }}
          disabled={loading}
          error={errors.notes}
        />

        <FormControlLabel
          className={classes.inputField}
          enabled
          control={
            <Checkbox
              checked={closed}
              onChange={(e) => setClosed(e.target.checked)}
            />
          }
          label="Mark as done"
        />

        <div className={classes.dialogFooter}>
          <Button
            variant="contained"
            color="default"
            size="medium"
            disableElevation
            onClick={onClose}
            disabled={loading}
            style={{ margin: "0px 15px 0px 0px" }}
          >
            Cancel
          </Button>

          {loading ? (
            <CircularProgress
              color="secondary"
              size={34}
              className={classes.progress}
            />
          ) : (
            <Button
              variant="contained"
              color="secondary"
              size="medium"
              disableElevation
              onClick={async () => {
                addNew ? await addActivity() : await updateActivity();
              }}
              disabled={loading}
            >
              {addNew ? "Save" : "Update"}
            </Button>
          )}
          {/* called && !loading ? (
            addActivityStatus.success ? (
              <Typography color="secondary" variant="subtitle2" gutterBottom>
                Activity {addNew ? "added" : "updated"}.
              </Typography>
            ) : (
              <Typography color="primary" variant="subtitle2" gutterBottom>
                Unable to {addNew ? "add" : "update"} activity.
              </Typography>
            )
          ) : null */}
        </div>
      </div>
    </div>
  );
}

export default AddActivityDialog;
