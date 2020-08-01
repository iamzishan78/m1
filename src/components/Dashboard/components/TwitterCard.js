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
import SearchIcon from "@material-ui/icons/Search";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";

const useStyles = makeStyles((theme) => ({
  header: {
    padding: "8px 8px 0 8px",
    backgroundColor:'#011133',
    color: 'white'
  },
  boldtxt: {
    fontWeight: "bold",
  },
  search: {
    display: "flex",
    alignItems: "center",
    width: "calc(100% + 32px)",
    transform: "scale(0.8)",
    marginLeft: "-16px",
    marginBottom: "-8px",
  },
  input: {
    marginLeft: "8px",
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
}));

const DragHandle = sortableHandle(() => (
  <IconButton aria-label="drag">
    <DragIndicatorOutlinedIcon fontSize="default" htmlColor="#fff" />
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

  const onSubmit = (e) => {
    e.preventDefault();
    const thandleRegex = /^[A-Za-z0-9_]{1,15}$/;
    if (thandleRegex.test(name)) {
      return setStateDashboard({ ...stateDashboard, userhandle: name });
    }
    if (name.trim() == "") {
      return setStateDashboard({
        ...stateDashboard,
        userhandle: "m1neraltech",
      });
    }
  };

  return (
    <Fragment>
      <CardHeader
        className={classes.header}
        action={<DragHandle />}
        title={`Twitter`}
      />
      <Paper
        component="form"
        variant="outlined"
        elevation={0}
        className={classes.search}
        onSubmit={(e) => onSubmit(e)}
      >
        <InputBase
          className={classes.input}
          placeholder="Search @username"
          value={name}
          onChange={({ target }) => setName(target.value)}
          inputProps={{ "aria-label": "search twitter username" }}
        />
        <IconButton
          type="submit"
          className={classes.iconButton}
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>
      </Paper>
      <TwitterWidget />
    </Fragment>
  );
};

export default TwitterCard;
