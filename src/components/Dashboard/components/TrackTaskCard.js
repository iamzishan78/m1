import React, { Fragment, useState, useEffect, } from 'react'
import CardHeader from "@material-ui/core/CardHeader";
import { Grid, Typography, TextField, CircularProgress } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { CUSTOM_DATES } from 'utils/data'
import { makeStyles } from "@material-ui/styles";
import moment from "moment";
import { copy } from "utils/helper";
import { useLazyQuery } from "@apollo/client";
import { GET_ACTIVITY_TASK_PER_USER } from "graphQL/useQueryActivityTaskPerUser";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { getRangeFilters } from "utils/helper";
import CustomAvatar from "components/Shared/ui/CustomAvatar";
import ReactDOMServer from 'react-dom/server';
import { GET_ES_MIN_VALUE } from "graphQL/useQueryESMinValue";
import { handleCustomDateTypeChange } from 'utils/helper';

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
    minDate
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
                        minDate={minDate}
                    />
                </div>
            </Grid>
        </Grid>
    );
};

export default function TrackTaskCard() {
    const classes = useStyles();
    const [analyticsData, setAnalyticsData] = useState([]);
    const [taskperUser, setTaskperUser] = useState([]);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(moment(new Date()).format("yyyy-MM-DD"));
    const [minDate, setMinDate] = useState();

    const [getActivityAnalytics, { loading }] = useLazyQuery(GET_ACTIVITY_TASK_PER_USER, {
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            if (data?.getActivityTaskPerUser) {
                setAnalyticsData(data?.getActivityTaskPerUser);
            }
        },
    });

    const [getESMinValue] = useLazyQuery(GET_ES_MIN_VALUE, {
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            if (data?.getESMinValue) {
                setFromDate(`${moment(data?.getESMinValue).startOf("month").format("yyyy-MM-DD")}`);
                setMinDate(data?.getESMinValue)
            }
        },
    });

    useEffect(() => {
        getESMinValue({
            variables: {
                esIndex: "activities_flat",
                field: "dateTime",
                value_as_string: true,
            },
        });
    }, [getESMinValue]);

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


        // Use adapter to modify the displayed label and include images
        categoryAxis.renderer.labels.template.adapter.add("html", function (text, label) {
            let name = "";
            let profileImage = null; // Default to no profile image
            const userEmail = label?._dataItem?.properties?.category;
            if (userEmail) {
                const userData = taskperUser.find((data) => data?.email === userEmail);
                name = userData?.name;
                profileImage = userData?.profileImage; // Assume your data has a 'profileImage' field in Base64
            }
            if (profileImage) {
                return `<div style="display: flex; align-items: center;">
                    <img src="${profileImage}" width="30" height="30" style="margin-right: 8px; border-radius: 50%;" />
                    <span>${name ? name : ''}</span>
                </div>`;
            } else {
                const avatarString = ReactDOMServer.renderToString(<CustomAvatar email={userEmail} text={name} />);
                return `<div style="display: flex; align-items: center;">
                     <span style="margin-right:2px;">${avatarString}</span>
                    <span>${name ? name : ''}</span>
                </div>`;
            }

        });

        // Create X-axis (Value Axis)
        var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.labels.template.disabled = true;


        // Function to create a series for each data field
        function createSeries(field, name, color) {
            var series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueX = field; // Set the value field to the corresponding data field
            series.dataFields.categoryY = "email"; // Set the category field to 'name'
            series.name = name;
            series.stacked = true; // Enable stacking of series
            series.columns.template.tooltipText = "{name}: [bold]{valueX}[/]";
            series.columns.template.fill = am4core.color(color); // Assign color for each series
            series.columns.template.fillOpacity = 1;

            // Enable data labels  8
            var labelBullet = series.bullets.push(new am4charts.LabelBullet());
            labelBullet.label.text = "{valueX}"; // Display the value on each bar
            labelBullet.label.fill = am4core.color("#fff");
            labelBullet.locationX = 0.5; // Center the label
            labelBullet.label.fontSize = 12;
            labelBullet.label.fontWeight = "bold";
        }

        // Create series with different colors
        createSeries("completed", "Completed", "#4472c4"); // Blue color for "Completed"
        createSeries("open", "Open", "#c55a11"); // Orange color for "Open"

        // Add legend
        chart.legend = new am4charts.Legend();
        chart.legend.position = "right"; // Position the legend to the right
        chart.legend.marginLeft = 20; // Optional: add some margin

        // Adapter to update legend position
        chart.legend.adapter.add("y", function(position, target) {
            return 30;
        });// Optional: add some margin

        // Add label above the legend
        let titleLabel = chart.plotContainer.createChild(am4core.Label);
        titleLabel.text = "Task Status"; // Set your title text
        titleLabel.fontSize = 20;
        titleLabel.fontWeight = "bold";
        titleLabel.align = "center";
        titleLabel.isMeasured = false;
        titleLabel.y = am4core.percent(0);
        titleLabel.horizontalCenter = "middle";
        titleLabel.verticalCenter = "bottom";
        titleLabel.adapter.add("y", (y, target) => {
            return (30); // Adjust the title's vertical position
        });
        // Adjust position relative to the x-axis and legend
        titleLabel.adapter.add("x", (x, target) => {
            let chartWidth = target.parent.pixelWidth;
            return chartWidth + 87;
        });

        // Make chart responsive
        chart.responsive.enabled = true;

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
                    email: email,
                    profileImage: entry?.profileImage || ""
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
                    minDate={minDate}
                />}
            />
            {(loading) ? (
                <CircularProgress className={classes.progress} size={80} disableShrink color="secondary"></CircularProgress>
            ) : (
                <div id={'bar-chart'} style={{ paddingTop: "20px", paddingBottom: "40px", height: "90%", width: "90%" }} />
            )}
        </Fragment>
    )
}

function TaskFilters({
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    minDate
}) {

    const classes = useStyles();
    const getFlaggedMoment = (moment) => {
        return moment >= 10 ? moment : `0${moment}`;
    };

    const handleDateTypeChange = (date) => {
        handleCustomDateTypeChange(date, null, CUSTOM_DATES, setFromDate, setToDate, minDate)
    }

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
                            if (newValue === null) {
                                handleDateTypeChange("This Month");
                            } else {
                                handleDateTypeChange(newValue);
                            }
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
