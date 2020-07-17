import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { WellCardContext } from "./WellCardContext";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import { purple } from "@material-ui/core/colors";

//material-ui components
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import Container from "@material-ui/core/Container";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

//custom components
import WellIcon from "./components/svgIcons/WellIcon";
import ShrinkIcon from "./components/svgIcons/ShrinkIcon";
import TrackIcon from "./components/svgIcons/TrackIcon";
import ProductionIcon from "./components/svgIcons/ProductionIcon";
import OwnershipIcon from "./components/svgIcons/OwnershipIcon";
import Taps from "../Shared/Taps";
import CardDetailsMap from "./components/CardDetailsMap";
import TableSummary from "./components/TableSummary";

import QuadProvider from "../Quad/QuadProvider";
import M1nTable from "../Shared/M1nTable/M1nTable";
import WellProdChartProvider from "../WellProdChart/WellProdChartProvider";
import TrackToggleButton from "../Shared/TrackToggleButton";
import WellStatusCard from "../Shared/WellStatusCard";
import CompletionDateCard from "../Shared/CompletionDateCard";
import FirstProdDateCard from "../Shared/FirstProdDateCard";
import Last12StatusCard from "../Shared/Last12StatusCard";
import OwnerNumCard from "../Shared/OwnerNumCard";
import PermitDateCard from "../Shared/PermitDateCard";
import ProfileCard from "../Shared/ProfileCard";
import WellTypeCard from "../Shared/WellTypeCard";
import SpudDateCard from "../Shared/SpudDateCard";
import WellApiCard from "../Shared/WellApiCard";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

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
    background: "#f6f6f6",
    position: "relative",
    top: "0",
    left: "0",
    paddingTop: "7px",
    borderBottom: "1px solid rgb(190, 190, 190)",
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
}));

export default function WellCardDetails(props) {
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateWellCard, setStateWellCard] = useContext(WellCardContext);

  const [target, setTarget] = useState(null);
  const classes = useStyles();
  useEffect(() => {
    if (props.target) {
      setTarget(props.target);
    }
  }, [props.target, setTarget]);

  const handleChangeOil = (event) => {
    setStateWellCard({
      ...stateWellCard,
      chartToggleOil: event.target.checked,
    });
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

  const wellInfo = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <QuadProvider />
      </Grid>
      <Grid item xs={12} sm={9}>
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
              label="Oil"
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
              label="Gas"
            />
            <FormControlLabel
              control={
                <WaterSwitch
                  checked={stateWellCard.chartToggleWater}
                  onChange={handleChangeWater}
                  name="checkedWater"
                />
              }
              label="Water"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={stateWellCard.chartToggleMultiAxis}
                  onChange={handleChangeMultiAxis}
                  color="primary"
                />
              }
              label="Multi-Axes"
            />

            <FormControlLabel disabled control={<Switch />} label="Log Scale" />
          </div>
        </Grid>
        <Grid item xs={12}>
          <WellProdChartProvider />
        </Grid>
      </Grid>
    </Grid>
  );

  return stateApp.selectedWell ? (
    <React.Fragment>
      <Grid item sm={12} className={classes.gridItemGrey}>
        <WellApiCard />
        <WellTypeCard />
        <WellStatusCard />
        <Last12StatusCard />
        <OwnerNumCard />
        <ProfileCard />
        <PermitDateCard />
        <SpudDateCard />
        <CompletionDateCard />
        <FirstProdDateCard />
      </Grid>
      <Grid item sm={12} container className={classes.gridWidthScroll}>
        <Grid item sm={12} container style={{ height: "482px" }}>
          <Grid item sm={6} className={classes.gridItem}>
            <TableSummary summary={props.summary} />
          </Grid>

          <Grid item sm={6} className={classes.gridItem}>
            <CardDetailsMap />
          </Grid>
        </Grid>
        <Grid item sm={12}>
          <Taps
            tabLabels={[
              "Well",
              "Owners",
              // "Property History",
              // "Title",
              // "Documents",
            ]}
            tabPanels={[
              <Paper elevation={3} style={{ padding: "10px" }}>
                {wellInfo()}
              </Paper>,
              <M1nTable
                parent="OwnersPerWell"
                selectedWell={stateApp.selectedWell}
              />,
              // <h3>Coming Soon-</h3>,
              // <h3>Coming Soon--</h3>,
              // <h3>Coming Soon---</h3>,
            ]}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  ) : null;
}
