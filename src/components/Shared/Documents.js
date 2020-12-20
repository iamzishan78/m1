import React, { useCallback, useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useMutation, useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";
import moment from "moment";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import GetAppIcon from "@material-ui/icons/GetApp";
import { CircularProgress } from "@material-ui/core";
import { DropzoneAreaBase } from "material-ui-dropzone";
import ViewDocuments from "../ViewDocuments/ViewDocuments";
import { useDropzone } from "react-dropzone";
import DeleteDocumentConfirmation from "./DeleteDocumentConfirmation";
import { ADDFILE } from "../../graphQL/useMutationAddFile";
import { AppContext } from "../../AppContext";
import { ADDDESCRIPTORFILE } from "../../graphQL/useMutationAddDescriptorFile";
import { GETRECENTCONTACTFILES } from "../../graphQL/useQueryGetContactFiles";
import { DELETEDESCRIPTORFILE } from "../../graphQL/useMutationDeleteDescriptorFile";
import { VIEWFILEQUERY } from "../../graphQL/useQueryViewFile";
import { useDispatch } from "react-redux";
import { showErrorMessage, showWarningMessage } from "../../actions";

const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: "#fff",
  },
  timelineItemRight: {
    "&:before": {
      content: "none",
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
  dropzoneClass: {
    "&:hover": { backgroundColor: "#dddddd" },
    "& .MuiDropzoneArea-text": {
      fontSize: "0.83em",
      marginBlockStart: "1.67em",
      marginBlockEnd: "1.67em",
      fontWeight: "bold",
    },
    "& .MuiDropzoneArea-icon": { display: "none" },
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
}));

function UploadZone(props) {
  const dispatch = useDispatch();
  const [inputFile, setInputFile] = useState(null);

  useEffect(() => {
    if (props.addFileData && props.addFileData?.addFileDescriptor?.success) {
      console.log("HALLO ADD FILE DATA HERE", props.addFileData);
      const uri = props.addFileData.addFileDescriptor.file.uri;
      const interal_key = props.addFileData.addFileDescriptor.file.internalKey;
      const file_id = props.addFileData.addFileDescriptor.file.id;
      const file_name = props.addFileData.addFileDescriptor.file.name;

      if (file_id) {
        fetch(uri, {
          headers: {
            "X-Ms-Blob-Content-Disposition": `attachment; filename="${file_name}"`,
            "X-Ms-Blob-Type": "BlockBlob",
            "X-Ms-Meta-Internalkey": interal_key,
            "X-Ms-Version": "2015-02-21",
          },
          method: "PUT",
          body: inputFile,
        })
          .then((res) => {
            console.log(res);
            if (res?.status == 201) {
              // props.getRecentFiles();
            } else dispatch(showErrorMessage("Upload failed"));
          })
          .catch((err) => console.log(err));
      }
    }
  }, [props.addFileData]);

  const handleFileInput = (files) => {
    if (Array.isArray(files)) {
      let inputFile = files[0]?.file;
      let fileName = files[0]?.file?.name;

      if (inputFile && fileName) {
        setInputFile(inputFile);

        props.addFile({
          variables: {
            fileName,
            userId: props.userId,
            contactId: props.contactId,
          },
        });
      }
    }
  };

  const classes = useStyles();

  return (
    <>
      <DropzoneAreaBase
        onAdd={handleFileInput}
        // onDelete={(fileObj) => console.log("Removed File:", fileObj)}
        onAlert={(message, variant) => {
          console.log(`${variant}: ${message}`);
        }}
        filesLimit={1}
        dropzoneText={"Drag a file here or click to select a file to upload"}
        acceptedFiles={[
          "image/*",
          "video/*",
          "application/*",
          ".*",
          ".geojson",
          ".csv",
          ".pdf",
          ".docx",
          ".doc",
          ".ppt",
          ".pptx",
          ".txt",
          ".xls",
          ".xlsx",
        ]}
        maxFileSize={104857600}
        dropzoneClass={classes.dropzoneClass}
      ></DropzoneAreaBase>
    </>
  );
}

export default function Documents(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [fileIdToDelete, setFileIdToDelete] = useState(null);
  const [fileRequestCounter, setFileRequestCounter] = useState(1);
  const [stateApp] = React.useContext(AppContext);
  const userId = stateApp.user.mongoId;
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
                  contactId: props.id,
                },
              });
              clearTimeout(waitBeforeRequestAgain);
            }, 1000);
          } else {
            setFileRequestCounter(1);
            dispatch(
              showWarningMessage(
                "Please wait a few seconds until the uploaded file is ready, then reload the app"
              )
            );
          }
        } else setFileRequestCounter(1);
      },
    }
  );
  const [deleteFile] = useMutation(DELETEDESCRIPTORFILE);
  const [addFile, { data: addFileData, loading: addFileLoading }] = useMutation(
    ADDDESCRIPTORFILE,
    {
      refetchQueries: ["getRecentContactFiles"],
      awaitRefetchQueries: true,
      //   onCompleted: () => {
      //     // setTimeout(() => {
      //     //   getRecentFiles({
      //     //     variables: {
      //     //       contactId: props.id,
      //     //     },
      //     //   });
      //     // }, 3000);
      //   },
    }
  );
  const [viewFile, { data: viewFileResult }] = useLazyQuery(VIEWFILEQUERY, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    getRecentFiles({
      variables: {
        contactId: props.id,
      },
    });
  }, []);

  useEffect(() => {
    console.log("VIEW FILE RESULT", viewFileResult);
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

  return (
    <div className={classes.root} variant="outlined">
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
            }}
          >
            View All
          </h4>
        </Grid>
      </CardActions>
      <CardContent style={{ padding: "0 23px" }}>
        <div className={classes.fileUploadSection}>
          {/* Show two recent docs */}
          {files?.getFileDescriptors?.map((file) => (
            <>
              <div className={classes.fileUploadTopSection}>
                <div>
                  <h4 className={classes.uploadTitle}>{file.fileName}</h4>
                  {/* <h5 className={classes.uploadSubtext}>{file.userName}</h5> */}
                  <h5 className={classes.uploadSubtext}>
                    {moment.utc(file.dateTime).format("MMM DD, YYYY")}
                  </h5>
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

                  <IconButton
                    disabled={file.fileState !== "active"}
                    size="small"
                    onClick={() => handleViewFile(file.fileId)}
                  >
                    <GetAppIcon />
                  </IconButton>
                </div>
              </div>
            </>
          ))}
          <DeleteDocumentConfirmation
            open={openDeleteConfirmDialog}
            handleClose={handleDeleteCancel}
            handleAccept={() => {
              handleDeleteAccept();
            }}
          />
          <UploadZone
            contactId={props.id}
            userId={userId}
            addFile={addFile}
            addFileData={addFileData}
            getRecentFiles={() => {
              getRecentFiles({
                variables: {
                  contactId: props.id,
                },
              });
            }}
          />
          {addFileLoading && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress size="20px" />
            </div>
          )}
        </div>
      </CardContent>
    </div>
  );
}
