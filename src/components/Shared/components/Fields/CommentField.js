import React, { useState, useEffect } from "react";
import { Grid, TextField } from "@material-ui/core";
import $ from "jquery";

import Avatar from "react-avatar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { useLazyQuery } from "@apollo/client";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";

import { GETMONGOUSERS } from "graphQL/useQueryGetUsers";
import { GET_PROFILES_IMAGES } from "graphQL/useQueryGetProfile";

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
    "& .MuiInputBase-input": { color: "red", caretColor: "black" },
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
    width: "96%",
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
  setEditCommentId
}) {
  const classes = useStyles();

  const [users, setUsers] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  // const [mentionedList, setMentionedList] = useState([]);
  const [nameAutValue, setNameAutValue] = useState({});
  const [profilesInfo, setProfilesInfo] = useState({});

  const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
    fetchPolicy: "cache-and-network",
  });
  const [getProfilesImages, profilesData] = useLazyQuery(GET_PROFILES_IMAGES, {
    fetchPolicy: "cache-first",
  });

  useEffect(() => {
    getAllMongoUsers();
  }, [getAllMongoUsers]);

  (function () {
    var target = $("#colorText");
    $(".MuiOutlinedInput-input").scroll(function () {
      target
        .prop("scrollTop", this.scrollTop)
        .prop("scrollLeft", this.scrollLeft);
    });
  })();

  useEffect(() => {
    if (userLists && userLists.allMongoUsers) {
      const data = userLists.allMongoUsers
        .map((user) => ({
          _id: user._id,
          name: user.name,
          email: user.email,
        }))
        .filter((user) => user._id && user.name);
      setUsers(data);
      const emails = userLists.allMongoUsers.map((user) => user.email);
      getProfilesImages({
        variables: { emails },
      });
    }
  }, [userLists]);

  useEffect(() => {
    if (profilesData?.data?.profileByEmail?.profiles) {
      setProfilesInfo(profilesData.data.profileByEmail.profiles);
    }
  }, [profilesData]);

  useEffect(() => {
    let value = JSON.parse(JSON.stringify(comment));
    if (value.includes("@")) {
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
    // const data = value.split(" ");
    // value = "";

    // for (let i = 0; i < data.length; i++) {
    //   if (/^{{[0-9a-z]+}}$/.test(data[i])) {
    //     let id = JSON.parse(JSON.stringify(data[i]));
    //     id = id.replace("{{", "");
    //     id = id.replace("}}", "");

    //     const mention = users.find((item) => item._id === id);
    //     if (mention) {
    //       value = value + ` <span class='blue'>@${mention.name}</span>`;
    //     } else {
    //       value = value + " " + data[i];
    //     }
    //   } else {
    //     value = value + " " + data[i];
    //   }
    // }
    // debugger
    // document.getElementById("colorText").innerHTML = value;


    
    if (comment.includes("{{") && comment.includes("}}")) {

      let updatedValue = JSON.parse(JSON.stringify(comment));
      // const afterMentionText = updatedValue.split("@")[1].split(" ")[0];
      // updatedValue = updatedValue.replace(
      //   `@${afterMentionText}`,
      //   `@${act.name}`
      // );
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
    // setNameAutValue({ name: value, _id: "" });

    if (!isSelected) {
      setCommentValue(value);
    } else {
      setIsSelected(false);
    }
  };

  const onChange = (e, act) => {
    setShowOptions(false);
    // if (!mentionedList.includes(act._id)) {
    //   const mentions = mentionedList;
    //   mentions.push(act);
    //   setMentionedList(mentions);
    // }

    const value = JSON.parse(JSON.stringify(comment.split("@")[0]));

    // if (comment.includes("{{") && comment.includes("}}")) {
    //   let updatedValue = JSON.parse(JSON.stringify(comment));
    //   const afterMentionText = updatedValue.split("@")[1].split(" ")[0];
    //   updatedValue = updatedValue.replace(
    //     `@${afterMentionText}`,
    //     `@${act.name}`
    //   );
    //   for (let i = 0; i < mentionedList.length; i++) {
    //     if (updatedValue.includes(mentionedList[i]._id)) {
    //       updatedValue = updatedValue.replace(
    //         `{{${mentionedList[i]._id}}}`,
    //         `@${mentionedList[i].name}`
    //       );
    //     }
    //   }
    //   setNameAutValue({ name: updatedValue, _id: "" });
    // } else {
    //   setNameAutValue({ name: `${value}@${act.name}`, _id: "" });
    // }

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
                // upsertComment(comment);
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
