import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import LayerIcon from "@material-ui/icons/Layers";

import { AppContext } from "../../AppContext";
import { ExpandableCardContext } from "../ExpandableCard/ExpandableCardContext";
import WellIcon from "../WellCard/components/svgIcons/WellIcon";
import ProductionIcon from "../WellCard/components/svgIcons/ProductionIcon";
import OwnershipIcon from "../WellCard/components/svgIcons/OwnershipIcon";

import { ParcelCardContext } from "./ParcelCardContext";
import ParcelsDetailCard from "./ParcelsDetailCard";
import  { getParcelOriginalProperties } from "./utils/GetParcelOriginalProps";

const useStyles = makeStyles((theme) => ({
  card: {
    borderStyle: "none",
    height: "100%",
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
}));

export default function ParcelCard(props) {

  const [stateApp, setStateApp] = useContext(AppContext);
  const [parcelContext, setParcelContext] = useContext(ParcelCardContext);
  const [stateExpandableCard, setStateExpandableCard] = useContext(ExpandableCardContext);
  const classes = useStyles();
  const originalProperty = getParcelOriginalProperties(stateApp.selectedParcel);

  return stateApp.selectedParcel ? (
    !stateExpandableCard.expanded ? (
      <div style={{ height: "100%", padding: "9px" }}>
        <Card>
          <CardActions classes={{root: classes.cardAction}}>
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
                Well Count
              </Typography>
              <Typography
                align="center"
                className={classes.text2}
                variant="caption"
              >
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
              </Typography>
            </div>

            <div className={classes.iconContainer}>
              <LayerIcon
                htmlColor="black"
                viewBox="0 0 32 31"
                fontSize="large"
              />
              <Typography
                align="center"
                className={classes.text1}
                variant="subtitle2"
              >
                Calc. Acres
              </Typography>
              <Typography
                align="center"
                className={classes.text2}
                variant="caption"
              >
                {stateApp.selectedParcel.shapeArea}
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
                    County
                  </TableCell>
                  <TableCell className={classes.cell2} align="right">
                    {originalProperty.county}
                  </TableCell>
                </TableRow>
                <TableRow className={classes.rowWhite}>
                  <TableCell className={classes.cell1} align="left">
                    State
                  </TableCell>
                  <TableCell className={classes.cell2} align="right">
                    {originalProperty.state}
                  </TableCell>
                </TableRow>
                <TableRow className={classes.rowGrey}>
                  <TableCell className={classes.cell1} align="left">
                    Survey
                  </TableCell>
                  <TableCell className={classes.cell2} align="right">
                    {originalProperty.survey}
                  </TableCell>
                </TableRow>
                <TableRow className={classes.rowWhite}>
                  <TableCell className={classes.cell1} align="left">
                    Block
                  </TableCell>
                  <TableCell className={classes.cell2} align="right">
                    {originalProperty.block}
                  </TableCell>
                </TableRow>
                <TableRow className={classes.rowGrey}>
                  <TableCell className={classes.cell1} align="left">
                    Section
                  </TableCell>
                  <TableCell className={classes.cell2} align="right">
                    {originalProperty.section}
                  </TableCell>
                </TableRow>
                <TableRow className={classes.rowWhite}>
                  <TableCell className={classes.cell1} align="left">
                    Abstract
                  </TableCell>
                  <TableCell className={classes.cell2} align="right">
                    {originalProperty.abstract}
                  </TableCell>
                </TableRow>
                <TableRow className={classes.rowGrey}>
                  <TableCell className={classes.cell1} align="left">
                    Alt Survey
                  </TableCell>
                  <TableCell className={classes.cell2} align="right">
                    {originalProperty.altSurvey}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    ) : (
        <div style={{ height: "100%" }}>
          <Card className={classes.card}>
            <CardContent className={classes.content}>
              <ParcelsDetailCard id={stateApp.selectedParcel.id} />
            </CardContent>
          </Card>
        </div>
      )
  ) : (
      <CircularProgress color="secondary" />
    )
}