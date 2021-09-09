import React, { useState, useEffect, useContext, useCallback } from "react";
import clsx from "clsx";
import { useLazyQuery, useMutation } from "@apollo/client";
import moment from "moment";
import { useDispatch } from "react-redux";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../../../actions";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { Dialog, CircularProgress } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
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
import { GETMONGOUSERS } from "../../../graphQL/useQueryGetUsers";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TRANSACTIONDATA } from "../../../graphQL/useQueryTransactionData";
import { OPENDEALS } from "../../../graphQL/useQueryOpenDeals";
import DeleteConfirmationDialogContent from "../../Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";
import { DELETEACTIVITY } from "../../../graphQL/useMutationActivity";


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
  notes: {
    backgroundColor: "#FFFCDC",
    display: "block",
    width: "100%",
    marginBottom: "20px",

    "& .MuiOutlinedInput-root": {
      width: "100%",
    },
  },

  inputField: {
    height: 41,
    marginBottom: "20px",

    "& .MuiOutlinedInput-root": {
      height: 41,
    },
  },
  error: {
    border: "2px solid red !important",
  },
  dateTimeRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    columnGap: "16px",
  },
  dateTimeField: {
    height: 41,
    width: "100%",
    marginBottom: "20px",

    "& .MuiInputBase-root": {
      height: "100%",
    },
  },
  marginLeft: {
    marginLeft: 6,
  },
  btnGroup: {
    width: 400,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  dialog: {
    zIndex: "99999 !important",
  },
}));

const initialErrors = {
  activityType: false,
  activityName: false,
  startDate: false,
  startTime: false,
  endDate: false,
  endTime: false,
  owner: false,
};

const getCurrentDate = () => {
  const d = new Date().toISOString();
  return d.slice(0, d.indexOf("T"));
};

const getDateFromString = (d) => {
  return d.slice(0, d.indexOf("T"));
};

const mergeDateAndTime = (d, t) => {
  return `${d}T${t}`;
};

function AddActivityDialog(props) {
  const classes = useStyles();
  const { selectedActivity, onClose, contactData } = props;
  const [stateApp] = useContext(AppContext);
  const dispatch = useDispatch();

  const [addNew, setAddNew] = useState(true);
  const [activityType, setActivityType] = useState("call");
  const [activityName, setActivityName] = useState("");
  const [closed, setClosed] = useState(false);
  const [startDate, setStartDate] = useState(getCurrentDate());
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [calenderDate, setCalenderDate] = useState(new Date());
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("08:00");
  const [notes, setNotes] = useState("");
  const [owner, setOwner] = useState({ name: "", id: null });
  const [dealId, setDealId] = useState(null);
  const [errors, setErrors] = useState({ ...initialErrors });
  const [users, setUsers] = useState([]);


  const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
    fetchPolicy: "no-cache",
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteActivityMutation, { loading: deleteLoading }] = useMutation(
    DELETEACTIVITY,
    {
      refetchQueries: ["getContact", "getAllActivities"],
      awaitRefetchQueries: true,
    }
  );

  const openConfirmationDialog = () => {
    setDeleteDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
  };

  useEffect(() => {
    getAllMongoUsers();
  }, []);

  useEffect(() => {
    if (userLists && userLists.allMongoUsers) {
      setUsers(
        userLists.allMongoUsers.map((user) => ({
          value: user._id,
          text: user.name,
        }))
      );
    }
  }, [userLists]);

  const [openDeals, setOpenDeals] = useState([]);
  const [getOpenDeals, { loading: tloading, data: dealsData }] = useLazyQuery(
    OPENDEALS,
    {
      fetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    if (stateApp.user && stateApp.user.mongoId) {
      getOpenDeals();
    }
  }, [stateApp.user]);

  useEffect(() => {
    if (dealsData) {
      setOpenDeals(dealsData?.openDeals?.deals);
    }
  }, [dealsData]);

  const [addActivityMutation, { loading: addLoading }] = useMutation(
    ADDACTIVITY,
    {
      refetchQueries: [
        "getContact",
        "getAllActivities",
        "getMelissaRecordsCountForContactIds",
      ],
      awaitRefetchQueries: true,
    }
  );

  const [updateActivityMutation, { loading: updateLoading }] = useMutation(
    UPDATEACTIVITY,
    {
      refetchQueries: [
        "getContact",
        "getAllActivities",
        "getMelissaRecordsCountForContactIds",
      ],
      awaitRefetchQueries: true,
    }
  );

  const loading = addLoading || updateLoading;

  useEffect(() => {
    if (selectedActivity) {
      setAddNew(false);
      setNotes(selectedActivity.notes);
      setOwner({
        name: selectedActivity.ownerName,
        id: selectedActivity.ownerId,
      });
      setDealId(selectedActivity.dealId);
      setActivityType(selectedActivity.type);
      setActivityName(selectedActivity.name);
      setClosed(selectedActivity.isClosed);

      setStartDate(
        moment
          .parseZone(new Date(selectedActivity.dateTime))
          .format("yyyy-MM-DD")
      );
      setStartTime(
        moment.parseZone(new Date(selectedActivity.dateTime)).format("HH:mm")
      );

      setEndDate(
        moment
          .parseZone(new Date(selectedActivity.endDateTime))
          .format("yyyy-MM-DD")
      );
      setEndTime(
        moment.parseZone(new Date(selectedActivity.endDateTime)).format("HH:mm")
      );
    } else {
      setAddNew(true);
      setClosed(false);
      setNotes("");
      setOwner({
        name: stateApp.user.fullname || stateApp.user.email,
        id: stateApp.user.mongoId,
      });
      setDealId(null);
      setActivityType("call");
      setActivityName("");
      setStartDate(getCurrentDate());
      setEndDate(getCurrentDate());
      setStartTime("08:00");
      setEndTime("08:00");
    }
  }, [selectedActivity]);

  const clearFields = () => {
    setAddNew(true);
    setNotes("");
    setOwner({
      name: stateApp.user.fullname || stateApp.user.email,
      id: stateApp.user.mongoId,
    });
    setDealId(null);
    setActivityType("call");
    setActivityName("");
    setClosed(false);
    setStartDate(getCurrentDate());
    setEndDate(getCurrentDate());
    setStartTime("08:00");
    setEndTime("08:00");
  };

  const onModalClose = () => {
    onClose();
    clearFields();
  };

  const updateErrors = () => {
    let activityTypeErr = false;
    let activityNameErr = false;
    let startDataErr = false;
    let startTimeErr = false;
    let endDateErr = false;
    let endTimeErr = false;
    let ownerErr = false;

    if (!activityType || activityType.length === 0) activityTypeErr = true;
    if (!activityName || activityName.length === 0) activityNameErr = true;
    if (!startDate) startDataErr = true;
    if (!startTime) startTimeErr = true;
    if (!endDate) endDateErr = true;
    if (!endTime) endTimeErr = true;
    if (!owner.id) ownerErr = true;

    const dateTime = mergeDateAndTime(startDate, startTime);
    const endDateTime = mergeDateAndTime(endDate, endTime);

    if (moment(endDateTime).isBefore(dateTime)) {
      startDataErr = true;
      startTimeErr = true;
      endDateErr = true;
      endTimeErr = true;
    }

    setErrors({
      activityType: activityTypeErr,
      activityName: activityNameErr,
      startDate: startDataErr,
      startTime: startTimeErr,
      endDate: endDateErr,
      endTime: endTimeErr,
      owner: ownerErr,
    });

    return (
      activityNameErr ||
      activityTypeErr ||
      startDataErr ||
      startTimeErr ||
      endDateErr ||
      endTimeErr ||
      ownerErr
    );
  };

  const addActivity = async () => {
    if (updateErrors()) return;

    const dateTime = mergeDateAndTime(startDate, startTime);
    const endDateTime = mergeDateAndTime(endDate, endTime);

    await addActivityMutation({
      variables: {
        activity: {
          type: activityType,
          name: activityName,
          notes,
          ownerId: owner.id,
          ownerName: owner.name,
          contactId: contactData?._id,
          contactName: contactData?.name,
          dealId,
          dateTime: new Date(dateTime).toUTCString(),
          endDateTime: new Date(endDateTime).toUTCString(),
          isClosed: closed,
        },
      },
    });

    onModalClose();
  };

  const updateActivity = async () => {
    if (updateErrors()) return;

    const dateTime = mergeDateAndTime(startDate, startTime);
    const endDateTime = mergeDateAndTime(endDate, endTime);

    await updateActivityMutation({
      variables: {
        activity: {
          _id: selectedActivity._id,
          type: activityType,
          name: activityName,
          dateTime: new Date(dateTime).toUTCString(),
          endDateTime: new Date(endDateTime).toUTCString(),
          notes,
          ownerId: owner.id,
          ownerName: owner.name,
          contactId: contactData?._id,
          contactName: contactData?.name,
          dealId,
          isClosed: closed,
        },
      },
    });

    onModalClose();
  };

  const deleteFunc = async () => {
    try {
      setIsDeleting(true);
      await deleteActivityMutation({
        variables: {
          id: selectedActivity._id,
        },
      }).then((result) => {
        const {
          data: { deleteActivity },
        } = result;
        if (deleteActivity?.success === true) {
          dispatch(showSuccessMessage("The Activity was successfully deleted."));
          onModalClose();
        } else dispatch(showErrorMessage("An error occurred."));
      });;
      setIsDeleting(false);
    } catch {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      {/* <h4 style={{ margin: "0 0 30px 0", fontSize: "16px" }}>
        Recent Activities
      </h4> */}
      {deleteDialogOpen && (
        <Dialog
          className={classes.dialog}
          open={deleteDialogOpen ? true : false}
          onClose={handleCloseDialog}
          fullWidth={false}
          maxWidth="sm"
        >
          <DeleteConfirmationDialogContent
            header={`Delete Activity`}
            onClose={handleCloseDialog}
            deleteFunc={deleteFunc}
            m1nSelectedRowsIds={null}
            setM1nSelectedRowsIndexes={() => { }}
          >
            Do you want to delete the selected Activity?
					</DeleteConfirmationDialogContent>
        </Dialog>
      )}

      <Grid item xs={12} style={{ minHeight: "35px" }}>
        <h4 style={{ margin: "0 0 30px 0", float: "left", fontSize: "1.1rem" }}>
          Recent Activities
        </h4>
        {!addNew &&
          <IconButton
            size="small"
            style={{ float: "right", top: "-5px", right: "37px" }}
            disabled={addLoading || updateLoading}
            onClick={openConfirmationDialog}
          >
            {isDeleting ? <CircularProgress size={20} color="secondary" /> :
              <DeleteIcon
                className={classes.closeIcon}
                fontSize="small"
              />
            }
          </IconButton>
        }
        <IconButton
          onClick={onModalClose}
          size="small"
          style={{ float: "right", top: "-5px", right: `${addNew ? -5 : -26}px` }}
        >
          <CloseIcon className={classes.closeIcon} fontSize="small" />
        </IconButton>
      </Grid>
      <Grid></Grid>
      <TextField
        className={clsx(
          classes.inputField,
          activityName === "" && errors.activityName && classes.error
        )}
        fullWidth
        type="text"
        variant="outlined"
        label="Activity Name"
        InputLabelProps={{ shrink: true }}
        value={activityName}
        onChange={(e) => setActivityName(e.target.value)}
        disabled={loading}
      />
      <FormControl
        variant="outlined"
        fullWidth
        className={clsx(
          classes.inputField,
          (activityType === "" || !activityType) &&
          errors.activityType &&
          classes.error
        )}
        size="small"
      >
        <InputLabel id="activity-type-label" className={classes.label}>
          Activity Type
        </InputLabel>
        <Select
          native
          labelId="activity-type-label"
          id="activity-type-input"
          value={activityType}
          onChange={(e) => {
            setActivityType(e.target.value);
          }}
          fullWidth
          label="Activity Type"
          disabled={loading}
        >
          <option aria-label="None" value="" />
          <option value={"call"}>Call</option>
          <option value={"meeting"}>Meeting</option>
          <option value={"email"}>Email</option>
          <option value={"task"}>Task</option>
          <option value={"deadline"}>Deadline</option>
          <option value={"mailer"}>Mailer Campaign</option>
        </Select>
      </FormControl>
      <div className={classes.dateTimeRow}>
        <TextField
          className={clsx(
            classes.dateTimeField,
            !startDate && errors.startDate && classes.error
          )}
          value={startDate}
          label="Start Date"
          InputLabelProps={{ shrink: true }}
          type="date"
          variant="outlined"
          onChange={(e) => {
            setStartDate(e.target.value);
            setEndDate(e.target.value);
          }}
        />
        <TextField
          className={clsx(
            classes.dateTimeField,
            !startTime && errors.startTime && classes.error
          )}
          value={startTime}
          type="time"
          variant="outlined"
          onChange={(e) => {
            setStartTime(e.target.value);
            setEndTime(e.target.value);
          }}
        />
      </div>
      <div className={classes.dateTimeRow}>
        <TextField
          className={clsx(
            classes.dateTimeField,
            !endDate && errors.endDate && classes.error
          )}
          value={endDate}
          type="date"
          label="End Date"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          onChange={(e) => {
            setEndDate(e.target.value);
          }}
        />
        <TextField
          className={clsx(
            classes.dateTimeField,
            !endTime && errors.endTime && classes.error
          )}
          value={endTime}
          type="time"
          variant="outlined"
          onChange={(e) => {
            setEndTime(e.target.value);
          }}
        />
      </div>
      <TextField
        multiline
        fullWidth
        rows={6}
        variant="outlined"
        placeholder="Activity Notes"
        InputLabelProps={{ shrink: true }}
        value={notes}
        className={clsx(classes.notes)}
        onChange={(e) => {
          setNotes(e.target.value);
        }}
      />
      <TextField
        fullWidth
        className={clsx(classes.inputField)}
        disabled
        variant="outlined"
        label="Contact Name"
        InputLabelProps={{ shrink: true }}
        value={contactData?.name}
      />
      <Autocomplete
        options={openDeals}
        onChange={(e, deal) => {
          setDealId(deal?._id);
        }}
        value={openDeals.find((deal) => deal._id === dealId) || null}
        getOptionSelected={(option) => option.id === dealId}
        getOptionLabel={(option) => option.name}
        renderOption={(option) => {
          return (
            <Grid container spacing={0}>
              <Grid container item xs={12} alignItems="center">
                <Grid item xs>
                  <span style={{ fontWeight: 400 }}>{option.name}</span>

                  <Typography variant="body2" color="textSecondary">
                    {option.label}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          );
        }}
        renderInput={(params) => (
          <TextField
            className={clsx(classes.inputField)}
            margin="dense"
            {...params}
            InputLabelProps={{ shrink: true }}
            label="Associated Deal"
            variant="outlined"
          />
        )}
      />
      <Autocomplete
        className={clsx(!owner.id && errors.owner && classes.error)}
        options={users.filter(u => u.text)}
        onChange={(e, user) => {
          setOwner({ name: user?.text, id: user?.value });
        }}
        value={users.find((user) => user.value === owner.id) || null}
        getOptionLabel={(option) => option.text}
        getOptionSelected={(option) => option.value === owner.id}
        renderInput={(params) => (
          <TextField
            className={clsx(classes.inputField)}
            margin="dense"
            {...params}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            label="Activity Owner"
          />
        )}
      />
      <div className={classes.btnGroup} style={{ width: "100%" }}>
        <FormControlLabel
          enabled
          control={
            <Checkbox
              checked={closed}
              onChange={(e) => setClosed(e.target.checked)}
              color="primary"
            />
          }
          label="Mark as done"
        />
        <Button
          className={classes.marginLeft}
          variant="contained"
          onClick={() => {
            onModalClose();
          }}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          disabled={loading}
          className={classes.marginLeft}
          color="primary"
          variant="contained"
          onClick={() => {
            if (addNew) addActivity();
            else updateActivity();
          }}
        >
          {(addLoading || updateLoading) && (
            <CircularProgress
              style={{ marginRight: 8 }}
              color="#fff"
              size={20}
            />
          )}
          {addNew ? "Add" : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default AddActivityDialog;
