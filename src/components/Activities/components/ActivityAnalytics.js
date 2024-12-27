import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Grid, Card, CardContent } from '@material-ui/core';

import { useLazyQuery } from '@apollo/client';
import get from 'lodash/get';
import PropTypes from 'prop-types';

import DonutChart from 'components/Shared/Charts/DonutChart';
import StackedBarChart from 'components/Shared/Charts/StackedBarChart';

import { GET_ACTIVITY_ANALYTICS } from 'graphQL/useQueryActivityAnalytics';
import { GET_CONTACT_ANALYTICS } from 'graphQL/useQueryContactDetail';

import { copy, getFilters } from 'utils/helper';

import { getActivityFilters } from './ActivitiesDashboard';

const MD = 6;
const CRM_MD = 4;

const defaultSeriesActivities = [
	{
		key: 'call',
		name: 'Calls',
		color: '#A3B2DD',
		data: [],
	},
	{
		key: 'email',
		name: 'Emails',
		color: '#FFD78E',
		data: [],
	},
	{
		key: 'text_message',
		name: 'Texts',
		color: '#CDCDCD',
		data: [],
	},
	{
		key: 'mailer',
		name: 'Mailers',
		color: '#F5B296',
		data: [],
	},
	{
		key: 'others',
		name: 'Others',
		color: '#D2B48C',
		data: [],
	},
];

const defaultSeriesDeals = [
	{
		key: 'open',
		name: 'Open',
		color: '#A3B2DD',
		data: [],
	},
	{
		key: 'won',
		name: 'Closed',
		color: '#FFD78E',
		data: [],
	},
];
const defaultUpdateUsers = [
	{
		key: 'total',
		name: 'total',
		color: '#A3B2DD',
		data: [],
	},
];
const ActivityAnalytics = ({
	appliedFilters,
	tableFilters,
	module,
	setTableFilters,
	tableData,
	searchFields,
	globalFilter,
}) => {
	const [analyticsData, setAnalyticsData] = useState([]);
	const [contactData, setContactData] = useState([]);
	const [activitiesPerQualifier, setActivitiesPerQualifier] = useState({
		series: copy(defaultSeriesActivities),
		xaxis: [],
	});
	const [updatesPerUser, setUpdatesPerUser] = useState({
		series: copy(defaultUpdateUsers),
		xaxis: [],
	});
	const [dealsPerQualifier, setDealsPerQualifier] = useState({
		series: copy(defaultSeriesDeals),
		xaxis: [],
	});

	const [getActivityAnalytics, { loading }] = useLazyQuery(GET_ACTIVITY_ANALYTICS, {
		fetchPolicy: 'no-cache',

		onCompleted: data => {
			if (data?.getActivityAnalytics) {
				setAnalyticsData(data?.getActivityAnalytics);
			}
		},
	});
	const [getAuditReportingAnalytics, { auditloading }] = useLazyQuery(GET_CONTACT_ANALYTICS, {
		fetchPolicy: 'no-cache',

		onCompleted: data => {
			if (data?.getAuditReportingAnalytics) {
				setContactData(data?.getAuditReportingAnalytics);
			}
		},
	});
	const { activeModule } = useSelector(({ common }) => common);

	const countOthersData = (series, data, indexKey) => {
		// Create an array of keys present in the series
		const seriesKeys = series.map(s => s.key);
		// Initialize total count
		let othersTotal = 0;
		// Loop through the keys of data
		for (let key in data) {
			// Skip 'name' or keys that exist in seriesKeys array
			if (key !== 'name' && !seriesKeys.includes(key) && indexKey === 'others') {
				othersTotal += data[key]; // Add value to total if the key is not in seriesKeys
			}
		}
		return othersTotal;
	};

	const countOthersForDonut = (analyticsData, series) => {
		// Initialize total count
		let total = 0;
		const seriesKeys = series.map(s => s.key);
		// Loop through the keys of activitiesCount
		for (let key in analyticsData) {
			// Check if the key is not in seriesKeys
			if (key !== 'name' && !seriesKeys.includes(key)) {
				total += analyticsData[key]; // Add the value to total
			}
		}
		return total;
	};

	const getAllFilters = () => {
		let rangeFilters = [];
		if (!tableFilters.find(filter => filter.type === 'range')) {
			if (activeModule.title === 'Audit Reporting') {
				appliedFilters.filter = 'audit';
			}
			rangeFilters = getFilters(appliedFilters);

			if (module === 'Activities') {
				rangeFilters = getActivityFilters(appliedFilters);
			}
		}
		return [...rangeFilters, ...tableFilters];
	};
	useEffect(() => {
		setActivitiesPerQualifier({
			series: copy(defaultSeriesActivities),
			xaxis: [],
		});
		setDealsPerQualifier({
			series: copy(defaultSeriesDeals),
			xaxis: [],
		});
		setUpdatesPerUser({
			series: copy(defaultUpdateUsers),
			xaxis: [],
		});
		if (activeModule.title === 'Audit Reporting') {
			getAuditReportingAnalytics({
				variables: {
					search: {
						fields: searchFields,
						query: globalFilter,
					},
					filters: getAllFilters(),
				},
			});
		} else {
			getActivityAnalytics({
				variables: {
					search: {
						fields: searchFields,
						query: globalFilter,
					},
					filters: getAllFilters(),
				},
			});
		}
	}, [appliedFilters, tableFilters, tableData, searchFields, globalFilter]);

	useEffect(() => {
		setTableFilters && setTableFilters(getActivityFilters(appliedFilters));
	}, [appliedFilters]);

	useEffect(() => {
		if (analyticsData?.activitiesCountByTypePerOwner) {
			const chartData = { series: copy(defaultSeriesActivities), xaxis: [] };
			Object.entries(analyticsData?.activitiesCountByTypePerOwner).forEach(data => {
				if (data[1]?.name) {
					chartData.xaxis.push(data[1].name.substring(0, 10));
				}
				for (let i = 0; i < chartData.series.length; i++) {
					if (data[1]) {
						const count = data[1][chartData.series[i].key]
							? data[1][chartData.series[i].key]
							: countOthersData(chartData.series, data[1], chartData.series[i].key);
						chartData.series[i].data.push(count);
					} else {
						chartData.series[i].data.push(0);
					}
				}
			});
			setActivitiesPerQualifier(JSON.parse(JSON.stringify(chartData)));
		}
		if (analyticsData?.dealAmountByStatusPerOwner) {
			const chartData = { series: copy(defaultSeriesDeals), xaxis: [] };
			Object.entries(analyticsData?.dealAmountByStatusPerOwner).forEach(data => {
				if (data[1]?.name) {
					chartData.xaxis.push(data[1].name.substring(0, 10));
				}
				for (let i = 0; i < chartData.series.length; i++) {
					if (data[1]) {
						const count = data[1][chartData.series[i].key] ? data[1][chartData.series[i].key] : 0;
						chartData.series[i].data.push(count);
					} else {
						chartData.series[i].data.push(0);
					}
				}
			});
			setDealsPerQualifier(JSON.parse(JSON.stringify(chartData)));
		}
		if (contactData?.updatesCountByTypePerOwner) {
			const chartData = { series: copy(defaultUpdateUsers), xaxis: [] };
			Object.entries(contactData?.updatesCountByTypePerOwner).forEach(data => {
				if (data[1]?.name) {
					chartData.xaxis.push(data[1].name.substring(0, 10));
				}
				for (let i = 0; i < chartData.series.length; i++) {
					if (data[1]) {
						const count = data[1][chartData.series[i].key] ? data[1][chartData.series[i].key] : 0;
						chartData.series[i].data.push(count);
					} else {
						chartData.series[i].data.push(0);
					}
				}
			});
			setUpdatesPerUser(JSON.parse(JSON.stringify(chartData)));
		}
	}, [analyticsData, contactData]);

	const formatter = function (val) {
		const TO_FIXED = 2;
		const DIVISOR = 1000000;

		return (val / DIVISOR).toFixed(TO_FIXED) + 'MM';
	};
	return (
		<Grid
			container
			direction="row"
			display="flex"
			align="center"
			spacing={4}
			textAlign="left"
			style={{ padding: '30px' }}
		>
			{
				<Grid item md={activeModule.value === 'CRM' ? CRM_MD : MD} style={{ padding: '10px' }}>
					<Card variant="outlined">
						<CardContent style={{ height: '265px' }}>
							<label>{activeModule.value === 'CRM' ? 'Total Activities' : 'Total Updates'}</label>
							<div
								style={{
									position: 'relative',
									top: '85px',
									fontSize: 18,
								}}
							>
								{activeModule.value === 'CRM' ? get(analyticsData, 'total', 0) : get(contactData, 'total', 0)}
							</div>
							{activeModule.value === 'CRM' && (
								<DonutChart
									height={240}
									marginTop={-15}
									data={[
										{
											title: 'Calls',
											value: get(analyticsData, 'activitiesCount.call', 0),
											color: '#A3B2DD',
										},
										{
											title: 'Emails',
											value: get(analyticsData, 'activitiesCount.email', 0),
											color: '#FFD78E',
										},
										{
											title: 'Texts',
											value: get(analyticsData, 'activitiesCount.text_message', 0),
											color: '#CDCDCD',
										},
										{
											title: 'Mailers',
											value: get(analyticsData, 'activitiesCount.mailer', 0),
											color: '#F5B296',
										},
										{
											title: 'Others',
											value: countOthersForDonut(analyticsData.activitiesCount, defaultSeriesActivities),
											color: '#D2B48C',
										},
									]}
								/>
							)}
							{activeModule.title === 'Audit Reporting' && (
								<DonutChart
									height={220}
									marginTop={-20}
									islegendEnabled={false}
									data={[
										{
											title: '',
											value: get(contactData, 'total', 0),
											color: '#A3B2DD',
										},
									]}
								/>
							)}
						</CardContent>
					</Card>
				</Grid>
			}

			{
				<Grid item md={activeModule.value === 'CRM' ? CRM_MD : MD} style={{ padding: '10px' }}>
					<Card variant="outlined">
						<CardContent style={{ height: '265px', overflow: 'auto' }}>
							<label>{activeModule.value === 'CRM' ? 'Activities Per Qualifier' : 'Updates Per User'}</label>
							{!loading && !auditloading && (
								<StackedBarChart data={activeModule.value === 'CRM' ? activitiesPerQualifier : updatesPerUser} />
							)}
						</CardContent>
					</Card>
				</Grid>
			}
			{activeModule.value === 'CRM' && (
				<Grid item md={4} style={{ padding: '10px' }}>
					<Card variant="outlined">
						<CardContent style={{ height: '265px', overflow: 'auto' }}>
							<label>Deals Per Qualifier ($MM)</label>
							{!loading && (
								<StackedBarChart
									data={dealsPerQualifier}
									toolTipFormatter={formatter}
									xAxisFormatter={formatter}
									xAxisLabel
								/>
							)}
						</CardContent>
					</Card>
				</Grid>
			)}
		</Grid>
	);
};

ActivityAnalytics.propTypes = {
	appliedFilters: PropTypes.array.isRequired,
	tableFilters: PropTypes.array.isRequired,
	module: PropTypes.string.isRequired,
	setTableFilters: PropTypes.func,
	tableData: PropTypes.array.isRequired,
	searchFields: PropTypes.array.isRequired,
	globalFilter: PropTypes.string.isRequired,
};

export default ActivityAnalytics;
