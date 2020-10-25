import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Add from "@material-ui/icons/Add";
import OfflineBolt from "@material-ui/icons/OfflineBolt";
import CheckBox from "@material-ui/icons/CheckBox";
import { makeStyles } from "@material-ui/core/styles";
import React, { useContext } from "react";
import { AppContext } from "../../../AppContext";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "64px",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 12px",
  },
  right: {
    "& h2": {
      color: "#0DBBEA",
      padding: "12px"
    },
  },
  left: {
    display: "flex",
  },
  closedDeals: {
    marginLeft: 8,
    backgroundColor: "#3DD698",
    borderRadius: 5,
    padding: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& span": {
      marginLeft: 4,
    },
  },
  activeDeals: {
    backgroundColor: "#E8C059",
    borderRadius: 5,
    padding: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& span": {
      marginLeft: 4,
    },
  },
  import: {
    marginLeft: 8,
    backgroundColor: "#F0F0F0",
  },
  addDeal: {
    marginLeft: 8,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: "#011133",
    color: "#fff",
    transition: "200ms all",

    "&:hover": {
      backgroundColor: "#263451",
    },
  },
}));

const TransactAppBar = ({
  closedSum,
  closedLength,
  activeSum,
  activeLength,
}) => {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);

  const handleClickAddDeal = () => {
    setStateApp((stateApp) => ({
      ...stateApp,
      dealDialog: true,
      activeDeal: { cardId: null, laneId: null },
    }));
  };

  return (
    <>
      <AppBar className={classes.root} position="sticky" variant="outlined">
        <div className={classes.right}>
          <h2>DEALS</h2>
        </div>
        <div className={classes.left}>
          <div className={classes.activeDeals}>
            <OfflineBolt />
            <span>
              {activeLength}{" "}
              {activeLength !== 1 ? "ACTIVE DEALS" : "ACTIVE DEAL"} |{" "}
              {activeSum}
            </span>
          </div>
          <div className={classes.closedDeals}>
            <CheckBox />
            <span>
              {closedLength}{" "}
              {closedLength !== 1 ? "CLOSED DEALS" : "CLOSED DEAL"} |{" "}
              {closedSum}
            </span>
          </div>
          {/* <Button className={classes.import} color="default" size="small">
            IMPORT
          </Button> */}
          {/* <Button
            className={classes.addDeal}
            color="primary"
            size="small"
            startIcon={<Add />}
            onClick={handleClickAddDeal}
          >
            Add Deal
          </Button> */}
        </div>
      </AppBar>
    </>
  );
};

export default TransactAppBar;
