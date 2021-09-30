import React, { useState, useEffect, useContext } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { makeStyles, alpha } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import GavelIcon from '@material-ui/icons/Gavel';
import LocationIcon from '@material-ui/icons/Place';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { useDispatch } from "react-redux";
import Taps from "../Shared/Taps";
import TabPanels from "components/Shared/TabPanels"
import TabButtons from "components/Shared/TabPanels/TabButtons"
import M1nTable from "../Shared/M1nTable/M1nTable";
import { CUSTOMLAYER } from "../../graphQL/useQueryCustomLayer";
import { UPDATECUSTOMLAYER } from "../../graphQL/useMutationUpdateCustomLayer";
import SuggestedTaxOwnersTable from "components/Table/TaxOwners/SuggestedTaxOwnersTable";
import AssociatedWellsParcelTable from "components/Table/Wells/AssociatedWellsParcelTable";
import ParcelDetailsDocumentTable from "components/Table/Documents/ParcelDetailsDocumentTable";
import ParcelDetailsRunsheetTable from "components/Table/Parcel/ParcelDetailsRunsheetTable";
import { showSuccessMessage, showErrorMessage } from "../../actions";
import { getParcelOriginalProperties } from "./utils/GetParcelOriginalProps";
import { AppContext } from "../../AppContext";

import WellIcon from "../Shared/svgIcons/well";
import PersonIcon from '@material-ui/icons/Person';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import TodayOutlinedIcon from '@material-ui/icons/TodayOutlined';
import Tags from "components/Shared/Tagger";
import CommentComponent from "components/Shared/CommentComponent";
import UnitTableInfo from './UnitTableInfo'
import InputBase from '@material-ui/core/InputBase';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import { Button } from "@material-ui/core";

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
  },

  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    // backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: props => props.search.length > 0 ? '15ch' : '0.9px',
      '&:focus': {
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        width: '15ch',
      },
    },
  },
  addDataButton: {
    backgroundColor: 'white',
    color: 'black',
    textTransform: "capitalize",
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.15),
    }
  }
}));

export default function UnitDetailCard(props) {

  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState(props.selectTabIndex || 0);
  const [uniObj, setUniObj] = useState();
  const [search, setSearch] = useState('');
  const [unitProperties, setProperties] = useState();
  const [originalProperties, setOriginalProperties] = useState(null);
  const [stateApp, setStateApp] = useContext(AppContext);
  const [tableDataState, setTableDataState] = useState({});
  const [showSummary, setShowSummary] = useState(true);
  const [updateCustomLayer, { data: updatedUnit }] = useMutation(
    UPDATECUSTOMLAYER,
  );

  const classes = useStyles({ search });

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
      let shape = dataCustomLayer.customLayer.shape;
      if (typeof shape === "string") {
        shape = JSON.parse(shape);
      }
      setUniObj({
        ...dataCustomLayer.customLayer,
        shape: shape,
      });
      setProperties(shape.properties);
    }
  }, [dataCustomLayer]);

  useEffect(() => {
    if (updatedUnit) {
      if (updatedUnit.updateCustomLayer?.success) {
        dispatch(showSuccessMessage("Successfully updated the parcel"));
        setTableDataState({})

        // Updating stateapp parcel object
        const customLayer = updatedUnit.updateCustomLayer.customLayer;
        const feature = JSON.parse(customLayer.shape);
        feature.id = customLayer._id;
        feature.properties.id = customLayer._id;
        feature.layer = { id: 'unit' }
        setStateApp((state) => ({
          ...state,
          selectedUnit: { ...feature.properties, feature },
        }));
      } else {
        dispatch(showErrorMessage("Failed to update unit"));
      }
    }
  }, [updatedUnit]);

  useEffect(() => {
    if (uniObj) {
      const original_properties = getParcelOriginalProperties(uniObj.shape.properties);
      setOriginalProperties(original_properties);
    }
  }, [uniObj]);

  const updateUnit = (e, field, value) => {
    if (e.keyCode === ENTER_KEY) {
      e.preventDefault();
      e.stopPropagation();
      const shape = uniObj.shape;
      shape.properties[field] = value;

      const customLayer = {}

      if (field === 'uName') {
        setStateApp((state) => ({
          ...state,
          selectedUnit: { ...state.selectedUnit, shapeLabel: value },
        }));
        shape.properties.shapeLabel = value
        customLayer.name = value;
      }
      customLayer.shape = JSON.stringify(shape)


      updateCustomLayer({
        variables: {
          customLayerId: uniObj._id,
          customLayer,
        },
      });
    }
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
            <Grid container spacing={2} direction="row" className={classes.summaryCard}>
              <Grid item md={7} sm={12}>
                <Grid container spacing={1} direction="column" >
                  <Grid item>
                    <Grid container direction="row" justifyContent="space-between" alignItems="center">
                      <Grid item>
                        <Grid container spacing={2} className={classes.summaryDetailCard}>
                          <Grid item>
                            <div className={classes.summaryValue}> 3 </div>
                            <WellIcon className={classes.icon} color={"#757575"} opacity="1.0" small />
                          </Grid>
                          <Grid item>
                            <div className={classes.summaryValue}> 3 </div>
                            <PersonIcon className={classes.icon} opacity="1.0" small />
                          </Grid>
                          <Grid item>
                            <div className={classes.summaryValue}> 3 </div>
                            <InsertDriveFileOutlinedIcon className={classes.icon} opacity="1.0" small />
                          </Grid>
                          <Grid item>
                            <div className={classes.summaryValue}> 3 </div>
                            <TodayOutlinedIcon className={classes.icon} opacity="1.0" small />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Grid>
                          <div className={classes.search}>
                            <div className={classes.searchIcon}>
                              <SearchIcon />
                            </div>
                            <InputBase
                              placeholder="Search…"
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                              }}
                              inputProps={{ 'aria-label': 'search' }}
                            />
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <UnitTableInfo updateUnit={updateUnit} unitProperties={unitProperties} setProperties={setProperties} />
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="primary" component="span" className={classes.addDataButton} startIcon={<AddIcon />}>
                      Add Data
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={5} sm={12}>
                <Grid container spacing={2} direction="row">
                  <Grid item className={classes.descriptionInput}>
                    <TextField
                      id="outlined-multiline-static"
                      label="Description"
                      defaultValue={unitProperties.description}
                      value={unitProperties.description}
                      multiline
                      fullWidth
                      rows={17}
                      variant="outlined"
                      onChange={(e) => {
                        setProperties({ ...unitProperties, description: e.target.value });
                      }}
                      onKeyDown={(e) => {
                        updateUnit(e, 'description', unitProperties.description);
                      }}
                      onFocus={() => { setTableDataState({ description: true }) }}
                      InputProps={{
                        endAdornment: (tableDataState.description === true &&
                          <p className={classes.foodText}>
                            <span>Return</span> to save
                          </p>)
                      }}
                    />
                  </Grid>
                  <Grid item md={12}>
                    <CommentComponent targetLabel={'unit'} targetSourceId={props.id} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            ,
            <TabPanels
              value={selectedTab}
              panels={[
                <div className={showSummary ? classes.subContent : classes.subContent2}>
                  <M1nTable parent="ownersPerParcel" customLayer={uniObj} dense header={<Header />} />
                </div>,
                <div className={showSummary ? classes.subContent : classes.subContent2}>
                  <SuggestedTaxOwnersTable
                    customLayer={uniObj}
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
                customLayer={uniObj}
                parent="associatedRunsheetPerParcel"
                targetLabel="parcelRunsheet"
                header={<RunsheetHeader />}
                dense
              />
            </div>,
            <div className={showSummary ? classes.subContent : classes.subContent2}>
              <AssociatedWellsParcelTable
                customLayer={uniObj}
                parent="associatedWellsPerParcel"
                targetLabel="well"
                header={<WellHeader />}
                showTracks
                dense
              />
            </div>,
            <div className={`${showSummary ? classes.subContent : classes.subContent2} ${classes.parcelDocument}`}>
              <ParcelDetailsDocumentTable
                customLayer={uniObj}
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
      }}
    >
      <CircularProgress size={80} disableShrink color="secondary" />
    </div>
  );
}
