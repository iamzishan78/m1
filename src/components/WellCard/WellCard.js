import React, { useEffect, useContext, useState } from "react";
import { AppContext } from "../../AppContext";
import { WellCardContext } from "./WellCardContext";
import { ExpandableCardContext } from "../ExpandableCard/ExpandableCardContext";

//material-ui components
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import CloseIcon from "@material-ui/icons/Close";
import MyLocationIcon from "@material-ui/icons/MyLocation";
//custom components
import WellIcon from "./components/svgIcons/WellIcon";
import ExpandIcon from "./components/svgIcons/ExpandIcon";
//import ShrinkIcon from './components/svgIcons/ShrinkIcon';
//import TrackIcon from './components/svgIcons/TrackIcon'
import ProductionIcon from "./components/svgIcons/ProductionIcon";
import OwnershipIcon from "./components/svgIcons/OwnershipIcon";
import Link from "@material-ui/core/Link";
import moment from "moment";

import WellCardDetails from "./WellCardDetails";
//import { WellData } from './data/welldata'

import TrackToggleButton from "../Shared/TrackToggleButton";

import useQueryWell from "../../graphQL/useQueryWell";
import { useLazyQuery } from "@apollo/react-hooks";
// import { VERTEXEDGESQUERY } from "../../graphQL/useQueryVertexEdges";/////////////////
import { WELLSUMMARYDETAILQUERY } from "../../graphQL/useQueryWellSummaryDetail";

const useStyles = makeStyles((theme) => ({
  card: {
    // overflowY: "auto !important",
    borderStyle: "none",
    height: "100%",
  },
  title: {
    fontFamily: "Poppins",
    color: "#FFFFFF",
    fontSize: "15px",
    /* fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '15px',
    lineHeight: '22px',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    position: 'relative',
    height: '23px',
    top:'2px',
    left:"5px" */
    //left: '7.46%',
    //right: '39.32%',
    //top: 'calc(50% - 23px/2 - 140px)'
  },
  subheader: {
    fontFamily: "Poppins",
    color: "#FFFFFF",
    fontSize: "11px",
    /*fontStyle: 'normal',
    fontWeight: 300,
    fontSize: '11px',
    lineHeight: '16px',
    color: '#FFFFFF',
    position: 'relative',
    height: '17px',
    top:'8px',
    left:"5px"
     left: '7.46%',
    right: '58.31%',
    top: 'calc(50% - 17px/2 - 120px)' */
  },

  avatar: {
    backgroundColor: "black",
    color: "white",
    width: "38px",
    height: "38px",
    margin: "0px",
  },
  content: {
    backgroundColor: "#efefef",
    // overflowY: "auto",
    padding: "0 !important",
    height: "100%",
  },
  cardAction: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-evenly",
    backgroundColor: "#fff",
  },
  table: {
    width: "100%",
    height: "100%",
    margin: "0px",
    padding: "0px",
    borderStyle: "none",
  },
  rowGrey: {
    background: "#F6F6F6",
    border: "0px",
  },
  rowWhite: {
    background: "#FFF",
    border: "0px",
  },
  cell1: {
    border: "0px",
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "12px",
    lineHeight: "18px",
    color: "#757679",
  },

  link_permit: {
    border: "0px",
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "12px",
    lineHeight: "18px",
    color: "#757679",
    padding: "5px",
    alignContent: "center",
    background: "#F6F6F6",
    border: "0px",
  },

  cell2: {
    border: "0px",
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 300,
    fontSize: "12px",
    lineHeight: "18px",
    color: "#75767A",
  },
  text1: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "12px",
    lineHeight: "18px",
    color: "#011133",
  },
  text2: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 300,
    fontSize: "12px",
    lineHeight: "18px",
    color: "#000",
  },
  iconContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  loadingWrapper: {
    width: "400px",
  },
}));

const formatDateString = (dateString) => {
  if (!dateString) return "--";

  return new Date(dateString).toLocaleDateString();
};

const formatBOE = (boe) => {
  if (!boe || isNaN(boe)) return "--";

  return Math.round(boe).toLocaleString();
};

export default function WellCard() {
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateExpandableCard, setStateExpandableCard] = useContext(
    ExpandableCardContext
  );
  const [stateWellCard, setStateWellCard] = useContext(WellCardContext);
  // const [
  //   getVertexEdges,
  //   { loading: loadingGraph, data: dataGraph },
  // ] = useLazyQuery(VERTEXEDGESQUERY);
  const [
    getWellSummaryDetail,
    { loading: loadingWellSummary, data: dataWellSummary },
  ] = useLazyQuery(WELLSUMMARYDETAILQUERY);
  const [target, setTarget] = useState(null);
  const [summary, setSummary] = useState(null);
  const [source, setSource] = useState(null);
  const theme = useTheme();
  const classes = useStyles();

  useEffect(() => {
    // console.log("stateApp.user", stateApp.user);
    if (!source) {
      setSource({
        sourceId: stateApp.user.id,
        label: "user",
        name: stateApp.user.name,
        type: "vertex",
        properties: [],
      });
    }
    //  else {
    //   getVertexEdges({
    //     variables: { source: source, edgeLabel: "tracks", targetLabel: "well" },
    //   });
    // }
  }, [stateApp.user, source]);

  // useEffect(() => {
  //   if (dataGraph) {
  //     if (dataGraph.vertexEdges) {
  //       if (dataGraph.vertexEdges.sourceIds) {
  //         if (dataGraph.vertexEdges.sourceIds.length > 0) {
  //           dataGraph.vertexEdges.sourceIds.forEach((id) => {
  //             if (stateApp.selectedWell.id === id) {
  //               let trackedWell = target || stateApp.selectedWell;
  //               trackedWell.isTracked = true;
  //               setTarget(trackedWell);
  //             }
  //           });
  //         }
  //       }
  //     }
  //   }
  // }, [stateApp.user, stateApp.selectedWell, dataGraph]);

  useEffect(() => {
    getWellSummaryDetail({
      variables: { id: stateApp.selectedWell.id },
    });
  }, [stateApp.selectedWell]);

  useEffect(() => {
    if (dataWellSummary) {
      setSummary(dataWellSummary.wellSummaryDetail[0]);
    } else {
      setSummary(null);
    }
  }, [dataWellSummary]);

  //make fire and forget call to REST api so that it begins to cache other well related api calls
  const { data, loading, error } = useQueryWell(stateApp.selectedWell.id);
  //console.log('fireForget',data)
  /* useEffect(() => {
    setStateApp(state => ({ ...state, selectedWell: props.selectedWell }))
   
  }, [props.selectedWell, props.isSelectedWellLoading, setStateWellCard]) */

  const fullScreen = useMediaQuery(theme.breakpoints.down("xl"));

  const handleOpenDetails = () => {
    setStateWellCard((state) => ({ ...state, openWellDetails: true }));
  };

  const handleCloseDetails = () => {
    setStateWellCard((state) => ({ ...state, openWellDetails: false }));
  };
  const handleCloseWellCard = () => {
    setStateApp((state) => ({ ...state, popupOpen: false }));
    let popUps = document.getElementsByClassName("mapboxgl-popup");
    if (popUps[0]) popUps[0].remove();
  };

  const convertDate = (unixStamp) => {
    const date = moment.utc(unixStamp).format("MM/DD/YYYY");

    if (unixStamp === "null") {
      return "--";
    } else if (unixStamp === null) {
      return "--";
    } else if (unixStamp === undefined) {
      return "--";
    } else {
      return date;
    }
  };
  console.log(stateApp.selectedWell);
  if (stateApp.selectedWell.wellStatus !== "Permit") {
    return stateApp.selectedWell ? (
      !stateExpandableCard.expanded ? (
        <div style={{height: "100%", padding: "9px" }}>
          <Card>
            <CardActions
              classes={{
                root: classes.cardAction,
              }}
            >
              <div className={classes.iconContainer}>
                <WellIcon
                  htmlColor="black"
                  viewBox="0 0 32 31"
                  fontSize="large"
                />

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
                  {stateApp.selectedWell.wellStatus
                    ? stateApp.selectedWell.wellStatus
                    : "--"}
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
                  {`${formatBOE(stateApp.selectedWell.lastTwelveMonthBOE)} BOE`}
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
                  {stateApp.selectedWell.ownerCount
                    ? stateApp.selectedWell.ownerCount
                    : "--"}
                </Typography>
              </div>
              <div className={classes.iconContainer}>
                <Avatar variant="circle" className={classes.avatar}>
                  {stateApp.selectedWell.wellBoreProfile
                    ? stateApp.selectedWell.wellBoreProfile.substring(0, 1)
                    : "H"}{" "}
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
                  {stateApp.selectedWell.wellBoreProfile
                    ? stateApp.selectedWell.wellBoreProfile
                    : "--"}
                </Typography>
              </div>
            </CardActions>
            <CardContent className={classes.content}>
              <Table
                className={classes.table}
                size="small"
                aria-label="well table"
              >
                <TableBody>
                  <TableRow className={classes.rowGrey}>
                    <TableCell className={classes.cell1} align="left">
                      API
                    </TableCell>
                    <TableCell className={classes.cell2} align="right">
                      {stateApp.selectedWell.api
                        ? stateApp.selectedWell.api
                        : "--"}
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.rowWhite}>
                    <TableCell className={classes.cell1} align="left">
                      Well Type
                    </TableCell>
                    <TableCell className={classes.cell2} align="right">
                      {stateApp.selectedWell.wellType
                        ? stateApp.selectedWell.wellType
                        : "--"}
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.rowGrey}>
                    <TableCell className={classes.cell1} align="left">
                      Permit Date
                    </TableCell>
                    <TableCell className={classes.cell2} align="right">
                      {" "}
                      {convertDate(stateApp.selectedWell.permitApprovedDate)}
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.rowWhite}>
                    <TableCell className={classes.cell1} align="left">
                      Spud Date
                    </TableCell>
                    <TableCell className={classes.cell2} align="right">
                      {" "}
                      {convertDate(stateApp.selectedWell.spudDate)}
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.rowGrey}>
                    <TableCell className={classes.cell1} align="left">
                      Completion Date
                    </TableCell>
                    <TableCell className={classes.cell2} align="right">
                      {" "}
                      {convertDate(stateApp.selectedWell.completionDate)}
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.rowWhite}>
                    <TableCell className={classes.cell1} align="left">
                      First Prod Date
                    </TableCell>
                    <TableCell className={classes.cell2} align="right">
                      {convertDate(stateApp.selectedWell.firstProductionDate)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div style={{ height: "100%" }}>
          {/* <Modal
          style={{overflow: "auto"}}
          open={stateExpandableCard.expanded}
          // onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          > */}
          <Card className={classes.card}>
            {/* <CardHeader
          classes={{
            title: classes.title,
            subheader: classes.subheader
          }}
          action={
            <div>
               <TrackToggleButton 
               target= {target} 
               targetLabel="well" 
               targetSourceId={stateApp.selectedWell.id} />
               
           <IconButton onClick={handleOpenDetails} aria-label="expand">
                <ExpandIcon viewBox="0 0 64 64" color="secondary" fontSize="small" />
              </IconButton>
              <IconButton onClick={handleCloseWellCard} aria-label="close">
                <CloseIcon fontSize="small" color="secondary" />
              </IconButton>
            </div>
          }
          title={
            stateApp.selectedWell.wellName
              ? stateApp.selectedWell.wellName.length > 30
                ? `${stateApp.selectedWell.wellName.substr(0, 30)}...`
                : stateApp.selectedWell.wellName
              : '--'
          }
          subheader={
            stateApp.selectedWell.operator
              ? stateApp.selectedWell.operator.length > 35
                ? `${stateApp.selectedWell.operator.substr(0, 35)}...`
                : stateApp.selectedWell.operator
              : '--'
          }
        /> */}
            <CardContent className={classes.content}>
              <WellCardDetails target={target} summary={summary} />
            </CardContent>
          </Card>
          {/* </Modal> */}
        </div>
      )
    ) : (
      <CircularProgress color="secondary" />
    );
  }
}
