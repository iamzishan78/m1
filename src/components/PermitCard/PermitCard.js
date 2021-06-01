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

// queries 
import { useLazyQuery } from "@apollo/client";
import { PERMITDETAILQUERY } from "../../graphQL/useQueryRecentPermitDetails";

// value formatters 
import formatBOE from "../Shared/valueformatters/format_boe.js"
import convert_date from "../Shared/valueformatters/convert_date.js";

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

  useEffect(() => {
    if(dataPermitSummary) {
      Object.assign(stateApp.selectedPermit, dataPermitSummary.recentPermitDetail[0])
      setStateApp((state) => ({
	...state,
	selectedPermitDetails: stateApp.selectedPermit
      }));
    } 
  }, [dataPermitSummary])


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
	 {'PERMIT - NEW DRILL'}
      </Typography>
	</div>


	<div className={classes.iconContainer}>
	<Avatar variant="circle" className={classes.avatar}>
	{stateApp.selectedPermit.WellBoreProfile
	 ? stateApp.selectedPermit.WellBoreProfile.substring(0, 1)
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
	{stateApp.selectedPermit.WellBoreProfile
	 ? stateApp.selectedPermit.WellBoreProfile
	 : '--'}
      </Typography>
	</div>
	</CardActions>
	<CardContent className={classes.content}>
	<Table className={classes.table} size="small" aria-label="well table">
	<TableBody>
    
	<TableRow className={classes.rowGray}>
	<TableCell className={classes.cell1} align="left">
	API #
  </TableCell>
	<TableCell className={classes.cell2} align="right">
	{stateApp.selectedPermit.ApiNumber
	 ? stateApp.selectedPermit.ApiNumber
	 : '--'}
      </TableCell>
	</TableRow>

	<TableRow className={classes.rowGrey}>
	<TableCell className={classes.cell1} align="left">
	Permit #
  </TableCell>
	<TableCell className={classes.cell2} align="right">
	{stateApp.selectedPermit.PermitId
	 ? stateApp.selectedPermit.PermitId
	 : '--'}
      </TableCell>
	</TableRow>

	<TableRow className={classes.rowWhite}>
	<TableCell className={classes.cell1} align="left">
	Operator
      </TableCell>
	<TableCell className={classes.cell2} align="right">
	{stateApp.selectedPermit.OperatorName
	 ? stateApp.selectedPermit.OperatorName
	 : '--'}
      </TableCell>
	</TableRow>

	<TableRow className={classes.rowGrey}>
	<TableCell className={classes.cell1} align="left">
	Well Type
      </TableCell>
	<TableCell className={classes.cell2} align="right">
	{stateApp.selectedPermit.WellType
	 ? stateApp.selectedPermit.WellType
	 : 'UNKOWN'}
      </TableCell>
	</TableRow>

	<TableRow className={classes.rowWhite}>
	<TableCell className={classes.cell1} align="left">
	Submitted Date
      </TableCell>
	<TableCell className={classes.cell2} align="right">
	{convert_date(stateApp.selectedPermit.SubmittedDate)}
      </TableCell>
	</TableRow>

	<TableRow className={classes.rowGrey}>
	<TableCell className={classes.cell1} align="left">
	Total Depth [ft]
      </TableCell>
	<TableCell className={classes.cell2} align="right">
	{stateApp.selectedPermit.TotalDepth
	 ? formatBOE(stateApp.selectedPermit.TotalDepth)
	 : '--'}
      </TableCell>
	</TableRow>

	<TableRow className={classes.rowWhite}>
	<TableCell className={classes.cell1} align="left">
	Completion Depth [ft]
      </TableCell>
	<TableCell className={classes.cell2} align="right">
	{stateApp.selectedPermit.CompletionDepth
	 ? formatBOE(stateApp.selectedPermit.CompletionDepth)
	 : '--'}
      </TableCell>
	</TableRow>



      </TableBody>
	</Table>
	<div>
	<Link href=
  
  {"http://webapps2.rrc.texas.gov/EWA/drillingPermitDetailAction.do?methodToCall=searchByUniversalDocNo&universalDocNo="+stateApp.selectedPermit.UniversalDocNumber+"&rrcActionMan=H4sIAAAAAAAAAL1Qu27DMAz8mnQUJPkBLxyMop37CJrByKDYhCNAtgxK7gPQx5d2USB1OmfS8Y4ij5eUlKCTkgrUHVFbt9H68aWlrpFHWPkPPJlpClqwLCJ-miB6_77L6kqyrmGnHx8ONcNsgR1Z5-zYPyENNobnGenrZ6joPDflMGA8-27v741zTBRAGGca9_4VDbVnpiqQV16asKo19UFMhszwZtyMq0X2WJVZLqsFF3DC3o7hYOMyimf9qZXe1Jf9m6XqVgGE38NLmEyPdHHgv2moY7PtW6yCShqUTBmDHGQq-C2ZuP59gyy_AXdh05tZAgAA"}


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
