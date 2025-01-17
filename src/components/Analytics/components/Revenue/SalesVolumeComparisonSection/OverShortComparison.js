import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

import Button from '@material-ui/core/Button';

import moment from 'moment';

const data = {
	series: [
		{
			name: '',
			data: [],
		},
		{
			name: '',
			data: [],
		},
	],
	options: {
		chart: {
			type: 'bar',
			height: 440,
			stacked: true,
		},
		colors: ['#177B1E', '#F4273D'],
		plotOptions: {
			bar: {
				horizontal: false,
				barHeight: '80%',
			},
		},
		dataLabels: {
			enabled: false,
		},
		legend: {
			show: false,
		},
		stroke: {
			width: 1,
			colors: ['#fff'],
		},

		grid: {
			xaxis: {
				lines: {
					show: true,
				},
			},
		},
		yaxis: {
			min: 0,
			max: 0,
			labels: {
				formatter: function (val) {
					return val;
				},
			},
		},
		tooltip: {
			shared: false,
			x: {
				formatter: function (val) {
					return val;
				},
			},
			y: {
				formatter: function (val) {
					return val;
				},
			},
		},
		xaxis: {
			categories: [],
			labels: {
				formatter: function (val) {
					return val;
				},
			},
		},
	},
};

const ApexChart = ({ esFilters, checkData }) => {
	const [myChartData, setMyChartData] = useState(data);
	const [activeTab, setActiveTab] = useState('oil');
	useEffect(() => {
		if (checkData.length > 0) {
			let dateFilter = esFilters.find(filter => filter.type === 'range');
			let stateFilter = esFilters.find(filter => filter.field === 'property.state.keyword');
			let filteredCheckData = checkData.filter(check => check.product === activeTab.toUpperCase());

			if (dateFilter) {
				const gte = new Date(dateFilter.value.gte);
				const lte = new Date(dateFilter.value.lte);

				filteredCheckData = filteredCheckData.filter(check => {
					const date = new Date(check.date);
					return date >= gte && date <= lte;
				});
			}

			if (stateFilter) {
				filteredCheckData = filteredCheckData.filter(check => check.state === stateFilter.value);
			}

			const dateData = filteredCheckData.map(check => {
				let pVolume = 0;
				if (check?.wells && Array.isArray(check.wells)) {
					check.wells.forEach(well => {
						const prod = well.production.find(
							p => moment(p.data.ReportDate).format('MM/yyyy') === moment(check.date).format('MM/yyyy')
						);
						if (prod) {
							pVolume += prod.data[`allocated${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`];
						}
					});
					check.wells.forEach(well => {
						const prod = well.production.find(
							p => moment(p.data.ReportDate).format('MM/yyyy') === moment(check.date).format('MM/yyyy')
						);
						if (prod) {
							pVolume += prod.data[`allocated${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`];
						}
					});
				} else {
					console.error('check.wells is undefined or not an array:', check);
				}

				const overShort = check.statementVolume - pVolume;
				return { label: check.date, data: overShort };
			});

			const sumByLabel = {};
			const labels = [];

			dateData.forEach(obj => {
				const { label, data } = obj;
				const monthYear = label?.slice(0, 7);

				if (!labels?.includes(monthYear) && monthYear) {
					sumByLabel[monthYear] = (sumByLabel[monthYear] || 0) + data;
					labels.push(monthYear);
				} else {
					sumByLabel[monthYear] += data;
				}
			});

			let max = 0;
			let min = 0;
			const chartData = [
				{ name: activeTab.toUpperCase(), data: [] },
				{ name: activeTab.toUpperCase(), data: [] },
			];

			labels.forEach((monthYear, index) => {
				let monthlySum = parseFloat(parseFloat(sumByLabel[monthYear]).toFixed(2));
				if (monthlySum > 0) {
					if (max < monthlySum) {
						max = monthlySum;
					}
					chartData[0].data[index] = monthlySum;
					chartData[1].data[index] = 0;
				} else {
					if (min > monthlySum) {
						min = monthlySum;
					}
					chartData[0].data[index] = 0;
					chartData[1].data[index] = monthlySum;
				}
			});

			const myChart = JSON.parse(JSON.stringify(data));
			myChart.series = chartData;
			myChart.options.xaxis.categories = labels;
			myChart.options.yaxis.min = min;
			myChart.options.yaxis.max = max;
			setMyChartData(myChart);
		}
	}, [checkData, activeTab, esFilters]);

	return (
		<div id="chart" style={{ paddingTop: '10px' }}>
			<div style={{ display: 'flex', justifyContent: 'end' }}>
				<Button
					variant="contained"
					onClick={() => setActiveTab('oil')}
					style={activeTab === 'oil' ? { background: '#18A9DD', color: 'white' } : {}}
				>
					OIL
				</Button>
				<Button
					variant="contained"
					onClick={() => setActiveTab('gas')}
					style={activeTab === 'gas' ? { background: '#18A9DD', color: 'white' } : {}}
				>
					GAS
				</Button>
			</div>
			<ReactApexChart options={myChartData.options} series={myChartData.series} type="bar" height={440} />
		</div>
	);
};

export default ApexChart;
