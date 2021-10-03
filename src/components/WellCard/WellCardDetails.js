import React, { useContext, useState, useRef, useEffect } from "react";

// contexts 
import { AppContext } from "../../AppContext";
import { WellCardContext } from "./WellCardContext";

// styling 
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";

//material-ui components
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

//custom components
import Taps from "../Shared/Taps";
import TableSummary from "./components/TableSummary";

import QuadProvider from "../Quad/QuadProvider";
import M1nTable from "../Shared/M1nTable/M1nTable";
import WellProdChartProvider from "../WellProdChart/WellProdChartProvider";
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
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import CompletionsContainer from "./components/Completions";
import SimulationContainer from "./components/Stimulation";
import FormationContainer from "./components/Formation";
import PermitsContainer from "./components/WellPermits";

import { useLazyQuery } from "@apollo/client";
import { PRODUCTIONDETAILQUERY } from "../../graphQL/useQueryProductionDetail";
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
    "&::-webkit-scrollbar": {
      height: "0.4em",
    },
    "&::-webkit-scrollbar-track": {
      "-webkitBoxShadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#929292",
      borderRadius: 5,
    },
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

    "&::-webkit-scrollbar": {
      width: "0.75em",
      height: "0.75em",
    },
    // "&:hover::-webkit-scrollbar": {
    //     width: "1.0em",
    // },
    // "&::-webkit-scrollbar-track": {
    //     "-webkitBoxShadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    // },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#929292",
      borderRadius: 10,
    },

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

export default function WellCardDetails(props) {
  const classes = useStyles();
  const table_classes = tableGridStyle();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateWellCard, setStateWellCard] = useContext(WellCardContext);
  const [tabValue, setTabValue] = React.useState(0);
  const [production, setProduction] = useState(null);
  const [target, setTarget] = useState(null);
  const [chartDisplay, setChartDisplay] = useState([]);
  const [showSummary, setShowSummary] = useState(true)
  let temp_state = useRef(null);
  const [
    getExternalProductionDetail,
    { loading: loadingProductionDetail, data: externalProductionDetail },
  ] = useLazyQuery(PRODUCTIONDETAILQUERY);

  useEffect(() => {
    getExternalProductionDetail({
      variables: { id: stateApp.selectedWell.api, pageSize: "1000" },
    });
  }, []);

  useEffect(() => {
    if (externalProductionDetail) {
      let temp = [];
      externalProductionDetail.externalProductionDetail.forEach(element => {
        let temp_row = { ...element };
        temp_row.ReportDate = moment.utc(temp_row.ReportDate).format("MM/YYYY");
        temp.push(temp_row)
      });
      setProduction(temp);
      setStateWellCard((state) => {
        return {
        ...state,
        wellProdHistory: temp,
      }});
      if (props.target) {
        setTarget(props.target);
      }
    } else {
    }
  }, [externalProductionDetail, props.target, setTarget]);

  const handleChangeOil = (event) => {
    setStateWellCard({
      ...stateWellCard,
      chartToggleOil: event.target.checked,
    });
  };

  const handleTabValueChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangeGas = (event) => {
    setStateWellCard({
      ...stateWellCard,
      chartToggleGas: event.target.checked,
    });
  };

  const handleChangeWater = (event) => {
    setStateWellCard({
      ...stateWellCard,
      chartToggleWater: event.target.checked,
    });
  };

  const handleChangeMultiAxis = (event) => {
    setStateWellCard({
      ...stateWellCard,
      chartToggleMultiAxis: event.target.checked,
    });
  };

  const OilSwitch = withStyles({
    switchBase: {
      color: "#81c784",
      "&$checked": {
        color: "#81c784",
      },
      "&$checked + $track": {
        backgroundColor: "#81c784",
      },
    },
    checked: {},
    track: {},
  })(Switch);

  const GasSwitch = withStyles({
    switchBase: {
      color: "#e57373",
      "&$checked": {
        color: "#e57373",
      },
      "&$checked + $track": {
        backgroundColor: "#e57373",
      },
    },
    checked: {},
    track: {},
  })(Switch);

  const WaterSwitch = withStyles({
    switchBase: {
      color: "#64b5f6",
      "&$checked": {
        color: "#64b5f6",
      },
      "&$checked + $track": {
        backgroundColor: "#64b5f6",
      },
    },
    checked: {},
    track: {},
  })(Switch);


  return stateApp.selectedWell ? (
    <React.Fragment >
      <Grid item sm={12} className={classes.gridItemGrey}>
            
        <WellTypeCard summary={props.summary}/>

        <WellStatusCard summary={props.summary}/>
        {/* <Last12StatusCard summary={props.summary}/> */}
        <OwnerNumCard summary={props.summary}/>
        <ProfileCard summary={props.summary}/>
        <PermitDateCard summary={props.summary}/>
        <SpudDateCard summary={props.summary}/>
        <CompletionDateCard summary={props.summary}/>
        <FirstProdDateCard summary={props.summary}/>
        <PlugDateCard summary={props.summary}/>
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
        <Grid item sm={12}>
          <Taps
            tabLabels={[
              "Production",
              "Interest Owners",
              // "Contacts",
              "Completion",
              "Stimulation",
              "Formation",
              "Permits",
            ]}
            tabPanels={[
              <Paper elevation={3} style={{ padding: "10px" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <div className={classes.toggle}>
                      <FormControlLabel
                        control={
                          <OilSwitch
                            checked={stateWellCard.chartToggleOil}
                            onChange={handleChangeOil}
                          //name="chartToggleOil"
                          />
                        }
                        label="Allocated Oil"
                      />
                      <FormControlLabel
                        control={
                          <GasSwitch
                            checked={stateWellCard.chartToggleGas}
                            onChange={handleChangeGas}
                            name="checkedGas"
                            color="secondary"
                          // color="#e57373"//invalid color
                          />
                        }
                        label="Allocated Gas"
                      />
                      <FormControlLabel
                        control={
                          <WaterSwitch
                            checked={stateWellCard.chartToggleWater}
                            onChange={handleChangeWater}
                            name="checkedWater"
                          />
                        }
                        label="Allocated Water"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={stateWellCard.chartToggleMultiAxis}
                            onChange={handleChangeMultiAxis}
                            color="primary"
                          />}
                        label="Multi-Axes"
                      />
                      {/* --hide for now until we fix the data issues */}
                      {/* <FormControlLabel disabled control={<Switch />} label="Log Scale" /> */}
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <WellProdChartProvider />
                  </Grid>
                  <Grid item xs={12}>
                    {
                      production != null &&
                      <div className={showSummary ? classes.subContent : classes.subContent2}>
                        <M1nTable
                          dense
                          parent="production_WellDetails"
                          productionDetails={production}
                        />
                      </div>
                    }
                  </Grid>
                </Grid>
              </Paper>
              ,
              <Paper elevation={3} style={{ padding: "10px" }}>
                <div className={showSummary ? classes.subContent : classes.subContent2}>
                  <M1nTable
                    parent="OwnersPerWell"
                    selectedWell={stateApp.selectedWell}  // MIGRATE TO WELL CARD CONTEXT
                  />
                </div>
              </Paper>,

              <CompletionsContainer showSummary={showSummary} />,
              <SimulationContainer showSummary={showSummary} />,
              <FormationContainer showSummary={showSummary} />,
              <PermitsContainer showSummary={showSummary} />,
              
            ]}
            openTabIdex={stateApp.wellDetailCardTabIndex}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  ) : null;
}
