import React, { useContext, useState } from "react";
import { Views } from "react-big-calendar";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { AppContext } from "AppContext";

import { useLazyQuery } from "@apollo/client";
import { GET_ACTIVITY_TYPES } from "graphQL/useQueryActivityTypes";

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    padding: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewSwitcher: {
    height: 30,
    marginRight: 8,
  },
  filterByTypeDisplay: {
    border: "1px solid #d9d9d9",
    borderRadius: 3,
    display: "flex",
    alignItems: "center",
    marginRight: "10px",
  },
  filterDisplay: {
    color: "#d9d9d9",
    display: "flex",
    alignItems: "center",
    padding: "2px 4px",
    border: "1px solid #fff",
    borderRadius: 3,
    cursor: "pointer",

    "& span": {
      marginLeft: 4,
    },
  },
  datePicker: {
    overflow: "hidden",
    position: "absolute",
    width: "97px",
    marginLeft: "41px",
    opacity: "0",

    '& input::-webkit-calendar-picker-indicator': {
      display: "block",
      top: 0,
      left: 0,
      background: "#0000",
      position: "absolute",
      transform: " scale(12)"
    },
  },
  active: {
    backgroundColor: "#d0f1fc",
    color: "#15a9d7 !important",
  },
  right: {
    display: "flex",
  },
  left: {
    display: "flex",
    alignItems: "center",
  },
  marginLeft: {
    marginLeft: 8,
  },
  centerNav: {
    display: "flex",
    alignItems: "center",
  },
  filterToggleBtn: {
    borderRadius: 5,
    border: "1px solid #d9d9d9",
    color: "#333",
    transition: "200ms all",
    backgroundColor: "#f5f5f5",
  },
  activeBtn: {
    borderRadius: 5,
    border: "1px solid #1CB6DA",
    backgroundColor: "#1CB6DA",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#1CB6DAdd",
    },
  },
}));

const activitiesTypesOptions = [
  { label: "All", value: "all" },
  { label: "Call", value: "call" },
  { label: "Meeting", value: "meeting" },
  { label: "Task", value: "task" },
  { label: "Deadline", value: "deadline" },
  { label: "Email", value: "email" },
  { label: "Text Message", value: "text_message" },
  { label: "Mailer", value: "mailer" },
];

const ActivitiesToolbar = ({
  activityFilterByType,
  setActivityFilterByType,
  activityFilterByTime,
  setActivityFilterByTime,
  activityFilterByOwner,
  setActivityFilterByOwner,
  setSelectedDate,
  selectedDate,
  view,
  setView,
  mongoUsers,
  type,
  ...toolbar
}) => {
  const classes = useToolbarStyles();
  const [stateApp] = useContext(AppContext);
  const [selectedObligationType, setObligationType] = useState({ label: "All", value: "all" });

  const [getActivityTypes, { data: obligationTypes }] = useLazyQuery(GET_ACTIVITY_TYPES);

  React.useEffect(() => {
    if (type === "Obligation") {
      getActivityTypes({
        variables: { category: "Obligaiton" },
      });
    }
  }, [type, getActivityTypes]);

  const goToBack = () => {
    setSelectedDate(state => {
      let current = state
      if (state.getMonth() === 1)
        current = new Date(state.getFullYear() - 1, 0, 1);
      else
        current = new Date(state.getFullYear(), state.getMonth() - 1, 1);

      return current
    })

  };
  const goToNext = () => {
    setSelectedDate(state => {
      let current = state
      if (state.getMonth() === 11)
        current = new Date(state.getFullYear() + 1, 0, 1);
      else
        current = new Date(state.getFullYear(), state.getMonth() + 1, 1);

      return current
    })
  };
  // const goToCurrent = () => {
  //   toolbar.onNavigate("TODAY");
  // };
  // const goToNextWeek = () => {
  //   var today = new Date();
  //   toolbar.onNavigate(
  //     "DATE",
  //     new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  //   );
  // };
  // const goToTomorrow = () => {
  //   var today = new Date();
  //   toolbar.onNavigate(
  //     "DATE",
  //     new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000)
  //   );
  // };

  const handleViewChange = (event) => {
    const view = event.target.value;
    setView(view);
    toolbar.onView(view);
  };

  const acitvityOwnerOptions = React.useMemo(() => {
    let ownerOptions = [{ label: "All", value: "all" }];
    if (mongoUsers) {
      mongoUsers
        .filter((u) => u.name)
        .forEach((u) => {
          ownerOptions.push({ ...u, label: u.displayName, value: u._id });
        });
    }
    return ownerOptions;
  }, [mongoUsers]);

  const obligationOptions = React.useMemo(() => {
    if (obligationTypes?.activityTypes) {
      let obligations = obligationTypes?.activityTypes?.map((type) => ({
        label: type,
        value: type,
      }));
      obligations.unshift({ label: "All", value: "all" });
      return obligations;
    } else return [];
  }, [obligationTypes]);

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <div className={classes.filterByTypeDisplay}>
          {type === "Activity" && (
            <Autocomplete
              id="activityFilterByType"
              options={activitiesTypesOptions}
              getOptionLabel={(option) => option.label}
              style={{ width: 220 }}
              size="small"
              defaultValue={activitiesTypesOptions.find((o) => o.value === activityFilterByType)}
              value={activitiesTypesOptions.find((o) => o.value === activityFilterByType)}
              onChange={(_, value) => {
                setActivityFilterByType(value?.value ?? "all");
              }}
              renderInput={(params) => <TextField {...params} label="Activity Type" variant="outlined" value={activityFilterByType} />}
            />
          )}
          {type === "Obligation" && (
            <Autocomplete
              id="obligationType"
              options={obligationOptions}
              getOptionLabel={(option) => option.label}
              style={{ width: 220 }}
              size="small"
              defaultValue={selectedObligationType}
              value={selectedObligationType}
              onChange={(_, value) => {
                setObligationType(value?.value ?? "");
              }}
              renderInput={(params) => <TextField {...params} label="Obligation Type" variant="outlined" />}
            />
          )}
        </div>
        <div className={classes.filterByTypeDisplay}>
          <Autocomplete
            id="activityFilterByOwner"
            options={acitvityOwnerOptions}
            getOptionLabel={(option) => option.label}
            style={{ width: 220 }}
            size="small"
            defaultValue={acitvityOwnerOptions.find((u) => u.value === activityFilterByOwner)}
            value={acitvityOwnerOptions.find((u) => u.value === activityFilterByOwner)}
            onChange={(_, value) => {
              setActivityFilterByOwner(value?.value ?? "all");
            }}
            renderInput={(params) => <TextField {...params} label="Owner" variant="outlined" value={activityFilterByOwner} />}
          />
        </div>
      </div>
      {stateApp.activityDisplayType === "calendar" && (
        <div className={classes.centerNav}>
          <IconButton size="small" className={classes.marginLeft} onClick={() => goToBack()}>
            <NavigateBeforeIcon />
          </IconButton>
          <p className={classes.marginLeft}>{toolbar.label}</p>
          <IconButton size="small" className={classes.marginLeft} onClick={() => goToNext()}>
            <NavigateNextIcon />
          </IconButton>

          <TextField
            id="date"
            label="Birthday"
            type="date"
            format="MM/DD/YYYY"
            defaultValue={selectedDate}
            className={classes.datePicker}
            onChange={(event) => setSelectedDate(new Date(event.target.value))}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
      )}
      <div className={classes.right}>
        {stateApp.activityDisplayType === "calendar" ? (
          <Select className={classes.viewSwitcher} variant="outlined" value={view} onChange={handleViewChange}>
            <MenuItem value={Views.WEEK}>Week</MenuItem>
            <MenuItem value={Views.MONTH}>Month</MenuItem>
          </Select>
        ) : null}

        <div>
          <ButtonGroup>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${activityFilterByTime === "all" && classes.activeBtn}`}
              onClick={() => setActivityFilterByTime("all")}
            >
              All
            </Button>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${activityFilterByTime === "upcoming" && classes.activeBtn}`}
              onClick={() => setActivityFilterByTime("upcoming")}
            >
              Upcoming
            </Button>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${activityFilterByTime === "overdue" && classes.activeBtn}`}
              onClick={() => setActivityFilterByTime("overdue")}
            >
              Overdue
            </Button>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${activityFilterByTime === "open" && classes.activeBtn}`}
              onClick={() => setActivityFilterByTime("open")}
            >
              Open
            </Button>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${activityFilterByTime === "closed" && classes.activeBtn}`}
              onClick={() => setActivityFilterByTime("closed")}
            >
              Closed
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesToolbar;
