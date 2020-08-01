import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ParcelIcon from "../../Shared/svgIcons/ParcelIcon";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import WellIcon from "../../Shared/svgIcons/well";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "23px 23px 0 23px",
  },

  cardContent: { width: "100%", display: "flex" },
  leftColumn: {
    textAlign: "center",
    marginRight: "18px",
  },
  addIcon: {
    backgroundColor: "#D5F4FF",
    float: "right",
    top: "-6px",
  },
  lastContactedSpan: { fontWeight: "normal", marginBottom: "0" },
  icon: {
    width: "80px",
    height: "80px",
    backgroundColor: "#DFEDFF",
    borderRadius: "100%",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  h5: { color: "#757575", marginTop: "0" },
}));

export default function WellsCard(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div>
        <h4 style={{ marginTop: "0", float: "left" }}>Wells (40)</h4>
        <IconButton
          size="small"
          className={classes.addIcon}
          onClick={() => {
            props.handleOpenExpandableCard(
              "Pass your card content here",
              "Wells/Parcels"
            );
          }}
        >
          <AddIcon htmlColor="rgb(28 173 225 / 81%)" />
        </IconButton>
      </div>
      <div className={classes.cardContent}>
        <div className={classes.leftColumn}>
          <div className={classes.icon}>
            <WellIcon color="rgb(102 146 202" opacity="1" size="36" />
          </div>
        </div>

        <div>
          <h5 className={classes.h5}>
            Cum. Prod (BOE)
            <br />
            <span className={classes.lastContactedSpan}>10,200</span>
          </h5>
          <h5 className={classes.h5}>
            Avg Mo. Prod (BOE)
            <br />
            <span className={classes.lastContactedSpan}>10,200</span>
          </h5>
        </div>
      </div>
    </div>
  );
}
