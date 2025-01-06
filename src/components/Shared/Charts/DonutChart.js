import React from 'react';
import ReactApexChart from 'react-apexcharts';

const DonutChart = ({ data, height, marginTop, islegendEnabled = true }) => {
	const series = data.map(r => r.value);
	const options = {
		labels: data.map(r => r.title),
		colors: data.map(r => r.color),
		fill: {
			opacity: 1,
		},
		plotOptions: {
			pie: {
				donut: {
					size: '60%',
				},
			},
		},
		dataLabels: {
			enabled: false,
		},
		legend: {
			position: 'bottom',
			show: islegendEnabled,
		},
	};

	return (
		<ReactApexChart
			options={options}
			series={series}
			type="donut"
			height={height}
			style={{
				marginTop: marginTop ? marginTop : 0,
			}}
			className="apex-charts"
		/>
	);
};

export default DonutChart;
