import { useState } from "react";
import { Typography } from "@material-ui/core";

export const TabButtons = ({ tab, actiiveId, setActive }) => {
    return (
        <div className={tab?.id === actiiveId ? "tab_button active" : "tab_button inactive"}
            onClick={() => setActive(tab?.id)}>
            {tab.label}
        </div>
    )
}

const SummarySection = () => {
    const [activeTabId, setActiveTabId] = useState(1);
    const summaryTabs = [
        { id: 1, label: "Revenue" },
        { id: 2, label: "Adjustment" },
        { id: 3, label: "Products" }
    ];

    const [data, setData] = useState([
        { name: "Severence Tax", value: "3,143.31" },
        { name: "Transportation - Oil", value: "3,143.31" },
        { name: "Compression", value: "3,143.31" },
        { name: "Transportation - Gas", value: "3,143.31" },
        { name: "Processing", value: "3,143.31" },
        { name: "Other", value: "3,143.31" },
        { name: "Other 2", value: "3,143.31" },
    ]);

    const [revnueData, setRevenueData] = useState([
        { name: "Gross Revenue", value: "10,000.00" },
        { name: "Adjustment", value: "(3,143.31)" },
        { name: "Net Revenue", value: "6,856.69" },
        { name: "Lease Payments", value: "-" },
        { name: "Other", value: "-" },
        { name: "Total Income", value: "6,856.69" },
    ]);

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
                        {revnueData?.length > 0 && revnueData.map((item, index) => (
                            <div key={index + 1} className="flex justifyBetween alignCenter w-100" style={{ maxWidth: 400, margin: "0 0 16px" }}>
                                <div className="flex alignCenter justifyStart">
                                    <Typography varient="h6" style={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                        {item.name || ""}
                                    </Typography>
                                </div>

                                <div className="flex alignStart justifyStart">
                                    <Typography varient="h6" style={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                        {`${item.value || ""}`}
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
                        {data?.length > 0 && data.map((item, index) => (
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
                <div className="flex justifyBetween alignStart w-100">
                    <div className="flex column justifyBetween alignStart">
                        <div style={{ padding: 20, border: "2px solid #01010160", borderRadius: 8, marginRight: 20 }}>
                            <img src="https://landing.moqups.com/img/content/charts-graphs/pie-donut-charts/simple-donut-chart/simple-donut-chart-1600.png"
                                alt="static donut chart image" height={300} width={300} />
                        </div>
                    </div>
                    <div className="flex column justifyStart alignCenter w-100">

                        {/* Gross Revenue */}
                        <div className="flex justifyBetween alignStart w-100">
                            {grossRevenue?.length > 0 && grossRevenue.map((item, index) => (
                                <div key={index + 1} className="flex column justifyBetween alignCenter w-100" style={{ margin: "0 10px 0" }}>
                                    <div style={{ background: "#00000072", borderRadius: 8, padding: 8, }} >
                                        <p style={{ fontWeight: "bold", fontSize: 14, color: "#ffffff", textTransform: "uppercase", margin: 0 }}>
                                            {item.label || ""}
                                        </p>
                                    </div>
                                    <p style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>
                                        {item.name || ""}
                                    </p>
                                    <p style={{ fontWeight: "bold", fontSize: 16, textAlign: "center", margin: 0 }}>
                                        {item.value || ""}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="flex column justifyBetween alignCenter w-100" style={{ marginTop: 16 }}>
                            {productData?.length > 0 && productData.map((item, index) => (
                                <div key={index + 1} className="flex column justifyStart alignStart w-100" style={{ margin: "16px 0 0" }}>
                                    <div className="flex justifyBetween alignCenter w-100" style={{ margin: "0 0 16px" }}>
                                        {item.map((subItem, subIndex) => (
                                            <div key={subIndex + 1} className="flex column justifyBetween alignCenter w-100">
                                                <p style={{ fontSize: 12, fontWeight: "bold", color: "#000000", textAlign: "center", textTransform: "capitalize", margin: "0 0 8px" }}>
                                                    {subItem.name || ""}
                                                </p>

                                                <p style={{ fontWeight: "bold", fontSize: 16, textAlign: "center", margin: 0 }}>
                                                    {subItem.value || ""}
                                                </p>

                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}


export default SummarySection;