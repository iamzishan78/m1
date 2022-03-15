import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

const useStyles = makeStyles(() => ({
    root: {
        padding: "20px 0px"
    },
    graphCard: {
        border: "2px solid #959595",
        borderRadius: 8,
        maxWidth: "550px",
        height: "430px",
    },
}));

const Charts = ({ items, total, id = "pie-chart" }) => {
    const [data, setData] = useState();
    const classes = useStyles();

    useEffect(() => {
        if (items?.length === 0) return;
        const _data = items.map(item => ({
            category: item.name,
            value: Number(item.total.replace(/,/g, ""))
        }));
        setData(_data);
    }, [items]);

    useEffect(() => {
        if (data?.length === 0) return;
        var chart = am4core.create(id, am4charts.PieChart);

        // setting data
        chart.data = data;

        // Add and configure Series
        var pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "value";
        pieSeries.dataFields.category = "category";

        // Let's cut a hole in our Pie chart the size of 40% the radius
        chart.innerRadius = am4core.percent(50);

        // Disable ticks and labels
        pieSeries.labels.template.disabled = true;
        pieSeries.ticks.template.disabled = true;

        // Disable tooltips
        pieSeries.slices.template.tooltipText = "";

        // Put a thick white border around each Slice
        // pieSeries.slices.template.stroke = am4core.color("#4a2abb");
        pieSeries.slices.template.strokeWidth = 2;
        pieSeries.slices.template.strokeOpacity = 1;

        // Add a legend
        chart.legend = new am4charts.Legend();
        chart.legend.useDefaultMarker = true;
        var markerTemplate = chart.legend.markers.template;
        markerTemplate.width = 15;
        markerTemplate.height = 15;
        markerTemplate.stroke = am4core.color("#ccc");
        chart.legend.position = "right";
        chart.legend.maxWidth = 200;
        chart.legend.scrollable = true;


        let label = pieSeries.createChild(am4core.Label);
        label.text = `${total}`;
        label.horizontalCenter = "middle";
        label.verticalCenter = "middle";
        label.fontSize = 25;
        label.fontWeight = "bold";

        chart.legend.valueLabels.template.text = "";
    }, [data]);

    return (
        <Grid container display="flex" direction="row" alignItems="center" justify="flex-start" spacing={3} className={classes.root}>
            <Grid item xs={6}>
                <div className={classes.graphCard}>
                    <div id={id} style={{ height: "100%" }} />
                </div>
            </Grid>
            <Grid item xs={5}>
                <div className={classes.analyticTable}>
                </div>
            </Grid>
        </Grid>
    )
}

export default Charts;
