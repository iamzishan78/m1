import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import OfflineBolt from "@material-ui/icons/OfflineBolt";
import NotInterested from "@material-ui/icons/NotInterested";
import CheckBox from "@material-ui/icons/CheckBox";
import { makeStyles } from "@material-ui/core/styles";
import Pipelines from "./Pipelines";
import { useSelector } from "react-redux";
import vf_currency from "../../Shared/valueformatters/vf_currency.js";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "50px",
    backgroundColor: "#fff",
    padding: "0 16px 10px",
  },
  top: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottomRight: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: "10px",
    // padding: 20,
  },
  bottomLeft: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: "4px",
    // padding: "0 0 20 0",
  },
  right: {
    display: "flex",
    alignItems: "center",

    "& h1": {
      color: "#0DBBEA",
      margin: "0 10px 0 0",
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
  filterToggleBtn: {
    borderRadius: 5,
    border: "1px solid #d9d9d9",
    color: "#333",
    transition: "200ms all",
    backgroundColor: "#f5f5f5",
    width: "100%",
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
    minWidth: 220,
    padding: 7.8,
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
    minWidth: 220,
    padding: 7.8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& span": {
      marginLeft: 4,
    },
  },
  lostDeals: {
    backgroundColor: "#011133",
    borderRadius: 5,
    minWidth: 220,
    padding: 7.8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& span": {
      marginLeft: 4,
    },
    marginLeft: 8,
  },
  import: {
    marginLeft: 8,
    backgroundColor: "#F0F0F0",
  },
  addDeal: {
    marginLeft: 8,
    padding: 9,
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& span": {
      marginleft: 2,
      marginright: 4,
    },
    backgroundColor: "#011133",
    color: "#fff",
    transition: "200ms all",

    "&:hover": {
      backgroundColor: "#263451",
    },
  },
  pipelineControl: {
    minWidth: 200,
    marginBottom: 2,
    borderRadius: 5,
  },
}));

const sumDeals = (lanes, status) => {
  let sumAmount = 0;
  let sumCount = 0;

  lanes.forEach((deal) => {
    deal.cards.forEach((card) => {
      if (card.metadata.status === status && !card.metadata.IsDeleted) {
        if (card.label && !isNaN(card.label)) sumAmount += card.label;
        // parseFloat(card.label.split("$").join("").split(",").join(""));
        sumCount++;
      }
    });
  });
  return { count: sumCount, amount: vf_currency(sumAmount) };
};

const TransactAppBar = ({ dealFilter, setDealFilter }) => {
  const classes = useStyles();
  const { pipeToShow } = useSelector(({ Flow }) => Flow);
  const [openDeals, setOpenDeals] = useState({ count: 0, amount: "$0" });
  const [wonDeals, setWonDeals] = useState({ count: 0, amount: "$0" });
  const [lostDeals, setLostDeals] = useState({ count: 0, amount: "$0" });

  useEffect(() => {
    if (pipeToShow?.lanes) {
      setOpenDeals(sumDeals(pipeToShow.lanes, "open"));
      setWonDeals(sumDeals(pipeToShow.lanes, "won"));
      setLostDeals(sumDeals(pipeToShow.lanes, "lost"));
    }
  }, [pipeToShow]);

  return (
    <>
      <AppBar
        elevation={1}
        className={classes.root}
        position="static"
        variant="outlined"
      >
        <div className={classes.top} style={{ marginTop: 15 }}>
          <Pipelines />

          <div className={classes.right}>
            <div className={classes.activeDeals}>
              <OfflineBolt />
              <span>
                {openDeals.count}{" "}
                {openDeals.count !== 1 ? "OPEN DEALS" : "OPEN DEAL"} |{" "}
                {openDeals.amount}
              </span>
            </div>
            <div className={classes.closedDeals}>
              <CheckBox />
              <span>
                {wonDeals.count}{" "}
                {wonDeals.count !== 1 ? "WON DEALS" : "WON DEAL"} |{" "}
                {wonDeals.amount}
              </span>
            </div>
            <div className={classes.lostDeals}>
              <NotInterested />
              <span>
                {lostDeals.count}{" "}
                {lostDeals.count !== 1 ? "LOST DEALS" : "LOST DEAL"} |{" "}
                {lostDeals.amount}
              </span>
            </div>
          </div>

          <div className={classes.left}>
            <ButtonGroup style={{ minHeight: 36 }}>
              <Button
                size="small"
                className={`${classes.filterToggleBtn} ${dealFilter === "all" && classes.activeBtn
                  }`}
                onClick={() => setDealFilter("all")}
              >
                ALL
              </Button>
              <Button
                size="small"
                className={`${classes.filterToggleBtn} ${dealFilter === "open" && classes.activeBtn
                  }`}
                onClick={() => setDealFilter("open")}
              >
                OPEN
              </Button>
              <Button
                size="small"
                className={`${classes.filterToggleBtn} ${dealFilter === "won" && classes.activeBtn
                  }`}
                onClick={() => setDealFilter("won")}
              >
                Won
              </Button>

              <Button
                size="small"
                className={`${classes.filterToggleBtn} ${dealFilter === "lost" && classes.activeBtn
                  }`}
                onClick={() => setDealFilter("lost")}
              >
                Lost
              </Button>
            </ButtonGroup>
          </div>
        </div>
        <div
          className={classes.top}
          style={{ marginBottom: 4, marginTop: 2 }}
        ></div>
      </AppBar>
    </>
  );
};

export default TransactAppBar;
