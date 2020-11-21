import React, { useContext, useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { FormControl, Grid, InputLabel } from "@material-ui/core";
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
import gql from "graphql-tag";
import { setStateIfDeepEqual } from "../../Shared/functions";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import ActivitiesEvent from "./ActivitiesEvent";
import { PAGINATEDCONTACTSQUERY } from "../../../graphQL/useQueryPaginatedContacts";
import { TRANSACTIONDATA } from "../../../graphQL/useQueryTransactionData";
import Autocomplete from "@material-ui/lab/Autocomplete";

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
    minWidth: 75,
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
    color: "#999",
    backgroundColor: "#f9f9f9",
    display: "flex",
    alignItems: "center",
    padding: "4px 16px",
    border: "1px solid #fff",
    borderRadius: 3,
    cursor: "pointer",
    userSelect: "none",
    height: 40,

    "& span": {
      marginLeft: 8,
    },
  },
  dateTimeRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  dateTimeField: {
    height: 41,
    width: 172,
    marginBottom: 8,

    "& .MuiInputBase-root": {
      height: "100%",
    },
  },
  marginLeft: {
    marginLeft: 6,
  },
  marginBottom: {
    marginBottom: 20,
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
    width: "100%",
    maxWidth: 400,
  },
  inputField: {
    height: 41,

    "& .MuiOutlinedInput-root": {
      height: 41,
    },
  },
  btnGroup: {
    width: 400,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  active: {
    backgroundColor: "#D0F1FC",
    color: "#259AED !important",
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

const getDateFromString = (d) => {
  return d.slice(0, d.indexOf("T"));
};

const mergeDateAndTime = (d, t) => {
  return `${d}T${t}`;
};

const initialErrors = {
  activityType: false,
  activityName: false,
  startDate: false,
  startTime: false,
  endDate: false,
  endTime: false,
  contact: false,
};

const localizer = momentLocalizer(moment);

export default function ActivitiesModal({
  setSelectedActivity,
  selectedActivity,
  events,
}) {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [addNew, setAddNew] = useState(true);
  const [activityType, setActivityType] = useState("");
  const [activityName, setActivityName] = useState("");
  const [closed, setClosed] = useState(false);
  const [startDate, setStartDate] = useState(getCurrentDate());
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");
  const [notes, setNotes] = useState("");
  const [contactId, setContactId] = useState("");
  const [contact, setContact] = useState({});
  const [errors, setErrors] = useState({ ...initialErrors });
  const [allLoading, setAllLoading] = useState(false);

  const [updateContact, { called, loading, data }] = useMutation(
    UPDATECONTACT,
    {
      onCompleted: () => {
        onModalClose();
      },
    }
  );

  const [
    getPaginatedContacts,
    { data: allContacts, fetchMore: fetchMorePaginatedContacts },
  ] = useLazyQuery(PAGINATEDCONTACTSQUERY, {
    fetchPolicy: "cache-and-network",
  });

  const [getContact, { data: cData, cLoading }] = useLazyQuery(CONTACT, {
    fetchPolicy: "cache-and-network",
  });

  const [getPrevContact, { data: prevCData, prevCLoading }] = useLazyQuery(
    CONTACT,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  const [nameAutValue, setNameAutValue] = useState({ name: "", id: 0, _id: 0 });
  const [mongoEntitiesArray, setMongoEntitiesArray] = useState([]);
  const [nameAutInputValue, NameAutInputValue] = useState([]);
  const setNameAutInputValue = (newState) => {
    setStateIfDeepEqual(NameAutInputValue, newState);
  };
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

  useEffect(() => {
    console.log("AUTOCOMPLETE INPUT CHANGE: ", nameAutInputValue);

    //will also run during initial mount
    setIsNextPageLoading(true);
    getPaginatedContacts({
      variables: {
        search: nameAutInputValue,
      },
    });
  }, [nameAutInputValue]);

  const loadNextPage = async (pageVariables) => {
    setIsNextPageLoading(true);
    fetchMorePaginatedContacts(pageVariables);
    return null;
  };

  const [prevContactId, setPrevContactId] = useState();

  useEffect(() => {
    if (prevContactId) {
      getPrevContact({
        variables: {
          contactId: prevContactId,
        },
      });
    }
  }, [prevContactId]);

  useEffect(() => {
    if (allContacts?.paginatedContacts) {
      setMongoEntitiesArray([
        ...allContacts?.paginatedContacts?.edges?.map((el) => el.node),
      ]);
      setHasNextPage(allContacts?.paginatedContacts?.pageInfo?.hasNextPage);
    }
    setIsNextPageLoading(false);
  }, [allContacts]);

  // useEffect(() => {
  //   console.log(
  //     "SET CDATA stateApp.activityDialog 1",
  //     addNew,
  //     stateApp.activityDialog,
  //     cData?.contact,
  //     nameAutValue
  //   );

  //   setNameAutValue((prev) =>
  //     !addNew ? { ...prev } : { name: "", id: 0, _id: 0 }
  //   );
  // }, [addNew]);

  useEffect(() => {
    console.log("SET CDATA 1", addNew, stateApp.activityDialog, cData?.contact);

    if (stateApp.activityDialog) {
      setNameAutValue((prev) =>
        cData?.contact
          ? { name: cData.contact.name, _id: cData.contact._id }
          : { ...prev }
      );
    }
    if (stateApp.activityDialog && addNew) {
      setNameAutValue({ name: "", id: 0, _id: 0 });
    }
  }, [cData, stateApp.activityDialog, addNew]);

  useEffect(() => {
    console.log("SET CDATA NAME AUT", nameAutValue);
    if (nameAutValue?.name) {
      setContact(nameAutValue);
    }
  }, [nameAutValue]);

  useEffect(() => {
    console.log("SET CDATA CONTACT", contactId);

    if (contactId) {
      getContact({
        variables: {
          contactId: contactId,
        },
      });
    }
  }, [contactId]);

  useEffect(() => {
    console.log("set cdata EVENT: SET ACTIVITY:", selectedActivity);
    if (selectedActivity) {
      setAddNew(false);
      setNotes(selectedActivity.notes);
      setActivityType(selectedActivity.type);
      setActivityName(selectedActivity.name);
      setClosed(selectedActivity.isClosed);
      setContactId(selectedActivity.contactId);
      setPrevContactId(selectedActivity.contactId);
      setStartDate(getDateFromString(selectedActivity.start.toISOString()));
      setStartTime(moment(selectedActivity.start).format("HH:mm"));
      setEndDate(getDateFromString(selectedActivity.end.toISOString()));
      setEndTime(moment(selectedActivity.end).format("HH:mm"));
    } else {
      setAddNew(true);
      setNameAutValue({ name: "", id: 0, _id: 0 });
      setClosed(false);
      setNotes("");
      setActivityType("");
      setActivityName("");
      setContactId("");
      setPrevContactId(null);
      setStartDate(getCurrentDate());
      setEndDate(getCurrentDate());
      setStartTime("00:00");
      setEndTime("00:00");
    }
  }, [selectedActivity]);

  const [openDeals, setOpenDeals] = useState([]);
  const [getTransactionData, { loading: tloading, data: tdata }] = useLazyQuery(
    TRANSACTIONDATA
  );

  console.log("OPEN DEALS", openDeals);

  useEffect(() => {
    if (stateApp.user && stateApp.user.mongoId) {
      console.log("OPEN DEALS GET", stateApp.user);
      getTransactionData({
        variables: {
          userId: stateApp.user.mongoId,
        },
      });
    }
  }, [stateApp.user]);

  useEffect(() => {
    if (
      !tloading &&
      tdata?.transactionData?.allData?.lanes &&
      tdata.transactionData.allData.lanes.length > 0
    ) {
      const lanes = tdata?.transactionData?.allData?.lanes;

      // get all deals
      const all = [];
      lanes.forEach((deal) => {
        deal.cards.forEach((card) => {
          all.push(card);
        });
      });

      let open = [];

      all.forEach((card) => {
        if (card.dealState === "won") {
          // do nothing
        } else if (card.dealState === "lost") {
          // do nothing
        } else if (card.isDeleted) {
          // do nothing
        } else open.push(card);
      });

      console.log("OPEN DEALS", open, all);

      setOpenDeals(open);
    }
  }, [tdata]);

  const onModalClose = () => {
    clearFields();
    setSelectedActivity(null);
    setStateApp((stateApp) => ({
      ...stateApp,
      activityDialog: false,
    }));
  };

  const clearFields = () => {
    setAddNew(true);
    setNotes("");
    setActivityType("");
    setActivityName("");
    setClosed(false);
    setStartDate(getCurrentDate());
    setEndDate(getCurrentDate());
    setContactId("");
    setStartTime("00:00");
    setEndTime("00:00");
    setNameAutInputValue("");
  };

  const updateErrors = () => {
    let activityTypeErr = false;
    let activityNameErr = false;
    let startDataErr = false;
    let startTimeErr = false;
    let endDateErr = false;
    let endTimeErr = false;
    let contactErr = false;

    if (!activityType || activityType.length === 0) activityTypeErr = true;
    if (!activityName || activityName.length === 0) activityNameErr = true;
    if (!startDate) startDataErr = true;
    if (!startTime) startTimeErr = true;
    if (!endDate) endDateErr = true;
    if (!endTime) endTimeErr = true;
    if (!nameAutValue || !nameAutValue?.name) contactErr = true;

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
      contact: contactErr,
    });
    return (
      activityNameErr ||
      activityTypeErr ||
      startDataErr ||
      startTimeErr ||
      endDateErr ||
      endTimeErr ||
      contactErr
    );
  };

  const addActivity = async () => {
    if (updateErrors()) return;

    setAllLoading(true);
    let activityLog =
      cData && cData.contact.activityLog
        ? cData.contact.activityLog.map((a) => a)
        : [];

    const dateTime = mergeDateAndTime(startDate, startTime);
    const endDateTime = mergeDateAndTime(endDate, endTime);

    activityLog.push({
      type: activityType,
      name: activityName,
      notes,
      dateTime: dateTime,
      endDateTime: endDateTime,
      user_id: stateApp.user.email,
      isClosed: closed,
    });

    await updateContact({
      variables: {
        contact: {
          _id: cData.contact._id,
          activityLog,
        },
      },
      refetchQueries: ["getAllActivities"],
      awaitRefetchQueries: true,
    });
    setAllLoading(false);
  };

  const updateActivity = async () => {
    if (updateErrors()) return;

    setAllLoading(true);

    const dateTime = mergeDateAndTime(startDate, startTime);
    const endDateTime = mergeDateAndTime(endDate, endTime);

    let activityLog =
      cData && cData.contact.activityLog
        ? cData.contact.activityLog.map((a) => a)
        : [];

    let newActLog = [...activityLog];
    const index =
      newActLog &&
      newActLog.findIndex((activity) => activity._id === selectedActivity._id);

    if (index > -1) {
      newActLog[index] = {
        user_id: selectedActivity.user_id,
        _id: selectedActivity._id,
        fullname: selectedActivity.fullname,
        type: activityType,
        name: activityName,
        dateTime,
        endDateTime,
        notes,
        isClosed: closed,
      };
      newActLog.forEach((v) => delete v.__typename);

      await updateContact({
        variables: {
          contact: {
            _id: cData.contact._id,
            activityLog: [...newActLog],
          },
        },
        refetchQueries: ["getAllActivities"],
        awaitRefetchQueries: true,
      });
    } else {
      let prevActivityLog =
        prevCData && prevCData.contact.activityLog
          ? prevCData.contact.activityLog.map((a) => a)
          : [];

      let newActLog = [...prevActivityLog];
      const index =
        newActLog &&
        newActLog.findIndex(
          (activity) => activity._id === selectedActivity._id
        );

      newActLog.splice(index, 1);

      activityLog.push({
        type: activityType,
        name: activityName,
        notes,
        dateTime: dateTime,
        endDateTime: endDateTime,
        user_id: stateApp.user.email,
        isClosed: closed,
      });

      await updateContact({
        variables: {
          contact: {
            _id: prevContactId,
            activityLog: [...newActLog],
          },
        },
      });

      await updateContact({
        variables: {
          contact: {
            _id: cData.contact._id,
            activityLog,
          },
        },
        refetchQueries: ["getAllActivities"],
        awaitRefetchQueries: true,
      });
    }

    setAllLoading(false);
  };

  const deleteActivity = async () => {
    let activityLog =
      cData && cData.contact.activityLog
        ? cData.contact.activityLog.map((a) => a)
        : [];

    let newActLog = [...activityLog];
    const index =
      newActLog &&
      newActLog.findIndex((activity) => activity._id === selectedActivity._id);

    if (index > -1) {
      newActLog.splice(index, 1);
      newActLog.forEach((v) => delete v.__typename);
      await updateContact({
        variables: {
          contact: {
            _id: cData.contact._id,
            activityLog: [...newActLog],
          },
        },
        refetchQueries: ["getAllActivities"],
        awaitRefetchQueries: true,
      });
    }

    onModalClose();
  };

  return (
    <Dialog
      className={classes.dialogExpCard}
      fullWidth
      maxWidth="xl"
      open={stateApp.activityDialog ? true : false}
      onClose={
        loading && cLoading && allLoading
          ? () => {}
          : () => {
              onModalClose();
            }
      }
    >
      <ExpandableCardProvider
        expanded={true}
        handleCloseExpandableCard={
          loading && cLoading && allLoading
            ? () => {}
            : () => {
                onModalClose();
              }
        }
        title={`${
          addNew ? "Add Activity" : "Activity Details"
          // : activityName
          //? activityName.toUpperCase()
          // : activityType.toUpperCase()
        }`}
        subTitle={""}
        parent="calendar"
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
        handleDelete={deleteActivity}
        component={
          <div className={classes.addAct}>
            <div className={classes.left}>
              <div className={classes.row}>
                <span className={classes.rowIcon}></span>
                <TextField
                  className={clsx(
                    classes.fieldWidth,
                    classes.inputField,
                    activityName === "" && errors.activityName && classes.error
                  )}
                  type="text"
                  variant="outlined"
                  placeholder="Enter activity name"
                  style={{ width: "76%", marginRight: 24 }}
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                />
              </div>
              <div className={classes.row}>
                <span className={classes.rowIcon}></span>
                <div
                  className={clsx(
                    classes.typeDisplay,
                    activityType === "" && errors.activityType && classes.error
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
                      !startDate && errors.startDate && classes.error
                    )}
                    value={startDate}
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
                      classes.marginLeft,
                      !startTime && errors.startTime && classes.error
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
                      !endDate && errors.endDate && classes.error
                    )}
                    value={endDate}
                    type="date"
                    variant="outlined"
                    onChange={(e) => {
                      setEndDate(e.target.value);
                    }}
                  />
                  <TextField
                    className={clsx(
                      classes.dateTimeField,
                      classes.marginLeft,
                      !endTime && errors.endTime && classes.error
                    )}
                    value={endTime}
                    type="time"
                    variant="outlined"
                    onChange={(e) => {
                      setEndTime(e.target.value);
                      console.log("EVENT: END TIME", e.target.value);
                    }}
                  />
                </div>
              </div>
              {/* <div className={classes.row}>
                <span className={classes.rowIcon}></span>
                Add{" "}
                <span style={{ color: "#48A8ED", marginLeft: 8 }}>
                  guests, location, video call, description
                </span>
              </div> */}
              {/* <div className={classes.row}>
                <span className={classes.rowIcon}>
                  <DotsIcon />
                </span>
                <Select disabled variant="outlined" value="free">
                  <MenuItem value="free">Free</MenuItem>
                </Select>
              </div> */}
              <div className={classes.row}>
                <span className={classes.rowIcon}>
                  <DocumentIcon />
                </span>
                <div style={{ width: "76%", marginRight: 24 }}>
                  <TextField
                    multiline
                    rows={8}
                    variant="outlined"
                    placeholder="Enter activity notes here"
                    value={notes}
                    className={clsx(classes.notes)}
                    onChange={(e) => {
                      setNotes(e.target.value);
                    }}
                  />
                  {/* <small>
                    Notes are private and visible only within your Pipedrive
                    account
                  </small> */}
                </div>
              </div>
              <div className={classes.row}>
                <span className={classes.rowIcon}>
                  <PersonIcon />
                </span>
                <div
                  className={clsx(!contact && errors.contact && classes.error)}
                  style={{ width: "76%", margin: "7.5px 0", marginRight: 24 }}
                >
                  <TextField
                    //type="text"
                    //select
                    //disabled
                    placeholder="Activity Owner"
                    variant="outlined"
                    className={clsx(
                      classes.marginBottom,
                      classes.fieldWidth,
                      classes.inputField
                    )}

                    // InputProps={{
                    //   startAdornment: (
                    //     <InputAdornment position="start">
                    //       <AttachMoneyIcon />
                    //     </InputAdornment>
                    //   ),
                    // }}
                  />
                </div>
              </div>
              <div className={classes.row}>
                <span className={classes.rowIcon}>
                  <LinkIcon />
                </span>
                <div style={{ width: "76%", marginRight: 24 }}>
                  <Autocomplete
                    className={classes.fieldWidth}
                    options={openDeals}
                    getOptionLabel={(option) => option.title}
                    renderInput={(params) => (
                      <TextField
                        margin="dense"
                        {...params}
                        label="Associated Deal"
                        variant="outlined"
                      />
                    )}
                  />

                  <br />
                  <div className={classes.fieldWidth}>
                    <AutocompEntityNamesVirtualizeList
                      mongoEntitiesArray={mongoEntitiesArray}
                      setMongoEntitiesArray={setMongoEntitiesArray}
                      nameAutValue={nameAutValue}
                      setNameAutValue={setNameAutValue}
                      nameAutInputValue={nameAutInputValue}
                      setNameAutInputValue={setNameAutInputValue}
                      variant="outlined"
                      label="Associated Contact or Lead"
                      hasNextPage={hasNextPage}
                      isNextPageLoading={isNextPageLoading}
                      loadNextPage={loadNextPage}
                    />
                  </div>

                  {errors.contact && (
                    <>
                      <br />
                      <small style={{ color: "red" }}>
                        This is a required field
                      </small>
                    </>
                  )}
                  <br />

                  <TextField
                    type="text"
                    variant="outlined"
                    className={clsx(
                      classes.marginBottom,
                      classes.inputField,
                      classes.fieldWidth
                    )}
                    placeholder="Organization"
                  />
                </div>
              </div>
              <div className={classes.row}>
                <span className={classes.rowIcon}></span>
                <div
                  className={classes.btnGroup}
                  style={{ width: "76%", marginRight: 24 }}
                >
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
                    disabled={loading || cLoading || allLoading}
                  >
                    Cancel
                  </Button>

                  <Button
                    disabled={loading || cLoading || allLoading}
                    className={classes.marginLeft}
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      console.log("ADD", addNew);
                      if (addNew) addActivity();
                      else updateActivity();
                    }}
                  >
                    {allLoading && (
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
            </div>
            <div className={classes.right}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView={"day"}
                defaultDate={startDate}
                date={startDate}
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
