import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Chip, IconButton } from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { useStyles as customStyles } from "../style";

import RelatedPaymentsTable from "components/Land/components/Agreements/detailComponents/relatedPayments/RelatedPaymentsTable";
import MultiGridsComponent from "components/Shared/MultiGridsComponent";
import { paymentGridsInitialData } from "utils/data";
import { AppContext } from "AppContext";
import get from "lodash/get";
import AddNewRelatedData from "components/Land/components/Common/AddNewRelatedData";
import { useMutation } from "@apollo/client";
import { ADD_BILLING_PARTY_CONTACT_DESCRIPTOR, ADD_PAYMENT_CONTACT_DESCRIPTOR, ADD_PAYMENT_PROPERTY_DESCRIPTOR, ADD_PROPERTY_CONTACT_DESCRIPTOR } from "graphQL/useMutationAddPaymentContactDescriptor";
import { billingPartyFieldsData, costAllocationFieldsData, payeeFieldsData, paymentFieldsData } from "components/Land/components/Agreements/detailComponents/summary/data";
import { ADD_PAYMENT } from "graphQL/useMutationAddPayment";
import { detailCardController } from "hookstate/detailCardController";

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
    const [stateApp, setStateApp] = useContext(AppContext);
    const classes = useStyles();
    const customClasses = customStyles();

    const [counter, setCounter] = useState(0);
    const agreementDetailState = detailCardController.useState(['customLayer', 'drawer']);
    const agreementDetailsValues = agreementDetailState.stateValues;
    const drawer = agreementDetailsValues.drawer;

    const { paymentId } = stateApp?.paymentMultiGrid || {};
    const relatedObjectId = get(agreementDetailsValues, "customLayer._id");

    const [addPayment, { data: addPaymentData }] = useMutation(ADD_PAYMENT, {
        refetchQueries: ["getESSimpleSearch"],
        awaitRefetchQueries: true,
    });

    const [addPaymentContactDescriptor, { data: addPaymentDescriptorData, loading: addFileLoading }] = useMutation(ADD_PAYMENT_CONTACT_DESCRIPTOR, {
        refetchQueries: ["getESSimpleSearch", 'getAgreementPaymentSummary'],
        awaitRefetchQueries: true,
    });

    const [addBillingPartyContactDescriptor, { data: addBillingPartyDescriptorData, loading: addBillingLoading }] = useMutation(ADD_BILLING_PARTY_CONTACT_DESCRIPTOR, {
        refetchQueries: ["getESSimpleSearch", 'getAgreementPaymentSummary'],
        awaitRefetchQueries: true,
    });

    const [addPaymentPropertyDescriptor, { data: addPropertyDescriptorData }] = useMutation(ADD_PAYMENT_PROPERTY_DESCRIPTOR, {
        refetchQueries: ["getESSimpleSearch", 'getAgreementPaymentSummary'],
        awaitRefetchQueries: true,
    });

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
                                <Chip color="info" label={counter} />
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails className={classes.accordionDetails}>
                        <Grid container direction="column" alignItems="center" spacing={4} style={{ display: "block" }}>
                            {agreementDetailsValues?.customLayer?._id && (<>
                                <Grid item xs={12} style={{ padding: "35px 20px 0px 0px" }}>
                                    <RelatedPaymentsTable
                                        id="relatedPaymentsTable"
                                        dense
                                        moduleId={agreementDetailsValues?.customLayer?._id}
                                        setCounter={setCounter}
                                        targetLabel="Shape"
                                        portal={'#agreementPaymentsDrawer'}
                                    />
                                </Grid>
                                {
                                    stateApp.paymentMultiGrid?.showMultiGrid && (
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
