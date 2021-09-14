import React, { useState, useEffect } from "react";
import { Typography, AppBar, Button, ButtonGroup, Tooltip, IconButton } from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import Add from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import { setFlowState } from "actions";
import Pipelines from "./Pipelines";
import PipelineCustomDialog from "./PipelineCustomizeDialog";
import { useSelector, useDispatch } from "react-redux";
import vf_currency from "../../Shared/valueformatters/vf_currency.js";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "50px",
    maxHeight: "72px",
    backgroundColor: "#fff",
    padding: "0 16px 10px",
  },
  top: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    // justifyContent: "flex-end",
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
      marginright: 2,
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
  newDealAction: {
    margin: "0px 15px",
    fontWeight: "600",
    backgroundColor: "rgba(1, 17, 51, 1)",
    color: "#fff",
    border: "1px solid #B3B3B3",
    paddingLeft: 10,
    paddingRight: 20,
    "&:hover": {
      backgroundColor: "#263451",
      color: "#fff",
    },
  },
  settingsButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    float: "right",
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

const TransactAppBar = ({ dealFilter, setDealFilter, setStateApp }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { pipeToShow, selectedPipe } = useSelector(({ Flow }) => Flow);
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

  const handleClickAddDeal = () => {
    setStateApp((stateApp) => ({
      ...stateApp,
      dealDialog: true,
      activeDeal: { cardId: null, laneId: null },
    }));
  };

  return (
    <>
      <AppBar elevation={1} className={classes.root} position="static" variant="outlined">
        <div className={classes.top} style={{ marginTop: 15 }}>
          <div className={classes.settingsButton}>
            {selectedPipe && (
              <Typography style={{ marginLeft: 10 }} variant="h5" color="textPrimary" fontWeight="fontWeightBold">
                {selectedPipe.name}
              </Typography>
            )}

            <Tooltip title={"Flowline Actions"}>
              <IconButton
                disabled={!selectedPipe}
                size="medium"
                style={{ marginLeft: 10, marginRight: 10 }}
                onClick={() => {
                  dispatch(
                    setFlowState({
                      openPipeDialog: true,
                    })
                  );
                }}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Tooltip>
          </div>

          <PipelineCustomDialog />
          <div className={classes.left}>
            <div>
              <Button onClick={handleClickAddDeal} color="secondary" className={classes.newDealAction} startIcon={<Add />}>
                New Deal
              </Button>
            </div>
            <ButtonGroup style={{ minHeight: 36 }}>
              <Button
                size="small"
                className={`${classes.filterToggleBtn} ${dealFilter === "all" && classes.activeBtn}`}
                onClick={() => setDealFilter("all")}
              >
                ALL
              </Button>
              <Button
                size="small"
                className={`${classes.filterToggleBtn} ${dealFilter === "open" && classes.activeBtn}`}
                onClick={() => setDealFilter("open")}
              >
                OPEN
              </Button>
              <Button
                size="small"
                className={`${classes.filterToggleBtn} ${dealFilter === "won" && classes.activeBtn}`}
                onClick={() => setDealFilter("won")}
              >
                WON
              </Button>

              <Button
                size="small"
                className={`${classes.filterToggleBtn} ${dealFilter === "lost" && classes.activeBtn}`}
                onClick={() => setDealFilter("lost")}
              >
                LOST
              </Button>
            </ButtonGroup>
          </div>
        </div>
        <div className={classes.top} style={{ marginBottom: 4, marginTop: 2 }}></div>
      </AppBar>
    </>
  );
};

export default TransactAppBar;
