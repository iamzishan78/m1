import React, { useState, useEffect } from "react";
import { Grid, TextField } from "@material-ui/core";

import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import { useLazyQuery } from "@apollo/client";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";

import { GETMONGOUSERS } from "graphQL/useQueryGetUsers";

const filter = createFilterOptions();

const useStyles = makeStyles((theme) => ({
  noBorder: {
    border: "none",
  },
  search: {
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "& .MuiOutlinedInput-root": {
      paddingRight: "0px !important",
    },
    "& .MuiAutocomplete-endAdornment": {
      display: "none",
    },
  },
}));

export default function DealComment({ comment, showActions, setComment }) {
  const classes = useStyles();

  console.log("comment", comment);
  const [users, setUsers] = useState([]);
  const [userValue, setUserValue] = useState("");
  const [showOptions, setShowOptions] = useState(false);
//   const [mentionedList, setMentionedList] = useState([]);
  const [nameAutValue, setNameAutValue] = useState([]);

  const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    getAllMongoUsers();
  }, [getAllMongoUsers]);

  useEffect(() => {
    if (userLists && userLists.allMongoUsers) {
      const data = userLists.allMongoUsers
        .map((user) => ({
          _id: user._id,
          name: user.name,
        }))
        .filter((user) => user._id && user.name);
      setUsers(data);
    }
  }, [userLists]);

  //   const setCommentValue = (value) => {
  //     const commentValue = "";
  //     for (let i = 0; i < value.length; i++) {}
  //     setComment(value);
  //   };

  const onInputChange = (event, value, reason) => {
    if (value.includes("@")) {
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
    setUserValue(value.split("@")[1]);
    // for (let i = 0; i < value.length; i++) {
    //     debugger
    // }
    setNameAutValue([{ name: value, _id: "" }]);
    // setCommentValue(value);
  };

  const onChange = (e, act) => {
    debugger;
    // setShowOptions(false);
    // const value = comment.split("@")[0];
    // setNameAutValue({ name: value + act.name, _id: "" });
    // setComment(value + `{{${act._id}}}`);
    // if(!mentionedList.includes(act._id)){
    //     const mentions = mentionedList;
    //     mentions.push(act._id);
    //     setMentionedList(mentions)
    // }
    setNameAutValue([act]);
  };

  return (
    <Autocomplete
      className={classes.search}
      multiple
      style={{
        margin: 0,
      }}
      disableClearable
      open={showOptions}
      defaultValue={nameAutValue}
      value={nameAutValue}
      disableListWrap
      options={users}
      getOptionLabel={(option) => option.name}
      getOptionSelected={(option, value) => {
        return option === value;
      }}
      filterOptions={(options, params) => {
        let inputValue = JSON.parse(JSON.stringify(userValue));
        const filtered = filter(options, { ...params, inputValue });
        return filtered;
      }}
      renderOption={(option) => {
        return (
          <Grid container spacing={0}>
            <Grid container item xs={12} alignItems="center">
              <Grid item xs>
                <span style={{ fontWeight: 400 }}>{option.name}</span>
                {option.type}
              </Grid>
            </Grid>
          </Grid>
        );
      }}
      renderTags={(value, getTagProps) => {
        // return value.map((option, index) =>
        //   option._id ? (
            return (
            <Chip
              label={
                <Typography style={{ whiteSpace: "normal" }}>
                  {value.map((option, index) =>  option._id ? <span style={{ color:"red"}}>{option.name}</span> : <span>{option.name}</span>)}
                </Typography>
              }
              {...getTagProps(0)}
              style={{ height: "100%" }}
            />
            )
        //   ) : (
        //     <span>{option.name}</span>
        //   )
        // );
      }}
      onInputChange={onInputChange}
      onChange={onChange}
      renderInput={(params) => (
        <TextField
          margin="dense"
          {...params}
          style={{
            margin: 0,
          }}
          fullWidth
          rows={showActions ? 2 : 1}
          rowsMax={3}
          multiline
          className={classes.activitySearchField}
          placeholder="Add a question or post an update"
          variant="outlined"
          size="small"
        />
      )}
    />
  );
}
