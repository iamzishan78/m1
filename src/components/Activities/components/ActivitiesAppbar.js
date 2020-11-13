import React, { useContext } from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Add from "@material-ui/icons/Add";
import List from "@material-ui/icons/List";
import CalendarToday from "@material-ui/icons/CalendarToday";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../../AppContext";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fff",
    padding: "0 16px",
  },
  top: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  right: {
    display: "flex",
    alignItems: "center",

    "& h4": {
      color: "#0DBBEA",
      marginRight: 16,
    },
  },
  selectFilter: {
    height: 34,
    marginLeft: 8,
  },
  toggleBtn: {
    borderRadius: 5,
    border: "1px solid #1CB6DA",
    color: "#1CB6DA",
    transition: "200ms all",
    "&:hover": {
      backgroundColor: "#1CB6DA44",
    },
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
  left: {
    display: "flex",
    alignItems: "center",
  },
  import: {
    marginLeft: 8,
    backgroundColor: "#F0F0F0",
  },
  addDeal: {
    marginLeft: 8,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: "#011133",
    color: "#fff",
    transition: "200ms all",

    "&:hover": {
      backgroundColor: "#263451",
    },
  },
}));

const ActivitiesAppBar = ({ activityDisplayType, setActivityDisplayType }) => {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);

  const handleClickAddActivity = () => {
    setStateApp((stateApp) => ({
      ...stateApp,
      activityDialog: true,
    }));
  };

  return (
    <>
      <AppBar
        elevation={1}
        className={classes.root}
        position="static"
        variant="outlined"
      >
        <div className={classes.top}>
          <div className={classes.right}>
            <h4>ACTIVITIES</h4>
            <ButtonGroup>
              <IconButton
                size="small"
                className={`${classes.toggleBtn} ${
                  activityDisplayType === "table" && classes.activeBtn
                }`}
                onClick={() => setActivityDisplayType("table")}
              >
                <List />
              </IconButton>
              <IconButton
                size="small"
                className={`${classes.toggleBtn} ${
                  activityDisplayType === "calender" && classes.activeBtn
                }`}
                onClick={() => setActivityDisplayType("calender")}
              >
                <CalendarToday />
              </IconButton>
            </ButtonGroup>
            <Select
              className={classes.selectFilter}
              variant="outlined"
              value="all"
            >
              <MenuItem value="all">All Deals</MenuItem>
            </Select>
          </div>
          <div className={classes.left}>
            <Button className={classes.import} color="default" size="small">
              IMPORT
            </Button>
            <Button
              className={classes.addDeal}
              color="primary"
              size="small"
              startIcon={<Add />}
              onClick={handleClickAddActivity}
            >
              Add Activity
            </Button>
          </div>
        </div>
        {/* <div className={classes.bottom}>
          <ButtonGroup>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${
                activityFilter === "all" && classes.activeBtn
              }`}
              onClick={() => setActivityFilter("all")}
            >
              ALL
            </Button>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${
                activityFilter === "open" && classes.activeBtn
              }`}
              onClick={() => setActivityFilter("open")}
            >
              OPEN
            </Button>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${
                activityFilter === "lost" && classes.activeBtn
              }`}
              onClick={() => setActivityFilter("lost")}
            >
              Lost
            </Button>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${
                activityFilter === "won" && classes.activeBtn
              }`}
              onClick={() => setActivityFilter("won")}
            >
              Won
            </Button>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${
                activityFilter === "deleted" && classes.activeBtn
              }`}
              onClick={() => setActivityFilter("deleted")}
            >
              Deleted
            </Button>
          </ButtonGroup>
        </div>
      */}
      </AppBar>
    </>
  );
};

export default ActivitiesAppBar;
