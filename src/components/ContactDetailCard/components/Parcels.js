import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ParcelIcon from "../../Shared/svgIcons/ParcelIcon";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import ParcelsDetailCard from "../../ParcelsDetailCard/ParcelsDetailCard";

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
    backgroundColor: "#D4F4F9",
    borderRadius: "100%",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  h5: { color: "#757575", marginTop: "0" },
}));

export default function Parcels(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div>
        <h4 style={{ marginTop: "0", float: "left" }}>Parcels (40)</h4>
        <IconButton
          size="small"
          className={classes.addIcon}
          onClick={() => {
            props.handleOpenExpandableCard(
              <ParcelsDetailCard />,
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
            <ParcelIcon />
          </div>
        </div>

        <div>
          <h5 className={classes.h5}>
            Gross Acres
            <br />
            <span className={classes.lastContactedSpan}>1280</span>
          </h5>
          <h5 className={classes.h5}>
            Net Acres
            <br />
            <span className={classes.lastContactedSpan}>640</span>
          </h5>
        </div>
      </div>
    </div>
  );
}
