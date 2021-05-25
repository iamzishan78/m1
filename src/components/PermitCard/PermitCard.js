import React, { useEffect, useContext, useState } from "react";
import { AppContext } from "../../AppContext";
import { PermitCardContext } from "./PermitCardContext";
import { ExpandableCardContext } from "../ExpandableCard/ExpandableCardContext";

//material-ui components
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Button from '@material-ui/core/Button';



//custom components
import WellIcon from "./components/svgIcons/WellIcon";
import ProductionIcon from "./components/svgIcons/ProductionIcon";
import OwnershipIcon from "./components/svgIcons/OwnershipIcon";
import Link from "@material-ui/core/Link";
import moment from "moment";

import PermitCardDetails from "./PermitCardDetails";

// queries 
import { useLazyQuery } from "@apollo/client";
import { WELLSUMMARYDETAILQUERY } from "../../graphQL/useQueryWellSummaryDetail";
import { PERMITDETAILQUERY } from "../../graphQL/useQueryRecentPermitDetails";

// value formatters 
import formatBOE from "../Shared/valueformatters/format_boe.js"

const useStyles = makeStyles((theme) => ({
  card: {
    borderStyle: "none",
    height: "100%",
  },
  title: {
    fontFamily: "Poppins",
    color: "#FFFFFF",
    fontSize: "15px",
  },
  subheader: {
    fontFamily: "Poppins",
    color: "#FFFFFF",
    fontSize: "11px",
  },

  avatar: {
    backgroundColor: "black",
    color: "white",
    width: "38px",
    height: "38px",
    margin: "0px",
  },
  content: {
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
    width: "450px",
  },
  button: {
    height: "110px",
    width: "100px",
  },
}));

export default function PermitCard() {

  // context
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateExpandableCard, setStateExpandableCard] = useContext(ExpandableCardContext);




  // function state
  const [target, setTarget] = useState(null);
  const [summary, setSummary] = useState(null);
  const [source, setSource] = useState(null);

  // theme / styles 
  const theme = useTheme();
  const classes = useStyles();

  // queries 
  const [
    getWellSummaryDetail,
    { loading: loadingWellSummary, data: dataWellSummary },
  ] = useLazyQuery(WELLSUMMARYDETAILQUERY);

  const [
    getRecentPermitDetail,
    { loading: loadingPermitSummary, data: dataPermitSummary },
  ] = useLazyQuery(PERMITDETAILQUERY);


  useEffect(() => {
    if (!source) {
      setSource({
	sourceId: stateApp.user.id,
	label: "user",
	name: stateApp.user.name,
	type: "vertex",
	properties: [],
      });
    }
  }, [stateApp.user, source]);
  

  useEffect(() => {
    getRecentPermitDetail({
      variables: { id: stateApp.selectedPermit.PermitId }
    });
  }, [stateApp.selectedPermit]);

  // useEffect(() => {
  //   if (dataWellSummary) {
  //     setSummary(dataWellSummary.wellSummaryDetail[0]);
  //   } else {
  //     setSummary(null);
  //   }
  // }, [dataWellSummary]);

  useEffect(() => {
    if(dataPermitSummary) {
      setSummary(dataPermitSummary.recentPermitDetail[0])
    } else {
      setSummary(null)
    }
  }, [dataPermitSummary])


  const handleOpenDetails = (isOwner) => {
    setStateApp((state) => ({
      ...state,
      expandedCard: true,
      wellDetailCardOpen: true,
      wellDetailCardTabIndex:isOwner ? 1 : 0,
      popupOpen: false,
    }));
  };


  /// can be abstracted 
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
  return stateApp.selectedPermit ? (
    !stateApp.expandedCard ? (
	<div>
	<Card className={classes.card}>
	<CardActions
      classes={{
	root: classes.cardAction
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
	{stateApp.selectedPermit.wellStatus
	 ? stateApp.selectedPermit.wellStatus.toUpperCase()
	 : '--'}
      </Typography>
	</div>


	<div className={classes.iconContainer}>
	<Avatar variant="circle" className={classes.avatar}>
	{stateApp.selectedPermit.wellBoreProfile
	 ? stateApp.selectedPermit.wellBoreProfile.substring(0, 1)
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
	{stateApp.selectedPermit.wellBoreProfile
	 ? stateApp.selectedPermit.wellBoreProfile
	 : '--'}
      </Typography>
	</div>
	</CardActions>
	<CardContent className={classes.content}>
	<Table className={classes.table} size="small" aria-label="well table">
	<TableBody>
	<TableRow className={classes.rowGrey}>
	<TableCell className={classes.cell1} align="left">
	Permit #
      </TableCell>
	<TableCell className={classes.cell2} align="right">
	{stateApp.selectedPermit.permitNumber
	 ? stateApp.selectedPermit.permitNumber
	 : '--'}
      </TableCell>
	</TableRow>
	<TableRow className={classes.rowWhite}>
	<TableCell className={classes.cell1} align="left">
	Operator
      </TableCell>
	<TableCell className={classes.cell2} align="right">
	{stateApp.selectedPermit.operator
	 ? stateApp.selectedPermit.operator
	 : '--'}
      </TableCell>
	</TableRow>
	<TableRow className={classes.rowGrey}>
	<TableCell className={classes.cell1} align="left">
	Well Type
      </TableCell>
	<TableCell className={classes.cell2} align="right">
	{stateApp.selectedPermit.wellType
	 ? stateApp.selectedPermit.wellType
	 : '--'}
      </TableCell>
	</TableRow>
	<TableRow className={classes.rowWhite}>
	<TableCell className={classes.cell1} align="left">
	Approved Date
      </TableCell>
	<TableCell className={classes.cell2} align="right">
	{convertDate(stateApp.selectedPermit.permitApprovedDate)}
      </TableCell>
	</TableRow>
	<TableRow className={classes.rowGrey}>
	<TableCell className={classes.cell1} align="left">
	Measured Depth [ft]
      </TableCell>
	<TableCell className={classes.cell2} align="right">
	{stateApp.selectedPermit.measuredDepth
	 ? formatBOE(stateApp.selectedPermit.measuredDepth)
	 : '--'}
      </TableCell>
	</TableRow>
	<TableRow className={classes.rowWhite}>
	<TableCell className={classes.cell1} align="left">
	Lateral Length [ft]
      </TableCell>
	<TableCell className={classes.cell2} align="right">
	{stateApp.selectedPermit.lateralLength
	 ? formatBOE(stateApp.selectedPermit.lateralLength)
	 : '--'}
      </TableCell>
	</TableRow>



      </TableBody>
	</Table>
	<div>
	<Link href="http://webapps2.rrc.texas.gov/EWA/drillingPermitsQueryAction.do" 
      onClick={() => {
	console.info("I'm a button.");
      }}                
      variant="body2"
      target="_blank"

	>
	<Typography
      align="center"
      variant="subtitle2"
      className={classes.link_permit}
	>
	RRC Permit Search Tool

      </Typography>
	</Link>
	</div>
	</CardContent>
	</Card>
	</div>
    ) : (
	<div style={{ height: "100%" }}>
	<Card className={classes.card}>
	<CardContent className={classes.content}>
	</CardContent>
	</Card>
	</div>
    )  
  ) : (
      <CircularProgress color="secondary" />
  )
}
