import React, { useContext } from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Add from "@material-ui/icons/Add";
import List from "@material-ui/icons/List";
import GridOn from "@material-ui/icons/GridOn";
import OfflineBolt from "@material-ui/icons/OfflineBolt";
import CheckBox from "@material-ui/icons/CheckBox";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../../AppContext";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "64px",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
  },
  right: {
    display: "flex",
    alignItems: "center",

    "& h4": {
      color: "#0DBBEA",
      marginRight: 16,
    },
  },
  toggleBtn: {
    borderRadius: 5,
    border: "1px solid #1CB6DA",
    color: "#1CB6DA",
    transition: "200ms all",
    "&:hover": {
      backgroundColor: "#1CB6DA44",
    },
  },
  activeBtn: {
    borderRadius: 5,
    border: "1px solid #1CB6DA",
    backgroundColor: "#1CB6DA",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#1CB6DAdd",
    },
  },
  left: {
    display: "flex",
    alignItems: "center",
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
  dealDisplayType,
  setDealDisplayType,
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
      <AppBar
        elevation={1}
        className={classes.root}
        position="static"
        variant="outlined"
      >
        <div className={classes.right}>
          <h4>DEALS</h4>
          <ButtonGroup>
            <IconButton
              size="small"
              className={`${classes.toggleBtn} ${
                dealDisplayType === "table" && classes.activeBtn
              }`}
              onClick={() => setDealDisplayType("table")}
            >
              <List />
            </IconButton>
            <IconButton
              size="small"
              className={`${classes.toggleBtn} ${
                dealDisplayType === "board" && classes.activeBtn
              }`}
              onClick={() => setDealDisplayType("board")}
            >
              <GridOn />
            </IconButton>
          </ButtonGroup>
        </div>
        <div className={classes.left}>
          <div className={classes.activeDeals}>
            <OfflineBolt />
            <span>
              {activeLength}{" "}
              {activeLength !== 1 ? "OPEN DEALS" : "OPEN DEAL"} |{" "}
              {activeSum}
            </span>
          </div>
          <div className={classes.closedDeals}>
            <CheckBox />
            <span>
              {closedLength}{" "}
              {closedLength !== 1 ? "WON DEALS" : "WON DEAL"} |{" "}
              {closedSum}
            </span>
          </div>
          <Button className={classes.import} color="default" size="small">
            IMPORT
          </Button>
          <Button
            className={classes.addDeal}
            color="primary"
            size="small"
            startIcon={<Add />}
            onClick={handleClickAddDeal}
          >
            Add Deal
          </Button>
        </div>
      </AppBar>
    </>
  );
};

export default TransactAppBar;
