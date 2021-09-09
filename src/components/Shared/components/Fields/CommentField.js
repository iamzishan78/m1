import React, { useState, useEffect } from "react";
import { Grid, TextField } from "@material-ui/core";
import $ from "jquery";

import Avatar from "react-avatar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";


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
    marginBottom: "15px",
  },
  commentInputFocusOut: {
    marginTop: "-32px",
    marginBottom: "15px",
  },
  textDiv: {
    marginLeft: "12px",
    lineHeight: "19px",
    fontSize: "16px",
    marginRight: "4px",
    height: "43px",
    overflowY: "auto",
    width: "348px",
  },
  commentBtn: {
    float: "right",
    right: "5px",
    bottom: "5px",
  },
}));

export default function DealComment({
  comment,
  showActions,
  setComment,
  upsertComment,
  isEdit,
  users,
  profilesInfo,
  setEditCommentId
}) {
  const classes = useStyles();

  const [filterValue, setFilterValue] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [nameAutValue, setNameAutValue] = useState({});

  (function () {
    var target = $("#colorText");
    $(".MuiOutlinedInput-input").scroll(function () {
      target
        .prop("scrollTop", this.scrollTop)
        .prop("scrollLeft", this.scrollLeft);
    });
  })();

  useEffect(() => {
    let value = JSON.parse(JSON.stringify(comment));
    if (value.includes("@")) {
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
    if (comment.includes("{{") && comment.includes("}}")) {

      let updatedValue = JSON.parse(JSON.stringify(comment));
      for (let i = 0; i < users.length; i++) {
        if (updatedValue.includes(users[i]._id)) {
          updatedValue = updatedValue.replace(
            `{{${users[i]._id}}}`,
            `@${users[i].name}`
          );
          value = value.replace(
            `{{${users[i]._id}}}`,
            ` <span class='blue'>@${users[i].name}</span>`
          );
        }
      }
      document.getElementById("colorText").innerHTML = value;
      setNameAutValue({ name: updatedValue, _id: "" });
    } else {
      document.getElementById("colorText").innerHTML = value;
      setNameAutValue({ name: comment, _id: "" });
    }

  }, [comment, users]);

  const setCommentValue = (value) => {
    if (value.includes("@")) {
      let updatedValue = JSON.parse(JSON.stringify(value));
      for (let i = 0; i < users.length; i++) {
        if (comment.includes(users[i]._id)) {
          updatedValue = updatedValue.replace(
            `@${users[i].name}`,
            `{{${users[i]._id}}}`
          );
        }
      }
      const splitedString = updatedValue.split("@")[1];
      setFilterValue(splitedString ? splitedString.split(" ")[0] : "");
      setComment(updatedValue);
    } else {
      setComment(value);
    }
  };

  const onInputChange = (event, value, reason) => {

    value = value.replace(/\s\s/g, ' ')
    if (!isSelected) {
      setCommentValue(value);
    } else {
      setIsSelected(false);
    }
  };

  const onChange = (e, act) => {
    setShowOptions(false);
    const value = JSON.parse(JSON.stringify(comment.split("@")[0]));
    setComment(value + `{{${act._id}}}`);
    setIsSelected(true);
  };

  return (
    <>
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
            <Grid className={classes.myClass} container spacing={0}>
              <Grid container item xs={1} alignItems="center">
                <IconButton style={{ padding: "0px" }}>
                  {profilesInfo[option.email]?.profileImage ? (
                    <Avatar
                      src={profilesInfo[option.email].profileImage}
                      size="25"
                      round
                    />
                  ) : (
                    <Avatar name={option.name} size="25" round />
                  )}
                </IconButton>
              </Grid>
              <Grid container item xs={11} alignItems="center">
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
              rows={(isEdit || showActions) ? 2 : 1}
              rowsMax={2}
              multiline
              className={classes.activitySearchField}
              placeholder="Add a question or post an update"
              variant="outlined"
              size="small"
            />
            <div
              id="colorText"
              className={`${
                comment || showActions
                  ? classes.commentInputFocusIn
                  : classes.commentInputFocusOut
              } ${classes.textDiv} hideScroll`}
            ></div>
          </>
        )}
      />
      {!isEdit ? (
        <>
          {showActions && (
            <Button
              className={classes.commentBtn}
              variant="contained"
              color="primary"
              onClick={() => {
                debugger
                upsertComment(comment);
                setNameAutValue({});
              }}
            >
              Comment
            </Button>
          )}
        </>
      ) : (
        <>
          <Button
            className={classes.commentBtn}
            variant="contained"
            color="primary"
            onClick={() => {
              upsertComment(comment);
            }}
          >
            Save Changes
          </Button>

          <Button
            className={classes.commentBtn}
            variant="contained"
            onClick={() => {
              setComment("");
              setEditCommentId("");
            }}
          >
            Cancel
          </Button>
        </>
      )}
    </>
  );
}
