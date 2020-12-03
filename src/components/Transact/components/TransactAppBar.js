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
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import FormHelperText from "@material-ui/core/FormHelperText";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../../AppContext";
import Pipelines from "./Pipelines";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "50px",
    backgroundColor: "#fff",
    padding: "0 16px 0px",
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
      margin: "0 35px 0 0",
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
    padding: 9,
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#011133",
    color: "#fff",
    transition: "200ms all",

    "&:hover": {
      backgroundColor: "#263451",
    },
  },
  pipelineControl: {
    minWidth: 180,
  },
}));

const TransactAppBar = ({
  wonLength,
  wonSum,
  openLength,
  openSum,
  dealDisplayType,
  setDealDisplayType,
  dealFilter,
  setDealFilter,
  pipelines,
  setIndex,
  index,
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
        <div className={classes.top} style={{ marginTop: 15 }}>
          <div className={classes.right}>
            <h1>DEAL FLOW</h1>
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
                {openLength} {openLength !== 1 ? "OPEN DEALS" : "OPEN DEAL"} |{" "}
                {openSum}
              </span>
            </div>
            <div className={classes.closedDeals}>
              <CheckBox />
              <span>
                {wonLength} {wonLength !== 1 ? "WON DEALS" : "WON DEAL"} |{" "}
                {wonSum}
              </span>
            </div>
            {/* <Button className={classes.import} color="default" size="small">
              IMPORT
            </Button> */}
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
        <div className={classes.top} style={{ marginBottom: 16 }}>
          {/* <div className={classes.right}> */}
          <div className={classes.bottomLeft}>
            <ButtonGroup style={{ minHeight: 32 }}>
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
          </div>
          <div className={classes.bottomRight}>
            <Pipelines />
          </div>
          {/* </div> */}
        </div>
      </AppBar>
    </>
  );
};

export default TransactAppBar;
