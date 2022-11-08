import React, { useState, useEffect } from "react";
import { Grid, TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
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
import _ from 'lodash';

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
    "& .MuiPopover-paper": {
      height:'450px !important',
      marginTop:'60px !important'
    },
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
// setCommentTypeDialogBox,commentTypeDialogBox
export default function CommentType(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [selectedTab, setSelectedTab] = useState("Existing");
  const [selectedCommentType, setSelectedCommentType] = useState("General");
  const [isMenuOpen,setIsMenuOpen] = useState(false);
  const [commentTypeData, setCommentTypeData] = useState({
    commentType: "",
    category: "",
  });

  const { data } = useQuery(GET_COMMENT_TYPES);
  const [upsertCommentType] = useMutation(UPSERTCOMMENTTYPE);
  const [commentTypes, setCommentTypes] = useState([]);

  useEffect(() => {
    if (data && Array.isArray(data.commentsType)) {
      const commentsType = data.commentsType
      const uniqueCommonType = _.uniqBy(commentsType, function (e) {
        return e.commentType;
      });
      setCommentTypes(uniqueCommonType);
    }
  }, [data]);

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

    props.setCommentTypeDialogBox(false);
    setSelectedCommentType(commentTypeData.commentType);
    props.setSelectedCommentType(commentTypeData.commentType);
    setSelectedTab("Existing");
    setCommentTypeData({
      commentType: "",
      category: "",
    });
  };


  const openDialogBox = (e) => {
    props.setCommentTypeDialogBox(true);
    e.stopPropagation();
  }
  return (
    <>
      <div
        style={{
          padding: "0px 10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#949494",
        }}
        onClick={(e) => openDialogBox(e)}
      >
        {props.showCommentType && (
          <>
            <EditNoteIcon fill={props.commentTypeDialogBox ? "black" : ""} />
            <span style={{ marginLeft: "1px" }}>{selectedCommentType}</span>
          </>
        )}
      </div>
      {props.commentTypeDialogBox && (
        <div
          style={{
            position: "absolute",
            bottom: selectedTab === "New Comment Type" ? "25px" : "69px",
            background: "white",
            zIndex: `${isMenuOpen ? '0' :'9999'}`,
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
                  console.log("event fire")
                  setSelectedCommentType(e.target.value);
                  props.setSelectedCommentType(e.target.value);
                  props.setCommentTypeDialogBox(false);
                }}
                onClick={(e)=>{
                  setIsMenuOpen((prev)=> !prev);
                  e.stopPropagation();
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
                  props.setCommentTypeDialogBox(false);
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
                onClick={addCommentType}
                className={classes.footerButton}
              >
                Add
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
