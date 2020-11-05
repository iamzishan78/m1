import React, { useContext } from "react";
import { AppContext } from "../../AppContext";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { useDispatch, useSelector } from "react-redux";
import { setMapGridCardState } from "../../actions";
import WellInterestsTopSumary from "./components/WellInterestsTopSumary";
import M1nTable from "../Shared/M1nTable/M1nTable";

const useStyles = makeStyles((theme) => ({
  gridWidthScroll: {
    backgroundColor: "#efefef",
    //height: "100%"
  },
  breadcrumbs: {
    padding: "6px 45px",
    backgroundColor: "#eaf3ff",
    // "& .MuiBreadcrumbs-separator": { color: theme.palette.secondary.main },
    "& .wellInterestsText": { color: "rgb(0 0 0 / 72%)" },
    "& .clickable": {
      cursor: "pointer",
      "&:hover": { color: "rgb(10 148 196)" },
    },
  },
  mainPanelsDiv: {
    maxHeight: "calc(100% - 64px)",
    overflow: "auto",
    height: "calc(100% - 64px)",
    "& div": {
      "&>.MuiPaper-root": {
        "&>:nth-child(3)": {
          minHeight: ({ mapGridCardActivated }) =>
            mapGridCardActivated === "exp"
              ? "calc(91vh - 415px)"
              : "calc(60vh - 415px)",
        },
      },
    },
  },
}));

export default function OwnersSummaryCard(props) {
  const dispatch = useDispatch();
  const { selectedOwner, mapGridCardActivated } = useSelector(
    ({ MapGridCard }) => MapGridCard
  );
  const [stateApp] = useContext(AppContext);
  const classes = useStyles({ mapGridCardActivated });

  return (
    <Grid
      container
      className={`cancelDraggableEffect  ${classes.mainPanelsDiv}`}
      spacing={0}
    >
      <Grid item sm={12}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          className={classes.breadcrumbs}
        >
          <Typography
            className="clickable"
            color="secondary"
            onClick={() => {
              dispatch(
                setMapGridCardState({
                  selectedOwner: null,
                })
              );
            }}
          >
            Interest Owners
          </Typography>
          <Typography color="secondary">
            {selectedOwner && selectedOwner.name
              ? selectedOwner.name
              : selectedOwner.OwnerName}
          </Typography>
          <Typography className="wellInterestsText">Well Interests</Typography>
        </Breadcrumbs>
      </Grid>

      <Grid
        item
        sm={12}
        style={{ backgroundColor: "#fff", minHeight: "194px" }}
      >
        <WellInterestsTopSumary
          id={
            selectedOwner && selectedOwner.id
              ? selectedOwner.id
              : selectedOwner.Id
          }
        />
      </Grid>
      <Grid item sm={12} style={{ backgroundColor: "#fff" }}>
        <M1nTable
          dense
          parent="owner_WellInterests"
          id={
            selectedOwner && selectedOwner.id
              ? selectedOwner.id
              : selectedOwner.Id
          }
        />
      </Grid>
    </Grid>
  );
}
