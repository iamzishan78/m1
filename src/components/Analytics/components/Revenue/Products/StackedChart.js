import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { Button, ButtonGroup, Grid, Typography } from '@material-ui/core';
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

const StackedAreaChart = ({ id = 'chartDiv3', items, monthsInterval }) => {
	const classes = useStyles();
	const [mode, setMode] = useState('revenue');
	const selectedCss = { backgroundColor: '#05aff0', color: '#ffff' };
	const [data, setData] = useState([]);

	useEffect(() => {
		const _data = [];
		monthsInterval?.forEach((month, index) => {
			// Convert month from "M/yyyy" to "01/MM/yyyy" to match "dd/MM/yyyy" format
			const [m, y] = month.split('/');
			const formattedDate = `01/${m.padStart(2, '0')}/${y}`;

			// Update the month property
			_data.push({ month: formattedDate });

			Object.keys(items).forEach(item => {
				let ownerVolumne = items[item].find(
					it => it.name === (mode === 'production' ? 'OWNER VOLUME' : 'OWNER NET REVENUE')
				);
				let value = ownerVolumne.data[month]?.total;
				if (mode === 'production') {
					if (item === 'GAS' && value) value = value / 6;
					if (item.includes('NGL') && value) {
						value = value * 0.02381;
					}
				}
				if (typeof ownerVolumne.data[month] === 'object') _data[index][item] = value || 0;
				else _data[index][item] = ownerVolumne.data[month] || 0;
			});
		});

		setData(_data);
	}, [items, mode]);

	useEffect(() => {
		// Themes begin
		am4core.useTheme(am4themes_animated);
		// Themes end

		let chart = am4core.create(id, am4charts.XYChart);
		chart.data = data;

		// Short the data based on the dates
		chart.events.on('beforedatavalidated', function (ev) {
			chart.data.sort(function (a, b) {
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

		(mode === 'production' ? Object.keys(items).reverse() : Object.keys(items)).forEach(item => {
			let series = chart.series.push(new am4charts.LineSeries());
			series.dataFields.dateX = 'month';
			series.dataFields.valueY = item;
			series.name = item;
			series.sequencedInterpolation = true;
			series.calculatePercent = true;
			series.calculateAggregates = true;
			if (mode === 'production') series.tooltipText = '[#000 font-size:17px]{name} {valueY.value} BOE[/]';
			else series.tooltipText = '[#000 font-size:17px]{name} {valueY.value}[/]';

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
	}, [data, mode]);
	return (
		<div className={classes.graphCard}>
			<Grid
				container
				direction="row"
				alignItems="center"
				style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 15px 0 15px' }}
			>
				<Grid item>
					<Typography variant="h5" component="h5" style={{ fontWeight: 'bolder' }}>
						Product By Month
					</Typography>
				</Grid>
				<Grid item>
					<ButtonGroup size="small" aria-label="small outlined button group">
						<Button onClick={() => setMode('revenue')} style={mode === 'revenue' ? selectedCss : {}}>
							REVENUE
						</Button>
						<Button onClick={() => setMode('production')} style={mode === 'production' ? selectedCss : {}}>
							PRODUCTION
						</Button>
					</ButtonGroup>
				</Grid>
			</Grid>

			<div id={id} style={{ height: '85%' }} />
		</div>
	);
};

export default StackedAreaChart;
