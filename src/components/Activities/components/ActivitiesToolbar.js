import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import moment from "moment";
import { Views } from "react-big-calendar";

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    padding: "16px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewSwitcher: {
    height: 40,
  },
}));

const ActivitiesToolbar = (toolbar) => {
  const classes = useToolbarStyles();
  const goToBack = () => {
    toolbar.onNavigate("PREV");
  };
  const goToNext = () => {
    toolbar.onNavigate("NEXT");
  };
  const goToCurrent = () => {
    toolbar.onNavigate("TODAY");
  };

  // For Views
  const [view, setView] = React.useState(Views.WEEK);

  const handleViewChange = (event) => {
    const view = event.target.value;
    setView(view);
    toolbar.onView(view);
  };

  return (
    <div className={classes.root}>
      <div>Toolbar</div>
      <div>
        <Select
          className={classes.viewSwitcher}
          variant="outlined"
          value={view}
          onChange={handleViewChange}
        >
          <MenuItem value={Views.DAY}>Day</MenuItem>
          <MenuItem value={Views.WEEK}>Week</MenuItem>
          <MenuItem value={Views.MONTH}>Month</MenuItem>
        </Select>
      </div>
    </div>
  );
};

export default ActivitiesToolbar;
