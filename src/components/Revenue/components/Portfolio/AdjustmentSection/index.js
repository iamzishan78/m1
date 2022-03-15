import React from 'react';
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import Charts from "../RevenueSection/Charts";
import AdjustmentTable from "./AdjustmentTable";
import vf_number from "components/Shared/valueformatters/vf_number";

const { useState, useMemo } = React;

const useStyles = makeStyles((theme) => ({
    sectionTitle: {
        textTransform: "uppercase",
        fontWeight: theme.typography.fontWeightBold,
    },
}));

const AdjustmentSection = ({ monthsInterval }) => {
    const classes = useStyles();
    const [items, setItems] = useState([
        {
            name: 'Severance Tax',
            total: "10,000,000"
        }, {
            name: "Transportation - Oil",
            total: "900,000"
        }, {
            name: "Transportation - Gas",
            total: "2,000"
        }, {
            name: "Compression",
            total: "13,000"
        }, {
            name: "Processing",
            total: "13,000"
        }, {
            name: "Lease Use",
            total: "13,000"
        }, {
            name: "Other",
            total: "13,000"
        }
    ]);

    const total = useMemo(() => {
        if (items.length === 0) return 0;

        let _total = 0;
        items.forEach(item => {
            _total += Number(item.total.replace(/,/g, ""));
        });
        return vf_number(_total);
    }, [items]);

    return (
        <>
            <Typography variant="h6" className={classes.sectionTitle}>
                Adjustments
            </Typography>
            <Charts items={items} total={total} id="adjustment-chart" />
            <AdjustmentTable monthsInterval={monthsInterval} items={items} total={total} />
        </>
    )
}

export default AdjustmentSection;
