import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

const { useEffect, useState } = React;

const useStyles = makeStyles(() => ({
  root: {
    padding: "20px 0px",
  },
  graphCard: {
    border: "2px solid #959595",
    borderRadius: 8,
    height: "430px",
  },
}));

const StackedAreaChart = ({ id = "chartDiv2", items, monthsInterval }) => {
  const classes = useStyles();
  const [data, setData] = useState([]);

  useEffect(() => {
    const _data = [];
    monthsInterval?.forEach((month, index) => {
      _data.push({ month });
      items.forEach((item) => {
        _data[index][item.name] = item.data[month];
      });
    });
    setData(_data);
  }, [items]);

  useEffect(() => {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    let chart = am4core.create(id, am4charts.XYChart);

    chart.data = data;

    chart.dateFormatter.inputDateFormat = "M/yyyy";

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.dateFormats.setKey("month", "MMM yy");
    dateAxis.periodChangeDateFormats.setKey("month", "MMM yy");
    // dateAxis.renderer.minGridDistance = 60;
    // dateAxis.startLocation = 0.5;
    // dateAxis.endLocation = 0.5;
    dateAxis.baseInterval = {
      timeUnit: "month",
      count: 1,
    };
    dateAxis.skipEmptyPeriods = true;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;


    items.forEach((item) => {
      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = "month";
      series.name = item.name;
      series.dataFields.valueY = item.name;
      series.tooltipText = "[#000]{valueY.value}[/]";
      series.tooltip.background.fill = am4core.color("#FFF");
      series.tooltip.getStrokeFromObject = true;
      series.tooltip.background.strokeWidth = 3;
      series.tooltip.getFillFromObject = false;
      series.fillOpacity = 0.6;
      series.strokeWidth = 2;
      series.stacked = true;
    });

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
    chart.scrollbarX = new am4core.Scrollbar();
  }, [data]);
  return (
    <div className={classes.graphCard}>
      <div id={id} style={{ height: "100%" }} />
    </div>
  );
};

export default StackedAreaChart;
