import React, { useState, useEffect, useContext } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { useDispatch } from "react-redux";
import Taps from "../Shared/Taps";
import TabPanels from "components/Shared/TabPanels"
import { CUSTOMLAYER } from "../../graphQL/useQueryCustomLayer";
import { UPDATECUSTOMLAYER } from "../../graphQL/useMutationUpdateCustomLayer";
import SuggestedShapeTaxOwnersTable from "components/Table/TaxOwners/SuggestedShapeTaxOwnersTable";
import RelatedDetailsDocumentTable from "components/Table/Documents/RelatedDetailsDocumentTable";
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import TabButtons from "components/Shared/TabPanels/TabButtons"
import GavelIcon from '@material-ui/icons/Gavel';
import UnitSummary from "./UnitSummary";
import UnitOwnersTable from "components/Table/Unit/UnitOwnersTable";
import UnitWellInterestTable from "components/Table/Unit/UnitWellInterestTable";
import AssociatedWellsUnitTable from "components/Table/Wells/AssociatedWellsUnitTable";
import UnitTractsTable from "components/Table/Unit/UnitTractsTable";
import AssociatedTractsUnitTable from "components/Table/Wells/AssociatedTractsUnitTable";
import Tags from "components/Shared/Tagger";
import { showSuccessMessage, showErrorMessage } from "../../actions";
import { AppContext } from "../../AppContext";
import set from 'lodash/set'
import { copy } from "components/Shared/functions";
import ParcelAgreementTable from "components/Table/Parcel/ParcelAgreementTable";
import { jobController } from "hookstate/jobStateController";


const useStyles = makeStyles((theme) => ({
  summaryCard: {
    backgroundColor: 'white', paddingLeft: "10px",
    paddingRight: "10px", paddingTop: '8px',
    paddingBottom: '40px'
  },
  summaryDetailCard: {
    paddingLeft: '18px', paddingTop: '8px'
  },
  summaryValue: {
    display: "inline-flex",
    bottom: "5px",
    position: "relative",
    marginRight: "5px",
    fontWeight: "bold",
    color: '#848484'
  },
  descriptionInput: {
    width: '100%',
    '& .MuiTextField-root': {
      backgroundColor: '#fffcdc'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none'
    }
  },
  tags: {
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none'
    }
  },

  ///////////////////////
  gridWidthScroll: {
    maxHeight: "100%",
    overflowX: "auto",
    overflowY: "hidden",
    // overflow: "auto",

    "& .MuiTabs-indicator": {
      // marginLeft: "14px !important",
      bottom: '10px !important'
    },
    "& .MuiTab-root": {
      padding: "15px 12px !important"
    },
    "& .MuiAppBar-root": {
      height: "60px"
    },

    "&::-webkit-scrollbar": {
      height: "0.4em",
      width: "0.4em"
    },
    "&::-webkit-scrollbar-track": {
      "-webkitBoxShadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#929292",
      borderRadius: 5,
    },
  },
  subContent: {
    "& div": {
      "&>.MuiPaper-root": {
        "&>:nth-child(3)": {
          height: "calc(100vh - 53vh ) !important",
          "& .MuiTableCell-paddingCheckbox": {
            position: 'unset',
          },
        },
      },
    },
  },
  subContent2: {
    "& div": {
      "&>.MuiPaper-root": {
        "&>:nth-child(3)": {
          height: "calc(100vh - 35vh ) !important",
          "& .MuiTableCell-paddingCheckbox": {
            position: 'unset',
          },
        },
      },
    },
  },
  parcelDocument: {
    "& .MuiTableRow-root": {
      "&>:nth-child(2) ": {
        "& .fileName": {
          width: "375px !important"
        }
      }
    }
  }
}));

export default function UnitDetailCard(props) {

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

  const classes = useStyles();
  const showSummary = true

  const [getCustomLayer, { data: dataCustomLayer }] = useLazyQuery(
    CUSTOMLAYER,
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
    e.preventDefault();
    e.stopPropagation();
    const shape = uniObj.shape;
    set(shape.properties, field, value)
    shape.properties[field] = value;

    const customLayer = {}

    if (field === 'uName') {
      setStateApp((state) => ({
        ...state,
        selectedShape: { ...state.selectedShape, shapeLabel: value },
      }));
      shape.properties.shapeLabel = value
      customLayer.name = value;
    }
    customLayer.shape = JSON.stringify(shape)
    customLayer.shapeJson = shape

    updateCustomLayer({
      variables: {
        customLayerId: uniObj._id,
        customLayer,
      },
    }).then(() => {
      jobController.toggleBulkUpload()
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
    }).then(() => {
      jobController.toggleBulkUpload()
    });
  };

  const OwnershipHeader = ({ selectedTab, setSelectedTab }) => (
    <TabButtons
      labels={["Unit Ownership", "Potential Ownership"]}
      value={selectedTab}
      setValue={(n) => { setSelectedTab(n) }}
    />
  );

  const DocumentHeader = () => {
    const classes = useStyles();
    return (

      <div className={classes.documentHeader}>
        <DescriptionOutlinedIcon />
        <span>Documents</span>
      </div>
    )
  };

  const RunsheetHeader = () => {
    const classes = useStyles();
    return (
      <div className={classes.documentHeader}>
        <GavelIcon />
        <span>RUNSHEET INSTRUMENTS</span>
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
          tabLabels={["Summary", "Interest Owners", "Runsheet", "Wells", "Tracts", "Documents"]}
          openTabIdex={selectedTab}
          tabPanels={[
            <UnitSummary properties={properties} setProperties={setProperties} updateProperties={updateProperties}
              updateCustomProperties={updateCustomProperties} id={props.id} />,
            <TabPanels
              value={selectedTab}
              panels={[
                <div className={showSummary ? classes.subContent : classes.subContent2}>
                  <UnitOwnersTable
                    customLayer={uniObj}
                    parent="ownersPerUnit"
                    shapeType='Unit'
                    targetLabel="Unit Ownership"
                    header={<OwnershipHeader selectedTab={selectedTab} setSelectedTab={setSelectedTab} />}
                    setSelectedTab={setSelectedTab}
                    dense
                  />
                </div>,
                <div className={showSummary ? classes.subContent : classes.subContent2}>
                  <SuggestedShapeTaxOwnersTable
                    customLayer={uniObj}
                    parent="potentialOwnersPerUnit"
                    shapeType='Unit'
                    targetLabel="well"
                    jobType="SHAPEOWNER"
                    jobName="Convert potential owner to unit owner"
                    header={<OwnershipHeader selectedTab={selectedTab} setSelectedTab={setSelectedTab} />}
                    setSelectedTab={setSelectedTab}
                    dense
                  />
                </div>
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
