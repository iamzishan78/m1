import React, { useState, useEffect } from "react";
import { Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import CustomDates from "components/Revenue/components/Common/CustomDates";
import { GET_ES_MIN_VALUE } from "graphQL/useQueryESMinValue";
import { useLazyQuery } from "@apollo/client";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
    actionBar: {
        backgroundColor: "#f7f7f7",
        width: "100%",
        minHeight: "65px",
        marginTop: "80px",
    },
    actionsGrid: {
        marginTop: "6px",
        "& .MuiButtonBase-root": {
            width: "149px",
            height: "35px",
            fontWeight: "bold",
        },
    },
}));


const LastCheckDateFilter = ({ field, esIndex, setESFilters, filterToggle, setFilterToggle }) => {
    const classes = useStyles();

    const [selectedFilter, setSelectedFilter] = useState('');
    const [fromDate, setFromDate] = React.useState('');
    const [toDate, setToDate] = React.useState(moment().subtract(1, 'months').endOf('month').format('yyyy-MM-DD'));
    const [lastCheckMinDate, setLastCheckMinDate] = useState('');

    const [getESMinValue] = useLazyQuery(GET_ES_MIN_VALUE, {
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            if (data?.getESMinValue) {
                setLastCheckMinDate(data?.getESMinValue);
                setFromDate(`${moment(data.getESMinValue).startOf('month').format("yyyy-MM-DD")}`);
            }
        },
    });

    useEffect(() => {
        getESMinValue({
            variables: {
                esIndex,
                field,
                value_as_string: true
            }
        })
    }, [getESMinValue])


    useEffect(() => {
        setESFilters([
            {
                field,
                value: {
                    range: {
                        [field]: {
                            gte: fromDate ? `${fromDate}T00:00:00.000Z` : null,
                            lte: toDate ? `${toDate}T00:00:00.000Z` : null,
                        },
                    },
                },
                includeEmpty: selectedFilter === 'All Dates' ? true : undefined
            },
        ])
        setFilterToggle(!filterToggle)

    }, [toDate, fromDate])

    return (
        <div className={classes.actionBar}>
            <Grid container direction="row" display="flex" justify="space-between" style={{ padding: "0px 36px 0px 45px" }}>
                {/* <Grid style={{ marginTop: "2px", padding: 0 }}>
    <label className={classes.label}>Last Check Date</label>
  </Grid> */}
                <Grid item xs={8} md={8} lg={9} xl={8} style={{ marginTop: "4px" }}>
                    <CustomDates fromDate={fromDate} setFromDate={setFromDate} toDate={toDate} setToDate={setToDate} label="Last Check Date" isProperties lastCheckMinDate={lastCheckMinDate} onChange={setSelectedFilter} />
                </Grid>
                <Grid item xs={3} md={3} lg={3} xl={4}>
                    <Grid container display="flex" justify="flex-end" direction="row" spacing={2} className={classes.actionsGrid}>
                        <Grid item>
                            {/* hiding until we have views for properties - kc */}
                            {/* <Button variant="contained" color="secondary">
          Save View
        </Button> */}
                        </Grid>
                        <Grid item>
                            {/* <Button variant="contained" color="secondary" onClick={() => setFilterToggle(!filterToggle)}>
                                Filter
                            </Button> */}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

export default LastCheckDateFilter