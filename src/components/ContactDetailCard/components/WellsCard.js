import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import WellIcon from "../../Shared/svgIcons/well";
import ContactsWellInterestsParcelInterests from "./ContactsWellInterestsParcelInterests/ContactsWellInterestsParcelInterests";

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
        <h4 style={{ marginTop: "0", float: "left" }}>Wells (0)</h4>
        <IconButton
          size="small"
          className={classes.addIcon}
          onClick={() => {
            props.handleOpenExpandableCard(
              <ContactsWellInterestsParcelInterests
                activeTap={0}
                contactData={props.contactData}
              />,
              "Associated Interests"
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
            Types of Interest
            <br />
            <span className={classes.lastContactedSpan}>-</span>
          </h5>
          <h5 className={classes.h5}>
            Average Value
            <br />
            <span className={classes.lastContactedSpan}>-</span>
          </h5>
        </div>
      </div>
    </div>
  );
}
