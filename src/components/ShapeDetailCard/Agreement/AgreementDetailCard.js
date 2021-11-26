import React, { useState, useEffect, useContext } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import set from 'lodash/set'
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import GavelIcon from '@material-ui/icons/Gavel';
import { useDispatch } from "react-redux";
import Taps from "components/Shared/Taps";
import TabPanels from "components/Shared/TabPanels"
import { CUSTOMLAYER } from "graphQL/useQueryCustomLayer";
import { UPDATECUSTOMLAYER } from "graphQL/useMutationUpdateCustomLayer";
import SuggestedShapeTaxOwnersTable from "components/Table/TaxOwners/SuggestedShapeTaxOwnersTable";
import RelatedDetailsDocumentTable from "components/Table/Documents/RelatedDetailsDocumentTable";
import ParcelDetailsRunsheetTable from "components/Table/Parcel/ParcelDetailsRunsheetTable";
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import TabButtons from "components/Shared/TabPanels/TabButtons"
import AgreementSummary from "./AgreementSummary";
import ProvisionsTab from "./ProvisionsTab";
import UnitOwnersTable from "components/Table/Unit/UnitOwnersTable";
import UnitWellInterestTable from "components/Table/Unit/UnitWellInterestTable";
import AssociatedWellsUnitTable from "components/Table/Wells/AssociatedWellsUnitTable";
import UnitTractsTable from "components/Table/Unit/UnitTractsTable";
import AssociatedTractsUnitTable from "components/Table/Wells/AssociatedTractsUnitTable";
import Tags from "components/Shared/Tagger";
import { showSuccessMessage, showErrorMessage } from "actions";
import { AppContext } from "AppContext";

import { copy } from "components/Shared/functions";
import { detailCardStyles } from "../style";
import { GET_AGREEMENT_PROVISIONS } from "graphQL/useQueryGetAgreementProvisions";
import { GET_STANDARD_PROVISIONS } from "graphQL/useQueryGetStandardProvisions";

export default function AgreementDetailCard(props) {

  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState(props.selectTabIndex || 0);
  const [selectedWellTab, setWellSelectedTab] = useState(0);
  const [selectedTractTab, setTractSelectedTab] = useState(0);
  const [uniObj, setUniObj] = useState();
  const [properties, setProperties] = useState();
  const [_, setStateApp] = useContext(AppContext);
  const [updateCustomLayer, { data: updatedUnit }] = useMutation(
    UPDATECUSTOMLAYER,
  );

  const classes = detailCardStyles();
  const showSummary = true

  const [getCustomLayer, { data: dataCustomLayer }] = useLazyQuery(CUSTOMLAYER);
  const [getAgreementProvisions, { data: agreementProvisions }] = useLazyQuery(GET_AGREEMENT_PROVISIONS);
  const [getStandardProvisions, { data: dataStandardProvisions = [] }] = useLazyQuery(GET_STANDARD_PROVISIONS);

  useEffect(() => {
    if (props.id) {
      getStandardProvisions()
      getCustomLayer({ variables: { id: props.id } });
      getAgreementProvisions({ variables: { agreementId: props.id } });
    }
  }, [props.id]);


  useEffect(() => {
    if (dataCustomLayer && dataCustomLayer.customLayer) {
      let shape = JSON.parse(dataCustomLayer.customLayer.shape);
      if (dataCustomLayer.customLayer.shapeJson) shape = copy(dataCustomLayer.customLayer.shapeJson)
      setUniObj({
        ...dataCustomLayer.customLayer,
        shape
      });
      setProperties(shape.properties);
    }
  }, [dataCustomLayer]);

  useEffect(() => {
    if (updatedUnit) {
      if (updatedUnit.updateCustomLayer?.success) {
        dispatch(showSuccessMessage("Successfully updated the Unit"));
        // Updating stateapp parcel object
        const customLayer = updatedUnit.updateCustomLayer.customLayer;
        const feature = JSON.parse(customLayer.shape);
        setProperties({ ...feature.properties });

        feature.id = customLayer._id;
        feature.properties.id = customLayer._id;
        feature.layer = { id: 'unit' }
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
    if (e?.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }

    const shape = uniObj.shape;
    set(shape.properties, field, value)
    shape.properties[field] = value;

    const customLayer = {}
    let shapeLabel = shape.properties.shapeLabel
    if (field === 'agreementNumber')
      shapeLabel = `${value}${shape.properties.agreementName ? `-${shape.properties.agreementName}` : ''}`

    if (field === 'agreementName')
      shapeLabel = `${shape.properties.agreementNumber ? `${shape.properties.agreementNumber}-` : ''}${value}`

    shape.properties.shapeLabel = shapeLabel
    shape.properties.name = shapeLabel
    setStateApp((state) => ({
      ...state,
      selectedShape: { ...state.selectedShape, shapeLabel },
    }));
    customLayer.shape = JSON.stringify(shape)
    customLayer.shapeJson = shape


    updateCustomLayer({
      variables: {
        customLayerId: uniObj._id,
        customLayer,
      },
    });
  };

  const updateCustomProperties = (type, value, id) => {
    const shape = uniObj.shape;
    const customRow = properties.custom_data_arr.find((p) => p.id === id)
    if (type === 'key') {
      customRow.key = value
    } else {
      customRow.value = value
    }
    properties.custom_data = {}
    properties.custom_data_arr.forEach((data) => { properties.custom_data[data.key] = data.value })
    const customLayer = {}
    shape.properties = properties
    customLayer.shape = JSON.stringify(shape)
    customLayer.shapeJson = shape
    updateCustomLayer({
      variables: {
        customLayerId: uniObj._id,
        customLayer,
      },
    });
  };

  const DocumentHeader = () => {
    const classes = detailCardStyles();
    return (

      <div className={classes.documentHeader}>
        <DescriptionOutlinedIcon />
        <span>Documents</span>
      </div>
    )
  };

  const RunsheetHeader = () => {
    const classes = detailCardStyles();
    return (
      <div className={classes.documentHeader}>
        <GavelIcon />
        <span>LIMITED TITLE RUNSHEET</span>
      </div>
    )
  };


  const WellHeader = ({ selectedWellTab, setWellSelectedTab }) => (
    <TabButtons
      labels={["Unit Wells", "Potential Wells"]}
      value={selectedWellTab}
      setValue={(n) => { setWellSelectedTab(n) }}
    />
  );

  const TractHeader = ({ selectedTractTab, setTractSelectedTab }) => (
    <TabButtons
      labels={["Unit Tracts", "Potential Tracts"]}
      value={selectedTractTab}
      setValue={(n) => { setTractSelectedTab(n) }}
    />
  );

  return uniObj ? (
    <Grid item sm={12} container className={classes.gridWidthScroll}>
      <Grid item xs={12} style={{ padding: "10px 15px 0px 15px" }} className={classes.border}>
        <div className={classes.tags}>
          <Tags width="100%" targetSourceId={props.id} targetLabel="unit" publicLeftBottom />
        </div>
      </Grid>
      <Grid item sm={12}>
        <Taps
          tabLabels={["Summary", "Provisions", "Tracts", "Wells", "Documents", "Related Info"]}
          openTabIdex={selectedTab}
          tabPanels={[
            <AgreementSummary
              properties={properties}
              setProperties={setProperties}
              updateProperties={updateProperties}
              updateCustomProperties={updateCustomProperties}
              id={props.id}
              provisions={agreementProvisions?.getAgreementProvisions || []}
              standardProvisions={dataStandardProvisions?.getStandardProvisions || []}
            />,
            <ProvisionsTab
              provisions={agreementProvisions?.getAgreementProvisions || []}
              standardProvisions={dataStandardProvisions?.getStandardProvisions || []}
              id={props.id} />,

            <div className={showSummary ? classes.subContent : classes.subContent2}>
              <ParcelDetailsRunsheetTable
                customLayer={uniObj}
                parent="associatedRunsheetPerParcel"
                targetLabel="parcelRunsheet"
                header={<RunsheetHeader />}
                dense
              />
            </div>,
            <TabPanels
              value={selectedWellTab}
              panels={[
                <div className={showSummary ? classes.subContent : classes.subContent2}>
                  <UnitWellInterestTable
                    customLayer={uniObj}
                    shapeType='Unit'
                    parent="associatedWellsPerUnits"
                    targetLabel="well"
                    header={<WellHeader selectedWellTab={selectedWellTab} setWellSelectedTab={setWellSelectedTab} />}
                    showTracks
                    dense
                  />
                </div>,
                <div className={showSummary ? classes.subContent : classes.subContent2}>
                  <AssociatedWellsUnitTable
                    customLayer={uniObj}
                    shapeType='Unit'
                    parent="associatedWellsPerUnits"
                    targetLabel="well"
                    header={<WellHeader selectedWellTab={selectedWellTab} setWellSelectedTab={setWellSelectedTab} />}
                    showTracks
                    setSelectedTab={setWellSelectedTab}
                    dense
                  />
                </div>
              ]}
            />,
            <TabPanels
              value={selectedTractTab}
              panels={[
                <div className={showSummary ? classes.subContent : classes.subContent2}>
                  <UnitTractsTable
                    customLayer={uniObj}
                    shapeType='Unit'
                    header={<TractHeader selectedTractTab={selectedTractTab} setTractSelectedTab={setTractSelectedTab} />}
                    dense
                  />
                </div>,
                <div className={showSummary ? classes.subContent : classes.subContent2}>
                  <AssociatedTractsUnitTable
                    customLayer={uniObj}
                    shapeType='Unit'
                    header={<TractHeader selectedTractTab={selectedTractTab} setTractSelectedTab={setTractSelectedTab} />}
                    setSelectedTab={setTractSelectedTab}
                    dense
                  />
                </div>
              ]}
            />,
            <div className={`${showSummary ? classes.subContent : classes.subContent2} ${classes.parcelDocument}`}>
              <RelatedDetailsDocumentTable
                customLayer={uniObj}
                relatedObjectType='Shape'
                name='Unit'
                header={<DocumentHeader />}
                dense
              />
            </div>
          ]}
        />
      </Grid>

    </Grid>
  ) : (
    <div style={{ padding: "20px", position: "absolute", height: "100%", width: "100%" }}>
      <CircularProgress size={80} disableShrink color="secondary" />
    </div>
  );
}
