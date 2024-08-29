import React, { Fragment, useState, useCallback, useContext, useEffect, } from 'react'
import CardHeader from "@material-ui/core/CardHeader";
import StackedBarChart from "components/Shared/Charts/StackedBarChart";
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

const defaultSeriesTask = [
    {
        key: "Completed",
        name: "Completed",
        color: "#A3B2DD",
        data: [],
    },
    {
        key: "Open",
        name: "Open",
        color: "#F5B296",
        data: [],
    },
];

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

const Title = () => {
    const classes = useStyles();

    return (
        <Grid container>
            <Grid item xs={5} sm={5} md={4} container alignItems="center" >
                <div>Tasks by Assignee and Status</div>
            </Grid>
            <Grid item xs={7} sm={7} md={8}>
                <div>
                    <TaskFilters />
                </div>
            </Grid>
        </Grid>
    );
};

export default function TrackTaskCard() {
    const [analyticsData, setAnalyticsData] = useState([]);
    const [taskperUser, setTaskperUser] = useState({
        series: copy(defaultSeriesTask),
        xaxis: [],
    });

    const [getActivityAnalytics, { loading }] = useLazyQuery(GET_ACTIVITY_TASK_PER_USER, {
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            if (data?.getActivityTaskPerUser) {
                setAnalyticsData(data?.getActivityTaskPerUser);
            }
        },
    });

    useEffect(() => {
        setTaskperUser({
            series: copy(defaultSeriesTask),
            xaxis: [],
        });
        getActivityAnalytics({
            variables: {
                search: {
                    fields: ["name", "_all"],
                    query: "",
                },
                filters: [],
            },
        });
    }, []);

    useEffect(() => {
        if (!taskperUser) return;

        // Create chart instance
        var chart = am4core.create("bar-chart", am4charts.XYChart);

        // Define chart data
        var chartData = [
            {
                year: "2021",
                open: 2.5,
                completed: 2.5,
             
            },
            {
                year: "2022",
                open: 2.6,
                completed: 2.7,
            }
        ];

        // Set chart data
        chart.data = chartData;

        // Create Y-axis (Category Axis)
        var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.labels.template.fontSize = 16;
        categoryAxis.renderer.labels.template.fontWeight = "bold";
        categoryAxis.title.text = "Years";

        // Create X-axis (Value Axis)
        var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text = "Values";

        // Function to create a series for each region
        function createSeries(field, name) {
            var series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueX = field; // Set the value field to the corresponding region
            series.dataFields.categoryY = "year"; // Set the category field to 'year'
            series.name = name;
            series.stacked = true; // Enable stacking of series
            series.columns.template.tooltipText = "{name}: [bold]{valueX}[/]";
            series.columns.template.fillOpacity = 0.8;

            // Enable data labels
            var labelBullet = series.bullets.push(new am4charts.LabelBullet());
            labelBullet.label.text = "{valueX}"; // Display the value on each bar
            labelBullet.label.fill = am4core.color("#fff");
            labelBullet.locationX = 0.5; // Center the label
            labelBullet.label.fontSize = 14;
            labelBullet.label.fontWeight = "bold";

             // Add image bullet to series
             var imageBullet = series.bullets.push(new am4charts.Bullet());
             var circle = imageBullet.createChild(am4core.Circle);
             circle.radius = 18; // Circle radius
             circle.fill = am4core.color("#fff");
        }

        // Create series for each region
        createSeries("open", "Open");
        createSeries("completed", "Completed");

        // Add image bullets to series
        chart.series.each(series => {
            var imageBullet = series.bullets.push(new am4charts.Bullet());
            var image = imageBullet.createChild(am4core.Image);
            image.href = "https://picsum.photos/200/300"; // Set the path to your image
            image.width = 30; // Adjust size as needed
            image.height = 30;
            image.horizontalCenter = "middle";
            image.verticalCenter = "middle";
            image.locationX = 0.5;
            image.locationY = 0;
            image.tooltipText = "Image Bullet"; // Optional tooltip text
        });

        // Add legend
        chart.legend = new am4charts.Legend();

        // Cleanup function to dispose of chart instance when component unmounts
        return () => {
            chart.dispose();
        };
    }, [taskperUser]);


    useEffect(() => {
        if (analyticsData?.activitiesCountByTaskStatusPerOwner) {
            const chartData = { series: copy(defaultSeriesTask), xaxis: [] };
            Object.entries(analyticsData?.activitiesCountByTaskStatusPerOwner).forEach((data, value) => {
                if (data[1]?.name) {
                    chartData.xaxis.push(data[1].name.substring(0, 10));
                }
                for (let i = 0; i < chartData.series.length; i++) {
                    if (data[1]) {
                        const count = data[1][chartData.series[i].key] ? data[1][chartData.series[i].key] : 0;
                        chartData.series[i].data.push(count);
                    } else {
                        chartData.series[i].data.push(0);
                    }

                }
            });
            setTaskperUser(JSON.parse(JSON.stringify(chartData)));
        }
    }, [analyticsData]);

    return (
        <Fragment>
            <CardHeader
                style={{ margin: "8px" }}
                title={<Title />}
            />
            <div id={'bar-chart'} style={{ paddingTop: "40px", height: "80%", width: "70%" }} />
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
                    />
                </Grid>
            </Grid>
        </div>
    );
}
