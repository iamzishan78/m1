import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CardActions from "@material-ui/core/CardActions";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import { pdfjs } from "react-pdf";
import ProgressBar from "../../Shared/ui/ProgressBar";

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
  flowLane: {
    fontWeight: "bold",
  },
  newFlowLane: { color: "darkgray", marginTop: "10px", cursor: "pointer" },
}));

export default function LaneProgressZone(props) {
  const classes = useStyles();
  const { pipeToShow, toggleProgressDetail } = props;

  return (
    <div className={classes.root} variant="outlined">
      <CardActions style={{ padding: "23px 0px 0px 0px", borderBottom: "1px solid lightgray" }}>
        <Grid item xs={12} style={{ minHeight: "35px" }}>
          <h4 style={{ margin: "0 0 8px 0", float: "left" }}>Lane Progress</h4>
          <h4 className={classes.details} onClick={() => toggleProgressDetail(true)}>Details</h4>
        </Grid>
      </CardActions>
      <CardContent style={{ padding: 0 }}>
        <div className={classes.laneProgressSection}>
          {/* Show two recent docs */}

          {pipeToShow &&
            pipeToShow.lanes.map((lane, index) => (
              <>
                <Grid key={index} container direction="row" justify="space-between" alignItems="center" className={classes.flowLane}>
                  <Grid item style={{ width: "155px" }}>
                    {lane.title}
                  </Grid>
                  <Grid item style={{ minWidth: "100px" }}>
                    <ProgressBar value={50} isNumeric />
                  </Grid>
                  <Grid item style={{ display: "flex" }}>
                    <Grid container direction="row" justify="flex-end" alignItems="center">
                      <Grid item>
                        <IconButton>
                          <AccountCircle fontSize="medium" />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton>
                          <ChatBubbleOutlineIcon fontSize="medium" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Divider />
              </>
            ))}
          <div className={classes.newFlowLane}>+ Add New</div>
        </div>
      </CardContent>
    </div>
  );
}
