import React, { useEffect, useContext, useState } from "react";
import { AppContext } from "../../AppContext";
import { WellCardContext } from "./WellCardContext";
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

import WellCardDetails from "./WellCardDetails";

// queries 
import { useLazyQuery } from "@apollo/client";
import { WELLSUMMARYDETAILQUERY } from "../../graphQL/useQueryWellSummaryDetail";

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



function WellCard() {

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


  const handleOpenDetails = (isOwner) => {
    setStateApp((state) => ({
      ...state,
      expandedCard: true,
      wellDetailCardOpen: true,
      wellDetailCardTabIndex: isOwner ? 1 : 0,
      popupOpen: false,
    }));
  };



  if (stateApp.selectedWell
    && stateApp.selectedWell.wellStatus !== "PERMIT"
    && stateApp.selectedWell.wellStatus !== "PERMIT - EXISTING WELL"
    && stateApp.selectedWell.wellStatus !== "EXPIRED PERMIT"
    && stateApp.selectedWell.wellStatus !== "PERMIT - NEW DRILL") {

    return stateApp.selectedWell ? (
      !stateExpandableCard.expanded ? (
        <div style={{ height: "100%", padding: "9px" }}>
          <Card>
            <CardActions
              classes={{
                root: classes.cardAction,
              }}
            >
              <Button
                className={classes.button}
                onClick={() => { handleOpenDetails() }}
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
              </Button>

              <Button
                className={classes.button}
                onClick={() => { handleOpenDetails() }}
              >
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
              </Button>

              <Button
                className={classes.button}
                onClick={() => { handleOpenDetails(true) }}
              >
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
              </Button>

              <Button
                className={classes.button}
                onClick={() => { handleOpenDetails() }}
              >
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
              </Button>

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
                      Operator
                    </TableCell>
                    <TableCell className={classes.cell2} align="right">
                      {stateApp.selectedWell.operator
                        ? stateApp.selectedWell.operator
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
                      {convert_date(stateApp.selectedWell.permitApprovedDate)}
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.rowWhite}>
                    <TableCell className={classes.cell1} align="left">
                      Spud Date
                    </TableCell>
                    <TableCell className={classes.cell2} align="right">
                      {" "}
                      {convert_date(stateApp.selectedWell.spudDate)}
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.rowGrey}>
                    <TableCell className={classes.cell1} align="left">
                      Completion Date
                    </TableCell>
                    <TableCell className={classes.cell2} align="right">
                      {" "}
                      {convert_date(stateApp.selectedWell.completionDate)}
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.rowWhite}>
                    <TableCell className={classes.cell1} align="left">
                      First Prod Date
                    </TableCell>
                    <TableCell className={classes.cell2} align="right">
                      {convert_date(stateApp.selectedWell.firstProductionDate)}
                    </TableCell>
                  </TableRow>

                  {stateApp.selectedWell.wellStatus == "P&A" ?
                    <TableRow className={classes.rowGrey}>
                      <TableCell className={classes.cell1} align="left">
                        Plug Date
                      </TableCell>
                      <TableCell className={classes.cell2} align="right">
                        {convert_date(stateApp.selectedWell.plugDate)}
                      </TableCell>
                    </TableRow>
                    : null}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div style={{ height: "100%" }}>

          <Card className={classes.card}>
            <CardContent className={classes.content}>
              <WellCardDetails target={target} summary={summary} />
            </CardContent>
          </Card>
        </div>
      )
    ) : (
      <CircularProgress color="secondary" />
    );

  } else {
    return stateApp.selectedWell ? (
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
                  {stateApp.selectedWell.wellStatus
                    ? stateApp.selectedWell.wellStatus.toUpperCase()
                    : '--'}
                </Typography>
              </div>


              <div className={classes.iconContainer}>
                <Avatar variant="circle" className={classes.avatar}>
                  {stateApp.selectedWell.wellBoreProfile
                    ? stateApp.selectedWell.wellBoreProfile.substring(0, 1)
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
                  {stateApp.selectedWell.wellBoreProfile
                    ? stateApp.selectedWell.wellBoreProfile
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
                      {stateApp.selectedWell.permitNumber
                        ? stateApp.selectedWell.permitNumber
                        : '--'}
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.rowWhite}>
                    <TableCell className={classes.cell1} align="left">
                      Operator
                    </TableCell>
                    <TableCell className={classes.cell2} align="right">
                      {stateApp.selectedWell.operator
                        ? stateApp.selectedWell.operator
                        : '--'}
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.rowGrey}>
                    <TableCell className={classes.cell1} align="left">
                      Well Type
                    </TableCell>
                    <TableCell className={classes.cell2} align="right">
                      {stateApp.selectedWell.wellType
                        ? stateApp.selectedWell.wellType
                        : '--'}
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.rowWhite}>
                    <TableCell className={classes.cell1} align="left">
                      Approved Date
                    </TableCell>
                    <TableCell className={classes.cell2} align="right">
                      {convert_date(stateApp.selectedWell.permitApprovedDate)}
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.rowGrey}>
                    <TableCell className={classes.cell1} align="left">
                      Measured Depth [ft]
                    </TableCell>
                    <TableCell className={classes.cell2} align="right">
                      {stateApp.selectedWell.measuredDepth
                        ? formatBOE(stateApp.selectedWell.measuredDepth)
                        : '--'}
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.rowWhite}>
                    <TableCell className={classes.cell1} align="left">
                      Lateral Length [ft]
                    </TableCell>
                    <TableCell className={classes.cell2} align="right">
                      {stateApp.selectedWell.lateralLength
                        ? formatBOE(stateApp.selectedWell.lateralLength)
                        : '--'}
                    </TableCell>
                  </TableRow>



                </TableBody>
              </Table>

              <div   >
                {stateApp.selectedWell.state === 'TX'
                  ?
                  <Link href="http://webapps2.rrc.texas.gov/EWA/drillingPermitsQueryAction.do"
                    // doesnt work yet but starting point for customized permit link for all RRC wells
                    // href={"http://webapps2.rrc.texas.gov/EWA/leaseDetailAction.do?searchType=apiNo&selTab=4096&apiNo=" + getWellSummaryDetail.WellCardDetails.ApiNumber8 + "&methodToCall=displayLeaseDetail&rrcActionMan=H4sIAAAAAAAAALWPS2vDQAyEf016XKRdJ3EOOpjSnPsILcX0sLGFE9hkjdZOWtgfXyUlUPo4lZ40zCDpm4wAZDMCEl6JNFUzbOP-vpG2hhc6-0de-75P1mhsBn71yXTxMHFVCZpbmtjlzVOl0p3kkUNYR-G7keXt45ppo6YF7XjYxHYVr30IakxJeBhlv4oP7KXZqFUSfIOo0zmtpEum9-J3jz6MrGxzcoC5JFe4cpEX9PxlFf-dP124Z3RZu_UdyyfOH0vhX0rVv7061SXMlhCyU1EQ5KnOmRrvJXOTh-cBAAA"}
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
                  : ''}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div style={{ height: "100%" }}>
          <Card className={classes.card}>
            <CardContent className={classes.content}>
              <WellCardDetails target={target} summary={summary} />
            </CardContent>
          </Card>
        </div>
      )
    ) : (
      <CircularProgress color="secondary" />
    )
  }


}

WellCard.whyDidYouRender = true
export default React.memo(WellCard);