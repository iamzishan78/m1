import React, { useContext, useMemo } from "react";
import { makeStyles } from "@material-ui/styles";
import { Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Chip, IconButton } from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { useStyles as customStyles } from "../style";

import MultiGridsComponent from "components/Shared/MultiGridsComponent";
import { paymentGridsInitialData } from "utils/data";
import { AppContext } from "AppContext";
import get from "lodash/get";
import AddNewRelatedData from "components/Land/components/Common/AddNewRelatedData";
import { useMutation } from "@apollo/client";
import { ADD_BILLING_PARTY_CONTACT_DESCRIPTOR, ADD_PAYMENT_CONTACT_DESCRIPTOR, ADD_PAYMENT_PROPERTY_DESCRIPTOR } from "graphQL/useMutationAddPaymentContactDescriptor";
import { billingPartyFieldsData, costAllocationFieldsData, payeeFieldsData, paymentFieldsData } from "components/Land/components/Agreements/detailComponents/summary/data";
import { ADD_PAYMENT } from "graphQL/useMutationAddPayment";
import { detailCardController } from "hookstate/detailCardController";
import MRTTable from "components/MRTTable";
import { tableController, tableGlobalController } from "hookstate/tableController";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: "10px 25px",
    },
    accordionRoot: {
        borderRadius: "5px",
        margin: "10px 0px",
        boxShadow: "none",
        "& .MuiButtonBase-root.MuiAccordionSummary-root": {
            maxHeight: "50px",
            minHeight: "50px",
            padding: 0,
        },
        "&.MuiAccordion-root.Mui-expanded": {
            margin: 0,
        },
    },
    accordionHeading: {
        display: "flex !important",
        alignItems: "center",
        "& .MuiChip-root": {
            width: "auto",
            fontSize: "1.2rem",
            fontWeight: "bold",
            color: "#fff",
            borderRadius: "3px !important",
            backgroundColor: "#18aadd",
        },
    },
    accordionDetails: {
        padding: "30px 18px",
    },
    numberField: {
        "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
        },
        "& input[type=number]": {
            "-moz-appearance": "textfield",
        },
        "& input[type=number]::-webkit-outer-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
        },
        "& input[type=number]::-webkit-inner-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
        },
    },
    documentHeader: {
        fontSize: "1.25rem",
        "& svg": {
            transform: "translate(-4%, 22%)",
        },
    },
}));

const RelatedPayments = () => {
    const [stateApp] = useContext(AppContext);
    const classes = useStyles();
    const customClasses = customStyles();
    const agreementDetailState = detailCardController.useState(['customLayer', 'drawer']);
    const tableGlobalState = tableGlobalController.useState(['paymentMultiGrid']);
    const paymentsCount = tableController('RelatedPaymentsTable')?.useState(['data']);
    const agreementDetailsValues = agreementDetailState.stateValues;
    const tableGlobalValues = tableGlobalState.stateValues;
    const drawer = agreementDetailsValues.drawer;
    const paymentMultiGrid = tableGlobalValues.paymentMultiGrid;
    const { paymentId } = paymentMultiGrid || {};
    const relatedObjectId = get(agreementDetailsValues, "customLayer._id");

    const [addPayment] = useMutation(ADD_PAYMENT, {
        refetchQueries: ["getESSimpleSearch"],
        awaitRefetchQueries: true,
    });

    const [addPaymentContactDescriptor] = useMutation(ADD_PAYMENT_CONTACT_DESCRIPTOR, {
        refetchQueries: ["getESSimpleSearch", 'getAgreementPaymentSummary'],
        awaitRefetchQueries: true,
    });

    const [addBillingPartyContactDescriptor] = useMutation(ADD_BILLING_PARTY_CONTACT_DESCRIPTOR, {
        refetchQueries: ["getESSimpleSearch", 'getAgreementPaymentSummary'],
        awaitRefetchQueries: true,
    });

    const [addPaymentPropertyDescriptor] = useMutation(ADD_PAYMENT_PROPERTY_DESCRIPTOR, {
        refetchQueries: ["getESSimpleSearch", 'getAgreementPaymentSummary'],
        awaitRefetchQueries: true,
    });

    // override meta for related payments
    const overrideMetaRelatedPayments = useMemo(() => ({
        defaultFilters: [
            { field: "shapeObj._id", value: agreementDetailsValues?.customLayer?._id },
        ],
        // customProps: { customLayer: parcelObj }
    }), [agreementDetailsValues]);

    const addNewPayment = (newData, setLoader) => {
        setLoader(true)
        addPayment({
            variables: {
                payment: {
                    ...newData,
                    userId: stateApp.user.mongoId,
                    relatedObjectId: relatedObjectId,
                    relatedObjectType: "Shape"
                }
            },
        }).then(() => {
            detailCardController.updateState({ drawer: "" });
            tableGlobalController.refetch();
            setLoader(false);
        });
    }

    const addNewPayee = (newData, setLoader) => {
        setLoader(true)

        addPaymentContactDescriptor({
            variables: {
                payment: {
                    ...newData,
                    paymentId: paymentId
                }
            },
        }).then(() => {
            tableGlobalController.refetch();
            detailCardController.updateState({ drawer: "" })
            setLoader(false);
        });
    }

    const addNewBillingParty = (newData, setLoader) => {
        setLoader(true)

        addBillingPartyContactDescriptor({
            variables: {
                billingParty: {
                    ...newData,
                    paymentId: paymentId
                }
            },
        }).then(() => {
            tableGlobalController.refetch();
            detailCardController.updateState({ drawer: "" })
            setLoader(false);
        });
    }

    const addNewCostAllocation = (newData, setLoader) => {
        setLoader(true)

        addPaymentPropertyDescriptor({
            variables: {
                property: {
                    ...newData,
                    paymentId: paymentId,
                }
            },
        }).then(() => {
            tableGlobalController.refetch();
            detailCardController.updateState({ drawer: "" })
            setLoader(false);
        });
    }

    return (
        <>
            <div className={classes.root}>
                <Accordion className={classes.accordionRoot} defaultExpanded={true}>
                    <AccordionSummary
                        expandIcon={
                            <IconButton>
                                <ExpandMoreIcon fontSize="large" />
                            </IconButton>
                        }
                        onClick={(e) => { }}
                    >
                        <Grid container direction="row" justify="space-between" alignItems="center">
                            <Grid item xs={6} className={classes.accordionHeading}>
                                <Typography variant="h5" className={customClasses.titleText}>
                                    Payment Obligations
                                </Typography>
                                <Chip color="info" label={paymentsCount?.stateValues?.data?.total || 0} />
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails className={classes.accordionDetails}>
                        <Grid container direction="column" alignItems="center" spacing={4} style={{ display: "block" }}>
                            {agreementDetailsValues?.customLayer?._id && (<>
                                <MRTTable name="RelatedPaymentsTable" overrideMeta={overrideMetaRelatedPayments} />
                                {
                                    paymentMultiGrid?.showMultiGrid && (
                                        <Grid item xs={12} style={{ padding: "35px 20px 0px 0px" }}>
                                            <MultiGridsComponent
                                                moduleId={agreementDetailsValues?.customLayer?._id}
                                                multiGridInitialData={paymentGridsInitialData}
                                                title="Payment Details"
                                                paymentId={paymentId}
                                            />
                                        </Grid>
                                    )
                                }

                            </>
                            )}
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </div>

            {drawer === "pymnt" && (
                <AddNewRelatedData
                    title="Payments"
                    addNewData={addNewPayment}
                    payeeFieldsData={paymentFieldsData}
                    relatedObjectType="Shape"
                    relatedObjectId={get(agreementDetailsValues, "customLayer._id")}
                />
            )}

            {drawer === "payee" && (
                <AddNewRelatedData
                    title="Payee"
                    addNewData={addNewPayee}
                    payeeFieldsData={payeeFieldsData}
                    relatedObjectType="Shape"
                    relatedObjectId={get(agreementDetailsValues, "customLayer._id")}
                />
            )}
            {drawer === "billingParty" && (
                <AddNewRelatedData
                    title="Billing Party"
                    addNewData={addNewBillingParty}
                    payeeFieldsData={billingPartyFieldsData}
                    relatedObjectType="Shape"
                    relatedObjectId={get(agreementDetailsValues, "customLayer._id")}
                />
            )}
            {drawer === "costAllocation" && (
                <AddNewRelatedData
                    title="Cost Alloation"
                    addNewData={addNewCostAllocation}
                    payeeFieldsData={costAllocationFieldsData}
                    relatedObjectType="Shape"
                    relatedObjectId={get(agreementDetailsValues, "customLayer._id")}
                />
            )}
        </>
    );
};

export default RelatedPayments;
