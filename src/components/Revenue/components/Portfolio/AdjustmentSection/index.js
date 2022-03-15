import React from 'react';
import { Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import DonutChart from "../RevenueSection/DonutChart";
import StackedChart from "../RevenueSection/StackedChart";
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
            value: "10,000,000"
        }, {
            name: "Transportation - Oil",
            value: "900,000"
        }, {
            name: "Transportation - Gas",
            value: "2,000"
        }, {
            name: "Compression",
            value: "13,000"
        }, {
            name: "Processing",
            value: "13,000"
        }, {
            name: "Lease Use",
            value: "13,000"
        }, {
            name: "Other",
            value: "13,000"
        }
    ]);

    const total = useMemo(() => {
        if (items.length === 0) return 0;

        let _total = 0;
        items.forEach(item => {
            _total += Number(item.value.replace(/,/g, ""));
        });
        return vf_number(_total);
    }, [items]);

    return (
        <>
            <Typography variant="h6" className={classes.sectionTitle}>
                Adjustments
            </Typography>
            <Grid container display="flex" direction="row" alignItems="center" justify="flex-start" spacing={3} className={classes.root}>
                <Grid item xs={5}>
                    <DonutChart items={items} total={total} id="adjustment-chart" />
                </Grid>
                <Grid item xs={7}>
                    <StackedChart items={items} total={total} id="adjustment-chart-stacked" />
                </Grid>
            </Grid>
            <AdjustmentTable monthsInterval={monthsInterval} items={items} total={total} />
        </>
    )
}

export default AdjustmentSection;
