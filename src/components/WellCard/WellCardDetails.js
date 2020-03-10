import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { WellCardContext } from "./WellCardContext";
import { MapContext } from "./../Map/MapContext";
import { makeStyles } from "@material-ui/core/styles";

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
//import Table from '@material-ui/core/Table';
//import TableBody from '@material-ui/core/TableBody';
//import TableCell from '@material-ui/core/TableCell';
//import TableRow from '@material-ui/core/TableRow';

//custom components
import WellIcon from "./components/svgIcons/WellIcon";
//import ExpandIcon from './components/svgIcons/ExpandIcon';
import ShrinkIcon from "./components/svgIcons/ShrinkIcon";
import TrackIcon from "./components/svgIcons/TrackIcon";
import ProductionIcon from "./components/svgIcons/ProductionIcon";
import OwnershipIcon from "./components/svgIcons/OwnershipIcon";
import Taps from "./components/Taps";
import CardDetailsMap from "./components/CardDetailsMap";

import QuadProvider from "../Quad/QuadProvider";
import OwnersProvider from "../Owners/OwnersProvider";
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

//import { WellData } from './data/welldata'

const useStyles = makeStyles(theme => ({
  grid: {
    // height: "100%",
    width: "auto",
    // overflowY: "auto",
    // paddingBottom: "64px"
  },
  gridItem: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-around"
  },
  card: {
    width: "100%",
    height: "100%",
    minHeight: "100%",
    background: "#011133",
    borderStyle: "solid",
    borderWidth: "thin",
    borderColor: "#011133"
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
    top: "calc(50% - 23px/2 - 140px)"
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
    top: "calc(50% - 17px/2 - 120px)"
  },
  iconContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1%"
  },
  content: {
    height: "100%",
    backgroundColor: "#fff",
    overflowY: "auto"
  },
  cardAction: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-evenly",
    backgroundColor: "#fff",
    alignItems: "right"
  },

  cardAction2: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-evenly",
    //justifyContent: 'left',
    backgroundColor: "#f9f9f9",
    alignItems: "right"
  },

  icons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  }
}));

export default function WellCardDetails(props) {
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateWellCard, setStateWellCard] = useContext(WellCardContext);
  const [stateMap, setStateMap] = useContext(MapContext);
  const [target, setTarget] = useState(null);
  const classes = useStyles();
  useEffect(() => {
    if (props.target) {
      setTarget(props.target);
    }
  }, [props.target, setTarget]);

  const handleCloseDetails = () => {
    setStateWellCard(state => ({ ...state, openWellDetails: false }));
  };

  const wellInfo = () => (
    <Grid id="vivivi" container spacing={2}>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <QuadProvider />
      </Grid>
      <Grid item xs={12} sm={6} md={8} lg={9}>
        <CardDetailsMap />
      </Grid>
      <Grid item xs={12}>
        <WellProdChartProvider />
      </Grid>
    </Grid>
  );

  return stateApp.selectedWell ? (
    <Card>
      {/* <CardHeader
        classes={{
          title: classes.title,
          subheader: classes.subheader
        }}
        action={
          <div className={classes.icons}>
            <TrackToggleButton
              source={stateApp.user}
              sourceLabel="user"
              sourceSourceId={stateApp.user.id}
              sourceName={stateApp.user.name}
              target={target}
              targetLabel="well"
              targetSourceId={stateApp.selectedWell.id}
              targetName={stateApp.selectedWell.wellName}
            />
            <IconButton
              color="secondary"
              onClick={handleCloseDetails}
              aria-label="shrink"
            >
              <ShrinkIcon viewBox="0 0 64 64" fontSize="small" />
            </IconButton>
          </div>
        }
        title={
          stateApp.selectedWell.wellName ? stateApp.selectedWell.wellName : "--"
        }
        subheader={
          stateApp.selectedWell.operator ? stateApp.selectedWell.operator : "--"
        }
      /> */}

      {/* <div className = {classes.cardcontain}>
        <CardActions
          classes={{
            root: classes.cardAction2
          }}
        >
          


          <div className={classes.iconContainer}>
            <WellIcon htmlColor="black" viewBox="0 0 32 31" fontSize="large" />

            <Typography
              align="center"
              className={classes.text1}
              variant="subtitle2"
            >
              Well Status
            </Typography>
            <Typography
              align="center"
              className={classes.text2}
              variant="caption"
            >
              {stateApp.selectedWell.WellStatus
                ? stateApp.selectedWell.WellStatus.toUpperCase()
                : '--'}
            </Typography>
          </div>

          <div className={classes.iconContainer}>
            <ProductionIcon
              htmlColor="black"
              viewBox="0 0 39 31"
              fontSize="large"
            />
            <Typography
              align="center"
              className={classes.text1}
              variant="subtitle2"
            >
              Last 12 Prod
            </Typography>
            <Typography
              align="center"
              className={classes.text2}
              variant="caption"
            >
              {`${formatBOE(stateApp.selectedWell.LastTwelveMonthBOE)} BOE`}
            </Typography>
          </div>
          <div className={classes.iconContainer}>
            <OwnershipIcon
              htmlColor="black"
              viewBox="0 0 45 31"
              fontSize="large"
            />
            <Typography
              align="center"
              className={classes.text1}
              variant="subtitle2"
            >
              Owners
            </Typography>
            <Typography
              align="center"
              className={classes.text2}
              variant="caption"
            >
              {stateApp.selectedWell.OwnerCount
                ? stateApp.selectedWell.OwnerCount
                : '--'}
            </Typography>
          </div>
          <div className={classes.iconContainer}>
            <Avatar variant="circle" className={classes.avatar}>
              {stateApp.selectedWell.WellBoreProfile
                ? stateApp.selectedWell.WellBoreProfile.substring(0, 1)
                : 'H'}{' '}
            </Avatar>
            <Typography
              align="center"
              className={classes.text1}
              variant="subtitle2"
            >
              Profile
            </Typography>
            <Typography
              align="center"
              className={classes.text2}
              variant="caption"
            >
              {stateApp.selectedWell.WellBoreProfile
                ? stateApp.selectedWell.WellBoreProfile
                : '--'}
            </Typography>
          </div> 
        </CardActions>
        </div>*/}

      <CardContent className={classes.content}>
        <Grid className={classes.grid} container spacing={1}>
          <Grid item className={classes.gridItem}>
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

          <Grid item sm={12}>
            <Taps
              tabLabels={[
                "Well",
                "Owners",
                "Property History",
                "Title",
                "Documents"
              ]}
              tabPanels={[
                wellInfo(),
                <OwnersProvider
                  selectedWell={stateApp.selectedWell}
                  parent="well"
                />,
                <h3>Coming Soon-</h3>,
                <h3>Coming Soon--</h3>,
                <h3>Coming Soon---</h3>
              ]}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  ) : null;
}
