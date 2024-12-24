/* eslint-disable react-hooks/exhaustive-deps */
import { useLazyQuery } from '@apollo/client';
import { Grid, Card, CardContent } from '@material-ui/core';
import get from 'lodash/get';
import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';

import DonutChart from 'components/Shared/Charts/DonutChart';
import StackedBarChart from 'components/Shared/Charts/StackedBarChart';

import { GET_ACTIVITY_ANALYTICS } from 'graphQL/useQueryActivityAnalytics';
import { GET_CONTACT_ANALYTICS } from 'graphQL/useQueryContactDetail';

import { copy, getFilters } from 'utils/helper';

import { AppContext } from 'AppContext';

import { getActivityFilters } from './ActivitiesDashboard';

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
const ActivityAnalytics = ({ appliedFilters, tableFilters, module, setTableFilters, tableData }) => {
	const [stateApp] = useContext(AppContext);
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
						fields: ['name', '_all'],
						query: stateApp.landAnalyticsSearchQuery,
					},
					filters: getAllFilters(),
				},
			});
		} else {
			getActivityAnalytics({
				variables: {
					search: {
						fields: ['name', '_all'],
						query: stateApp.activitySearchQuery || stateApp.landAnalyticsSearchQuery,
					},
					filters: getAllFilters(),
				},
			});
		}
	}, [stateApp.activitySearchQuery, appliedFilters, tableFilters, stateApp.landAnalyticsSearchQuery, tableData]);

	useEffect(() => {
		setTableFilters && setTableFilters(getActivityFilters(appliedFilters));
	}, [appliedFilters]);

	useEffect(() => {
		if (analyticsData?.activitiesCountByTypePerOwner) {
			const chartData = { series: copy(defaultSeriesActivities), xaxis: [] };
			Object.entries(analyticsData?.activitiesCountByTypePerOwner).forEach((data, value) => {
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
			setActivitiesPerQualifier(JSON.parse(JSON.stringify(chartData)));
		}
		if (analyticsData?.dealAmountByStatusPerOwner) {
			const chartData = { series: copy(defaultSeriesDeals), xaxis: [] };
			Object.entries(analyticsData?.dealAmountByStatusPerOwner).forEach((data, value) => {
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
			Object.entries(contactData?.updatesCountByTypePerOwner).forEach((data, value) => {
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
		return (val / 1000000).toFixed(2) + 'MM';
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
				<Grid item md={activeModule.value === 'CRM' ? 4 : 6} style={{ padding: '10px' }}>
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
				<Grid item md={activeModule.value === 'CRM' ? 4 : 6} style={{ padding: '10px' }}>
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

export default ActivityAnalytics;
