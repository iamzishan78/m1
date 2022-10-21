import React, { useState, useEffect } from "react";
import { Grid, TextField } from "@material-ui/core";
import $ from "jquery";

import Avatar from "react-avatar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import EditNoteIcon from "components/Shared/svgIcons/edit-note";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { GET_COMMENT_TYPES, UPSERTCOMMENTTYPE } from "graphQL/useQueryCommentType";
import { useMutation, useQuery } from "@apollo/client";
import { showInfoMessage } from "actions";
import { useDispatch } from "react-redux";

const filter = createFilterOptions();

const useStyles = makeStyles((theme) => ({
  noBorder: {
    border: "none",
  },
  search: {
    maxHeight: "217px",
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
      height: "201px !important",
      overflow: "overlay",
      paddingRight: "8px",
      "*::-webkit-scrollbar": {
        height: "0.2em !important",
        width: "0.2em !important",
      },
      "*:hover::-webkit-scrollbar": {
        height: "0.2em !important",
        width: "0.2em !important",
      },
    },
  },
  customTextField: {
    "& textarea": {
      zIndex: 99,
    },
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
    height: "200px",
    overflowY: "auto",
    position: "relative",
    top: "-162px",
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
  },
  commentBtn: {
    float: "right",
    right: "15px",
  },
  dialog: {
    "&.MuiDialog-root": {
      zIndex: "1300 !important",
    },
    "&.MuiDialog-root .MuiDialog-paper": {
      overflowY: "hidden !important",
      padding: "15px",
    },
    "&.MuiDialog-root .MuiBackdrop-root": {
      backgroundColor: "none",
    },
    "&.MuiDialog-root .MuiDialog-paperWidthSm": {
      maxWidth: "350px",
    },
  },
  tab: {
    padding: "3px 20px",
    color: "#919191",
    cursor: "pointer",
  },
  headerActions: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
  },
  selectedTab: {
    borderBottom: "4px solid #01B0F0",
  },
  selectCommentType: {
    width: "100%",
    height: "40px",
  },
  formLabel: {
    "&.MuiFormLabel-root": {
      top: "-6px",
    },
    "&.MuiInputLabel-shrink": {
      transform: "translate(13px, 3px) scale(0.75)",
    },
  },
  commentTypeInput: {
    "&.MuiFormControl-root .MuiInputBase-root input": {
      height: "3px",
    },
    "&.MuiFormControl-root .MuiInputLabel-formControl": {
      top: "-8px",
    },
    "&.MuiFormControl-root .MuiInputLabel-outlined.MuiInputLabel-shrink": {
      transform: "translate(14px, 3px) scale(0.75)",
    },
  },
  dialogFooter: {
    display: "flex",
    justifyContent: "flex-end",
    paddingTop: "10px",
  },
  footerButton: {
    letterSpacing: "1px",
    textTransform: "capitalize",
    fontWeight: "bold",
    padding: "8px 20px",
  },
  formControlCommentType: {
    marginBottom: "15px",
  },
  footerButtonCancel: {
    "&.MuiButtonBase-root": {
      backgroundColor: "#d5d5d500",
      color: "#9d9b9b",
    },
    "&.MuiButtonBase-root:hover": {
      backgroundColor: "#d3cece",
      color: "#ffffff",
    },
  },
}));

const CategoryList = ["All", "Agreement", "Contact", "Document", "Flow", "Revenue", "Tract", "Unit"];

export default function DealComment({
  comment,
  showActions,
  setComment,
  upsertComment,
  isEdit,
  users,
  profilesInfo,
  setEditCommentId,
  fieldWidth,
  setShowActions,
  ...props
}) {
  const classes = useStyles({ fieldWidth });
  const dispatch = useDispatch();
  const [filterValue, setFilterValue] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [nameAutValue, setNameAutValue] = useState({});
  const [showCommentType, setShowCommentType] = useState(props.showCommentType);
  const [showCommentTypeDialog, setShowCommentTypeDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Existing");
  const [selectedCommentType, setSelectedCommentType] = useState("General");
  const [commentTypeData, setCommentTypeData] = useState({
    commentType: "",
    category: "",
  });
  const { data } = useQuery(GET_COMMENT_TYPES);
  const [upsertCommentType] = useMutation(UPSERTCOMMENTTYPE);
  const [commentTypes, setCommentTypes] = useState([]);

  (function () {
    var target = $("#colorText");
    const scrollDiv = function () {
      target.prop("scrollTop", this.scrollTop).prop("scrollLeft", this.scrollLeft);
    };
    $(".MuiOutlinedInput-input").scroll(scrollDiv);
    $(".MuiOutlinedInput-input").resize(scrollDiv);
  })();

  const checkIfShowUsers = (comment) => {
    let isActive = false;
    for (let i = 0; i < comment.length; i += 1) {
      if (comment[i] === "@") {
        let j = i + 1;
        for (j; j <= comment.length; j += 1) {
          i = j;
          if (comment[j] !== " ") isActive = true;
          else {
            isActive = false;
            break;
          }
        }
      }
    }
    return isActive;
  };

  useEffect(() => {
    if (data && Array.isArray(data.commentsType)) {
      setCommentTypes(data.commentsType);
    }
  }, [data]);

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
          value = replaceAllWith(value, `{{${users[i]._id}}}`, ` <span class='blue'>@${users[i].name}</span>`);
        }
      }
      setNameAutValue({ name: updatedValue, _id: "" });
    } else {
      setNameAutValue({ name: comment, _id: "" });
    }
    if (value.includes("\n")) {
      value = value.replace(/\n/g, "<br>");
    }
    document.getElementById("colorText").innerHTML = value;
  }, [comment, users]);

  const replaceAllWith = (_string, replaceFrom, replaceWith) => {
    return _string.replace(/{{([^{{]+)}}/g, (match, key) => {
      return replaceFrom.includes(key) ? replaceWith : match;
    });
  };

  const setCommentValue = (value) => {
    if (value.includes("@")) {
      let updatedValue = JSON.parse(JSON.stringify(value));
      for (let i = 0; i < users.length; i++) {
        while (updatedValue.includes(users[i].name)) {
          if (comment.includes(users[i]._id)) updatedValue = updatedValue.replace(`@${users[i].name}`, `{{${users[i]._id}}}`);
          else break;
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
    for (let i = 0; i < splittedArray.length - 1; i += 1) value += `${splittedArray[i]}${i !== splittedArray.length - 2 ? "@" : ""}`;
    setComment(value + `{{${act._id}}}`);
    setIsSelected(true);
  };

  const addCommentType = () => {
    const commentType = (commentTypeData.commentType || "").trim();
    const category = (commentTypeData.category || "").trim();

    if (!commentType && !category) {
      return dispatch(showInfoMessage("Comment Type and Category is required"));
    } else if (!commentType) {
      return dispatch(showInfoMessage("Comment Type is required"));
    } else if (!category) {
      return dispatch(showInfoMessage("Category is required"));
    }

    upsertCommentType({
      variables: {
        commentType: {
          commentType: commentTypeData.commentType,
          category: commentTypeData.category,
        },
      },
      refetchQueries: ["getAllCommentsType"],
      awaitRefetchQueries: false,
    });

    setShowCommentTypeDialog(false);
    setSelectedCommentType(commentTypeData.commentType);
    setSelectedTab("Existing");
    setCommentTypeData({
      commentType: "",
      category: "",
    });
  };

  return (
    <>
      <Autocomplete
        onFocus={() => {
          setShowCommentTypeDialog(false);
        }}
        id="txtArea"
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
                    <Avatar src={profilesInfo[option.email].profileImage} size="25" round />
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
              classes={{ root: classes.customTextField }}
              margin="dense"
              {...params}
              style={{
                margin: 0,
              }}
              fullWidth
              rows={isEdit || showActions ? 2 : 1}
              rowsMax={2}
              multiline
              className={classes.activitySearchField}
              placeholder="Add a question or post an update"
              variant="outlined"
              size="small"
            />
            <div
              id="colorText"
              className={`${comment || showActions ? classes.commentInputFocusIn : classes.commentInputFocusOut} ${
                classes.textDiv
              } hideScroll`}
            ></div>
          </>
        )}
      />
      {showCommentTypeDialog && (
        <div
          style={{
            position: "absolute",
            bottom: selectedTab === "New Comment Type" ? "25px" : "69px",
            background: "white",
            zIndex: "9999",
            boxShadow: "0 10px 40px 0 rgb(0 0 0 / 15%)",
            padding: "15px",
            width: "315px",
            padding: "15px",
            left: "12px",
          }}
        >
          <Grid item className={classes.headerActions}>
            <div>
              <span
                className={`${classes.tab} ${selectedTab === "Existing" ? classes.selectedTab : ""}`}
                onClick={() => setSelectedTab("Existing")}
              >
                Existing
              </span>
              <span
                className={`${classes.tab} ${selectedTab === "New Comment Type" ? classes.selectedTab : ""}`}
                onClick={() => setSelectedTab("New Comment Type")}
              >
                New Comment Type
              </span>
            </div>
          </Grid>
          <Grid style={{ marginTop: "25px" }}>
            {selectedTab === "Existing" && (
              <Select
                className={classes.selectCommentType}
                variant="outlined"
                value={selectedCommentType}
                onChange={(e) => {
                  setSelectedCommentType(e.target.value);
                  setShowCommentTypeDialog(false);
                }}
              >
                {commentTypes.map((obj) => (
                  <MenuItem value={obj.commentType}>{obj.commentType}</MenuItem>
                ))}
              </Select>
            )}
            {selectedTab === "New Comment Type" && (
              <>
                <FormControl className={classes.formControlCommentType} variant="outlined" fullWidth>
                  <TextField
                    id="demo-simple-select-standard-label"
                    className={classes.commentTypeInput}
                    variant="outlined"
                    value={commentTypeData.commentType}
                    label="Comment Type"
                    onChange={(e) => {
                      setCommentTypeData((prev) => ({ ...prev, commentType: e.target.value }));
                    }}
                  />
                </FormControl>
                <FormControl className={classes.formControlCommentType} variant="outlined" fullWidth>
                  <InputLabel className={classes.formLabel} id="demo-simple-select-category-label">
                    Category
                  </InputLabel>
                  <Select
                    className={classes.selectCommentType}
                    variant="outlined"
                    label="Category"
                    value={commentTypeData.category}
                    onChange={(e) => {
                      setCommentTypeData((prev) => ({ ...prev, category: e.target.value }));
                    }}
                  >
                    {CategoryList.map((category) => (
                      <MenuItem value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
          </Grid>
          {selectedTab === "New Comment Type" && (
            <div className={classes.dialogFooter}>
              <Button
                variant="contained"
                color="white"
                size="medium"
                disableElevation
                className={classes.footerButtonCancel}
                style={{
                  margin: "0px 15px 0px 0px",
                }}
                onClick={() => {
                  setShowCommentTypeDialog(false);
                  setSelectedTab("Existing");
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                color="secondary"
                size="medium"
                disableElevation
                onClick={() => {
                  addCommentType();
                }}
                className={classes.footerButton}
              >
                Add
              </Button>
            </div>
          )}
        </div>
      )}
      {!isEdit ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onClick={() => {
            if (showCommentTypeDialog) {
              setShowCommentTypeDialog(false);
              setSelectedTab("Existing");
            }
          }}
        >
          <div
            style={{
              padding: "0px 10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#949494",
            }}
            onClick={() => setShowCommentTypeDialog((o) => !o)}
          >
            {showCommentType && (
              <>
                <EditNoteIcon fill={showCommentTypeDialog ? "black" : ""} />
                <span style={{ marginLeft: "1px" }}>{selectedCommentType}</span>
              </>
            )}
          </div>
          {showActions && (
            <Button
              className={classes.commentBtn}
              variant="contained"
              color="primary"
              onClick={() => {
                if (!showCommentTypeDialog) {
                  upsertComment({ comment, commentType: selectedCommentType });
                  setSelectedTab("Existing");
                  setNameAutValue({});
                }
              }}
            >
              Comment
            </Button>
          )}
        </div>
      ) : (
        <>
          <Button
            className={classes.commentBtn}
            style={{ marginBottom: "10px" }}
            variant="contained"
            color="primary"
            onClick={() => {
              upsertComment({ comment, commentType: selectedCommentType });
            }}
          >
            Save Changes
          </Button>

          <Button
            className={classes.commentBtn}
            style={{ marginRight: "10px", marginBottom: "10px" }}
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

DealComment.defaultProps = {
  showCommentType: false,
};
