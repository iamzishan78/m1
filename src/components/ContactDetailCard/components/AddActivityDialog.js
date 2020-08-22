import React, { useState, useEffect, useContext } from "react";
import { useMutation } from "@apollo/react-hooks";
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
import { AppContext } from "../../../AppContext";
import { UPDATECONTACT } from "../../../graphQL/useMutationUpdateContact";

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
}));

const initialErrors = {
  notes: false,
  activityType: false,
  dateTime: false,
};

const getCurrentDateTime = () => {
  let dt = new Date().toISOString();
  return dt.slice(0, dt.length - 1);
};

function AddActivityDialog(props) {
  const classes = useStyles();
  const { selectedActivity, onClose } = props;
  const [stateApp] = useContext(AppContext);
  const [addNew, setAddNew] = useState(true);

  const [updateContact, { called, loading, data }] = useMutation(UPDATECONTACT);
  const [activityType, setActivityType] = useState("general");
  const [notes, setNotes] = useState("");

  const [dateTime, setDateTime] = useState(getCurrentDateTime());
  const [errors, setErrors] = useState({ ...initialErrors });

  useEffect(() => {
    if (selectedActivity !== null) {
      setAddNew(false);
      setActivityType(selectedActivity.type);
      setNotes(selectedActivity.notes);
      setDateTime(selectedActivity.dateTime);
    } else {
      setAddNew(true);
      setActivityType("general");
      setNotes("");
      setDateTime(getCurrentDateTime());
    }
  }, [selectedActivity]);

  const addActivityStatus = data ? data.updateContact : null;

  const clearFields = () => {
    setNotes("");
    setActivityType("general");
    setDateTime(getCurrentDateTime());
  };

  const updateErrors = () => {
    let activityTypeErr = false;
    let notesErr = false;
    let dateTimeErr = false;
    if (!activityType || activityType.length === 0) activityTypeErr = true;
    if (!notes || notes.length === 0) notesErr = true;
    setErrors({
      activityType: activityTypeErr,
      notes: notesErr,
      dateTime: dateTimeErr,
    });
    return activityTypeErr || notesErr || dateTimeErr;
  };

  const addActivity = async () => {
    if (updateErrors()) return;

    let activityLog = props.activityLog
      ? props.activityLog.map((act) => ({
          type: act.type,
          notes: act.notes,
          dateTime: act.dateTime,
          user_id: act.user_id,
        }))
      : [];

    activityLog.push({
      type: activityType,
      notes,
      dateTime: dateTime,
      user_id: stateApp.user.email,
    });

    updateContact({
      variables: {
        contact: {
          _id: props.id,
          activityLog,
        },
      },
      refetchQueries: ["getContact"],
      awaitRefetchQueries: true,
    });
  };

  const updateActivity = () => {
    if (updateErrors()) return;

    let activityLog = props.activityLog
      ? props.activityLog.map((act) => ({
          type: act.type,
          notes: act.notes,
          dateTime: act.dateTime,
          user_id: act.user_id,
        }))
      : [];

    let newActLog = [...activityLog];
    const index =
      newActLog &&
      newActLog.findIndex(
        (activity) =>
          activity.dateTime === selectedActivity.dateTime &&
          activity.user_id === selectedActivity.user_id
      );
    if (index > -1) {
      newActLog[index] = {
        ...selectedActivity,
        type: activityType,
        dateTime,
        notes,
      };
      newActLog.forEach((v) => delete v.__typename);

      updateContact({
        variables: {
          contact: {
            _id: props.id,
            activityLog: [...newActLog],
          },
        },
        refetchQueries: ["getContact"],
        awaitRefetchQueries: true,
      });
    }
  };

  useEffect(() => {
    if (called && !loading && addActivityStatus.success === true && addNew) {
      clearFields();
    }
  }, [called, loading, addActivityStatus, addNew]);

  return (
    <div style={{ padding: "30px" }}>
      {/* <h4 style={{ margin: "0 0 30px 0", fontSize: "16px" }}>
        Recent Activities
      </h4> */}
      <Grid item xs={12} style={{ minHeight: "35px" }}>
        <h4 style={{ margin: "0 0 30px 0", float: "left" }}>
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

        <TextField
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
        />

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
            <option value={"general"}>General Update</option>
            <option value={"phone"}>Phone Call</option>
            <option value={"email"}>Email</option>
            <option value={"meeting"}>Meeting</option>
            <option value={"sms"}>SMS</option>
            <option value={"campaign"}>Campaign</option>
          </Select>
        </FormControl>

        <TextField
          variant="outlined"
          multiline
          rows={4}
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

        <div className={classes.dialogFooter}>
          <Button
            variant="contained"
            color="secondary"
            size="medium"
            disableElevation
            onClick={() => {
              addNew ? addActivity() : updateActivity();
            }}
            disabled={loading}
          >
            {addNew ? "Save" : "Update"}
          </Button>
          <Button
            variant="contained"
            color="default"
            size="medium"
            disableElevation
            onClick={onClose}
            disabled={loading}
            style={{ margin: "0px 20px 0px 20px" }}
          >
            Cancel
          </Button>
          {loading ? (
            <CircularProgress color="secondary" className={classes.progress} />
          ) : called && !loading ? (
            addActivityStatus.success ? (
              <Typography color="secondary" variant="subtitle2" gutterBottom>
                Activity {addNew ? "added" : "updated"}.
              </Typography>
            ) : (
              <Typography color="primary" variant="subtitle2" gutterBottom>
                Unable to {addNew ? "add" : "update"} activity.
              </Typography>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default AddActivityDialog;
