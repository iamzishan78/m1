/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';

import { Grid, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/styles';

import { useLazyQuery } from '@apollo/client';
import get from 'lodash/get';
import moment from 'moment';

import { GET_ES_SIMPLE_FILTER } from 'graphQL/useQueryESSimpleFilter';

import { CUSTOM_DATES } from 'utils/data';
import { esIndexFilterKeyMap } from 'utils/data';
import { getActivityAnalyticsFilters, handleCustomDateTypeChange } from 'utils/helper';

import { AppContext } from 'AppContext';

import { getActivityFilters } from './ActivitiesDashboard';

const useStyles = makeStyles(theme => ({
	actionBar: {
		backgroundColor: '#f7f7f7',
		width: '100%',
		minHeight: '65px',
		marginTop: '100px',
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
	fromDate,
	setFromDate,
	toDate,
	setToDate,
	minDate,
	campaigns,
	setCampaigns,
	qualifier,
	setQualifier,
	esIndex,
	searchFields,
	tableFilters,
	appliedFilters,
	setFilterToggle,
	filterToggle,
	setAppliedFilters,
	label,
}) {
	const classes = useStyles();
	const { activeModule } = useSelector(({ common }) => common);
	useEffect(() => {
		if (minDate) {
			handleDateTypeChange(CUSTOM_DATES.ALL_DATES);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [minDate]);

	const getFlaggedMoment = moment => {
		return moment >= 10 ? moment : `0${moment}`;
	};

	const handleDateTypeChange = date => {
		handleCustomDateTypeChange(date, null, CUSTOM_DATES, setFromDate, setToDate, minDate);
	};

	const [selectedFilters, setSelectedFilters] = useState({
		campaign: null,
		qualifier: null,
		audit: null,
	});

	const handleFilterChange = (filterType, value) => {
		setSelectedFilters(prevFilters => ({
			...prevFilters,
			[filterType]: value,
		}));
	};

	return (
		<div style={{ display: 'flex' }}>
			<Grid container direction="row" display="flex" alignItems="center" spacing={3} xs={12}>
				<Grid item xs={2} sm={2} md={2} lg={2} xl={2} style={{ marginTop: '2px' }}>
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
				<Grid item xs={2.4} sm={2.4} md={2.4} lg={2.4} xl={2.4}>
					<TextField
						size="small"
						margin="dense"
						type="date"
						variant="outlined"
						placeholder=""
						fullWidth
						value={moment(fromDate).format('yyyy-MM-DD')}
						className={classes.inputFieldDate}
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
						onChange={event => {
							if (event.target.value === '') {
								setFromDate(
									`${Math.round(new Date().getFullYear())}-${getFlaggedMoment(Math.ceil(new Date().getMonth()) + 1)}`
								);
							} else {
								setFromDate(event.target.value);
							}
						}}
					/>
				</Grid>
				<Grid>
					<label>to</label>
				</Grid>
				<Grid item xs={2.4} sm={2.4} md={2.4} lg={2.4} xl={2.4}>
					<TextField
						size="small"
						margin="dense"
						type="date"
						variant="outlined"
						placeholder="to"
						fullWidth
						value={moment(toDate).format('yyyy-MM-DD')}
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
				{/* Show Campaign dropdown for CRM tab only */}
				{activeModule.value === 'CRM' && (
					<Grid item xs={2} md={2} lg={2} xl={2} style={{ marginTop: '4px' }}>
						<CampaignFilter
							value={campaigns}
							setValue={setCampaigns}
							esIndex={esIndex}
							searchFields={searchFields}
							tableFilters={tableFilters}
							appliedFilters={appliedFilters}
							selectedFilters={selectedFilters}
							onCampaignChange={handleFilterChange}
						/>
					</Grid>
				)}
				{/* Show Entity dropdown for Audit Reporting tab only */}

				{activeModule.title === 'Audit Reporting' && (
					<Grid item xs={2} md={2} lg={2} xl={2} style={{ marginTop: '4px' }}>
						<EntityFilter label={'Entity Type'} />
					</Grid>
				)}
				<Grid item xs={2} md={2} lg={2} xl={2} style={{ marginTop: '4px' }}>
					<QualifierFilter
						value={qualifier}
						setValue={setQualifier}
						esIndex={esIndex}
						searchFields={searchFields}
						tableFilters={tableFilters}
						appliedFilters={appliedFilters}
						selectedFilters={selectedFilters}
						label={label}
						onQualifierChange={handleFilterChange}
						esFilterKey={esIndexFilterKeyMap[esIndex]}
					/>
				</Grid>
			</Grid>
		</div>
	);
}

const CampaignFilter = ({
	esIndex,
	value,
	setValue,
	tableFilters,
	appliedFilters,
	searchFields,
	selectedFilters,
	onCampaignChange,
}) => {
	const [stateApp] = useContext(AppContext);
	const [search, setSearch] = useState('');

	const [getCampaign, { data: filtersData }] = useLazyQuery(GET_ES_SIMPLE_FILTER, { fetchPolicy: 'no-cache' });

	const getAllFilters = () => {
		let rangeFilters = [];
		if (!tableFilters.find(filter => filter.type === 'range')) {
			rangeFilters = getActivityAnalyticsFilters(appliedFilters);
			if (esIndex === 'activities_flat') {
				rangeFilters = getActivityFilters(appliedFilters);
			}
		}
		const filters = [...rangeFilters, ...tableFilters];
		const index = filters.findIndex(f => f.field === 'contact.campaigns');
		if (index > -1) {
			filters.splice(index, 1);
		}
		return filters;
	};

	useEffect(() => {
		const filterKey = 'contact.campaigns';
		getCampaign({
			variables: {
				esIndex,
				index: esIndex,
				filters: getAllFilters(),
				filterKey,
				search: { query: stateApp.activitySearchQuery, fields: searchFields },
				size: 50,
				filterAggs: {
					query: search,
					field: filterKey,
					size: 50,
					fieldType: 'array',
					searchFields: ['contact.campaigns.name'],
				},
			},
		});
		onCampaignChange('campaign', search);
	}, [search, selectedFilters.qualifier, tableFilters, appliedFilters, stateApp.landAnalyticsSearchQuery]);

	return (
		<Autocomplete
			size="small"
			onChange={(e, selectedValue, reason) => {
				if (reason === 'clear' || !selectedValue) {
					setSearch('');
					setValue('');
				} else {
					setSearch(selectedValue.name);
					setValue(selectedValue);
				}
			}}
			value={value}
			inputValue={search?.toString()}
			options={get(filtersData, 'getESSimpleFilter.hits', [])
				.map(d => d.key)
				.filter(Boolean)}
			getOptionLabel={op => op?.name || ''}
			getOptionSelected={(op, value) => op?.name === value?.name || ''}
			renderInput={params => (
				<TextField
					{...params}
					variant="outlined"
					label="Campaign Name"
					placeholder=""
					onChange={e => {
						setSearch(e.target.value);
					}}
					style={{ backgroundColor: 'white' }}
				/>
			)}
			defaultValue={null}
			disableListWrap
			id="custom-date-dropdown"
		/>
	);
};

const QualifierFilter = ({
	esIndex,
	value,
	setValue,
	tableFilters,
	appliedFilters,
	searchFields,
	onQualifierChange,
	selectedFilters,
	label,
	esFilterKey,
}) => {
	const [stateApp] = useContext(AppContext);
	const [search, setSearch] = useState('');

	const [getQualifiers, { data: filtersData }] = useLazyQuery(GET_ES_SIMPLE_FILTER, { fetchPolicy: 'no-cache' });

	const getAllFilters = () => {
		let rangeFilters = [];
		if (!tableFilters.find(filter => filter.type === 'range')) {
			if (esIndex === 'contacts_flat') {
				appliedFilters.filter = 'audit';
			}
			rangeFilters = getActivityAnalyticsFilters(appliedFilters);
			if (esIndex === 'activities_flat') {
				rangeFilters = getActivityFilters(appliedFilters);
			}
		}
		const filters = [...rangeFilters, ...tableFilters];

		const index = filters.findIndex(f => f.field === esFilterKey);
		if (index > -1) {
			filters.splice(index, 1);
		}
		return filters;
	};

	useEffect(() => {
		getQualifiers({
			variables: {
				esIndex,
				index: esIndex,
				filters: getAllFilters(),
				filterKey: esFilterKey,
				search: { query: stateApp.activitySearchQuery || stateApp.landAnalyticsSearchQuery, fields: searchFields },
				size: 50,
				filterAggs: {
					query: search,
					field: esFilterKey,
					size: 50,
				},
			},
		});

		onQualifierChange(esIndex === 'contacts_flat' ? 'audit' : 'qualifier', search);
	}, [
		search,
		esIndex === 'contacts_flat' ? selectedFilters.audit : selectedFilters.campaign,
		tableFilters,
		appliedFilters,
		stateApp.landAnalyticsSearchQuery,
	]);

	return (
		<Autocomplete
			size="small"
			onChange={(e, selectedValue, reason) => {
				if (reason === 'clear' || !selectedValue?.key) {
					setSearch('');
					setValue('');
				} else {
					setSearch(selectedValue.key);
					setValue(selectedValue.key);
				}
			}}
			value={value}
			inputValue={search?.toString()}
			options={get(filtersData, 'getESSimpleFilter.hits', [])}
			getOptionSelected={(option, value) => option.key === value}
			getOptionLabel={option => option?.key?.toString().replace(/^,|,$/gm, '') || ''}
			renderInput={params => (
				<TextField
					{...params}
					variant="outlined"
					//label="Activity Owner"
					label={label}
					placeholder=""
					onChange={e => {
						setSearch(e.target.value);
					}}
					style={{ backgroundColor: 'white' }}
				/>
			)}
			defaultValue={null}
			disableListWrap
			id="custom-date-dropdown"
		/>
	);
};

const EntityFilter = ({ label }) => {
	const options = ['Contacts'];

	return (
		<Autocomplete
			size="small"
			options={options}
			defaultValue="Contacts"
			renderInput={params => (
				<TextField
					{...params}
					variant="outlined"
					label={label}
					id="custom-entity-dropdown"
					style={{ backgroundColor: 'white' }}
				/>
			)}
		/>
	);
};
