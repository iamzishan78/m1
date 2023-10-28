import React, { useState, useEffect, useContext } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import set from "lodash/set";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import GavelIcon from "@material-ui/icons/Gavel";
import { useDispatch, useSelector } from "react-redux";
import Taps from "components/Shared/Taps";
import TabPanels from "components/Shared/TabPanels";
import { CUSTOMLAYER } from "graphQL/useQueryCustomLayer";
import { UPDATECUSTOMLAYER } from "graphQL/useMutationUpdateCustomLayer";
import SuggestedShapeTaxOwnersTable from "components/Table/TaxOwners/SuggestedShapeTaxOwnersTable";
import RelatedDetailsDocumentTable from "components/Table/Documents/RelatedDetailsDocumentTable";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import TabButtons from "components/Shared/TabPanels/TabButtons";
import UnitSummary from "./UnitSummary";
import UnitOwnersTable from "components/Table/Shape/UnitOwnersTable";
import UnitInterestOwnerTable from "components/Table/Shape/UnitInterestOwnerTable";
import ShapeWellInterestTable from "components/Table/Shape/ShapeWellInterestTable";
import AssociatedWellsShapeTable from "components/Table/Wells/AssociatedWellsShapeTable";
import UnitTractsTable from "components/Table/Shape/UnitTractsTable";
import AssociatedTractsShapeTable from "components/Table/Wells/AssociatedTractsShapeTable";
import Tags from "components/Shared/Tagger";
import { showSuccessMessage, showErrorMessage, setMapGridCardState } from "actions";
import { AppContext } from "AppContext";

import { copy } from "components/Shared/functions";
import { detailCardStyles } from "../style";
import { DrawerContextProvider } from "components/Land/components/Agreements/detailComponents/DrawerContext";
import ParcelAgreementTable from "components/Table/Parcel/ParcelAgreementTable";
import { jobController } from "hookstate/jobStateController";

export default function UnitDetailCard(props) {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedWellTab, setWellSelectedTab] = useState(0);
  const [selectedTractTab, setTractSelectedTab] = useState(0);
  const [uniObj, setUniObj] = useState();
  const [properties, setProperties] = useState();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [updateCustomLayer, { data: updatedUnit, loading: updatingLayer }] = useMutation(UPDATECUSTOMLAYER);

  const classes = detailCardStyles();
  const showSummary = true;
  const [isFiltered, setIsFiltered] = useState(false);

  const [getCustomLayer, { data: dataCustomLayer }] = useLazyQuery(CUSTOMLAYER);

  const contactsAdded = useSelector((state) => state?.common?.contactsAdded);

  useEffect(() => {
    dispatch(
      setMapGridCardState({
        mapGridCardActivated: false,
      })
    );
  }, []);

  useEffect(() => {
    if (contactsAdded)
      setSelectedTab(0)
  }, [contactsAdded]);

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
      let shape = JSON.parse(dataCustomLayer.customLayer.shape);
      if (dataCustomLayer.customLayer.shapeJson) shape = copy(dataCustomLayer.customLayer.shapeJson);
      setUniObj({
        ...dataCustomLayer.customLayer,
        shape,
      });
      setProperties(shape.properties);
    }

  }, [dataCustomLayer]);

  useEffect(() => {
    if (updatedUnit) {
      if (updatedUnit.updateCustomLayer?.success) {
        dispatch(showSuccessMessage("Successfully updated the unit"));
        // Updating stateapp parcel object
        const customLayer = updatedUnit.updateCustomLayer.customLayer;
        const feature = JSON.parse(customLayer.shape);

        if (feature?.properties?.netRoyalityAcres && !feature?.properties?.netRoyalityAcres?.unitNra)
          feature.properties.netRoyalityAcres.unitNra = feature.properties?.netRoyalityAcres?.calculatedNra
        setProperties({ ...feature.properties });

        feature.id = customLayer._id;
        feature.properties.id = customLayer._id;
        feature.layer = { id: "unit" };
        setStateApp((state) => ({
          ...state,
          selectedShape: { ...feature.properties, feature },
        }));
      } else {
        dispatch(showErrorMessage("Failed to update unit"));
      }
    }
  }, [updatedUnit]);

  const updateProperties = (e, field, value) => {
    e?.preventDefault();
    e?.stopPropagation();
    const shape = uniObj.shape;
    set(shape.properties, field, value);
    shape.properties[field] = value;

    const customLayer = {};

    if (field === "uName") {
      setStateApp((state) => ({
        ...state,
        selectedShape: { ...state.selectedShape, shapeLabel: value },
      }));
      shape.properties.shapeLabel = value;
      customLayer.name = value;
    }
    customLayer.shape = JSON.stringify(shape);
    customLayer.shapeJson = shape;

    updateCustomLayer({
      variables: {
        customLayerId: uniObj._id,
        customLayer,
        userId: stateApp.user.mongoId
      },
    }).then(() => {
      jobController.toggleBulkUpload()
    });
  };

  const updateCustomProperties = (type, value, key, id) => {
    const shape = uniObj.shape;
    set(properties, `${key}`, value);
    properties.custom_data_arr?.forEach((data) => {
      properties.custom_data[data.key] = data.value;
    });
    const customLayer = {};
    shape.properties = properties;
    customLayer.shape = JSON.stringify(shape);
    customLayer.shapeJson = shape;
    updateCustomLayer({
      variables: {
        customLayerId: uniObj._id,
        customLayer,
        userId: stateApp.user.mongoId
      },
    });
  };

  const OwnershipHeader = ({ selectedTab, setSelectedTab }) => (
    <TabButtons
      labels={["Unit Ownership", "Potential Ownership"]}
      value={selectedTab}
      setValue={(n) => {
        setSelectedTab(n);
      }}
    />
  );

  const DocumentHeader = () => {
    const classes = detailCardStyles();
    return (
      <div className={classes.documentHeader}>
        <DescriptionOutlinedIcon />
        <span>Documents</span>
      </div>
    );
  };

  const RunsheetHeader = () => {
    const classes = detailCardStyles();
    return (
      <div className={classes.documentHeader}>
        <GavelIcon />
        <span>RUNSHEET INSTRUMENTS</span>
      </div>
    );
  };

  const WellHeader = ({ selectedWellTab, setWellSelectedTab }) => (
    <TabButtons
      labels={["Unit Wells", "Potential Wells"]}
      value={selectedWellTab}
      setValue={(n) => {
        setWellSelectedTab(n);
      }}
    />
  );

  const TractHeader = ({ selectedTractTab, setTractSelectedTab }) => (
    <TabButtons
      labels={["Unit Tracts", "Potential Tracts"]}
      value={selectedTractTab}
      setValue={(n) => {
        setTractSelectedTab(n);
      }}
    />
  );

  return (
    (
      uniObj ? (
        <Grid item sm={12} container className={classes.gridWidthScroll}>
          <Grid item xs={12} style={{ padding: "10px 15px 0px 15px" }} className={classes.border}>
            <div className={classes.tags}>
              <Tags width="100%" targetSourceId={props.id} targetLabel="unit" publicLeftBottom />
            </div>
          </Grid>
          <Grid item sm={12}>
            <Taps
              tabLabels={["Summary", "Interest Owners", "Runsheet", "Wells", "Tracts", "Documents"]}
              openTabIdex={selectedTab}
              tabPanels={[
                <div style={{
                  height: "calc(100vh - 285px)",
                  overflow: "overlay"
                }}>
                  <UnitSummary
                    properties={properties}
                    setProperties={setProperties}
                    updateProperties={updateProperties}
                    updateCustomProperties={updateCustomProperties}
                    id={props.id}
                    customLayer={uniObj}
                    updating={updatingLayer}
                  />
                </div>,
                <TabPanels
                  value={selectedTab}
                  panels={[
                    <div className={!isFiltered ? classes.subContent : classes.subContent3}>
                      <UnitInterestOwnerTable
                        esIndex="shapeowners_flat"
                        customLayer={uniObj}
                        parent="ownersPerUnit"
                        shapeType="Unit"
                        targetLabel="Unit Ownership"
                        setIsFiltered={setIsFiltered}
                        header={<OwnershipHeader selectedTab={selectedTab} setSelectedTab={setSelectedTab} />}
                        dense
                      />
                      {/* <UnitOwnersTable
                    customLayer={uniObj}
                    parent="ownersPerUnit"
                    shapeType="Unit"
                    targetLabel="Unit Ownership"
                    header={<OwnershipHeader selectedTab={selectedTab} setSelectedTab={setSelectedTab} />}
                    setSelectedTab={setSelectedTab}
                    setIsFiltered={setIsFiltered}
                    dense
                  /> */}
                    </div>,
                    <div className={!isFiltered ? classes.subContent : classes.subContent3}>
                      <SuggestedShapeTaxOwnersTable
                        customLayer={uniObj}
                        parent="potentialOwnersPerUnit"
                        shapeType="Unit"
                        targetLabel="well"
                        jobType="SHAPEOWNER"
                        jobName="Convert potential owner to unit owner"
                        header={<OwnershipHeader selectedTab={selectedTab} setSelectedTab={setSelectedTab} />}
                        setSelectedTab={setSelectedTab}
                        setIsFiltered={setIsFiltered}
                        dense
                      />
                    </div>,
                  ]}
                />,
                <div className={showSummary ? classes.subContent : classes.subContent2}>
                  <ParcelAgreementTable
                    esIndex='runsheetinstrument_flat'
                    parent="associatedRunsheetPerParcel"
                    targetLabel="parcelRunsheet"
                    customLayer={copy(uniObj)}
                    dense
                    header={<RunsheetHeader />}
                    isCheckboxSticky={true}
                  />
                </div>,
                <TabPanels
                  value={selectedWellTab}
                  panels={[
                    <div className={showSummary ? classes.subContent : classes.subContent2}>
                      <DrawerContextProvider>
                        <ShapeWellInterestTable
                          customLayer={uniObj}
                          shapeType="Unit"
                          parent="associatedWellsPerUnits"
                          targetLabel="well"
                          header={<WellHeader selectedWellTab={selectedWellTab} setWellSelectedTab={setWellSelectedTab} />}
                          showTracks
                          dense
                        />
                      </DrawerContextProvider>
                    </div>,
                    <div className={showSummary ? classes.subContent : classes.subContent2}>
                      <AssociatedWellsShapeTable
                        customLayer={uniObj}
                        shapeType="Unit"
                        parent="associatedWellsPerUnits"
                        targetLabel="well"
                        header={<WellHeader selectedWellTab={selectedWellTab} setWellSelectedTab={setWellSelectedTab} />}
                        showTracks
                        setSelectedTab={setWellSelectedTab}
                        dense
                      />
                    </div>,
                  ]}
                />,
                <TabPanels
                  value={selectedTractTab}
                  panels={[
                    <div className={showSummary ? classes.subContent : classes.subContent2}>
                      <UnitTractsTable
                        customLayer={uniObj}
                        shapeType="Unit"
                        header={<TractHeader selectedTractTab={selectedTractTab} setTractSelectedTab={setTractSelectedTab} />}
                        dense
                      />
                    </div>,
                    <div className={showSummary ? classes.subContent : classes.subContent2}>
                      <AssociatedTractsShapeTable
                        customLayer={uniObj}
                        shapeType="Unit"
                        header={<TractHeader selectedTractTab={selectedTractTab} setTractSelectedTab={setTractSelectedTab} />}
                        setSelectedTab={setTractSelectedTab}
                        dense
                      />
                    </div>,
                  ]}
                />,
                <div className={`${showSummary ? classes.subContent : classes.subContent2} ${classes.parcelDocument}`}>
                  <RelatedDetailsDocumentTable
                    customLayer={uniObj}
                    relatedObjectType="Shape"
                    name="Unit"
                    header={<DocumentHeader />}
                    addAble={{ type: "UnitDocument" }}
                    dense
                    targetLabel="documents"
                  />
                </div>,
              ]}
            />
          </Grid>
        </Grid>
      ) : (
        <div style={{ padding: "20px", position: "absolute", height: "100%", width: "100%" }}>
          <CircularProgress size={80} disableShrink color="secondary" />
        </div>
      )
    ))
}
