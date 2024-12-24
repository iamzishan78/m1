import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import {
	Button,
	ButtonGroup,
	Grid,
	Table,
	TableHead,
	TableRow,
	Typography,
	TableCell,
	TableBody,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';

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

const DonutChart = ({ productDetails, getUnit }) => {
	const [data, setData] = useState();

	const [mode, setMode] = useState('revenue');
	const selectedCss = { backgroundColor: '#05aff0', color: '#ffff' };
	const classes = useStyles();

	useEffect(() => {
		const donut = {
			production: {
				items: [],
				table: [],
			},
			revenue: [],
		};
		Object.keys(productDetails).forEach(key => {
			let volume = productDetails[key].find(pd => pd.name === 'GROSS VOLUME');
			let net = productDetails[key].find(pd => pd.name === 'OWNER VOLUME');
			let owner_net_revenue = productDetails[key].find(pd => pd.name === 'OWNER NET REVENUE');
			let formatedVolume = volume.total;
			if (key === 'GAS' && formatedVolume) {
				formatedVolume = formatedVolume / 6;
			}
			if (key.includes('NGL') && formatedVolume) {
				formatedVolume = formatedVolume * 0.02381;
			}
			donut.production.items.push({
				category: key.includes('NGL') ? 'NGL' : key,
				value: vf_number(formatedVolume.toFixed(2)),
				[key.includes('NGL') ? 'NGL' : key]: vf_number(formatedVolume.toFixed(2)),
			});
			donut.production.table.push({
				gross: vf_number(volume.total.toFixed(2)),
				net: vf_number(net.total.toFixed(2)),
				unit: getUnit(key),
			});
			donut.revenue.push({
				category: key.includes('NGL') ? 'NGL' : key,
				value: vf_number(owner_net_revenue.total.toFixed(2)),
			});
		});

		donut.production.items = donut.production.items.reverse();

		setData(donut);
	}, [productDetails]);

	useEffect(() => {
		if (!data?.revenue?.length) {
			return;
		}
		var chart = am4core.create('product-donut', am4charts.PieChart);

		// setting data
		chart.data = data.revenue;

		chart.startAngle = 180;
		chart.endAngle = 360;

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
	}, [data, mode]);

	useEffect(() => {
		if (!data?.production?.items) {
			return;
		}
		var chart = am4core.create('bar-chart', am4charts.XYChart);

		// Add data
		chart.data = data.production.items;

		var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
		categoryAxis.dataFields.category = 'category';
		categoryAxis.renderer.labels.template.fontSize = 16;
		categoryAxis.renderer.labels.template.fontWeight = 'bold';
		categoryAxis.renderer.grid.template.location = 0;

		var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
		valueAxis.renderer.labels.template.disabled = true;
		data.production.items.forEach(item => {
			var series = chart.series.push(new am4charts.ColumnSeries());
			series.tooltip.getFillFromObject = false;
			series.dataFields.valueX = item.category;
			series.stacked = true;
			series.sequencedInterpolation = true;
			series.calculateAggregates = true;
			series.dataFields.categoryY = 'category';
		});
	}, [data, mode]);

	return (
		<div className={classes.graphCard}>
			<Grid
				container
				direction="row"
				alignItems="center"
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					padding: '15px 15px 0 15px',
				}}
			>
				<Grid item>
					<Typography variant="h5" component="h5" style={{ fontWeight: 'bolder' }}>
						Product Summary
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

			{/*  */}
			<span style={{ height: '100%', display: mode === 'production' ? 'flex' : 'block' }}>
				{mode === 'production' ? (
					<div id={'bar-chart'} style={{ paddingTop: '40px', height: '85%', width: '55%' }} />
				) : (
					<div id={'product-donut'} style={{ height: '85%' }} />
				)}

				{mode === 'production' && (
					<div style={{ width: '45%', paddingLeft: '50px' }}>
						<Table className={classes.table} aria-label="caption table">
							<TableHead>
								<TableRow>
									<TableCell component="th" style={{ fontWeight: 'bolder', borderBottom: 'none' }}>
										Gross
									</TableCell>
									<TableCell component="th" style={{ fontWeight: 'bolder', borderBottom: 'none' }}>
										Net
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{data.production.table.map(item => (
									<TableRow style={{ height: '71px' }}>
										<TableCell scope="row" style={{ borderBottom: 'none' }}>
											{item.gross} {item.unit}
										</TableCell>
										<TableCell scope="row" style={{ borderBottom: 'none' }}>
											{item.net} {item.unit}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</span>
		</div>
	);
};

export default DonutChart;
