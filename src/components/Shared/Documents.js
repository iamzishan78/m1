import React, { useMemo, useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useMutation, useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";
import moment from "moment";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faFilePowerpoint,
  faFileWord,
  faFile,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import GetAppIcon from "@material-ui/icons/GetApp";
import ViewDocuments from "../ViewDocuments/ViewDocuments";
import { useDropzone } from "react-dropzone";
import DeleteDocumentConfirmation from "./DeleteDocumentConfirmation";
import { ADDFILE } from "../../graphQL/useMutationAddFile";
import { AppContext } from "../../AppContext";
import { ADDDESCRIPTORFILE } from "../../graphQL/useMutationAddDescriptorFile";
import { GETRECENTCONTACTFILES } from "../../graphQL/useQueryGetContactFiles";
import { DELETEDESCRIPTORFILE } from "../../graphQL/useMutationDeleteDescriptorFile";
import { VIEWFILEQUERY, VIEWFILESQUERY } from "../../graphQL/useQueryViewFile";
import { useDispatch } from "react-redux";
import UploadZone from "./UploadZone";
import CardMedia from "@material-ui/core/CardMedia";

const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: "#fff",
  },
  timelineItemRight: {
    "&:before": {
      content: "none",
    },
  },
  forImage: {
    width: "80px",
    height: "80px",
    backgroundColor: "transparent !important",
    border: "1px solid #999",
    borderRadius: "12px",
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

  fileUploadSection: {
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
  flexIcon: {
    display: "flex",
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
    flexDirection: "column",
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

  greySquare: {
    cursor: "pointer",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "30px",
    height: "80px",
    width: "80px",
    backgroundColor: "#cecece",
    marginRight: "10px",

    "& svg": {
      fill: "#999 !important",
    },
  },
  disabledDownload: {
    cursor: "auto !important",
    backgroundColor: "#e9e9e978 !important",
    "& svg": {
      fill: "#d3d3d3ab !important",
    },
  },
}));

export default function Documents(props) {
  const classes = useStyles();
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [fileIdToDelete, setFileIdToDelete] = useState(null);
  const [fileRequestCounter, setFileRequestCounter] = useState(1);
  const [documentSearch, setDocumentSearch] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  const [stateApp, setStateApp] = React.useContext(AppContext);
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
            // dispatch(
            //   showWarningMessage(
            //     "Please wait a few seconds until the last uploaded file is ready, then reload the app"
            //   )
            // );
          }
        } else setFileRequestCounter(1);
      },
    }
  );
  const [deleteFile] = useMutation(DELETEDESCRIPTORFILE);

  // const [addFile, { data: addFileData, loading: addFileLoading }] = useMutation(
  //   ADDDESCRIPTORFILE,
  //   {
  //     refetchQueries: ["getRecentContactFiles"],
  //     awaitRefetchQueries: true,
  //     //   onCompleted: () => {
  //     //     // setTimeout(() => {
  //     //     //   getRecentFiles({
  //     //     //     variables: {
  //     //     //       contactId: props.id,
  //     //     //     },
  //     //     //   });
  //     //     // }, 3000);
  //     //   },
  //   }
  // );
  const [viewFile, { data: viewFileResult }] = useLazyQuery(VIEWFILEQUERY, {
    fetchPolicy: "no-cache",
  });

  // const [viewFile, { data: viewFileData }] = useLazyQuery(VIEWFILEQUERY, {
  //   fetchPolicy: "no-cache",
  // });
  useEffect(() => {
    getRecentFiles({
      variables: {
        relatedObjectId: props.id,
        relatedObjectType,
        limit,
      },
    });
  }, [props.id]);

  const [
    viewFiles,
    { data: viewFileResultt, loading: viewFileLoading },
  ] = useLazyQuery(VIEWFILESQUERY, {
    fetchPolicy: "no-cache",
  });
  useEffect(() => {
    if (files && files?.getFileDescriptors?.length > 0) {
      let ID = [];
      for (let i = 0; i < files?.getFileDescriptors.length; i++) {
        // console.log(files?.getFileDescriptors[i].fileId, 'Kumail Test')
        ID.push(files?.getFileDescriptors[i].fileId);
      }

      viewFiles({
        variables: { fileIds: ID },
      });
    }
  }, [files]);

  useEffect(() => {
    if (viewFileResult?.viewFile?.viewFile?.uri) {
      let a = document.createElement("a");
      a.href = viewFileResult?.viewFile.viewFile.uri;
      a.download = viewFileResult?.viewFile.viewFile.name;

      // if for some reason we want to download (or open depending on x-ms-blob-content-disposition) in a new tab
      // a.target = "_blank";

      // file download on click is not 100% guranteed if the x-ms-blob-content-disposition is not set to attachment
      a.click();
    }
  }, [viewFileResult?.viewFile]);

  const getFileIcon = (fileExtension) => {
    switch (fileExtension) {
      case "pdf":
        return (
          <FontAwesomeIcon
            icon={faFilePdf}
            style={{ fontSize: "2rem", color: "#F15642" }}
          />
        );
      case "csv":
        return (
          <FontAwesomeIcon
            icon={faFileExcel}
            style={{ fontSize: "2rem", color: "#207244" }}
          />
        );
      case "xlsx":
        return (
          <FontAwesomeIcon
            icon={faFileExcel}
            style={{ fontSize: "2rem", color: "#207244" }}
          />
        );
      case "xlsb":
        return (
          <FontAwesomeIcon
            icon={faFileExcel}
            style={{ fontSize: "2rem", color: "#207244" }}
          />
        );
      case "xlsm":
        return (
          <FontAwesomeIcon
            icon={faFileExcel}
            style={{ fontSize: "2rem", color: "#207244" }}
          />
        );
      case "xltx":
        return (
          <FontAwesomeIcon
            icon={faFileExcel}
            style={{ fontSize: "2rem", color: "#207244" }}
          />
        );
      case "doc":
        return (
          <FontAwesomeIcon
            icon={faFileWord}
            style={{ fontSize: "2rem", color: "#2A5599" }}
          />
        )
      case "docx":
        return (
          <FontAwesomeIcon
            icon={faFileWord}
            style={{ fontSize: "2rem", color: "#2A5599" }}
          />
        );
      case "ppt":
        return (
          <FontAwesomeIcon
            icon={faFilePowerpoint}
            style={{ fontSize: "2rem", color: "#D04424" }}
          />
        );
      case "pptx":
        return (
          <FontAwesomeIcon
            icon={faFilePowerpoint}
            style={{ fontSize: "2rem", color: "#D04424" }}
          />
        );
      default:
        // return <span>{fileExtension}</span>;
        return (
          <FontAwesomeIcon
            icon={faFile}
            style={{ fontSize: "2rem", color: "grey" }}
          />
        );
    }
  };

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
  useEffect(() => {
    if (viewFileResult?.viewFile?.uri) {
      let a = document.createElement("a");
      a.href = viewFileResult.viewFile.uri;
      a.download = viewFileResult.viewFile.name;

      // if for some reason we want to download (or open depending on x-ms-blob-content-disposition) in a new tab
      // a.target = "_blank";

      // file download on click is not 100% guranteed if the x-ms-blob-content-disposition is not set to attachment
      a.click();
    }
  }, [viewFileResult]);

  useEffect(() => {
    let filtered = viewFileResultt?.viewFiles?.filter((doc) =>
      doc.name.toLowerCase().includes(documentSearch.toLowerCase())
    );

    let filteredMerged = filtered?.map((doc) => {
      let fileDescriptor = files?.getFileDescriptors?.find((file) => file.fileId === doc.id);
      return {
        ...doc,
        descriptorId: fileDescriptor?.descriptorId,
        state: fileDescriptor?.fileState,
        dateTime: fileDescriptor?.dateTime
      }
    });
    setFilteredDocuments(filteredMerged);
  }, [documentSearch, viewFileResultt?.viewFiles]);

  const ExtenstionGetter = (name) => {
    let fileExtension = name
      ?.slice(name.lastIndexOf(".") + 1)
      ?.toLowerCase();

    return fileExtension
  }
  return (
    <div className={classes.root} variant="outlined" >
      {!props.isTransactPage && (
        <CardActions style={{ padding: "23px 23px 8px 23px" }}>
          <Grid item xs={12} style={{ minHeight: "35px" }}>
            <h4 style={{ margin: "0 0 8px 0", float: "left" }}>
              Recent Documents
            </h4>
            <h4
              className={classes.viewAll}

              // onClick={(e) => {
              //   e.preventDefault();
              //   props.viewAll("comments");
              // }}

              onClick={() => {
                props.handleOpenExpandableCard(
                  <ViewDocuments
                    contactId={props.id}
                    user_id={props.user_id}
                    activityLog={props.activityLog}
                    openDeleteConfirmDialog={openDeleteConfirmDialog}
                    handleClose={handleDeleteCancel}
                    handleAccept={handleDeleteAccept}
                    setOpenDeleteConfirmDialog={setOpenDeleteConfirmDialog}
                    setFileIdToDelete={setFileIdToDelete}
                  />,
                  "Documents"
                );
                setStateApp({ ...stateApp, viewDoc: null })
              }}
            >
              View All
            </h4>
          </Grid>
        </CardActions>
      )}
      <CardContent  >
        {props.isTransactPage && (
          <UploadZone
            relatedObjectId={props.id}
            userId={userId}
            relatedObjectType={relatedObjectType} //Contact or Deal
          />
        )}
        {props.isTransactPage && (
          <div style={{ marginBottom: "20px" }}
          >
            <TextField
              fullWidth
              value={documentSearch}
              onChange={(e) => setDocumentSearch(e.target.value)}
              variant="outlined"
              label={"Search Documents"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              labelWidth={70}
            />
          </div>
        )}
        <div className={classes.fileUploadSection}>

          {/* this is for view all */}
          {filteredDocuments?.map((file, key) => {

            let fileExtension = file?.name
              ?.slice(file.name.lastIndexOf(".") + 1)
              ?.toLowerCase();

            return (
              <div key={file.id}

              >
                <div className={classes.fileUploadTopSection}>
                  <div className={classes.flexIcon}>
                    {
                      <div
                        className={`${classes.greySquare} ${file.state !== "active"
                          ? classes.disabledDownload
                          : ""
                          }`}

                        onClick={() => {

                          viewFileResultt?.viewFiles.forEach((value) => {

                            if (value.id === file.id && ExtenstionGetter(file.name) === 'pdf') {
                              setStateApp({ ...stateApp, viewDoc: { uri: value.uri, name: file.name } })
                            }
                            else {
                              handleViewFile(file.id)
                            }

                          })
                        }}
                      >
                        {new RegExp(
                          ["jpg", "jpeg", "png", "bmp"].join("|")
                        ).test(fileExtension) ? (
                          <img
                            src={file.uri}
                            alt={file.name}
                            className={classes.forImage}
                          ></img>
                        ) : (
                          <div className={classes.forImageContainer} onClick={() => {
                            if (file.state !== "active") return;

                            if (fileExtension === 'pdf') {
                              setStateApp({ ...stateApp, viewDoc: { uri: file.uri, name: file.name } })
                            }
                          }}>
                            {/* {fileExtension} */}
                            {getFileIcon(fileExtension)}
                          </div>
                        )
                        }
                      </div>
                    }
                    <div className='DocumentTitle'
                      onClick={() => {

                        viewFileResultt?.viewFiles.map((value) => {

                          if (value.id === file.id && ExtenstionGetter(file.name) === 'pdf') {
                            setStateApp({ ...stateApp, viewDoc: { uri: value.uri, name: file.name } })
                          }
                          else {
                            handleViewFile(file.id)
                          }

                        })
                      }}>
                      <h4 className={classes.uploadTitle} >
                        {file?.name?.length > 22
                          ? file?.name?.slice(0, 20) + "..."
                          : file?.name}
                      </h4>
                      {/* <h5 className={classes.uploadSubtext}>{file.userName}</h5> */}
                      <h5 className={classes.uploadSubtext}>
                        {moment.utc(file.dateTime).format("MMM DD, YYYY")}
                      </h5>
                    </div>
                  </div>
                  <div className={classes.IconSection}>
                    <IconButton
                      size="small"
                      style={{ marginBottom: "8px" }}
                      onClick={() => {
                        setOpenDeleteConfirmDialog(true);
                        setFileIdToDelete(file.descriptorId);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>

                    {/* {!props.isTransactPage && ( */}
                    <IconButton
                      disabled={file.state !== "active"}
                      size="small"
                      onClick={() => handleViewFile(file.id)}
                    >
                      <GetAppIcon />
                    </IconButton>
                    {/* )} */}
                  </div>
                </div>
              </div>
            );
          })}
          <DeleteDocumentConfirmation
            open={openDeleteConfirmDialog}
            handleClose={handleDeleteCancel}
            handleAccept={() => {
              handleDeleteAccept();
            }}
          />
          {!props.isTransactPage && (
            <UploadZone
              relatedObjectId={props.id}
              userId={userId}
              relatedObjectType={relatedObjectType} //Contact or Deal
            />
          )}
        </div>
      </CardContent>
    </div>
  );
}
