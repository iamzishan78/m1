import { Grid } from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import DragIndicatorOutlinedIcon from "@material-ui/icons/DragIndicatorOutlined";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { sortableHandle } from "react-sortable-hoc";
import { DashboardContext } from "../DashboardContext";
import TwitterWidget from "./TwitterWidget";

const useStyles = makeStyles((theme) => ({
  search: {
    width: "100%",
    transform: "scale(0.9)",
  },
  header: {
    padding: "8px 8px 0 8px",
  },
  boldtxt: {
    fontWeight: "bold",
  },
  tname: {
    padding: "8px 16px !important",
  },
  ticon: {
    textAlign: "right",
  },
  mactions: {
    padding: "0 8px",
    bottom: 0,
  },
  tcontent: {
    height: "250px",
    overflow: "auto",
    padding: "0 16px",
  },
}));

const DragHandle = sortableHandle(() => (
  <IconButton aria-label="drag">
    <DragIndicatorOutlinedIcon fontSize="default" />
  </IconButton>
));

const TwitterCard = () => {
  const classes = useStyles();
  const [stateDashboard, setStateDashboard] = useContext(DashboardContext);
  const [name, setName] = useState("");
  const [timeOut, setTime] = useState(null);

  const debounceFunc = (func, time) => {
    clearTimeout(timeOut);
    return setTime(setTimeout(func, time));
  };

  useEffect(() => {
    const thandleRegex = /^[A-Za-z0-9_]{1,15}$/;
    if (thandleRegex.test(name)) {
      return debounceFunc(
        () => setStateDashboard({ ...stateDashboard, userhandle: name }),
        1000
      );
    }
    return debounceFunc(
      () => setStateDashboard({ ...stateDashboard, userhandle: "m1neraltech" }),
      1
    );
  }, [name]);

  return (
    <Fragment>
      <CardHeader
        className={classes.header}
        action={<DragHandle />}
        title={`Twitter`}
      />
      <Grid>
        <TextField
          id="outlined-basic"
          label="Search @username"
          variant="outlined"
          className={classes.search}
          size="small"
          value={name}
          onChange={({ target }) => setName(target.value)}
        />
      </Grid>
      <TwitterWidget />
    </Fragment>
  );
};

export default TwitterCard;
