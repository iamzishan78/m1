import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';

import vf_number from 'components/Shared/valueformatters/vf_number';

const useStyles = makeStyles(() => ({
	root: {
		padding: '20px 0px',
	},
	graphCard: {
		border: '2px solid #959595',
		borderRadius: 8,
		// maxWidth: "550px",
		height: '430px',
	},
}));

const DonutChart = ({ items, total, id = 'pie-chart' }) => {
	const [data, setData] = useState();
	const classes = useStyles();

	useEffect(() => {
		if (items?.length === 0) {
			return;
		}
		const _data = items.map(item => ({
			category: item.name.toUpperCase(),
			value: item.total,
			// total: item.totalK,
		}));
		setData(_data);
	}, [items]);

	useEffect(() => {
		if (data?.length === 0) {
			return;
		}
		var chart = am4core.create(id, am4charts.PieChart);

		// setting data
		chart.data = data;

		// Add and configure Series
		var pieSeries = chart.series.push(new am4charts.PieSeries());
		pieSeries.dataFields.value = 'value';
		pieSeries.dataFields.category = 'category';

		// Let's cut a hole in our Pie chart the size of 40% the radius
		chart.innerRadius = am4core.percent(50);

		// Disable ticks and labels
		pieSeries.labels.template.disabled = true;
		pieSeries.ticks.template.disabled = true;

		// Disable tooltips
		// pieSeries.slices.template.tooltipText = "";

		// Put a thick white border around each Slice
		// pieSeries.slices.template.stroke = am4core.color("#ffff");
		pieSeries.slices.template.strokeWidth = 2;
		pieSeries.slices.template.strokeOpacity = 1;
		pieSeries.slices.template.tooltipText =
			"[font-size:16px]{category} {value} | {value.percent.formatNumber('#.##')}%[/]";
		pieSeries.tooltip.getFillFromObject = false;
		pieSeries.tooltip.label.fill = am4core.color('#000');
		pieSeries.tooltip.background.fill = am4core.color('#ffff');
		pieSeries.tooltip.getStrokeFromObject = true;
		pieSeries.legendSettings.labelText =
			"[bold font-size:17px]{name}:[/] {value.value} | {value.percent.formatNumber('#.##')}%";
		// pieSeries.slices.template.tooltipText = "[#ffff]{value}[/]";

		// Add a legend
		chart.legend = new am4charts.Legend();
		chart.legend.useDefaultMarker = true;
		chart.legend.valueLabels.template.disabled = true;
		// chart.legend.labels.template.disabled = true

		// chart.legend.labels.template.text = `[bold font-size:17px]{name}:[/] {value.value} |`;
		// chart.legend.valueLabels.template.text = `{value} | ${chart.legend.valueLabels.template.text}`;
		chart.legend.position = 'right';
		chart.legend.maxWidth = 400;
		chart.legend.scrollable = true;

		var markerTemplate = chart.legend.markers.template;
		markerTemplate.width = 15;
		markerTemplate.height = 15;
		markerTemplate.stroke = am4core.color('#ccc');
		markerTemplate.fontWeight = 500;

		let label = pieSeries.createChild(am4core.Label);
		label.text = `${total > 9999 ? vf_number(Math.floor(total / 1000)) + ' K' : vf_number(Math.floor(total))}`;
		label.horizontalCenter = 'middle';
		label.verticalCenter = 'middle';
		label.fontSize = 25;
		label.fontWeight = 'bold';
	}, [data]);

	return (
		<div className={classes.graphCard}>
			<div id={id} style={{ height: '100%' }} />
		</div>
	);
};

export default DonutChart;
