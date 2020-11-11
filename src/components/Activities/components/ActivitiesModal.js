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
import { useLazyQuery, useMutation } from "@apollo/client";
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
import { UPDATECONTACT } from "../../../graphQL/useMutationUpdateContact";
import { CONTACT } from "../../../graphQL/useQueryContact";
import AutocompEntityNamesVirtualizeList from "../../Shared/M1nTable/components/SubComponents/AutocompEntityNamesVirtualizeList";
import { CONTACTSQUERY } from "../../../graphQL/useQueryContacts";
import gql from "graphql-tag";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import ActivitiesEvent from "./ActivitiesEvent";

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
    width: "50%",
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
    width: "40%",
  },
  error: {
    border: "2px solid red !important",
  },
}));

const getCurrentDate = () => {
  const d = new Date().toISOString();
  return d.slice(0, d.indexOf("T"));
};

const getTimeFromString = (d) => {
  return d.slice(d.indexOf("T") + 1, d.indexOf("."));
};

const getDateFromString = (d) => {
  return d.slice(0, d.indexOf("T"));
};

const mergeDateAndTime = (d, t) => {
  return `${d}T${t}`;
};

const initialErrors = {
  notes: false,
  activityType: false,
  startDate: false,
  startTime: false,
  endDate: false,
  endTime: false,
  contact: false,
};

const localizer = momentLocalizer(moment);

export default function ContactDetailCard({ selectedActivity, events }) {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [addNew, setAddNew] = useState(true);
  const [activityType, setActivityType] = useState("");
  const [startDate, setStartDate] = useState(getCurrentDate());
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [contactId, setContactId] = useState("");
  const [contact, setContact] = useState({});
  const [errors, setErrors] = useState({ ...initialErrors });

  const [updateContact, { called, loading, data }] = useMutation(
    UPDATECONTACT,
    {
      onCompleted: () => {
        clearFields();
        onModalClose();
      },
    }
  );

  const [getContacts, { data: allContacts }] = useLazyQuery(
    gql`
      query getContactNames {
        contacts {
          _id
          name
        }
      }
    `,
    {
      fetchPolicy: "cache-first",
    }
  );

  const [getContact, { data: cData, cLoading }] = useLazyQuery(CONTACT, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    getContacts();
  }, [selectedActivity]);

  const [nameAutValue, setNameAutValue] = useState({ name: "", id: 0, _id: 0 });
  const [mongoEntitiesArray, setMongoEntitiesArray] = useState([]);
  const [nameAutInputValue, setNameAutInputValue] = useState([]);

  useEffect(() => {
    if (allContacts?.contacts) {
      setMongoEntitiesArray(allContacts.contacts);
    }
  }, [allContacts]);

  useEffect(() => {
    if (cData?.contact) {
      setNameAutValue(
        cData?.contact
          ? { name: cData.contact.name, _id: cData.contact._id }
          : {}
      );
    }
  }, [cData]);

  useEffect(() => {
    console.log("CONTACT", nameAutValue);
    if (nameAutValue?.name) {
      setContact(nameAutValue);
    }
  }, [nameAutValue]);

  useEffect(() => {
    if (contactId) {
      getContact({
        variables: {
          contactId: contactId,
        },
      });
    }
  }, [contactId]);

  useEffect(() => {
    if (selectedActivity) {
      console.log(
        "EVENT: SET ACTIVITY:",
        selectedActivity.dateTime
        // getDateFromString(selectedActivity.dateTime),
        // getTimeFromString(selectedActivity.dateTime)
      );
      setAddNew(true);
      setNotes(selectedActivity.notes);
      setActivityType(selectedActivity.type);
      setContactId(selectedActivity.contactId);
      setStartDate(getDateFromString(selectedActivity.start.toISOString()));
      setStartTime(getTimeFromString(selectedActivity.start.toISOString()));
      setEndDate(getDateFromString(selectedActivity.end.toISOString()));
      setEndTime(getTimeFromString(selectedActivity.end.toISOString()));
    } else {
      setAddNew(true);
      setNotes("");
      setActivityType("");
      setContactId("");
      setStartDate(getCurrentDate());
      setEndDate(getCurrentDate());
      setStartTime("");
      setEndTime("");
    }
  }, [selectedActivity]);

  const onModalClose = () => {
    setStateApp((stateApp) => ({
      ...stateApp,
      activityDialog: false,
    }));
  };

  const clearFields = () => {
    setAddNew(false);
    setNotes("");
    setActivityType("");
    setStartDate(getCurrentDate());
    setEndDate(getCurrentDate());
    setContactId("");
    setStartTime("");
    setEndTime("");
    setNameAutValue(null);
    setNameAutInputValue("");
  };

  const updateErrors = () => {
    let activityTypeErr = false;
    let notesErr = false;
    let startDataErr = false;
    let startTimeErr = false;
    let endDateErr = false;
    let endTimeErr = false;
    let contactErr = false;

    if (!activityType || activityType.length === 0) activityTypeErr = true;
    if (!notes || notes.length === 0) notesErr = true;
    if (!startDate) startDataErr = true;
    if (!startTime) startTimeErr = true;
    if (!endDate) endDateErr = true;
    if (!endTime) endTimeErr = true;
    if (nameAutValue && nameAutValue.name) contactErr = true;

    setErrors({
      activityType: activityTypeErr,
      notes: notesErr,
      startDate: startDataErr,
      startTime: startTimeErr,
      endDate: endDateErr,
      endTime: endTimeErr,
      contact: contactErr,
    });
    return (
      activityTypeErr ||
      notesErr ||
      startDataErr ||
      startTimeErr ||
      endDateErr ||
      endTimeErr ||
      contactErr
    );
  };

  const addActivity = async () => {
    if (updateErrors()) return;

    let activityLog =
      cData && cData.contact.activityLog
        ? cData.contact.activityLog.map((act) => ({
            type: act.type,
            notes: act.notes,
            dateTime: act.dateTime,
            endDateTime: act.endDateTime,
            user_id: act.user_id,
          }))
        : [];

    const dateTime = mergeDateAndTime(startDate, startTime);
    const endDateTime = mergeDateAndTime(endDate, endTime);

    activityLog.push({
      type: activityType,
      notes,
      dateTime: dateTime,
      endDateTime: endDateTime,
      user_id: stateApp.user.email,
    });

    updateContact({
      variables: {
        contact: {
          _id: cData.contact.id,
          activityLog,
        },
      },
      refetchQueries: ["getContact"],
      awaitRefetchQueries: true,
    });
  };

  const updateActivity = () => {
    if (updateErrors()) return;

    const dateTime = mergeDateAndTime(startDate, startTime);
    const endDateTime = mergeDateAndTime(endDate, endTime);

    let activityLog =
      cData && cData.contact.activityLog
        ? cData.contact.activityLog.map((act) => ({
            type: act.type,
            notes: act.notes,
            dateTime: act.dateTime,
            endDateTime: act.endDateTime,
            user_id: act.user_id,
          }))
        : [];

    let newActLog = [...activityLog];
    const index =
      newActLog &&
      newActLog.findIndex((activity) => activity._id === selectedActivity._id);
    if (index > -1) {
      newActLog[index] = {
        ...selectedActivity,
        type: activityType,
        dateTime,
        endDateTime,
        notes,
      };
      newActLog.forEach((v) => delete v.__typename);

      updateContact({
        variables: {
          contact: {
            _id: cData.contact.id,
            activityLog: [...newActLog],
          },
        },
        refetchQueries: ["getContact"],
        awaitRefetchQueries: true,
      });
    }
  };

  return (
    <Dialog
      className={classes.dialogExpCard}
      fullWidth
      maxWidth="xl"
      open={stateApp.activityDialog ? true : false}
      onClose={
        loading && cLoading
          ? () => {}
          : () => {
              clearFields();
              onModalClose();
            }
      }
    >
      <ExpandableCardProvider
        expanded={true}
        handleCloseExpandableCard={
          loading && cLoading
            ? () => {}
            : () => {
                clearFields();
                onModalClose();
              }
        }
        title={`${addNew ? "Add" : "Update"} Activity`}
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
                <div
                  className={clsx(
                    classes.typeDisplay,
                    errors.activityType && classes.error
                  )}
                >
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
                    className={clsx(
                      classes.dateTimeField,
                      errors.startDate && classes.error
                    )}
                    value={startDate}
                    type="date"
                    variant="outlined"
                    onChange={(e) => {
                      setStartDate(e.target.value);
                    }}
                  />
                  <TextField
                    className={clsx(
                      classes.dateTimeField,
                      classes.marginLeft,
                      errors.startTime && classes.error
                    )}
                    value={startTime}
                    type="time"
                    variant="outlined"
                    onChange={(e) => {
                      setStartTime(e.target.value);
                      console.log("EVENT: START TIME", e.target.value);
                    }}
                  />
                  <span className={classes.line} />
                  <TextField
                    className={clsx(
                      classes.dateTimeField,
                      errors.endTime && classes.error
                    )}
                    value={endTime}
                    type="time"
                    variant="outlined"
                    onChange={(e) => {
                      setEndTime(e.target.value);
                      console.log("EVENT: END TIME", e.target.value);
                    }}
                  />
                  <TextField
                    className={clsx(
                      classes.dateTimeField,
                      classes.marginLeft,
                      errors.endDate && classes.error
                    )}
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
                    className={clsx(
                      classes.notes,
                      errors.notes && classes.error
                    )}
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
                <div
                  className={clsx(
                    classes.fieldWidth,
                    errors.contact && classes.error
                  )}
                  style={{ margin: "7.5px 0" }}
                >
                  <AutocompEntityNamesVirtualizeList
                    mongoEntitiesArray={mongoEntitiesArray}
                    setMongoEntitiesArray={setMongoEntitiesArray}
                    nameAutValue={nameAutValue}
                    setNameAutValue={setNameAutValue}
                    nameAutInputValue={nameAutInputValue}
                    setNameAutInputValue={setNameAutInputValue}
                    variant="outlined"
                    label=""
                  />
                </div>
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
                    onClick={() => {
                      clearFields();
                      onModalClose();
                    }}
                    disabled={loading && cLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={loading && cLoading}
                    className={classes.marginLeft}
                    color="primary"
                    variant="contained"
                    onClick={addNew ? addActivity : updateActivity}
                  >
                    {addNew ? "Add" : "Save"}
                  </Button>
                </div>
              </div>
            </div>
            <div className={classes.right}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView={"day"}
                defaultDate={startDate}
                step={60}
                components={{
                  event: ActivitiesEvent,
                }}
                toolbar={false}
              />
            </div>
          </div>
        }
      />
    </Dialog>
  );
}
