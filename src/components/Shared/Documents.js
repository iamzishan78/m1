import React, { useCallback } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import GetAppIcon from "@material-ui/icons/GetApp";
import ViewDocuments from "../ViewDocuments/ViewDocuments"

import { useDropzone } from "react-dropzone";

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
    minHeight: "35px",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    width: "100%",
  },
  fileUploadTopSection: {
    minHeight: "35px",
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
    minHeight: "35px",
    padding: "10px 40px",
    color: "#757575",
    fontWeight: "normal",
    backgroundColor: "#eee",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px dashed rgb(176, 176, 176)",
    marginBottom: "23px",
  },
}));

function UploadZone() {
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const classes = useStyles();

  return (
    <div {...getRootProps()} className={classes.fileDrop}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <h5>Drop the files here ...</h5>
      ) : (
        <h5>Click to upload, or Drag a file here</h5>
      )}
    </div>
  );
}

export default function Documents(props) {
  const classes = useStyles();

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
                  id={props.id}
                  user_id={props.user_id}
                  activityLog={props.activityLog}
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
          <div className={classes.fileUploadTopSection}>
            <div>
              <h4 className={classes.uploadTitle}>Testupload.pdf</h4>
              <h5 className={classes.uploadSubtext}>Kyle Chapman</h5>
              <h5 className={classes.uploadSubtext}>a few seconds ago</h5>
              <h5 className={classes.uploadSubtext}>application/pdf 5.64kb</h5>
            </div>
            <div className={classes.IconSection}>
              <IconButton size="small" style={{ marginBottom: "8px" }}>
                <DeleteIcon />
              </IconButton>
              <IconButton size="small">
                <GetAppIcon />
              </IconButton>
            </div>
          </div>
          <UploadZone />
        </div>
      </CardContent>
    </div>
  );
}
