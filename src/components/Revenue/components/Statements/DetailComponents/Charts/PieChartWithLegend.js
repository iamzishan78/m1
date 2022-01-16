import React, { useEffect, useState } from "react";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { copy } from 'utils/helper';

// Revenue Chart
export default function PieChart({ chartData = [], type = "" }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    let data = [];
    data = copy(chartData);
    if (type === "revenue") {
      data = data
        .map((item) => {
          item.value = item.value.replace("-", "").replace("(", "").replace(")", "");
          return item;
        })
        .filter((item) => item.value)
        .map((item) => ({ category: item.name, value: Number(item.value) }));
    } else if (type === "adjustments") {
      data = data.filter((a) => a.value).map((adjustment) => ({ category: adjustment.name, value: Number(adjustment.value) }));
    }
    setData(data);
  }, [chartData, type]);

  useEffect(() => {
    if (data.length === 0) return;
    var chart = am4core.create("pie-chart", am4charts.PieChart);

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
  }, [data]);
  return <div id="pie-chart" style={{ height: "100%" }}></div>;
}
