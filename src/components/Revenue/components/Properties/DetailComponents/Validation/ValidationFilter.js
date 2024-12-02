import React, { useState, useEffect } from 'react';
import { FormControl, Grid, InputLabel, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import CustomDates from 'components/Revenue/components/Common/CustomDates';
import { GET_ES_MIN_VALUE } from 'graphQL/useQueryESMinValue';
import { useLazyQuery } from '@apollo/client';
import moment from 'moment';
import { useSelector } from 'react-redux';
import ReportGroupHeader from 'components/Shared/ReportGroupHeader';
import { MenuItem } from 'material-ui';
import { MuiThemeProvider } from 'material-ui/styles';

const useStyles = makeStyles(theme => ({
	actionBar: {
		backgroundColor: '#f7f7f7',
		width: '100%',
		minHeight: '65px',
		marginTop: '10px',
	},
	actionsGrid: {
		marginTop: '6px',
		'& .MuiButtonBase-root': {
			width: '149px',
			height: '35px',
			fontWeight: 'bold',
		},
	},
	viewSwitcher: {
		height: '40px',
		backgroundColor: 'white',
	},

	formControl: {
		width: '100%',
	},
}));

const ValidationFilter = ({ field, defaultStartDate, setESFilters, filterToggle, setFilterToggle }) => {
	const classes = useStyles();

	const [selectedFilter, setSelectedFilter] = useState('');
	const [fromDate, setFromDate] = React.useState(null);
	const [toDate, setToDate] = React.useState(null);
	const [status, setStatus] = useState('ALL');
	const [propertyFilter, setPropertyFilter] = useState([]);

	useEffect(() => {
		setFromDate(
			moment(defaultStartDate ? defaultStartDate : new Date())
				.startOf('year')
				.format('yyyy-MM-DD')
		);
		setToDate(moment().subtract(0, 'months').endOf('month').format('yyyy-MM-DD'));
	}, [defaultStartDate]);

	useEffect(() => {
		updateFilters();
	}, [toDate, fromDate, status, propertyFilter]);

	const updateFilters = () => {
		const filters = [];

		let from = fromDate;
		let to = toDate;

		if (fromDate) {
			const d = fromDate.split('-');
			if (d.length === 2) {
				from = fromDate + '-01';
			}
		}
		if (toDate) {
			const d = toDate.split('-');
		}
		filters.push({
			field,
			value: {
				range: {
					[field]: {
						gte: from ? `${from}T00:00:00.000Z` : null,
						lte: to ? `${to}T00:00:00.000Z` : null,
					},
				},
			},
			includeEmpty: selectedFilter === 'All Dates' ? true : undefined,
		});

		if (propertyFilter[0]) {
			filters.push(propertyFilter[0]);
		}

		if (status !== 'ALL') {
			filters.push({
				field: 'status.keyword',
				value: status,
			});
		}

		setESFilters(filters);
		setFilterToggle(!filterToggle);
	};

	return (
		<div className={classes.actionBar}>
			<Grid container alignItems="center" spacing={2} style={{ padding: '0px 36px 0px 45px' }}>
				<CustomDates
					fromDate={fromDate}
					setFromDate={setFromDate}
					toDate={toDate}
					setToDate={setToDate}
					lastCheckMinDate={''}
					onChange={setSelectedFilter}
					defaultRange="Custom"
					datesInputWidth={2}
				/>
			</Grid>
		</div>
	);
};

export default ValidationFilter;
