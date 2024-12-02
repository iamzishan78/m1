import React, { useEffect, useState } from 'react';

import ReactApexChart from 'react-apexcharts';

const StackedBarChart = ({
	data,
	toolTipFormatter,
	xAxisFormatter,
	xAxisLabel,
	hideLegends,
	eachBarHeight,
	dataLabelEnabled,
}) => {
	const [series, setSeries] = useState([]);
	const [options, setOptions] = useState({
		chart: {
			type: 'bar',
			stacked: true,
		},
		plotOptions: {
			bar: {
				horizontal: true,
			},
		},
		xaxis: {
			categories: [],
			labels: {
				show: xAxisLabel,
				formatter: xAxisFormatter
					? xAxisFormatter
					: val => {
							return val;
						},
			},
		},
		yaxis: {
			labels: {
				show: true, // Hide Y-axis labels
			},
		},
		fill: {
			opacity: 1,
		},
		legend: {
			show: !hideLegends,
			position: 'bottom',
		},
		dataLabels: {
			enabled: dataLabelEnabled,
		},
		tooltip: {
			enabled: true,
			y: {
				formatter: toolTipFormatter
					? toolTipFormatter
					: val => {
							return val;
						},
			},
		},
	});

	useEffect(() => {
		setSeries(data.series);
		const opt = JSON.parse(JSON.stringify(options));
		opt.xaxis.categories = data.xaxis;
		opt.yaxis.labels.show = !!data.xaxis?.length; // Hide yaxis label when no data found
		setOptions(opt);
	}, [data]);

	return (
		<ReactApexChart
			options={options}
			series={series}
			type="bar"
			height={100 + data.xaxis.length * (eachBarHeight ? eachBarHeight : 20)}
			className="apex-charts"
		/>
	);
};

export default StackedBarChart;
