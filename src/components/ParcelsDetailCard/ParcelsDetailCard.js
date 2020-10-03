import React, { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { useDispatch } from "react-redux";

import Taps from "../Shared/Taps";
import M1nTable from "../Shared/M1nTable/M1nTable";
import { CUSTOMLAYER } from "../../graphQL/useQueryCustomLayer";
import QtrQtrSelector from "./components/QtrQtrSelector";
import LeftTopSummary from "./components/LeftTopSummary";
import ParcelDetailsMap from "./components/ParcelDetailsMap";
import { UPDATECUSTOMLAYER } from "../../graphQL/useMutationUpdateCustomLayer";
import { showSuccessMessage, showErrorMessage } from "../../actions";

const ENTER_KEY = 13;

const useStyles = makeStyles((theme) => ({
  grid: {
    width: "auto",
  },
  gridItem: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-around",
    height: "100%",
  },
  gridWidthScroll: {
    maxHeight: "calc(100% - 88px)",
    overflow: "auto",
  },
  calcSummary: {
    margin: "8px",
  },
  parcelMap: {
    margin: "8px",
    width: "100%",
    textAlign: "center",
  },
  content: {
    backgroundColor: "#fff",
    padding: "16px",
  },
  dataSect: {
    height: "100%",
    borderTop: "2px solid #C9C9C9",
    color: "#757575",
    width: "100%",
    "& .MuiGrid-item": { display: "flex", padding: "8px" },
    "& p": {
      wordWrap: "break-word",
      margin: "auto 0",
    },
    "& .dataLabels": {
      fontWeight: "bold",
    },
    "& > .MuiGrid-item": {
      borderBottom: "2px solid #C9C9C9",
      borderRight: "2px solid #C9C9C9",
    },
    "& .fieldName": {
      borderLeft: "2px solid #C9C9C9",
      backgroundColor: "#EBEBEB",
    },
  },
  borderRight: {
    borderRight: "1px solid #eaeaea",
    backgroundColor: "#fff",
    padding: "15px",
  },
  qtrAndInputs: { "& input": { fontSize: "0.875rem" } },
}));

export default function ParcelsDetailCard(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [parcelObj, setParcelObj] = useState();
  const [parcelProperties, setProperties] = useState();
  const [parcelName, setParcelName] = useState();
  const [grossAcres, setGrossAcres] = useState();
  const [legalDescription, setLegalDesc] = useState();

  const [updateCustomLayer, { data: updatedParcel }] = useMutation(
    UPDATECUSTOMLAYER
  );

  const [getCustomLayer, { data: dataCustomLayer, loading }] = useLazyQuery(
    CUSTOMLAYER,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  useEffect(() => {
    if (props.id) {
      getCustomLayer({
        variables: {
          id: props.id,
        },
      });
    }
  }, [props.id]);

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
      setProperties(shape.properties);
      setParcelName(shape.properties.shapeLabel);
      setGrossAcres(shape.properties.sdGrossAcres);
      setLegalDesc(shape.properties.legalDescription || "");
    }
  }, [dataCustomLayer]);

  useEffect(() => {
    if (updatedParcel) {
      if (updatedParcel.updateCustomLayer.success) {
        dispatch(showSuccessMessage("Successfully updated the parcel."));
      } else {
        dispatch(showErrorMessage("Failed to update parcel"));
      }
    }
  }, [updatedParcel]);

  const setQtrQtr = (qtrQtr) => {
    setParcelObj((parcelData) => ({ ...parcelData, qtrQtr }));
  };

  const updateParcel = (e, field, value) => {
    if (e.keyCode === ENTER_KEY) {
      e.preventDefault();
      e.stopPropagation();
      const shape = parcelObj.shape;
      shape.properties[field] = value;
      updateCustomLayer({
        variables: {
          customLayerId: parcelObj._id,
          customLayer: {
            shape: JSON.stringify(shape),
          },
        },
      });
    }
  };

  return parcelObj ? (
    <Grid item sm={12} container className={classes.gridWidthScroll}>
      <Grid item sm={12} container>
        <Grid item sm={2} className={classes.gridItem}>
          <LeftTopSummary parcelData={parcelObj} />
        </Grid>

        <Grid item sm={6} className={classes.gridItem}>
          <Grid item sm={12} container>
            <Grid item sm={7} className={classes.gridItem}>
              <QtrQtrSelector parcelData={parcelObj} setQtrQtr={setQtrQtr} />
            </Grid>
            <Grid item sm={5}>
              <div className={classes.calcSummary}>
                <p className="formLabel">Parcel Name</p>
                <TextField
                  size="small"
                  value={parcelName}
                  variant="outlined"
                  onChange={(e) => {
                    setParcelName(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    updateParcel(e, "shapeLabel", parcelName);
                  }}
                  fullWidth
                />
                <p className="formLabel">Gross Acres</p>
                <TextField
                  size="small"
                  value={grossAcres}
                  variant="outlined"
                  onChange={(e) => {
                    setGrossAcres(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    updateParcel(e, "sdGrossAcres", grossAcres);
                  }}
                  fullWidth
                />
                <p className="formLabel">Calc. Acres</p>
                <TextField
                  disabled
                  size="small"
                  value={parcelProperties.shapeArea}
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />

                <p className="formLabel">Full Legal Description</p>
                <TextField
                  size="small"
                  multiline
                  rows={7}
                  value={legalDescription}
                  variant="outlined"
                  fullWidth
                  placeholder="Enter legal description here"
                  onChange={(e) => {
                    setLegalDesc(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    updateParcel(e, "legalDescription", legalDescription);
                  }}
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={4} className={classes.gridItem}>
          <div className={classes.parcelMap} id="parcelMap">
            <ParcelDetailsMap parcelData={parcelObj} />
          </div>
        </Grid>
      </Grid>

      <Grid item sm={12}>
        <Taps
          tabLabels={["Owners", "Wells"]}
          tabPanels={[
            <M1nTable parent="ownersPerParcel" customLayer={parcelObj} dense />,
            "Wells Table Coming Soon!",
          ]}
        />
      </Grid>
    </Grid>
  ) : (
    <div
      style={{
        padding: "20px",
        position: "absolute",
        height: "100%",
        width: "100%",
        zIndex: "50",
      }}
    >
      <CircularProgress size={80} disableShrink color="secondary" />
    </div>
  );
}
