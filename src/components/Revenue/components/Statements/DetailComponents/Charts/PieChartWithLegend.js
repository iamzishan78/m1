import React, { useEffect, useState } from 'react';

import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';

import { vf_currency_to_fixed } from 'components/Shared/valueformatters/vf_currency';
import vf_number from 'components/Shared/valueformatters/vf_number';

import { copy } from 'utils/helper';

// Revenue Chart
export default function PieChart({ chartData = [], type = '' }) {
	const [data, setData] = useState([]);
	useEffect(() => {
		let data = [];
		data = copy(chartData);
		if (type === 'revenue') {
			data = data
				.filter(item => item.name === 'Net Revenue' || item.name === 'Adjustments')
				.filter(item => item.value)
				.map(item => {
					item.value = item.value.replace('-', '').replace('(', '').replace(')', '');
					return item;
				})
				.filter(item => item.value)
				.map(item => ({ category: item.name, value: Number(item.value) }));
		} else if (type === 'adjustments') {
			data = data
				.filter(item => item.name !== 'Total Adjustments')
				.filter(a => a.value)
				.map(adjustment => ({ category: adjustment.name, value: Number(adjustment.value) }));
		}
		setData(data);
	}, [chartData, type]);

	useEffect(() => {
		if (data.length === 0) {
			return;
		}
		var chart = am4core.create('pie-chart', am4charts.PieChart);

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
		pieSeries.slices.template.tooltipText = '';

		// Put a thick white border around each Slice
		// pieSeries.slices.template.stroke = am4core.color("#4a2abb");
		pieSeries.slices.template.strokeWidth = 2;
		pieSeries.slices.template.strokeOpacity = 1;
		// pieSeries.slices.template.tooltipText = "[font-size:16px]{category} {value} | {value.percent.formatNumber('#.##')}%[/]";
		pieSeries.slices.template.tooltipText =
			"[font-size:16px]{category}: [bold]{value}[/] | {value.percent.formatNumber('#.##')}%";

		pieSeries.tooltip.getFillFromObject = false;
		pieSeries.tooltip.label.fill = am4core.color('#000');
		pieSeries.tooltip.background.fill = am4core.color('#ffff');
		pieSeries.tooltip.getStrokeFromObject = true;

		const roundToTwoDecimalPlaces = number => {
			return Math.round(number * 100) / 100;
		};

		// Set Tooltip with currency formatter
		pieSeries.slices.template.adapter.add('tooltipText', (text, target) => {
			const rawValue = target.dataItem.values.value.value || 0;
			const value = rawValue === 0 ? '0' : vf_currency_to_fixed(rawValue, 2);
			const percent = roundToTwoDecimalPlaces(target.dataItem.values.value.percent);
			return `[font-size:16px]{category}: ${value} | ${percent}%[/]`;
		});

		chart.legend = new am4charts.Legend();
		chart.legend.useDefaultMarker = true;
		var markerTemplate = chart.legend.markers.template;
		markerTemplate.width = 15;
		markerTemplate.height = 15;
		markerTemplate.stroke = am4core.color('#ccc');
		chart.legend.position = 'right';
		chart.legend.maxWidth = 400;
		chart.legend.scrollable = true;

		// Set legend label with currency formatter
		chart.legend.labels.template.adapter.add('textOutput', (text, target) => {
			if (target.dataItem && target.dataItem.dataContext) {
				const rawValue = target.dataItem.values.value.value || 0;
				const value = rawValue === 0 ? '0' : vf_currency_to_fixed(rawValue, 2);
				const percent = roundToTwoDecimalPlaces(target.dataItem.values.value.percent);
				return `${target.dataItem.dataContext.category}: ${value} | ${percent}%`;
			}
			return text;
		});

		const grossRevenue = chartData.find(d => d.name === 'Gross Revenue' || d.name === 'Total Adjustments');
		if (grossRevenue) {
			let label = pieSeries.createChild(am4core.Label);
			// label.text = `${vf_number(Number(grossRevenue.value).toFixed(0))}`;
			label.text = `${vf_currency_to_fixed(Number(grossRevenue.value).toFixed(0))}`;
			label.horizontalCenter = 'middle';
			label.verticalCenter = 'middle';
			label.fontSize = 30;
			label.fontWeight = 'bold';
		}

		chart.legend.valueLabels.template.text = '';
	}, [data]);
	return <div id="pie-chart" style={{ height: '100%' }}></div>;
}
