import React from 'react';
import { Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import DonutChart from "./DonutChart";
import StackedChart from "./StackedChart";
import RevenueTable from "./RevenueTable";
import vf_number from "components/Shared/valueformatters/vf_number";

const { useState, useMemo } = React;

const useStyles = makeStyles((theme) => ({
    sectionTitle: {
        textTransform: "uppercase",
        fontWeight: theme.typography.fontWeightBold,
    },
}));

const RevenueSection = ({ monthsInterval }) => {
    const classes = useStyles();
    const [items, setItems] = useState([
        {
            name: 'Gross Revenue',
            value: "3,000"
        }, {
            name: "Adjustments",
            value: "900,000"
        }, {
            name: "Net Revenue",
            value: "2,000"
        }, {
            name: "Lease Payments",
            value: "44,000"
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
                Revenue & Income
            </Typography>
            <Grid container display="flex" direction="row" alignItems="center" justify="flex-start" spacing={3} className={classes.root}>
                <Grid item xs={5}>
                    <DonutChart items={items} total={total} />
                </Grid>
                <Grid item xs={7}>
                    <StackedChart items={items} total={total} />
                </Grid>
            </Grid>
            <RevenueTable monthsInterval={monthsInterval} items={items} total={total} />
        </>
    )
}

export default RevenueSection;
