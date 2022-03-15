import React from 'react';
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import RevenueCharts from "./Charts";
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
            total: "3,000"
        }, {
            name: "Adjustments",
            total: "900,000"
        }, {
            name: "Net Revenue",
            total: "2,000"
        }, {
            name: "Lease Payments",
            total: "44,000"
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
                Revenue & Income
            </Typography>
            <RevenueCharts items={items} total={total} />
            <RevenueTable monthsInterval={monthsInterval} items={items} total={total} />
        </>
    )
}

export default RevenueSection;
