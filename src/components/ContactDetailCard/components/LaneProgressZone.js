import React, { useMemo, useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useMutation, useLazyQuery } from "@apollo/client";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
// import { faCircle, faSquare } from "@fortawesome/free-regular-svg-icons";
import GetAppIcon from "@material-ui/icons/GetApp";
import DeleteDocumentConfirmation from "../../Shared/DeleteDocumentConfirmation";
import { AppContext } from "../../../AppContext";
import { GETRECENTCONTACTFILES } from "../../../graphQL/useQueryGetContactFiles";
import { DELETEDESCRIPTORFILE } from "../../../graphQL/useMutationDeleteDescriptorFile";
import { VIEWFILEQUERY } from "../../../graphQL/useQueryViewFile";
import UploadZone from "./DailogUploadZone";
import Tooltip from "@material-ui/core/Tooltip";
import { pdfjs } from "react-pdf";

// functions 
import get_file_icon from "../../Shared/functions/get_file_icon.js";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: "#fff",
  },
  timelineItemRight: {
    "&:before": {
      content: "none",
    },
  },
  Uploadcomp: {
    width: "200px !important",
    height: "130px !important",
  },
  forImage: {
    width: "100px !important",
    height: "100px !important",
    backgroundColor: "transparent !important",
    // border: "1px solid #999",
    borderRadius: "10px !important",
  },
  forImageContainer: {
    width: "100px !important",
    height: "100px !important",
    borderRadius: "10px !important",
    backgroundColor: "#eeeeee !important",
    // border: "1px solid #999",
    textAlign: "center",
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#555",
    textTransform: "uppercase",
    paddingTop: "30px",
    cursor: "pointer",
    marginBottom: "5px",
  },
  imageSubText: {
    letterSpacing: "0.5px",
    textAlign: "center",
  },
  details: {
    textDecoration: "underline",
    margin: "0 0 8px 0",
    float: "right",
    color: theme.palette.secondary.main,
    cursor: "pointer",
    fontWeight: "normal",
    "&:hover": { color: "#757575" },
    transition: "color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
  timelineText: {
    "& .MuiTypography-body1": { fontSize: "0.85rem" },
    "& .MuiTypography-body2": { fontSize: "0.7rem" },
    "&  p": {
      margin: "0",
    },
  },
  blue: {
    color: theme.palette.secondary.main,
  },
  todayDot: {
    fontSize: "8px",
  },
  dealTitle: {
    cursor: "pointer",
    "&:hover": {
      fontWeight: "bold",
      textDecoration: "underline",
    },
  },
  laneProgressSection: {
    minHeight: "50px",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    width: "100%",
  },
  fileUploadTopSection: {
    minHeight: "50px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: "23px",
  },
  uploadTitle: {
    margin: "0",
    color: "#757575",
    fontWeight: "normal",
    marginBottom: "8px",
  },
  uploadSubtext: {
    color: "rgb(176, 176, 176)",
    margin: "0",
    fontWeight: "normal",
  },
  IconSection: {
    minHeight: "35px",
    display: "flex",
    justifyContent: "center",
    width: "fit-content",
  },
  fileDrop: {
    minHeight: "125px",
    width: "100%",
    padding: "10px 40px",
    color: "#757575",
    fontWeight: "normal",
    backgroundColor: "#eee",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px dashed rgb(176, 176, 176)",
    marginBottom: "30px",
  },
  fileDropError: {
    color: "red",
  },
}));

export default function Documents(props) {
  const classes = useStyles();
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [fileIdToDelete, setFileIdToDelete] = useState(null);
  const [fileRequestCounter, setFileRequestCounter] = useState(1);
  const [stateApp, setStateApp] = React.useContext(AppContext);
  const [recentFiles, setRecentFiles] = useState([]);

  useEffect(() => {
    if (props.filesData?.viewFiles) setRecentFiles(props.filesData.viewFiles);
  }, [props.filesData]);

  const userId = stateApp.user.mongoId;

  const [relatedObjectType, limit] = useMemo(() => {
    if (props.isTransactPage) return ["Deal", 99];
    else return ["Contact", 2];
  }, [props.isTransactPage]);

  const [getRecentFiles, { data: files }] = useLazyQuery(
    GETRECENTCONTACTFILES,
    {
      fetchPolicy: "cache-and-network",
      onCompleted: ({ getFileDescriptors }) => {
        let allActive = true;

        console.log("File descriptors: ", getFileDescriptors);
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
                  relatedObjectId: props.id,
                  relatedObjectType,
                  limit,
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
  const [deleteFile] = useMutation(DELETEDESCRIPTORFILE);

  const [viewFile, { data: viewFileResult }] = useLazyQuery(VIEWFILEQUERY, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    getRecentFiles({
      variables: {
        relatedObjectId: props.id,
        relatedObjectType,
        limit,
      },
    });
  }, [props.id]);

  useEffect(() => {
    if (viewFileResult?.viewFile?.uri) {
      let a = document.createElement("a");
      a.href = viewFileResult.viewFile.uri;
      a.download = viewFileResult.viewFile.name;
      a.click();
    }
  }, [viewFileResult]);

  useEffect(() => {
    setStateApp((state) => ({ ...state, filesDescriptors: files?.getFileDescriptors }))
  }, [files]);

  const handleDeleteCancel = () => {
    setFileIdToDelete(null);
    setOpenDeleteConfirmDialog(false);
  };

  const handleDeleteAccept = () => {
    // Delete Document Logic goes here
    if (fileIdToDelete) {
      deleteFile({
        variables: {
          id: fileIdToDelete,
        },
        refetchQueries: ["getRecentContactFiles", "getContactFiles"],
        awaitRefetchQueries: true,
      });
      setFileIdToDelete(null);
      setOpenDeleteConfirmDialog(false);
    }
  };

  const handleViewFile = async (id) => {
    viewFile({ variables: { fileId: id } });
  };
  const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }))(Tooltip);

  return (
    <div className={classes.root} variant="outlined">
      <CardActions style={{ padding: "23px 0px 8px 0px" }}>
        <Grid item xs={12} style={{ minHeight: "35px" }}>
          <h4 style={{ margin: "0 0 8px 0", float: "left" }}>Lane Progress</h4>
          <h4
            className={classes.details}
          // onClick={() => {
          //   setStateApp((stateApp) => ({
          //     ...stateApp,
          //     transactBarView: "Documents",
          //   }));
          // }}
          >
            Details
            </h4>
        </Grid>
      </CardActions>
      <CardContent style={{ padding: "0 23px" }}>
        <div className={classes.laneProgressSection}>
          {/* Show two recent docs */}

          <Grid container spacing={2}>
            {console.log(recentFiles, "Files data in Adddialog")}
            {recentFiles?.map((value, key) => {
              let fileExtension = value?.name
                ?.slice(value.name.lastIndexOf(".") + 1)
                ?.toLowerCase();
              if (key <= 1) {
                return (
                  <Grid item xs={4} key={key} className="" >
                    <LightTooltip
                      title={
                        <div className={classes.IconSection}>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setOpenDeleteConfirmDialog(true);
                              setFileIdToDelete(
                                files?.getFileDescriptors[key].descriptorId
                              );
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>

                          <IconButton
                            disabled={
                              files?.getFileDescriptors[key]?.fileState !==
                              "active"
                            }
                            size="small"
                            onClick={() =>
                              handleViewFile(
                                files?.getFileDescriptors[key].fileId
                              )
                            }
                          >
                            <GetAppIcon />
                          </IconButton>
                        </div>
                      }
                      interactive
                    >
                      <div>
                        {new RegExp(
                          ["jpg", "jpeg", "png", "bmp"].join("|")
                        ).test(fileExtension) ? (
                          <img
                            src={value.uri}
                            alt={value.name}
                            className={classes.forImage}
                          ></img>
                        ) : (
                          <div className={classes.forImageContainer}

                            onClick={() => {

                              if (fileExtension === 'pdf') {
                                setStateApp({ ...stateApp, viewDoc: { uri: value.uri, name: value.name } })
                              }
                              else {
                                handleViewFile(
                                  files?.getFileDescriptors[key].fileId
                                )
                              }
                            }}>

                            {get_file_icon(fileExtension)}
                          </div>
                        )}
                        <div className={classes.imageSubText}>
                          {value?.name?.length > 12
                            ? value.name.slice(0, 8) + "..."
                            : value.name}
                        </div>
                      </div>
                    </LightTooltip>
                  </Grid>
                );
              } else return <></>
            })}
          </Grid>
        </div>
      </CardContent>
    </div>
  );
}
