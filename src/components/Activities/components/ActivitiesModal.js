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
import { GETMONGOUSERS as GETUSERS } from "../../../graphQL/useQueryGetUsers";
import Typography from "@material-ui/core/Typography";
import {
  ADDACTIVITY,
  DELETEACTIVITY,
  UPDATEACTIVITY,
} from "../../../graphQL/useMutationActivity";

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
  owner: false,
};

const localizer = momentLocalizer(moment);

export default function ActivitiesModal({
  selectedActivity,
  events,
  setSelectedActivityId,
}) {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  console.log("SELECTED ACTIVITY", selectedActivity, stateApp);

  const [addNew, setAddNew] = useState(true);
  const [activityType, setActivityType] = useState("");
  const [activityName, setActivityName] = useState("");
  const [closed, setClosed] = useState(false);
  const [startDate, setStartDate] = useState(getCurrentDate());
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [calenderDate, setCalenderDate] = useState(new Date());
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("08:00");
  const [notes, setNotes] = useState("");
  const [owner, setOwner] = useState({ name: "", id: null });
  const [dealId, setDealId] = useState("");
  const [contact, setContact] = useState({});
  const [errors, setErrors] = useState({ ...initialErrors });
  const [users, setUsers] = useState([]);

  const [getAllUsers, { data: userLists }] = useLazyQuery(GETUSERS, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    if (userLists && userLists.allUsers) {
      setUsers(
        userLists.allUsers.map((user) => ({
          value: user._id,
          text: user.name,
        }))
      );
    }
  }, [userLists]);

  const [addActivityMutation, { loading: addLoading }] = useMutation(
    ADDACTIVITY,
    {
      onCompleted: () => {
        onModalClose();
      },
      refetchQueries: ["getAllActivities"],
      awaitRefetchQueries: true,
    }
  );

  const [updateActivityMutation, { loading: updateLoading }] = useMutation(
    UPDATEACTIVITY,
    {
      onCompleted: () => {
        onModalClose();
      },
      refetchQueries: ["getAllActivities"],
      awaitRefetchQueries: true,
    }
  );

  const [deleteActivityMutation, { loading: deleteLoading }] = useMutation(
    DELETEACTIVITY,
    {
      onCompleted: () => {
        onModalClose();
      },
      refetchQueries: ["getAllActivities"],
      awaitRefetchQueries: true,
    }
  );

  const [
    getPaginatedContacts,
    { data: allContacts, fetchMore: fetchMorePaginatedContacts },
  ] = useLazyQuery(PAGINATEDCONTACTSQUERY, {
    fetchPolicy: "cache-and-network",
  });

  const [nameAutValue, setNameAutValue] = useState({ name: "", _id: null });
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
    const date = mergeDateAndTime(startDate, startTime);
    setCalenderDate(new Date(date));
  }, [startDate, startTime]);

  useEffect(() => {
    console.log("set cdata EVENT: SET ACTIVITY:", selectedActivity);
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
      setNameAutValue({
        name: selectedActivity.contactName,
        _id: selectedActivity.contactId,
      });
      setStartDate(
        moment.parseZone(selectedActivity.start).format("yyyy-MM-DD")
      );
      setStartTime(moment.parseZone(selectedActivity.start).format("HH:mm"));
      setCalenderDate(selectedActivity.start);

      setEndDate(moment.parseZone(selectedActivity.end).format("yyyy-MM-DD"));
      setEndTime(moment.parseZone(selectedActivity.end).format("HH:mm"));
      console.log(
        "SELECTED ACTIVITY",
        getDateFromString(selectedActivity.end.toISOString()),
        moment(selectedActivity.end).format("yyyy-MM-DD")
      );
    } else {
      setAddNew(true);
      setNameAutValue({ name: "", _id: null });
      setClosed(false);
      setNotes("");
      setOwner({
        name: stateApp.user.fullname || stateApp.user.email,
        id: stateApp.user.mongoId,
      });
      setDealId("");
      setActivityType("");
      setActivityName("");
      setStartDate(getCurrentDate());
      setCalenderDate(new Date());
      setEndDate(getCurrentDate());
      setStartTime("08:00");
      setEndTime("08:00");
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
    let open = [];

    if (!tloading && tdata?.transactionData) {
      tdata.transactionData.forEach((pipeline) => {
        const lanes = pipeline.allData?.lanes;

        // get all deals
        const all = [];
        lanes.forEach((deal) => {
          deal.cards.forEach((card) => {
            all.push(card);
          });
        });

        all.forEach((card) => {
          if (card.dealState === "won") {
            // do nothing
          } else if (card.dealState === "lost") {
            // do nothing
          } else if (card.isDeleted) {
            // do nothing
          } else open.push(card);
        });
      });
    }
    console.log("ALL", open);
    setOpenDeals(open);
  }, [tdata]);

  const onModalClose = () => {
    clearFields();
    setSelectedActivityId(null);
    setStateApp((stateApp) => ({
      ...stateApp,
      activityDialog: false,
      selectedActivity: null,
    }));
  };

  const clearFields = () => {
    setAddNew(true);
    setNotes("");
    setOwner({
      name: stateApp.user.fullname || stateApp.user.email,
      id: stateApp.user.mongoId,
    });
    setNameAutValue({ name: "", _id: null });
    setDealId("");
    setActivityType("");
    setActivityName("");
    setClosed(false);
    setStartDate(getCurrentDate());
    setCalenderDate(new Date());
    setEndDate(getCurrentDate());
    setStartTime("08:00");
    setEndTime("08:00");
    setNameAutInputValue("");
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

    console.log("ADD ERROR", {
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
          contactId: nameAutValue._id,
          contactName: nameAutValue.name,
          dealId,
          dateTime: new Date(dateTime).toUTCString(),
          endDateTime: new Date(endDateTime).toUTCString(),
          isClosed: closed,
        },
      },
    });
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
          contactId: nameAutValue._id,
          contactName: nameAutValue.name,
          dealId,
          isClosed: closed,
        },
      },
    });
  };

  const deleteActivity = async () => {
    await deleteActivityMutation({
      variables: {
        id: selectedActivity._id,
      },
    });
  };

  return (
    <Dialog
      className={classes.dialogExpCard}
      fullWidth
      maxWidth="xl"
      open={stateApp.activityDialog ? true : false}
      onClose={
        addLoading && updateLoading
          ? () => {}
          : () => {
              onModalClose();
            }
      }
    >
      <ExpandableCardProvider
        expanded={true}
        handleCloseExpandableCard={
          addLoading && updateLoading
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
                    // classes.fieldWidth,
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
                      setEndTime(e.target.value);
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
                  style={{ width: "76%", margin: "7.5px 0", marginRight: 24 }}
                >
                  <Autocomplete
                    className={clsx(
                      classes.fieldWidth,
                      !owner.id && errors.owner && classes.error
                    )}
                    options={users}
                    onChange={(e, user) => {
                      setOwner({ name: user.text, id: user.value });
                    }}
                    value={
                      users.find((user) => user.value === owner.id) || null
                    }
                    getOptionLabel={(option) => option.text}
                    getOptionSelected={(option) => option.value === owner.id}
                    renderInput={(params) => (
                      <TextField
                        margin="dense"
                        {...params}
                        variant="outlined"
                        label="Activity Owner"
                      />
                    )}
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
                    onChange={(e, deal) => {
                      setDealId(deal.id);
                    }}
                    value={openDeals.find((deal) => deal.id === dealId) || null}
                    getOptionSelected={(option) => option.id === dealId}
                    getOptionLabel={(option) => option.title}
                    renderOption={(option) => {
                      return (
                        <Grid container spacing={0}>
                          <Grid container item xs={12} alignItems="center">
                            <Grid item xs>
                              <span style={{ fontWeight: 400 }}>
                                {option.title}
                              </span>

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
                    disabled={addLoading || updateLoading}
                  >
                    Cancel
                  </Button>

                  <Button
                    disabled={addLoading || updateLoading}
                    className={classes.marginLeft}
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      console.log("ADD", addNew);
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
            </div>
            <div className={classes.right}>
              <Calendar
                drilldownView="week"
                popup={true}
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView={"day"}
                defaultDate={calenderDate}
                date={calenderDate}
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
