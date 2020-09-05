import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

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
    uploadTitle: {
      width: "fit-content",
      margin: "0",
      float: "left",
      color: "#757575",
      fontWeight: "normal",
    },
    uploadSubtext: {
      color: "rgb(176, 176, 176)",
      margin: "0",
      fontWeight: "normal",
    },
    fileUploadSection: {
      minHeight: "35px",
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "column",
      width: "100%"
    },
  },
}));

export default function Documents() {
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
          >
            View All
          </h4>
        </Grid>
      </CardActions>
      <CardContent>
        <div className={classes.fileUploadSection}>
          <div>
            <h4 className={classes.uploadTitle}>Testupload.pdf</h4>
            <h5 className={classes.uploadSubtext}>Kyle Chapman</h5>
            <h5 className={classes.uploadSubtext}>a few seconds ago</h5>
            <h5 className={classes.uploadSubtext}>application/pdf 5.64kb</h5>
          </div>
          <div>
            <h4>Icon</h4>
            <h4>Icon2</h4>
          </div>
        </div>
      </CardContent>
    </div>
  );
}
