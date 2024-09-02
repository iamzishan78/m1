import React, { Fragment, useState, useCallback, useContext, useEffect, } from 'react'
import CardHeader from "@material-ui/core/CardHeader";
import { Grid, Typography, TextField, Button } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { CUSTOM_DATES } from 'utils/data'
import { makeStyles } from "@material-ui/styles";
import moment from "moment";
import { copy } from "utils/helper";
import { useLazyQuery } from "@apollo/client";
import { GET_ACTIVITY_TASK_PER_USER } from "graphQL/useQueryActivityTaskPerUser";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { cloneDeep } from 'lodash';
import get from "lodash/get";
import { getRangeFilters } from "utils/helper";

const useStyles = makeStyles((theme) => ({
    actionBar: {
        backgroundColor: "#f7f7f7",
        width: "100%",
        minHeight: "65px",
        marginTop: "100px",
    },
    actionsGrid: {
        marginTop: "6px",
        "& .MuiButtonBase-root": {
            width: "149px",
            height: "35px",
            fontWeight: "bold",
        },
    },
    dateRoot: {
        border: "1px solid #EBEBEB",
        backgroundColor: "#fff",
        "&.Mui-focused fieldset": {
            border: "1px solid black",
            backgroundColor: "transparent",
        },
        "&:hover": {
            backgroundColor: "#EBEBEB",
        },
        "&:active": {
            border: "1px solid black",
            backgroundColor: "#fff",
        },
    },
    inputFieldDate: {
        "& .MuiOutlinedInput-input": {
        },
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
    },
}));

const Title = ({
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    minDate,
}) => {
    const classes = useStyles();

    return (
        <Grid container>
            <Grid item xs={5} sm={5} md={4} container alignItems="center" >
                <div>Tasks by Assignee and Status</div>
            </Grid>
            <Grid item xs={7} sm={7} md={8}>
                <div>
                    <TaskFilters
                        fromDate={fromDate}
                        setFromDate={setFromDate}
                        toDate={toDate}
                        setToDate={setToDate}
                    />
                </div>
            </Grid>
        </Grid>
    );
};

export default function TrackTaskCard() {
    const [analyticsData, setAnalyticsData] = useState([]);
    const [taskperUser, setTaskperUser] = useState([]);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const [getActivityAnalytics, { loading }] = useLazyQuery(GET_ACTIVITY_TASK_PER_USER, {
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            if (data?.getActivityTaskPerUser) {
                setAnalyticsData(data?.getActivityTaskPerUser);
            }
        },
    });

    const getFilters = (appliedFilters) => {
        let filters = [];
        if (appliedFilters) {
            let range = [];
            range = getRangeFilters(
                {
                    dateTime: {
                        from: appliedFilters.fromDate ? new Date(appliedFilters.fromDate).toISOString() : null,
                        to: appliedFilters.toDate ? new Date(appliedFilters.toDate).toISOString() : null,
                    },
                },
                "simple"
            );
            if (range.length > 0) filters = [...filters, ...range];
            range = getRangeFilters(
                {
                    endDateTime: {
                        from: appliedFilters.fromDate ? new Date(appliedFilters.fromDate).toISOString() : null,
                        to: appliedFilters.toDate ? new Date(appliedFilters.toDate).toISOString() : null,
                    },
                },
                "simple"
            );
            if (range.length > 0) filters = [...filters, ...range];
            if (!filters.length && appliedFilters.length) filters = appliedFilters;
        }
        return filters;
    };

    const getAllFilters = () => {
        let rangeFilters = [];
        rangeFilters = getFilters({ fromDate, toDate });
        return [...rangeFilters];
    };

    useEffect(() => {
        // setTaskperUser([]);
        getActivityAnalytics({
            variables: {
                search: {
                    fields: ["name", "_all"],
                    query: "",
                },
                filters: getAllFilters(),
            },
        });
    }, [fromDate, toDate]);

    useEffect(() => {
        if (!taskperUser) return;
        // Create chart instance
        var chart = am4core.create("bar-chart", am4charts.XYChart);

        // Set chart data
        chart.data = taskperUser;

        // Create Y-axis (Category Axis)
        var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "email";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 20;
        categoryAxis.renderer.labels.template.fontSize = 16;
        categoryAxis.renderer.labels.template.fontWeight = "bold";

        // Use adapter to modify the displayed label
        categoryAxis.renderer.labels.template.adapter.add("textOutput", function(text) {
            let name = text;
            if (text) {
                name = taskperUser.find((data) => data?.email === text).name
            }
            return name;
        });

        // Create X-axis (Value Axis)
        var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text = "Values";
        // Function to create a series for each data field
        function createSeries(field, name, color) {
            var series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueX = field; // Set the value field to the corresponding data field
            series.dataFields.categoryY = "email"; // Set the category field to 'name'
            series.name = name;
            series.stacked = true; // Enable stacking of series
            series.columns.template.tooltipText = "{name}: [bold]{valueX}[/]";
            series.columns.template.fill = am4core.color(color); // Assign color for each series
            series.columns.template.fillOpacity = 0.8;

            // Enable data labels  8
            var labelBullet = series.bullets.push(new am4charts.LabelBullet());
            labelBullet.label.text = "{valueX}"; // Display the value on each bar
            labelBullet.label.fill = am4core.color("#fff");
            labelBullet.locationX = 0.5; // Center the label
            labelBullet.label.fontSize = 8;
            labelBullet.label.fontWeight = "bold";
        }

        // Create series with different colors
        createSeries("open", "Open", "#c55a11"); // Orange color for "Open"
        createSeries("completed", "Completed", "#4472c4"); // Blue color for "Completed"

        // Add legend
        chart.legend = new am4charts.Legend();

        // Cleanup function to dispose of chart instance when component unmounts
        return () => {
            chart.dispose();
        };
    }, [taskperUser]);


    useEffect(() => {
        if (analyticsData?.activitiesCountByTaskStatusPerOwner) {
            const chartData = analyticsData?.activitiesCountByTaskStatusPerOwner;
            // Create an array of objects with required fields
            const resultArray = Object.keys(analyticsData?.activitiesCountByTaskStatusPerOwner).map(email => {
                const entry = chartData[email];
                return {
                    name: entry.name,
                    completed: entry.Completed || 0, // Use 0 if Completed is not defined
                    open: entry.Open || 0, // Use 0 if Open is not defined
                    email: email
                };
            });
            setTaskperUser(resultArray);
        }
    }, [analyticsData]);

    return (
        <Fragment>
            <CardHeader
                style={{ margin: "8px" }}
                title={<Title
                    fromDate={fromDate}
                    setFromDate={setFromDate}
                    toDate={toDate}
                    setToDate={setToDate}
                />}
            />
            <div id={'bar-chart'} style={{ paddingTop: "40px", height: "80%", width: "80%" }} />
        </Fragment>
    )
}

function TaskFilters({
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    minDate,
}) {

    const classes = useStyles();
    const getFlaggedMoment = (moment) => {
        return moment >= 10 ? moment : `0${moment}`;
    };

    return (
        <div style={{ display: "flex" }}>
            <Grid
                container
                direction="row"
                display="flex"
                alignItems="center"
                spacing={2}
                xs={12}
                sm={12}
                style={{ justifyContent: "flex-end" }}
            >
                <Grid
                    item
                    xs={4}
                    sm={4}
                    md={3}
                    lg={3}
                    xl={3}
                    style={{ marginTop: "2px" }}
                >
                    <Autocomplete
                        size="small"
                        onChange={(event, newValue) => {

                        }}
                        options={Object.values(CUSTOM_DATES)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Date Range"
                                placeholder=""
                                style={{ backgroundColor: "white" }}
                            />
                        )}
                        defaultValue={CUSTOM_DATES.ALL_DATES}
                        disableListWrap
                        id="custom-date-dropdown"
                    />
                </Grid>
                <Grid item xs={2.4} sm={2.4} md={2.4} lg={2.4} xl={2.4}>
                    <TextField
                        size="small"
                        margin="dense"
                        type="date"
                        variant="outlined"
                        placeholder=""
                        fullWidth
                        value={moment(fromDate).format("yyyy-MM-DD")}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            classes: {
                                root: classes.dateRoot,
                                focused: classes.focused,
                                notchedOutline: classes.notchedOutline,
                            },
                        }}
                        onChange={(event) => {
                            if (event.target.value == "") {
                                setFromDate(
                                    `${Math.round(new Date().getFullYear())}-${getFlaggedMoment(
                                        Math.ceil(new Date().getMonth()) + 1
                                    )}`
                                );
                            } else {
                                setFromDate(event.target.value);
                            }
                        }}
                    />
                </Grid>
                <Grid>
                    <label>to</label>
                </Grid>
                <Grid item xs={2.4} sm={2.4} md={2.4} lg={2.4} xl={2.4}>
                    <TextField
                        size="small"
                        margin="dense"
                        type="date"
                        variant="outlined"
                        placeholder="to"
                        fullWidth
                        value={moment(toDate).format("yyyy-MM-DD")}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            classes: {
                                root: classes.dateRoot,
                                focused: classes.focused,
                                notchedOutline: classes.notchedOutline,
                            },
                        }}
                        onChange={(event) => {
                            if (event.target.value == "") {
                                setToDate(
                                    `${Math.round(new Date().getFullYear())}-${getFlaggedMoment(
                                        Math.ceil(new Date().getMonth()) + 1
                                    )}`
                                );
                            } else {
                                setToDate(event.target.value);
                            }
                        }}
                    />
                </Grid>
            </Grid>
        </div>
    );
}
