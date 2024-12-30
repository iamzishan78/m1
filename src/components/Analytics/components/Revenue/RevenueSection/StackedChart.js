import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

const { useEffect, useState } = React;

const useStyles = makeStyles(() => ({
	root: {
		padding: '20px 0px',
	},
	graphCard: {
		border: '2px solid #959595',
		borderRadius: 8,
		height: '430px',
	},
}));

const StackedAreaChart = ({ id = 'chartDiv2', items, monthsInterval }) => {
	const classes = useStyles();
	const [data, setData] = useState([]);

	useEffect(() => {
		const _data = [];
		monthsInterval?.forEach((month, index) => {
			// Convert month from "M/yyyy" to "01/MM/yyyy" to match "dd/MM/yyyy" format
			const [m, y] = month.split('/');
			const formattedDate = `01/${m.padStart(2, '0')}/${y}`;

			// Update the month property
			_data.push({ month: formattedDate });

			items.forEach(item => {
				if (typeof item.data[month] === 'object') {
					_data[index][item.name.toUpperCase()] = item.data[month]?.total?.toFixed(2) || 0;
				} else {
					_data[index][item.name.toUpperCase()] = item.data[month]?.toFixed(2) || 0;
				}
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

		// Short the data based on the dates
		chart.events.on('beforedatavalidated', ev => {
			chart.data.sort((a, b) => {
				return new Date(a.month) - new Date(b.month);
			});
		});

		// Changed the date format to dd/MM/yyyy
		chart.dateFormatter.inputDateFormat = 'dd/MM/yyyy';

		let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
		dateAxis.dateFormats.setKey('month', 'MMM yy');
		dateAxis.periodChangeDateFormats.setKey('month', 'MMM yy');
		// dateAxis.renderer.minGridDistance = 60;
		// dateAxis.startLocation = 0.5;
		// dateAxis.endLocation = 0.5;
		dateAxis.baseInterval = {
			timeUnit: 'month',
			count: 1,
		};
		dateAxis.skipEmptyPeriods = true;

		let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.tooltip.disabled = true;

		items.forEach(item => {
			let series = chart.series.push(new am4charts.LineSeries());
			series.dataFields.dateX = 'month';
			series.dataFields.valueY = item.name.toUpperCase();
			series.name = item.name.toUpperCase();
			series.sequencedInterpolation = true;
			series.calculatePercent = true;
			series.calculateAggregates = true;
			series.tooltipText = '[#000 font-size:17px]{name} {valueY.value}[/]';
			series.tooltip.background.fill = am4core.color('#FFF');
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
			<div id={id} style={{ height: '100%' }} />
		</div>
	);
};

export default StackedAreaChart;
