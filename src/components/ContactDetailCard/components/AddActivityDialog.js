import React, { useState, useEffect, useContext } from "react";
import { DateTimePicker } from "@material-ui/pickers";
import { useMutation } from "@apollo/react-hooks";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import CircularProgress from "@material-ui/core/CircularProgress";
import MenuItem from "@material-ui/core/MenuItem";
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

function AddActivityDialog(props) {
  const classes = useStyles();
  const { selectedActivity, onClose } = props;
  const [stateApp] = useContext(AppContext);
  const [addNew, setAddNew] = useState(true);

  const [updateContact, { called, loading, data }] = useMutation(UPDATECONTACT);
  const [activityType, setActivityType] = useState("general");
  const [notes, setNotes] = useState("");

  const [dateTime, setDateTime] = useState(new Date());
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
      setDateTime(new Date());
    }
  }, [selectedActivity]);

  const addActivityStatus = data ? data.updateContact : null;

  const clearFields = () => {
    setNotes("");
    setActivityType("general");
    setDateTime(new Date());
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
      dateTime: dateTime.toISOString(),
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
        dateTime:
          typeof dateTime.toISOString === "function"
            ? dateTime.toISOString()
            : dateTime,
        type: activityType,
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
      <div>
        <DateTimePicker
          value={dateTime}
          //disablePast
          fullWidth
          className={classes.inputFieldDate}
          onChange={setDateTime}
          label="Activity Date"
          showTodayButton
          disabled={loading}
          inputVariant="outlined"
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
            <MenuItem value={"general"}>General Update</MenuItem>
            <MenuItem value={"phone"}>Phone Call</MenuItem>
            <MenuItem value={"email"}>Email</MenuItem>
            <MenuItem value={"meeting"}>Meeting</MenuItem>
            <MenuItem value={"sms"}>SMS</MenuItem>
            <MenuItem value={"campaign"}>Campaign</MenuItem>
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
