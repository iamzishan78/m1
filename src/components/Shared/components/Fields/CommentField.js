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
  search505: {
    maxHeight: "250px",
    width: "100%",
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
      paddingLeft: "8px",
    },
    "& .MuiOutlinedInput-root": {
      paddingRight: "0px !important",
    },
    "& .MuiAutocomplete-endAdornment": {
      display: "none",
    },
    "& .MuiInputBase-input": { color: "transparent", caretColor: "black" },
    "& .MuiInputBase-inputMultiline": {
      lineHeight: "17px",
      maxHeight: "225px",
      zIndex: 9999,
      overflowY: "overlay",
      paddingRight: "8px",
      "*::-webkit-scrollbar": {
        height: "0.2em !important",
        width: "0.2em !important",
      },
      "*:hover::-webkit-scrollbar": {
        height: "0.2em !important",
        width: "0.2em !important",
      },
    }
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
    fontSize: "16px",
    marginRight: "4px",
    overflowY: "auto",
    position: "relative",
    writingMode: "horizontal-tb !important",
    textRendering: "auto",
    wordSpacing: "normal",
    textTransform: "none",
    textIndent: "0px",
    textShadow: "none",
    columnCount: "initial !important",
    textAlign: "start",
    appearance: "auto",
    "-webkit-rtl-ordering": "logical",
    overflowWrap: "break-word",

    maxHeight: "228px",
    height: "20px",
    top: "19px",
    lineHeight: "17px"
  },
  commentBtn: {
    float: "right",
    right: "15px",
  },
}));

const adjustDiv = () => {
  const ele = document.getElementById("txtArea");
  ele.style.overflow = "overlay";
  if (parseInt(ele.style.height, 10) < 41) {
    ele.style.height = "41px"
  }
  let searchEle = document.getElementById("commentField").firstChild;
  if (searchEle) {
    if (parseInt(ele.style.height, 10) <= 228) {
      searchEle.style.maxHeight = `${parseInt(ele.style.height, 10) + 30}px`;
      const colorTextEle = document.getElementById("colorText");
      colorTextEle.style.height = `${parseInt(ele.style.height, 10) + 5}px`;
      colorTextEle.style.top = `${19 - parseInt(colorTextEle.style.height, 10) + 20 - 1}px`;
    }
  }
}

export default function DealComment({
  comment,
  showActions,
  setComment,
  upsertComment,
  isEdit,
  users,
  profilesInfo,
  setEditCommentId,
  fieldWidth
}) {
  const classes = useStyles({ fieldWidth });

  const [filterValue, setFilterValue] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [nameAutValue, setNameAutValue] = useState({});

  (function () {
    var target = $("#colorText");
    const scrollDiv = function () {

      target
        .prop("scrollTop", this.scrollTop)
        .prop("scrollLeft", this.scrollLeft);
    }
    $(".MuiOutlinedInput-input").scroll(scrollDiv);
    // $(".MuiInputBase-input").change(scrollDiv);
  })();

  const checkIfShowUsers = (comment) => {
    let isActive = false;
    for (let i = 0; i < comment.length; i += 1) {
      if (comment[i] === "@") {
        let j = i + 1;
        for (j; j <= comment.length; j += 1) {
          i = j;
          if (comment[j] !== " ")
            isActive = true;
          else {
            isActive = false;
            break;
          }
        }
      }
    }
    return isActive;
  }

  useEffect(() => {
    const ta = document.getElementById("txtArea");
    if (ta.addEventListener) {
      ta.addEventListener("mouseup", adjustDiv, false);
      ta.addEventListener("keyup", adjustDiv, false);
    } else if (ta.attachEvent) { // IE
      ta.attachEvent("onmouseup", adjustDiv);
      ta.attachEvent("onkeyup", adjustDiv);
    }
  }, []);

  useEffect(() => {
    let value = JSON.parse(JSON.stringify(comment));
    if (checkIfShowUsers(value)) {
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
    if (comment.includes("{{") && comment.includes("}}")) {

      let updatedValue = JSON.parse(JSON.stringify(comment));
      for (let i = 0; i < users.length; i++) {
        if (updatedValue.includes(users[i]._id)) {
          updatedValue = replaceAllWith(updatedValue, users[i]._id, `@${users[i].name}`);
          value = replaceAllWith(value, `{{${users[i]._id}}}`, ` <span class='blue'>@${users[i].name}</span>`)
        }
      }
      setNameAutValue({ name: updatedValue, _id: "" });
    } else {
      setNameAutValue({ name: comment, _id: "" });
    }
    if (value.includes("\n")) {
      value = value.replace(/\n/g, "<br/><span class='ml--4'>&nbsp;</span>");
    }
    document.getElementById("colorText").innerHTML = value;
  }, [comment, users]);

  const replaceAllWith = (_string, replaceFrom, replaceWith) => {
    return _string.replace(/{{([^{{]+)}}/g, (match, key) => {
      return replaceFrom.includes(key)
        ? replaceWith
        : match;
    });
  }

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
      const splittingArray = updatedValue.split("@");
      setFilterValue(splittingArray[splittingArray.length - 1] ?? "");
      setComment(updatedValue);
    } else {
      setComment(value);
    }
  };

  const onInputChange = (event, value, reason) => {

    // value = value.replace(/\s\s/g, ' ');
    if (!isSelected) {
      setCommentValue(value);
    } else {
      setIsSelected(false);
    }
  };

  const onChange = (e, act) => {
    setShowOptions(false);
    const splittedArray = comment.split("@");
    let value = "";
    for (let i = 0; i < splittedArray.length - 1; i += 1) value += `${splittedArray[i]}${i !== splittedArray.length - 2 ? '@' : ""}`;
    setComment(value + `{{${act._id}}}`);
    setIsSelected(true);
  };

  return (
    <div id="commentField">
      <Autocomplete
        id='txtArea'
        className={classes.search505}
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
                  <span style={{ fontWeight: 400, paddingLeft: 20 }}>{option.name}</span>
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
              {...params}
              classes={{ root: classes.customTextField }}
              margin="dense"
              style={{
                margin: 0,
              }}
              fullWidth
              multiline
              className={classes.activitySearchField}
              placeholder="Add a question or post an update"
              variant="outlined"
              size="small"
            />
            <div
              id="colorText"
              style={{ whiteSpace: 'pre-line' }}
              className={`${comment || showActions
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
    </div>
  );
}
