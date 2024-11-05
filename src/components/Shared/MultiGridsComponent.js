import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "AppContext";
import { useLazyQuery } from "@apollo/client";
import Card from "@material-ui/core/Card";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setMapGridCardState } from "actions";
import OwnersSummaryCard from "components/OwnersSummaryCard/OwnersSummaryCard";
import { TabPanel } from "components/Shared/TabPanels";
import ContactDetailedInfo from "components/ContactDetailedInfo/ContactDetailedInfo";
import ActivitiesTable from "components/Table/Activities/ActivitiesTable";
import RelatedContactsTable from "components/Table/Contact/RelatedContactTable";
import ContactWellInterestTable from "components/Table/Contact/ContactWellInterestTable";
import ContactParcelInterestTable from "components/Table/Contact/ContactParcelInterestTable";
import ContactTaxRollInterestTable from "components/Table/Contact/ContactTaxRollInterestTable";
import ContactRelatedAgreementTable from "components/Table/Contact/ContactRelatedAgreementTable";
import UnitInterestsTable from "components/Table/Unit/UnitInterestsTable";
import ContactDealsProvider from "components/DealsDetailCard/ContactDealsProvider";
import ContactDocumentsProvider from "components/ViewDocuments/ContactDocumentsProvider";

import { CircularProgress, Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from "@material-ui/core";

import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent";
import { AGREEMENT_PAYMENT_SUMMARY } from "graphQL/useQueryAgreementPaymentSummary";
import { mapControlsController } from "hookstate/mapControlsController";
import MRTTable from "components/MRTTable";
import { useMemo } from "react";
import { tableController } from "hookstate/tableController";


const useStyles = makeStyles((theme) => ({
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
        "& .MuiBox-root": { padding: "0" },
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
                    height: "calc(50vh - 128px) !important",
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
    selectorOptions: {
        backgroundColor: "#F2F2F2",
        maxHeight: "49.25vh",
        overflow: "overlay",
    },
}));

function MultiGridsComponent({ multiGridInitialData, moduleId, title, getCounts, setDrawer, ...rest }) {

    // contexts
    const [stateApp] = useContext(AppContext);

    // function state
    const [searchTapValue, SearchTapValue] = useState(multiGridInitialData[0]);

    // selectorsW
    const { mapGridCardActiveTap, selectedOwner } = useSelector(({ MapGridCard }) => MapGridCard, shallowEqual);
    const mapLayersPanelExtended = useSelector(({ MainMap }) => MainMap.mapLayersPanelExtended);
    const userGridViewFilters = useSelector(({ session }) => session.userGridViewSettings?.filters);

    const { mapControlsStateValues } = mapControlsController.useState(['mapGridCardActivated'], 'mapControlsStateValues');

    const dispatch = useDispatch();

    const setSearchTapValue = (state) => {
        if (searchTapValue !== state) {
            SearchTapValue(state);
        }
    };

    // styles
    const classes = useStyles({
        mapLayersPanelExtended,
        mapGridCardActivated: mapControlsStateValues.mapGridCardActivated,
        mapGridCardActiveTap,
        viewportWells: stateApp.viewportWells,
        userGridViewFilters,
        // screenSizes
    });

    const [getAgreementPaymentData, { loading: isLoading, data: agreementPaymentData }] = useLazyQuery(AGREEMENT_PAYMENT_SUMMARY);


    useEffect(() => {
        getAgreementPaymentData({
            variables: {
                paymentId: rest.paymentId,
            }
        });
    }, [getAgreementPaymentData, rest.paymentId]);

    useEffect(() => {
        tableController('RelatedPayeesTable').setFilter({ field: 'payments.paymentId', value: rest.paymentId });
        tableController('RelatedBillingPartiesTable').setFilter({ field: 'billingParties.paymentId', value: rest.paymentId });
        tableController('RelatedCostAllocationsTable').setFilter({ field: 'costAllocations.paymentId', value: rest.paymentId });

    }, [rest.paymentId,searchTapValue.value ]);

    // override meta for related payees
    const overrideMetaRelatedPayees = useMemo(() => ({
        customProps: { paymentId: rest.paymentId },
        deletedKeys: {
            mainRecord: { key: '_id' },
            parentRecord: { key: 'paymentId', value: rest.paymentId },
            bypassSelectAll: true,
        }
    }), [rest.paymentId]);

    // override meta for related billing parties
    const overrideMetaRelatedBillingParties = useMemo(() => ({
        customProps: { paymentId: rest.paymentId },
        deletedKeys: {
            mainRecord: { key: '_id' },
            parentRecord: { key: 'paymentId', value: rest.paymentId },
            bypassSelectAll: true,
        }
    }), [rest.paymentId]);

    // override meta for related cost allocations
    const overrideMetaRelatedCostAllocations = useMemo(() => ({
        customProps: { paymentId: rest.paymentId },
        deletedKeys: {
            mainRecord: { key: '_id' },
            parentRecord: { key: 'paymentId', value: rest.paymentId },
            bypassSelectAll: true,
        }
    }), [rest.paymentId]);

    const getAgreementPaymentRelatedCount = (value) => {
        return agreementPaymentData ? agreementPaymentData.agreementPaymentSummary[value] : 0;
    }

    if (!getCounts) getCounts = getAgreementPaymentRelatedCount;

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
                                <Grid item md={2} className={classes.selectorOptions}>
                                    <Typography variant="h6" component="h1" style={{ fontWeight: "bold", padding: "10px 0px 0px 20px" }}>
                                        {title}
                                    </Typography>

                                    <List component="nav" aria-label="main mailbox folders">
                                        {multiGridInitialData.map((row) => {
                                            const Icon = row?.Icon;
                                            return (
                                                <FeatureFlag feature={row.feature} noCheck={!row.feature}>
                                                    <ListItem button selected={row.value === searchTapValue.value} onClick={() => handleSearchPanelChange(row)}>
                                                        {Icon && (
                                                            <ListItemIcon style={{ minWidth: "40px" }}>
                                                                <Icon />
                                                            </ListItemIcon>
                                                        )}

                                                        <ListItemText
                                                            id={row.label}>{row.label}{isLoading ? <CircularProgress size='1rem' /> : `(${(row.showCounts && getCounts) ? getCounts(row.value) : ""
                                                                })`}</ListItemText>
                                                    </ListItem>
                                                </FeatureFlag>
                                            );
                                        })}
                                    </List>
                                </Grid>

                                <Grid item md={10} style={{ padding: "0px" }}>
                                    <div style={{ position: "relative" }} classes={classes.gridTables}>
                                        {searchTapValue.value === "contactInformation" && (
                                            <ContactDetailedInfo user={stateApp.user} purchaseData={rest.purchaseData} contactData={rest.contactData} />
                                        )}
                                        {searchTapValue.value === "activities" && (
                                            <ActivitiesTable
                                                esIndex={"activities_flat"}
                                                id="activitiesInterestsTable"
                                                searchFields={["name", "_all"]}
                                                filtersChange={() => { }}
                                                appliedFilters={[
                                                    {
                                                        field: "contactName.keyword",
                                                        value: rest.contactData?.name,
                                                    },
                                                ]}
                                                filterToggle={() => { }}
                                                targetLabel={"activitiesDashboard"}
                                                header="Activities"
                                                addAble={{ type: "contactActivity" }}
                                                onAddActivity={rest.onAddActivity}
                                                dialogType="activitySideDialog"
                                                applyCustomClasses
                                            />
                                        )}
                                        {searchTapValue.value === "taxRollInterests" && (
                                            <ContactTaxRollInterestTable
                                                parent="assocTaxRollInterests"
                                                id="taxInterestsTable"
                                                header={"Tax Roll Interests"}
                                                targetLabel="well"
                                                contactId={rest.contactData._id}
                                                showTracks
                                            />
                                        )}
                                        {searchTapValue.value === "wellInterests" && (
                                            <ContactWellInterestTable
                                                parent="assocTaxRollInterests"
                                                header={"Well Interests"}
                                                targetLabel="well"
                                                contactId={rest.contactData._id}
                                                id="wellInterestsTable"
                                                showTracks
                                            />
                                        )}
                                        {searchTapValue.value === "unitInterests" && (
                                            <UnitInterestsTable
                                                parent="assocTaxRollInterests"
                                                header={"Unit Interests"}
                                                targetLabel="contactUnits"
                                                id="unitInterestTable"
                                                esFilters={[{ field: "contact._id", value: rest.contactData._id }]}
                                                esIndex="shapeowners_flat"
                                                setESFilters={() => { }}
                                                onTractCount={() => { }}
                                            />
                                        )}
                                        {searchTapValue.value === "tractInterests" && (
                                            <ContactParcelInterestTable
                                                parent="contactAssocTaxRollInterests"
                                                header={"Tract Interests"}
                                                id="tractInterestTable"
                                                targetLabel="parcel"
                                                contactId={rest.contactData._id}
                                                showTracks
                                            />
                                        )}
                                        {searchTapValue.value === "deals" && <ContactDealsProvider />}
                                        {searchTapValue.value === "documents" && <ContactDocumentsProvider contactId={rest.contactData._id} />}
                                        {
                                            searchTapValue.value === "relatedContacts" &&
                                            <RelatedContactsTable contactId={rest.contactData._id} />
                                        }
                                        {searchTapValue.value === "relatedAgreements" &&
                                            <ContactRelatedAgreementTable
                                                dense
                                                moduleId={rest.contactData._id}
                                                setDrawer={rest.setDrawer}
                                                setCounter={() => { }}
                                                esFilters={[{ field: "contact._id", value: rest.contactData._id }]}
                                                targetLabel="Shape"
                                                setESFilters={() => { }}
                                                onTractCount={() => { }}
                                            />}

                                        {searchTapValue.value === "payees" &&
                                            <MRTTable name={"RelatedPayeesTable"} overrideMeta={overrideMetaRelatedPayees} />
                                        }
                                        {searchTapValue.value === "billingParties" &&
                                            <MRTTable name={"RelatedBillingPartiesTable"} overrideMeta={overrideMetaRelatedBillingParties} />
                                        }
                                        {searchTapValue.value === "costAllocations" &&
                                            <MRTTable name={"RelatedCostAllocationsTable"} overrideMeta={overrideMetaRelatedCostAllocations} />
                                        }

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

export default MultiGridsComponent;
