import React, { useState, useEffect, useContext, useMemo } from 'react';
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
import RelatedDetailsDocumentTable from "components/Table/Documents/RelatedDetailsDocumentTable";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import TabButtons from "components/Shared/TabPanels/TabButtons";
import UnitSummary from "./UnitSummary";
import ShapeWellInterestTable from "components/Table/Shape/ShapeWellInterestTable";
import AssociatedWellsShapeTable from "components/Table/Wells/AssociatedWellsShapeTable";
import UnitTractsTable from "components/Table/Shape/UnitTractsTable";
import AssociatedTractsShapeTable from "components/Table/Wells/AssociatedTractsShapeTable";
import Tags from "components/Shared/Tagger";
import { showSuccessMessage, showErrorMessage } from "actions";
import { AppContext } from "AppContext";
import { copy } from 'components/Shared/functions';
import { popupController } from 'hookstate/popupStateController';
import MRTTable from 'components/MRTTable';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import { detailCardStyles } from '../style';
import { DrawerContextProvider } from "components/Land/components/Agreements/detailComponents/DrawerContext";
import ParcelAgreementTable from "components/Table/Parcel/ParcelAgreementTable";
import { simpleTableGlobalController } from "hookstate/simpleTableController";
import { jobController } from "hookstate/jobStateController";
import MRSimpleTable from "components/MRSimpleTable";
import { layerController } from 'hookstate/layerStateController';
import { potentialOwnerTableKey } from 'components/MRSimpleTable/Schema/potential_owners_schema';
import { getShapeSubtitle } from '../helper';
import { mapControlsController } from 'hookstate/mapControlsController';

const setSelectedTab = simpleTableGlobalController.setSelectedTab

export default function UnitDetailCard(props) {
  const dispatch = useDispatch();
  const [selectedWellTab, setWellSelectedTab] = useState(0);
  const [selectedTractTab, setTractSelectedTab] = useState(0);
  const [uniObj, setUniObj] = useState();
  const [properties, setProperties] = useState();
  const [stateApp, setStateApp] = useContext(AppContext);
  const OwnersPerUnitGridState = tableController('OwnersPerUnitTable').useState(['data']).stateValue;
  const [updateCustomLayer, { data: updatedUnit, loading: updatingLayer }] = useMutation(UPDATECUSTOMLAYER);

  const globalState = tableGlobalController.useState(['refetch'])
  const globalStateValues = globalState.stateValues;

  const { stateValues: { tabKey: selectedTab } } = simpleTableGlobalController.useState(['tabKey'])

  const classes = detailCardStyles();
  const showSummary = true;

  const [getCustomLayer, { data: dataCustomLayer, refetch: refetchCustomLayer }] = useLazyQuery(CUSTOMLAYER);

  const contactsAdded = useSelector(state => state?.common?.contactsAdded);

  useEffect(() => {
    if (dataCustomLayer)
      refetchCustomLayer()
  }, [globalStateValues?.refetch]);

  useEffect(() => {
    mapControlsController.updateState({
      mapGridCardActivated: false,
    });
  }, []);

  useEffect(() => {
    if (contactsAdded) setSelectedTab(0);
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
  }, [dataCustomLayer, OwnersPerUnitGridState?.data]);

  const overrideMeta = useMemo(() => ({
    tabLabels: ['Unit Ownership', 'Potential Ownership'],
    defaultFilters: [
      { field: 'shape._id', value: dataCustomLayer?.customLayer?._id },
      { field: 'contact.IsDeleted', value: 'false' },
    ],
    customProps: { customLayer: dataCustomLayer?.customLayer },
  }), [dataCustomLayer]);


  useEffect(() => {
    if (updatedUnit) {
      if (updatedUnit.updateCustomLayer?.success) {
        dispatch(showSuccessMessage('Successfully updated the unit'));
        // Updating stateapp parcel object
        const { customLayer } = updatedUnit.updateCustomLayer;
        const feature = JSON.parse(customLayer.shape);

        if (feature?.properties?.netRoyalityAcres && !feature?.properties?.netRoyalityAcres?.unitNra)
          feature.properties.netRoyalityAcres.unitNra = feature.properties?.netRoyalityAcres?.calculatedNra;

        feature.id = customLayer._id;
        feature.properties.id = customLayer._id;
        feature.layer = { id: 'unit' };
        popupController.updateState({
          selectedShape: { ...feature.properties, feature },
        });
        setStateApp((state) => ({
          ...state,
          selectedShape: { ...feature.properties, feature },
        }));
        setProperties({ ...feature.properties });
      } else {
        dispatch(showErrorMessage('Failed to update unit'));
      }
    }
  }, [updatedUnit]);

  const updateProperties = (e, field, value) => {
    e?.preventDefault();
    e?.stopPropagation();
    const { shape } = uniObj;
    /* -------------------------------- Data Fix -------------------------------- */
    if (field.includes('originalProperties.')) delete shape.properties[field]
    if (field.includes('originalProperties.State')) set(shape.properties, 'originalProperties.StateAbbreviation', value);
    if (field.includes('originalProperties.Section')) set(shape.properties, 'originalProperties.ShortName', value);
    if (field.includes('originalProperties.Meridian')) set(shape.properties, 'originalProperties.PrincipalMeridian', value);
    /* -------------------------------- Data Fix -------------------------------- */
    set(shape.properties, field, value);

    const customLayer = {};

    if (field === 'uName') {
      popupController.updateState({
        selectedShape: { ...popupController.getValue('selectedShape'), shapeLabel: value },
      });
      shape.properties.shapeLabel = value;
      customLayer.name = value;
    }

    if (field.includes('originalProperties')) {
      set(shape.properties, field.replace('originalProperties.', '').toLowerCase(), value);
      const shapeSubtitle = getShapeSubtitle(shape?.properties?.originalProperties, shape.properties.uName || shape.properties.shapeLabel)
      shape.properties.shapeSubtitle = shapeSubtitle
      shape.shapeSubtitle = shapeSubtitle
      popupController.updateState({
        selectedShape: { ...popupController.getValue('selectedShape'), shapeSubtitle },
      });
    }
    customLayer.shape = JSON.stringify(shape);
    customLayer.shapeJson = shape;

    updateCustomLayer({
      variables: {
        customLayerId: uniObj._id,
        customLayer,
        userId: stateApp.user.mongoId,
      },
    }).then((res) => {
      jobController.toggleBulkUpload()
      layerController.resetBounds(res?.data?.updateCustomLayer?.customLayer?.layer)
    });
  };

  const updateCustomProperties = (type, value, key, id) => {
    const { shape } = uniObj;
    set(properties, `${key}`, value);
    properties.custom_data_arr?.forEach(data => {
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
        userId: stateApp.user.mongoId,
      },
    }).then((res) => {
      jobController.toggleBulkUpload()
      layerController.resetBounds(res?.data?.updateCustomLayer?.customLayer?.layer)
    });
  };

  function DocumentHeader() {
    const classes = detailCardStyles();
    return (
      <div className={classes.documentHeader}>
        <DescriptionOutlinedIcon />
        <span>Documents</span>
      </div>
    );
  }

  function RunsheetHeader() {
    const classes = detailCardStyles();
    return (
      <div className={classes.documentHeader}>
        <GavelIcon />
        <span>RUNSHEET INSTRUMENTS</span>
      </div>
    );
  }

  function WellHeader({ selectedWellTab, setWellSelectedTab }) {
    return (
      <TabButtons
        labels={['Unit Wells', 'Potential Wells']}
        value={selectedWellTab}
        setValue={n => {
          setWellSelectedTab(n);
        }}
      />
    );
  }

  function TractHeader({ selectedTractTab, setTractSelectedTab }) {
    return (
      <TabButtons
        labels={['Unit Tracts', 'Potential Tracts']}
        value={selectedTractTab}
        setValue={n => {
          setTractSelectedTab(n);
        }}
      />
    );
  }

  return (
    (
      uniObj ? (
        <Grid item sm={12} container className={classes.gridWidthScroll}>
          <Grid item xs={12} style={{ padding: '10px 15px 0px 15px' }} className={classes.border}>
            <div className={classes.tags}>
              <Tags width="100%" targetSourceId={props.id} targetLabel="unit" publicLeftBottom hideCheckBox />
            </div>
          </Grid>
          <Grid item sm={12}>
            <Taps
              tabLabels={['Summary', 'Interest Owners', 'Runsheet', 'Wells', 'Tracts', 'Documents']}
              openTabIdex={selectedTab}
              tabPanels={[
                <div
                  style={{
                    height: 'calc(100vh - 285px)',
                    overflow: 'overlay',
                    overflowX: 'hidden'
                  }}
                >
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
                    <div>
                      <MRTTable name="OwnersPerUnitTable" overrideMeta={overrideMeta} hideSharedCommentCheck />
                    </div>,
                    <div>
                      <MRSimpleTable
                        name={potentialOwnerTableKey}
                        overrideMeta={{
                          tabLabels: ['Unit Ownership', 'Potential Ownership'],
                          customProps: {
                            customLayer: uniObj,
                            year: 2023,
                            filterByWells: false
                          },
                        }}
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
                        header={
                          <TractHeader selectedTractTab={selectedTractTab} setTractSelectedTab={setTractSelectedTab} />
                        }
                        dense
                      />
                    </div>,
                    <div className={showSummary ? classes.subContent : classes.subContent2}>
                      <AssociatedTractsShapeTable
                        customLayer={uniObj}
                        shapeType="Unit"
                        header={
                          <TractHeader selectedTractTab={selectedTractTab} setTractSelectedTab={setTractSelectedTab} />
                        }
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
                    addAble={{ type: 'UnitDocument' }}
                    dense
                    targetLabel="documents"
                  />
                </div>,
              ]}
            />
          </Grid>
        </Grid>
      ) : (
        <div style={{ padding: '20px', position: 'absolute', height: '100%', width: '100%' }}>
          <CircularProgress size={80} disableShrink color="secondary" />
        </div>
      )
    ))
}
