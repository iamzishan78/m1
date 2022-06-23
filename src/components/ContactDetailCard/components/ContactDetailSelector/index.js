import React, { Fragment, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "AppContext";
import Card from "@material-ui/core/Card";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setMapGridCardState } from "actions";
import OwnersSummaryCard from "components/OwnersSummaryCard/OwnersSummaryCard";
import { TabPanel } from "components/Shared/TabPanels";
import ContactDetailedInfo from "components/ContactDetailedInfo/ContactDetailedInfo";
import ActivitiesTable from "components/Table/Activities/ActivitiesTable";
import ContactWellInterestTable from "components/Table/Contact/ContactWellInterestTable";
import ContactParcelInterestTable from "components/Table/Contact/ContactParcelInterestTable";
import ContactTaxRollInterestTable from "components/Table/Contact/ContactTaxRollInterestTable";
import UnitInterestsTable from "components/Table/Unit/UnitInterestsTable";
import ContactDealsProvider from "components/DealsDetailCard/ContactDealsProvider";
import ContactDocumentsProvider from "components/ViewDocuments/ContactDocumentsProvider";

import { Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from "@material-ui/core";
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

function MapGridCard(props) {
  // contexts
  const [stateApp] = useContext(AppContext);

  // function state
  const [searchTapValue, SearchTapValue] = useState(contactDetailInitialData[0]);

  // selectorsW
  const { mapGridCardActivated, mapGridCardActiveTap, selectedOwner } = useSelector(({ MapGridCard }) => MapGridCard, shallowEqual);
  const mapLayersPanelExtended = useSelector(({ MainMap }) => MainMap.mapLayersPanelExtended);
  const userGridViewFilters = useSelector(({ session }) => session.userGridViewSettings?.filters);

  const dispatch = useDispatch();

  const setSearchTapValue = (state) => {
    if (searchTapValue !== state) {
      SearchTapValue(state);
    }
  };

  // styles
  const classes = useStyles({
    mapLayersPanelExtended,
    mapGridCardActivated,
    mapGridCardActiveTap,
    viewportWells: stateApp.viewportWells,
    userGridViewFilters,
    // screenSizes
  });

  const handleSearchPanelChange = (value) => {
    setSearchTapValue(value);
    if (searchTapValue.index !== value.index) {
      dispatch(setMapGridCardState({ searchResultData: [], searchloading: true }));
    }
  };

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
                        <ContactTaxRollInterestTable
                          parent="assocTaxRollInterests"
                          header={"Tax Roll Interests"}
                          targetLabel="well"
                          contactId={props.contactData._id}
                          showTracks
                        />
                      )}
                      {searchTapValue.value === "wellInterest" && (
                        <ContactWellInterestTable
                          parent="assocTaxRollInterests"
                          header={"Well Interests"}
                          targetLabel="well"
                          contactId={props.contactData._id}
                          showTracks
                        />
                      )}
                      {searchTapValue.value === "unitInterests" && (
                        <UnitInterestsTable
                          parent="assocTaxRollInterests"
                          header={"Unit Interests"}
                          targetLabel="unit"
                          esFilters={[{ field: "contact._id.keyword", value: props.contactData._id }]}
                          esIndex="shapeowners_flat"
                          setESFilters={() => { }}
                          onTractCount={() => { }}
                        />
                      )}
                      {searchTapValue.value === "parcelInterests" && (
                        <ContactParcelInterestTable
                          parent="assocTaxRollInterests"
                          header={"Parcel Interests"}
                          targetLabel="parcel"
                          contactId={props.contactData._id}
                          showTracks
                        />
                      )}
                      {searchTapValue.value === "deals" && (
                        <ContactDealsProvider />
                      )}
                      {searchTapValue.value === "documents" && (
                        <ContactDocumentsProvider />
                      )}
                    </Fragment>
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
