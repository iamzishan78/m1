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
    minWidth: 180,
    marginBottom: 2,
    borderRadius: 5,
  },
}));

let formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const sumDeals = (lanes, status) => {
  let sumAmount = 0;
  let sumCount = 0;

  lanes.forEach((deal) => {
    deal.cards.forEach((card) => {
      if (card.metadata.status === status && !card.metadata.IsDeleted) {
        if (card.label)
          sumAmount += parseFloat(
            card.label.split("$").join("").split(",").join("")
          );
        sumCount++;
      }
    });
  });
  const formatted = formatter.format(sumAmount);
  return { count: sumCount, amount: formatted.slice(0, formatted.length - 3) };
};

const TransactAppBar = ({
  // wonLength,
  // wonSum,
  // openLength,
  // openSum,
  dealFilter,
  setDealFilter,
}) => {
  const classes = useStyles();
  const { pipeToShow } = useSelector(({ Flow }) => Flow);
  const [openDeals, setOpenDeals] = useState({ count: 0, amount: "$0" });
  const [wonDeals, setWonDeals] = useState({ count: 0, amount: "$0" });
  const [lostDeals, setLostDeals] = useState({ count: 0, amount: "$0" });

  useEffect(() => {
    if (pipeToShow?.lanes) {
      console.log(pipeToShow.lanes)
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
          <div className={classes.right}>
            {/* <h1>DEAL FLOW</h1> */}

            <ButtonGroup style={{ minHeight: 36 }}>
              <Button
                size="small"
                className={`${classes.filterToggleBtn} ${
                  dealFilter === "all" && classes.activeBtn
                }`}
                onClick={() => setDealFilter("all")}
              >
                ALL
              </Button>
              <Button
                size="small"
                className={`${classes.filterToggleBtn} ${
                  dealFilter === "open" && classes.activeBtn
                }`}
                onClick={() => setDealFilter("open")}
              >
                OPEN
              </Button>
              <Button
                size="small"
                className={`${classes.filterToggleBtn} ${
                  dealFilter === "won" && classes.activeBtn
                }`}
                onClick={() => setDealFilter("won")}
              >
                Won
              </Button>

              <Button
                size="small"
                className={`${classes.filterToggleBtn} ${
                  dealFilter === "lost" && classes.activeBtn
                }`}
                onClick={() => setDealFilter("lost")}
              >
                Lost
              </Button>

              {/* <Button
                size="small"
                className={`${classes.filterToggleBtn} ${
                  dealFilter === "deleted" && classes.activeBtn
                }`}
                onClick={() => setDealFilter("deleted")}
              >
                Deleted
              </Button> */}
            </ButtonGroup>
          </div>
          <div className={classes.left}>
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
            {/* <Button className={classes.import} color="default" size="small">
              IMPORT
            </Button> */}
            <Pipelines />
          </div>
        </div>
        {/* <div className={classes.bottom}>
          <ButtonGroup>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${
                dealFilter === "all" && classes.activeBtn
              }`}
              onClick={() => setDealFilter("all")}
            >
              ALL
            </Button>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${
                dealFilter === "open" && classes.activeBtn
              }`}
              onClick={() => setDealFilter("open")}
            >
              OPEN
            </Button>
            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${
                dealFilter === "won" && classes.activeBtn
              }`}
              onClick={() => setDealFilter("won")}
            >
              Won
            </Button>

                <Button
                  size="small"
                  className={`${classes.filterToggleBtn} ${
                    dealFilter === "lost" && classes.activeBtn
                  }`}
                  onClick={() => setDealFilter("lost")}
                >
                  Lost
                </Button>

            <Button
              size="small"
              className={`${classes.filterToggleBtn} ${
                dealFilter === "deleted" && classes.activeBtn
              }`}
              onClick={() => setDealFilter("deleted")}
            >
              Deleted
            </Button>
          </ButtonGroup>

          <FormControl variant="outlined" className={classes.pipelineControl}>
            <InputLabel id="pipeline-select-label">Pipeline</InputLabel>
            <Select
              margin="dense"
              labelId="pipeline-select-label"
              id="pipeline-select"
              value={index}
              label="Pipeline"
              onChange={(e) => {
                if (!["add", "edit"].includes(e.target.value)) {
                  // Later on change to work with id's instead on index cuz drag and drop
                  setIndex(parseInt(e.target.value));
                }
              }}
            >
              {pipelines.map((pipeline, i) => (
                <MenuItem key={pipeline.id} value={pipeline.index}>
                  {pipeline.name || `Pipeline ${i + 1}`}
                </MenuItem>
              ))}
              <Divider />
              <MenuItem value="add">
                <AddIcon
                  style={{
                    marginRight: 8,
                  }}
                />{" "}
                New Pipeline
              </MenuItem>
              <MenuItem value="edit">
                <EditIcon
                  style={{
                    marginRight: 8,
                  }}
                />{" "}
                Edit Pipeline
              </MenuItem>
            </Select>
          </FormControl> */}
        <div className={classes.top} style={{ marginBottom: 4, marginTop: 2 }}>
          {/* <div className={classes.right}> */}
          {/* <div className={classes.bottomLeft}>
          </div> */}
          {/* <div className={classes.bottomRight}>
            
          </div> */}
          {/* </div> */}
        </div>
      </AppBar>
    </>
  );
};

export default TransactAppBar;
