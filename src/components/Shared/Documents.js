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
import ViewDocuments from "../ViewDocuments/ViewDocuments";

import { useDropzone } from "react-dropzone";
import DeleteDocumentConfirmation from "./DeleteDocumentConfirmation";
import { ADDFILE } from "../../graphQL/useMutationAddFile";
import { AppContext } from "../../AppContext";
import { ADDDESCRIPTORFILE } from "../../graphQL/useMutationAddDescriptorFile";
import { GETRECENTCONTACTFILES } from "../../graphQL/useQueryGetContactFiles";
import { DELETEDESCRIPTORFILE } from "../../graphQL/useMutationDeleteDescriptorFile";
import { VIEWFILEQUERY } from "../../graphQL/useQueryViewFile";

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
}));

function UploadZone(props) {
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
            "Content-Type": "text/plain; charset=UTF-8",
            "X-Ms-Blob-Content-Disposition": `attachment; filename="${file_name}"`,
            "X-Ms-Blob-Type": "BlockBlob",
            "X-Ms-Meta-Internalkey": interal_key,
            "X-Ms-Version": "2015-02-21",
          },
          method: "PUT",
          body: JSON.stringify(inputFile),
        })
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      }
    }
  }, [props.addFileData]);

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files

    const [file] = acceptedFiles;
    const fileName = file.name;

    setInputFile(file);

    props.addFile({
      variables: {
        fileName,
        userId: props.userId,
        contactId: props.contactId,
      },
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const classes = useStyles();

  return (
    <>
      <div {...getRootProps()} className={classes.fileDrop}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <h5>Drop the files here ...</h5>
        ) : (
          <h5>Drag a file here or click to select a file to upload</h5>
        )}
      </div>
      {/* {props.addFileData && !props.addFileData.addFileDescriptor.success && (
        <p className={classes.fileDropError}>File could not be uploaded</p>
      )} */}
    </>
  );
}

export default function Documents(props) {
  const classes = useStyles();
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [fileIdToDelete, setFileIdToDelete] = useState(null);
  const [stateApp] = React.useContext(AppContext);
  const userId = stateApp.user.mongoId;
  const [getRecentFiles, { data: files }] = useLazyQuery(
    GETRECENTCONTACTFILES,
    { fetchPolicy: "cache-and-network" }
  );
  const [deleteFile] = useMutation(DELETEDESCRIPTORFILE);
  const [addFile, { data: addFileData }] = useMutation(ADDDESCRIPTORFILE, {
    onCompleted: () => {
      setTimeout(() => {
        getRecentFiles({
          variables: {
            userId,
            contactId: props.id,
          },
        });
      }, 3000);
    },
  });
  const [viewFile, { data: viewFileResult }] = useLazyQuery(VIEWFILEQUERY, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    getRecentFiles({
      variables: {
        userId,
        contactId: props.id,
      },
    });
  }, []);

  useEffect(() => {
    console.log("VIEW FILE RESULT", viewFileResult);
    if (viewFileResult) {
      let a = document.createElement("a");
      a.href = viewFileResult.viewFile.uri;
      a.download = viewFileResult.viewFile.name;

      // if for some reason we want to download (or open depending on x-ms-blob-content-disposition) in a new tab
      a.target = "_blank";

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
          <h4 style={{ margin: "0 0 8px 0", float: "left" }}>Documents</h4>
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
                  <h5 className={classes.uploadSubtext}>{file.userName}</h5>
                  <h5 className={classes.uploadSubtext}>
                    {moment(new Date(Number(file.dateTime))).fromNow()}
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
          />
        </div>
      </CardContent>
    </div>
  );
}
