import React, { useEffect, useContext, useState, Fragment, useRef } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import get from "lodash/get";
import { useHistory } from "react-router-dom";
import * as turf from "@turf/turf";
import hat from "hat";
import polylabel from "polylabel";
import { Menu, MenuItem } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import GridOnIcon from "@material-ui/icons/GridOn";
import OfflineBoltIcon from "@material-ui/icons/OfflineBoltOutlined";
import CloudDownloadOutlinedIcon from "@material-ui/icons/CloudDownloadOutlined";
import { default as DrawPoly } from "@material-ui/icons/AddBox";
import { default as CheckCircle } from "../../../Shared/svgIcons/check-circle";
import ConvertContact from "components/Shared/svgIcons/convert_contact";
import LayerIcon from "@material-ui/icons/Layers";
import FilterAltIcon from "../../../Shared/svgIcons/FilterAltIcon";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";

import { AppContext } from "AppContext";
import { NavigationContext, DRAWING_MODES } from "components/Navigation/NavigationContext";
import { UPSERTCUSTOMLAYER } from "graphQL/useMutationUpsertCustomLayer";
import { USERBYEMAIL } from "graphQL/useQueryUserByEmail";
import { ABSTRACTGEOCONTAINSQUERY } from "graphQL/useQueryAbstractGeoContains";
import { UPDATECUSTOMLAYER } from "graphQL/useMutationUpdateCustomLayer";
import { addCustomShapeProperties, drawBoundary, getDrawAdustedShape } from "../DrawShapes/drawShapesHelpers";
import Tooltip from "@material-ui/core/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { toggleMapGridCardAtived } from "actions";
import { gql } from "@apollo/client";
import { setFeatureProperty, drawShapeLayerToggle, findBoundsMap } from "components/MapControls/commonHelper";
import { shapeTypeLayers } from "components/Shared/functions/shapeLayer";
import LimitExceedPopUp from "components/MapControls/components/popup/LimitExceedPopup";
import { ConvertTaxOwnerToContactContainer, ExportWellsOwnersContainer } from "store/containers";
import { resetShapeOwnerAction } from "store/actions/ownerActions";

import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent";
import { FEATURES } from "components/Shared/FeatureFlag/common";
import { copy, getPolygonString } from "components/Shared/functions";
import { calculateLandArea } from "components/Shared/functions/shapeLayer";
import ShapeEditActions from "components/MapControls/components/popup/ShapeEditActions";
import ShapeTypeMenu from "./ShapeTypeMenu";


const useStyles = makeStyles({
  selectedType: {
    borderBottom: "4px solid #01B0F0",
    display: "inline",
    cursor: "pointer",
  },
  unSelectedType: {
    display: "inline",
    color: "#827F7F",
    cursor: "pointer",
  },
  inputField: {
    marginTop: '10px',
    padding: '10px',
    '& .MuiInputLabel-outlined': {
      // transform: 'translate(14px, 20px) scale(1)',
    }
  },
  dialogFooter: {
    padding: '10px',
    justifyContent: 'end',
    display: 'flex'
  }
});


const ShapeActionsPopup = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { classes, children, toggleSpatialDataCard, showSpatialDataCard, popupCloseAction } = props;
  const [selectedType, setSelectedType] = useState("new");
  const [selectedShapeType, setSelectedShapeType] = useState();
  const shapeActionClasses = useStyles();
  const { mapGridCardActivated } = useSelector(({ MapGridCard }) => MapGridCard);
  const [stateApp, setStateApp] = useContext(AppContext);
  const [, setStateNav] = useContext(NavigationContext);
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [error, setError] = useState(false);
  const [user, setUser] = useState({ _id: "" });
  const [selectedAction, setSelectedAction] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorConvertEl, setAnchorConvertEl] = useState(null);
  const [limitExceed, setLimitExceed] = useState(false);
  const [convertTaxOwnerModal, setConvertTaxOwnerModal] = useState(false);
  const [exportCSVModal, setExportCSVModal] = useState(false);
  const [showConvertMenu, setShowConvertMenu] = useState(false);
  const [agreementAnchorEl, setAgreementAnchorEl] = useState(null);
  const [tractAnchorEl, setTractAnchorEl] = useState(null);
  const [unitAnchorEl, setUnitAnchorEl] = useState(null);
  const [getUserByEmail, { data: dataUser }] = useLazyQuery(USERBYEMAIL);
  const [getAbstractGeoContains] = useLazyQuery(ABSTRACTGEOCONTAINSQUERY);
  const [upsertCustomLayer, { data: customLayerInsertedData }] = useMutation(UPSERTCUSTOMLAYER, {
    update(
      cache,
      {
        data: {
          upsertCustomLayer: { customLayer },
        },
      }
    ) {
      cache.modify({
        fields: {
          allCustomLayers(existingCustomLayers = [], { readField }) {
            const newCustomLayerRef = cache.writeFragment({
              data: customLayer,
              fragment: gql`
                fragment NewCustomLayer on CustomLayer {
                  _id
                  shape
                  name
                  layer
                  user {
                    _id
                    name
                    email
                  }
                }
              `,
            });

            // Quick safety check - if the new comment is already
            // present in the cache, we don't need to add it again.
            if (existingCustomLayers.some((ref) => readField("id", ref) === customLayer._id)) {
              return existingCustomLayers;
            }

            return [...existingCustomLayers, newCustomLayerRef];
          },
        },
      });
      updateSelectedLayerFeature(customLayer);
    },
  });

  const addShapeToLayerButton = useRef()

  useEffect(() => {
    if (!props.onlyAddShape) return

    setAnchorEl(addShapeToLayerButton.current)
  }, [props.onlyAddShape])

  const [deleteCustomLayer] = useMutation(UPDATECUSTOMLAYER, {
    update(
      cache,
      {
        data: {
          updateCustomLayer: { customLayer },
        },
      }
    ) {
      cache.modify({
        _id: cache.identify(customLayer),
        fields: {
          allCustomLayers(existingCustomLayerRefs, { readField }) {
            return existingCustomLayerRefs.filter((customLayerRef) => customLayer._id !== readField("_id", customLayerRef));
          },
        },
      });
    },
  });

  const [updateCustomLayer] = useMutation(UPDATECUSTOMLAYER);

  const updateSelectedLayerFeature = (customLayer) => {
    setStateApp((state) => ({
      ...state,
      popupOpen: false,
    }));
    const feature = JSON.parse(customLayer.shape);
    feature.id = customLayer._id;
    feature.properties.id = customLayer._id;
    feature.layer = { id: customLayer.layer };
    let key;
    if (customLayer.layer === "parcel") key = "selectedParcel";
    if (shapeTypeLayers.includes(customLayer.layer)) key = "selectedShape";

    setStateApp((state) => ({
      ...state,
      [key]: { ...feature.properties, feature },
    }));
    setStateApp((state) => ({
      ...state,
      popupOpen: true,
      expandedCard: true,
    }));
  };

  useEffect(() => {
    if (stateApp?.editParcelAndShape) {
      actionEdit();
      setStateApp((state) => ({
        ...state,
        editParcelAndShape: false,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateApp?.editParcelAndShape]);

  useEffect(() => {
    if (stateApp && stateApp.user && stateApp.user.email) {
      getUserByEmail({
        variables: {
          userEmail: stateApp.user.email,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateApp.user.email]);

  useEffect(() => {
    if (dataUser && dataUser.userByEmail) {
      setUser(dataUser.userByEmail);
    }
  }, [dataUser]);

  useEffect(() => {
    if (get(customLayerInsertedData, "upsertCustomLayer.customLayer")) {
      updateSelectedLayerFeature(customLayerInsertedData.upsertCustomLayer.customLayer);
    }
    if (get(customLayerInsertedData, "upsertCustomLayer.customLayer") && !customLayerInsertedData.upsertCustomLayer.success) {
      setError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customLayerInsertedData]);

  /**
   * Disabling filter on Cross Button / Unmounting
   */
  useEffect(() => {
    return () => {
      clearFilter();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // USE EFFECT for applying filter to new shape
    if (stateApp.shapeActionsFilterSelected) {
      applyFilter();
    }
    if (stateApp.currentFeature.properties.shapeLabel && stateApp.map.getLayer("aoi_label_layer")) {
      const { map, currentFeature } = stateApp;
      // Changing the AOI source
      map?.getSource("aoi_label_source").setData({
        type: "FeatureCollection",
        features: [currentFeature],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateApp.currentFeature]);

  const closeDrawTool = () => {
    stateApp.draw.changeMode("direct_select", { featureId: props.selectedFeature.id });
    setFeatureProperty(stateApp.draw, props.selectedFeature.id, "shapeEdit", false);
    drawShapeLayerToggle(stateApp, "none");
    setStateApp((state) => ({ ...state, currentFeature: props.selectedFeature, shapeEdit: false }));
  };

  const actionShowWellsAndOwners = () => {
    if (isLine()) return;
    setStateApp((state) => ({
      ...state,
      gridPolygonString: getPolygonString(props.selectedFeature),
    }));
    dispatch(toggleMapGridCardAtived());
    closeDrawTool();
  };

  const clearFilter = () => {
    setStateNav((stateNav) => ({
      ...stateNav,
      drawingMode: null,
      filterFeatureId: null,
      filterDrawing: [],
    }));

    setStateApp((state) => ({
      ...state,
      shapeActionsFilterSelected: false,
    }));
  };

  const applyFilter = () => {
    let { selectedFeature } = props;
    let polygonString = getPolygonString(props.selectedFeature);

    //Changing shape to Blue
    stateApp.draw.changeMode("simple_select");

    getAbstractGeoContains({
      variables: {
        polygon: polygonString,
      },
    });

    setStateNav((stateNav) => ({
      ...stateNav,
      drawingMode: null,
      filterDrawing: ["within", selectedFeature],
    }));

    setStateApp((state) => ({
      ...state,
      shapeActionsFilterSelected: true,
    }));

    closeDrawTool();
  };

  const actionFilter = () => {
    if (isLine()) return;
    if (stateApp.shapeActionsFilterSelected) {
      clearFilter();
      // Changing back to original shape
      if (stateApp.draw.get(stateApp.currentFeature.id))
        stateApp.draw.changeMode("direct_select", {
          featureId: stateApp.currentFeature.id,
        });
    } else {
      applyFilter();
    }
    setSelectedAction("filter");
  };

  const actionEdit = (_shapeEdit) => {
    const { selectedFeature } = props;
    const shapeEdit = _shapeEdit ?? stateApp.shapeEdit;
    // If shape doesn't exist! AOI case
    if (!stateApp.draw.get(stateApp.currentFeature.id)) {
      stateApp.draw.add(stateApp.currentFeature);
    }

    // If filter is applied, then remove it
    clearFilter();

    if (!shapeEdit) {
      stateApp.draw.changeMode("direct_select", {
        featureId: selectedFeature.id,
      });
    } else {
      stateApp.draw.changeMode("static");
    }

    setStateNav((stateNav) => ({
      ...stateNav,
      drawingMode: DRAWING_MODES.DRAW_CIRCLE,
    }));
    setFeatureProperty(stateApp.draw, selectedFeature.id, "shapeEdit", !shapeEdit);
    drawShapeLayerToggle(stateApp, !shapeEdit ? "visible" : "none");
    setStateApp((state) => ({ ...state, currentFeature: selectedFeature, shapeEdit: !shapeEdit }));
    if (stateApp.selectedAoi) setSelectedAction("edit-aoi");
    else if (enableEditOnly) setSelectedAction("edit-shape");
  };

  const actionAOI = () => {
    if (isLine()) return;
    props.selectedFeature.properties.sdType = "interest";
    toggleSpatialDataCard(!showSpatialDataCard);
  };

  const isLine = () => {
    return stateApp.currentFeature.geometry?.type === "LineString" ? true : false;
  };

  const calculateShapeCenter = (shapeCoordinates) => polylabel(shapeCoordinates);

  const getAbstractGeoSource = (abstractShape) => {
    if (!abstractShape.properties.State && !abstractShape.properties.StateAbbreviation) {
      const featuresList = stateApp.map?.getSource("abstract_geo_source")._data.features;
      const foundFeatures = featuresList.filter((feature) => {
        var intersection = turf.intersect(abstractShape, feature);
        return !!intersection;
      });
      const result = foundFeatures.reduce(
        function (result, currentFeature) {
          var intersection = turf.intersect(abstractShape, currentFeature);
          const area = turf.area(intersection);
          return area > result.area ? { area, feature: currentFeature } : result;
        },
        { area: 0, feature: null }
      );
      if (result?.feature?.properties) abstractShape.properties = result.feature.properties;
    }
    return abstractShape;
  };

  const getParcelAndShapeName = (abstractShape) => {
    const properties = abstractShape?.properties;
    let township = properties?.Township;
    let range = properties?.Range;
    let section = properties?.ShortName;
    let parcelName;
    if (abstractShape.properties.State === "TX") {
      parcelName = abstractShape.properties.Survey + " " + abstractShape.properties.AbstractName;
    } else if (township && range && section) {
      parcelName = `T${township} R${range} — Section ${section}`;
    } else {
      parcelName = "PLSS Default Name";
    }
    if (parcelName.includes('undefined')) {
      parcelName = "PLSS Default Name";
    }
    return parcelName;
  };

  const saveAndOpenParcelDetail = () => {
    if (!user._id) {
      return;
    }
    let abstractShape = getAbstractGeoSource(stateApp.currentFeature);
    abstractShape.properties.State = abstractShape?.properties?.State || abstractShape?.properties?.StateAbbreviation;
    abstractShape.properties.Section = abstractShape?.properties?.Section || abstractShape?.properties?.ShortName;
    abstractShape.properties.Meridian = abstractShape?.properties?.Meridian || abstractShape?.properties?.PrincipalMeridian
    let originalProperties;
    let parcelName = getParcelAndShapeName(abstractShape);
    originalProperties = abstractShape.properties;

    const featureId = hat();
    const newShapeFeature = {
      id: featureId,
      type: "Feature",
      geometry: abstractShape.geometry,
      properties: {
        originalProperties: originalProperties,
        ...originalProperties,
        sdType: "parcel",
        shapeLabel: parcelName,
        projectName: "",
        sdNotes: "",
        sdGrossAcres: "",
        shapeArea: calculateLandArea(abstractShape),
        shapeCenter: calculateShapeCenter(abstractShape.geometry.coordinates),
        shapeLabelLayer: "",
        id: featureId,
      },
    };
    const customLayerData = {
      shapeJson: newShapeFeature,
      shape: JSON.stringify(newShapeFeature),
      layer: "parcel",
      name: parcelName,
      user: user._id,
      state: abstractShape.properties.State,
    };

    upsertCustomLayer({
      variables: { customLayer: customLayerData },
    });

    let layers = [...stateApp.customLayers];
    layers.push(customLayerData);

    setStateApp((state) => ({
      ...state,
      selectedParcel: {
        originalProperties: abstractShape.properties.State === "TX" ? abstractShape.properties : [],
        sdType: "parcel",
        shapeLabel: parcelName,
        projectName: "",
        sdNotes: "",
        sdGrossAcres: "",
        shapeArea: calculateLandArea(abstractShape),
        // needs to be a string to be consistent with queried data
        shapeCenter: JSON.stringify(calculateShapeCenter(abstractShape.geometry.coordinates)),
        shapeLabelLayer: "",
        id: featureId,
      },
      customLayers: layers,
    }));
    popupCloseAction();
  };

  const saveAndOpenShapeDetail = (layerType, layerSubType) => {
    if (!user._id) {
      return;
    }
    let abstractShape = getAbstractGeoSource(stateApp.currentFeature);
    let shapeSubtitle = "";
    let shapeName = getParcelAndShapeName(abstractShape);
    const state = abstractShape?.properties?.State || abstractShape?.properties?.StateAbbreviation;
    const section = abstractShape?.properties?.Section || abstractShape?.properties?.ShortName;
    let blockTownship = `BLK ${abstractShape?.properties?.Block || ''}`;
    if (!abstractShape?.properties?.Block && (abstractShape?.properties?.Township || '')) {
      blockTownship = `TOWN ${abstractShape?.properties?.Township || ''}`;
    }
    if (abstractShape?.properties?.County && state) {
      if (layerType === "unit") {
        if (abstractShape.properties.State === "TX")
          shapeSubtitle = `${abstractShape?.properties?.County}, ${state || ''} - ${blockTownship}${section ? `, SEC ${section}` : ""}`;
        else shapeSubtitle = `${abstractShape?.properties?.County}, ${state || ''} - ${shapeName}`;
      }
      if (layerType === "agreement") shapeSubtitle = `${abstractShape?.properties?.County}, ${state}`;
    }
    let properties = {};
    if (layerType === "unit") properties = { uName: shapeName, uNumber: "", uType: "", uOperator: "", uStatus: "" };
    if (layerType === "agreement") properties = { agreementName: shapeName, agreementType: layerSubType };
    const featureId = hat();
    const newShapeFeature = {
      id: featureId,
      type: "Feature",
      geometry: abstractShape.geometry,
      properties: {
        originalProperties: abstractShape.properties,
        shapeSubtitle,
        type: layerType,
        layerType,
        layerSubType,
        shapeLabel: shapeName,
        ...properties,
        shapeArea: calculateLandArea(abstractShape),
        shapeCenter: calculateShapeCenter(abstractShape.geometry.coordinates),
        id: featureId,
      },
    };
    const customLayerData = {
      shapeJson: newShapeFeature,
      shape: JSON.stringify(newShapeFeature),
      layer: layerSubType || layerType,
      name: shapeName,
      user: user._id,
    };

    upsertCustomLayer({
      variables: { customLayer: customLayerData },
    });

    let layers = [...stateApp.customLayers];
    layers.push(customLayerData);

    findBoundsMap([newShapeFeature], stateApp.map);

    setStateApp((state) => ({
      ...state,
      selectedShape: newShapeFeature.properties,
      customLayers: layers,
    }));
    drawBoundary(stateApp.map, newShapeFeature);
    popupCloseAction();
  };

  const updateAndOpenShapeDetail = (layerData) => {
    let abstractShape = getAbstractGeoSource(stateApp.currentFeature);
    layerData.shapeJson.geometry = abstractShape.geometry
    layerData.shapeJson.properties = {
      ...layerData.shapeJson.properties,
      originalProperties: abstractShape.properties,
      shapeArea: calculateLandArea(abstractShape),
      shapeCenter: calculateShapeCenter(abstractShape.geometry.coordinates),
    }
    const customLayerData = {
      shapeJson: layerData.shapeJson,
      shape: JSON.stringify(layerData.shapeJson),
      layer: layerData.layer,
      name: layerData.shapeLabel,
      user: layerData.user._id,
    };

    updateCustomLayer({
      variables: {
        customLayerId: layerData._id,
        customLayer: customLayerData,
      },
    });
    let layers = [...stateApp.customLayers];
    const layerIndex = layers.findIndex((l) => l._id === layerData._id)
    layers[layerIndex] = customLayerData
    const jsonLayer = copy(customLayerData.shapeJson)
    jsonLayer.layer = { id: customLayerData.layer };
    jsonLayer.id = layerData._id;

    findBoundsMap([jsonLayer], stateApp.map);
    drawBoundary(stateApp.map, jsonLayer);
    setStateApp((state) => ({
      ...state,
      selectedShape: {
        ...jsonLayer.properties,
        feature: jsonLayer,
        id: layerData._id,
      },
      // customLayers: layers,
    }));

    popupCloseAction();
    updateSelectedLayerFeature(layerData)
  }

  const deleteAOI = () => {
    // Turning off the confirmation modal
    setDeleteModal(false);

    // Delete request for actual AOI
    const { selectedAoi } = stateApp;
    deleteCustomLayer({
      variables: {
        customLayerId: selectedAoi.id || selectedAoi._id,
        customLayer: {
          IsDeleted: true,
        },
      },
    });

    // Deleting Shape from map
    stateApp.draw.delete(stateApp.currentFeature.id);

    // Popup Close Action
    popupCloseAction();
  };

  const handleDeleteAoiModal = () => {
    setDeleteModal(!isDeleteModal);
    drawBoundary(stateApp.map);
  };

  const confirmEditing = () => {
    let { currentFeature, selectedAoi } = stateApp;
    const shapeJson = {
      ...currentFeature,
      shapeArea: calculateLandArea(currentFeature),
      shapeCenter: calculateShapeCenter(currentFeature.geometry.coordinates),
    };
    const customLayerData = {
      shapeJson,
      shape: JSON.stringify(shapeJson),
      layer: selectedAoi.layer.id,
      user: stateApp.user.mongoId,
    };

    if (selectedAoi.layer.id === "interest") {
      customLayerData.name = currentFeature.properties.shapeLabel;
    }
    addCustomShapeProperties(currentFeature, stateApp.draw);

    updateCustomLayer({
      variables: {
        customLayerId: selectedAoi.id || selectedAoi._id,
        customLayer: customLayerData,
      },
      refetchQueries: ["getCustomLayers"],
      awaitRefetchQueries: true,
    });
    setTimeout(() => popupCloseAction(), 0);
  };

  const convertMenuAction = (action) => {
    setShowConvertMenu(false);
    const area = parseInt(calculateLandArea(props.selectedFeature).replace(/,/g, ""));
    if (area > 500000) {
      setLimitExceed(true);
    } else if (action === "convert") {
      setConvertTaxOwnerModal(true);
    } else if (action === "export") {
      setExportCSVModal(true);
    }
  };

  const enableEditOnly = stateApp.featureToEdit?.layer?.id === "parcel" || shapeTypeLayers.includes(stateApp.featureToEdit?.layer?.id);
  const isAoi = stateApp.selectedAoi?.layer?.id === "interest";
  const isCreateParcelMenu = Boolean(anchorEl);
  const isShapeResizeMode = stateApp.featureToEdit?.layer?.id === "parcel" || stateApp.featureToEdit?.layer?.id === "unit";

  const confirmShapeEditing = () => {
    let { featureToEdit, currentFeature } = stateApp;
    let drawFeature = null;
    if (isShapeResizeMode && stateApp.shapeEditMode === "rotate") {
      const quarters = ["NWNW", "NWSW", "SWNW", "SWSW", "SESW", "NESW", "SENW", "NENW", "SWSE", "NWSE", "SWNE", "NWNE", "SESE", "NESE", "SENE", "NENE"];

      let newShape = {};
      drawFeature = stateApp.draw.getAll().features[0];
      if (drawFeature) {
        currentFeature.geometry = drawFeature.geometry
        newShape = getDrawAdustedShape(currentFeature, quarters);
      }
      currentFeature.geometry = newShape.geometry;
    }
    if (isShapeResizeMode && stateApp.shapeEditMode === "resize") {
      drawFeature = stateApp.draw.getAll().features[0];
      currentFeature.geometry = drawFeature.geometry;
    }
    const shapeJson = {
      ...featureToEdit,
      geometry: currentFeature.geometry,
      properties: {
        ...featureToEdit.properties,
        shapeArea: calculateLandArea(currentFeature),
        shapeCenter: calculateShapeCenter(currentFeature.geometry.coordinates),
      }
    };
    const customLayerData = {
      shapeJson,
      shape: JSON.stringify(shapeJson),
      layer: featureToEdit.layer.id,
      user: stateApp.user.mongoId,
    };
    addCustomShapeProperties(currentFeature, stateApp.draw);
    updateCustomLayer({
      variables: {
        customLayerId: featureToEdit.id,
        customLayer: customLayerData,
      },
      refetchQueries: ["getCustomLayers"],
      awaitRefetchQueries: true,
    }).then(result => {
      if (isShapeResizeMode) {
        let newPath = '';
        if (stateApp.featureToEdit?.layer?.id === "parcel")
          newPath = `/map/parcels/${stateApp.currentFeature?.id}`;
        else newPath = `/map/units/${stateApp.currentFeature?.id}`;
        history.location.pathname !== newPath && history.replace(newPath)
      }
    });
    setTimeout(() => popupCloseAction({ rotateableFeature: drawFeature }), 0);
  };

  return (
    <Fragment>
      <Menu
        id="parcel-button"
        anchorEl={anchorEl}
        open={isCreateParcelMenu}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          "aria-labelledby": "parcel-button",
        }}
        className={classes.parcelPopover}
      >
        <MenuItem disabled>Shape Layer Type</MenuItem>
        <FeatureFlag feature={FEATURES.AGREEMENT_LAYER}>
          <MenuItem id="agreementItem" onClick={(event) => setAgreementAnchorEl(event.currentTarget)}>Agreement</MenuItem>
        </FeatureFlag>
        <MenuItem id="tractItem"
          onClick={e => {
            if (stateApp.showAddShapePopup) setTractAnchorEl(e.currentTarget)
            else saveAndOpenParcelDetail()
          }}
        >Tract</MenuItem>
        <MenuItem id="unitBoundaryItem"
          onClick={(e) => {
            if (stateApp.showAddShapePopup) setUnitAnchorEl(e.currentTarget)
            else saveAndOpenShapeDetail('unit')
          }}
        >Unit Boundary</MenuItem>
      </Menu>
      <Menu
        id="convert-button"
        anchorEl={anchorConvertEl}
        open={showConvertMenu}
        onClose={() => {
          setShowConvertMenu(false);
          setAnchorConvertEl(null);
        }}
        MenuListProps={{
          "aria-labelledby": "convert-button",
        }}
        className={classes.convertPopover}
      >
        <MenuItem onClick={() => convertMenuAction("convert")}>
          <Grid container spacing={0} className={classes.convertPopoverGrid}>
            <Grid container item xs={2} alignItems="center" className={classes.hoverGrid}>
              <ConvertContact width="35" height="20" color="black" />
            </Grid>
            <Grid container item xs={10} alignItems="center">
              <span className={classes.convertMenuColor}>Convert tax owners to contacts</span>
            </Grid>
          </Grid>
        </MenuItem>
        <MenuItem onClick={() => convertMenuAction("export")}>
          <Grid container spacing={0} className={classes.convertPopoverGrid}>
            <Grid container item xs={2} alignItems="center">
              <CloudDownloadOutlinedIcon className={classes.downloadIcon} />
            </Grid>
            <Grid container item xs={10} alignItems="center">
              <span className={classes.convertMenuColor}>Export selected data to CSV</span>
            </Grid>
          </Grid>
        </MenuItem>
      </Menu>

      <ShapeTypeMenu type='agreement' classes={classes} shapeAnchorEl={agreementAnchorEl} saveAndOpenShapeDetail={saveAndOpenShapeDetail} updateAndOpenShapeDetail={updateAndOpenShapeDetail} setShapeAnchorEl={setAgreementAnchorEl} />

      <ShapeTypeMenu type='tract' classes={classes} shapeAnchorEl={tractAnchorEl} saveAndOpenShapeDetail={saveAndOpenParcelDetail} updateAndOpenShapeDetail={updateAndOpenShapeDetail} setShapeAnchorEl={setTractAnchorEl} />

      <ShapeTypeMenu type='unit' classes={classes} shapeAnchorEl={unitAnchorEl} saveAndOpenShapeDetail={saveAndOpenShapeDetail} updateAndOpenShapeDetail={updateAndOpenShapeDetail} setShapeAnchorEl={setUnitAnchorEl} />

      <Fragment>
        <span className={classes.label}>{isLine() ? "Calc. Dist" : isAoi ? "AOI Area" : "Calc. Area"}</span>{" "}
        {calculateLandArea(props.selectedFeature)}
        <span className={`${classes.actions} ${isLine() ? classes.gray : ""}`}>
          {isShapeResizeMode ? (
            <ShapeEditActions shapeEdit={stateApp.shapeEdit} shapeEditMode={stateApp.shapeEditMode} actionFullEdit={actionEdit} setStateApp={setStateApp} stateApp={stateApp} />
          ) : (
            <>
              <FeatureFlag feature={FEATURES.MAPSHAPEEXPORT}>
                <Tooltip title="Bulk Actions" className={props.onlyAddShape || enableEditOnly ? classes.disableAction : ''}>
                  <IconButton
                    size="small"
                    disabled={props.onlyAddShape ? true : enableEditOnly}
                    aria-label="Parcel"
                    id="convert-button"
                    aria-controls="convert-button"
                    aria-haspopup="true"
                    onClick={(event) => {
                      setAnchorConvertEl(event.currentTarget);
                      setShowConvertMenu(true);
                    }}
                  >
                    <OfflineBoltIcon />
                  </IconButton>
                </Tooltip>
              </FeatureFlag>

              <Tooltip title="Grid" className={props.onlyAddShape || enableEditOnly ? classes.disableAction : ''}>
                <IconButton disabled={props.onlyAddShape ? true : enableEditOnly} size="small" onClick={actionShowWellsAndOwners} aria-label="Grid">
                  <GridOnIcon className={mapGridCardActivated ? "selected" : ""} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Filter" className={props.onlyAddShape || enableEditOnly ? classes.disableAction : ''}>
                <IconButton size="small" disabled={props.onlyAddShape ? true : enableEditOnly} onClick={actionFilter} aria-label="Filter">
                  <FilterAltIcon className={stateApp.shapeActionsFilterSelected ? "selected" : ""} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Add Shape to Layer" className={enableEditOnly ? classes.disableAction : anchorEl?.getAttribute('id') === 'parcel-button' ? classes.selectedAction : ''}>
                <IconButton
                  size="small"
                  disabled={enableEditOnly}
                  aria-label="Parcel"
                  id="parcel-button"
                  aria-controls="parcel-button"
                  aria-haspopup="true"
                  aria-expanded={isCreateParcelMenu ? "true" : undefined}
                  ref={addShapeToLayerButton}
                  onClick={(event) => {
                    console.log(1, event.currentTarget.getAttributeNames())
                    setAnchorEl(event.currentTarget)
                  }}
                >
                  {/* <LayerIcon color={addShapeToLayerButton.current?.title === 'Add Shape to Layer' ? 'primary' : "secondary"} /> */}
                  <LayerIcon color='secondary' />
                </IconButton>
              </Tooltip>

              <Tooltip title="Area of Interest" className={props.onlyAddShape || enableEditOnly ? classes.disableAction : ''}>
                <IconButton size="small" disabled={props.onlyAddShape ? true : enableEditOnly} onClick={actionAOI} aria-label="Area of Interest">
                  <span style={{ "& svg": { color: "white" } }}>AOI</span>
                </IconButton>
              </Tooltip>
            </>
          )}

          <span className={classes.divider}></span>
          {stateApp.currentFeature && (
            <Tooltip title="Add shape" className={props.onlyAddShape || selectedAction === "edit-aoi" ? classes.disableAction : ""}>
              <IconButton
                size="small"
                aria-label="Add shape"
                disabled={props.onlyAddShape}
                onClick={() => {
                  stateApp.draw.changeMode("static");
                  setStateApp((state) => ({
                    ...state,
                    changeDrawShapeType: true,
                  }));
                }}
              >
                <DrawPoly className={stateApp.shapeEdit ? "selected" : ""} />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Edit Active Shape" className={props.onlyAddShape || selectedAction === "edit-aoi" ? classes.disableAction : ""}>
            <IconButton size="small" aria-label="Edit Active Shape" disabled={props.onlyAddShape} onClick={() => {
              console.log('gg')
              if (!isShapeResizeMode) {
                actionEdit();
              }
            }}>
              <EditIcon className={stateApp.shapeEdit ? "selected" : ""} />
            </IconButton>
          </Tooltip>

          {stateApp.currentFeature.properties.shapeLabel && !enableEditOnly && (
            <Tooltip title="Delete Active Shape" className={props.onlyAddShape || !stateApp.currentFeature.properties.shapeLabel ? classes.disableAction : ""}>
              <IconButton
                size="small"
                aria-label="Delete Active Shape"
                disabled={props.onlyAddShape}
                onClick={() => {
                  if (!!stateApp.currentFeature.properties.shapeLabel) {
                    handleDeleteAoiModal();
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}

          {(selectedAction === "edit-aoi" ||
            selectedAction === "edit-shape" || stateApp.shapeEditMode === 'redraw') && (
              <span className={classes.multiSelectCheck}>
                <Tooltip title="Confirm Editing">
                  <IconButton
                    size="small"
                    aria-label="Set Boundary"
                    disabled={props.onlyAddShape}
                    onClick={() => {
                      if (selectedAction === "edit-aoi") confirmEditing();
                      else if (selectedAction === "edit-shape" || (stateApp.shapeEditMode === 'redraw')) confirmShapeEditing();
                    }}
                  >
                    <CheckCircle />
                  </IconButton>
                </Tooltip>
              </span>
            )}
        </span>
        {children}
        {error && (
          <div className={classes.footer}>
            <Typography color="error" align="center"></Typography>
          </div>
        )}
      </Fragment>
      <Modal
        open={isDeleteModal}
        onClose={handleDeleteAoiModal}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <div className={classes.modalContainer}>
          <h2 id="delete-modal-title">Are you sure?</h2>
          <p id="delete-modal-description">Are you sure want to remove this shape?</p>
          <div className={classes.buttonContainer}>
            <Button variant="contained" className={classes.button} onClick={handleDeleteAoiModal}>
              Back
            </Button>
            <Button variant="contained" className={classes.button} onClick={deleteAOI}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
      <LimitExceedPopUp open={limitExceed} onClose={() => setLimitExceed(false)} />
      {convertTaxOwnerModal && (
        <ConvertTaxOwnerToContactContainer
          open={convertTaxOwnerModal}
          onClose={() => {
            setConvertTaxOwnerModal(false);
            dispatch(resetShapeOwnerAction());
          }}
        />
      )}
      {exportCSVModal && (
        <ExportWellsOwnersContainer
          open={exportCSVModal}
          onClose={() => {
            setExportCSVModal(false);
            dispatch(resetShapeOwnerAction());
          }}
        />
      )}
    </Fragment>
  );
};

export default ShapeActionsPopup;
