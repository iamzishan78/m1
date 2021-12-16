import { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useLazyQuery } from "@apollo/client";
import { GET_ES_SUMMARY } from "graphQL/useQueryESSummary";

export const TabButtons = ({ tab, actiiveId, setActive }) => {
    return (
        <div className={tab?.id === actiiveId ? "tab_button active" : "tab_button inactive"}
            onClick={() => setActive(tab?.id)}>
            {tab.label}
        </div>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: 20
    },
    textTransform: {
        fontWeight: "bold",
        textTransform: "uppercase"
    },
    tabButtons: {
        maxWidth: 440,
        margin: "20px 0 32px"
    },
    totalLabelField: {
        marginBottom: 24,
        maxWidth: 400
    },
    totalLabelTextColor: {
        color: "#959595"
    },
    graphCard: {
        padding: 20,
        border: "2px solid #959595",
        borderRadius: 8,
        marginRight: 32
    },
    dataCardWidth: {
        maxWidth: 400,
    },
    dataCardMargin: {
        margin: "0 0 16px"
    },
    productNameBox: {
        background: "#00000070",
        borderRadius: 8,
        padding: "8px 12px",
    },
    productName: {
        fontSize: 14,
        color: "#ffffff",
        margin: 0
    },
    field: {
        margin: "16px 0 0",
    },
    fieldLabel: {
        fontSize: 14,
        textAlign: "center"
    },
    fieldValue: {
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
        margin: 0
    },
}));



const SummarySection = ({ checkId }) => {
    const classes = useStyles();
    const [activeTabId, setActiveTabId] = useState(1);
    const [revenueSummaryDetails, setRevenueSummaryDetails] = useState([]);
    const [adjustmentSummaryDetails, setAdjustmentSummaryDetails] = useState([]);
    const [productSummaryDetails, setProductSummaryDetails] = useState([]);

    // queries 
    const [getESRevenueSummary, { data: revenueSummary }] = useLazyQuery(GET_ES_SUMMARY, {
        context: { batch: false },
        fetchPolicy: "no-cache",
    });
    const [getESAdjustmentSummary, { data: adjustmentSummary }] = useLazyQuery(GET_ES_SUMMARY, {
        context: { batch: false },
        fetchPolicy: "no-cache",
    });
    const [getESProductSummary, { data: productSummary }] = useLazyQuery(GET_ES_SUMMARY, {
        context: { batch: false },
        fetchPolicy: "no-cache",
    });

    let revSummary = revenueSummary?.getESSummary;
    let adjSummary = adjustmentSummary?.getESSummary;
    let prodSummary = productSummary?.getESSummary;


    const summaryTabs = [{ id: 1, label: "Revenue" }, { id: 2, label: "Adjustment" }, { id: 3, label: "Products" }];

    useEffect(() => {
        getESRevenueSummary({
            variables: {
                esIndex: "checkdetails_flat",
                size: 50,
                extendSearchQuery: "revenueSummary"
            },
        });
        getESAdjustmentSummary({
            variables: {
                esIndex: "checkdetails_flat",
                size: 50,
                extendSearchQuery: "adjustmentSummary"
            },
        });
        getESProductSummary({
            variables: {
                esIndex: "checkdetails_flat",
                size: 50,
                extendSearchQuery: "productSummary"
            },
        });
    }, []);

    // revenue summary
    useEffect(() => {
        if (revSummary?.hits?.length > 0) {
            const filterRevSummary = (revSummary?.hits.filter((item) => item.key === checkId && item))[0];
            setRevenueSummaryDetails([
                { name: "Gross Revenue", value: `(${filterRevSummary?.grossRevenue?.value.toFixed(2)})` },
                { name: "Adjustment", value: `(${filterRevSummary?.netOwnerValue?.value.toFixed(2)})` },
                { name: "Net Revenue", value: `(${-1 * (filterRevSummary?.grossRevenue?.value - filterRevSummary?.netOwnerValue?.value).toFixed(2)})` },
                { name: "Lease Payments", value: "-" },
                { name: "Other", value: "-" },
                { name: "Total Income", value: `(${-1 * (filterRevSummary?.grossRevenue?.value - filterRevSummary?.netOwnerValue?.value).toFixed(2)})` },
            ]);
        }
    }, [revSummary]);

    // adjustment summary
    useEffect(() => {
        if (adjSummary?.hits?.length > 0) {
            const filterAdjSummary = (adjSummary?.hits.filter((item) => item.key === checkId && item))[0];
            let { deductType, taxType } = filterAdjSummary;
            const deducts = deductType?.buckets?.length > 0 && deductType?.buckets?.map((item) => (
                { name: item.key, value: (item.ownerDeducts?.value).toFixed(2) }
            ));
            const taxes = taxType?.buckets?.length > 0 && taxType?.buckets?.map((item) => (
                { name: item.key, value: (item.ownerTax?.value).toFixed(2) }
            ));
            if (deducts && taxes) {
                setAdjustmentSummaryDetails([...deducts, ...taxes]);
            } else if (deducts) {
                setAdjustmentSummaryDetails([...deducts]);
            } else if (taxes) {
                setAdjustmentSummaryDetails([...taxes]);
            } else {
                setAdjustmentSummaryDetails([]);
            }

        }
    }, [adjSummary]);

    // products summary
    useEffect(() => {
        if (prodSummary?.hits?.length > 0) {
            const filterProdSummary = (prodSummary?.hits.filter((item) => item.key === checkId && item))[0];
            setProductSummaryDetails(filterProdSummary?.product?.buckets);
        }
    }, [prodSummary]);


    return (
        <div className={`${classes.root} flex column justifyStart alignStart w-100`}>
            <Typography varient="h6" className={classes.textTransform}>
                Summary
            </Typography>
            <div className={`${classes.tabButtons} flex justifyBetween alignCenter w-100`}>
                {summaryTabs.map((tab, index) => (
                    <TabButtons key={index + 1} tab={tab} actiiveId={activeTabId} setActive={(selectedId) => setActiveTabId(selectedId)} />
                ))}
            </div>

            {/* Revenue */}
            {activeTabId === 1 && (
                <div className="flex justifyBetween alignCenter w-100">
                    <div className="flex column justifyBetween alignStart w-100">
                        <div className={classes.graphCard}>
                            <img src="https://landing.moqups.com/img/content/charts-graphs/pie-donut-charts/simple-donut-chart/simple-donut-chart-1600.png"
                                alt="static donut chart image" height={300} width={300} />
                        </div>
                    </div>
                    <div className="flex column justifyBetween alignCenter w-100">
                        {revenueSummaryDetails?.length > 0 && revenueSummaryDetails.map((item, index) => (
                            <div key={index + 1} className={`${classes.dataCardWidth} ${classes.dataCardMargin} flex justifyBetween alignCenter w-100`}>
                                <div className="flex alignCenter justifyStart">
                                    <Typography varient="h6" className={classes.textTransform}>
                                        {item.name || ""}
                                    </Typography>
                                </div>

                                <div className="flex alignStart justifyStart">
                                    <Typography varient="h6" className={classes.textTransform}>
                                        {`${item.value || 0}`}
                                    </Typography>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Adjustment */}
            {activeTabId === 2 && (
                <div className="flex justifyBetween alignCenter w-100">
                    <div className="flex column justifyBetween alignStart w-100">
                        <div className={classes.graphCard}>
                            <img src="https://landing.moqups.com/img/content/charts-graphs/pie-donut-charts/simple-donut-chart/simple-donut-chart-1600.png"
                                alt="static donut chart image" height={300} width={300} />
                        </div>
                    </div>
                    <div className="flex column justifyBetween alignCenter w-100">
                        <div className={`${classes.totalLabelField} flex justifyEnd alignCenter w-100`}>
                            <Typography varient="h6" className={`${classes.textTransform} ${classes.totalLabelTextColor}`}>
                                Total
                            </Typography>
                        </div>
                        {adjustmentSummaryDetails?.length > 0 && adjustmentSummaryDetails.map((item, index) => (
                            <div key={index + 1} className={`${classes.dataCardWidth} flex justifyBetween alignCenter w-100`} style={{ marginTop: 12 }}>
                                <div className="flex alignStart justifyStart">
                                    <Typography varient="h6" className={classes.textTransform}>
                                        {item.name || ""}
                                    </Typography>
                                </div>

                                <div className="flex alignStart justifyStart">
                                    <Typography varient="h6" className={classes.textTransform}>
                                        {item.value}
                                    </Typography>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Products */}
            {activeTabId === 3 && (
                <div className="flex justifyBetween alignCenter w-100">
                    <div className="flex column justifyBetween alignStart">
                        <div className={classes.graphCard}>
                            <img src="https://landing.moqups.com/img/content/charts-graphs/pie-donut-charts/simple-donut-chart/simple-donut-chart-1600.png"
                                alt="static donut chart image" height={300} width={300} />
                        </div>
                    </div>

                    <div className="flex justifyBetween alignCenter w-100">
                        {productSummaryDetails?.length > 0 && productSummaryDetails.map((item, index) => (
                            <div key={index + 1} className="flex column justifyStart alignStart w-100" className={`${classes.dataCardMargin} flex justifyBetween alignCenter w-100`}>
                                <div className="flex column justifyBetween alignCenter w-100">
                                    <div className={classes.productNameBox} >
                                        <p className={`${classes.productName} ${classes.textTransform}`}>
                                            {item.key || ""}
                                        </p>
                                    </div>

                                    {/* Owner volume */}
                                    <div className={`${classes.field} flex column justifyBetween alignCenter w-100`}>
                                        <p className={classes.fieldLabel}>
                                            Owner Volume
                                        </p>

                                        <p className={classes.fieldValue}>
                                            {item?.grossOwnerVolume?.value.toFixed(2)}
                                        </p>
                                    </div>

                                    {/* Owner Net Revenue */}
                                    <div className={`${classes.field} flex column justifyBetween alignCenter w-100`}>
                                        <p className={classes.fieldLabel}>
                                            Owner Net Revenue
                                        </p>

                                        <p className={classes.fieldValue}>
                                            {item?.netRevenue?.value.toFixed(2)}
                                        </p>
                                    </div>

                                    {/* Average Price */}
                                    <div className={`${classes.field} flex column justifyBetween alignCenter w-100`}>
                                        <p className={classes.fieldLabel}>
                                            Average Price
                                        </p>

                                        <p className={classes.fieldValue}>
                                            {item?.avgPrice?.value.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}


export default SummarySection;