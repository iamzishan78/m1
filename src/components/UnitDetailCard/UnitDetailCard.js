import React, { useState, useEffect, useContext } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import GavelIcon from '@material-ui/icons/Gavel';
import LocationIcon from '@material-ui/icons/Place';
import Grid from "@material-ui/core/Grid";
import { useDispatch } from "react-redux";
import Taps from "../Shared/Taps";
import TabPanels from "components/Shared/TabPanels"
import TabButtons from "components/Shared/TabPanels/TabButtons"
import M1nTable from "../Shared/M1nTable/M1nTable";
import { CUSTOMLAYER } from "../../graphQL/useQueryCustomLayer";
import { UPDATECUSTOMLAYER } from "../../graphQL/useMutationUpdateCustomLayer";
import SuggestedShapeTaxOwnersTable from "components/Table/TaxOwners/SuggestedShapeTaxOwnersTable";
import AssociatedWellsParcelTable from "components/Table/Wells/AssociatedWellsParcelTable";
import RelatedDetailsDocumentTable from "components/Table/Documents/RelatedDetailsDocumentTable";
import ParcelDetailsRunsheetTable from "components/Table/Parcel/ParcelDetailsRunsheetTable";
import { showSuccessMessage, showErrorMessage } from "../../actions";
import { AppContext } from "../../AppContext";
import set from 'lodash/set'

import Tags from "components/Shared/Tagger";
import UnitSummary from "./UnitSummary";
import UnitOwnersTable from "components/Table/Unit/UnitOwnersTable";
import UnitWellInterestTable from "components/Table/Unit/UnitWellInterestTable";
import AssociatedWellsUnitTable from "components/Table/Wells/AssociatedWellsUnitTable";
import { copy } from "components/Shared/functions";

const ENTER_KEY = 13;

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
  icon: {
    color: "#757575",
    fontSize: "26px"
  },
  tags: {
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none'
    }
  },

  ///////////////////////
  grid: {
    width: "auto",
  },
  gridItem: {
    flexGrow: 1,
    display: "flex",
    height: "100%",
  },
  gridPacelDetails: {
    flexGrow: 1,
    display: "flex",
    height: "100%",
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,

  },
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
  calcSummary: {
    width: '100%'
  },
  content: {
    backgroundColor: "#fff",
    padding: "16px",
  },
  borderRight: {
    borderRight: "1px solid #eaeaea",
    backgroundColor: "#fff",
    padding: "15px",
  },
  foodText: {
    position: "absolute",
    bottom: "20px",
    // zIndex: "51",
    right: "0px",
    fontSize: "10px",
    color: "#6e6e6e",
    margin: "0 !important",
    textAlign: "right",
    height: "0",
    paddingRight: "10px",
    "& span": {
      fontWeight: "bold",
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
  tapsLabelsButtonsSelected: {
    boxShadow: "none",
    color: "#fff",
    backgroundColor: theme.palette.secondary.main,
    "&:hover": { color: "#757575", boxShadow: "none !important" },
  },
  tapsLabelsButtons: {
    boxShadow: "none",
    backgroundColor: "#fff",
    color: "#757575",
    "&:hover": { boxShadow: "none !important" },
  },
  documentHeader: {
    display: "flex",
    "& span": {
      marginTop: "2px",
      marginLeft: "5px"

    }
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
  const [uniObj, setUniObj] = useState();
  const [properties, setProperties] = useState();
  const [stateApp, setStateApp] = useContext(AppContext);
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

  const Header = () => (
    <TabButtons
      labels={[
        "Unit Ownership",
        "Potential Ownership",
      ]}
      value={selectedTab}
      setValue={(n) => {
        setSelectedTab(n);
      }}
    />
  );

  const DocumentHeader = () => (
    <div className={classes.documentHeader}>
      <DescriptionOutlinedIcon />
      <span>Documents</span>
    </div>
  );

  const RunsheetHeader = () => (
    <div className={classes.documentHeader}>
      <GavelIcon />
      <span>LIMITED TITLE RUNSHEET</span>
    </div>
  );

  const WellHeader = () => (
    <TabButtons
      labels={[
        "Unit Wells",
        "Potential Wells",
      ]}
      value={selectedWellTab}
      setValue={(n) => {
        setWellSelectedTab(n);
      }}
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
          tabLabels={["Summary", "Interest Owners", "Runsheet", "Wells", "Documents"]}
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
                    header={<Header />}
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
                    header={<Header />}
                    setSelectedTab={setSelectedTab}
                    dense
                  />
                </div>
              ]}
            />,

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
                    header={<WellHeader />}
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
                    header={<WellHeader />}
                    showTracks
                    setSelectedTab={setSelectedTab}
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
    <div
      style={{
        padding: "20px",
        position: "absolute",
        height: "100%",
        width: "100%"
      }}
    >
      <CircularProgress size={80} disableShrink color="secondary" />
    </div>
  );
}
