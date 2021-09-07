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
    "& .MuiInputBase-input": { color: "transparent", caretColor: "black" },
  },
  customTextField: {
    "& textarea::placeholder": {
      color: "black",
    },
  },
  commentInputFocusIn: {
    marginTop: "-50px",
    marginLeft: "12px",
    fontSize: "16px",
    marginRight: "4px",
    lineHeight: "19px",
    marginBottom: "32px",

  },
  commentInputFocusOut: {
    marginTop: "-32px",
    marginLeft: "12px",
    fontSize: "16px", 
    marginRight: "4px",
    lineHeight: "19px",
    marginBottom: "32px",
  },
  commentInput: {
    marginLeft: "12px",
    fontSize: "16px",
    marginRight: "4px",
    lineHeight: "19px"
  },
}));

export default function DealComment({ comment, showActions, setComment }) {
  const classes = useStyles();

  const [users, setUsers] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [mentionedList, setMentionedList] = useState([]);
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

  useEffect(() => {
    let value = JSON.parse(JSON.stringify(comment));
    if (value.includes("@")) {
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
    const data = value.split(" ");
    value = "";

    for (let i = 0; i < data.length; i++) {
      if (/^{{[0-9a-z]+}}$/.test(data[i])) {
        let id = JSON.parse(JSON.stringify(data[i]));
        id = id.replace("{{", "");
        id = id.replace("}}", "");

        const mention = mentionedList.find((item) => item._id === id);
        if (mention) {
          value = value + ` <span class='blue'>@${mention.name}</span>`;
        } else {
          value = value + ' ' + data[i];
        }
      } else {
        value = value + ' ' + data[i];
      }
    }
    document.getElementById("colorText").innerHTML = value;
  }, [comment]);

  const setCommentValue = (value) => {
    if(value.includes("@")){
      let updatedValue = JSON.parse(JSON.stringify(value));
      for (let i = 0; i < mentionedList.length; i++){
        if(comment.includes(mentionedList[i]._id)){
          updatedValue = updatedValue.replace(`@${mentionedList[i].name}`, `{{${mentionedList[i]._id}}}`)
        }
      }
      setFilterValue(updatedValue.split("@")[1]);
      setComment(updatedValue);
    }else{
      setComment(value);
    }
  };

  const onInputChange = (event, value, reason) => {
    setNameAutValue({ name: value, _id: "" });

    if (!isSelected) {
      console.log('comment value set in input change', value)
      setCommentValue(value);
    } else {
      setIsSelected(false);
    }
  };

  const onChange = (e, act) => {
    setShowOptions(false);
    if (!mentionedList.includes(act._id)) {
      const mentions = mentionedList;
      mentions.push(act);
      setMentionedList(mentions);
    }

    const value = JSON.parse(JSON.stringify(comment.split("@")[0]));

    if(comment.includes("{{") && comment.includes("}}")){
      let updatedValue = JSON.parse(JSON.stringify(comment));
      const afterMentionText = updatedValue.split("@")[1].split(' ')[0];
      updatedValue = updatedValue.replace(`@${afterMentionText}`, `@${act.name}`)
      for (let i = 0; i < mentionedList.length; i++){
        if(updatedValue.includes(mentionedList[i]._id)){
          updatedValue = updatedValue.replace(`{{${mentionedList[i]._id}}}`, `@${mentionedList[i].name}`)
        }
      }
      setNameAutValue({ name: updatedValue, _id: "" });
    }else{
      setNameAutValue({ name: `${value}@${act.name}`, _id: "" });
    }
    
    setComment(value + `{{${act._id}}}`);
    setIsSelected(true);
  };

  return (
    <Autocomplete
      className={classes.search}
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
        let inputValue = JSON.parse(JSON.stringify(filterValue));
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
      onInputChange={onInputChange}
      onChange={onChange}
      renderInput={(params) => (
        <>
          <TextField
            classes={{ root: classes.customTextField }}
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
          <div
            id="colorText"
            className={
              comment
                ? showActions
                  ? classes.commentInputFocusIn
                  : classes.commentInputFocusOut
                : classes.commentInput
            }
          ></div>
        </>
      )}
    />
  );
}
