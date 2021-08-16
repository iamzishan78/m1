import React, { useState, useEffect, useContext } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import GavelIcon from '@material-ui/icons/Gavel';
import LocationIcon from '@material-ui/icons/Place';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { useDispatch } from "react-redux";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Box, IconButton } from "@material-ui/core";
import Taps from "../Shared/Taps";
import TabPanels from "components/Shared/TabPanels"
import TabButtons from "components/Shared/TabPanels/TabButtons"
import M1nTable from "../Shared/M1nTable/M1nTable";
import { CUSTOMLAYER } from "../../graphQL/useQueryCustomLayer";
import QtrQtrSelector from "./components/QtrQtrSelector";
import LeftTopSummary from "./components/LeftTopSummary";
import StateCard from "./components/StateCard";
import CountyCard from "./components/CountyCard";
import MeridianCard from "./components/MeridianCard";
import TownshipCard from "./components/TownshipCard";
import RangeCard from "./components/RangeCard";
import SurveyCard from "./components/SurveyCard";
import BlockCard from "./components/BlockCard";
import SectionCard from "./components/SectionCard";
import AbstractCard from "./components/AbstractCard";
import AltSurveyCard from "./components/AltSurveyCard";
import ParcelDetailsMap from "./components/ParcelDetailsMap";
import { UPDATECUSTOMLAYER } from "../../graphQL/useMutationUpdateCustomLayer";
import SuggestedTaxOwnersTable from "components/Table/TaxOwners/SuggestedTaxOwnersTable";
import AssociatedWellsParcelTable from "components/Table/Wells/AssociatedWellsParcelTable";
import ParcelDetailsDocumentTable from "components/Table/Documents/ParcelDetailsDocumentTable";
import ParcelDetailsRunsheetTable from "components/Table/Parcel/ParcelDetailsRunsheetTable";
import { showSuccessMessage, showErrorMessage } from "../../actions";
import { getParcelOriginalProperties } from "./utils/GetParcelOriginalProps";
import { AppContext } from "../../AppContext";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const ENTER_KEY = 13;

const useStyles = makeStyles((theme) => ({
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
  parcelSummmary: {
    marginBottom: '0px',

  },
  gridPortion: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-around",
    height: "100%",
  },
  gridWidthScroll: {
    maxHeight: "calc(100% - 88px)",
    overflow: "auto",
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
  gridItemGrey: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-around",
    // background: "#f6f6f6",
    position: "relative",
    top: "0",
    left: "0",
    paddingTop: "7px",
    borderBottom: "1px solid rgb(190, 190, 190)",
    background: "#ebebeb",
  },
  gridHeaderDivision: {
    display: "flex"
  },
  calcSummary: {
    width: '100%'
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

  tapsPanels: {
    "& .MuiBox-root": { padding: "0" },
  },
  tapsPanelsPadding: {
    "& .MuiBox-root": { padding: "0" },
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
      "&>:nth-child(2) > span": {
        width: "336px !important"
      }
    }
  }
}));

export default function ParcelsDetailCard(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState(props.selectTabIndex || 0);
  const [parcelObj, setParcelObj] = useState();
  const [parcelWells, setParcelWells] = useState();
  const [parcelProperties, setProperties] = useState();
  const [originalProperties, setOriginalProperties] = useState(null);
  const [parcelName, setParcelName] = useState();
  const [grossAcres, setGrossAcres] = useState();
  const [legalDescription, setLegalDesc] = useState();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [onChangeFooterLabel, setChangeFooterLabel] = useState({ parcelName: false, grossAcres: false, legalDescription: false });
  const [showSummary, setShowSummary] = useState(true);
  const [updateCustomLayer, { data: updatedParcel }] = useMutation(
    UPDATECUSTOMLAYER,
  );

  const [getCustomLayer, { data: dataCustomLayer, loading }] = useLazyQuery(
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
      let shape = dataCustomLayer.customLayer.shape;
      if (typeof shape === "string") {
        shape = JSON.parse(shape);
      }
      setParcelObj({
        ...dataCustomLayer.customLayer,
        shape: shape,
        qtrQtr: {
          nwnw: false,
          nenw: false,
          swnw: false,
          senw: false,
          nwne: false,
          nene: false,
          swne: false,
          sene: false,
          nwsw: false,
          nesw: false,
          swsw: false,
          sesw: false,
          nwse: false,
          nese: false,
          swse: false,
          sese: false,
        }
      });
      setProperties(shape.properties);
      setParcelName(shape.properties.shapeLabel);
      setGrossAcres(shape.properties.sdGrossAcres);
      setLegalDesc(shape.properties.legalDescription || "");
    }
  }, [dataCustomLayer]);

  useEffect(() => {
    if (updatedParcel) {
      if (updatedParcel.updateCustomLayer?.success) {
        dispatch(showSuccessMessage("Successfully updated the parcel"));

        // Updating stateapp parcel object
        const customLayer = updatedParcel.updateCustomLayer.customLayer;
        const feature = JSON.parse(customLayer.shape);
        feature.id = customLayer._id;
        feature.properties.id = customLayer._id;
        feature.layer = { id: 'parcel' }
        setStateApp((state) => ({
          ...state,
          selectedParcel: { ...feature.properties, feature },
        }));
      } else {
        dispatch(showErrorMessage("Failed to update parcel"));
      }
    }
  }, [updatedParcel]);

  const setQtrQtr = (qtrQtr) => {
    setParcelObj({ ...parcelObj, qtrQtr });
  };

  useEffect(() => {
    if (parcelObj) {
      const original_properties = getParcelOriginalProperties(parcelObj.shape.properties);
      setOriginalProperties(original_properties);
    }
  }, [parcelObj]);

  const updateParcel = (e, field, value) => {
    if (e.keyCode === ENTER_KEY) {
      e.preventDefault();
      e.stopPropagation();
      const shape = parcelObj.shape;
      shape.properties[field] = value;

      const customLayer = {
        shape: JSON.stringify(shape),
      }

      if (field === 'shapeLabel') {
        setStateApp((state) => ({
          ...state,
          selectedParcel: { ...state.selectedParcel, shapeLabel: value },
        }));
        customLayer.name = value;
      }

      updateCustomLayer({
        variables: {
          customLayerId: parcelObj._id,
          customLayer,
        },
      });

      if (field === 'shapeLabel') {
        setStateApp((state) => ({
          ...state,
          selectedParcel: { ...state.selectedParcel, shapeLabel: value },
        }));
      }
    }
  };

  const Header = () => (
    <TabButtons
      labels={[
        "Parcel Ownership",
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
      <span>ASSOCIATED DOCUMENTS</span>
    </div>
  );

  const RunsheetHeader = () => (
    <div className={classes.documentHeader}>
      <GavelIcon />
      <span>LIMITED TITLE RUNSHEET</span>
    </div>
  );

  const WellHeader = () => (
    <div className={classes.documentHeader}>
      <LocationIcon />
      <span>ASSOCIATED WELLS</span>
    </div>
  );

  return parcelObj ? (
    <Grid item sm={12} container className={classes.gridWidthScroll}>
      <Grid item sm={12} container>
        {originalProperties && (
          <Grid item sm={12} className={classes.gridItemGrey}>
            <StateCard state={originalProperties.state} />
            <CountyCard county={originalProperties.county} />
            {originalProperties.state === "TX" ? (
              [<SurveyCard survey={originalProperties.survey} />,
              <BlockCard block={originalProperties.block} />,
              <SectionCard section={originalProperties.section} />,
              <AbstractCard abstract={originalProperties.abstract} />,
              <AltSurveyCard altSurvey={originalProperties.altSurvey} />]
            ) : (
              [<MeridianCard meridian={originalProperties.meridian} />,
              <TownshipCard township={originalProperties.township} />,
              <RangeCard range={originalProperties.range} />,
              <SectionCard section={originalProperties.section} />]
            )}
            <Box>
              <IconButton
                onClick={() => setShowSummary(!showSummary)}
                aria-label="delete" color="primary">
                {
                  showSummary ? <KeyboardArrowUpIcon fontSize="large" /> : <KeyboardArrowDownIcon fontSize="large" />
                }

              </IconButton>
            </Box>
          </Grid>
        )}
        {showSummary &&
          <Grid item

            // sm={6} 

            // temporary code hiding the parcel QQ grid in texas until we can build out the component
            sm={originalProperties && originalProperties !== null && originalProperties.state == "TX" ? 12 : 6}

            className={classes.gridPacelDetails}>

            <Grid item
              sm={12}
              container>
              <div className={classes.calcSummary}>
                <p className={classes.parcelSummmary}>Parcel Name</p>
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
                  onFocus={() => { setChangeFooterLabel({ ...onChangeFooterLabel, parcelName: true }) }}
                  onBlur={() => { setChangeFooterLabel({ ...onChangeFooterLabel, parcelName: false }) }}
                  InputProps={{
                    endAdornment: (onChangeFooterLabel.parcelName === true &&
                      <p className={classes.foodText}>
                        <span>Return</span> to save
                      </p>)
                  }}
                  fullWidth
                >
                </TextField>
                <p className={classes.parcelSummmary}>Gross Acres</p>
                <TextField
                  size="small"
                  type="number"
                  value={grossAcres}
                  variant="outlined"
                  onChange={(e) => {
                    setGrossAcres(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    updateParcel(e, "sdGrossAcres", grossAcres);
                  }}
                  onFocus={() => { setChangeFooterLabel({ ...onChangeFooterLabel, grossAcres: true }) }}
                  onBlur={() => { setChangeFooterLabel({ ...onChangeFooterLabel, grossAcres: false }) }}
                  InputProps={{
                    endAdornment: (onChangeFooterLabel.grossAcres === true &&
                      <p className={classes.foodText}>
                        <span>Return</span> to save
                      </p>)
                  }}
                  fullWidth
                />
                <p className={classes.parcelSummmary}>Calc. Acres</p>
                <TextField
                  disabled
                  size="small"
                  value={parcelProperties.shapeArea}
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    readOnly: true
                  }}
                />

                <p className={classes.parcelSummmary}>Full Legal Description</p>
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
                  onFocus={() => { setChangeFooterLabel({ ...onChangeFooterLabel, legalDescription: true }) }}
                  onBlur={() => { setChangeFooterLabel({ ...onChangeFooterLabel, legalDescription: false }) }}
                  InputProps={{
                    endAdornment: (onChangeFooterLabel.legalDescription == true &&
                      <p className={classes.foodText}>
                        <span>Return</span> to save
                      </p>)
                  }}
                />
              </div>
            </Grid>

          </Grid>
        }
        {originalProperties && originalProperties !== null && originalProperties.state == "TX" ? (null) : (

          <Grid item sm={6} className={classes.gridPortion}>
            {showSummary &&
              <QtrQtrSelector parcelData={parcelObj} setQtrQtr={setQtrQtr} />
            }
          </Grid>
        )}

      </Grid>
      <Grid item sm={12}>
        <Taps
          tabLabels={["Interest Owners", "Runsheet", "Wells", "Documents"]}
          openTabIdex={selectedTab}
          tabPanels={[
            <TabPanels
              value={selectedTab}
              panels={[
                <div className={showSummary ? classes.subContent : classes.subContent2}>
                  <M1nTable parent="ownersPerParcel" customLayer={parcelObj} dense header={<Header />} />
                </div>,
                <div className={showSummary ? classes.subContent : classes.subContent2}>
                  <SuggestedTaxOwnersTable
                    customLayer={parcelObj}
                    parent="potentialOwnersPerParcel"
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
                customLayer={parcelObj}
                parent="associatedRunsheetPerParcel"
                targetLabel="parcelRunsheet"
                header={<RunsheetHeader />}
                dense
              />
            </div>,
            <div className={showSummary ? classes.subContent : classes.subContent2}>
              <AssociatedWellsParcelTable
                customLayer={parcelObj}
                parent="associatedWellsPerParcel"
                targetLabel="well"
                header={<WellHeader />}
                dense
              />
            </div>,
            <div className={showSummary ? classes.subContent : classes.subContent2}>
              <ParcelDetailsDocumentTable
                customLayer={parcelObj}
                parent="associatedDocumentsPerParcel"
                targetLabel="parcelDocument"
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
        // zIndex: "50",
      }}
    >
      <CircularProgress size={80} disableShrink color="secondary" />
    </div>
  );
}
