import { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import { useLazyQuery } from "@apollo/client";
import { GET_ES_REVENUE_SUMMARY } from "graphQL/useQueryESRevenueSummary";
import { GET_ES_ADJUSTMENT_SUMMARY } from "graphQL/useQueryESAdjustmentSummary";
import { GET_ES_PRODUCT_SUMMARY } from "graphQL/useQueryESProductSummary";

export const TabButtons = ({ tab, actiiveId, setActive }) => {
    return (
        <div className={tab?.id === actiiveId ? "tab_button active" : "tab_button inactive"}
            onClick={() => setActive(tab?.id)}>
            {tab.label}
        </div>
    )
}

const SummarySection = ({ checkId }) => {

    const [activeTabId, setActiveTabId] = useState(1);
    const [revenueSummaryDetails, setRevenueSummaryDetails] = useState([]);
    const [adjustmentSummaryDetails, setAdjustmentSummaryDetails] = useState([]);
    const [productSummaryDetails, setProductSummaryDetails] = useState([]);

    // queries 
    const [getESRevenueSummary, { data: revenueSummary }] = useLazyQuery(GET_ES_REVENUE_SUMMARY, {
        context: { batch: false },
        fetchPolicy: "no-cache",
    });
    const [getESAdjustmentSummary, { data: adjustmentSummary }] = useLazyQuery(GET_ES_ADJUSTMENT_SUMMARY, {
        context: { batch: false },
        fetchPolicy: "no-cache",
    });
    const [getESProductSummary, { data: productSummary }] = useLazyQuery(GET_ES_PRODUCT_SUMMARY, {
        context: { batch: false },
        fetchPolicy: "no-cache",
    });

    let revSummary = revenueSummary?.getRevenueSummary;
    let adjSummary = adjustmentSummary?.getAddjustmentSummary;
    let prodSummary = productSummary?.getProductSummary;


    const summaryTabs = [
        { id: 1, label: "Revenue" },
        { id: 2, label: "Adjustment" },
        { id: 3, label: "Products" }
    ];

    const [grossRevenue, setGrossRevenue] = useState([
        { label: "Oil", name: "Production Gross Volume (bbl)", value: "190,325" },
        { label: "Gas", name: "Production Gross Volume (mcf)", value: "607,755" },
        { label: "NGL", name: "Production Gross Volume (gal)", value: "0" },
        { label: "Other", name: "Owner net Revenue", value: "$798,080" },
    ])
    const [productData, setProductData] = useState(
        [[
            { name: "Owner Volume", value: "9,327.4" },
            { name: "Owner Volume", value: "9,327.4" },
            { name: "Owner Volume", value: "9,327.4" },
        ], [
            { name: "Owner Net Revenue", value: "3,143.31" },
            { name: "Owner Net Revenue", value: "3,143.31" },
            { name: "Owner Net Revenue", value: "0.00" },
        ], [
            { name: "Average Price", value: "3,143.31" },
            { name: "Average Price", value: "3,143.31" },
            { name: "NGL Yield", value: "-" },
        ]
        ]);

    useEffect(() => {
        getESRevenueSummary({
            variables: {
                esIndex: "checkdetails_flat",
                size: 50,
            },
        });
        getESAdjustmentSummary({
            variables: {
                esIndex: "checkdetails_flat",
                size: 50,
            },
        });
        getESProductSummary({
            variables: {
                esIndex: "checkdetails_flat",
                size: 50,
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
                { name: "Net Revenue", value: `(${(filterRevSummary?.grossRevenue?.value - filterRevSummary?.netOwnerValue?.value).toFixed(2)})` },
                { name: "Lease Payments", value: "-" },
                { name: "Other", value: "-" },
                { name: "Total Income", value: `(${(filterRevSummary?.grossRevenue?.value - filterRevSummary?.netOwnerValue?.value).toFixed(2)})` },
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
            setAdjustmentSummaryDetails([...deducts, ...taxes]);
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
        <div className="flex column justifyStart alignStart w-100" style={{ padding: 20 }}>
            <Typography varient="h6" style={{ fontWeight: "bold", textTransform: "uppercase" }}>
                Summary
            </Typography>
            <div className="flex justifyBetween alignCenter w-100" style={{ maxWidth: 440, margin: "20px 0 32px" }}>
                {summaryTabs.map((tab, index) => (
                    <TabButtons key={index + 1} tab={tab} actiiveId={activeTabId} setActive={(selectedId) => setActiveTabId(selectedId)} />
                ))}
            </div>

            {/* Revenue */}
            {activeTabId === 1 && (
                <div className="flex justifyBetween alignCenter w-100">
                    <div className="flex column justifyBetween alignStart w-100">
                        <div style={{ padding: 20, border: "2px solid #01010160", borderRadius: 8, marginRight: 32 }}>
                            <img src="https://landing.moqups.com/img/content/charts-graphs/pie-donut-charts/simple-donut-chart/simple-donut-chart-1600.png"
                                alt="static donut chart image" height={300} width={300} />
                        </div>
                    </div>
                    <div className="flex column justifyBetween alignCenter w-100">
                        <div className="flex justifyEnd alignCenter w-100" style={{ marginBottom: 24, maxWidth: 400 }}>
                            <Typography varient="h6" style={{ fontWeight: "bold", textTransform: "uppercase", color: "gray" }}>
                                Total
                            </Typography>
                        </div>
                        {revenueSummaryDetails?.length > 0 && revenueSummaryDetails.map((item, index) => (
                            <div key={index + 1} className="flex justifyBetween alignCenter w-100" style={{ maxWidth: 400, margin: "0 0 16px" }}>
                                <div className="flex alignCenter justifyStart">
                                    <Typography varient="h6" style={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                        {item.name || ""}
                                    </Typography>
                                </div>

                                <div className="flex alignStart justifyStart">
                                    <Typography varient="h6" style={{ fontWeight: "bold", textTransform: "uppercase" }}>
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
                        <div style={{ padding: 20, border: "2px solid #01010160", borderRadius: 8, marginRight: 32 }}>
                            <img src="https://landing.moqups.com/img/content/charts-graphs/pie-donut-charts/simple-donut-chart/simple-donut-chart-1600.png"
                                alt="static donut chart image" height={300} width={300} />
                        </div>
                    </div>
                    <div className="flex column justifyBetween alignCenter w-100">
                        {adjustmentSummaryDetails?.length > 0 && adjustmentSummaryDetails.map((item, index) => (
                            <div key={index + 1} className="flex justifyBetween alignCenter w-100" style={{ maxWidth: 400 }}>
                                <div className="flex alignStart justifyStart" style={{ margin: "0 0 16px" }}>
                                    <Typography varient="h6" style={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                        {item.name || ""}
                                    </Typography>
                                </div>

                                <div className="flex alignStart justifyStart">
                                    <Typography varient="h6" style={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                        {`(${item.value || ""})`}
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
                        <div style={{ padding: 20, border: "2px solid #01010160", borderRadius: 8, marginRight: 20 }}>
                            <img src="https://landing.moqups.com/img/content/charts-graphs/pie-donut-charts/simple-donut-chart/simple-donut-chart-1600.png"
                                alt="static donut chart image" height={300} width={300} />
                        </div>
                    </div>

                    <div className="flex justifyBetween alignCenter w-100">
                        {productSummaryDetails?.length > 0 && productSummaryDetails.map((item, index) => (
                            <div key={index + 1} className="flex column justifyStart alignStart w-100" style={{ margin: "16px 0 0" }}>
                                <div className="flex column justifyBetween alignCenter w-100">
                                    <div style={{ background: "#00000072", borderRadius: 8, padding: 8, }} >
                                        <p style={{ fontWeight: "bold", fontSize: 14, color: "#ffffff", textTransform: "uppercase", margin: 0 }}>
                                            {item.key || ""}
                                        </p>
                                    </div>

                                    {/* Owner volume */}
                                    <div className="flex column justifyBetween alignCenter w-100" style={{ margin: "16px 0 0" }}>
                                        <p style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>
                                            Owner Volume
                                        </p>

                                        <p style={{ fontWeight: "bold", fontSize: 16, textAlign: "center", margin: 0 }}>
                                            {item?.grossOwnerVolume?.value.toFixed(2)}
                                        </p>
                                    </div>

                                    {/* Owner Net Revenue */}
                                    <div className="flex column justifyBetween alignCenter w-100" style={{ margin: "16px 0 0" }}>
                                        <p style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>
                                            Owner Net Revenue
                                        </p>

                                        <p style={{ fontWeight: "bold", fontSize: 16, textAlign: "center", margin: 0 }}>
                                            {item?.netRevenue?.value.toFixed(2)}
                                        </p>
                                    </div>

                                    {/* Average Price */}
                                    <div className="flex column justifyBetween alignCenter w-100" style={{ margin: "16px 0 0" }}>
                                        <p style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>
                                            Average Price
                                        </p>

                                        <p style={{ fontWeight: "bold", fontSize: 16, textAlign: "center", margin: 0 }}>
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