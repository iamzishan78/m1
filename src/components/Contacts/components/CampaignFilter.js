import React, { useEffect, useContext } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useLazyQuery } from '@apollo/client';
import Autocomplete from '@material-ui/lab/Autocomplete';
import moment from 'moment';
import get from 'lodash/get';

import { GET_ES_SIMPLE_FILTER } from 'graphQL/useQueryESSimpleFilter';
import { getFilters } from 'components/Table/Contact/CampaignsTable';
import { AppContext } from 'AppContext';
import { CUSTOM_DATES } from 'utils/data';
import { copy, handleCustomDateTypeChange } from 'utils/helper';

const useStyles = makeStyles(theme => ({
	actionBar: {
		backgroundColor: '#f7f7f7',
		marginBottom: '0',
		display: 'flex',
	},
	actionsGrid: {
		marginTop: '6px',
		'& .MuiButtonBase-root': {
			width: '149px',
			height: '35px',
			fontWeight: 'bold',
		},
	},
	dateRoot: {
		border: '1px solid #EBEBEB',
		backgroundColor: '#fff',
		'&.Mui-focused fieldset': {
			border: '1px solid black',
			backgroundColor: 'transparent',
		},
		'&:hover': {
			backgroundColor: '#EBEBEB',
		},
		'&:active': {
			border: '1px solid black',
			backgroundColor: '#fff',
		},
	},
	inputFieldDate: {
		'& .MuiOutlinedInput-input': {
			// paddingLeft: "0px",
		},
	},
	label: {
		fontSize: 16,
		fontWeight: 'bold',
	},
}));

export default function CustomDatesActivities({
	setFromDate,
	setToDate,
	minDate,
	esIndex,
	searchFields,
	tableFilters,
	appliedFilters,
	appliedDateFilters,
	setAppliedFilters,
}) {
	const classes = useStyles();
	useEffect(() => {
		if (minDate) handleDateTypeChange(CUSTOM_DATES.ALL_DATES);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [minDate]);

	const getFlaggedMoment = moment => {
		return moment >= 10 ? moment : `0${moment}`;
	};

	const handleDateTypeChange = date => {
		handleCustomDateTypeChange(date, null, CUSTOM_DATES, setFromDate, setToDate, minDate, true);
	};

	return (
		<div className={classes.actionBar}>
			<Grid container direction="row" display="flex" justify="space-between" style={{ padding: '15px 32px 10px' }}>
				<label style={{ marginTop: '10px', padding: 0 }} className={classes.label}>
					Created Date
				</label>
				<Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
					<Autocomplete
						size="small"
						onChange={(event, newValue) => {
							if (newValue === null) {
								handleDateTypeChange('This Month');
							} else {
								handleDateTypeChange(newValue);
							}
						}}
						options={Object.values(CUSTOM_DATES)}
						renderInput={params => (
							<TextField
								{...params}
								variant="outlined"
								label="Date Range"
								placeholder=""
								style={{ backgroundColor: 'white' }}
							/>
						)}
						defaultValue={CUSTOM_DATES.ALL_DATES}
						disableListWrap
						id="custom-date-dropdown"
					/>
				</Grid>
				<Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
					<TextField
						style={{ marginTop: 0 }}
						size="small"
						margin="dense"
						type="date"
						variant="outlined"
						placeholder="from"
						fullWidth
						value={moment(appliedDateFilters.fromDate).format('yyyy-MM-DD')}
						className={classes.inputFieldDate}
						onChange={event => {
							if (event.target.value === '') {
								setFromDate(
									`${Math.round(new Date().getFullYear())}-${getFlaggedMoment(Math.ceil(new Date().getMonth()) + 1)}`
								);
							} else {
								setFromDate(event.target.value);
							}
						}}
						InputLabelProps={{
							shrink: true,
						}}
						InputProps={{
							classes: {
								root: classes.dateRoot,
								focused: classes.focused,
								notchedOutline: classes.notchedOutline,
							},
						}}
					/>
				</Grid>
				<Grid style={{ display: 'flex', alignItems: 'center', paddingBottom: '3px' }}>
					<label>to</label>
				</Grid>
				<Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
					<TextField
						style={{ marginTop: 0 }}
						size="small"
						margin="dense"
						type="date"
						variant="outlined"
						placeholder="to"
						fullWidth
						value={moment(appliedDateFilters.toDate).format('yyyy-MM-DD')}
						className={classes.inputFieldDate}
						onChange={event => {
							if (event.target.value === '') {
								setToDate(
									`${Math.round(new Date().getFullYear())}-${getFlaggedMoment(Math.ceil(new Date().getMonth()) + 1)}`
								);
							} else {
								setToDate(event.target.value);
							}
						}}
						InputLabelProps={{
							shrink: true,
						}}
						InputProps={{
							classes: {
								root: classes.dateRoot,
								focused: classes.focused,
								notchedOutline: classes.notchedOutline,
							},
						}}
					/>
				</Grid>
				<Grid item xs={2} md={2} lg={2} xl={2}>
					<CampaignStatusFilter
						esIndex={esIndex}
						searchFields={searchFields}
						tableFilters={tableFilters}
						appliedFilters={appliedFilters}
						setAppliedFilters={setAppliedFilters}
					/>
				</Grid>
				<Grid item xs={2} md={2} lg={2} xl={2}>
					<SupervisorFilter
						esIndex={esIndex}
						searchFields={searchFields}
						tableFilters={tableFilters}
						appliedFilters={appliedFilters}
						setAppliedFilters={setAppliedFilters}
					/>
				</Grid>
			</Grid>
		</div>
	);
}

const CampaignStatusFilter = ({ esIndex, tableFilters, appliedFilters, searchFields, setAppliedFilters }) => {
	const [stateApp] = useContext(AppContext);

	const [getCampaign, { data: filtersData }] = useLazyQuery(GET_ES_SIMPLE_FILTER, { fetchPolicy: 'no-cache' });

	useEffect(() => {
		const filterKey = 'status.keyword';
		getCampaign({
			variables: {
				esIndex,
				index: esIndex,
				filters: getAllFilters(),
				filterKey,
				search: { query: stateApp.contactSearchQuery, fields: searchFields },
				size: 50,
				filterAggs: {
					query: '*',
					field: filterKey,
					size: 50,
				},
				isElasticQuery: false,
			},
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [appliedFilters, searchFields, stateApp.contactSearchQuery]);

	const getAllFilters = () => {
		let rangeFilters = [];
		if (!tableFilters.find(filter => filter.type === 'range')) {
			rangeFilters = getFilters(appliedFilters);
		}
		const filters = [...rangeFilters, ...tableFilters];
		const index = filters.findIndex(f => f.field === 'status.keyword');
		if (index > -1) {
			filters.splice(index, 1);
		}
		return filters;
	};

	return (
		<Autocomplete
			size="small"
			onChange={(e, selectedValue, reason) => {
				let filters = copy(appliedFilters) ?? [];

				filters = filters.filter(filter => filter.field !== 'status.keyword');

				if (reason === 'clear' || !selectedValue?.key) return setAppliedFilters(filters);

				filters.push({ field: 'status.keyword', value: selectedValue.key });

				setAppliedFilters(filters);
			}}
			value={appliedFilters.status}
			// inputValue={search?.toString()}
			options={get(filtersData, 'getESSimpleFilter.hits', []).filter(d => d.key)}
			getOptionSelected={(option, value) => option.key === value}
			getOptionLabel={option => option?.key?.toString().replace(/^,|,$/gm, '')}
			renderInput={params => (
				<TextField
					{...params}
					variant="outlined"
					label="Campaign Status"
					placeholder=""
					// onChange={(e) => {
					//   setSearch(e.target.value);
					// }}
					style={{ backgroundColor: 'white' }}
				/>
			)}
			defaultValue={null}
			disableListWrap
			id="custom-date-dropdown"
		/>
	);
};

const SupervisorFilter = ({ esIndex, tableFilters, appliedFilters, searchFields, setAppliedFilters }) => {
	const [stateApp] = useContext(AppContext);

	const [getQualifiers, { data: filtersData }] = useLazyQuery(GET_ES_SIMPLE_FILTER, { fetchPolicy: 'no-cache' });

	useEffect(() => {
		const filterKey = 'owner.name.keyword';
		getQualifiers({
			variables: {
				esIndex,
				index: esIndex,
				filters: getAllFilters(),
				filterKey,
				search: { query: stateApp.contactSearchQuery, fields: searchFields },
				size: 50,
				filterAggs: {
					query: '*',
					field: filterKey,
					size: 50,
				},
				isElasticQuery: false,
			},
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [appliedFilters, searchFields, stateApp.contactSearchQuery]);

	const getAllFilters = () => {
		let rangeFilters = [];
		if (!tableFilters.find(filter => filter.type === 'range')) {
			rangeFilters = getFilters(appliedFilters);
		}
		const filters = [...rangeFilters, ...tableFilters];
		const index = filters.findIndex(f => f.field === 'owner.name.keyword');
		if (index > -1) {
			filters.splice(index, 1);
		}
		return filters;
	};

	return (
		<Autocomplete
			size="small"
			onChange={(e, selectedValue, reason) => {
				let filters = copy(appliedFilters) ?? [];

				filters = filters.filter(filter => filter.field !== 'owner.name.keyword');

				if (reason === 'clear' || !selectedValue?.key) return setAppliedFilters(filters);

				filters.push({ field: 'owner.name.keyword', value: selectedValue.key });

				setAppliedFilters(filters);
			}}
			value={appliedFilters.status}
			// inputValue={search?.toString()}
			options={get(filtersData, 'getESSimpleFilter.hits', [])}
			getOptionSelected={(option, value) => option.key === value}
			getOptionLabel={option => option?.key?.toString().replace(/^,|,$/gm, '')}
			renderInput={params => (
				<TextField
					{...params}
					variant="outlined"
					label="Supervisor"
					placeholder=""
					// onChange={(e) => {
					//   setSearch(e.target.value);
					// }}
					style={{ backgroundColor: 'white' }}
				/>
			)}
			defaultValue={null}
			disableListWrap
			id="custom-date-dropdown"
		/>
	);
};
