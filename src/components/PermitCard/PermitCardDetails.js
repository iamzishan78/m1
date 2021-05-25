import React, { useContext, useState, useRef, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { PermitCardContext } from "./PermitCardContext";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";

//material-ui components
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

//custom components
import Taps from "../Shared/Taps";
import CardDetailsMap from "./components/CardDetailsMap";
import TableSummary from "./components/TableSummary";

import QuadProvider from "../Quad/QuadProvider";
import M1nTable from "../Shared/M1nTable/M1nTable";
import WellStatusCard from "../Shared/WellStatusCard";
import CompletionDateCard from "../Shared/CompletionDateCard";
import FirstProdDateCard from "../Shared/FirstProdDateCard";
import Last12StatusCard from "../Shared/Last12StatusCard";
import OwnerNumCard from "../Shared/OwnerNumCard";
import PermitDateCard from "../Shared/PermitDateCard";
import ProfileCard from "../Shared/ProfileCard";
import WellTypeCard from "../Shared/WellTypeCard";
import SpudDateCard from "../Shared/SpudDateCard";
import PlugDateCard from "../Shared/PlugDateCard";
import WellApiCard from "../Shared/WellApiCard";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import CompletionsContainer from "./components/Completions";
import SimulationContainer from "./components/Stimulation";
import FormationContainer from "./components/Formation";

import { useLazyQuery } from "@apollo/client";
import { PERMITDETAILQUERY } from "../../graphQL/useQueryRecentPermitDetails";
import moment from 'moment';
import { Box, IconButton } from "@material-ui/core";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
const useStyles = makeStyles((theme) => ({
  grid: {
    // height: "100%",
    width: "auto",
    // overflowY: "auto",
    // paddingBottom: "64px"
  },
  gridItem: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-around",
    height: "100%",
    // paddingBottom: "10px",
  },
  gridItemGrey: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-around",
    // background: "#f6f6f6",
    position: "relative",
    top: "0",
    left: "0",
    paddingTop: "7px",
    borderBottom: "1px solid rgb(190, 190, 190)",
    background: "#ebebeb",
  },
  gridWidthScroll: {
    maxHeight: "calc(100% - 88px)",
    overflow: "auto",
  },
  card: {
    width: "100%",
    height: "100%",
    minHeight: "100%",
    background: "#011133",
    borderStyle: "solid",
    borderWidth: "thin",
    borderColor: "#011133",
  },
  title: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "15px",
    lineHeight: "22px",
    color: "#FFFFFF",
    textTransform: "uppercase",
    position: "relative",
    height: "23px",
    left: "0.45%",
    right: "39.32%",
    top: "calc(50% - 23px/2 - 140px)",
  },
  subheader: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 300,
    fontSize: "11px",
    lineHeight: "16px",
    color: "#FFFFFF",
    position: "relative",
    height: "17px",
    left: "0.45%",
    right: "58.31%",
    top: "calc(50% - 17px/2 - 120px)",
  },
  iconContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1%",
  },
  content: {
    // height: "93vh",
    backgroundColor: "#fff",
    //overflowY: "auto",
    padding: "16px",
  },
  cardAction: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-evenly",
    backgroundColor: "#fff",
    alignItems: "right",
  },

  cardAction2: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-evenly",
    //justifyContent: 'left',
    backgroundColor: "#f9f9f9",
    alignItems: "right",
  },

  icons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  toggle: {
    // float: "right",
    // position: 'relative',
    // right: '10px',
    paddingBottom: "5px",
    paddingLeft: "25px",
  },
  subContent: {
    "& div": {
      "&>.MuiPaper-root": {
        "&>:nth-child(3)": { 
          height: "calc(100vh - 56vh ) !important", 
       },
     },
    },
  },
  subContent2: {
    "& div": {
      "&>.MuiPaper-root": {
        "&>:nth-child(3)": { 
          height: "calc(100vh - 56vh + 482px) !important", 
       },
     },
    },
  },
}));

const tableGridStyle = makeStyles({
  table: {
    minHeight: "100px !important",
  },
  tableContainer: {
    overflowX: "auto",
    marginBottom: 20,
    background: "white",
  },
  rowName: {
    fontWeight: "bold",
    background: "#ebebeb",
    minWidth: 150
  },
  columnComments: {
    fontWeight: "bold",
    background: "#ebebeb",
    minWidth: 450
  },
  tableRow: {
    "& > td": {
      padding: "4px 15px !important",
      border: "2px solid #e3e3e3",
    },
  },
});

export default function PermitCardDetails(props) {
  const classes = useStyles();
  const table_classes = tableGridStyle();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [tabValue, setTabValue] = React.useState(0);
  const [target, setTarget] = useState(null);
  const [chartDisplay, setChartDisplay] = useState([]);
  const [showSummary, setShowSummary] = useState(true)
  let temp_state = useRef(null);

  return stateApp.selectedPermit ? (
    <React.Fragment >
      <Grid item sm={12} className={classes.gridItemGrey}>
        <WellTypeCard />
        <WellStatusCard />
        <Last12StatusCard />
        <OwnerNumCard />
        <ProfileCard />
        <PermitDateCard />
        <SpudDateCard />
        <CompletionDateCard />
        <FirstProdDateCard />
        <PlugDateCard />
        <Box>
          <IconButton
            onClick={() => setShowSummary(!showSummary)}
            aria-label="delete" color="primary">
            {
              showSummary ? <KeyboardArrowUpIcon fontSize="large" /> : <KeyboardArrowDownIcon fontSize="large" />
            }

          </IconButton>
        </Box>
      </Grid>
      <Grid item sm={12} container className={classes.gridWidthScroll}>
        {showSummary &&
          <Grid item sm={12} container style={{ height: "482px" }}>
            <Grid container spacing={2} style={{ marginRight: 0, marginLeft: 0 }}>
              <Grid item sm={8} >
                <TableSummary summary={props.summary} />
              </Grid>
              <Grid item xs={4}>
                <QuadProvider />
              </Grid>
            </Grid>
          </Grid>
        }
      </Grid>
    </React.Fragment>
  ) : null;
}
