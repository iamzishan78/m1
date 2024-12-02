import React, { useEffect } from 'react';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

export default function BarChart(props) {
	useEffect(() => {
		// Create chart instance
		var chart = am4core.create('bar-chart', am4charts.XYChart);

		// Add data
		chart.data = [
			{
				name: 'OIL',
				value: 100.9,
			},
			{
				name: 'GAS',
				value: 65.9,
			},
			{
				name: 'NGL',
				value: 80.1,
			},
			{
				name: 'OTHER',
				value: 30.8,
			},
		];

		// Create axes
		var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
		categoryAxis.dataFields.category = 'name';
		categoryAxis.renderer.minGridDistance = 20;
		categoryAxis.title.text = '';

		var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.title.text = '';

		// Create series
		var series = chart.series.push(new am4charts.ColumnSeries());
		series.dataFields.valueY = 'value';
		series.dataFields.categoryX = 'name';
		series.name = 'Sales';
		series.tooltipText = '{name}: [bold]{valueY}[/]';

		// var series2 = chart.series.push(new am4charts.LineSeries());
		// series2.dataFields.valueY = "units";
		// series2.dataFields.categoryX = "country";
		// series2.name = "Units";
		// series2.tooltipText = "{name}: [bold]{valueY}[/]";
		// series2.strokeWidth = 3;

		// Add legend
		// chart.legend = new am4charts.Legend();

		// Add cursor
		chart.cursor = new am4charts.XYCursor();

		// Add simple vertical scrollbar
		// chart.scrollbarY = new am4core.Scrollbar();

		// Add horizotal scrollbar with preview
		// var scrollbarX = new am4charts.XYChartScrollbar();
		// scrollbarX.series.push(series);
		// chart.scrollbarX = scrollbarX;
	}, []);

	return <div id="bar-chart" style={{ height: '87%' }}></div>;
}
