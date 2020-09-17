import React, { useEffect, useContext, useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import LayerIcon from "@material-ui/icons/Layers";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { AppContext } from "../../../../AppContext";

const useStyles = makeStyles((theme) => ({
  popUp: {
    minWidth: "250px",
    padding: "5px 20px",
    borderRadius: "15px",
    backgroundColor: "#ffffff",
    flexDirection: "row",
    display: "flex",
    placeContent: "center space-between",
    alignItems: "center"
  },
  actions: {
    marginTop: "5px"
  }
}));

export default (props) => {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);

  const parcelLabel = props.abstracts.length > 1 ? "parcels" : "parcel";

  const openParcelDetail = function() {
    const parcel = {
      "id": "c1987e53e07767ae483efb9604e244b1",
      "projectName": "",
      "sdGrossAcres": "",
      "sdNotes": "",
      "sdType": "parcel",
      "shapeArea": "665.8 acres",
      "shapeCenter": "[-104.07070687336221,31.846868571312044]",
      "shapeLabel": "A-19",
      "shapeLabelLayer": ""
    }
    // e03a6a5cf828010ca3f4c159803ca802
    setStateApp((state) => ({
      ...state,
      selectedParcel: parcel,
      expandedCard: true
    }));
    props.onClickExpand();
  }

  const handleClose = function() {
    let popUps = document.getElementsByClassName("mapboxgl-popup");
    if (popUps[0]) popUps[0].remove();

    for (let i = 0; i < stateApp.selectedAbstracts.length; i++) {
      const id = stateApp.selectedAbstracts[i].properties.abstract_n;
      props.map.setFeatureState(
        { source: 'abstract_geo_source', id: id },
        { click: false }
      );
    }

    setStateApp((state) => ({
      ...state,
      selectedAbstracts: []
    }));
  }

  return (
    <Fragment>
      <div className={classes.popUp}>
        <strong>{props.abstracts.length} {parcelLabel} selected.</strong>
        <div className={classes.actions}>
          <IconButton size="small" onClick={openParcelDetail} aria-label="Parcel">
            <LayerIcon color="secondary"/>
          </IconButton>
          <Typography variant="srOnly">AOI</Typography>
          <IconButton size="small" onClick={handleClose} aria-label="Close">
            <CloseIcon color="secondary" fontSize="small" />
          </IconButton>
        </div>
      </div>
    </Fragment>
  );
}