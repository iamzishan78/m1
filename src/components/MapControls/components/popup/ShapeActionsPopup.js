import React, { useEffect, useContext, useState, Fragment } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import get from "lodash/get";
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
import OfflineBoltIcon from '@material-ui/icons/OfflineBoltOutlined';
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined';
import { default as CheckCircle } from "../../../Shared/svgIcons/check-circle";
import ConvertContact from "components/Shared/svgIcons/convert_contact";
import LayerIcon from "@material-ui/icons/Layers";
import FilterAltIcon from "../../../Shared/svgIcons/FilterAltIcon";
import Typography from "@material-ui/core/Typography";
import { area, convertArea, length } from "@turf/turf";
import { AppContext } from "AppContext";
import { NavigationContext, DRAWING_MODES } from "components/Navigation/NavigationContext";
import { UPSERTCUSTOMLAYER } from "graphQL/useMutationUpsertCustomLayer";
import { USERBYEMAIL } from "graphQL/useQueryUserByEmail";
import { ABSTRACTGEOCONTAINSQUERY } from "graphQL/useQueryAbstractGeoContains";
import { UPDATECUSTOMLAYER } from "graphQL/useMutationUpdateCustomLayer";
import { addCustomShapeProperties, drawBoundary } from "../../components/DrawShapes/drawShapesHelpers";
import Tooltip from "@material-ui/core/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { 
  // toggleMapGridCardAtived, 
  setMapGridCardState } from "actions";
import { gql } from "@apollo/client";
import { setFeatureProperty, drawShapeLayerToggle, findBoundsMap } from "components/MapControls/commonHelper";
import { shapeTypeLayers } from "components/Shared/functions/shapeLayer";
import LimitExceedPopUp from "components/MapControls/components/popup/LimitExceedPopup"
import { ConvertTaxOwnerToContactContainer, ExportWellsOwnersContainer } from 'store/containers'

const ShapeActionsPopup = (props) => {
  const dispatch = useDispatch();
  const { classes, children, toggleSpatialDataCard, showSpatialDataCard, popupCloseAction } = props;
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
      console.log(`newCustomLayer: ${JSON.stringify(customLayer)}`);
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

  const [updateCustomLayer] = useMutation(UPDATECUSTOMLAYER, {
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
    if (customLayer.layer === 'parcel') key = 'selectedParcel'
    if (shapeTypeLayers.includes(customLayer.layer)) key = 'selectedShape'

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
      map.getSource("aoi_label_source").setData({
        type: "FeatureCollection",
        features: [currentFeature],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateApp.currentFeature]);

  const formatNumber = (number) => {
    return number.toLocaleString("en-US", { maximumFractionDigits: 2 });
  };

  const calculateLandArea = (selectedFeature) => {
    if (!selectedFeature) {
      selectedFeature = props.selectedFeature;
    }
    if (selectedFeature) {
      if (selectedFeature.geometry.type === "Polygon" || selectedFeature.geometry.type === "MultiPolygon") {
        const areaInSqMeters = area(selectedFeature);
        const areaInAcres = convertArea(areaInSqMeters, "meters", "acres");
        return `${formatNumber(Math.round(areaInAcres * 100) / 100)}`;
      }
      if (selectedFeature.geometry.type === "LineString") {
        const distanceInMiles = length(selectedFeature, { units: "miles" });
        return `${formatNumber(Math.round(distanceInMiles * 100) / 100)} miles`;
      }
    }
  };

  const getSelectedFeaturePolygonString = () => {
    let feature = props.selectedFeature;

    let polygonString = "POLYGON((";
    feature.geometry.coordinates[0].forEach((coordinate, index) => {
      polygonString += coordinate[0] + " " + coordinate[1];
      if (index < feature.geometry.coordinates[0].length - 1) {
        polygonString += ", ";
      }
    });
    polygonString += "))";

    return polygonString;
  };

  const actionShowWellsAndOwners = () => {
    if (isLine()) return;
    setStateApp((state) => ({
      ...state,
      gridPolygonString: getSelectedFeaturePolygonString(),
    }));
    // dispatch(toggleMapGridCardAtived());
    dispatch(
      setMapGridCardState({
        mapGridCardActivated: true,
        mapGridCardActiveTap: 2,
      })
    );
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
    let polygonString = getSelectedFeaturePolygonString();

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

  const actionEdit = () => {
    const { selectedFeature } = props;

    console.log("FILTER EDIT TRIGGER STATEAPP", stateApp);

    // If shape doesn't exist! AOI case
    if (!stateApp.draw.get(stateApp.currentFeature.id)) {
      stateApp.draw.add(stateApp.currentFeature);
    }

    // If filter is applied, then remove it

    console.log("FILTER STATEAPP", stateApp);
    clearFilter();

    // if (stateApp.shapeActionsFilterSelected) {
    //   clearFilter();
    // }
    if (!stateApp.shapeEdit) {
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
    setFeatureProperty(stateApp.draw, selectedFeature.id, "shapeEdit", !stateApp.shapeEdit);
    drawShapeLayerToggle(stateApp, !stateApp.shapeEdit ? "visible" : "none");
    setStateApp((state) => ({ ...state, currentFeature: selectedFeature, shapeEdit: !state.shapeEdit }));
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
      const featuresList = stateApp.map.getSource("abstract_geo_source")._data.features;
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
    return abstractShape
  }

  const getParcelAndShapeName = (abstractShape) => {
    const properties = abstractShape?.properties;
    let township = properties?.Township;
    let range = properties?.Range;
    let section = properties?.ShortName;
    let parcelName
    if (abstractShape.properties.State === "TX") {
      parcelName = abstractShape.properties.Survey + " " + abstractShape.properties.AbstractName;
    } else if (township && range && section) {
      parcelName = `T${township} R${range} — Section ${section}`;
    } else {
      parcelName = "PLSS Default Name";
    }
    return parcelName
  }

  const saveAndOpenParcelDetail = () => {
    if (!user._id) {
      return;
    }
    let abstractShape = getAbstractGeoSource(stateApp.currentFeature);



    let originalProperties;
    let parcelName = getParcelAndShapeName(abstractShape)
    originalProperties = [abstractShape.properties];

    const featureId = hat();
    const newShapeFeature = {
      id: featureId,
      type: "Feature",
      geometry: abstractShape.geometry,
      properties: {
        originalProperties: originalProperties,
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

  const saveAndOpenShapeDetail = (layerType) => {
    if (!user._id) {
      return;
    }
    let abstractShape = getAbstractGeoSource(stateApp.currentFeature);
    let shapeSubtitle = ''
    const state = abstractShape?.properties?.State || abstractShape?.properties?.StateAbbreviation
    const section = abstractShape?.properties?.Section || abstractShape?.properties?.ShortName
    let blockTownship = `BLK ${abstractShape?.properties?.Block}`
    if (!abstractShape?.properties?.Block && abstractShape?.properties?.Township) {
      blockTownship = `TOWN ${abstractShape?.properties?.Township}`
    }
    if (abstractShape?.properties?.County && state) {
      if (layerType === 'unit') shapeSubtitle = `${abstractShape?.properties?.County}, ${state} - ${blockTownship}, SEC ${section}`
      if (layerType === 'agreement') shapeSubtitle = `${abstractShape?.properties?.County}, ${state}`
    }
    let shapeName = getParcelAndShapeName(abstractShape)
    let properties = {}
    if (layerType === 'unit')
      properties = { uName: shapeName, uNumber: "", uType: "", uOperator: "", uStatus: "" }
    if (layerType === 'agreement')
      properties = { agreementName: shapeName }
    const featureId = hat();
    const newShapeFeature = {
      id: featureId,
      type: "Feature",
      geometry: abstractShape.geometry,
      properties: {
        originalProperties: abstractShape.properties,
        shapeSubtitle,
        type: layerType,
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
      layer: layerType,
      name: shapeName,
      user: user._id,
    };

    upsertCustomLayer({
      variables: { customLayer: customLayerData },
    });

    let layers = [...stateApp.customLayers];
    layers.push(customLayerData);

    findBoundsMap([newShapeFeature], stateApp.map)

    setStateApp((state) => ({
      ...state,
      selectedShape: newShapeFeature.properties,
      customLayers: layers,
    }));
    drawBoundary(stateApp.map, newShapeFeature);
    popupCloseAction();
  };

  const deleteAOI = () => {
    // Turning off the confirmation modal
    setDeleteModal(false);

    // Delete request for actual AOI
    const { selectedAoi } = stateApp;
    updateCustomLayer({
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
    }
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

  const confirmShapeEditing = () => {
    let { featureToEdit, currentFeature } = stateApp;
    const shapeJson = {
      ...currentFeature,
      shapeArea: calculateLandArea(currentFeature),
      shapeCenter: calculateShapeCenter(currentFeature.geometry.coordinates),
    }
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
    });
    setTimeout(() => popupCloseAction(), 0);
  };

  const convertMenuAction = (action) => {
    setShowConvertMenu(false)
    const area = parseInt(calculateLandArea().replace(/,/g, ''));
    if(area > 500000){
      setLimitExceed(true);
    }else if(action === 'convert'){
      setConvertTaxOwnerModal(true);
    }else if(action === 'export'){
      setExportCSVModal(true);
    } 
  }

  const enableEditOnly = stateApp.featureToEdit?.layer?.id === "parcel" || shapeTypeLayers.includes(stateApp.featureToEdit?.layer?.id)
  const isAoi = stateApp.selectedAoi?.layer?.id === "interest";
  const isCreateParcelMenu = Boolean(anchorEl);

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
        <MenuItem onClick={() => saveAndOpenShapeDetail('agreement')} >Agreement</MenuItem>
        <MenuItem onClick={saveAndOpenParcelDetail}>Tract</MenuItem>
        <MenuItem onClick={() => saveAndOpenShapeDetail('unit')}>Unit Boundary</MenuItem>
      </Menu>
      <Menu
        id="convert-button"
        anchorEl={anchorConvertEl}
        open={showConvertMenu}
        onClose={() => setAnchorConvertEl(null)}
        MenuListProps={{
          "aria-labelledby": "convert-button",
        }}
        className={classes.convertPopover}
      >
        <MenuItem onClick={() => convertMenuAction('convert')}>
          <Grid container spacing={0}>
            <Grid container item xs={2} alignItems="center">
              <ConvertContact color="#A6A6A6" width="35" height="20" />
            </Grid>
            <Grid container item xs={10} alignItems="center">
              <span className={classes.convertMenuColor} >Convert tax owners to contacts</span>
            </Grid>
          </Grid>
        </MenuItem>
        <MenuItem onClick={() => convertMenuAction('export')}>
        <Grid container spacing={0}>
            <Grid container item xs={2} alignItems="center">
              <CloudDownloadOutlinedIcon className={classes.downloadIcon}/>
            </Grid>
            <Grid container item xs={10} alignItems="center">
            <span className={classes.convertMenuColor} >Export selected data to CSV</span>
            </Grid>
          </Grid>
        </MenuItem>
      </Menu>
      <Fragment>
        <span class={classes.label}>{isLine() ? "Calc. Dist" : isAoi ? "AOI Area" : "Calc. Area"}</span> {calculateLandArea()}
        <span className={`${classes.actions} ${isLine() ? classes.gray : ""}`}>
          <Tooltip title="Area of Interest" className={enableEditOnly && classes.disableAction}>
            <IconButton 
              size="small"
              disabled={enableEditOnly}
              aria-label="Parcel"
              id="convert-button"
              aria-controls="convert-button"
              aria-haspopup="true"
              onClick={(event) => {
                setAnchorConvertEl(event.currentTarget)
                setShowConvertMenu(true)
              }}
            >
              <OfflineBoltIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Grid" className={enableEditOnly && classes.disableAction}>
            <IconButton disabled={enableEditOnly} size="small" onClick={actionShowWellsAndOwners} aria-label="Grid">
              <GridOnIcon className={mapGridCardActivated ? "selected" : ""} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Filter" className={enableEditOnly && classes.disableAction}>
            <IconButton size="small" disabled={enableEditOnly} onClick={actionFilter} aria-label="Filter">
              <FilterAltIcon className={stateApp.shapeActionsFilterSelected ? "selected" : ""} />
            </IconButton>
          </Tooltip>

          {/* {stateApp.isAbstractedLayersPolygon && ( */}
          <Tooltip title="Create Parcel" className={enableEditOnly && classes.disableAction}>
            <IconButton
              size="small"
              disabled={enableEditOnly}
              aria-label="Parcel"
              id="parcel-button"
              aria-controls="parcel-button"
              aria-haspopup="true"
              aria-expanded={isCreateParcelMenu ? "true" : undefined}
              onClick={(event) => setAnchorEl(event.currentTarget)}
            >
              <LayerIcon color="secondary" />
            </IconButton>
          </Tooltip>
          {/* )} */}

          <Tooltip title="Area of Interest" className={enableEditOnly && classes.disableAction}>
            <IconButton size="small" disabled={enableEditOnly} onClick={actionAOI} aria-label="Area of Interest">
              <span style={{ color: 'white' }}>AOI</span>
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit Active Shape" className={selectedAction === "edit-aoi" ? classes.disableAction : ""}>
            <IconButton size="small" aria-label="Edit Active Shape" onClick={actionEdit}>
              <EditIcon className={stateApp.shapeEdit ? "selected" : ""} />
            </IconButton>
          </Tooltip>

          {stateApp.currentFeature.properties.shapeLabel && !enableEditOnly && (
            <Tooltip title="Delete Active Shape" className={!stateApp.currentFeature.properties.shapeLabel ? classes.disableAction : ""}>
              <IconButton
                size="small"
                aria-label="Delete Active Shape"
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

          {selectedAction === "edit-aoi" && (
            <span className={classes.multiSelectCheck}>
              <Tooltip title="Confirm Editing">
                <IconButton size="small" aria-label="Set Boundary" onClick={confirmEditing}>
                  <CheckCircle />
                </IconButton>
              </Tooltip>
            </span>
          )}
          {selectedAction === "edit-shape" && (
            <span className={classes.multiSelectCheck}>
              <Tooltip title="Confirm Editing">
                <IconButton size="small" aria-label="Set Boundary" onClick={confirmShapeEditing}>
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
        <ConvertTaxOwnerToContactContainer open={convertTaxOwnerModal} onClose={() => setConvertTaxOwnerModal(false)}/>
      )}
      {exportCSVModal && (
        <ExportWellsOwnersContainer open={exportCSVModal} onClose={() => setExportCSVModal(false)}/>
      )}
    </Fragment>
  );
};

export default ShapeActionsPopup;
