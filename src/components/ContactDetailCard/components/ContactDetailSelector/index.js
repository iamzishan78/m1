import React, { Fragment, useState, useContext, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "AppContext";
import Card from "@material-ui/core/Card";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import InboxIcon from "@material-ui/icons/Inbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import M1nTable from "components/Shared/M1nTable/M1nTable";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Button from "@material-ui/core/Button";
import { setMapGridCardState } from "actions";
import OwnersSummaryCard from "components/OwnersSummaryCard/OwnersSummaryCard";
import TabPanels, { TabPanel } from "components/Shared/TabPanels";

import ContactsHeadCells from "components/Shared/constants/contacts-header-schema.js";
import wellsColumnHeaders from "components/Shared/constants/well-interests-header-grid-schema.js";
import {
  leasesColumnHeaders,
  locationsColumnHeaders,
  operatorsColumnHeaders,
  ownersColumnHeaders,
} from "components/MapGridCard/MapGridCardHeaders";
import DockMenu from "components/MapGridCard//DockMenu";
import ShapeGridWellsTable from "components/Table/Wells/ShapeGridWellsTable";
import ShapeGridTaxOwnersTable from "components/Table/TaxOwners/ShapeGridTaxOwnersTable";
import MapGridWellsTable from "components/Table/Wells/MapGridWellsTable";
import MapGridTaxOwnersTable from "components/Table/TaxOwners/MapGridTaxOwnersTable";
import MapGridOperatorTable from "components/Table/Operator/MapGridOperatorTable";
import MapGridContactTable from "components/Table/Contact/MapGridContactTable";
import MapGridUnitTable from "components/Table/Unit/MapGridUnitTable";
import AgreementsTable from "components/Table/Agreement/AgreementsTable";
import TractsTable from "components/Table/Tract/TractsTable";
import ContactDetailedInfo from "components/ContactDetailedInfo/ContactDetailedInfo";
import ActivitiesTable from "components/Table/Activities/ActivitiesTable";

import SearchPanel from "components/MapGridCard/components/SearchPanel";
import { platformDataInitialData, snapGridSideBarData } from "components/MapGridCard/components/data";
import MapGridLayersTable from "components/Table/Layer/MapGridLayersTable";
import { Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from "@material-ui/core";
import { FEATURES } from "components/Shared/FeatureFlag/common";
import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent";
import { contactDetailInitialData } from "./data";

const useStyles = makeStyles((theme) => {
  return {
    card: {
      width: "100%",
      "& .MuiInput-inputTypeSearch": {
        width: "96%",
      },
    },
    rootList: {
      width: ({ mapGridCardActivated }) => (mapGridCardActivated === "min" ? "57vw" : mapGridCardActivated === "exp" ? "96vw" : "57vw"),
      height: ({ mapGridCardActivated }) => (mapGridCardActivated === "min" ? "60vh" : mapGridCardActivated === "exp" ? "91vh" : "60vh"),
      left: ({ mapGridCardActivated, expandGrid }) => (mapGridCardActivated === "exp" ? "2vw" : "2vw"),
      top: ({ mapGridCardActivated }) => (mapGridCardActivated === "exp" ? "5vh" : "12vh"),
      zIndex: "1300",
      position: "fixed",
    },
    dockMenu: {
      width: "100%",
      height: "50vh",
    },
    tapsRoot: {
      // flexGrow: 1,
      "& .MuiTab-root": {
        textTransform: "none",
      },
    },
    appBar: {
      backgroundColor: "#F2F2F2",
      borderBottom: "1px solid rgba(224, 224, 224, 1)",
      boxShadow: "none",
      color: "#757575",
      cursor: "context-menu",
      "& .MuiIconButton-root:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.08)",
      },
      "& button": {
        cursor: "pointer",
      },
    },
    tapsPanels: {
      "& .MuiBox-root": { padding: "0" },
    },
    tapsPanelsPadding: {
      "& .MuiBox-root": { padding: "0", height: "100%" },
    },
    mainPanelsDiv: {
      height: "100%",
      maxHeight: "100vh",
      position: "relative",
      "&::-webkit-scrollbar": {
        width: "0.75em",
        height: "0.75em",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#929292",
        borderRadius: 10,
      },
      "& div": {
        "&>.MuiPaper-root": {
          "&>:nth-child(3)": {
            minHeight: "calc(58.75vh - 240px)",
            "@media (max-height:930px)": {
              maxHeight: "calc(50vh - 620px)",
            },
            "@media (max-height:1600px)": {
              maxHeight: ({ dockMenu, userGridViewFilters }) => {
                if (dockMenu === "bottom" || dockMenu === "top") return "calc(50vh - 640px)";
                else if (dockMenu === "left" || dockMenu === "right")
                  return userGridViewFilters?.length > 0 ? "calc(100vh - 235px)" : "calc(100vh - 200px)";
                else if (dockMenu === "full") return userGridViewFilters?.length ? "calc(100vh - 275px)" : "calc(100vh - 183px)";
              },
            },
          },
        },
      },
    },
    tapsLabelsButtons: {
      boxShadow: "none",
      backgroundColor: "#fff",
      color: "#757575",
      "&:hover": { boxShadow: "none !important" },
    },
    tapsLabelsButtonsSelected: {
      boxShadow: "none",
      color: "#fff",
      backgroundColor: theme.palette.secondary.main,
      "&:hover": { color: "#757575", boxShadow: "none !important" },
    },
    viewportWells: {
      textAlign: ({ viewportWells }) => (viewportWells ? "inherit" : "center"),
      "& #minimumZoomRequired": {
        margin: "30px",
        fontSize: "1.25rem",
        fontFamily: "Poppins",
        fontWeight: "500",
        lineHeight: "1.6",
        display: ({ viewportWells }) => (viewportWells ? "none" : "block"),
      },
      "& #viewportWellsTable": {
        display: ({ viewportWells }) => (viewportWells ? "block" : "none"),
      },
    },
    selectBoundary: {
      background: "white",
      width: "180px",
      height: "35px",
      marginTop: "6px",
      marginBottom: "6px",
      marginLeft: "10px",
      "& .MuiSelect-select.MuiSelect-select": {
        paddingLeft: "10px",
      },
    },
  };
});

const TabLabels = ({ labels, value, setValue }) => {
  const classes = useStyles();

  return (
    <>
      {labels &&
        labels.length &&
        labels.map((label, i) => (
          <Button
            key={i}
            size="small"
            variant="contained"
            className={value === i ? classes.tapsLabelsButtonsSelected : classes.tapsLabelsButtons}
            onClick={() => {
              setValue(i);
            }}
          >
            {label}
          </Button>
        ))}
    </>
  );
};

function MapGridCard(props) {
  // contexts
  const [stateApp] = useContext(AppContext);

  // function state
  const [searchTapValue, SearchTapValue] = useState(contactDetailInitialData[5]);
  const [viewportTapValue, ViewportTapValue] = useState(0);
  const [dockMenu, SetDockMenu] = useState("bottom");
  const [trackedTapValue, TrackedTapValue] = useState(0);

  // selectorsW
  const { mapGridCardActivated, mapGridCardActiveTap, selectedOwner } = useSelector(({ MapGridCard }) => MapGridCard, shallowEqual);
  const mapLayersPanelExtended = useSelector(({ MainMap }) => MainMap.mapLayersPanelExtended);
  const userGridViewFilters = useSelector(({ session }) => session.userGridViewSettings?.filters);

  const dispatch = useDispatch();

  // React.useEffect(() => {
  //   console.log(dcreenSizes);
  // }, [dcreenSizes]);

  const setSelectedDockMenu = (state) => {
    if (dockMenu !== state) {
      SetDockMenu(state);
    }
  };

  const setSearchTapValue = (state) => {
    if (searchTapValue !== state) {
      SearchTapValue(state);
    }
  };

  // styles
  const classes = useStyles({
    dockMenu,
    mapLayersPanelExtended,
    mapGridCardActivated,
    mapGridCardActiveTap,
    viewportWells: stateApp.viewportWells,
    userGridViewFilters,
    // screenSizes
  });

  const handleMainTapChange = (event, newValue) => {
    dispatch(
      setMapGridCardState({
        mapGridCardActiveTap: newValue,
        selectedOwner: null,
        selectedOwnerWellIntsSummary: null,
      })
    );
  };

  const handleSearchPanelChange = (value) => {
    setSearchTapValue(value);
    if (searchTapValue.index !== value.index) {
      dispatch(setMapGridCardState({ searchResultData: [], searchloading: true }));
    }
  };

  const ativateSearchPanel = () => {
    if (mapGridCardActiveTap !== 0) handleMainTapChange(null, 0);
    if (mapGridCardActivated === "min") {
      dispatch(setMapGridCardState({ mapGridCardActivated: true }));
    }
  };

  const options = {
    toolbarActionMarginRight: "105px !important",
    customToolbar: () => {
      const dynamicLeftPos = mapGridCardActiveTap !== 2 ? 236 : 122;
      return (
        <div style={{ display: "flex", float: "left", position: "relative", left: `${dynamicLeftPos}px`, marginRight: "15px" }}>
          <DockMenu setSelectedDockMenu={setSelectedDockMenu} />

          <IconButton
            className="cancelDraggableEffect"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(
                setMapGridCardState({
                  mapGridCardActivated: false,
                  selectedOwner: null,
                  selectedOwnerWellIntsSummary: null,
                })
              );
            }}
          >
            <CloseIcon color="secondary" />
          </IconButton>
        </div>
      );
    },
  };

  const commonProps = {
    isShapeGridOnly: stateApp.gridPolygonString,
    isLayerOnly: stateApp.selectedLayer,
    handleChange: handleSearchPanelChange,
    value: searchTapValue,
    ativateSearchPanel: ativateSearchPanel,
  };

  // black
  // darken
  const blackOut = () => (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        // zIndex: "1299",
        zIndex: "1199",
      }}
      onClick={() => {
        dispatch(setMapGridCardState({ mapGridCardActivated: true }));
      }}
    />
  );

  return (
    <div className={classes.card}>
      <Card className={classes.dockMenu}>
        {selectedOwner ? (
          <OwnersSummaryCard />
        ) : (
          <div className={`cancelDraggableEffect ${classes.mainPanelsDiv}`} style={{ position: "relative" }}>
            {/* //// search panel //// */}
            <TabPanel
              value={mapGridCardActiveTap}
              index={0}
              className={classes.tapsPanelsPadding}
              style={{ width: "100%", height: "100%" }}
            >
              <Grid container direction="row" style={{ height: "100%", marginBottom: "20px" }}>
                <Grid item md={2} style={{ backgroundColor: "#F2F2F2" }}>
                  <Typography variant="h6" component="h1" style={{ fontWeight: "bold", padding: "10px 0px 0px 20px" }}>
                    M1 Platform
                  </Typography>

                  <List component="nav" aria-label="main mailbox folders">
                    {contactDetailInitialData.map((row) => {
                      const Icon = row.Icon;
                      return (
                        <ListItem button selected={row.value === searchTapValue.value} onClick={() => handleSearchPanelChange(row)}>
                          <ListItemIcon style={{ minWidth: "40px" }}>
                            <Icon />
                          </ListItemIcon>
                          <ListItemText primary={row.label} />
                        </ListItem>
                      );
                    })}
                  </List>
                </Grid>

                <Grid item md={10} style={{ padding: "0px 10px", maxHeight: "700px", overflow: "overlay" }}>
                  <div style={{ position: "relative" }} classes={classes.gridTables}>
                    {/* <TabPanels
                  value={searchTapValue.index}
                  panels={getTaps.map((tab, index) => {
                    return ( */}
                    <Fragment>
                      {searchTapValue.value === "contactInformation" && (
                        <ContactDetailedInfo user={stateApp.user} purchaseData={props.purchaseData} contactData={props.contactData} />
                      )}
                      {searchTapValue.value === "activities" && (
                        <ActivitiesTable
                          esIndex={"activities_flat"}
                          searchFields={["name", "_all"]}
                          filtersChange={() => { }}
                          appliedFilters={[
                            {
                              field: "contactName.keyword",
                              value: props.contactData?.name,
                            },
                          ]}
                          filterToggle={() => { }}
                          targetLabel={"activitiesDashboard"}
                          header="Activities"
                          addAble={{ type: "contactActivity" }}
                          onAddActivity={props.onAddActivity}
                        />
                      )}
                      {searchTapValue.value === "taxRollInterest" && (
                        // <MapGridTaxOwnersTable
                        //   dense
                        //   parent="search"
                        //   customOptions={options}
                        //   targetLabel={searchTapValue.value}
                        //   header={<SearchPanel {...commonProps} />}
                        //   showTags
                        //   showComments
                        //   showTracks
                        // />
                        <p>helllo</p>
                      )}
                      {searchTapValue.value === "wellInterest" && (
                        // <MapGridOperatorTable
                        //   dense
                        //   parent="search"
                        //   customOptions={options}
                        //   targetLabel={searchTapValue.value}
                        //   header={<SearchPanel {...commonProps} />}
                        //   showTags
                        //   showComments
                        //   showTracks
                        // />
                        <p>helllo</p>
                      )}
                      {searchTapValue.value === "unitInterests" && (
                        // <MapGridLayersTable
                        //   dense
                        //   parent="search"
                        //   customOptions={options}
                        //   targetLabel={"operator"}
                        //   header={<SearchPanel {...commonProps} />}
                        // />
                        <p>helllo</p>
                      )}
                      {searchTapValue.value === "parcelInterests" && (
                        // <MapGridContactTable
                        //   dense
                        //   parent="search"
                        //   customOptions={options}
                        //   targetLabel={searchTapValue.value}
                        //   header={
                        //     <SearchPanel
                        //       isShapeGridOnly={stateApp.gridPolygonString}
                        //       handleChange={handleSearchPanelChange}
                        //       value={searchTapValue}
                        //       ativateSearchPanel={ativateSearchPanel}
                        //     />
                        //   }
                        // />
                        <p>helllo</p>
                      )}
                      {searchTapValue.value === "deals" && (
                        // <MapGridUnitTable
                        //   dense
                        //   parent="search"
                        //   customOptions={options}
                        //   targetLabel={searchTapValue.value}
                        //   header={<SearchPanel {...commonProps} />}
                        // />
                        <p>helllo</p>
                      )}
                      {searchTapValue.value === "documents" && (
                        // <AgreementsTable
                        //   isCheckboxSticky={true}
                        //   dense
                        //   esIndex={"shapes_flat"}
                        //   parent="AgreementsTable"
                        //   customOptions={options}
                        //   targetLabel={searchTapValue.value}
                        //   header={<SearchPanel {...commonProps} />}
                        // />
                        <p>helllo</p>
                      )}
                    </Fragment>
                    {/* )
                  })}
                /> */}
                  </div>
                </Grid>
              </Grid>
            </TabPanel>
          </div>
        )}
      </Card>
    </div>
  );
}

export default MapGridCard;
