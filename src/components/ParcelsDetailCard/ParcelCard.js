import React, { useState, useContext, useEffect, useRef } from "react";
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
import Button from '@material-ui/core/Button';


import WellIcon from "../WellCard/components/svgIcons/WellIcon";
import ProductionIcon from "../WellCard/components/svgIcons/ProductionIcon";
import OwnershipIcon from "../WellCard/components/svgIcons/OwnershipIcon";
import DescriptionIcon from "../WellCard/components/svgIcons/DescriptionIcon";
// import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';


import ParcelsDetailCard from "./ParcelsDetailCard";
import { getParcelOriginalProperties } from "./utils/GetParcelOriginalProps";

// QUERIES 
import { useLazyQuery } from "@apollo/client";
import { SHAPEWELLS } from "graphQL/useQueryPaginatedShapeWells";
import { GET_PARCELS_FILES } from "graphQL/useQueryGetParcelFiles";
import { CUSTOMLAYER } from "../../graphQL/useQueryCustomLayer";

// contexts 
import { WellCardContext } from "../WellCard/WellCardContext";
import { AppContext } from "../../AppContext";
import { ExpandableCardContext } from "../ExpandableCard/ExpandableCardContext";
import { ParcelCardContext } from "./ParcelCardContext";
import { SHAPEWELLSCOUNT } from "graphQL/useQueryShapeWellsCount";


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
  button: {
    height: "110px",
    width: "100px",
  },
}));

export default function ParcelCard(props) {
  const parcelPLSS = useRef(false);

  // contexts 
  const [stateApp, setStateApp] = useContext(AppContext);
  const [parcelContext, setParcelContext] = useContext(ParcelCardContext);
  const [stateExpandableCard, setStateExpandableCard] = useContext(ExpandableCardContext);
  const [stateWellCard, setStateWellCard] = useContext(WellCardContext);
  const [wellNumber, setWellNumber] = useState()

  const [parcelObj, setParcelObj] = useState();
  const [parcelProperties, setProperties] = useState();
  const classes = useStyles();

  // queries 
  const [getShapeWellsCount, { data: dataShapeWellsCount }] = useLazyQuery(SHAPEWELLSCOUNT, { fetchPolicy: "cache-and-network", skip: true });
  const [getAllFiles, { data: dataParcelFiles }] = useLazyQuery(GET_PARCELS_FILES);
  const documentCount = dataParcelFiles?.getParcelFiles.length || 0;
  const [getCustomLayer, { data: dataCustomLayer }] = useLazyQuery(CUSTOMLAYER,);


  const getSelectedFeaturePolygonString = () => {
    if (parcelObj.shape.geometry.coordinates) {

      let feature = parcelObj.shape;

      let polygonString = "POLYGON((";
      feature.geometry.coordinates[0].forEach((coordinate, index) => {
        polygonString += coordinate[0] + " " + coordinate[1];
        if (index < feature.geometry.coordinates[0].length - 1) {
          polygonString += ", ";
        }
      });
      polygonString += "))";

      return polygonString;

    }
  };

  useEffect(() => {
    if (dataShapeWellsCount) {
      setWellNumber(dataShapeWellsCount?.shapeWellsCount)
    }
  }, [dataShapeWellsCount])
  useEffect(() => {
    if (stateApp.selectedParcel) {
      getCustomLayer({
        variables: {
          id: stateApp.selectedParcel.id,
        },
      });
    }
  }, [stateApp.selectedParcel]);

  useEffect(() => {
    if (parcelObj) {
      getShapeWellsCount({
        variables: {
          polygon: getSelectedFeaturePolygonString()
        },
      });
    }
  }, [parcelObj]);

  useEffect(() => {
    if (parcelObj)
      getAllFiles({
        variables: {
          relatedObjectId: parcelObj?._id || stateApp.user.mongoId,
          relatedObjectType: "Parcel",
        },
      });
  }, [parcelObj]);


  useEffect(() => {
    if (dataCustomLayer && dataCustomLayer.customLayer) {
      let shape = dataCustomLayer.customLayer.shape;
      if (typeof shape === "string") {
        shape = JSON.parse(shape);
      }
      setParcelObj({
        ...dataCustomLayer.customLayer,
        shape: shape,
      });
      const properties = getParcelOriginalProperties(shape.properties);

      setProperties(properties);
    }
  }, [dataCustomLayer]);
  const handleOpenDetails = (tabIndex) => {
    setStateApp((state) => ({
      ...state,
      expandedCard: true,
      parcelDetailCardOpen: true,
      parcelDetailCardTabIndex: tabIndex,
      popupOpen: false,
    }));
  };
  if (parcelObj && parcelObj.state === "TX") {
    parcelPLSS.current = true;
  }
  return parcelObj ? (
    !stateExpandableCard.expanded ? (
      <div style={{ height: "100%", padding: "9px" }}>
        <Card>
          <CardActions classes={{ root: classes.cardAction }}>
            <Button
              className={classes.button}
              onClick={() => { handleOpenDetails(1) }}
            >
              <div className={classes.iconContainer}>
                <WellIcon
                  htmlColor="black"
                  viewBox="0 0 36 31"
                  fontSize="large"
                />
                <Typography
                  align="center"
                  className={classes.text1}
                  variant="subtitle2"
                >
                  Wells
                </Typography>
                <Typography
                  align="center"
                  className={classes.text2}
                  variant="caption"
                >
                  {wellNumber || "0"}

                </Typography>
              </div>
            </Button>
            <Button
              className={classes.button}
              onClick={() => { handleOpenDetails(0) }}
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
                  {parcelObj?.ownerCount || "0"}
                </Typography>
              </div>
            </Button>
            <Button
              className={classes.button}
              onClick={() => { handleOpenDetails(3) }}
            >
              <div className={classes.iconContainer}>
                <DescriptionIcon
                  htmlColor="black"
                  viewBox="5 0 17 26"
                  fontSize="large"
                />
                <Typography
                  align="center"
                  className={classes.text1}
                  variant="subtitle2"
                >
                  Documents
                </Typography>
                <Typography
                  align="center"
                  className={classes.text2}
                  variant="caption"
                >
                  {documentCount}

                </Typography>
              </div>
            </Button>
            <Button
              className={classes.button}
              onClick={() => { handleOpenDetails() }}
            >
              <div className={classes.iconContainer}>
                <LayerIcon
                  htmlColor="black"
                  viewBox="5 0 17 26"
                  fontSize="large"
                />
                <Typography
                  align="center"
                  className={classes.text1}
                  variant="subtitle2"
                >
                  Acres
                </Typography>
                <Typography
                  align="center"
                  className={classes.text2}
                  variant="caption"
                >
                  {stateApp.selectedParcel.sdGrossAcres || stateApp.selectedParcel.shapeArea}
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
                    County
                  </TableCell>
                  <TableCell className={classes.cell2} align="right">
                    {parcelProperties.county}
                  </TableCell>
                </TableRow>
                <TableRow className={classes.rowWhite}>
                  <TableCell className={classes.cell1} align="left">
                    State
                  </TableCell>
                  <TableCell className={classes.cell2} align="right">
                    {parcelProperties.state}
                  </TableCell>
                </TableRow>
                <TableRow className={classes.rowGrey}>
                  <TableCell className={classes.cell1} align="left">
                    {parcelPLSS.current ? "Survey" : "Meridian"}
                  </TableCell>
                  <TableCell className={classes.cell2} align="right">
                    {parcelPLSS.current ? parcelProperties.survey : parcelProperties.meridian}
                  </TableCell>
                </TableRow>
                <TableRow className={classes.rowWhite}>
                  <TableCell className={classes.cell1} align="left">
                    {parcelPLSS.current ? "Block" : "Township"}
                  </TableCell>
                  <TableCell className={classes.cell2} align="right">
                    {parcelPLSS.current ? parcelProperties.block : parcelProperties.township}
                  </TableCell>
                </TableRow>
                <TableRow className={classes.rowGrey}>
                  <TableCell className={classes.cell1} align="left">
                    {parcelPLSS.current ? "Section" : "Range"}
                  </TableCell>
                  <TableCell className={classes.cell2} align="right">
                    {parcelPLSS.current ? parcelProperties.section : parcelProperties.range}
                  </TableCell>
                </TableRow>
                <TableRow className={classes.rowWhite}>
                  <TableCell className={classes.cell1} align="left">
                    {parcelPLSS.current ? "Abstract" : "Section"}
                  </TableCell>
                  <TableCell className={classes.cell2} align="right">
                    {parcelPLSS.current ? parcelProperties.abstract : parcelProperties.section}
                  </TableCell>
                </TableRow>
                {parcelPLSS.current && (
                  <TableRow className={classes.rowGrey}>
                    <TableCell className={classes.cell1} align="left">
                      Alt Survey
                    </TableCell>
                    <TableCell className={classes.cell2} align="right">
                      {parcelProperties.altSurvey}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    ) : (
      <div style={{ height: "100%" }}>
        <Card className={classes.card}>
          <CardContent className={classes.content}>
            <ParcelsDetailCard id={stateApp.selectedParcel.id} selectTabIndex={stateApp.parcelDetailCardTabIndex} />
          </CardContent>
        </Card>
      </div>
    )
  ) : (
    <CircularProgress color="secondary" />
  )
}