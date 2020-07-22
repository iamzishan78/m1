import React, { useState, useEffect, useContext } from "react";
import { format } from "date-fns/esm";
import moment from "moment";
import { DateTimePicker } from "@material-ui/pickers";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import CircularProgress from "@material-ui/core/CircularProgress";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
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
    marginBottom: "15px",
  },
  inputFieldDate: {
    marginBottom: "15px",
    "& .MuiInputBase-input": {
      paddingTop: "10.5px",
      paddingBottom: "10.5px",
    },
  },
  progress: {
    marginLeft: "30px",
    verticalAlign: "middle",
  },
  dialogFooter: { display: "flex", justifyContent: "space-between" },

  label: {
    backgroundColor: "white",
  },
}));

const initialErrors = {
  notes: false,
  activityType: false,
  dateTime: false,
};

function AddActivityModal(props) {
  const classes = useStyles();
  const { open, onClose } = props;
  const [stateApp] = useContext(AppContext);

  console.log("USER: ", stateApp);

  const [updateContact, { called, loading, data }] = useMutation(UPDATECONTACT);
  const [activityType, setActivityType] = useState("general");
  const [notes, setNotes] = useState("");

  const [dateTime, setDateTime] = useState(new Date());
  const [errors, setErrors] = useState({ ...initialErrors });

  //   const [getCommentsByObjectId, { data: dataComments }] = useLazyQuery(
  //     COMMENTSBYOBJECTIDQUERY
  //   );
  // const [upsertComment] = useMutation(UPSERTCOMMENT);

  console.log("DATAAAA: ", data);

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

    console.log("UPDATING ACTIVITY LOG: ", {
      _id: props.id,
      activityLog,
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

  useEffect(() => {
    if (called && !loading && addActivityStatus.success === true) {
      clearFields();
    }
  }, [called, loading, addActivityStatus]);

  return (
    <Dialog
      aria-labelledby="simple-dialog-title"
      open={open}
      onClose={onClose}
      className={classes.root}
    >
      <DialogTitle id="simple-dialog-title" className={classes.dialogTitle}>
        Activity Log
      </DialogTitle>
      <DialogContent>
        {/* <TextField
          fullWidth
          variant="outlined"
          label="Activity Date"
          type="datetime-local"
          className={classes.inputField}
          InputLabelProps={{
            shrink: true,
          }}
          value={dateTime}
          onChange={(e) => {
            setDateTime(e.target.value);
          }}
          disabled={loading}
          error={errors.dateTime}
        /> */}
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
            size="large"
            disableElevation
            onClick={addActivity}
            disabled={loading}
          >
            Add
          </Button>
          {loading ? (
            <CircularProgress color="secondary" className={classes.progress} />
          ) : called && !loading ? (
            addActivityStatus.success ? (
              <Typography color="secondary" variant="subtitle2" gutterBottom>
                Activity added.
              </Typography>
            ) : (
              <Typography color="primary" variant="subtitle2" gutterBottom>
                Unable to add activity.
              </Typography>
            )
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddActivityModal;
