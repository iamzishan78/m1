import { Grid } from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import { useLazyQuery, useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import DragIndicatorOutlinedIcon from "@material-ui/icons/DragIndicatorOutlined";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { sortableHandle } from "react-sortable-hoc";
import Tooltip from "@material-ui/core/Tooltip";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {
  CircularProgress,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ClearIcon from "@material-ui/icons/Clear";
import CheckCircleIcon from "components/Shared/svgIcons/CheckCircleIcon";
import EventCalendarIcon from "components/Shared/svgIcons/EventCalendarIcon";
import { GETALLACTIVITIES } from "../../../graphQL/useQueryGetAllActivities";
import CallIcon from "@material-ui/icons/Call";
import MeetingIcon from "@material-ui/icons/Group";
import TaskIcon from "@material-ui/icons/WatchLater";
import DeadlineIcon from "@material-ui/icons/Flag";
import EmailIcon from "@material-ui/icons/Email";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import DefaultIcon from "@material-ui/icons/Event";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { UPDATEACTIVITY } from "../../../graphQL/useMutationActivity";
import { AppContext } from "AppContext";
import AddIcon from '@material-ui/icons/Add';
import ActivitiesModal from "../../Activities/components/ActivitiesModal"

const useStyles = makeStyles((theme) => ({
  header: {
    padding: "8px 8px 0 16px",
    backgroundColor: "#FFFFF",
    color: "black",
  },
  progress: {
    marginLeft: "30px",
    verticalAlign: "middle",
  },
  listitem: {
    padding: "10px",
    backgroundColor: "#F6F8F9",
    "&:hover": {
      backgroundColor: "#DDDFE0",
    },
    "& .MuiFormControl-marginDense": {
      margin: "0px !important",
    },
    "& .MuiIconButton-root": {
      padding: "10px !important",
    },
    // "& .MuiPaper-elevation1": {
    //   boxShadow: "none !important",
    // },
  },
  title: {
    fontSize: "16px",
    marginLeft: "10px",
    fontWeight: "bold",
    textDecoration: "none",
    color: "black",
    cursor: "pointer",
    display: "flex",
    "& svg": {
      color: "#000000",
      marginRight: "7px",
    },
    "&:hover": {
      textDecoration: "underline",
    },
  },
  paper: {
    margin: "12px 8px",
    cursor: "pointer",
    boxShadow: "none !important",
  },
  gridStyle: {
    padding: "8px 0px",
  },
  paddingLeft10: {
    paddingLeft: "10px !important",
    paddingTop: "3px !important",
  },
  customTabs: {
    display: 'flex',
    alignItems: 'center ',
    float: "right",
    paddingRight: "30px",
    "& .MuiTab-root": {
      minWidth: "60px",
    },
    "& .Mui-selected": {
      color: "#18AADD",
    },
  },

  menuItem: {
    fontSize: '14px',
    padding: 0,
    '& > span': {
      display: 'flex',
      gap: '4px',
    }
  }
}));

const DragHandle = sortableHandle(() => (
  <IconButton aria-label="drag">
    <DragIndicatorOutlinedIcon fontSize="default" htmlColor="#808080" />
  </IconButton>
));

const activityIcons = {
  call: <CallIcon />,
  meeting: <MeetingIcon />,
  task: <TaskIcon />,
  deadline: <DeadlineIcon />,
  email: <EmailIcon />,
  mailer: <ContactMailIcon />,
};

const Tasks = () => {
  const history = useHistory();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [getAllActivities, { data: orginalData, loading }] = useLazyQuery(
    GETALLACTIVITIES,
    {
      fetchPolicy: `network-only`,
    }
  );
  const [updateActivityMutation] = useMutation(UPDATEACTIVITY, {
    refetchQueries: ["getAllActivities"],
    awaitRefetchQueries: true,
  });
  const classes = useStyles();
  const [tab, setTab] = useState(0);
  const [data, setData] = useState([]);
  useEffect(() => {
    if (orginalData && Array.isArray(orginalData.activities)) {
      const sortCallBack = (a, b) => moment(b.dateTime).valueOf() - moment(a.dateTime).valueOf();

      if (tab === 0) {
        setData(
          orginalData.activities.filter(activity =>
            !activity.isClosed &&
            stateApp.user._id === activity.ownerId &&
            moment.parseZone(new Date(activity.dateTime))?.isSame(new Date(), "day")
          ).sort(sortCallBack)
        )
      } else if (tab === 1) {
        const tomorrow = moment().add(1, 'days').startOf('day'); // Start of the next day
        const futureDate = moment().add(7, 'days').endOf('day'); // Include the end of the 7th day
        setData(
          orginalData.activities.filter(
            (activity) =>
              !activity.isClosed &&
              stateApp.user._id === activity.ownerId &&
              moment
                .parseZone(new Date(activity.dateTime))
                .isBetween(tomorrow, futureDate)
          ).sort(sortCallBack)
        );
      } else {
        setData(
          orginalData.activities.filter(
            (activity) =>
              !activity.isClosed &&
              stateApp.user._id === activity.ownerId &&
              moment.parseZone(new Date(activity.dateTime)).isBefore(moment())
          ).sort(sortCallBack)
        );
      }
    }
  }, [orginalData, tab]);

  useEffect(() => {
    if (stateApp && stateApp.user) {
      getAllActivities({
        variables: {
          category: "CRM",
        },
      });
    }
  }, [stateApp]);

  const completeActivity = async (activityData) => {
    await updateActivityMutation({
      variables: {
        activity: {
          _id: activityData._id,
          isClosed: true,
        },
      },
    });
  };

  const Title = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [search, setSearch] = useState('');

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleClick = event => {
      setAnchorEl(event.currentTarget);
    };

    return (
      <Grid container className={classes.gridStyle}>
        <Grid item xs={6} >
          <Grid container alignItems="center" style={{ gap: '1rem' }}>
            <div>My Tasks</div>
            <TextField
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                margin: 0,
                width: "70%"
              }}
              margin="dense"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment>
                    <IconButton size="small">
                      <SearchIcon htmlColor="grey" />
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    <Tooltip title="Clear">
                      <IconButton
                        id="crossButton"
                        size="small"
                        htmlColor="#fff"
                        onClick={() => setSearch("")}
                      >
                        <ClearIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                ),
              }}
            />
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.customTabs}>
            <Tabs
              value={tab}
              textColor="primary"
              onChange={(e, newValue) => {
                setTab(newValue);
              }}
            >
              <Tab label="Today" />
              <Tab label="Upcoming" />
              <Tab label="Overdue" />
            </Tabs>
            <MoreHorizIcon onClick={handleClick} />
          </div>
          <Menu
            id="menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <MenuItem >
              <IconButton className={classes.menuItem} onClick={() => setStateApp({ ...stateApp, activityDialog: true })}>
                <AddIcon /> {"New task"}
              </IconButton>
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>
    );
  };
  return (
    <Fragment>
      <CardHeader
        // action={<DragHandle />}
        title={<Title />}
        className={classes.header}
      />
      {loading ? (
        <CircularProgress
          className={classes.progress}
          size={80}
          disableShrink
          color="secondary"
        ></CircularProgress>
      ) : (
        <List style={{ maxHeight: "calc(100% - 48px)", overflow: "auto" }}>
          {data.map((activity, i) => {
            return (
              <Paper key={i} className={classes.paper}>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                  className={classes.listitem}
                  spacing={1}
                >
                  <Grid item xs={10} zeroMinWidth>
                    <span
                      className={classes.title}
                      onClick={() =>
                        history.push(`/calendar/activities/${activity._id}`)
                      }
                    >
                      {activityIcons[activity.type] || <DefaultIcon />}
                      {activity?.name || "N/A"}
                    </span>
                    <Grid container className={classes.gridStyle}>
                      <Grid item xs={11} className={classes.paddingLeft10}>
                        <span>Contact: {activity?.contactName || "N/A"}</span>
                        <br />
                        <span>
                          Date:{" "}
                          {activity.dateTime
                            ? moment
                              .parseZone(new Date(activity.dateTime))
                              .format("MM/DD/YYYY hh:mm:ssa")
                            : "N/A"}
                        </span>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={2} style={{ textAlign: "-webkit-center" }}>
                    <Tooltip title="Activity details">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          history.push(`/calendar/activities/${activity._id}`);
                        }}
                      >
                        <EventCalendarIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Close task">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          completeActivity(activity);
                        }}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Paper>
            );
          })}
        </List>
      )}

      <ActivitiesModal setSelectedActivityId={() => { }} events={[]} />
    </Fragment>
  );
};
export default Tasks;
