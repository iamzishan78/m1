import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import {
  Typography,
  TextField,
  Grid,
  Avatar,
  FormControl,
  InputAdornment,
} from "@material-ui/core";
import ArrowForwardIcon from "components/Shared/svgIcons/KeyboardTabBlackIcon";
import AddIcon from "@material-ui/icons/Add";
import CommentComponent from "components/Shared/CommentComponent";
import AddDialogeUploadZone from "components/ContactDetailCard/components/AddDialogUploadZone";
import { useLazyQuery } from "@apollo/client";
import { VIEWFILESQUERY } from "graphQL/useQueryViewFile";
import { GETRECENTCONTACTFILES } from "graphQL/useQueryGetContactFiles";
import moment from "moment";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CustomAvatar from "components/Shared/ui/CustomAvatar";

const useStyles = makeStyles((theme) => ({
  titleText: {
    marginLeft: 16,
  },
  metaPanelCloseIcon: {
    "& svg": {
      fontSize: 18,
      cursor: "pointer",
      fill: "#808080 !important",
    },
  },
  gridStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  dealOwnerRoot: {
    border: "1px solid #EBEBEB",
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
      paddingLeft: 26,
    },

    "& .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
    "&:hover.MuiOutlinedInput-root": {
      backgroundColor: "#EBEBEB",
    },
    "&:hover .MuiAutocomplete-popupIndicator": {
      visibility: "visible",
      padding: "2px",
      marginRight: "-2px",
    },
  },
  dealOwnerRootFocused: {
    "& .MuiOutlinedInput-notchedOutline": {
      border: "1px solid black",
    },
  },
  popupIndicator: {
    visibility: "hidden",
    padding: "2px",
    marginRight: "-2px",
    "&:hover": {
      visibility: "visible",
    },
  },
  inputFieldOwner: {
    marginBottom: "7px",
  },
  dealOwnerAvatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    color: "#fff",
    fontSize: "0.6rem",
    backgroundColor: "#4880F6",
    padding: "0.5em",
  },
  dealOwnerLabel: {
    marginLeft: 4,
  },
  descriptionInput: {
    width: "100%",
    margin: "20px 0 0",
    "& .MuiTextField-root": {
      backgroundColor: "#fffcdc",
      borderRadius: 4,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "& textarea": {
      height: "323px",
    },
  },
  foodText: {
    position: "absolute",
    bottom: "20px",
    right: "0px",
    fontSize: "10px",
    color: "#6e6e6e",
    margin: "0 !important",
    textAlign: "right",
    height: "0",
    paddingRight: "10px",
    "& span": {
      fontWeight: "bold",
    },
  },
  viewAll: {
    textDecoration: "underline",
    margin: "0 0 8px 0",
    float: "right",
    color: theme.palette.secondary.main,
    cursor: "pointer",
    fontWeight: "normal",
    "&:hover": { color: "#757575" },
    transition: "color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
  commentsContainer: {
    // position: "fixed",
    bottom: "34px",
    width: "336px",
  },
}));

export default function MetadataDrawer(props) {
  const classes = useStyles();

  // States
  const [ownerId, setOwnerId] = useState("");
  const [description, setDescription] = useState(props.description ?? "");
  const [onFocusDescription, setFocusSate] = useState(false);
  const [fileRequestCounter, setFileRequestCounter] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Props
  const { setCollapse, users, targetSourceId, targetLabel } = props;

  // Queries and Mutations
  const [getRecentFiles, { data: files }] = useLazyQuery(
    GETRECENTCONTACTFILES,
    {
      fetchPolicy: "cache-and-network",
      onCompleted: ({ getFileDescriptors }) => {
        let allActive = true;

        if (getFileDescriptors)
          for (let i = 0; i < getFileDescriptors.length; i++) {
            if (getFileDescriptors[i].fileState !== "active") {
              allActive = false;
              break;
            }
          }

        if (!allActive) {
          if (fileRequestCounter <= 40) {
            let waitBeforeRequestAgain = setTimeout(() => {
              setFileRequestCounter(fileRequestCounter + 1);
              getRecentFiles({
                variables: {
                  relatedObjectId: targetSourceId,
                  relatedObjectType: "Check",
                },
              });
              clearTimeout(waitBeforeRequestAgain);
            }, 1000);
          } else {
            setFileRequestCounter(1);
          }
        } else setFileRequestCounter(1);
      },
    }
  );

  const [viewFiles, { data: viewFileResult, loading: viewFileLoading }] =
    useLazyQuery(VIEWFILESQUERY, {
      fetchPolicy: "no-cache",
    });

  useEffect(() => {
    setDescription(props.description);
  }, [props.description]);

  useEffect(() => {
    if (targetSourceId) {
      getRecentFiles({
        variables: {
          relatedObjectId: targetSourceId,
          relatedObjectType: "Check",
        },
      });
    }
  }, [targetSourceId]);

  useEffect(() => {
    if (files?.getFileDescriptors) {
      let ID = [];
      for (let i = 0; i < files.getFileDescriptors.length; i++) {
        ID.push(files.getFileDescriptors[i].fileId);
      }
      for (let i = 0; i < uploadedFiles.length; i++) {
        ID.push(uploadedFiles[i].addFileDescriptor.file.id);
      }
      viewFiles({
        variables: { fileIds: ID },
      });
      //* Getting most recent uploaded pdf file
      let recentFile = {};
      files.getFileDescriptors
        .filter((d) => d.fileName.split(".")?.[1]?.toLowerCase() === "pdf")
        .forEach((d, index) => {
          let descriptor = d;
          descriptor = {
            ...descriptor,
            dateTime: moment(descriptor.dateTime, "MM/DD/YYYY HH:mm Z"),
          };
          if (index === 0) recentFile = descriptor;
          else {
            if (recentFile.dateTime < descriptor.dateTime) {
              recentFile = descriptor;
            }
          }
        });
    }
  }, [files, uploadedFiles, viewFiles]);

  const setUploadedFileData = (uploadedfile) => {
    setUploadedFiles([...uploadedFiles, uploadedfile]);
  };

  return (
    <div
      className="flex column justifyStart alignStart w-100"
      style={{
        marginTop: 20,
        marginRight: 24,
        padding: "16px 10px",
        background: "#ffffff",
        borderRadius: 8,
        overflow: "auto",
        height: "calc(100vh - 280px)",
        maxHeight: "calc(100vh - 280px)",
        maxWidth: 420,
        width: "100%",
      }}
    >
      <div className="flex justifyBetween alignCenter w-100">
        <Typography
          varient="h5"
          className={classes.titleText}
          style={{
            textTransform: "uppercase",
            fontWeight: "bold",
            marginLeft: "5px",
          }}
        >
          Metadata
        </Typography>

        <div className="flex alignCenter">
          <span
            onClick={() => setCollapse(true)}
            className={classes.metaPanelCloseIcon}
          >
            <ArrowForwardIcon />
          </span>
        </div>
      </div>

      <div
        className="flex column justifyStart w-100"
        style={{ overflow: "hidden" }}
      >
        <div style={{ overflow: "auto" }}>
          <div style={{ marginTop: 10, marginLeft: 4 }}>
            <FormControl variant="outlined" fullWidth size="small">
              <Grid container className={classes.gridStyle}>
                <Grid item xs={3}>
                  <div>Owner</div>
                </Grid>
                <Grid item xs={9}>
                  <Autocomplete
                    options={users.filter((u) => u.text)}
                    onChange={(e, user) => {
                      setOwnerId(user?.value);
                    }}
                    value={
                      users.find((user) => user?.value === ownerId) || null
                    }
                    getOptionLabel={(option) => option.text}
                    getOptionSelected={(option) => option.value === ownerId}
                    classes={{
                      inputRoot: classes.dealOwnerRoot,
                      focused: classes.dealOwnerRootFocused,
                      popupIndicator: classes.popupIndicator,
                    }}
                    renderInput={(params) => (
                      <TextField
                        margin="dense"
                        {...params}
                        variant="outlined"
                        className={classes.inputFieldOwner}
                        InputLabelProps={{
                          ...params.InputLabelProps,
                          shrink: true,
                          classes: {
                            root: classes.dealOwnerLabel,
                          },
                        }}
                        placeholder="Assign Owner"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <InputAdornment position="start">
                                <Avatar className={classes.dealOwnerAvatar}>
                                  {users.find(
                                    (user) => user?.value === ownerId
                                  ) ? (
                                    <CustomAvatar
                                      diglog={true}
                                      email={
                                        users.find(
                                          (user) => user?.value === ownerId
                                        ).email
                                      }
                                      text={
                                        users
                                          .find(
                                            (user) => user?.value === ownerId
                                          )
                                          .text.toString()
                                          .toUpperCase()
                                          .split(" ").length > 1
                                          ? users
                                              .find(
                                                (user) =>
                                                  user?.value === ownerId
                                              )
                                              .text.toString()
                                          : "Add Owner"
                                      }
                                    />
                                  ) : (
                                    "AO"
                                  )}
                                </Avatar>
                              </InputAdornment>
                              {params.InputProps.startAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </FormControl>
          </div>

          <Grid item className={classes.descriptionInput}>
            <TextField
              id="outlined-multiline-static"
              label="Description"
              value={description}
              multiline
              fullWidth
              rows={5}
              variant="outlined"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  setFocusSate(false);
                  setDescription("");
                }
              }}
              onFocus={() => setFocusSate(true)}
              onBlur={() => setFocusSate(false)}
              InputProps={{
                endAdornment: onFocusDescription === true && (
                  <p className={classes.foodText}>
                    <span>Return</span> to save
                  </p>
                ),
              }}
            />
          </Grid>

          {/* hiding for now until we get custom metadata added to statements and properties - kc 20220123 */}
          {/* <div
          onClick={() => {
            setStateApp((stateApp) => ({
              ...stateApp,
              showFieldModal: true,
            }));
          }}
          className="flex alignCenter"
          style={{
            background: "#f2f2f2",
            borderRadius: 8,
            padding: "6px 16px",
            marginLeft: 4,
            marginTop: 8,
            maxWidth: "max-content",
            cursor: "pointer",
          }}
        >
          <span>
            <AddIcon style={{ marginTop: 4, marginRight: 4, fontSize: 16, alignItems: "center" }} htmlColor="#000000" />
          </span>
          {` Add`}
        </div> */}

          <div
            className="flex justifyBetween alignCenter"
            style={{ padding: "20px 16px", marginBottom: -56 }}
          >
            <h4 style={{ margin: "0 0 8px 0", float: "left" }}>Documents</h4>
            {/* <h4 className={classes.viewAll}>View All</h4> */}
          </div>

          <AddDialogeUploadZone
            filesData={viewFileResult}
            id={targetSourceId}
            loading={viewFileLoading}
            targetLabel="Check"
            setUploadedFileData={setUploadedFileData}
          />
        </div>
        <div className={classes.commentsContainer}>
          <CommentComponent
            targetLabel={targetLabel}
            targetSourceId={targetSourceId}
          />
        </div>
      </div>
    </div>
  );
}
